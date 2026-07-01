import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Toggle } from './Toggle'
import { ToggleGroup } from './ToggleGroup'

describe('Toggle (standalone)', () => {
  it('renders an unpressed toggle button', () => {
    render(<Toggle>Bold</Toggle>)
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('toggles pressed state on click', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>)
    const btn = screen.getByRole('button', { name: 'Bold' })
    await user.click(btn)
    expect(onPressedChange).toHaveBeenCalledWith(true)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('respects defaultPressed', () => {
    render(<Toggle defaultPressed>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(
      <Toggle disabled onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    )
    await user.click(screen.getByRole('button'))
    expect(onPressedChange).not.toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = render(<Toggle aria-label="Bold">B</Toggle>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('ToggleGroup', () => {
  it('renders a group with single selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
      </ToggleGroup>,
    )
    await user.click(screen.getByRole('button', { name: 'Left' }))
    expect(onValueChange).toHaveBeenLastCalledWith('left')
    await user.click(screen.getByRole('button', { name: 'Center' }))
    expect(onValueChange).toHaveBeenLastCalledWith('center')
  })

  it('deselects in single mode when clicking the active item', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="single" defaultValue="left" onValueChange={onValueChange}>
        <Toggle value="left">Left</Toggle>
      </ToggleGroup>,
    )
    await user.click(screen.getByRole('button', { name: 'Left' }))
    expect(onValueChange).toHaveBeenLastCalledWith(null)
  })

  it('allows multiple selections in multiple mode', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="multiple" onValueChange={onValueChange}>
        <Toggle value="b">B</Toggle>
        <Toggle value="i">I</Toggle>
      </ToggleGroup>,
    )
    await user.click(screen.getByRole('button', { name: 'B' }))
    await user.click(screen.getByRole('button', { name: 'I' }))
    expect(onValueChange).toHaveBeenLastCalledWith(['b', 'i'])
  })

  it('cascades disabled to items', () => {
    render(
      <ToggleGroup type="single" disabled>
        <Toggle value="a">A</Toggle>
      </ToggleGroup>,
    )
    expect(screen.getByRole('button', { name: 'A' })).toBeDisabled()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <ToggleGroup type="single" defaultValue="a">
        <Toggle value="a">A</Toggle>
        <Toggle value="b">B</Toggle>
      </ToggleGroup>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
