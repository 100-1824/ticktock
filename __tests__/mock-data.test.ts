import { timesheetEntries, users, weeklyTimesheets } from '@/lib/mock-data'

describe('mock data', () => {
  it('has the dummy login user', () => {
    expect(users).toHaveLength(1)
    expect(users[0]).toMatchObject({ email: 'john@example.com', name: 'John Doe' })
  })

  it('has 10 weeks with the required status cycle', () => {
    expect(weeklyTimesheets).toHaveLength(10)
    expect(weeklyTimesheets.map((week) => week.status)).toEqual([
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
    ])
  })

  it('formats date ranges like the design', () => {
    expect(weeklyTimesheets[0].dateRange).toBe('1 - 5 January, 2024')
    expect(weeklyTimesheets[1].dateRange).toBe('8 - 12 January, 2024')
    expect(weeklyTimesheets[4].dateRange).toBe('29 January - 2 February, 2024')
  })

  it('has 3 entries per week with the required fields', () => {
    expect(timesheetEntries).toHaveLength(30)
    for (const week of weeklyTimesheets) {
      const entries = timesheetEntries.filter((entry) => entry.weekId === week.id)
      expect(entries).toHaveLength(3)
      for (const entry of entries) {
        expect(entry.projectName).toBe('Homepage Development')
        expect(entry.typeOfWork).toBe('Bug fixes')
        expect(entry.hours).toBe(4)
      }
    }
  })
})
