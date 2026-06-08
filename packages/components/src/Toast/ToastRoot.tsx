import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type FocusEvent,
  type ReactNode,
  type TransitionEvent,
} from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import {
  ToastItemContext,
  useToastViewportContext,
  type ToastItemContextValue,
} from './Toast.context'
import { toastStore } from './Toast.store'
import { bodyClasses, cx, rootClasses, rootTypeClasses } from './Toast.styles'
import type { ToastItem, ToastRootProps, ToastType } from './Toast.types'
import { ToastAction } from './ToastAction'
import { ToastClose } from './ToastClose'
import { ToastDescription } from './ToastDescription'
import { ToastIcon } from './ToastIcon'
import { ToastTitle } from './ToastTitle'

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
     * the viewport's fallback — otherwise the first hover would expand
     * to wrong offsets), then a regular effect that wires the
     * ResizeObserver for subsequent content reflow. Skipped once we
     * start exiting — height won't change before unmount and a phantom
     * reading would perturb sibling offsets mid-slide.
     *
     * **Critical:** must read `offsetHeight`, not `getBoundingClientRect().height`.
     * The enter @keyframes starts at `scale(0.9)` so the bounding-client
     * rect reflects the *scaled* size on first measurement — publishing
     * that 90% height would make the next-toast offset short by ~10%,
     * collapsing the visible expanded-state gap. `offsetHeight` is the
     * layout border-box, unaffected by transforms — the size we need
     * for stacking math. ResizeObserver's `contentRect` has the same
     * problem indirectly (excludes padding/border), so we re-read
     * `offsetHeight` in the observer callback too. */
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
     * onTransitionEnd fires once per animated property; filter on
     * `transform` so we finalize after the slide-out actually lands.
     * The fallback timeout covers reduced-motion / display:none paths
     * where the event might be suppressed. Both call `finalize` (not
     * `dismiss`) — dismiss already happened to mark this exiting. */
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

    /* ── Per-item context for compound parts ──────────────────── */
    const itemCtx = useMemo<ToastItemContextValue>(
      () => ({ toast, dismiss: startExit, pause, resume }),
      [toast, startExit, pause, resume],
    )

    const role = ALERT_TYPES.has(toast.type) ? 'alert' : 'status'
    const ariaLive = role === 'alert' ? 'assertive' : 'polite'

    // CSS reads --toast-index for the collapsed-state transform formula
    // and --toast-offset for the expanded-state translate. --toast-total
    // is set on the viewport <ol> and inherits down — no need to set it
    // per toast (avoids a per-toast inline-style update on every stack
    // change, which can trip a style recalc on toasts that aren't moving).
    const inlineStyle: CSSPropertiesWithVars = {
      '--toast-index': String(index),
      '--toast-offset': `${offset}px`,
      // Stacking context — front (index 0) sits above behind toasts so it
      // renders on top of them when collapsed.
      zIndex: 100 - index,
      ...style,
    }
    void total // accepted for prop compatibility; consumed via --toast-total on the viewport

    return (
      <ToastItemContext.Provider value={itemCtx}>
        <li
          ref={setLiRef}
          role={role}
          aria-live={ariaLive}
          aria-atomic="true"
          data-type={toast.type}
          data-appearance={toast.appearance}
          data-state={open ? 'open' : 'closed'}
          data-position={toast.position}
          data-front={index === 0 ? 'true' : 'false'}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onTransitionEnd={handleTransitionEnd}
          className={cx(
            rootClasses,
            rootTypeClasses[toast.type],
            className,
            toast.className,
          )}
          style={inlineStyle}
          {...rest}
        >
          {children ?? renderDefaultContent(toast)}
        </li>
      </ToastItemContext.Provider>
    )
  },
)
ToastRoot.displayName = 'Toast'

function renderDefaultContent(toast: ToastItem): ReactNode {
  const hasIcon = toast.icon !== null
  const hasTitle = toast.title !== undefined && toast.title !== null
  const hasDescription =
    toast.description !== undefined && toast.description !== null
  return (
    <>
      {hasIcon ? <ToastIcon /> : null}
      <div className={bodyClasses}>
        {hasTitle ? <ToastTitle>{toast.title}</ToastTitle> : null}
        {hasDescription ? (
          <ToastDescription>{toast.description}</ToastDescription>
        ) : null}
        {toast.action ? (
          <ToastAction onClick={toast.action.onClick}>
            {toast.action.label}
          </ToastAction>
        ) : null}
      </div>
      <ToastClose />
    </>
  )
}
