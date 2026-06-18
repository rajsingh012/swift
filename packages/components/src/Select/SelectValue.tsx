import { forwardRef } from 'react'
import { useSelect } from './Select.context'
import { cx, triggerIconClasses } from './Select.styles'
import type { SelectValueProps } from './Select.types'

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Renders the selected option's label inside the trigger, falling back to
 * `placeholder` when nothing is selected. Includes the trailing chevron that
 * rotates when the listbox is open.
 */
export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  function SelectValue({ placeholder, className, children, ...rest }, ref) {
    const { value, labelsRef, open } = useSelect('Select.Value')

    const hasValue = value !== null && value !== undefined && value !== ''
    // Prefer an explicit child (consumer-controlled render), else the
    // registered label for the current value, else the raw value.
    const label = hasValue ? (labelsRef.current.get(value) ?? value) : null

    return (
      <>
        <span ref={ref} className={cx('truncate', className)} {...rest}>
          {children ?? (hasValue ? label : placeholder)}
        </span>
        <span className={triggerIconClasses} data-state={open ? 'open' : 'closed'} aria-hidden>
          <ChevronDown />
        </span>
      </>
    )
  },
)
SelectValue.displayName = 'Select.Value'
