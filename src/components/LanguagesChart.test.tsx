import { render, screen } from '@testing-library/react'
import { LanguagesChart } from './LanguagesChart'

const mockLanguages = [
  { name: 'TypeScript', percentage: 45, color: '#3178c6' },
  { name: 'JavaScript', percentage: 30, color: '#f1e05a' },
  { name: 'Python', percentage: 15, color: '#3572A5' },
  { name: 'CSS', percentage: 7, color: '#563d7c' },
  { name: 'HTML', percentage: 3, color: '#e34c26' },
]

describe('LanguagesChart', () => {
  it('renders all languages', () => {
    render(<LanguagesChart languages={mockLanguages} isLoading={false} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<LanguagesChart languages={[]} isLoading={true} />)
    expect(screen.getByTestId('languages-skeleton')).toBeInTheDocument()
  })

  it('displays percentages', () => {
    render(<LanguagesChart languages={mockLanguages} isLoading={false} />)
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('renders chart title', () => {
    render(<LanguagesChart languages={mockLanguages} isLoading={false} />)
    expect(screen.getByText(/languages/i)).toBeInTheDocument()
  })

  it('limits to top 5 languages', () => {
    const manyLanguages = [
      ...mockLanguages,
      { name: 'Go', percentage: 2, color: '#00ADD8' },
      { name: 'Rust', percentage: 1, color: '#DEA584' },
    ]
    render(<LanguagesChart languages={manyLanguages} isLoading={false} />)
    expect(screen.queryByText('Go')).not.toBeInTheDocument()
    expect(screen.queryByText('Rust')).not.toBeInTheDocument()
  })
})
