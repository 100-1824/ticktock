'use client'

import { useEffect, useState } from 'react'
import { EntryFormValues, TimesheetEntry } from '@/types'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import Modal from '@/components/ui/Modal'

interface AddEntryModalProps {
  isOpen: boolean
  onClose: () => void
  weekId: string
  defaultDate: string
  entry?: TimesheetEntry
  onSaved?: (values: EntryFormValues, savedId?: string) => void
}

const projectOptions = [
  { label: 'Homepage Development', value: 'Homepage Development' },
  { label: 'Mobile App', value: 'Mobile App' },
  { label: 'Backend API', value: 'Backend API' },
]

const typeOfWorkOptions = [
  { label: 'Bug fixes', value: 'Bug fixes' },
  { label: 'Feature development', value: 'Feature development' },
  { label: 'Code review', value: 'Code review' },
  { label: 'Testing', value: 'Testing' },
]

const MIN_HOURS = 1
const MAX_HOURS = 24

function InfoIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1 1 0 110 2 1 1 0 010-2zm1 8H7V7h2v5z" />
    </svg>
  )
}

export default function AddEntryModal({
  isOpen,
  onClose,
  weekId,
  defaultDate,
  entry,
  onSaved,
}: AddEntryModalProps) {
  const [projectName, setProjectName] = useState('')
  const [typeOfWork, setTypeOfWork] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState(1)
  const [errors, setErrors] = useState<{ projectName?: string; typeOfWork?: string; description?: string }>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Reset form whenever the modal opens (prefilled in edit mode)
  useEffect(() => {
    if (!isOpen) return
    setProjectName(entry?.projectName ?? '')
    setTypeOfWork(entry?.typeOfWork ?? '')
    setDescription(entry?.description ?? '')
    setHours(entry?.hours ?? 1)
    setErrors({})
    setSubmitError('')
  }, [isOpen, entry])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    const nextErrors: typeof errors = {}
    if (!projectName) nextErrors.projectName = 'Please select a project'
    if (!typeOfWork) nextErrors.typeOfWork = 'Please select a type of work'
    if (!description.trim()) nextErrors.description = 'Task description is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const safeHours = Math.min(MAX_HOURS, Math.max(MIN_HOURS, hours))
    const values: EntryFormValues = {
      projectName,
      typeOfWork,
      description,
      hours: safeHours,
      date: entry?.date ?? defaultDate,
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/timesheets/${weekId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Failed to save entry')
      const data: { entry: TimesheetEntry } = await res.json()
      onSaved?.(values, data.entry?.id)
      onClose()
    } catch {
      setSubmitError('Could not save this entry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entry ? 'Edit Entry' : 'Add New Entry'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-900">
              Select Project * <InfoIcon />
            </label>
            <div className="w-3/5">
              <Dropdown
                value={projectName}
                onChange={setProjectName}
                options={projectOptions}
                placeholder="Project Name"
              />
            </div>
            {errors.projectName && <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>}
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-900">
              Type of Work * <InfoIcon />
            </label>
            <div className="w-3/5">
              <Dropdown
                value={typeOfWork}
                onChange={setTypeOfWork}
                options={typeOfWorkOptions}
                placeholder="Bug fixes"
              />
            </div>
            {errors.typeOfWork && <p className="mt-1 text-sm text-red-600">{errors.typeOfWork}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-900">
              Task description *
            </label>
            <textarea
              id="description"
              rows={6}
              placeholder="Write text here ..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`w-4/5 rounded-md border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">A note for extra info</p>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-900">Hours *</label>
            <div className="inline-flex items-stretch overflow-hidden rounded-md border border-gray-300">
              <button
                type="button"
                onClick={() => setHours((h) => Math.max(MIN_HOURS, h - 1))}
                aria-label="Decrease hours"
                className="bg-gray-100 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-200"
              >
                −
              </button>
              <span className="flex w-12 items-center justify-center border-x border-gray-300 bg-white text-sm text-gray-900">
                {hours}
              </span>
              <button
                type="button"
                onClick={() => setHours((h) => Math.min(MAX_HOURS, h + 1))}
                aria-label="Increase hours"
                className="bg-gray-100 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        </div>

        <div className="flex gap-4 border-t border-gray-200 px-6 py-4">
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? 'Saving...' : entry ? 'Update entry' : 'Add entry'}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={submitting} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
