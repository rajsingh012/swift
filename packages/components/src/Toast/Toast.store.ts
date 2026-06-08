import {
  DEFAULT_APPEARANCE,
  DEFAULT_DURATION,
  DEFAULT_MAX_VISIBLE,
  DEFAULT_POSITION,
  DEFAULT_TYPE,
} from './Toast.constants'
import type {
  ToastAppearance,
  ToastItem,
  ToastOptions,
  ToastPosition,
} from './Toast.types'
import type { ReactNode } from 'react'

interface StoreDefaults {
  position: ToastPosition
  appearance: ToastAppearance
  duration: number
  maxVisible: number
}

type Listener = () => void

let counter = 0
function nextId(): string {
  counter += 1
  return `swift-toast-${counter}`
}

/**
 * Module-singleton store backing the imperative API. Subscribers (the
 * viewport) read via `getSnapshot`; the store fires `emit()` on every
 * mutation. Stays React-agnostic so `toast(...)` works from anywhere —
 * router loaders, fetch error handlers, anywhere outside a component tree.
 */
class ToastStore {
  private items: readonly ToastItem[] = []
  private listeners = new Set<Listener>()
  private defaults: StoreDefaults = {
    position: DEFAULT_POSITION,
    appearance: DEFAULT_APPEARANCE,
    duration: DEFAULT_DURATION,
    maxVisible: DEFAULT_MAX_VISIBLE,
  }
  /** Mounted provider count. When this drops to zero we clear state so
   *  unmount-then-remount (HMR, route changes) doesn't leak stale toasts. */
  private providers = 0

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Stable reference between mutations so React's useSyncExternalStore
   *  doesn't think state changed on every read. */
  getSnapshot = (): readonly ToastItem[] => this.items

  /** SSR snapshot — no toasts before hydration. */
  getServerSnapshot = (): readonly ToastItem[] => EMPTY

  setDefaults(next: Partial<StoreDefaults>): void {
    this.defaults = { ...this.defaults, ...next }
  }

  getDefaults(): StoreDefaults {
    return this.defaults
  }

  registerProvider(): () => void {
    this.providers += 1
    return () => {
      this.providers -= 1
      if (this.providers === 0) {
        this.items = EMPTY
        this.emit()
      }
    }
  }

  /** Add (or replace by id) a toast. Returns the id. */
  add(message: ReactNode, options: ToastOptions = {}): string {
    const id = options.id ?? nextId()
    const next: ToastItem = {
      id,
      type: options.type ?? DEFAULT_TYPE,
      appearance: options.appearance ?? this.defaults.appearance,
      duration: options.duration ?? this.defaults.duration,
      position: options.position ?? this.defaults.position,
      title: options.title ?? message,
      description: options.description,
      action: options.action,
      icon: options.icon,
      className: options.className,
      createdAt: Date.now(),
      // Explicitly clear any prior exiting flag — useful when a consumer
      // re-fires a toast with the same id (e.g. status updates).
      exiting: false,
    }
    const existingIndex = this.items.findIndex((t) => t.id === id)
    if (existingIndex !== -1) {
      // Replace-in-place keeps stable ordering when consumers reuse ids
      // (e.g. a long-lived "uploading…" toast updated to "uploaded").
      const copy = this.items.slice()
      copy[existingIndex] = next
      this.items = copy
    } else {
      this.items = [...this.items, next]
    }
    this.emit()
    return id
  }

  /** Mark a toast as exiting so its exit transition can play. Pass no
   *  id to mark every toast as exiting. ToastRoot listens for the
   *  resulting `transitionend` and calls `finalize(id)` to fully remove. */
  dismiss(id?: string): void {
    if (id === undefined) {
      if (this.items.length === 0) return
      let changed = false
      this.items = this.items.map((t) => {
        if (t.exiting) return t
        changed = true
        return { ...t, exiting: true }
      })
      if (changed) this.emit()
      return
    }
    const idx = this.items.findIndex((t) => t.id === id)
    if (idx === -1 || this.items[idx].exiting) return
    const copy = this.items.slice()
    copy[idx] = { ...copy[idx], exiting: true }
    this.items = copy
    this.emit()
  }

  /** Fully remove a toast from the store. Called by ToastRoot once the
   *  exit transition has completed (or after the fallback timeout). */
  finalize(id: string): void {
    const before = this.items.length
    this.items = this.items.filter((t) => t.id !== id)
    if (this.items.length !== before) this.emit()
  }

  private emit(): void {
    this.listeners.forEach((l) => l())
  }
}

const EMPTY: readonly ToastItem[] = Object.freeze([])

export const toastStore = new ToastStore()
