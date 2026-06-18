import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Popover } from './Popover'

function renderPopover(rootProps = {}) {
  return render(
    <Popover {...rootProps}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <p>Panel content</p>
          <button>Action</button>
          <Popover.Close>Close</Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover>,
  )
}

describe('Popover', () => {
  it('is closed initially and toggles open on trigger click', async () => {
    const user = userEvent.setup()
    renderPopover()
    const trigger = screen.getByRole('button', { name: 'Open' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(trigger)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('labels the dialog with the trigger', async () => {
    const user = userEvent.setup()
    renderPopover()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = await screen.findByRole('dialog')
    const trigger = screen.getByRole('button', { name: 'Open' })
    expect(dialog).toHaveAttribute('aria-labelledby', trigger.id)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    renderPopover()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  })

  it('closes when the Close button is clicked', async () => {
    const user = userEvent.setup()
    renderPopover()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  })

  it('supports controlled open state', async () => {
    renderPopover({ open: true })
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('has no axe violations when open', async () => {
    const { container } = renderPopover({ open: true })
    await screen.findByRole('dialog')
    expect(await axe(container)).toHaveNoViolations()
  })
})
