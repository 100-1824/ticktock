import Dropdown from '@/components/ui/Dropdown'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  perPage: number
  onPerPageChange: (perPage: number) => void
}

const perPageOptions = [
  { label: '5 per page', value: '5' },
  { label: '10 per page', value: '10' },
  { label: '20 per page', value: '20' },
]

function getPageItems(current: number, total: number): (number | '...')[] {
  const items: (number | '...')[] = []
  for (let page = 1; page <= total; page++) {
    if (page === 1 || page === total || Math.abs(page - current) <= 1) {
      items.push(page)
    } else if (items[items.length - 1] !== '...') {
      items.push('...')
    }
  }
  return items
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  onPerPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <div className="w-36">
        <Dropdown
          value={String(perPage)}
          onChange={(value) => onPerPageChange(Number(value))}
          options={perPageOptions}
        />
      </div>
      <div className="inline-flex -space-x-px">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-l-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          Previous
        </button>
        {getPageItems(currentPage, totalPages).map((item, index) =>
          item === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`border px-3 py-1.5 text-sm ${
                item === currentPage
                  ? 'z-10 border-blue-500 bg-blue-50 font-medium text-blue-600'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          )
        )}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-r-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  )
}
