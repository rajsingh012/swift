import { createContext, useContext } from 'react'
import type { PaginationSize, PaginationVariant } from './Pagination.types'

/**
 * State cascaded from `<Pagination>` (or `<Pagination.Root>`) to its compound
 * parts (`Pagination.Item`, `Pagination.Previous`, `Pagination.Next`,
 * `Pagination.Ellipsis`, `Pagination.List`). Parts are structural — they are
 * meaningless without page state — so the hook throws when used outside a
 * root, matching the Accordion convention.
 */
export interface PaginationContextValue {
  /** Current 1-indexed page, clamped to [1, count]. */
  current: number
  /** Total number of pages. */
  count: number
  size: PaginationSize
  variant: PaginationVariant
  disabled: boolean
  /** True when `current <= 1`. */
  isFirst: boolean
  /** True when `current >= count`. */
  isLast: boolean
  /** Navigate to a page (clamped to range; no-op when disabled). */
  goTo: (page: number) => void
  /** Accessible label factory for the built-in buttons. */
  getItemAriaLabel: (
    type: 'page' | 'prev' | 'next' | 'first' | 'last',
    page?: number,
  ) => string
}

export const PaginationContext = createContext<PaginationContextValue | null>(
  null,
)

export function usePaginationContext(
  componentName: string,
): PaginationContextValue {
  const ctx = useContext(PaginationContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Pagination.Root>.`)
  }
  return ctx
}
