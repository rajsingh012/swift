import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  Ref,
} from 'react'

export type TabsOrientation = 'horizontal' | 'vertical'
export type TabsActivationMode = 'automatic' | 'manual'
export type TabsDirection = 'ltr' | 'rtl'

/**
 * Imperative handle exposed via `apiRef`. Useful when an external control
 * needs to drive the tabs from outside React's render tree.
 */
export interface TabsApi {
  /** Activate a tab by value. Respects disabled triggers — silently no-ops
   *  if the target value isn't registered or is disabled. */
  select: (value: string) => void
  /** Focus a tab by value, or the currently-active tab if value omitted. */
  focus: (value?: string, options?: FocusOptions) => void
  /** Blur whichever trigger currently has focus. */
  blur: () => void
  /** Read the current active value (null if nothing's active yet). */
  getValue: () => string | null
}

export interface TabsClasses {
  root?: string
  list?: string
  trigger?: string
  content?: string
  indicator?: string
}

export interface TabsRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'dir'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void

  orientation?: TabsOrientation
  activationMode?: TabsActivationMode

  /** When true, `<Tabs.Content>` is mounted only while its tab is active. */
  lazyMount?: boolean

  /** When false, arrow-key navigation stops at the first / last trigger
   *  instead of wrapping around. Default true (matches Radix). */
  loop?: boolean

  /** Enable horizontal-swipe gesture on `Tabs.Content` to switch tabs.
   *  Threshold-based: a swipe past 25% of the content's width (or
   *  60 px, whichever is greater) flips to the prev / next tab on
   *  release. Vertical scroll inside panels is preserved via axis
   *  lock — pure vertical drags are ignored. Default false. */
  swipeable?: boolean

  /** Explicit direction. Otherwise sniffed from `closest('[dir]')` on mount. */
  dir?: TabsDirection

  /** Override the generated id prefix used for trigger/content ARIA wiring. */
  id?: string

  /** Imperative handle. See {@link TabsApi}. */
  apiRef?: Ref<TabsApi>

  classes?: TabsClasses
  children?: ReactNode
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable horizontal overflow scrolling. Horizontal orientation only in v1. */
  scrollable?: boolean
  className?: string
  children?: ReactNode
}

export interface TabsTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string
  disabled?: boolean
  /** Render the consumer's single child element instead of a <button>. */
  asChild?: boolean
  className?: string
  children?: ReactNode
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  /** Keep mounted even when this content isn't active. Wins over `lazyMount`. */
  forceMount?: boolean
  className?: string
  children?: ReactNode
}

export interface TabsIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string
}
