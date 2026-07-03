import { fireEvent, render, screen } from '@testing-library/react'
import TimesheetFilters from '@/components/timesheets/TimesheetFilters'

describe('TimesheetFilters', () => {
  it('renders Date Range and Status dropdowns', () => {
    render(
      <TimesheetFilters dateRange="" status="" onDateRangeChange={() => {}} onStatusChange={() => {}} />
    )
    const selects = screen.getAllByRole('combobox')
    expect(selects).toHaveLength(2)
    expect(selects[0]).toHaveDisplayValue('Date Range')
    expect(selects[1]).toHaveDisplayValue('Status')
  })

  it('calls the change handlers with the selected values', () => {
    const onDateRangeChange = jest.fn()
    const onStatusChange = jest.fn()
    render(
      <TimesheetFilters
        dateRange=""
        status=""
        onDateRangeChange={onDateRangeChange}
        onStatusChange={onStatusChange}
      />
    )
    const [dateRange, status] = screen.getAllByRole('combobox')
    fireEvent.change(dateRange, { target: { value: 'this-week' } })
    expect(onDateRangeChange).toHaveBeenCalledWith('this-week')
    fireEvent.change(status, { target: { value: 'MISSING' } })
    expect(onStatusChange).toHaveBeenCalledWith('MISSING')
  })
})
