import { createContext, useContext } from 'react'

export type IconSearchValue = {
  query: string
  setQuery: (q: string) => void
}

export const IconSearchContext = createContext<IconSearchValue | null>(null)

export function useIconSearch(): IconSearchValue {
  const ctx = useContext(IconSearchContext)
  if (!ctx) throw new Error('useIconSearch must be used inside RootLayout')
  return ctx
}
