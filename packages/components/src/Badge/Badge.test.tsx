import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders a numeric count, clamped to max', () => {
    render(<Badge count={150} max={99} />)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<Badge>Accessible</Badge>)
    expect(await axe(container)).toHaveNoViolations()
  })

  describe('compound API', () => {
    it('composes Icon and Label', () => {
      render(
        <Badge>
          <Badge.Icon data-testid="icon">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Badge.Icon>
          <Badge.Label>Labelled</Badge.Label>
        </Badge>,
      )
      expect(screen.getByText('Labelled')).toBeInTheDocument()
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('cascades size from the root to Badge.Icon', () => {
      render(
        <Badge size="lg">
          <Badge.Icon data-testid="icon">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Badge.Icon>
        </Badge>,
      )
      // lg icon size class from iconSizeClasses.lg
      expect(screen.getByTestId('icon').className).toContain('h-4')
    })

    it('lets an explicit part size override the cascade', () => {
      render(
        <Badge size="lg">
          <Badge.Icon data-testid="icon" size="sm">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Badge.Icon>
        </Badge>,
      )
      // sm icon size class from iconSizeClasses.sm
      expect(screen.getByTestId('icon').className).toContain('h-3')
    })

    it('cascades variant from the root to Badge.Dot', () => {
      render(
        <Badge variant="success">
          <Badge.Dot data-testid="dot" />
        </Badge>,
      )
      // success dot colour class should be present (cascaded variant)
      expect(screen.getByTestId('dot')).toBeInTheDocument()
    })

    it('renders parts standalone with fallback defaults', () => {
      render(
        <Badge.Icon data-testid="icon">
          <svg viewBox="0 0 24 24" aria-hidden />
        </Badge.Icon>,
      )
      // No root → fallback size md → h-3.5
      expect(screen.getByTestId('icon').className).toContain('h-3.5')
    })

    it('compound composition has no axe violations', async () => {
      const { container } = render(
        <Badge>
          <Badge.Icon>
            <svg viewBox="0 0 24 24" aria-hidden />
          </Badge.Icon>
          <Badge.Label>Accessible compound</Badge.Label>
        </Badge>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
