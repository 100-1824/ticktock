import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { EntryFormValues } from '@/types'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const values: EntryFormValues = await request.json()
  // Mock handler — no database, just echo the new entry back
  return NextResponse.json(
    { success: true, entry: { ...values, id: crypto.randomUUID(), weekId: params.id } },
    { status: 201 }
  )
}
