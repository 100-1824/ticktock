import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import WeekDetailPage from '@/app/dashboard/[weekId]/page'

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { name: 'John Doe' } } }),
  signOut: jest.fn(),
}))

const week = { id: '4', weekNumber: 4, dateRange: '22 - 26 January, 2024', status: 'COMPLETED' }
const entry = {
  id: '4-1',
  weekId: '4',
  date: '2024-01-22',
  projectName: 'Homepage Development',
  typeOfWork: 'Bug fixes',
  description: 'Worked on homepage layout fixes',
  hours: 4,
}

function mockFetchSequence(...responses: Array<{ ok: boolean; json: () => Promise<unknown> }>) {
  let call = 0
  global.fetch = jest.fn(() => Promise.resolve(responses[Math.min(call++, responses.length - 1)])) as unknown as typeof fetch
}

async function renderLoaded() {
  mockFetchSequence(
    { ok: true, json: () => Promise.resolve([week]) },
    { ok: true, json: () => Promise.resolve([entry]) }
  )
  render(<WeekDetailPage params={{ weekId: '4' }} />)
  await screen.findByText('Worked on homepage layout fixes')
}

describe('WeekDetailPage delete flow', () => {
  it('shows a confirmation dialog before deleting an entry', async () => {
    await renderLoaded()
    fireEvent.click(screen.getByLabelText('Entry actions'))
    fireEvent.click(screen.getByText('Delete'))
    expect(screen.getByText('Delete entry?')).toBeInTheDocument()
    expect(screen.getByText(/cannot be undone/)).toBeInTheDocument()
  })

  it('removes the entry from the list after a confirmed delete', async () => {
    await renderLoaded()
    fireEvent.click(screen.getByLabelText('Entry actions'))
    fireEvent.click(screen.getByText('Delete'))

    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) }) as unknown as typeof fetch
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() =>
      expect(screen.queryByText('Worked on homepage layout fixes')).not.toBeInTheDocument()
    )
  })

  it('keeps the dialog open and shows an error when the delete request fails, without hiding the rest of the page', async () => {
    await renderLoaded()
    fireEvent.click(screen.getByLabelText('Entry actions'))
    fireEvent.click(screen.getByText('Delete'))

    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('Could not delete this entry. Please try again.')).toBeInTheDocument()
    // The underlying week view must still be visible — a delete failure must not blank the whole page
    expect(screen.getByText('Worked on homepage layout fixes')).toBeInTheDocument()
    expect(screen.getByText("This week's timesheet")).toBeInTheDocument()
  })

  it('cancels without deleting', async () => {
    await renderLoaded()
    fireEvent.click(screen.getByLabelText('Entry actions'))
    fireEvent.click(screen.getByText('Delete'))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByText('Delete entry?')).not.toBeInTheDocument()
    expect(screen.getByText('Worked on homepage layout fixes')).toBeInTheDocument()
  })
})
