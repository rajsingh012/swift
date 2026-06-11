import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Accordion } from '../Accordion'

function renderAccordion() {
  return render(
    <Accordion type="single" collapsible>
      <Accordion.Item value="shipping">
        <Accordion.Header>
          <Accordion.Trigger>Shipping</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Ships in 2-3 days.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="returns">
        <Accordion.Header>
          <Accordion.Trigger>Returns</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>30 day return window.</Accordion.Content>
      </Accordion.Item>
    </Accordion>,
  )
}

describe('Accordion', () => {
  it('expands and collapses an item on click', async () => {
    const user = userEvent.setup()
    renderAccordion()

    const trigger = screen.getByRole('button', { name: 'Shipping' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('data-state', 'open')

    // collapsible single accordion: clicking again closes it
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('data-state', 'closed')
  })

  it('single type closes the previously open item', async () => {
    const user = userEvent.setup()
    renderAccordion()

    const shipping = screen.getByRole('button', { name: 'Shipping' })
    const returns = screen.getByRole('button', { name: 'Returns' })

    await user.click(shipping)
    expect(shipping).toHaveAttribute('aria-expanded', 'true')

    await user.click(returns)
    expect(returns).toHaveAttribute('aria-expanded', 'true')
    expect(shipping).toHaveAttribute('aria-expanded', 'false')
  })

  it('wires aria-controls / aria-labelledby between trigger and content', async () => {
    const user = userEvent.setup()
    renderAccordion()

    const trigger = screen.getByRole('button', { name: 'Shipping' })
    await user.click(trigger)

    const contentId = trigger.getAttribute('aria-controls')
    expect(contentId).toBeTruthy()

    const region = screen.getByRole('region', { name: 'Shipping' })
    expect(region.id).toBe(contentId)
    expect(region).toHaveAttribute('aria-labelledby', trigger.id)
    expect(region).toHaveTextContent('Ships in 2-3 days.')
    expect(region).not.toHaveAttribute('aria-hidden')

    // closed content is hidden from the accessibility tree
    const closed = document.getElementById(
      screen
        .getByRole('button', { name: 'Returns' })
        .getAttribute('aria-controls')!,
    )
    expect(closed).toHaveAttribute('aria-hidden', 'true')
  })

  it('has no axe violations (closed and open)', async () => {
    const user = userEvent.setup()
    const { container } = renderAccordion()

    expect(await axe(container)).toHaveNoViolations()

    await user.click(screen.getByRole('button', { name: 'Shipping' }))
    expect(await axe(container)).toHaveNoViolations()
  })
})
