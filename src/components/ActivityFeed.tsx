import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface GitHubEvent {
  id: string
  type: string
  repo: { name: string }
  created_at: string
  payload: {
    action?: string
    commits?: { message: string }[]
  }
}

interface ActivityFeedProps {
  events: GitHubEvent[]
  isLoading: boolean
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function getEventIcon(type: string): { icon: string; testId: string } {
  switch (type) {
    case 'PushEvent':
      return { icon: '📝', testId: 'event-icon-push' }
    case 'PullRequestEvent':
      return { icon: '🔀', testId: 'event-icon-pr' }
    case 'WatchEvent':
      return { icon: '⭐', testId: 'event-icon-star' }
    case 'ForkEvent':
      return { icon: '🍴', testId: 'event-icon-fork' }
    case 'CreateEvent':
      return { icon: '➕', testId: 'event-icon-create' }
    case 'IssuesEvent':
      return { icon: '🐛', testId: 'event-icon-issue' }
    default:
      return { icon: '📌', testId: 'event-icon-default' }
  }
}

function getEventDescription(event: GitHubEvent): string {
  const repoName = event.repo.name.split('/')[1]
  switch (event.type) {
    case 'PushEvent':
      return `pushed to ${repoName}`
    case 'PullRequestEvent':
      return `${event.payload.action} PR in ${repoName}`
    case 'WatchEvent':
      return `starred ${repoName}`
    case 'ForkEvent':
      return `forked ${repoName}`
    case 'CreateEvent':
      return `created ${repoName}`
    case 'IssuesEvent':
      return `${event.payload.action} issue in ${repoName}`
    default:
      return `activity in ${repoName}`
  }
}

export function ActivityFeed({ events, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card data-testid="activity-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayEvents = events.slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {displayEvents.map((event) => {
            const { icon, testId } = getEventIcon(event.type)
            return (
              <div
                key={event.id}
                data-testid={`event-item-${event.id}`}
                className="flex items-start gap-2 text-sm"
              >
                <span data-testid={testId}>{icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-foreground/80">{getEventDescription(event)}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getRelativeTime(event.created_at)}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
