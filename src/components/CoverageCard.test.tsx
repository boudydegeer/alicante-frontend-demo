import { render, screen } from '@testing-library/react'
import { CoverageCard } from './CoverageCard'

const mockCoverage = {
  total: {
    statements: { pct: 85.5 },
    branches: { pct: 72.3 },
    functions: { pct: 90.1 },
    lines: { pct: 84.2 },
  },
}

describe('CoverageCard', () => {
  it('renders all 4 coverage metrics', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)
    expect(screen.getByText(/statements/i)).toBeInTheDocument()
    expect(screen.getByText(/branches/i)).toBeInTheDocument()
    expect(screen.getByText(/functions/i)).toBeInTheDocument()
    expect(screen.getByText(/lines/i)).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<CoverageCard coverage={null} isLoading={true} />)
    expect(screen.getByTestId('coverage-skeleton')).toBeInTheDocument()
  })

  it('displays correct percentages', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)
    expect(screen.getByText('85.5%')).toBeInTheDocument()
    expect(screen.getByText('72.3%')).toBeInTheDocument()
    expect(screen.getByText('90.1%')).toBeInTheDocument()
    expect(screen.getByText('84.2%')).toBeInTheDocument()
  })

  it('applies green color for coverage > 80%', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)
    const statementsBar = screen.getByTestId('coverage-bar-statements')
    expect(statementsBar).toHaveStyle({ backgroundColor: '#4ecdc4' })
  })

  it('applies yellow color for coverage > 60% and <= 80%', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)
    const branchesBar = screen.getByTestId('coverage-bar-branches')
    expect(branchesBar).toHaveStyle({ backgroundColor: '#f1e05a' })
  })

  it('applies red color for coverage <= 60%', () => {
    const lowCoverage = {
      total: {
        statements: { pct: 45 },
        branches: { pct: 50 },
        functions: { pct: 55 },
        lines: { pct: 40 },
      },
    }
    render(<CoverageCard coverage={lowCoverage} isLoading={false} />)
    const statementsBar = screen.getByTestId('coverage-bar-statements')
    expect(statementsBar).toHaveStyle({ backgroundColor: '#ff6b6b' })
  })

  it('shows title with emoji', () => {
    render(<CoverageCard coverage={mockCoverage} isLoading={false} />)
    expect(screen.getByText(/test coverage/i)).toBeInTheDocument()
  })
})
