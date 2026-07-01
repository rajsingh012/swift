import type { HTMLAttributes, ReactNode } from 'react'

export type PaginationSize = 'sm' | 'md' | 'lg'
export type PaginationVariant = 'solid' | 'outline' | 'ghost'

/** A rendered slot: either a real page number or an ellipsis gap. */
export type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis'; key: string }

export interface PaginationClasses {
  root?: string
  list?: string
  item?: string
  ellipsis?: string
  prev?: string
  next?: string
}

export interface PaginationOwnProps {
  /** Total number of pages. */
  count: number
  /** Controlled current page (1-indexed). Pair with `onPageChange`. */
  page?: number
  /** Uncontrolled initial page. @default 1 */
  defaultPage?: number
  /** Fires with the next page on every change. */
  onPageChange?: (page: number) => void

  /** Pages shown on each side of the current page. @default 1 */
  siblingCount?: number
  /** Pages shown at the start and end (the boundaries). @default 1 */
  boundaryCount?: number

  size?: PaginationSize
  variant?: PaginationVariant
  disabled?: boolean

  /** Show the previous/next arrow buttons. @default true */
  showPrevNext?: boolean
  /** Show first/last jump buttons. @default false */
  showFirstLast?: boolean

  /** Accessible label for the nav landmark. @default 'Pagination' */
  'aria-label'?: string

  /** Render-prop label for a page button (screen-reader text). */
  getItemAriaLabel?: (
    type: 'page' | 'prev' | 'next' | 'first' | 'last',
    page?: number,
  ) => string

  classes?: PaginationClasses
  /** Custom glyphs for the control buttons. */
  prevIcon?: ReactNode
  nextIcon?: ReactNode
  firstIcon?: ReactNode
  lastIcon?: ReactNode
}

export type PaginationProps = PaginationOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof PaginationOwnProps | 'children'>
