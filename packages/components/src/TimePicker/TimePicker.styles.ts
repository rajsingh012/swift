export { cx } from '../internal/cx'

/* ── Trigger ───────────────────────────────────────────────────── */

export const triggerClasses =
  'swift-timepicker-trigger inline-flex items-center justify-between gap-2 ' +
  'h-9 w-full ps-3 pe-2 rounded-md border border-stroke bg-surface text-sm text-content ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:border-stroke-strong ' +
  'focus-visible:border-stroke-brand focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'data-[state=open]:border-stroke-brand ' +
  'data-[placeholder=true]:text-content-muted ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export const triggerIconClasses =
  'swift-timepicker-trigger-icon text-content-muted shrink-0'

/* ── Content (popover) ─────────────────────────────────────────── */

export const contentClasses =
  'swift-timepicker-content fixed z-[var(--z-modal,50)] outline-none ' +
  'rounded-lg border border-stroke bg-surface-elevated shadow-(--shadow-level4) ' +
  'flex flex-col min-w-[16rem]'

/* ── Columns ───────────────────────────────────────────────────── */

export const columnsClasses =
  'swift-timepicker-columns flex items-stretch divide-x divide-stroke-muted'

export const columnClasses =
  'swift-timepicker-column flex flex-col items-stretch overflow-y-auto ' +
  'max-h-[14rem] min-w-[3.5rem] py-2 ' +
  'scrollbar-thin'

export const optionClasses =
  'swift-timepicker-option inline-flex items-center justify-center ' +
  'h-9 px-3 mx-1 rounded-md text-sm tabular-nums text-content ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:bg-surface-muted ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'data-[selected=true]:bg-surface-brand-muted data-[selected=true]:text-content-brand data-[selected=true]:font-semibold ' +
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40 ' +
  'data-[disabled=true]:hover:bg-transparent'

/* ── Actions ───────────────────────────────────────────────────── */

export const actionsClasses =
  'swift-timepicker-actions flex items-center justify-end gap-2 ' +
  'border-t border-stroke-muted px-3 py-2'

export const cancelButtonClasses =
  'swift-timepicker-cancel inline-flex items-center justify-center ' +
  'h-8 px-3 rounded-md text-sm font-medium text-content-brand ' +
  'cursor-pointer outline-none transition-colors uppercase tracking-wide ' +
  'hover:bg-surface-muted ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30'

export const okButtonClasses =
  'swift-timepicker-ok inline-flex items-center justify-center ' +
  'h-8 px-3 rounded-md text-sm font-medium text-content-brand ' +
  'cursor-pointer outline-none transition-colors uppercase tracking-wide ' +
  'hover:bg-surface-muted ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30'

/* ── Stepper variant ──────────────────────────────────────────── */

export const steppersClasses =
  'swift-timepicker-steppers flex flex-col items-stretch gap-3 p-4'

export const stepperTitleClasses =
  'text-center text-base font-semibold text-content-strong pb-2 border-b border-stroke-muted -mx-4 px-4'

export const steppersRowClasses =
  'flex items-center justify-center gap-3 pt-1'

export const stepperSlotClasses =
  'flex flex-col items-center gap-2 min-w-[3.5rem]'

export const stepperButtonClasses =
  'inline-flex size-8 items-center justify-center ' +
  'rounded-md border border-stroke text-content-strong ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:bg-surface-muted hover:border-stroke-strong ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

export const stepperValueClasses =
  'text-2xl font-semibold tabular-nums text-content-strong tracking-tight'

export const stepperLabelClasses =
  'text-xs text-content-muted lowercase'

/* AM/PM segmented toggle — `overflow-hidden` clips each button's bg to
   the container's rounded corners, so the active state fills the full
   vertical span (no top/bottom gap). */

export const periodToggleClasses =
  'inline-flex self-center rounded-md border border-stroke bg-surface overflow-hidden'

export const periodToggleButtonClasses =
  'inline-flex h-8 items-center justify-center px-4 ' +
  'text-xs font-semibold tracking-wide text-content-muted ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:text-content-strong ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30 focus-visible:ring-inset ' +
  'data-[active=true]:bg-surface-brand-muted data-[active=true]:text-content-brand ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

/* Preview line under the steppers */

export const previewClasses =
  'text-center text-sm text-content-muted tabular-nums tracking-wider pt-2 pb-1'

/* Stepper-variant Action overrides — stacked filled OK + outlined Cancel */

export const stepperActionsClasses =
  'flex flex-col gap-2 px-4 pb-4 pt-2 border-t border-stroke-muted'

export const stepperOkButtonClasses =
  'inline-flex items-center justify-center w-full h-10 rounded-md ' +
  'bg-surface-brand text-sm font-semibold text-content-on-brand ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:opacity-90 ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/40'

export const stepperCancelButtonClasses =
  'inline-flex items-center justify-center w-full h-10 rounded-md ' +
  'border border-stroke bg-surface text-sm font-medium text-content ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:bg-surface-muted hover:border-stroke-strong ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30'
