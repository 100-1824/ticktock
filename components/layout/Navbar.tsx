'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            ticktock
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-900">
            Timesheets
          </Link>
        </div>
        <button type="button" className="flex items-center gap-1 text-sm text-gray-600">
          {session?.user?.name}
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  )
}
