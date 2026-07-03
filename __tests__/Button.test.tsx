import { fireEvent, render, screen } from '@testing-library/react'
import Button from '@/components/ui/Button'

describe('Button', () => {
  it('renders children and defaults to the primary variant', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveClass('bg-blue-600')
  })

  it('applies secondary and danger variants', () => {
    const { rerender } = render(<Button variant="secondary">Cancel</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-gray-300')
    rerender(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })

  it('fires onClick', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Go</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', () => {
    const onClick = jest.fn()
    render(
      <Button onClick={onClick} disabled>
        Go
      </Button>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
