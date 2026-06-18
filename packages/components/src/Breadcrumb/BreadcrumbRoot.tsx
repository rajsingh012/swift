import { forwardRef, useMemo } from 'react'
import { DEFAULT_SEPARATOR, DEFAULT_SIZE } from './Breadcrumb.constants'
import {
  BreadcrumbContext,
  type BreadcrumbContextValue,
} from './Breadcrumb.context'
import type { BreadcrumbRootProps } from './Breadcrumb.types'

/**
 * Breadcrumb root — a `<nav>` landmark labelled "Breadcrumb". Provides the
 * shared `size` and default `separator` to its parts. Compose a
 * `<Breadcrumb.List>` of `<Breadcrumb.Item>`s inside it.
 */
export const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbRootProps>(
  function Breadcrumb(props, ref) {
    const {
      size = DEFAULT_SIZE,
      separator = DEFAULT_SEPARATOR,
      'aria-label': ariaLabel = 'Breadcrumb',
      children,
      ...rest
    } = props

    const ctx = useMemo<BreadcrumbContextValue>(
      () => ({ size, separator }),
      [size, separator],
    )

    return (
      <BreadcrumbContext.Provider value={ctx}>
        <nav ref={ref} aria-label={ariaLabel} {...rest}>
          {children}
        </nav>
      </BreadcrumbContext.Provider>
    )
  },
)
BreadcrumbRoot.displayName = 'Breadcrumb'
