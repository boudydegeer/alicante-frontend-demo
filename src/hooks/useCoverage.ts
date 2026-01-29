import { useState, useEffect } from 'react'

interface CoverageData {
  total: {
    statements: { pct: number }
    branches: { pct: number }
    functions: { pct: number }
    lines: { pct: number }
  }
}

const COVERAGE_URL = 'https://raw.githubusercontent.com/boudydegeer/alicante-frontend-demo/main/coverage/coverage-summary.json'

export function useCoverage() {
  const [coverage, setCoverage] = useState<CoverageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        const response = await fetch(COVERAGE_URL)
        if (!response.ok) {
          throw new Error('Coverage data not found')
        }
        const data = await response.json()
        setCoverage(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoverage()
    const interval = setInterval(fetchCoverage, 30000)
    return () => clearInterval(interval)
  }, [])

  return { coverage, isLoading, error }
}
