import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders a textarea with an associated label', () => {
    render(<Textarea label="Bio" />)
    const field = screen.getByLabelText('Bio')
    expect(field.tagName).toBe('TEXTAREA')
  })

  it('marks the field invalid and wires the error message', () => {
    render(<Textarea label="Bio" invalid errorMessage="Required" />)
    const field = screen.getByLabelText('Bio')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    const describedBy = field.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!.trim())).toHaveTextContent('Required')
  })

  it('shows helper text when not invalid', () => {
    render(<Textarea label="Bio" helperText="Max 200 chars" />)
    expect(screen.getByText('Max 200 chars')).toBeInTheDocument()
  })

  it('renders a character count', async () => {
    const user = userEvent.setup()
    render(<Textarea label="Bio" maxLength={10} showCount />)
    expect(screen.getByText('0 / 10')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Bio'), 'abc')
    expect(screen.getByText('3 / 10')).toBeInTheDocument()
  })

  it('reflects required state', () => {
    render(<Textarea label="Bio" required />)
    expect(screen.getByLabelText(/Bio/)).toBeRequired()
  })

  it('forwards the ref to the textarea', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} label="Bio" />)
    expect(ref.current?.tagName).toBe('TEXTAREA')
  })

  it('has no axe violations', async () => {
    const { container } = render(
      <Textarea label="Bio" helperText="A short bio" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
