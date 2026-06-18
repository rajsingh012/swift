import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

function renderSelect(rootProps = {}) {
  return render(
    <Select {...rootProps}>
      <Select.Trigger>
        <Select.Value placeholder="Pick a fruit" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="cherry" disabled>
            Cherry
          </Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select>,
  )
}

describe('Select', () => {
  it('renders a combobox trigger showing the placeholder', () => {
    renderSelect()
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveTextContent('Pick a fruit')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the listbox on click', async () => {
    const user = userEvent.setup()
    renderSelect()
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
  })

  it('selects an option and shows its label', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderSelect({ onValueChange })
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Banana' }))
    expect(onValueChange).toHaveBeenCalledWith('banana')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
  })

  it('renders the selected label from defaultValue', () => {
    renderSelect({ defaultValue: 'apple' })
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple')
  })

  it('marks the selected option with aria-selected', async () => {
    const user = userEvent.setup()
    renderSelect({ defaultValue: 'apple' })
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByRole('option', { name: 'Apple' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    renderSelect()
    await user.click(screen.getByRole('combobox'))
    await screen.findByRole('listbox')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
  })

  it('emits a hidden input for forms', () => {
    const { container } = render(
      <Select name="fruit" defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select>,
    )
    const hidden = container.querySelector('input[type="hidden"]')
    expect(hidden).toHaveAttribute('name', 'fruit')
    expect(hidden).toHaveValue('apple')
  })

  it('works controlled', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [v, setV] = useState<string | null>(null)
      return (
        <Select value={v} onValueChange={setV}>
          <Select.Trigger>
            <Select.Value placeholder="Pick" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Item value="apple">Apple</Select.Item>
              <Select.Item value="banana">Banana</Select.Item>
            </Select.Content>
          </Select.Portal>
        </Select>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Banana' }))
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
  })

  it('has no axe violations when open', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Select defaultValue="apple">
        <Select.Trigger aria-label="Fruit">
          <Select.Value placeholder="Pick a fruit" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select>,
    )
    await user.click(screen.getByRole('combobox'))
    await screen.findByRole('listbox')
    expect(await axe(container)).toHaveNoViolations()
  })
})
