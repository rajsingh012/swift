import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Alert } from '../Alert'

describe('Alert', () => {
  it('uses role="alert" for the error variant', () => {
    render(
      <Alert variant="error" title="Payment failed">
        Please try another card.
      </Alert>,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
    expect(alert).toHaveTextContent('Payment failed')
  })

  it('uses role="status" for non-error variants', () => {
    render(
      <Alert variant="success" title="Saved">
        Your changes are live.
      </Alert>,
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent('Saved')
  })

  it('dismisses via the close button', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Alert variant="info" title="Heads up" dismissible onOpenChange={onOpenChange}>
        Something happened.
      </Alert>,
    )

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('data-state', 'open')

    await user.click(screen.getByRole('button', { name: 'Dismiss alert' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    // The alert keeps rendering while the exit animation plays (jsdom has no
    // animations, so usePresence falls back to immediate/timeout unmount) —
    // assert the closed state first, then eventual removal.
    expect(screen.queryByRole('status')).toSatisfy(
      (node: HTMLElement | null) =>
        node === null || node.getAttribute('data-state') === 'closed',
    )
    await waitFor(
      () => expect(screen.queryByRole('status')).not.toBeInTheDocument(),
      { timeout: 3000 },
    )
  })

  it('controlled open=false renders nothing after exit', async () => {
    const { rerender } = render(
      <Alert variant="warning" title="Quota" open>
        Nearly out of space.
      </Alert>,
    )
    expect(screen.getByRole('status')).toBeInTheDocument()

    rerender(
      <Alert variant="warning" title="Quota" open={false}>
        Nearly out of space.
      </Alert>,
    )
    await waitFor(
      () => expect(screen.queryByRole('status')).not.toBeInTheDocument(),
      { timeout: 3000 },
    )
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Alert variant="error" title="Something broke" dismissible>
        We could not reach the server.
      </Alert>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
