import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ContributionDay {
  date: string
  count: number
}

interface ContributionGraphProps {
  contributions: ContributionDay[]
  isLoading: boolean
}

const COLORS = ['#2d2d3a', '#0e4d47', '#1a7a70', '#32a89e', '#4ecdc4']

function getColor(count: number): string {
  if (count === 0) return COLORS[0]
  if (count <= 2) return COLORS[1]
  if (count <= 5) return COLORS[2]
  if (count <= 10) return COLORS[3]
  return COLORS[4]
}

export function ContributionGraph({ contributions, isLoading }: ContributionGraphProps) {
  if (isLoading) {
    return (
      <Card data-testid="contribution-skeleton">
        <CardContent className="p-4">
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  const weeks: ContributionDay[][] = []
  let currentWeek: ContributionDay[] = []

  contributions.forEach((day, i) => {
    const date = new Date(day.date)
    if (date.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(day)
    if (i === contributions.length - 1) {
      weeks.push(currentWeek)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}
        >
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  data-testid={`contribution-day-${day.date}`}
                  className="aspect-square w-full rounded-sm"
                  style={{ backgroundColor: getColor(day.count) }}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
