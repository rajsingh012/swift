import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'
import { getPaginationRange } from './Pagination.utils'

describe('getPaginationRange', () => {
  it('lists all pages when they fit', () => {
    const items = getPaginationRange(5, 1, 1, 1)
    expect(items).toEqual([1, 2, 3, 4, 5].map((page) => ({ type: 'page', page })))
  })

  it('inserts an end ellipsis near the start', () => {
    const items = getPaginationRange(10, 2, 1, 1)
    const types = items.map((i) => (i.type === 'page' ? i.page : '…'))
    expect(types).toContain('…')
    expect(types[0]).toBe(1)
    expect(types[types.length - 1]).toBe(10)
  })

  it('inserts ellipses on both sides in the middle', () => {
    const items = getPaginationRange(20, 10, 1, 1)
    const ellipses = items.filter((i) => i.type === 'ellipsis')
    expect(ellipses.length).toBe(2)
  })
})

describe('Pagination', () => {
  it('renders a labelled nav with page buttons', () => {
    render(<Pagination count={5} defaultPage={1} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument()
  })

  it('marks the active page with aria-current', () => {
    render(<Pagination count={5} defaultPage={2} />)
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('fires onPageChange when a page is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination count={5} defaultPage={1} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Go to page 3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('disables prev on the first page and next on the last', () => {
    render(<Pagination count={3} defaultPage={1} />)
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Go to next page' })).not.toBeDisabled()
  })

  it('navigates with the next button', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination count={5} defaultPage={1} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Go to next page' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('works controlled', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [page, setPage] = useState(1)
      return <Pagination count={5} page={page} onPageChange={setPage} />
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Go to page 4' }))
    expect(screen.getByRole('button', { name: 'Go to page 4' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('shows first/last controls when requested', () => {
    render(<Pagination count={20} defaultPage={10} showFirstLast />)
    expect(screen.getByRole('button', { name: 'Go to first page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to last page' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    const { container } = render(<Pagination count={10} defaultPage={3} showFirstLast />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Pagination (compound API)', () => {
  it('renders composed parts and marks the active page', () => {
    render(
      <Pagination.Root count={20} defaultPage={2}>
        <Pagination.List>
          <Pagination.Previous />
          <Pagination.Item page={1} />
          <Pagination.Item page={2} />
          <Pagination.Ellipsis />
          <Pagination.Item page={20} />
          <Pagination.Next />
        </Pagination.List>
      </Pagination.Root>,
    )
    expect(
      screen.getByRole('button', { name: 'Go to page 2' }),
    ).toHaveAttribute('aria-current', 'page')
    expect(
      screen.getByRole('button', { name: 'Go to page 1' }),
    ).not.toHaveAttribute('aria-current')
  })

  it('navigates via a composed Pagination.Item', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <Pagination.Root count={20} defaultPage={1} onPageChange={onPageChange}>
        <Pagination.List>
          <Pagination.Item page={1} />
          <Pagination.Item page={5} />
        </Pagination.List>
      </Pagination.Root>,
    )
    await user.click(screen.getByRole('button', { name: 'Go to page 5' }))
    expect(onPageChange).toHaveBeenCalledWith(5)
  })

  it('disables Previous on the first page and Next on the last', () => {
    render(
      <Pagination.Root count={3} defaultPage={1}>
        <Pagination.List>
          <Pagination.Previous />
          <Pagination.Next />
        </Pagination.List>
      </Pagination.Root>,
    )
    expect(
      screen.getByRole('button', { name: 'Go to previous page' }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Go to next page' }),
    ).not.toBeDisabled()
  })

  it('throws when a part is used outside Pagination.Root', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<Pagination.Item page={1} />)).toThrow(
      /must be used inside <Pagination.Root>/,
    )
    spy.mockRestore()
  })

  it('compound composition has no axe violations', async () => {
    const { container } = render(
      <Pagination.Root count={20} defaultPage={2}>
        <Pagination.List>
          <Pagination.Previous />
          <Pagination.Item page={1} />
          <Pagination.Item page={2} />
          <Pagination.Next />
        </Pagination.List>
      </Pagination.Root>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
