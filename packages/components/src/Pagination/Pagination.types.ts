import type { HTMLAttributes, ReactNode } from 'react'
import type { RenderProp } from '../internal/props'

export type PaginationSize = 'sm' | 'md' | 'lg'
export type PaginationVariant = 'solid' | 'outline' | 'ghost'

/** A rendered slot: either a real page number or an ellipsis gap. */
export type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis'; key: string }

/** Which prev/next/first/last control a `renderControl` call is for. */
export type PaginationControl = 'prev' | 'next' | 'first' | 'last'

/**
 * State handed to `renderItem` for one slot in the page list — either a
 * page button or an ellipsis gap. Enough to draw and wire up the slot
 * without any extra props.
 */
export type PaginationItemRenderProps = {
  /** `'page'` for a numbered button, `'ellipsis'` for a collapsed gap. */
  type: 'page' | 'ellipsis'
  /** The 1-indexed page number. Present only when `type === 'page'`. */
  page?: number
  /** Whether this page is the current one. `false` for ellipsis. */
  selected: boolean
  /** Whether the whole pagination is disabled. */
  disabled: boolean
  /** Navigate to this item's page. No-op for ellipsis. */
  goTo: () => void
}

/**
 * State handed to `renderControl` for one of the prev/next/first/last
 * navigation buttons.
 */
export type PaginationControlRenderProps = {
  /** Which control this is. */
  control: PaginationControl
  /** The page this control jumps to. */
  page: number
  /** Whether this control is unavailable (e.g. `prev` on the first page). */
  disabled: boolean
  /** Navigate to this control's target page. */
  goTo: () => void
}

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

  /**
   * Render-prop for each page/ellipsis slot: build your own item UI from
   * its state (the library-wide `render*` convention). Called once per
   * slot with `{ type, page, selected, disabled, goTo }`; pass a node to
   * reuse one UI for every slot, or a function for state-aware items.
   * When provided, it supersedes the default page-button / ellipsis
   * rendering. You render the interactive element — the wrapping `<li>`
   * is still provided. Prefer this over `classes.item` when restyling
   * isn't enough.
   */
  renderItem?: RenderProp<PaginationItemRenderProps>
  /**
   * Render-prop for the prev/next/first/last controls: build your own
   * control UI from `{ control, page, disabled, goTo }`. When provided it
   * supersedes the default chevron buttons (and the `*Icon` props), but
   * still respects `showPrevNext` / `showFirstLast` for which controls
   * appear. The wrapping `<li>` is provided.
   */
  renderControl?: RenderProp<PaginationControlRenderProps>

  /**
   * Compound children. When provided, they are rendered inside the `<nav>`
   * landmark instead of the auto-generated page list — compose with
   * `Pagination.List`, `Pagination.Item`, `Pagination.Previous`, etc. When
   * omitted, the component auto-renders the full control from `count`/`page`.
   */
  children?: ReactNode
}

export type PaginationProps = PaginationOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof PaginationOwnProps | 'children'>
