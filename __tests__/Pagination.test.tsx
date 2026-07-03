import { fireEvent, render, screen } from '@testing-library/react'
import Pagination from '@/components/ui/Pagination'

function renderPagination(overrides: Partial<React.ComponentProps<typeof Pagination>> = {}) {
  const props = {
    currentPage: 1,
    totalPages: 2,
    onPageChange: jest.fn(),
    perPage: 5,
    onPerPageChange: jest.fn(),
    ...overrides,
  }
  render(<Pagination {...props} />)
  return props
}

describe('Pagination', () => {
  it('disables Previous on the first page and Next on the last', () => {
    renderPagination({ currentPage: 1, totalPages: 2 })
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled()
  })

  it('calls onPageChange when a page number is clicked', () => {
    const props = renderPagination()
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    expect(props.onPageChange).toHaveBeenCalledWith(2)
  })

  it('collapses far pages into an ellipsis', () => {
    renderPagination({ currentPage: 5, totalPages: 99 })
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '99' })).toBeInTheDocument()
    expect(screen.getAllByText('...').length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: '50' })).not.toBeInTheDocument()
  })

  it('highlights the current page', () => {
    renderPagination({ currentPage: 2, totalPages: 3 })
    expect(screen.getByRole('button', { name: '2' })).toHaveClass('text-blue-600')
  })

  it('calls onPerPageChange from the per-page dropdown', () => {
    const props = renderPagination()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '10' } })
    expect(props.onPerPageChange).toHaveBeenCalledWith(10)
  })
})
