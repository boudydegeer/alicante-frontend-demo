import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders dashboard components', () => {
    render(<App />)
    // The app should render the main layout with loading skeletons
    expect(screen.getByTestId('header-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('contribution-skeleton')).toBeInTheDocument()
    expect(screen.getByTestId('coverage-skeleton')).toBeInTheDocument()
  })
})
