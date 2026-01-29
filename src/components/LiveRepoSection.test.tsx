import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LiveRepoSection } from './LiveRepoSection'

const mockData = {
  exists: true,
  repoCreatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  lastCommitAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
  elapsedTime: '29:00',
  totalAdditions: 500,
  fileCount: 12,
  lastCommit: { message: 'feat: add Header component', date: new Date().toISOString() },
  commitCount: 5,
}

describe('LiveRepoSection', () => {
  it('renders live indicator', () => {
    render(<LiveRepoSection data={mockData} isLoading={false} onOpenModal={() => {}} />)
    expect(screen.getByText(/en vivo/i)).toBeInTheDocument()
  })

  it('shows commit stats', () => {
    render(<LiveRepoSection data={mockData} isLoading={false} onOpenModal={() => {}} />)
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onOpenModal when clicked', async () => {
    const user = userEvent.setup()
    const mockOnOpen = vi.fn()
    render(<LiveRepoSection data={mockData} isLoading={false} onOpenModal={mockOnOpen} />)
    await user.click(screen.getByTestId('live-repo-section'))
    expect(mockOnOpen).toHaveBeenCalled()
  })

  it('shows waiting message when repo does not exist', () => {
    render(
      <LiveRepoSection
        data={{ ...mockData, exists: false }}
        isLoading={false}
        onOpenModal={() => {}}
      />
    )
    expect(screen.getByText(/esperando primer commit/i)).toBeInTheDocument()
  })
})
