import { createContext, useContext, type ReactNode } from 'react'
import type { BreadcrumbSize } from './Breadcrumb.types'

export interface BreadcrumbContextValue {
  size: BreadcrumbSize
  separator: ReactNode
}

export const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(
  null,
)

export function useBreadcrumb(componentName: string): BreadcrumbContextValue {
  const ctx = useContext(BreadcrumbContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Breadcrumb>.`)
  }
  return ctx
}
