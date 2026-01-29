import { useState, useEffect } from 'react'
import { fetchUser, type GitHubUser } from '../utils/api'
import { GITHUB_USERNAME } from '../utils/constants'

export function useGitHubUser() {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchUser(GITHUB_USERNAME)
      .then(setUser)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return { user, isLoading, error }
}
