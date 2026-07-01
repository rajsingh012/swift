import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Breadcrumb } from './Breadcrumb'

function renderBreadcrumb(props = {}) {
  return render(
    <Breadcrumb {...props}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/settings">Settings</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Profile</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>,
  )
}

describe('Breadcrumb', () => {
  it('renders a labelled nav landmark', () => {
    renderBreadcrumb()
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('renders links for navigable crumbs', () => {
    renderBreadcrumb()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/settings',
    )
  })

  it('marks the current page with aria-current', () => {
    renderBreadcrumb()
    const page = screen.getByText('Profile')
    expect(page).toHaveAttribute('aria-current', 'page')
  })

  it('hides separators from assistive tech', () => {
    const { container } = renderBreadcrumb()
    const seps = container.querySelectorAll('.swift-breadcrumb-separator')
    expect(seps.length).toBe(2)
    seps.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'))
  })

  it('uses a custom separator', () => {
    render(
      <Breadcrumb separator=">">
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Now</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>,
    )
    expect(screen.getByText('>')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = renderBreadcrumb()
    expect(await axe(container)).toHaveNoViolations()
  })
})
