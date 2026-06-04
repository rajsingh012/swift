import { forwardRef, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { mergeRefs } from '../internal/refs'
import { useTimePicker } from './TimePicker.context'
import {
  cx,
  triggerClasses,
  triggerIconClasses,
} from './TimePicker.styles'
import { formatTimeDisplay } from './TimePicker.utils'
import type {
  TimePickerHourCycle,
  TimePickerTriggerProps,
  TimeValue,
} from './TimePicker.types'

const defaultFormatValue = (
  value: TimeValue,
  hourCycle: TimePickerHourCycle,
): string => formatTimeDisplay(value, hourCycle)

function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export const TimePickerTrigger = forwardRef<HTMLButtonElement, TimePickerTriggerProps>(
  function TimePickerTrigger(props, ref) {
    const {
      placeholder = 'Pick a time',
      formatValue = defaultFormatValue,
      asChild = false,
      onClick,
      type,
      className,
      children,
      ...rest
    } = props
    const {
      value,
      hasValue,
      open,
      setOpen,
      hourCycle,
      contentId,
      triggerRef,
      disabled,
    } = useTimePicker('TimePicker.Trigger')

    const label = hasValue ? formatValue(value, hourCycle) : placeholder

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) setOpen(!open)
    }

    const composedRef = mergeRefs<HTMLButtonElement>(ref, (node) => {
      triggerRef.current = node
    })

    const sharedProps = {
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': open,
      'aria-controls': open ? contentId : undefined,
      'data-state': open ? 'open' : 'closed',
      'data-placeholder': hasValue ? undefined : 'true',
      disabled,
      onClick: handleClick,
      className: cx(triggerClasses, className),
      ...rest,
    }

    if (asChild) {
      return (
        <Slot ref={composedRef as never} {...sharedProps}>
          {children ?? <span>{label}</span>}
        </Slot>
      )
    }

    return (
      <button ref={composedRef} type={type ?? 'button'} {...sharedProps}>
        {children ?? (
          <>
            <span className="truncate">{label}</span>
            <span className={triggerIconClasses}>
              <ClockIcon />
            </span>
          </>
        )}
      </button>
    )
  },
)
TimePickerTrigger.displayName = 'TimePicker.Trigger'
