import type { DialogSize } from './Dialog.types'

export const overlayClasses =
  'swift-dialog-overlay fixed inset-0 z-[var(--z-overlay,40)] bg-surface-overlay ' +
  // The overlay is also the centering viewport for the panel — a flex box
  // that centres the content and scrolls when the panel is taller than the
  // viewport.
  'flex items-center justify-center overflow-y-auto p-4'

/**
 * When non-modal there's no scrim, so the centering viewport is a transparent
 * fixed layer that still lets clicks fall through except on the panel.
 */
export const viewportClasses =
  'swift-dialog-viewport fixed inset-0 z-[var(--z-modal,50)] ' +
  'flex items-center justify-center overflow-y-auto p-4 pointer-events-none'

export const contentBaseClasses =
  'swift-dialog-content relative z-[var(--z-modal,50)] flex w-full flex-col gap-4 ' +
  'p-6 text-content outline-none pointer-events-auto'

export const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
}

// Parts carry no horizontal padding — the content's `p-6` + `gap-4` own the
// spacing, so bare content (without these parts) is never edge-to-edge.
// Header reserves right padding so its text clears the floating × button.
export const headerClasses =
  'swift-dialog-header relative flex flex-col gap-1 pr-8'

export const titleClasses =
  'text-lg font-semibold leading-tight text-content-strong'

export const descriptionClasses = 'text-sm leading-normal text-content-muted'

export const bodyClasses = 'swift-dialog-body flex-1 overflow-y-auto'

export const footerClasses =
  'swift-dialog-footer flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'

export const closeButtonClasses =
  'swift-dialog-close absolute right-4 top-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-content-muted transition-colors hover:bg-surface-muted hover:text-content-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-brand'

export { cx } from '../internal/cx'
