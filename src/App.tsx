import { useState } from 'react'
import { Header } from './components/Header'
import { StatsCards } from './components/StatsCards'
import { ContributionGraph } from './components/ContributionGraph'
import { LiveRepoSection } from './components/LiveRepoSection'
import { CoverageCard } from './components/CoverageCard'
import { LanguagesChart } from './components/LanguagesChart'
import { ActivityFeed } from './components/ActivityFeed'
import { FeaturedRepos } from './components/FeaturedRepos'
import { PromptModal } from './components/PromptModal'
import { useGitHubUser } from './hooks/useGitHubUser'
import { useGitHubRepos } from './hooks/useGitHubRepos'
import { useGitHubEvents } from './hooks/useGitHubEvents'
import { useLiveRepo } from './hooks/useLiveRepo'
import { useCoverage } from './hooks/useCoverage'

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  const { user, isLoading: userLoading } = useGitHubUser()
  const { topRepos, totalStars, languages, isLoading: reposLoading } = useGitHubRepos()
  const { events, contributions, commitsToday, commitsThisYear, isLoading: eventsLoading } = useGitHubEvents()
  const { data: liveData, isLoading: liveLoading } = useLiveRepo()
  const { coverage, isLoading: coverageLoading } = useCoverage()

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Row 1: Header */}
        <Header
          user={user}
          totalStars={totalStars}
          isLoading={userLoading || reposLoading}
        />

        {/* Row 2: Stats Cards */}
        <StatsCards
          commitsThisYear={commitsThisYear}
          totalStars={totalStars}
          publicRepos={user?.public_repos || 0}
          commitsToday={commitsToday}
          isLoading={eventsLoading || userLoading}
        />

        {/* Row 3: Contribution Graph */}
        <ContributionGraph
          contributions={contributions}
          isLoading={eventsLoading}
        />

        {/* Row 4: Live Repo + Coverage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LiveRepoSection
            data={liveData}
            isLoading={liveLoading}
            onOpenModal={() => setModalOpen(true)}
          />
          <CoverageCard
            coverage={coverage}
            isLoading={coverageLoading}
          />
        </div>

        {/* Row 5: Languages + Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LanguagesChart
            languages={languages}
            isLoading={reposLoading}
          />
          <ActivityFeed
            events={events}
            isLoading={eventsLoading}
          />
        </div>

        {/* Row 6: Featured Repos */}
        <FeaturedRepos
          repos={topRepos}
          isLoading={reposLoading}
        />
      </div>

      {/* Modal */}
      <PromptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

export default App
