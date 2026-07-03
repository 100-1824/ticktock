import { WeeklyTimesheet } from '@/types'

const statusClasses = {
  COMPLETED: 'bg-green-100 text-green-600',
  INCOMPLETE: 'bg-yellow-100 text-yellow-600',
  MISSING: 'bg-red-100 text-red-600',
}

export default function StatusBadge({ status }: { status: WeeklyTimesheet['status'] }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium uppercase ${statusClasses[status]}`}>
      {status}
    </span>
  )
}
