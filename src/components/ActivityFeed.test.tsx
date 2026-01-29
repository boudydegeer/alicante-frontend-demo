import { render, screen } from '@testing-library/react'
import { ActivityFeed } from './ActivityFeed'

const mockEvents = [
  {
    id: '1',
    type: 'PushEvent',
    repo: { name: 'user/repo1' },
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    payload: { commits: [{ message: 'fix: bug' }] },
  },
  {
    id: '2',
    type: 'PullRequestEvent',
    repo: { name: 'user/repo2' },
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    payload: { action: 'opened' },
  },
  {
    id: '3',
    type: 'WatchEvent',
    repo: { name: 'user/repo3' },
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    payload: {},
  },
]

describe('ActivityFeed', () => {
  it('renders events', () => {
    render(<ActivityFeed events={mockEvents} isLoading={false} />)
    expect(screen.getByText(/repo1/)).toBeInTheDocument()
    expect(screen.getByText(/repo2/)).toBeInTheDocument()
    expect(screen.getByText(/repo3/)).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<ActivityFeed events={[]} isLoading={true} />)
    expect(screen.getByTestId('activity-skeleton')).toBeInTheDocument()
  })

  it('displays relative time', () => {
    render(<ActivityFeed events={mockEvents} isLoading={false} />)
    expect(screen.getByText(/5m ago/i)).toBeInTheDocument()
    expect(screen.getByText(/30m ago/i)).toBeInTheDocument()
    expect(screen.getByText(/1h ago/i)).toBeInTheDocument()
  })

  it('shows event type icons', () => {
    render(<ActivityFeed events={mockEvents} isLoading={false} />)
    expect(screen.getByTestId('event-icon-push')).toBeInTheDocument()
    expect(screen.getByTestId('event-icon-pr')).toBeInTheDocument()
    expect(screen.getByTestId('event-icon-star')).toBeInTheDocument()
  })

  it('shows title', () => {
    render(<ActivityFeed events={mockEvents} isLoading={false} />)
    expect(screen.getByText(/activity/i)).toBeInTheDocument()
  })

  it('limits to 8 events', () => {
    const manyEvents = Array.from({ length: 15 }, (_, i) => ({
      id: String(i),
      type: 'PushEvent',
      repo: { name: `user/repo${i}` },
      created_at: new Date().toISOString(),
      payload: { commits: [{ message: 'commit' }] },
    }))
    render(<ActivityFeed events={manyEvents} isLoading={false} />)
    const items = screen.getAllByTestId(/event-item/)
    expect(items.length).toBe(8)
  })
})
