import { fireEvent, render, screen } from '@testing-library/react'
import TimesheetTable from '@/components/timesheets/TimesheetTable'
import { WeeklyTimesheet } from '@/types'

const timesheets: WeeklyTimesheet[] = [
  { id: '1', weekNumber: 1, dateRange: '1 - 5 January, 2024', status: 'COMPLETED' },
  { id: '2', weekNumber: 2, dateRange: '8 - 12 January, 2024', status: 'INCOMPLETE' },
  { id: '3', weekNumber: 3, dateRange: '15 - 19 January, 2024', status: 'MISSING' },
]

describe('TimesheetTable', () => {
  it('renders one row per timesheet with date and status', () => {
    render(<TimesheetTable timesheets={timesheets} onAction={() => {}} />)
    expect(screen.getByText('1 - 5 January, 2024')).toBeInTheDocument()
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })

  it('maps status to the right action label', () => {
    render(<TimesheetTable timesheets={timesheets} onAction={() => {}} />)
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('calls onAction with the clicked row', () => {
    const onAction = jest.fn()
    render(<TimesheetTable timesheets={timesheets} onAction={onAction} />)
    fireEvent.click(screen.getByRole('button', { name: 'Update' }))
    expect(onAction).toHaveBeenCalledWith(timesheets[1])
  })

  it('shows an empty state when there are no rows', () => {
    render(<TimesheetTable timesheets={[]} onAction={() => {}} />)
    expect(screen.getByText('No timesheets found')).toBeInTheDocument()
  })
})
