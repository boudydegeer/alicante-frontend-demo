import { useState, useEffect, useMemo } from 'react'
import { fetchEvents, fetchContributions, type GitHubEvent, type ContributionDay } from '../utils/api'
import { GITHUB_USERNAME } from '../utils/constants'

export function useGitHubEvents() {
  const [events, setEvents] = useState<GitHubEvent[]>([])
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    Promise.all([
      fetchEvents(GITHUB_USERNAME),
      fetchContributions(GITHUB_USERNAME),
    ])
      .then(([eventsData, contribData]) => {
        setEvents(eventsData)
        setContributions(contribData)
      })
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  const commitsToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return events.filter(
      e => e.type === 'PushEvent' && e.created_at.startsWith(today)
    ).length
  }, [events])

  const commitsThisYear = useMemo(() =>
    contributions.reduce((sum, day) => sum + day.count, 0),
    [contributions]
  )

  return { events, contributions, commitsToday, commitsThisYear, isLoading, error }
}
