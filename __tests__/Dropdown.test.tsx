import { fireEvent, render, screen } from '@testing-library/react'
import Dropdown from '@/components/ui/Dropdown'

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
]

describe('Dropdown', () => {
  it('shows the placeholder when no value is selected', () => {
    render(<Dropdown value="" onChange={() => {}} options={options} placeholder="Pick one" />)
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Pick one')
  })

  it('renders all options', () => {
    render(<Dropdown value="" onChange={() => {}} options={options} placeholder="Pick one" />)
    expect(screen.getByRole('option', { name: 'One' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Two' })).toBeInTheDocument()
  })

  it('calls onChange with the selected value', () => {
    const onChange = jest.fn()
    render(<Dropdown value="" onChange={onChange} options={options} placeholder="Pick one" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'two' } })
    expect(onChange).toHaveBeenCalledWith('two')
  })
})
