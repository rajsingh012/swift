export { cx } from '../internal/cx'

export const triggerClasses =
  'swift-datepicker-trigger inline-flex items-center gap-2 ' +
  'h-9 px-3 rounded-md border border-stroke bg-surface text-sm text-content ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:border-stroke-strong ' +
  'focus-visible:border-stroke-brand focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'data-[state=open]:border-stroke-brand ' +
  'data-[placeholder=true]:text-content-muted'

export const contentClasses =
  'swift-datepicker-content fixed z-[var(--z-modal,50)] outline-none ' +
  'rounded-lg border border-stroke bg-surface-elevated shadow-[var(--shadow-level4)] ' +
  'p-3 min-w-[16rem]'

export const calendarClasses = 'swift-datepicker-calendar flex flex-col gap-2'

export const headerClasses =
  'swift-datepicker-header flex items-center justify-between gap-2 px-1'

export const headerLabelClasses =
  'swift-datepicker-header-label text-sm font-semibold text-content-strong tabular-nums'

export const navButtonClasses =
  'swift-datepicker-nav-button inline-flex size-7 items-center justify-center ' +
  'rounded-md text-content-muted cursor-pointer outline-none transition-colors ' +
  'hover:bg-surface-muted hover:text-content-strong ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-content-muted'

export const gridClasses = 'swift-datepicker-grid w-full border-collapse'

/**
 * Cell wrapper around each Day button. Hosts the range / preview
 * background (via ::before in date-picker.css) so the bar can extend
 * continuously across adjacent cells while the button keeps its own
 * rounded "selected" treatment on top.
 */
export const cellWrapperClasses =
  'swift-datepicker-cell relative inline-flex w-full items-center justify-center h-8'

export const weekdayHeaderRowClasses = 'swift-datepicker-weekdays'

export const weekdayCellClasses =
  'swift-datepicker-weekday text-center text-xs font-medium text-content-muted py-1.5 w-9'

export const weekNumberCellClasses =
  'swift-datepicker-week-number text-center text-xs font-medium text-content-muted ' +
  'py-1.5 px-2 border-inline-end border-stroke-muted'

export const multiMonthRowClasses =
  'swift-datepicker-multi-month flex flex-wrap gap-6'

export const presetsClasses =
  'swift-datepicker-presets flex flex-col gap-1 ' +
  'border-inline-end border-stroke-muted pe-3 min-w-[8rem]'

export const presetClasses =
  'swift-datepicker-preset inline-flex w-full items-center justify-start ' +
  'h-8 px-2 rounded-md text-sm text-content text-start ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:bg-surface-muted ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

/* ── withTime (TimeFields + DoneButton) ────────────────────────── */

export const timeFieldsContainerClasses =
  'swift-datepicker-time-fields flex flex-wrap items-end gap-3 ' +
  'mt-3 pt-3 border-t border-stroke-muted'

export const timeFieldClasses = 'flex flex-col gap-1'

export const timeFieldLabelClasses =
  'text-xs font-medium uppercase tracking-wide text-content-muted'

export const doneButtonClasses =
  'swift-datepicker-done inline-flex items-center justify-center ' +
  'h-8 px-3 rounded-md bg-surface-brand text-sm font-medium text-content-on-brand ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:opacity-90 ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/40 ' +
  'ml-auto'

export const selectClasses =
  'swift-datepicker-select inline-flex items-center ' +
  // Asymmetric padding: native select draws its own chevron flush against
  // padding-end, so we give it 1.5rem of room there while keeping the text
  // side at 0.75rem.
  'h-7 ps-3 pe-6 rounded-md border border-stroke bg-surface text-sm text-content-strong ' +
  'cursor-pointer outline-none transition-colors ' +
  'hover:border-stroke-strong ' +
  'focus-visible:border-stroke-brand focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export const inputClasses =
  'swift-datepicker-input inline-flex w-full items-center ' +
  'h-9 px-3 rounded-md border border-stroke bg-surface text-sm text-content ' +
  'outline-none transition-colors ' +
  'placeholder:text-content-muted ' +
  'hover:border-stroke-strong ' +
  'focus-visible:border-stroke-brand focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stroke'

export const dayCellClasses =
  'swift-datepicker-day relative z-[1] inline-flex size-8 items-center justify-center ' +
  'rounded-md text-sm text-content cursor-pointer outline-none transition-colors ' +
  'hover:bg-surface-muted ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
  'data-[outside-month=true]:text-content-muted data-[outside-month=true]:opacity-50 ' +
  'data-[today=true]:font-semibold data-[today=true]:ring-1 data-[today=true]:ring-stroke ' +
  'data-[selected=true]:bg-surface-brand data-[selected=true]:text-content-on-brand ' +
  'data-[selected=true]:hover:bg-surface-brand ' +
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-40 ' +
  'data-[disabled=true]:hover:bg-transparent'
