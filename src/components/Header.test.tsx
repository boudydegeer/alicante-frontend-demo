import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'

const mockUser = {
  login: 'boudydegeer',
  name: 'Boudy de Geer',
  avatar_url: 'https://example.com/avatar.png',
  bio: 'Software Developer',
  followers: 100,
  public_repos: 50,
}

describe('Header', () => {
  it('renders user name and bio', () => {
    render(<Header user={mockUser} totalStars={250} isLoading={false} />)
    expect(screen.getByText('Boudy de Geer')).toBeInTheDocument()
    expect(screen.getByText('Software Developer')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<Header user={null} totalStars={0} isLoading={true} />)
    expect(screen.getByTestId('header-skeleton')).toBeInTheDocument()
  })

  it('displays stats correctly', () => {
    render(<Header user={mockUser} totalStars={250} isLoading={false} />)
    expect(screen.getByText(/250 stars/)).toBeInTheDocument()
    expect(screen.getByText(/100 followers/)).toBeInTheDocument()
    expect(screen.getByText(/50 repos/)).toBeInTheDocument()
  })

  it('triggers confetti on avatar click', async () => {
    const user = userEvent.setup()
    render(<Header user={mockUser} totalStars={250} isLoading={false} />)
    const avatar = screen.getByTestId('avatar-button')
    await user.click(avatar)
    expect(avatar).toBeInTheDocument()
  })
})
