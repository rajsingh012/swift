import type { BreadcrumbSize } from './Breadcrumb.types'

export { cx } from '../internal/cx'

export const listClasses =
  'swift-breadcrumb-list flex flex-wrap items-center gap-1.5 break-words'

export const sizeClasses: Record<BreadcrumbSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export const itemClasses = 'inline-flex items-center gap-1.5'

export const linkClasses =
  'swift-breadcrumb-link rounded-sm text-content-muted transition-colors ' +
  'hover:text-content-strong hover:underline underline-offset-2 ' +
  'outline-none focus-visible:ring-2 focus-visible:ring-stroke-brand focus-visible:ring-offset-2'

export const pageClasses = 'swift-breadcrumb-page font-medium text-content-strong'

export const separatorClasses =
  'swift-breadcrumb-separator select-none text-content-muted [&_svg]:size-3.5'

export const ellipsisClasses =
  'swift-breadcrumb-ellipsis inline-flex items-center justify-center text-content-muted'
