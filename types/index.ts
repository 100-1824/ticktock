export interface User {
  id: string
  email: string
  name: string
}

export interface WeeklyTimesheet {
  id: string
  weekNumber: number
  dateRange: string
  status: 'COMPLETED' | 'INCOMPLETE' | 'MISSING'
}

export interface TimesheetEntry {
  id: string
  weekId: string
  date: string
  projectName: string
  typeOfWork: string
  description: string
  hours: number
}

export interface DropdownOption {
  label: string
  value: string
}

export interface EntryFormValues {
  projectName: string
  typeOfWork: string
  description: string
  hours: number
}
