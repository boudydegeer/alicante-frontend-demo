import { useState, useEffect, useMemo } from 'react'
import { fetchRepos, type GitHubRepo } from '../utils/api'
import { GITHUB_USERNAME } from '../utils/constants'

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Vue: '#41b883',
  Shell: '#89e051',
}

export function useGitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchRepos(GITHUB_USERNAME)
      .then(setRepos)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  const topRepos = useMemo(() =>
    [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3),
    [repos]
  )

  const totalStars = useMemo(() =>
    repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    [repos]
  )

  const languages = useMemo(() => {
    const langCount: Record<string, number> = {}
    repos.forEach(repo => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1
      }
    })

    const total = Object.values(langCount).reduce((a, b) => a + b, 0)
    return Object.entries(langCount)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / total) * 100),
        color: LANGUAGE_COLORS[name] || '#8b949e',
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }, [repos])

  return { repos, topRepos, totalStars, languages, isLoading, error }
}
