'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

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
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            {session?.user?.name}
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-32 rounded-md border border-gray-100 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
