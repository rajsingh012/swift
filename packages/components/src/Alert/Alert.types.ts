import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from 'react'

/** Semantic category. Drives the default icon and the ARIA role
 *  (`error` → `role="alert"`, others → `role="status"`).
 *  Aligned with Switch / Badge naming; Toast uses `type` for the same
 *  axis — known cross-component inconsistency, see CLAUDE memory. */
export type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

export type AlertSize = 'sm' | 'md' | 'lg'

/** Surface treatment.
 *  - `subtle` (default): neutral surface, accent only on the icon.
 *  - `soft`: tinted bg per variant using `--color-surface-{variant}-muted`.
 *  - `solid`: saturated bg per variant; text + icon flip to white.
 *  - `outline`: transparent bg, accent-coloured border.
 *  - `left-accent`: neutral surface with a coloured stripe on the start edge.
 *    Common in enterprise UIs.
 *  - `unstyled`: strips every cosmetic default (bg, border, padding,
 *    border-radius, colour) so consumers can drop in their own surface
 *    via `className` without re-implementing the ARIA wiring or the
 *    dismiss/animation lifecycle. */
export type AlertAppearance =
  | 'subtle'
  | 'soft'
  | 'solid'
  | 'outline'
  | 'left-accent'
  | 'unstyled'

/** Per-slot className overrides — same shape as Switch/Toast. */
export interface AlertClasses {
  root?: string
  icon?: string
  content?: string
  title?: string
  description?: string
  actions?: string
  close?: string
}

/* ── Convenience component (`<Alert>`) ─────────────────────────────
 * The sugar component: takes flat props + children and composes the
 * default Icon + Content + Close layout internally. Reach for it for
 * one-line banners; for finer layout, drop to <Alert.Root>. */

export interface AlertOwnProps {
  variant?: AlertVariant
  size?: AlertSize
  appearance?: AlertAppearance

  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean
  /** Uncontrolled initial state. Default `true`. */
  defaultOpen?: boolean
  /** Fires when the open state changes (e.g. close button clicked). */
  onOpenChange?: (open: boolean) => void

  /** Render the default close button. Implicitly true when `open` or
   *  `onOpenChange` is supplied; explicitly true when uncontrolled and
   *  the alert should still be dismissable. */
  dismissible?: boolean

  /** Title rendered above the children. Convenience for one-line use;
   *  use `<Alert.Title>` for finer control. */
  title?: ReactNode
  /** Override the variant-driven default icon. Pass `null` to suppress. */
  icon?: ReactNode | null
  /** Slot for action buttons rendered between content and close. */
  actions?: ReactNode

  /** Override the auto-derived ARIA role (defaults to `alert` for the
   *  `error` variant, `status` otherwise). */
  role?: 'alert' | 'status'

  classes?: AlertClasses
  children?: ReactNode
}

export type AlertProps = AlertOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof AlertOwnProps | 'role'>

/* ── Compound root (`<Alert.Root>`) ─────────────────────────────────
 * Owns state, ids, and the context provider but renders no chrome of
 * its own beyond the root <div> + a11y attributes. Compose Alert.Icon
 * / Alert.Content / etc. as children. */

export interface AlertRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  variant?: AlertVariant
  size?: AlertSize
  appearance?: AlertAppearance
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Whether nested Alert.Close should render. Default true. */
  dismissible?: boolean
  /** Override the auto-derived ARIA role. */
  role?: 'alert' | 'status'
  classes?: AlertClasses
  children?: ReactNode
}

/* ── Compound parts ─────────────────────────────────────────────── */

export interface AlertIconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Override the variant-driven default. Pass `null` to suppress. */
  children?: ReactNode
}

export type AlertContentProps = HTMLAttributes<HTMLDivElement>
export type AlertTitleProps = HTMLAttributes<HTMLDivElement>
export type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>
export type AlertActionsProps = HTMLAttributes<HTMLDivElement>

export interface AlertCloseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children?: ReactNode
  /** Click handler. Fires before the dismiss; call `event.preventDefault()`
   *  to keep the alert open. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}
