import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Collapsible } from './Collapsible'

function renderCollapsible(props = {}) {
  return render(
    <Collapsible {...props}>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Hidden content</Collapsible.Content>
    </Collapsible>,
  )
}

describe('Collapsible', () => {
  it('is closed by default and wires aria-controls', () => {
    renderCollapsible()
    const trigger = screen.getByRole('button', { name: 'Toggle' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls')
  })

  it('toggles open on click', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderCollapsible({ onOpenChange })
    const trigger = screen.getByRole('button', { name: 'Toggle' })
    await user.click(trigger)
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('respects defaultOpen', () => {
    renderCollapsible({ defaultOpen: true })
    const region = screen.getByRole('region')
    expect(region).toHaveTextContent('Hidden content')
    expect(region).toHaveAttribute('data-state', 'open')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderCollapsible({ disabled: true, onOpenChange })
    await user.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('supports a render-prop trigger', () => {
    render(
      <Collapsible defaultOpen>
        <Collapsible.Trigger>
          {({ open }) => <span>{open ? 'Close' : 'Open'}</span>}
        </Collapsible.Trigger>
        <Collapsible.Content>Body</Collapsible.Content>
      </Collapsible>,
    )
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = renderCollapsible({ defaultOpen: true })
    expect(await axe(container)).toHaveNoViolations()
  })
})
