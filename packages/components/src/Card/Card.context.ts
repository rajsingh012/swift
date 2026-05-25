import { createContext, useContext } from 'react'
import { DEFAULT_SIZE } from './Card.constants'
import type { CardSize } from './Card.types'

export interface CardContextValue {
  size: CardSize
}

export const CardContext = createContext<CardContextValue | null>(null)

/**
 * Compound parts read the Card size from context so a single `size` on
 * the root cascades to Header / Content / Footer / Actions / Title
 * without prop drilling. When a compound part is used outside a Card,
 * we fall back to the default — it still renders sensibly.
 */
export function useCardContext(): CardContextValue {
  return useContext(CardContext) ?? { size: DEFAULT_SIZE }
}
