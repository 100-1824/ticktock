import { fireEvent, render, screen } from '@testing-library/react'
import Navbar from '@/components/layout/Navbar'
import { signOut } from 'next-auth/react'

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { name: 'John Doe' } } }),
  signOut: jest.fn(),
}))

const mockSignOut = signOut as jest.Mock

describe('Navbar', () => {
  beforeEach(() => {
    mockSignOut.mockReset()
  })

  it('shows the logo, Timesheets tab and user name', () => {
    render(<Navbar />)
    expect(screen.getByText('ticktock')).toBeInTheDocument()
    expect(screen.getByText('Timesheets')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('toggles the user dropdown', () => {
    render(<Navbar />)
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('John Doe'))
    expect(screen.getByText('Logout')).toBeInTheDocument()
    fireEvent.click(screen.getByText('John Doe'))
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })

  it('signs out with a redirect to login', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByText('John Doe'))
    fireEvent.click(screen.getByText('Logout'))
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: '/login' })
  })
})
