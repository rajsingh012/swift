import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Box } from './Box'

describe('Box', () => {
  it('renders a div by default and forwards children', () => {
    render(<Box>content</Box>)
    const el = screen.getByText('content')
    expect(el.tagName).toBe('DIV')
  })

  it('renders the element given by `as`', () => {
    render(<Box as="section">section content</Box>)
    expect(screen.getByText('section content').tagName).toBe('SECTION')
  })

  it('resolves numeric spacing props to scale tokens', () => {
    render(
      <Box data-testid="b" p={4} mt={2}>
        x
      </Box>,
    )
    const el = screen.getByTestId('b')
    expect(el.style.paddingTop).toBe('var(--space-4)')
    expect(el.style.paddingLeft).toBe('var(--space-4)')
    expect(el.style.marginTop).toBe('var(--space-2)')
  })

  it('passes raw string spacing values straight through', () => {
    render(
      <Box data-testid="b" m="auto" px="10%">
        x
      </Box>,
    )
    const el = screen.getByTestId('b')
    expect(el.style.marginLeft).toBe('auto')
    expect(el.style.paddingLeft).toBe('10%')
  })

  it('applies side > axis > shorthand precedence', () => {
    render(
      <Box data-testid="b" p={1} px={2} pl={3}>
        x
      </Box>,
    )
    const el = screen.getByTestId('b')
    expect(el.style.paddingLeft).toBe('var(--space-3)') // side wins
    expect(el.style.paddingRight).toBe('var(--space-2)') // axis
    expect(el.style.paddingTop).toBe('var(--space-1)') // shorthand
  })

  it('treats numeric dimensions as pixels and strings as raw', () => {
    render(
      <Box data-testid="b" width={240} maxWidth="100%">
        x
      </Box>,
    )
    const el = screen.getByTestId('b')
    expect(el.style.width).toBe('240px')
    expect(el.style.maxWidth).toBe('100%')
  })

  it('maps token props to CSS variables', () => {
    render(
      <Box data-testid="b" bg="surface-muted" radius="lg" shadow="level2" border>
        x
      </Box>,
    )
    const el = screen.getByTestId('b')
    expect(el.style.backgroundColor).toBe('var(--color-surface-muted)')
    expect(el.style.borderRadius).toBe('var(--radius-lg)')
    expect(el.style.boxShadow).toBe('var(--shadow-level2)')
    expect(el.style.border).toBe('1px solid var(--color-stroke)')
  })

  it('resolves a border tone', () => {
    render(
      <Box data-testid="b" border="brand">
        x
      </Box>,
    )
    expect(screen.getByTestId('b').style.border).toBe(
      '1px solid var(--color-stroke-brand)',
    )
  })

  it('lets a consumer `style` win over token-derived styles', () => {
    render(
      <Box data-testid="b" p={4} style={{ paddingTop: '99px' }}>
        x
      </Box>,
    )
    expect(screen.getByTestId('b').style.paddingTop).toBe('99px')
  })

  it('does not leak style props onto the DOM element', () => {
    render(
      <Box data-testid="b" p={2} bg="surface" radius="md">
        x
      </Box>,
    )
    const el = screen.getByTestId('b')
    expect(el.hasAttribute('p')).toBe(false)
    expect(el.hasAttribute('bg')).toBe(false)
    expect(el.hasAttribute('radius')).toBe(false)
  })

  it('forwards arbitrary attributes and className', () => {
    render(
      <Box data-testid="b" className="custom" role="group" aria-label="region">
        x
      </Box>,
    )
    const el = screen.getByTestId('b')
    expect(el).toHaveClass('custom')
    expect(screen.getByRole('group', { name: 'region' })).toBe(el)
  })

  it('forwards the ref to the rendered element', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Box ref={ref} as="span">
        x
      </Box>,
    )
    expect(ref.current?.tagName).toBe('SPAN')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Box as="section" aria-label="Panel" p={4} bg="surface-muted">
        Accessible region
      </Box>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
