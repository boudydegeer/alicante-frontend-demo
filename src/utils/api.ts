const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined

const headers: HeadersInit = {
  'Accept': 'application/vnd.github.v3+json',
}
if (GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
}

export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  followers: number
  public_repos: number
}

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
}

export interface GitHubEvent {
  id: string
  type: string
  repo: { name: string }
  created_at: string
  payload: {
    action?: string
    commits?: { message: string }[]
  }
}

export interface ContributionDay {
  date: string
  count: number
}

export interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: { date: string }
  }
  stats?: {
    additions: number
    deletions: number
  }
}

const GITHUB_API_BASE = 'https://api.github.com'

export async function fetchUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, { headers })
  if (!response.ok) throw new Error('Failed to fetch user')
  return response.json()
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=stars`,
    { headers }
  )
  if (!response.ok) throw new Error('Failed to fetch repos')
  return response.json()
}

export async function fetchEvents(username: string): Promise<GitHubEvent[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/events?per_page=50`,
    { headers }
  )
  if (!response.ok) throw new Error('Failed to fetch events')
  return response.json()
}

export async function fetchRepoInfo(owner: string, repo: string) {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers })
  if (!response.ok) return null
  return response.json()
}

export async function fetchRepoCommits(owner: string, repo: string): Promise<GitHubCommit[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=100`,
    { headers }
  )
  if (!response.ok) return []
  return response.json()
}

export async function fetchContributions(username: string): Promise<ContributionDay[]> {
  if (!GITHUB_TOKEN) {
    return generateMockContributions()
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
    })

    if (!response.ok) {
      return generateMockContributions()
    }

    const data = await response.json()
    const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks || []

    return weeks.flatMap((week: { contributionDays: { date: string; contributionCount: number }[] }) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      }))
    )
  } catch {
    return generateMockContributions()
  }
}

function generateMockContributions(): ContributionDay[] {
  const contributions: ContributionDay[] = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    contributions.push({
      date: date.toISOString().split('T')[0],
      count: Math.random() > 0.3 ? Math.floor(Math.random() * 12) : 0,
    })
  }

  return contributions
}
