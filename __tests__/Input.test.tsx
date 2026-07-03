import { fireEvent, render, screen } from '@testing-library/react'
import Input from '@/components/ui/Input'

describe('Input', () => {
  it('renders a label linked to the field', () => {
    render(<Input id="email" label="Email" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const onChange = jest.fn()
    render(<Input id="email" label="Email" value="" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('shows an error message and red border when error is set', () => {
    render(<Input id="email" label="Email" value="" onChange={() => {}} error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveClass('border-red-500')
  })
})
