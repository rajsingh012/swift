import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Tabs, type TabsRootProps } from '../Tabs'

function renderTabs(props: Partial<TabsRootProps> = {}) {
  return render(
    <Tabs defaultValue="one" {...props}>
      <Tabs.List aria-label="Example tabs">
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
        <Tabs.Trigger value="three">Three</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">Panel one</Tabs.Content>
      <Tabs.Content value="two">Panel two</Tabs.Content>
      <Tabs.Content value="three">Panel three</Tabs.Content>
    </Tabs>,
  )
}

describe('Tabs', () => {
  it('renders triggers and shows the active panel', () => {
    renderTabs()

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(3)

    const tabOne = screen.getByRole('tab', { name: 'One' })
    expect(tabOne).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute(
      'aria-selected',
      'false',
    )

    // Only the active panel is exposed; the rest carry `hidden`.
    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveTextContent('Panel one')
    expect(panel).toHaveAttribute('aria-labelledby', tabOne.id)
  })

  it('selects the next tab with ArrowRight (automatic activation)', async () => {
    const user = userEvent.setup()
    renderTabs()

    const tabOne = screen.getByRole('tab', { name: 'One' })
    tabOne.focus()

    await user.keyboard('{ArrowRight}')

    const tabTwo = screen.getByRole('tab', { name: 'Two' })
    expect(tabTwo).toHaveFocus()
    expect(tabTwo).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two')

    await user.keyboard('{ArrowLeft}')
    expect(tabOne).toHaveFocus()
    expect(tabOne).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel one')
  })

  it('supports Home/End and wraps with loop', async () => {
    const user = userEvent.setup()
    renderTabs()

    screen.getByRole('tab', { name: 'One' }).focus()

    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    // loop defaults to true — ArrowRight from the last tab wraps to the first.
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('activates a tab on click', async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.click(screen.getByRole('tab', { name: 'Three' }))
    expect(screen.getByRole('tab', { name: 'Three' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel three')
  })

  it('has no axe violations', async () => {
    const { container } = renderTabs()
    expect(await axe(container)).toHaveNoViolations()
  })
})
