import { TimesheetEntry, WeeklyTimesheet } from '@/types'
import { toDateKey, weekDays, weekEndDate, weekStartDate } from './dates'

export const users = [
  { id: '1', email: 'john@example.com', password: 'password123', name: 'John Doe' },
]

const weekStatuses: WeeklyTimesheet['status'][] = [
  'COMPLETED',
  'COMPLETED',
  'INCOMPLETE',
  'COMPLETED',
  'MISSING',
  'COMPLETED',
  'INCOMPLETE',
  'MISSING',
  'COMPLETED',
  'COMPLETED',
]

function formatDateRange(start: Date, end: Date): string {
  const monthName = (d: Date) => d.toLocaleDateString('en-US', { month: 'long' })
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} - ${end.getDate()} ${monthName(end)}, ${end.getFullYear()}`
  }
  return `${start.getDate()} ${monthName(start)} - ${end.getDate()} ${monthName(end)}, ${end.getFullYear()}`
}

export const weeklyTimesheets: WeeklyTimesheet[] = weekStatuses.map((status, i) => ({
  id: String(i + 1),
  weekNumber: i + 1,
  dateRange: formatDateRange(weekStartDate(i + 1), weekEndDate(i + 1)),
  status,
}))

export const timesheetEntries: TimesheetEntry[] = weeklyTimesheets.flatMap((week) =>
  [0, 1, 2].map((dayOffset) => ({
    id: `${week.id}-${dayOffset + 1}`,
    weekId: week.id,
    date: toDateKey(weekDays(week.weekNumber)[dayOffset]),
    projectName: 'Homepage Development',
    typeOfWork: 'Bug fixes',
    description: 'Worked on homepage layout fixes',
    hours: 4,
  }))
)
