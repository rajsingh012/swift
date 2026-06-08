import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type TransitionEvent,
} from 'react'
import { Alert } from '../Alert'
import type { CSSPropertiesWithVars } from '../internal/types'
import { useToastViewportContext } from './Toast.context'
import { toastStore } from './Toast.store'
import { cx, rootClasses } from './Toast.styles'
import type { ToastItem, ToastRootProps, ToastType } from './Toast.types'

/** Belt-and-braces against `transitionend` never firing — covers
 *  `transition: none`, display:none mid-exit, or browser quirks. Slightly
 *  longer than the CSS --toast-duration so the event normally wins. */
const EXIT_FALLBACK_MS = 600

const ALERT_TYPES: ReadonlySet<ToastType> = new Set(['error'])

export const ToastRoot = forwardRef<HTMLLIElement, ToastRootProps>(
  function ToastRoot(
    { toast, index = 0, total = 1, offset = 0, className, children, style, ...rest },
    forwardedRef,
  ) {
    // `open` is derived from the store flag, not local state — so the
    // viewport's reindex (when another toast starts exiting) can update
    // *this* toast's index in parallel with the exit transition of its
    // sibling. Local state would couple exit ownership to one component.
    const open = !toast.exiting
    const viewportCtx = useToastViewportContext()
    const liRef = useRef<HTMLLIElement | null>(null)

    /* ── ref fan-out ───────────────────────────────────────────────
     * Internal ref drives ResizeObserver; consumer ref is forwarded so
     * external focus / measurement still works. */
    const setLiRef = useCallback(
      (node: HTMLLIElement | null) => {
        liRef.current = node
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef],
    )

    /* ── Height measurement ───────────────────────────────────────
     * Two-phase: useLayoutEffect for the synchronous seed measurement
     * (so the *first* paint after mount uses the real height instead of
     * the viewport's fallback), then a regular effect that wires the
     * ResizeObserver for subsequent content reflow. Read `offsetHeight`
     * (not `getBoundingClientRect().height`) so the entry keyframe's
     * starting `scale(0.9)` doesn't pollute the layout-box measurement —
     * see comment in the original implementation pre-Alert refactor. */
    useLayoutEffect(() => {
      if (!open) return
      const node = liRef.current
      if (!node || !viewportCtx) return
      viewportCtx.registerHeight(toast.id, node.offsetHeight)
    }, [toast.id, viewportCtx, open])

    useEffect(() => {
      if (!open) return
      const node = liRef.current
      if (!node || !viewportCtx) return
      const ro = new ResizeObserver(() => {
        viewportCtx.registerHeight(toast.id, node.offsetHeight)
      })
      ro.observe(node)
      return () => ro.disconnect()
    }, [toast.id, viewportCtx, open])

    /* ── Auto-dismiss timer ───────────────────────────────────────
     * Refs (not state) so pause/resume don't re-render and the
     * remaining-time math survives stale closures. Infinity disables. */
    const remainingRef = useRef<number>(toast.duration)
    const startedAtRef = useRef<number>(0)
    const timerRef = useRef<number | null>(null)

    const startExit = useCallback(() => {
      toastStore.dismiss(toast.id)
    }, [toast.id])

    const startTimer = useCallback(() => {
      if (!Number.isFinite(remainingRef.current)) return
      if (remainingRef.current <= 0) {
        startExit()
        return
      }
      startedAtRef.current = Date.now()
      timerRef.current = window.setTimeout(startExit, remainingRef.current)
    }, [startExit])

    const clearTimer = useCallback(() => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }, [])

    const pause = useCallback(() => {
      if (timerRef.current == null) return
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAtRef.current),
      )
      clearTimer()
    }, [clearTimer])

    const resume = useCallback(() => {
      if (timerRef.current != null || !open) return
      startTimer()
    }, [open, startTimer])

    useEffect(() => {
      if (!open) {
        clearTimer()
        return
      }
      startTimer()
      return clearTimer
    }, [open, startTimer, clearTimer])

    /* ── Exit completion ──────────────────────────────────────────
     * `transitionend` fires once per animated property; filter on
     * `transform` so we finalize after the slide-out actually lands.
     * The fallback timeout covers reduced-motion / display:none paths
     * where the event might be suppressed. */
    useEffect(() => {
      if (open) return
      const fallback = window.setTimeout(() => {
        toastStore.finalize(toast.id)
      }, EXIT_FALLBACK_MS)
      return () => clearTimeout(fallback)
    }, [open, toast.id])

    const handleTransitionEnd = (event: TransitionEvent<HTMLLIElement>) => {
      if (open) return
      if (event.target !== event.currentTarget) return
      if (event.propertyName !== 'transform') return
      toastStore.finalize(toast.id)
    }

    /* ── Hover / focus pause ──────────────────────────────────────
     * onFocus / onBlur bubble (focusin/focusout), so this catches focus
     * inside the toast — e.g. tabbing into the action button. */
    const handleFocus = (_event: FocusEvent<HTMLLIElement>) => {
      pause()
    }
    const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
      // Focus moving inside the same toast (e.g. action → close): keep paused.
      if (
        event.relatedTarget instanceof Node &&
        event.currentTarget.contains(event.relatedTarget)
      ) {
        return
      }
      resume()
    }

    // CSS reads --toast-index for the collapsed-state transform formula
    // and --toast-offset for the expanded-state translate. --toast-total
    // is set on the viewport <ol> and inherits down.
    const inlineStyle: CSSPropertiesWithVars = {
      '--toast-index': String(index),
      '--toast-offset': `${offset}px`,
      // Stacking context — front (index 0) sits above behind toasts so it
      // renders on top of them when collapsed.
      zIndex: 100 - index,
      ...style,
    }
    void total // accepted for prop compatibility; consumed via --toast-total on the viewport

    const role = ALERT_TYPES.has(toast.type) ? 'alert' : 'status'
    const ariaLive = role === 'alert' ? 'assertive' : 'polite'

    /* ── Visual layer ──────────────────────────────────────────────
     * `<Alert>` provides the icon + content + action + close chrome,
     * the per-variant accents, and the per-appearance backgrounds.
     * Toast owns positioning, stacking, the timer, and the dismiss
     * lifecycle; the nested Alert is purely a skin.
     *
     * Compound mode (children include Alert.* parts) so Alert doesn't
     * auto-compose its own defaults — we want explicit control over
     * which slots render based on the toast's options.
     *
     * Alert.Close is wired to `startExit` with `preventDefault()` so
     * Alert's own close path is bypassed — the Toast owns dismissal. */
    return (
      <li
        ref={setLiRef}
        // ARIA lives on the <li> (not on Alert) because the screen-reader
        // region is the toast itself; the inner Alert is just visual.
        role={role}
        aria-live={ariaLive}
        aria-atomic="true"
        data-type={toast.type}
        data-state={open ? 'open' : 'closed'}
        data-position={toast.position}
        data-front={index === 0 ? 'true' : 'false'}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTransitionEnd={handleTransitionEnd}
        className={cx(rootClasses, className, toast.className)}
        style={inlineStyle}
        {...rest}
      >
        {children ?? renderAlertContent(toast, startExit)}
      </li>
    )
  },
)
ToastRoot.displayName = 'Toast'

