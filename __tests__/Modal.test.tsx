import { fireEvent, render, screen } from '@testing-library/react'
import Modal from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Hidden">
        <p>Body</p>
      </Modal>
    )
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('renders title and children when open', () => {
    render(
      <Modal isOpen onClose={() => {}} title="My Modal">
        <p>Body</p>
      </Modal>
    )
    expect(screen.getByText('My Modal')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('calls onClose from the X button', () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen onClose={onClose} title="My Modal">
        <p>Body</p>
      </Modal>
    )
    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes on backdrop click but not on card click', () => {
    const onClose = jest.fn()
    const { container } = render(
      <Modal isOpen onClose={onClose} title="My Modal">
        <p>Body</p>
      </Modal>
    )
    fireEvent.click(screen.getByText('Body'))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.click(container.firstChild as HTMLElement)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
