import { fireEvent, render, screen } from '@testing-library/react'
import AsyncState from '@/components/ui/AsyncState'

describe('AsyncState', () => {
  it('shows a spinner while loading', () => {
    const { container } = render(
      <AsyncState loading error="" onRetry={() => {}}>
        <p>Content</p>
      </AsyncState>
    )
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('shows the error message and a retry button', () => {
    const onRetry = jest.fn()
    render(
      <AsyncState loading={false} error="Something broke" onRetry={onRetry}>
        <p>Content</p>
      </AsyncState>
    )
    expect(screen.getByText('Something broke')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders children when not loading and no error', () => {
    render(
      <AsyncState loading={false} error="" onRetry={() => {}}>
        <p>Content</p>
      </AsyncState>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
