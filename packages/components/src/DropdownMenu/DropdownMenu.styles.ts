export { cx } from '../internal/cx'

/** Positioning context + z-stratum; chrome in theme/dropdown-menu.css. */
export const contentClasses =
  'swift-menu-content fixed z-[var(--z-modal,50)] outline-none ' +
  'min-w-[10rem] max-h-[var(--menu-max-height,auto)] overflow-y-auto ' +
  'rounded-lg border border-stroke bg-surface-elevated p-1 shadow-[var(--shadow-level4)]'

export const itemClasses =
  'swift-menu-item group/menu-item relative flex cursor-pointer select-none items-center gap-2 ' +
  'rounded-md px-2 py-1.5 text-sm text-content outline-none ' +
  'data-[highlighted]:bg-surface-muted data-[highlighted]:text-content-strong ' +
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

export const itemIconClasses =
  'inline-flex size-4 shrink-0 items-center justify-center text-content-muted [&_svg]:size-4'

export const itemShortcutClasses =
  'ml-auto pl-4 text-xs tracking-wide text-content-muted tabular-nums'

export const checkIndicatorClasses =
  'inline-flex size-4 shrink-0 items-center justify-center text-content-brand [&_svg]:size-4'

export const labelClasses =
  'swift-menu-label px-2 py-1.5 text-xs font-medium text-content-muted'

export const separatorClasses = 'swift-menu-separator -mx-1 my-1 h-px bg-stroke'

export const groupClasses = 'swift-menu-group'
