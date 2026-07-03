import { dayLabel, toDateKey, weekDays, weekEndDate, weekStartDate } from '@/lib/dates'

describe('date helpers', () => {
  it('returns five weekdays starting from the week start', () => {
    const days = weekDays(1)
    expect(days).toHaveLength(5)
    expect(toDateKey(days[0])).toBe('2024-01-01')
    expect(toDateKey(days[4])).toBe('2024-01-05')
  })

  it('offsets weeks by seven days', () => {
    expect(toDateKey(weekStartDate(4))).toBe('2024-01-22')
    expect(toDateKey(weekEndDate(4))).toBe('2024-01-26')
  })

  it('handles weeks crossing a month boundary', () => {
    expect(toDateKey(weekStartDate(5))).toBe('2024-01-29')
    expect(toDateKey(weekEndDate(5))).toBe('2024-02-02')
  })

  it('formats day labels like the design', () => {
    expect(dayLabel(new Date(2024, 0, 21))).toBe('Jan 21')
  })
})
