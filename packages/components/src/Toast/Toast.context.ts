import { createContext, useContext } from 'react'
import {
  DEFAULT_DURATION,
  DEFAULT_MAX_VISIBLE,
  DEFAULT_POSITION,
} from './Toast.constants'
import type { ToastItem, ToastPosition } from './Toast.types'

/* ── Provider context — viewport reads defaults from here ─────────── */

export interface ToastContextValue {
  defaultPosition: ToastPosition
  defaultDuration: number
  maxVisible: number
}

export const ToastContext = createContext<ToastContextValue>({
  defaultPosition: DEFAULT_POSITION,
  defaultDuration: DEFAULT_DURATION,
  maxVisible: DEFAULT_MAX_VISIBLE,
})

export function useToastContext(): ToastContextValue {
  return useContext(ToastContext)
}

/* ── Viewport context — root reports its measured height upward ──── */

export interface ToastViewportContextValue {
  /** Called by each ToastRoot via ResizeObserver to publish its current
   *  rendered height. The viewport recomputes stacking offsets when
   *  heights change. Calling with the same height is a no-op so cheap
   *  to call on every resize observation. */
  registerHeight: (id: string, height: number) => void
}

export const ToastViewportContext =
  createContext<ToastViewportContextValue | null>(null)

export function useToastViewportContext(): ToastViewportContextValue | null {
  return useContext(ToastViewportContext)
}

/* ── Per-toast context — child parts (Title/Action/Close) read this ─ */

export interface ToastItemContextValue {
  toast: ToastItem
  /** Dismiss the current toast. Triggered by Toast.Close + Toast.Action. */
  dismiss: () => void
  /** Pause the auto-dismiss timer (hover, focus). */
  pause: () => void
  /** Resume the auto-dismiss timer (pointer leave, blur). */
  resume: () => void
}

export const ToastItemContext = createContext<ToastItemContextValue | null>(
  null,
)

export function useToastItemContext(): ToastItemContextValue {
  const ctx = useContext(ToastItemContext)
  if (!ctx) {
    throw new Error(
      'Toast.Title / Toast.Description / Toast.Action / Toast.Close / Toast.Icon must be rendered inside a Toast.',
    )
  }
  return ctx
}
