import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface CoverageData {
  total: {
    statements: { pct: number }
    branches: { pct: number }
    functions: { pct: number }
    lines: { pct: number }
  }
}

interface CoverageCardProps {
  coverage: CoverageData | null
  isLoading: boolean
}

function getColor(pct: number): string {
  if (pct > 80) return '#4ecdc4'
  if (pct > 60) return '#f1e05a'
  return '#ff6b6b'
}

function getColorClass(pct: number): string {
  if (pct > 80) return 'text-primary'
  if (pct > 60) return 'text-yellow-400'
  return 'text-destructive'
}

export function CoverageCard({ coverage, isLoading }: CoverageCardProps) {
  if (isLoading || !coverage) {
    return (
      <Card data-testid="coverage-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const metrics = [
    { key: 'statements', label: 'Statements', pct: coverage.total.statements.pct },
    { key: 'branches', label: 'Branches', pct: coverage.total.branches.pct },
    { key: 'functions', label: 'Functions', pct: coverage.total.functions.pct },
    { key: 'lines', label: 'Lines', pct: coverage.total.lines.pct },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.key}>
              <div className={`text-2xl font-bold ${getColorClass(metric.pct)}`}>
                {metric.pct}%
              </div>
              <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
              <div
                data-testid={`coverage-bar-${metric.key}`}
                className="h-2 rounded overflow-hidden"
                style={{ backgroundColor: getColor(metric.pct) }}
              >
                <div
                  className="h-full bg-secondary"
                  style={{ width: `${100 - metric.pct}%`, marginLeft: 'auto' }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
