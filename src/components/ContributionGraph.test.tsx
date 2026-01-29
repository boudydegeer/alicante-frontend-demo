import { render, screen } from '@testing-library/react'
import { ContributionGraph } from './ContributionGraph'

const mockContributions = [
  { date: '2024-01-01', count: 0 },
  { date: '2024-01-02', count: 5 },
  { date: '2024-01-03', count: 10 },
]

describe('ContributionGraph', () => {
  it('renders contribution squares', () => {
    render(<ContributionGraph contributions={mockContributions} isLoading={false} />)
    const squares = screen.getAllByTestId(/contribution-day/)
    expect(squares.length).toBeGreaterThan(0)
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<ContributionGraph contributions={[]} isLoading={true} />)
    expect(screen.getByTestId('contribution-skeleton')).toBeInTheDocument()
  })

  it('applies correct color intensity based on count', () => {
    render(<ContributionGraph contributions={mockContributions} isLoading={false} />)
    const emptyDay = screen.getByTestId('contribution-day-2024-01-01')
    expect(emptyDay).toHaveStyle({ backgroundColor: '#2d2d3a' })
  })
})
