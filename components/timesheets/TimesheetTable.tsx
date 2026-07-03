import { WeeklyTimesheet } from '@/types'
import StatusBadge from '@/components/ui/StatusBadge'

interface TimesheetTableProps {
  timesheets: WeeklyTimesheet[]
  onAction: (timesheet: WeeklyTimesheet) => void
}

const actionLabels = {
  COMPLETED: 'View',
  INCOMPLETE: 'Update',
  MISSING: 'Create',
}

function SortIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 4v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function TimesheetTable({ timesheets, onAction }: TimesheetTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="w-28 px-4 py-3 font-medium">
              <span className="flex items-center gap-2 whitespace-nowrap">
                Week # <SortIcon />
              </span>
            </th>
            <th className="px-4 py-3 font-medium">
              <span className="flex items-center gap-2">
                Date <SortIcon />
              </span>
            </th>
            <th className="px-4 py-3 font-medium">
              <span className="flex items-center gap-2">
                Status <SortIcon />
              </span>
            </th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {timesheets.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                No timesheets found
              </td>
            </tr>
          )}
          {timesheets.map((timesheet) => (
            <tr key={timesheet.id} className="hover:bg-gray-50">
              <td className="bg-gray-50 px-4 py-3.5 text-gray-900">{timesheet.weekNumber}</td>
              <td className="px-4 py-3.5 text-gray-600">{timesheet.dateRange}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={timesheet.status} />
              </td>
              <td className="px-4 py-3.5 text-right">
                <button
                  type="button"
                  onClick={() => onAction(timesheet)}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  {actionLabels[timesheet.status]}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
