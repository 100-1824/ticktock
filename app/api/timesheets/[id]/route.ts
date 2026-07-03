import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { timesheetEntries } from '@/lib/mock-data'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const entries = timesheetEntries.filter((entry) => entry.weekId === params.id)
  return NextResponse.json(entries)
}
