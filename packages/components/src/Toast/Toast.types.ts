import type {
  HTMLAttributes,
  MouseEvent,
  OlHTMLAttributes,
  ReactNode,
} from 'react'
import type { AlertAppearance } from '../Alert/Alert.types'

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/** Alias for `AlertAppearance` — Toast's visual layer is a nested
 *  `<Alert>`, so the appearance vocabulary stays in sync. Existing
 *  `'subtle' | 'soft' | 'solid' | 'unstyled'` callers keep working;
 *  `'outline'` and `'left-accent'` come along for the ride. */
export type ToastAppearance = AlertAppearance

export interface ToastActionConfig {
  label: ReactNode
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

/** Options accepted by the imperative API (`toast(...)`). */
export interface ToastOptions {
  /** Stable id. Used as the React key + dismiss target. Generated if omitted.
   *  Passing the same id twice replaces the existing toast in place rather
   *  than appending a duplicate. */
  id?: string
  /** Visual + a11y category. Default 'default'. */
  type?: ToastType
  /** Surface treatment. Default `'subtle'` (or the provider's setting). */
  appearance?: ToastAppearance
  /** Primary line. When called as `toast(message)`, the message arg is used
   *  as the title unless this is set explicitly. */
  title?: ReactNode
  /** Secondary line. */
  description?: ReactNode
  /** Single inline action button. */
  action?: ToastActionConfig
  /** ms before auto-dismiss. Use `Infinity` to disable auto-dismiss. */
  duration?: number
  /** Position override for this single toast. Defaults to the provider's. */
  position?: ToastPosition
  /** Override the type-driven icon. Pass `null` to suppress the icon entirely. */
  icon?: ReactNode | null
  /** Extra class applied to the ToastRoot <li>. */
  className?: string
}

/** Resolved toast inside the store. All defaults filled in. */
export interface ToastItem {
  id: string
  type: ToastType
  appearance: ToastAppearance
  duration: number
  position: ToastPosition
  title?: ReactNode
  description?: ReactNode
  action?: ToastActionConfig
  /** undefined → fall back to the type-driven default icon.
   *  null → suppress the icon entirely. */
  icon?: ReactNode | null
  className?: string
  /** ms epoch when the toast was added. Used for stacking order + queue
   *  promotion. */
  createdAt: number
  /** Set by `dismiss(id)`. The toast stays in the store while its exit
   *  transition plays so remaining visible toasts can reindex (and slide
   *  into the vacated slot) *in parallel* with the exit, not after it.
   *  ToastRoot calls `finalize(id)` on `transitionend` to fully remove. */
  exiting?: boolean
}

export interface ToastProviderProps {
  children: ReactNode
  /** Default position for all toasts. Default 'bottom-right'. */
  position?: ToastPosition
  /** Default appearance for all toasts. Per-toast `appearance` overrides
   *  this. Default `'subtle'`. */
  appearance?: ToastAppearance
  /** Default duration in ms. Default 5000. `Infinity` disables auto-dismiss. */
  duration?: number
  /** Max visible toasts per position. Extras wait in a FIFO queue and
   *  promote when a visible toast dismisses. Default 3. */
  maxVisible?: number
  /** Render a default <ToastViewport /> alongside the children. Set to
   *  false to place the viewport manually. Default true. */
  renderViewport?: boolean
}

export interface ToastViewportProps
  extends OlHTMLAttributes<HTMLOListElement> {
  /** Render only the toasts at this position. When omitted, one viewport
   *  per position is rendered (the default in <ToastProvider>). */
  position?: ToastPosition
  /** Portal target. Default `document.body`. */
  container?: HTMLElement
  /** Optional class applied to the portal wrapper that holds every per-
   *  position <ol>. Use to nudge stacking or apply safe-area padding. */
  wrapperClassName?: string
}

export interface ToastRootProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
  toast: ToastItem
  /** Stacking index from the front (0 = closest to viewport edge). Set by
   *  the viewport; safe to omit when rendering a toast standalone. */
  index?: number
  /** Total visible toasts in the same position bucket. Used to set
   *  `--toast-total` for relative scale calculations. */
  total?: number
  /** Cumulative pixel offset from the front toast (sum of heights of
   *  in-front toasts + gaps), used in the expanded state. Set by the
   *  viewport via inline style — only consumed by CSS. */
  offset?: number
  /** Override the default visual layer (the nested `<Alert>`). Pass
   *  custom JSX here for fully custom toast rendering while keeping the
   *  Toast's stacking + lifecycle. */
  children?: ReactNode
}

/** Imperative API surfaced from `import { toast } from '@swift/components/Toast'`. */
export interface ToastApi {
  (message: ReactNode, options?: ToastOptions): string
  success: (message: ReactNode, options?: ToastOptions) => string
  error: (message: ReactNode, options?: ToastOptions) => string
  warning: (message: ReactNode, options?: ToastOptions) => string
  info: (message: ReactNode, options?: ToastOptions) => string
  /** Dismiss a specific toast by id, or all toasts when called with no arg. */
  dismiss: (id?: string) => void
}
