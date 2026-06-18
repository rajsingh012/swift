import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders a status role with a default label', () => {
    render(<Spinner />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-label', 'Loading')
  })

  it('uses a custom label', () => {
    render(<Spinner label="Saving" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving')
  })

  it('renders visible children as the label instead of aria-label', () => {
    render(<Spinner>Loading…</Spinner>)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Loading…')
    expect(status).not.toHaveAttribute('aria-label')
  })

  it('reflects size and variant via data attributes', () => {
    render(<Spinner size="lg" variant="brand" />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('data-size', 'lg')
    expect(status).toHaveAttribute('data-variant', 'brand')
  })

  it('forwards className and ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Spinner ref={ref} className="custom" />)
    expect(screen.getByRole('status')).toHaveClass('custom')
    expect(ref.current).toBe(screen.getByRole('status'))
  })

  it('has no axe violations', async () => {
    const { container } = render(<Spinner />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
