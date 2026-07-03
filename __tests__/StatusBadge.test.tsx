import { render, screen } from '@testing-library/react'
import StatusBadge from '@/components/ui/StatusBadge'

describe('StatusBadge', () => {
  it('renders COMPLETED in green', () => {
    render(<StatusBadge status="COMPLETED" />)
    expect(screen.getByText('COMPLETED')).toHaveClass('bg-green-100', 'text-green-600')
  })

  it('renders INCOMPLETE in yellow', () => {
    render(<StatusBadge status="INCOMPLETE" />)
    expect(screen.getByText('INCOMPLETE')).toHaveClass('bg-yellow-100', 'text-yellow-600')
  })

  it('renders MISSING in red', () => {
    render(<StatusBadge status="MISSING" />)
    expect(screen.getByText('MISSING')).toHaveClass('bg-red-100', 'text-red-600')
  })
})
