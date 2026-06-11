import type { SheetSide } from './Sheet.types'

export const overlayClasses =
  'swift-sheet-overlay fixed inset-0 z-[var(--z-overlay,40)] bg-surface-overlay'

export const contentBaseClasses =
  'swift-sheet-content fixed z-[var(--z-modal,50)] flex flex-col overflow-hidden text-content outline-none'

export const sideClasses: Record<SheetSide, string> = {
  right: 'inset-y-0 right-0 h-full border-l border-stroke',
  left: 'inset-y-0 left-0 h-full border-r border-stroke',
  top: 'inset-x-0 top-0 w-full border-b border-stroke',
  bottom: 'inset-x-0 bottom-0 w-full border-t border-stroke',
}

export const headerClasses =
  'swift-sheet-header relative flex flex-col gap-1 border-b border-stroke px-6 py-4 pr-12'

export const titleClasses =
  'text-lg font-semibold leading-tight text-content-strong'

export const descriptionClasses = 'text-sm leading-normal text-content-muted'

export const bodyClasses = 'swift-sheet-body flex-1 overflow-y-auto px-6 py-4'

export const footerClasses =
  'swift-sheet-footer flex flex-col-reverse gap-2 border-t border-stroke px-6 py-4 sm:flex-row sm:justify-end'

export const closeButtonClasses =
  'swift-sheet-close absolute right-4 top-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-content-muted transition-colors hover:bg-surface-muted hover:text-content-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-brand'
