import type { PaginationItem } from './Pagination.types'

export { useControllableState } from '../internal/state'
export { cx } from '../internal/cx'

function range(start: number, end: number): number[] {
  const out: number[] = []
  for (let i = start; i <= end; i += 1) out.push(i)
  return out
}

/**
 * Build the list of page slots to render, inserting ellipsis gaps when the
 * page count exceeds what siblings + boundaries can show. Mirrors the
 * MUI/Radix pagination algorithm.
 *
 *   count=10, page=5, siblingCount=1, boundaryCount=1
 *   → 1 … 4 5 6 … 10
 */
export function getPaginationRange(
  count: number,
  page: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationItem[] {
  if (count <= 0) return []

  // Total slots if we showed everything without ellipsis:
  // first boundary + last boundary + current + 2*siblings + 2 ellipsis.
  const totalNumbers = boundaryCount * 2 + siblingCount * 2 + 3
  if (totalNumbers >= count) {
    return range(1, count).map((p) => ({ type: 'page', page: p }))
  }

  const startPages = range(1, boundaryCount)
  const endPages = range(count - boundaryCount + 1, count)

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  )

  const items: PaginationItem[] = []
  startPages.forEach((p) => items.push({ type: 'page', page: p }))

  // Gap (or single page) between the start boundary and the sibling block.
  if (siblingsStart > boundaryCount + 2) {
    items.push({ type: 'ellipsis', key: 'ellipsis-start' })
  } else if (boundaryCount + 1 < count - boundaryCount) {
    items.push({ type: 'page', page: boundaryCount + 1 })
  }

  range(siblingsStart, siblingsEnd).forEach((p) =>
    items.push({ type: 'page', page: p }),
  )

  // Gap (or single page) between the sibling block and the end boundary.
  if (siblingsEnd < count - boundaryCount - 1) {
    items.push({ type: 'ellipsis', key: 'ellipsis-end' })
  } else if (count - boundaryCount > boundaryCount) {
    items.push({ type: 'page', page: count - boundaryCount })
  }

  endPages.forEach((p) => items.push({ type: 'page', page: p }))

  return items
}
