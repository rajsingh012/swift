import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Progress } from './Progress'

describe('Progress', () => {
  it('renders a progressbar with aria value attributes', () => {
    render(<Progress value={40} label="Uploading" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '40')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps value into range', () => {
    render(<Progress value={150} label="x" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('computes percent against a custom min/max', () => {
    render(<Progress value={5} min={0} max={10} label="x" showValue />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '5')
    expect(bar).toHaveAttribute('aria-valuetext', '50%')
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress value={null} label="Loading" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).toHaveAttribute('data-state', 'indeterminate')
  })

  it('renders a value readout when showValue is set', () => {
    render(<Progress value={42} label="x" showValue />)
    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('supports a custom format', () => {
    render(
      <Progress
        value={3}
        max={5}
        label="x"
        showValue
        format={(v, p) => `${v} of 5 (${p}%)`}
      />,
    )
    expect(screen.getByText('3 of 5 (60%)')).toBeInTheDocument()
  })

  it('wires the label via aria-labelledby', () => {
    render(<Progress value={10} label="Sync" />)
    const bar = screen.getByRole('progressbar')
    const labelledBy = bar.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    expect(document.getElementById(labelledBy!)).toHaveTextContent('Sync')
  })

  it('has no axe violations', async () => {
    const { container } = render(<Progress value={60} label="Uploading" showValue />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Progress (compound API)', () => {
  it('composes Label, Track and Value with correct aria + fill', () => {
    render(
      <Progress.Root value={40}>
        <Progress.Label>Uploading</Progress.Label>
        <Progress.Track data-testid="track">
          <Progress.Indicator data-testid="indicator" />
        </Progress.Track>
        <Progress.Value />
      </Progress.Root>,
    )
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '40')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByText('Uploading')).toBeInTheDocument()
    // Value part reads the formatted percentage from context.
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByTestId('indicator')).toHaveStyle({
      width: 'var(--progress-percent)',
    })
  })

  it('Progress.Track renders a default indicator when empty', () => {
    render(
      <Progress.Root value={25}>
        <Progress.Track data-testid="track" />
      </Progress.Root>,
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '25',
    )
  })

  it('Progress.Value renders nothing while indeterminate', () => {
    render(
      <Progress.Root value={null}>
        <Progress.Track />
        <Progress.Value />
      </Progress.Root>,
    )
    const bar = screen.getByRole('progressbar')
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).toHaveAttribute('data-state', 'indeterminate')
  })

  it('renders parts standalone with fallback defaults', () => {
    render(<Progress.Track data-testid="track" />)
    // Fallback context → determinate progressbar at 0.
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0',
    )
  })

  it('forwards an accessible name to Progress.Track', () => {
    render(
      <Progress.Root value={70}>
        <Progress.Track aria-label="Sync progress" />
      </Progress.Root>,
    )
    expect(
      screen.getByRole('progressbar', { name: 'Sync progress' }),
    ).toBeInTheDocument()
  })

  it('compound composition has no axe violations', async () => {
    const { container } = render(
      <Progress.Root value={70}>
        <Progress.Track aria-label="Upload progress" />
        <Progress.Value />
      </Progress.Root>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
