import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider data-testid="d" />)
    const el = screen.getByTestId('d')
    expect(el).toHaveAttribute('role', 'separator')
    expect(el).toHaveAttribute('data-orientation', 'horizontal')
    // horizontal is the implicit default, so aria-orientation stays unset
    expect(el).not.toHaveAttribute('aria-orientation')
  })

  it('exposes vertical orientation', () => {
    render(<Divider orientation="vertical" data-testid="d" />)
    const el = screen.getByTestId('d')
    expect(el).toHaveAttribute('aria-orientation', 'vertical')
    expect(el).toHaveAttribute('data-orientation', 'vertical')
  })

  it('drops out of the a11y tree when decorative', () => {
    render(<Divider decorative data-testid="d" />)
    expect(screen.getByTestId('d')).toHaveAttribute('role', 'none')
  })

  it('renders a label and keeps separator semantics', () => {
    render(<Divider>OR</Divider>)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveTextContent('OR')
  })

  it('applies the variant data attribute', () => {
    render(<Divider variant="dashed" data-testid="d" />)
    expect(screen.getByTestId('d')).toHaveAttribute('data-variant', 'dashed')
  })

  it('forwards className and ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Divider ref={ref} className="custom" data-testid="d" />)
    expect(screen.getByTestId('d')).toHaveClass('custom')
    expect(ref.current).toBe(screen.getByTestId('d'))
  })

  it('has no axe violations (plain)', async () => {
    const { container } = render(<Divider />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (labelled)', async () => {
    const { container } = render(<Divider>Section</Divider>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