function renderAlertContent(
  toast: ToastItem,
  startExit: () => void,
): ReactNode {
  const hasIcon = toast.icon !== null
  const hasTitle = toast.title !== undefined && toast.title !== null
  const hasDescription =
    toast.description !== undefined && toast.description !== null

  const handleActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    toast.action?.onClick(event)
  }

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Suppress Alert's internal close — the Toast owns the dismiss path
    // (so the stacking choreography fires correctly). We don't want
    // Alert's open state flipping false because that would trigger
    // Alert's own exit animation in parallel with Toast's.
    event.preventDefault()
    startExit()
  }

  return (
    <Alert
      variant={toast.type}
      appearance={toast.appearance}
      // role lives on the parent <li>; suppress here by setting `status`
      // (the default) and letting the <li>'s aria-live drive announcement.
      role="status"
      // dismissible so <Alert.Close> renders even though we don't actually
      // hand it Alert's own close — onClick.preventDefault() takes over.
      dismissible
    >
      {hasIcon ? <Alert.Icon>{toast.icon ?? undefined}</Alert.Icon> : null}
      <Alert.Content>
        {hasTitle ? <Alert.Title>{toast.title}</Alert.Title> : null}
        {hasDescription ? (
          <Alert.Description>{toast.description}</Alert.Description>
        ) : null}
      </Alert.Content>
      {toast.action ? (
        <Alert.Actions>
          <button
            type="button"
            onClick={handleActionClick}
            className={
              'cursor-pointer rounded-md px-2 py-1 text-xs font-semibold ' +
              'text-[var(--alert-accent,var(--color-content-brand))] ' +
              'hover:bg-surface-muted ' +
              'focus-visible:outline-2 focus-visible:outline-offset-2 ' +
              'focus-visible:outline-[var(--alert-accent,var(--color-stroke-brand))]'
            }
          >
            {toast.action.label}
          </button>
        </Alert.Actions>
      ) : null}
      <Alert.Close onClick={handleCloseClick} />
    </Alert>
  )
}
