import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import AddEntryModal from '@/components/timesheets/AddEntryModal'

describe('AddEntryModal', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, entry: { id: 'server-generated-id' } }),
    }) as unknown as typeof fetch
  })

  it('renders the form fields when open', () => {
    render(<AddEntryModal isOpen onClose={() => {}} weekId="1" defaultDate="2024-01-01" />)
    expect(screen.getByText('Add New Entry')).toBeInTheDocument()
    expect(screen.getByText('Select Project *')).toBeInTheDocument()
    expect(screen.getByText('Type of Work *')).toBeInTheDocument()
    expect(screen.getByLabelText('Task description *')).toBeInTheDocument()
    expect(screen.getByText('Hours *')).toBeInTheDocument()
  })

  it('shows validation errors and skips the API call when submitted empty', () => {
    render(<AddEntryModal isOpen onClose={() => {}} weekId="1" defaultDate="2024-01-01" />)
    fireEvent.click(screen.getByRole('button', { name: 'Add entry' }))
    expect(screen.getByText('Please select a project')).toBeInTheDocument()
    expect(screen.getByText('Please select a type of work')).toBeInTheDocument()
    expect(screen.getByText('Task description is required')).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('steps hours within the 1-24 range', () => {
    render(<AddEntryModal isOpen onClose={() => {}} weekId="1" defaultDate="2024-01-01" />)
    fireEvent.click(screen.getByLabelText('Decrease hours'))
    expect(screen.getByText('1')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Increase hours'))
    fireEvent.click(screen.getByLabelText('Increase hours'))
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('posts the entry, uses the server-returned id, and calls onSaved and onClose', async () => {
    const onClose = jest.fn()
    const onSaved = jest.fn()
    render(
      <AddEntryModal
        isOpen
        onClose={onClose}
        weekId="7"
        defaultDate="2024-02-05"
        onSaved={onSaved}
      />
    )

    const [project, typeOfWork] = screen.getAllByRole('combobox')
    fireEvent.change(project, { target: { value: 'Mobile App' } })
    fireEvent.change(typeOfWork, { target: { value: 'Testing' } })
    fireEvent.change(screen.getByLabelText('Task description *'), {
      target: { value: 'Wrote unit tests' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add entry' }))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/timesheets/7/entries',
      expect.objectContaining({ method: 'POST' })
    )
    expect(onSaved).toHaveBeenCalledWith(
      {
        projectName: 'Mobile App',
        typeOfWork: 'Testing',
        description: 'Wrote unit tests',
        hours: 1,
        date: '2024-02-05',
      },
      'server-generated-id'
    )
  })

  it('shows an error and keeps the modal open when the request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch
    const onClose = jest.fn()
    render(<AddEntryModal isOpen onClose={onClose} weekId="1" defaultDate="2024-01-01" />)

    const [project, typeOfWork] = screen.getAllByRole('combobox')
    fireEvent.change(project, { target: { value: 'Mobile App' } })
    fireEvent.change(typeOfWork, { target: { value: 'Testing' } })
    fireEvent.change(screen.getByLabelText('Task description *'), { target: { value: 'Test' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add entry' }))

    expect(await screen.findByText('Could not save this entry. Please try again.')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('prefills fields in edit mode', () => {
    render(
      <AddEntryModal
        isOpen
        onClose={() => {}}
        weekId="1"
        defaultDate="2024-01-01"
        entry={{
          id: '1-1',
          weekId: '1',
          date: '2024-01-01',
          projectName: 'Backend API',
          typeOfWork: 'Code review',
          description: 'Reviewed PRs',
          hours: 6,
        }}
      />
    )
    expect(screen.getByText('Edit Entry')).toBeInTheDocument()
    expect(screen.getByLabelText('Task description *')).toHaveValue('Reviewed PRs')
    expect(screen.getByText('6')).toBeInTheDocument()
  })
})
