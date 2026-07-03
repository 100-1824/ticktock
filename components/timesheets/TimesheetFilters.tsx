import Dropdown from '@/components/ui/Dropdown'

interface TimesheetFiltersProps {
  dateRange: string
  status: string
  onDateRangeChange: (value: string) => void
  onStatusChange: (value: string) => void
}

const dateRangeOptions = [
  { label: 'All', value: 'all' },
  { label: 'This week', value: 'this-week' },
  { label: 'Last week', value: 'last-week' },
  { label: 'This month', value: 'this-month' },
]

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Incomplete', value: 'INCOMPLETE' },
  { label: 'Missing', value: 'MISSING' },
]

export default function TimesheetFilters({
  dateRange,
  status,
  onDateRangeChange,
  onStatusChange,
}: TimesheetFiltersProps) {
  return (
    <div className="flex gap-3">
      <div className="w-40">
        <Dropdown
          value={dateRange}
          onChange={onDateRangeChange}
          options={dateRangeOptions}
          placeholder="Date Range"
        />
      </div>
      <div className="w-40">
        <Dropdown
          value={status}
          onChange={onStatusChange}
          options={statusOptions}
          placeholder="Status"
        />
      </div>
    </div>
  )
}
