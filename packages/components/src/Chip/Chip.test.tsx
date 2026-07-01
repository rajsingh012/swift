import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from '../Chip'

describe('Chip', () => {
  it('renders its children', () => {
    render(<Chip>Filter</Chip>)
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument()
  })

  it('fires onSelectedChange when clicked', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(<Chip onSelectedChange={onSelectedChange}>Toggle</Chip>)
    await user.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(onSelectedChange).toHaveBeenCalledWith(true)
  })

  it('has no axe violations', async () => {
    const { container } = render(<Chip>Accessible</Chip>)
    expect(await axe(container)).toHaveNoViolations()
  })

  describe('compound API', () => {
    it('composes Label, LeftIcon and RightIcon', () => {
      render(
        <Chip>
          <Chip.LeftIcon data-testid="left">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Chip.LeftIcon>
          <Chip.Label>Composed</Chip.Label>
          <Chip.RightIcon data-testid="right">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Chip.RightIcon>
        </Chip>,
      )
      expect(screen.getByRole('button', { name: 'Composed' })).toBeInTheDocument()
      expect(screen.getByTestId('left')).toHaveAttribute('data-slot', 'left-icon')
      expect(screen.getByTestId('right')).toHaveAttribute(
        'data-slot',
        'right-icon',
      )
    })

    it('cascades size from the root to the icon slots', () => {
      render(
        <Chip size="lg">
          <Chip.LeftIcon data-testid="icon">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Chip.LeftIcon>
          <Chip.Label>Big</Chip.Label>
        </Chip>,
      )
      // lg icon size → h-5 from iconSizeClasses.lg
      expect(screen.getByTestId('icon').className).toContain('h-5')
    })

    it('lets an explicit part size override the cascade', () => {
      render(
        <Chip size="lg">
          <Chip.LeftIcon data-testid="icon" size="sm">
            <svg viewBox="0 0 24 24" aria-hidden />
          </Chip.LeftIcon>
          <Chip.Label>Override</Chip.Label>
        </Chip>,
      )
      // sm icon size → h-3.5 from iconSizeClasses.sm
      expect(screen.getByTestId('icon').className).toContain('h-3.5')
    })

    it('Chip.Remove has an accessible default label and fires onClick', async () => {
      const user = userEvent.setup()
      const onRemove = vi.fn()
      render(
        <Chip>
          <Chip.Label>Removable</Chip.Label>
          <Chip.Remove onClick={onRemove} />
        </Chip>,
      )
      const remove = screen.getByRole('button', { name: 'Remove' })
      await user.click(remove)
      expect(onRemove).toHaveBeenCalledTimes(1)
    })

    it('renders icon parts standalone with fallback defaults', () => {
      render(
        <Chip.LeftIcon data-testid="icon">
          <svg viewBox="0 0 24 24" aria-hidden />
        </Chip.LeftIcon>,
      )
      // fallback size md → h-4
      expect(screen.getByTestId('icon').className).toContain('h-4')
    })

    it('compound composition has no axe violations', async () => {
      const { container } = render(
        <Chip>
          <Chip.LeftIcon>
            <svg viewBox="0 0 24 24" aria-hidden />
          </Chip.LeftIcon>
          <Chip.Label>Accessible compound</Chip.Label>
        </Chip>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
