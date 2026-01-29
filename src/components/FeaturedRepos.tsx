import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
}

interface FeaturedReposProps {
  repos: GitHubRepo[]
  isLoading: boolean
}

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
  default: '#8b949e',
}

export function FeaturedRepos({ repos, isLoading }: FeaturedReposProps) {
  if (isLoading) {
    return (
      <Card data-testid="repos-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-secondary rounded">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const topRepos = repos.slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Repos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {topRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-secondary rounded hover:bg-secondary/80 transition-colors"
            >
              <h4 className="font-semibold text-primary truncate">{repo.name}</h4>
              {repo.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Badge variant="outline" className="gap-1">
                  <span>⭐</span>
                  <span>{repo.stargazers_count}</span>
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <span>🍴</span>
                  <span>{repo.forks_count}</span>
                </Badge>
                {repo.language && (
                  <Badge
                    variant="outline"
                    className="gap-1"
                    style={{ borderColor: LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.default }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.default }}
                    />
                    <span>{repo.language}</span>
                  </Badge>
                )}
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
