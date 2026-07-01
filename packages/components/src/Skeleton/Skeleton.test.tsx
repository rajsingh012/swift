import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a decorative, aria-hidden placeholder', () => {
    render(<Skeleton data-testid="s" />)
    const el = screen.getByTestId('s')
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el).toHaveAttribute('data-variant', 'text')
  })

  it('applies explicit width and height as inline styles', () => {
    render(<Skeleton data-testid="s" width={200} height={20} />)
    const el = screen.getByTestId('s')
    expect(el.style.width).toBe('200px')
    expect(el.style.height).toBe('20px')
  })

  it('passes string dimensions through untouched', () => {
    render(<Skeleton data-testid="s" width="60%" />)
    expect(screen.getByTestId('s').style.width).toBe('60%')
  })

  it('renders the requested number of text lines', () => {
    render(<Skeleton data-testid="s" lines={3} />)
    const group = screen.getByTestId('s')
    expect(group.children).toHaveLength(3)
  })

  it('reflects the animation via data attribute', () => {
    render(<Skeleton data-testid="s" animation="wave" />)
    expect(screen.getByTestId('s')).toHaveAttribute('data-animation', 'wave')
  })

  it('has no axe violations', async () => {
    const { container } = render(<Skeleton lines={2} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
