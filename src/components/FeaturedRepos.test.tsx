import { render, screen } from '@testing-library/react'
import { FeaturedRepos } from './FeaturedRepos'

const mockRepos = [
  {
    id: 1,
    name: 'awesome-project',
    description: 'A really awesome project that does amazing things',
    html_url: 'https://github.com/user/awesome-project',
    stargazers_count: 150,
    forks_count: 30,
    language: 'TypeScript',
  },
  {
    id: 2,
    name: 'cool-lib',
    description: 'A cool library',
    html_url: 'https://github.com/user/cool-lib',
    stargazers_count: 100,
    forks_count: 20,
    language: 'JavaScript',
  },
  {
    id: 3,
    name: 'my-app',
    description: null,
    html_url: 'https://github.com/user/my-app',
    stargazers_count: 50,
    forks_count: 10,
    language: 'Python',
  },
]

describe('FeaturedRepos', () => {
  it('renders top 3 repos', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)
    expect(screen.getByText('awesome-project')).toBeInTheDocument()
    expect(screen.getByText('cool-lib')).toBeInTheDocument()
    expect(screen.getByText('my-app')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    render(<FeaturedRepos repos={[]} isLoading={true} />)
    expect(screen.getByTestId('repos-skeleton')).toBeInTheDocument()
  })

  it('displays star counts', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)
    expect(screen.getByText(/150/)).toBeInTheDocument()
    expect(screen.getByText(/100/)).toBeInTheDocument()
  })

  it('displays fork counts', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)
    expect(screen.getByText(/30/)).toBeInTheDocument()
    expect(screen.getByText(/20/)).toBeInTheDocument()
  })

  it('shows language with color', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('truncates long descriptions', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)
    const description = screen.getByText(/A really awesome project/)
    expect(description).toHaveClass('line-clamp-2')
  })

  it('shows title', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)
    expect(screen.getByText(/featured repos/i)).toBeInTheDocument()
  })

  it('repo cards are clickable links', () => {
    render(<FeaturedRepos repos={mockRepos} isLoading={false} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', 'https://github.com/user/awesome-project')
    expect(links[0]).toHaveAttribute('target', '_blank')
  })
})
