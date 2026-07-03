import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import LoginForm from '@/components/auth/LoginForm'
import { signIn } from 'next-auth/react'

const mockPush = jest.fn()

jest.mock('next-auth/react', () => ({ signIn: jest.fn() }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

const mockSignIn = signIn as jest.Mock

describe('LoginForm', () => {
  beforeEach(() => {
    mockSignIn.mockReset()
    mockPush.mockReset()
  })

  it('shows required errors and skips signIn when submitted empty', () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('shows an auth error for invalid credentials', async () => {
    mockSignIn.mockResolvedValue({ error: 'CredentialsSignin' })
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'nope' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('redirects to the dashboard on success', async () => {
    mockSignIn.mockResolvedValue({ ok: true, error: null })
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))
    expect(mockSignIn).toHaveBeenCalledWith('credentials', {
      email: 'john@example.com',
      password: 'password123',
      redirect: false,
    })
  })
})
