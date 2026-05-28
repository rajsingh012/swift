import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from 'react'

export type ListItemSize = 'sm' | 'md' | 'lg'

/**
 * Vertical breathing room around the content. Independent of `size`:
 * `size` scales typography and the leading/trailing slot dimensions,
 * `density` only changes top/bottom padding — so a compact row at
 * `size="md"` still gets a comfortably sized title and avatar.
 */
export type ListItemDensity = 'compact' | 'comfortable' | 'spacious'

export type ListItemAlign = 'start' | 'center' | 'end'

/**
 * Layout direction of the row's slots.
 *
 *   horizontal — leading · content · trailing (default)
 *   vertical   — leading on top, content below; ideal for model pickers,
 *                plan selectors, file thumbnails. Leading stretches to
 *                full width and the touch-target floor is dropped because
 *                vertical cells are tall by construction.
 */
export type ListItemOrientation = 'horizontal' | 'vertical'

export interface ListItemClasses {
  root?: string
  leading?: string
  content?: string
  title?: string
  description?: string
  trailing?: string
  actions?: string
}

export interface ListItemOwnProps {
  /** Convenience text for the title slot when not composing children. */
  title?: ReactNode
  /** Convenience text for the description slot when not composing children. */
  description?: ReactNode

  size?: ListItemSize
  density?: ListItemDensity
  /** Vertical alignment of the leading + trailing slots against the content stack. */
  align?: ListItemAlign
  /** Slot layout direction. `vertical` stacks leading-on-top for card grids. */
  orientation?: ListItemOrientation

  /**
   * Adds button semantics, hover background, focus ring and Enter/Space
   * activation. Picks `<button>` by default; combine with `as` / `asChild`
   * to opt into a different element (e.g. `<a>` for nav links).
   */
  clickable?: boolean

  /** Visually selected — e.g. multi-select rows, current settings choice. */
  selected?: boolean
  /** Current navigation target — sets `aria-current="page"`. */
  active?: boolean
  /** Blocks interaction; mirrors disabled chrome on the row. */
  disabled?: boolean

  /** Replaces children with a skeleton row and sets `aria-busy`. */
  loading?: boolean

  /** Adds a hairline bottom border. Prefer managing dividers at the List level. */
  divider?: boolean

  /**
   * Render the single child element as the root, merging props onto it.
   * Useful with routing libraries: `<ListItem asChild><Link to="/" /></ListItem>`.
   */
  asChild?: boolean

  classes?: ListItemClasses
}

/* ── Polymorphic helpers (mirrors Card) ─────────────────────────── */

type AsProp<E extends ElementType> = { as?: E }

type PropsToOmit<E extends ElementType, P> = keyof (AsProp<E> & P)

export type PolymorphicProps<E extends ElementType, P = object> = P &
  AsProp<E> &
  Omit<ComponentPropsWithoutRef<E>, PropsToOmit<E, P>>

export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>['ref']

export type ListItemProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  ListItemOwnProps
> & { ref?: PolymorphicRef<E> }

export type ListItemComponent = <E extends ElementType = 'div'>(
  props: ListItemProps<E>,
) => ReactNode

/* ── Compound part props ────────────────────────────────────────── */

export interface ListItemLeadingProps extends HTMLAttributes<HTMLDivElement> {
  /** Vertical alignment override; defaults to the row's `align`. */
  align?: ListItemAlign
}

export interface ListItemContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface ListItemTitleProps extends HTMLAttributes<HTMLElement> {
  /** Heading or paragraph element used for the title. Defaults to `<span>`. */
  as?: 'span' | 'p' | 'div' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /** Clamps the title to a single line with ellipsis. @default true */
  truncate?: boolean
}

export interface ListItemDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  /** Clamp lines (1–3) using `-webkit-line-clamp`. */
  lines?: 1 | 2 | 3
}

export interface ListItemTrailingProps extends HTMLAttributes<HTMLDivElement> {
  align?: ListItemAlign
}

export interface ListItemActionsProps extends HTMLAttributes<HTMLDivElement> {}

/* ── List container ─────────────────────────────────────────────── */

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Renders dividers between every child (managed at container level). */
  dividers?: boolean
  /** Outer chrome — `bordered` adds a wrapping border + radius. */
  variant?: 'plain' | 'bordered'
  /** Cascades `size` to every ListItem in this list. */
  size?: ListItemSize
  /** Cascades `density` to every ListItem in this list. */
  density?: ListItemDensity
  /** Override the rendered element. Defaults to `<ul>`. */
  as?: 'ul' | 'ol' | 'div'
}
