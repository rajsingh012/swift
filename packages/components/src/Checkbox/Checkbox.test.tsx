import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from '../Checkbox'

describe('Checkbox', () => {
  it('toggles when uncontrolled (defaultChecked)', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <Checkbox defaultChecked={false} onCheckedChange={onCheckedChange}>
        Accept terms
      </Checkbox>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
  })

  it('respects the controlled checked prop', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    const { rerender } = render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange}>
        Subscribe
      </Checkbox>,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Subscribe' })

    // Clicking notifies, but the state does not move until the owner says so.
    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(checkbox).not.toBeChecked()

    rerender(
      <Checkbox checked onCheckedChange={onCheckedChange}>
        Subscribe
      </Checkbox>,
    )
    expect(checkbox).toBeChecked()
  })

  it('works controlled through useState', async () => {
    const user = userEvent.setup()
    function Harness() {
      const [checked, setChecked] = useState<boolean | 'indeterminate'>(false)
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={(next) => setChecked(next)}
        >
          Remember me
        </Checkbox>
      )
    }
    render(<Harness />)

    const checkbox = screen.getByRole('checkbox', { name: 'Remember me' })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('exposes indeterminate as aria-checked="mixed"', () => {
    render(<Checkbox checked="indeterminate">Select all</Checkbox>)

    const checkbox = screen.getByRole('checkbox', { name: 'Select all' })
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    expect(checkbox).toBePartiallyChecked()
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Checkbox defaultChecked description="We never share your email.">
        Email me updates
      </Checkbox>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
