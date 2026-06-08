import type { ToastPosition } from './Toast.types'

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
 *  A positioning context for absolute-positioned toast children.
 *  Width caps at --toast-max-width; height is driven by the inline
 *  --toast-expanded-height var the React side computes from child
 *  heights. Logical inset properties (`start-4` / `end-4`) so RTL
 *  flips left/right positions for free. z-60 sits above Sheet's z-50. */
const VIEWPORT_BASE =
  'swift-toast-viewport fixed z-[60] w-[var(--toast-width,calc(100vw-2rem))] ' +
  'max-w-[var(--toast-max-width,420px)] p-0 m-0 list-none ' +
  // Pointer-events disabled on the container — `:has(.swift-toast:hover)`
  // still works because it tests the child's hover state, not the <ol>'s.
  // Each toast restores pointer-events: auto on itself.
  'pointer-events-none focus-visible:outline-none ' +
  // Container sizing — height is the full expanded stack height so the
  // hover zone covers everywhere the stack will land when expanded.
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
 *  Position + stacking + shadow only — bg / border / padding / text /
 *  layout come from the nested `<Alert>` (see ToastRoot.tsx). Keeping
 *  the shadow on the outer <li> lets the per-front-state shadow rules
 *  in `theme/toast.css` cascade cleanly while the Alert inside owns
 *  per-variant / per-appearance colour. */
export const rootClasses =
  'swift-toast pointer-events-auto absolute inset-x-0 ' +
  'rounded-[var(--toast-radius,0.625rem)] ' +
  'shadow-[var(--toast-shadow,0_8px_24px_rgb(0_0_0_/_0.12))] ' +
  'min-w-0 max-w-full will-change-transform'
