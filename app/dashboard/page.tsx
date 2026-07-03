'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Pagination from '@/components/ui/Pagination'
import TimesheetFilters from '@/components/timesheets/TimesheetFilters'
import TimesheetTable from '@/components/timesheets/TimesheetTable'
import { WeeklyTimesheet } from '@/types'
import { weekEndDate, weekStartDate } from '@/lib/dates'

function matchesDateRange(timesheet: WeeklyTimesheet, range: string): boolean {
  if (range === '' || range === 'all') return true

  const now = new Date()
  let rangeStart: Date
  let rangeEnd: Date

  if (range === 'this-week' || range === 'last-week') {
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const day = monday.getDay()
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1))
    if (range === 'last-week') monday.setDate(monday.getDate() - 7)
    rangeStart = monday
    rangeEnd = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6)
  } else {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), 1)
    rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }

  // Overlap check — a range covering multiple weeks shows all of them
  return (
    weekStartDate(timesheet.weekNumber) <= rangeEnd &&
    weekEndDate(timesheet.weekNumber) >= rangeStart
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [timesheets, setTimesheets] = useState<WeeklyTimesheet[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('')
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)

  useEffect(() => {
    fetch('/api/timesheets')
      .then((res) => res.json())
      .then((data: WeeklyTimesheet[]) => setTimesheets(data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = timesheets.filter(
    (timesheet) =>
      matchesDateRange(timesheet, dateRange) &&
      (status === '' || status === 'all' || timesheet.status === status)
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  function handleDateRangeChange(value: string) {
    setDateRange(value)
    setCurrentPage(1)
  }

  function handleStatusChange(value: string) {
    setStatus(value)
    setCurrentPage(1)
  }

  function handlePerPageChange(value: number) {
    setPerPage(value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Your Timesheets</h1>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="mt-5">
                <TimesheetFilters
                  dateRange={dateRange}
                  status={status}
                  onDateRangeChange={handleDateRangeChange}
                  onStatusChange={handleStatusChange}
                />
              </div>
              <div className="mt-5">
                <TimesheetTable
                  timesheets={paginated}
                  onAction={(timesheet) => router.push(`/dashboard/${timesheet.id}`)}
                />
              </div>
              <div className="mt-5">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  perPage={perPage}
                  onPerPageChange={handlePerPageChange}
                />
              </div>
            </>
          )}
        </div>
        <footer className="mt-6 rounded-lg bg-white py-6 text-center text-sm text-gray-400 shadow-sm">
          © 2024 tentwenty. All rights reserved.
        </footer>
      </main>
    </div>
  )
}
