import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Dialog } from './Dialog'

function renderDialog(rootProps = {}) {
  return render(
    <Dialog {...rootProps}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Confirm</Dialog.Title>
            <Dialog.Description>Are you sure?</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>Body content</Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close>Cancel</Dialog.Close>
          </Dialog.Footer>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>,
  )
}

describe('Dialog', () => {
  it('opens on trigger click and is labelled by its title/description', async () => {
    const user = userEvent.setup()
    renderDialog()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Confirm')
    expect(dialog).toHaveAccessibleDescription('Are you sure?')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    renderDialog()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  })

  it('closes via the Close button', async () => {
    const user = userEvent.setup()
    renderDialog()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  })

  it('supports controlled open', async () => {
    renderDialog({ open: true })
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('renders an icon close button with an accessible name', async () => {
    renderDialog({ open: true })
    await screen.findByRole('dialog')
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('has no axe violations when open', async () => {
    const { container } = renderDialog({ open: true })
    await screen.findByRole('dialog')
    expect(await axe(container)).toHaveNoViolations()
  })
})
