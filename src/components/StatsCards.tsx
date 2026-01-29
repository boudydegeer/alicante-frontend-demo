import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatsCardsProps {
  commitsThisYear: number
  totalStars: number
  publicRepos: number
  commitsToday: number
  isLoading: boolean
}

export function StatsCards({
  commitsThisYear,
  totalStars,
  publicRepos,
  commitsToday,
  isLoading,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div data-testid="stats-skeleton" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    { emoji: '📊', value: commitsThisYear, label: 'Commits this year' },
    { emoji: '⭐', value: totalStars, label: 'Total stars' },
    { emoji: '📁', value: publicRepos, label: 'Public repos' },
    { emoji: '🔥', value: commitsToday, label: 'Commits today' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4 text-center">
            <span className="text-2xl">{stat.emoji}</span>
            <div className="text-3xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
