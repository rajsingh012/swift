import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import { ALL_POSITIONS } from './Toast.constants'
import {
  ToastViewportContext,
  useToastContext,
  type ToastViewportContextValue,
} from './Toast.context'
import { toastStore } from './Toast.store'
import {
  cx,
  portalWrapperClasses,
  viewportPositionClasses,
} from './Toast.styles'
import type {
  ToastItem,
  ToastPosition,
  ToastViewportProps,
} from './Toast.types'
import { ToastPortal } from './ToastPortal'
import { ToastRoot } from './ToastRoot'

/** Vertical gap between stacked toasts in the expanded state. Must
 *  match the `--toast-gap` default in theme/toast.css — the JS-side
 *  cumulative offset and the CSS-side visual gap need to agree for
 *  expanded-state positions to line up exactly. */
const GAP_PX = 12

/** Fallback height for a toast whose ResizeObserver hasn't reported yet.
 *  Used for one frame at mount — the real height takes over immediately
 *  after the first observation. */
const FALLBACK_HEIGHT_PX = 64

interface BucketRow {
  item: ToastItem
  index: number
  total: number
  offset: number
}

/**
 * Subscribes to the singleton store and renders one positioned <ol> per
 * non-empty position. Each toast is `position: absolute` inside its
 * bucket so we can drive its stacking position with transforms.
 *
 * The viewport owns:
 * - **Heights map**: each child reports its rendered height via the
 *   viewport context (ResizeObserver-driven). The map is React state so
 *   offsets recompute on resize / content reflow.
 * - **Cumulative offsets**: per-toast pixel distance from the front of
 *   the stack — used in the expanded (hover) state.
 * - **Hover-area sizing**: each <ol>'s height equals the full expanded
 *   stack height so the pointer-hover zone always covers the area the
 *   stack *will* occupy when expanded.
 * - **Exit choreography**: items flagged `exiting` in the store keep
 *   rendering (so their exit transition plays) but are excluded from the
 *   visible bucket's index assignment. Remaining non-exiting items
 *   reindex immediately and slide into the vacated slot *in parallel*
 *   with the exit, rather than after it.
 *
 * Stack ordering: oldest-first (FIFO). The oldest visible toast is the
 * "front" at index 0 (full scale, anchored to the viewport edge); newer
 * ones recede behind. Items past `maxVisible` stay queued and promote
 * automatically as front toasts dismiss.
 */
export const ToastViewport = forwardRef<HTMLOListElement, ToastViewportProps>(
  function ToastViewport(
    { position, container, wrapperClassName, className, style, ...rest },
    ref,
  ) {
    const { maxVisible } = useToastContext()
    const items = useSyncExternalStore(
      toastStore.subscribe,
      toastStore.getSnapshot,
      toastStore.getServerSnapshot,
    )

    const [heights, setHeights] = useState<Record<string, number>>({})

    const registerHeight = useCallback((id: string, height: number) => {
      setHeights((prev) => {
        if (prev[id] === height) return prev
        return { ...prev, [id]: height }
      })
    }, [])

    const viewportCtx = useMemo<ToastViewportContextValue>(
      () => ({ registerHeight }),
      [registerHeight],
    )

    // Per-position render plan: visible non-exiting toasts get assigned
    // indices + offsets; exiting toasts (still mid-transition) are
    // tracked separately so they keep rendering without participating
    // in the live stack.
    const plans = useMemo(
      () => planByPosition(items, heights, maxVisible, position),
      [items, heights, maxVisible, position],
    )

    // Orphan exiting cleanup. A queued (never-rendered) toast that gets
    // dismissed has no transition to wait on, so nothing in the system
    // would ever call `finalize` for it — without this effect it would
    // leak in the store as `exiting: true`. We finalize on next tick.
    useEffect(() => {
      for (const item of items) {
        if (item.exiting && heights[item.id] === undefined) {
          toastStore.finalize(item.id)
        }
      }
    }, [items, heights])

    return (
      <ToastPortal container={container}>
        <ToastViewportContext.Provider value={viewportCtx}>
          <div className={cx(portalWrapperClasses, wrapperClassName)}>
            {ALL_POSITIONS.map((pos) => {
              if (position && pos !== position) return null
              const plan = plans.get(pos)
              if (!plan || (plan.visible.length === 0 && plan.exiting.length === 0)) {
                return null
              }

              const olStyle: CSSPropertiesWithVars = {
                '--toast-expanded-height': `${plan.expandedHeight}px`,
                '--toast-total': String(plan.visible.length),
                ...(position === pos ? style : null),
              }

              return (
                <ol
                  key={pos}
                  ref={position === pos ? ref : undefined}
                  data-position={pos}
                  data-count={plan.visible.length}
                  aria-label={`Notifications (${pos})`}
                  className={cx(viewportPositionClasses[pos], className)}
                  style={olStyle}
                  {...(position === pos ? rest : {})}
                >
                  {plan.visible.map((row) => (
                    <ToastRoot
                      key={row.item.id}
                      toast={row.item}
                      index={row.index}
                      total={row.total}
                      offset={row.offset}
                    />
                  ))}
                  {plan.exiting.map((item) => (
                    // Exiting toasts get index 0 / offset 0 — the CSS
                    // `[data-state="closed"]` rule overrides the resting
                    // transform anyway, so these values are inert here.
                    <ToastRoot
                      key={item.id}
                      toast={item}
                      index={0}
                      total={1}
                      offset={0}
                    />
                  ))}
                </ol>
              )
            })}
          </div>
        </ToastViewportContext.Provider>
      </ToastPortal>
    )
  },
)
ToastViewport.displayName = 'ToastViewport'

/* ---- helpers ----------------------------------------------------- */

interface PositionPlan {
  visible: BucketRow[]
  exiting: ToastItem[]
  expandedHeight: number
}

/** Build the per-position render plan: visible non-exiting toasts get
 *  numbered indices and cumulative offsets; exiting toasts are kept
 *  rendered separately. Items beyond `maxVisible` stay queued. */
function planByPosition(
  items: readonly ToastItem[],
  heights: Record<string, number>,
  maxVisible: number,
  only?: ToastPosition,
): Map<ToastPosition, PositionPlan> {
  const plans = new Map<ToastPosition, PositionPlan>()

  for (const item of items) {
    if (only && item.position !== only) continue
    let plan = plans.get(item.position)
    if (!plan) {
      plan = { visible: [], exiting: [], expandedHeight: 0 }
      plans.set(item.position, plan)
    }
    if (item.exiting) {
      // Only render exiting items we've previously measured — orphans
      // (queued items that were dismissed before mounting) finalize via
      // ToastRoot's fallback timeout and never render.
      if (heights[item.id] !== undefined) plan.exiting.push(item)
      continue
    }
    if (plan.visible.length >= maxVisible) continue
    plan.visible.push({ item, index: plan.visible.length, total: 0, offset: 0 })
  }

  // Second pass — fill in cumulative offsets and per-row `total` now
  // that we know each bucket's final visible count.
  for (const plan of plans.values()) {
    let cumulative = 0
    for (let i = 0; i < plan.visible.length; i++) {
      const row = plan.visible[i]
      row.offset = cumulative
      row.total = plan.visible.length
      const h = heights[row.item.id] ?? FALLBACK_HEIGHT_PX
      cumulative += h + GAP_PX
    }
    plan.expandedHeight = Math.max(0, cumulative - GAP_PX)
  }

  return plans
}
