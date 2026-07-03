// Mock weeks run Monday-Friday starting 1 January 2024

export function weekStartDate(weekNumber: number): Date {
  return new Date(2024, 0, 1 + (weekNumber - 1) * 7)
}

export function weekEndDate(weekNumber: number): Date {
  return new Date(2024, 0, 5 + (weekNumber - 1) * 7)
}

export function weekDays(weekNumber: number): Date[] {
  return [0, 1, 2, 3, 4].map(
    (offset) => new Date(2024, 0, 1 + (weekNumber - 1) * 7 + offset)
  )
}

export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function dayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
