import { createContext, useContext } from 'react'
import {
  DEFAULT_ALIGN,
  DEFAULT_DENSITY,
  DEFAULT_ORIENTATION,
  DEFAULT_SIZE,
} from './ListItem.constants'
import type {
  ListItemAlign,
  ListItemDensity,
  ListItemOrientation,
  ListItemSize,
} from './ListItem.types'

export interface ListItemContextValue {
  size: ListItemSize
  density: ListItemDensity
  align: ListItemAlign
  orientation: ListItemOrientation
  disabled: boolean
}

export const ListItemContext = createContext<ListItemContextValue | null>(null)

/**
 * Compound parts read row metadata from context so a single set of props
 * on the root cascades to every slot (Leading / Content / Title / …).
 * When a part is rendered outside a ListItem, defaults still produce a
 * sensible row — so consumers can use `<ListItem.Title>` inside their
 * own layouts.
 */
export function useListItemContext(): ListItemContextValue {
  return (
    useContext(ListItemContext) ?? {
      size: DEFAULT_SIZE,
      density: DEFAULT_DENSITY,
      align: DEFAULT_ALIGN,
      orientation: DEFAULT_ORIENTATION,
      disabled: false,
    }
  )
}

/* ── List container context ─────────────────────────────────────── */

export interface ListContextValue {
  size?: ListItemSize
  density?: ListItemDensity
  /** True when the parent List is rendering dividers between items. */
  dividers: boolean
}

export const ListContext = createContext<ListContextValue | null>(null)

export function useListContext(): ListContextValue | null {
  return useContext(ListContext)
}
