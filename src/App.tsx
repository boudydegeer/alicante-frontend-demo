import { useState } from 'react'
import { motion } from 'framer-motion'
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  const { user, isLoading: userLoading } = useGitHubUser()
  const { topRepos, totalStars, languages, isLoading: reposLoading } = useGitHubRepos()
  const { events, contributions, commitsToday, commitsThisYear, isLoading: eventsLoading } = useGitHubEvents()
  const { data: liveData, isLoading: liveLoading } = useLiveRepo()
  const { coverage, isLoading: coverageLoading } = useCoverage()

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Row 1: Header */}
        <motion.div variants={fadeInUp}>
          <Header
            user={user}
            totalStars={totalStars}
            isLoading={userLoading || reposLoading}
          />
        </motion.div>

        {/* Row 2: Stats Cards */}
        <motion.div variants={fadeInUp}>
          <StatsCards
            commitsThisYear={commitsThisYear}
            totalStars={totalStars}
            publicRepos={user?.public_repos || 0}
            commitsToday={commitsToday}
            isLoading={eventsLoading || userLoading}
          />
        </motion.div>

        {/* Row 3: Contribution Graph */}
        <motion.div variants={fadeInUp}>
          <ContributionGraph
            contributions={contributions}
            isLoading={eventsLoading}
          />
        </motion.div>

        {/* Row 4: Live Repo + Coverage */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LiveRepoSection
            data={liveData}
            isLoading={liveLoading}
            onOpenModal={() => setModalOpen(true)}
          />
          <CoverageCard
            coverage={coverage}
            isLoading={coverageLoading}
          />
        </motion.div>

        {/* Row 5: Languages + Activity */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LanguagesChart
            languages={languages}
            isLoading={reposLoading}
          />
          <ActivityFeed
            events={events}
            isLoading={eventsLoading}
          />
        </motion.div>

        {/* Row 6: Featured Repos */}
        <motion.div variants={fadeInUp}>
          <FeaturedRepos
            repos={topRepos}
            isLoading={reposLoading}
          />
        </motion.div>
      </motion.div>

      {/* Modal */}
      <PromptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

export default App
