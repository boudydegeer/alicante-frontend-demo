import { useState, useEffect, useCallback } from 'react'
import { fetchRepoInfo, fetchRepoCommits } from '../utils/api'
import { GITHUB_USERNAME, LIVE_REPO_NAME } from '../utils/constants'

interface LiveRepoData {
  exists: boolean
  repoCreatedAt: string | null
  lastCommitAt: string | null
  elapsedTime: string
  totalAdditions: number
  fileCount: number
  lastCommit: { message: string; date: string } | null
  commitCount: number
}

function formatElapsedTime(start: Date, end: Date): string {
  const diff = end.getTime() - start.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

export function useLiveRepo() {
  const [data, setData] = useState<LiveRepoData>({
    exists: false,
    repoCreatedAt: null,
    lastCommitAt: null,
    elapsedTime: '00:00',
    totalAdditions: 0,
    fileCount: 0,
    lastCommit: null,
    commitCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const repoInfo = await fetchRepoInfo(GITHUB_USERNAME, LIVE_REPO_NAME)

      if (!repoInfo) {
        setData(prev => ({ ...prev, exists: false }))
        return
      }

      const commits = await fetchRepoCommits(GITHUB_USERNAME, LIVE_REPO_NAME)

      const repoCreatedAt = new Date(repoInfo.created_at)
      const lastCommit = commits[0]
      const lastCommitAt = lastCommit ? new Date(lastCommit.commit.author.date) : repoCreatedAt

      // Estimate additions (GitHub doesn't provide this in list endpoint)
      const totalAdditions = commits.length * 50 // rough estimate

      setData({
        exists: true,
        repoCreatedAt: repoInfo.created_at,
        lastCommitAt: lastCommit?.commit.author.date || null,
        elapsedTime: formatElapsedTime(repoCreatedAt, lastCommitAt),
        totalAdditions,
        fileCount: repoInfo.size ? Math.ceil(repoInfo.size / 10) : commits.length,
        lastCommit: lastCommit ? {
          message: lastCommit.commit.message.split('\n')[0],
          date: lastCommit.commit.author.date,
        } : null,
        commitCount: commits.length,
      })
    } catch (err) {
      console.error('Error fetching live repo:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  return { data, isLoading, refetch: fetchData }
}
