import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Language {
  name: string
  percentage: number
  color: string
}

interface LanguagesChartProps {
  languages: Language[]
  isLoading: boolean
}

export function LanguagesChart({ languages, isLoading }: LanguagesChartProps) {
  if (isLoading) {
    return (
      <Card data-testid="languages-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const topLanguages = languages.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topLanguages}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: '#ffffff', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {topLanguages.map((lang, index) => (
                  <Cell key={index} fill={lang.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {topLanguages.map((lang) => (
            <span
              key={lang.name}
              className="text-xs text-muted-foreground flex items-center gap-1"
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: lang.color }}
              />
              <span>{lang.name}</span>
              <span>{lang.percentage}%</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
