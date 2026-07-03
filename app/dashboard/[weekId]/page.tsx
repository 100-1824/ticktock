'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import AddEntryModal from '@/components/timesheets/AddEntryModal'
import { EntryFormValues, TimesheetEntry, WeeklyTimesheet } from '@/types'
import { dayLabel, toDateKey, weekDays } from '@/lib/dates'

const WEEK_HOURS_TARGET = 40

export default function WeekDetailPage({ params }: { params: { weekId: string } }) {
  const { weekId } = params
  const [week, setWeek] = useState<WeeklyTimesheet | null>(null)
  const [entries, setEntries] = useState<TimesheetEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | undefined>(undefined)
  const [selectedDate, setSelectedDate] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/timesheets').then((res) => res.json()),
      fetch(`/api/timesheets/${weekId}`).then((res) => res.json()),
    ])
      .then(([weeks, weekEntries]: [WeeklyTimesheet[], TimesheetEntry[]]) => {
        setWeek(weeks.find((w) => w.id === weekId) ?? null)
        setEntries(weekEntries)
      })
      .finally(() => setLoading(false))
  }, [weekId])

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)
  const percent = Math.min(100, Math.round((totalHours / WEEK_HOURS_TARGET) * 100))

  function openAddModal(date: Date) {
    setEditingEntry(undefined)
    setSelectedDate(toDateKey(date))
    setModalOpen(true)
  }

  function openEditModal(entry: TimesheetEntry) {
    setEditingEntry(entry)
    setSelectedDate(entry.date)
    setOpenMenuId(null)
    setModalOpen(true)
  }

  function handleDelete(entryId: string) {
    setEntries((current) => current.filter((entry) => entry.id !== entryId))
    setOpenMenuId(null)
  }

  function handleSaved(values: EntryFormValues) {
    if (editingEntry) {
      setEntries((current) =>
        current.map((entry) => (entry.id === editingEntry.id ? { ...entry, ...values } : entry))
      )
      return
    }
    setEntries((current) => [
      ...current,
      { ...values, id: crypto.randomUUID(), weekId, date: selectedDate },
    ])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">This week&apos;s timesheet</h1>
                  <p className="mt-1.5 text-xs text-gray-400">{week?.dateRange}</p>
                </div>
                <div className="w-44">
                  <div className="relative mb-1.5">
                    <p className="text-center text-sm font-medium text-gray-900">
                      {totalHours}/{WEEK_HOURS_TARGET} hrs
                    </p>
                    <span className="absolute bottom-0 right-0 text-[10px] text-gray-400">100%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    {/* inline width is required for a dynamic percentage */}
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {week &&
                  weekDays(week.weekNumber).map((day) => {
                    const dateKey = toDateKey(day)
                    const dayEntries = entries.filter((entry) => entry.date === dateKey)
                    return (
                      <div key={dateKey} className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                        <div className="w-16 shrink-0 pt-2 text-sm font-semibold text-gray-900">
                          {dayLabel(day)}
                        </div>
                        <div className="flex-1 space-y-2.5">
                          {dayEntries.map((entry) => (
                            <div
                              key={entry.id}
                              className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-2.5"
                            >
                              <span className="text-sm font-medium text-gray-900">
                                {entry.description}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400">{entry.hours} hrs</span>
                                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                                  {entry.projectName}
                                </span>
                                <div className="relative">
                                  <button
                                    type="button"
                                    aria-label="Entry actions"
                                    onClick={() =>
                                      setOpenMenuId(openMenuId === entry.id ? null : entry.id)
                                    }
                                    className="text-gray-400 transition-colors hover:text-gray-600"
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <circle cx="4" cy="10" r="1.5" />
                                      <circle cx="10" cy="10" r="1.5" />
                                      <circle cx="16" cy="10" r="1.5" />
                                    </svg>
                                  </button>
                                  {openMenuId === entry.id && (
                                    <div className="absolute right-0 top-full z-10 mt-1 w-28 rounded-md border border-gray-100 bg-white py-1 shadow-lg">
                                      <button
                                        type="button"
                                        onClick={() => openEditModal(entry)}
                                        className="block w-full px-4 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDelete(entry.id)}
                                        className="block w-full px-4 py-1.5 text-left text-sm text-red-500 hover:bg-gray-50"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => openAddModal(day)}
                            className="w-full rounded-md border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            + Add new task
                          </button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </>
          )}
        </div>
        <footer className="mt-6 rounded-lg bg-white py-6 text-center text-sm text-gray-400 shadow-sm">
          © 2024 tentwenty. All rights reserved.
        </footer>
      </main>

      <AddEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        weekId={weekId}
        entry={editingEntry}
        onSaved={handleSaved}
      />
    </div>
  )
}
