import type { ToastPosition, ToastType } from './Toast.types'

export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

/* ── Portal wrapper ─────────────────────────────────────────────────
 *  Single root the portal mounts under. Doesn't render anything itself
 *  beyond holding the per-position <ol>s. `pointer-events-none` lets
 *  underlying UI stay clickable; each toast restores `pointer-events`
 *  on itself. */
export const portalWrapperClasses = 'swift-toast-portal pointer-events-none'

/* ── Viewport (one <ol> per position) ───────────────────────────────
 *  Now a *positioning context* for absolute-positioned toast children
 *  rather than a flex container. Width caps at --toast-max-width; height
 *  is driven by the inline --toast-expanded-height var the React side
 *  computes from child heights. Logical inset properties (`start-4` /
 *  `end-4`) so RTL flips left/right positions for free. z-60 sits above
 *  Sheet's z-50. */
const VIEWPORT_BASE =
  'swift-toast-viewport fixed z-[60] w-[var(--toast-width,calc(100vw-2rem))] ' +
  'max-w-[var(--toast-max-width,420px)] p-0 m-0 list-none ' +
  // Pointer-events disabled on the container — `:has(.swift-toast:hover)`
  // still works because it tests the child's hover state, not the <ol>'s.
  // Each toast restores pointer-events: auto on itself.
  'pointer-events-none focus-visible:outline-none ' +
  // Container sizing — height is the full expanded stack height so the
  // hover zone (driven by hovering any child toast) covers everywhere
  // the stack will land when expanded.
  'h-[var(--toast-expanded-height,0px)]'

export const viewportPositionClasses: Record<ToastPosition, string> = {
  'top-left':
    VIEWPORT_BASE +
    ' top-[max(1rem,env(safe-area-inset-top))] start-4',
  'top-center':
    VIEWPORT_BASE +
    ' top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2',
  'top-right':
    VIEWPORT_BASE +
    ' top-[max(1rem,env(safe-area-inset-top))] end-4',
  'bottom-left':
    VIEWPORT_BASE +
    ' bottom-[max(1rem,env(safe-area-inset-bottom))] start-4',
  'bottom-center':
    VIEWPORT_BASE +
    ' bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2',
  'bottom-right':
    VIEWPORT_BASE +
    ' bottom-[max(1rem,env(safe-area-inset-bottom))] end-4',
}

/* ── Toast root (per-item) ──────────────────────────────────────────
 *  `swift-toast` class hooks `theme/toast.css` for animations, the
 *  stacking transform, and tokens. Position:absolute lets CSS drive the
 *  vertical layout — bottom-anchored for bottom positions, top-anchored
 *  for top positions. The grid lays out [icon] [content] [close]; the
 *  body column stretches to fill. */
export const rootClasses =
  'swift-toast pointer-events-auto absolute inset-x-0 group/toast ' +
  'flex w-full items-start gap-3 ' +
  'rounded-[var(--toast-radius,0.625rem)] border border-stroke ' +
  'bg-surface px-4 py-3 text-content-strong ' +
  'shadow-[var(--toast-shadow,0_8px_24px_rgb(0_0_0_/_0.12))] ' +
  'min-w-0 max-w-full will-change-transform'

/** Per-type accents on the root — icon colour + the optional left rule. */
export const rootTypeClasses: Record<ToastType, string> = {
  default: '',
  success: '[--toast-accent:var(--color-content-success)]',
  error: '[--toast-accent:var(--color-content-critical)]',
  warning: '[--toast-accent:var(--color-content-warning)]',
  info: '[--toast-accent:var(--color-content-brand)]',
}

/* Each compound part keeps a stable `swift-toast-*` hook so CSS rules
 * can retarget text/bg per appearance (solid flips to white, unstyled
 * resets to inherit) without each part dragging in a per-appearance
 * variant class list. */
export const iconWrapperClasses =
  'swift-toast-icon shrink-0 inline-flex items-center justify-center mt-0.5 text-[var(--toast-accent,var(--color-content-strong))]'

export const bodyClasses = 'swift-toast-body flex min-w-0 flex-1 flex-col gap-0.5'

export const titleClasses =
  'swift-toast-title text-sm font-semibold leading-5 text-content-strong'

export const descriptionClasses =
  'swift-toast-description text-sm leading-5 text-content-muted [&:not(:first-child)]:mt-0.5'

export const actionClasses =
  'swift-toast-action mt-1 self-start cursor-pointer rounded-md px-2 py-1 text-xs font-semibold ' +
  'text-[var(--toast-accent,var(--color-content-brand))] hover:bg-surface-muted ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-[var(--toast-accent,var(--color-stroke-brand))]'

export const closeClasses =
  'swift-toast-close shrink-0 cursor-pointer rounded-md p-1 text-content-muted ' +
  'hover:bg-surface-muted hover:text-content ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-brand'
