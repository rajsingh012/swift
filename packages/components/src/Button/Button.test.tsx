import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'

describe('Button', () => {
  it('renders its children as a button', () => {
    render(<Button>Save changes</Button>)
    const button = screen.getByRole('button', { name: 'Save changes' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('blocks clicks while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Submitting
      </Button>,
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('blocks clicks when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    )

    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has no axe violations', async () => {
    const { container } = render(<Button>Accessible button</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('iconOnly with aria-label is accessible', async () => {
    const { container } = render(
      <Button iconOnly aria-label="Close dialog">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden />
      </Button>,
    )

    expect(
      screen.getByRole('button', { name: 'Close dialog' }),
    ).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  describe('compound API', () => {
    it('composes Label, LeftIcon and RightIcon', () => {
      render(
        <Button>
          <Button.LeftIcon data-testid="left">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Button.LeftIcon>
          <Button.Label>Continue</Button.Label>
          <Button.RightIcon data-testid="right">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Button.RightIcon>
        </Button>,
      )

      const button = screen.getByRole('button', { name: 'Continue' })
      expect(button).toBeInTheDocument()
      expect(screen.getByTestId('left')).toHaveAttribute('data-slot', 'left-icon')
      expect(screen.getByTestId('right')).toHaveAttribute(
        'data-slot',
        'right-icon',
      )
    })

    it('cascades size from the root to the icon slots', () => {
      render(
        <Button size="lg">
          <Button.LeftIcon data-testid="icon">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Button.LeftIcon>
          <Button.Label>Big</Button.Label>
        </Button>,
      )

      // lg cascade → the size-6 utility from iconSlotSizeClasses.lg
      expect(screen.getByTestId('icon').className).toContain('size-6')
    })

    it('lets an explicit part size override the cascaded size', () => {
      render(
        <Button size="lg">
          <Button.LeftIcon data-testid="icon" size="sm">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Button.LeftIcon>
          <Button.Label>Override</Button.Label>
        </Button>,
      )

      expect(screen.getByTestId('icon').className).toContain('size-4')
    })

    it('renders icon parts standalone with fallback defaults', () => {
      render(
        <Button.LeftIcon data-testid="icon">
          <svg viewBox="0 0 24 24" aria-hidden />
        </Button.LeftIcon>,
      )

      // No root → fallback size md → size-5
      expect(screen.getByTestId('icon').className).toContain('size-5')
    })

    it('marks icon slots aria-hidden', () => {
      render(
        <Button aria-label="Only icon" iconOnly>
          <Button.LeftIcon data-testid="icon">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Button.LeftIcon>
        </Button>,
      )

      expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden')
    })

    it('compound composition has no axe violations', async () => {
      const { container } = render(
        <Button>
          <Button.LeftIcon>
            <svg viewBox="0 0 24 24" aria-hidden />
          </Button.LeftIcon>
          <Button.Label>Accessible compound</Button.Label>
        </Button>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
