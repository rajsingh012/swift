import { forwardRef } from 'react'
import { TimePicker } from '../TimePicker'
import { useDatePicker } from './DatePicker.context'
import {
  cx,
  timeFieldClasses,
  timeFieldLabelClasses,
  timeFieldsContainerClasses,
} from './DatePicker.styles'
import { extractTime } from './DatePicker.utils'
import type { DatePickerTimeFieldsProps } from './DatePicker.types'

/**
 * Embedded TimePicker(s) for the popover footer. Renders the full
 * TimePicker (trigger + popover) per slot. Click the trigger to open
 * the time stepper inside its own nested popover; OK commits time
 * into the corresponding side of the date value.
 *
 * Single: one TimePicker bound to the value's time.
 * Range:  two TimePickers (Start / End), each bound to its side.
 * Each is disabled until the corresponding date is set.
 */
export const DatePickerTimeFields = forwardRef<HTMLDivElement, DatePickerTimeFieldsProps>(
  function DatePickerTimeFields({ className, ...rest }, ref) {
    const {
      mode,
      value,
      rangeValue,
      withTime,
      timeProps,
      setTime,
      dir,
    } = useDatePicker('DatePicker.TimeFields')

    if (!withTime) return null

    const sharedTimeProps = {
      hourCycle: timeProps?.hourCycle,
      step: timeProps?.step,
      showSeconds: timeProps?.showSeconds,
      min: timeProps?.min,
      max: timeProps?.max,
      // Inherit the DatePicker's resolved direction — the embedded
      // TimePicker's own sniffing would race against popover mount.
      dir,
    }

    if (mode === 'single') {
      const time = extractTime(value)
      return (
        <div ref={ref} className={cx(timeFieldsContainerClasses, className)} {...rest}>
          <div className={timeFieldClasses}>
            <span className={timeFieldLabelClasses}>Time</span>
            <TimePicker
              {...sharedTimeProps}
              value={time}
              onValueChange={(next) => {
                if (next) setTime(next)
              }}
              disabled={!value}
            />
          </div>
        </div>
      )
    }

    const startTime = extractTime(rangeValue.start)
    const endTime = extractTime(rangeValue.end)
    return (
      <div ref={ref} className={cx(timeFieldsContainerClasses, className)} {...rest}>
        <div className={timeFieldClasses}>
          <span className={timeFieldLabelClasses}>Start time</span>
          <TimePicker
            {...sharedTimeProps}
            value={startTime}
            onValueChange={(next) => {
              if (next) setTime(next, 'start')
            }}
            disabled={!rangeValue.start}
          />
        </div>
        <div className={timeFieldClasses}>
          <span className={timeFieldLabelClasses}>End time</span>
          <TimePicker
            {...sharedTimeProps}
            value={endTime}
            onValueChange={(next) => {
              if (next) setTime(next, 'end')
            }}
            disabled={!rangeValue.end}
          />
        </div>
      </div>
    )
  },
)
DatePickerTimeFields.displayName = 'DatePicker.TimeFields'
