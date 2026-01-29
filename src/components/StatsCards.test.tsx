import { render, screen } from '@testing-library/react'
import { StatsCards } from './StatsCards'

describe('StatsCards', () => {
  it('renders all 4 stat cards', () => {
    render(
      <StatsCards
        commitsThisYear={500}
        totalStars={250}
        publicRepos={50}
        commitsToday={5}
        isLoading={false}
      />
    )
    expect(screen.getByText(/commits this year/i)).toBeInTheDocument()
    expect(screen.getByText(/total stars/i)).toBeInTheDocument()
    expect(screen.getByText(/public repos/i)).toBeInTheDocument()
    expect(screen.getByText(/commits today/i)).toBeInTheDocument()
  })

  it('shows loading skeletons when isLoading is true', () => {
    render(
      <StatsCards
        commitsThisYear={0}
        totalStars={0}
        publicRepos={0}
        commitsToday={0}
        isLoading={true}
      />
    )
    expect(screen.getByTestId('stats-skeleton')).toBeInTheDocument()
  })
})
