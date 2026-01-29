import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptModal } from './PromptModal'

describe('PromptModal', () => {
  it('renders when isOpen is true', () => {
    render(<PromptModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByRole('heading', { name: /El Prompt/i })).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<PromptModal isOpen={false} onClose={() => {}} />)
    expect(screen.queryByRole('heading', { name: /El Prompt/i })).not.toBeInTheDocument()
  })

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClose = vi.fn()
    render(<PromptModal isOpen={true} onClose={mockOnClose} />)
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders the prompt content', () => {
    render(<PromptModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument()
    expect(screen.getByText(/GitHub Dashboard en Vivo/i)).toBeInTheDocument()
  })
})
