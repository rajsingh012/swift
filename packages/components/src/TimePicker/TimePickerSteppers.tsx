import { forwardRef } from 'react'
import { Button } from '../Button'
import { useTimePicker } from './TimePicker.context'
import {
  cx,
  periodToggleButtonClasses,
  periodToggleClasses,
  previewClasses,
  stepperLabelClasses,
  stepperSlotClasses,
  stepperTitleClasses,
  stepperValueClasses,
  steppersClasses,
  steppersRowClasses,
} from './TimePicker.styles'
import {
  formatTimeDisplay,
  getColumnValue,
  isTimeInBounds,
  setColumnValue,
  stepperAdjust,
} from './TimePicker.utils'
import type {
  TimePickerColumnSlot,
  TimePickerSteppersProps,
} from './TimePicker.types'

const SLOT_LABELS: Record<Exclude<TimePickerColumnSlot, 'period'>, string> = {
  hour: 'hour',
  minute: 'min',
  second: 'sec',
}

function ChevronUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 15L12 9L6 15" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9L12 15L18 9" />
    </svg>
  )
}

/**
 * Stepper UI for TimePicker — one Button-driven column per slot with
 * up/down chevrons around a single current value. AM/PM is a segmented
 * pair of Buttons below. A formatted preview line sits beneath the toggle.
 *
 * Click commits via `setEffectiveValue` (pending in popover mode, direct
 * inline).
 */
export const TimePickerSteppers = forwardRef<HTMLDivElement, TimePickerSteppersProps>(
  function TimePickerSteppers({ className, ...rest }, ref) {
    const {
      effectiveValue,
      setEffectiveValue,
      hourCycle,
      showSeconds,
      step,
      min,
      max,
      disabled,
      readOnly,
    } = useTimePicker('TimePicker.Steppers')

    const numericSlots: ReadonlyArray<Exclude<TimePickerColumnSlot, 'period'>> = (() => {
      const out: Array<Exclude<TimePickerColumnSlot, 'period'>> = ['hour', 'minute']
      if (showSeconds) out.push('second')
      return out
    })()

    const adjust = (slot: TimePickerColumnSlot, direction: 1 | -1) => {
      if (disabled || readOnly) return
      const next = stepperAdjust(effectiveValue, slot, direction, step, hourCycle)
      if (!isTimeInBounds(next, min, max)) return
      setEffectiveValue(next)
    }

    const setPeriod = (period: 'am' | 'pm') => {
      if (disabled || readOnly) return
      const next = setColumnValue(effectiveValue, 'period', period, hourCycle)
      if (!isTimeInBounds(next, min, max)) return
      setEffectiveValue(next)
    }

    const currentPeriod: 'am' | 'pm' = effectiveValue.hours >= 12 ? 'pm' : 'am'

    return (
      <div ref={ref} className={cx(steppersClasses, className)} {...rest}>
        <div className={stepperTitleClasses}>Time</div>

        <div className={steppersRowClasses}>
          {numericSlots.map((slot) => {
            const display = (() => {
              const v = getColumnValue(effectiveValue, slot, hourCycle) as number
              return slot === 'hour' && hourCycle === 'h12' ? String(v) : String(v).padStart(2, '0')
            })()
            return (
              <div key={slot} className={stepperSlotClasses}>
                <Button
                  variant="secondary"
                  size="sm"
                  iconOnly
                  disabled={disabled}
                  aria-label={`Increase ${slot}`}
                  onClick={() => adjust(slot, 1)}
                  classes={{ root: 'rounded-full' }}
                >
                  <ChevronUp />
                </Button>
                <div
                  role="spinbutton"
                  aria-label={SLOT_LABELS[slot]}
                  aria-valuenow={getColumnValue(effectiveValue, slot, hourCycle) as number}
                  className={stepperValueClasses}
                >
                  {display}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  iconOnly
                  disabled={disabled}
                  aria-label={`Decrease ${slot}`}
                  onClick={() => adjust(slot, -1)}
                  classes={{ root: 'rounded-full' }}
                >
                  <ChevronDown />
                </Button>
                <span className={stepperLabelClasses}>{SLOT_LABELS[slot]}</span>
              </div>
            )
          })}
        </div>

        {hourCycle === 'h12' ? (
          <div className={periodToggleClasses} role="group" aria-label="period">
            {(['am', 'pm'] as const).map((p) => {
              const active = currentPeriod === p
              return (
                <Button
                  key={p}
                  variant="unstyled"
                  disabled={disabled}
                  aria-pressed={active}
                  onClick={() => setPeriod(p)}
                  classes={{
                    root: cx(
                      periodToggleButtonClasses,
                      active ? 'period-active' : '',
                    ),
                  }}
                  data-active={active ? 'true' : undefined}
                >
                  {p.toUpperCase()}
                </Button>
              )
            })}
          </div>
        ) : null}

        <div className={previewClasses} aria-live="polite">
          {formatTimeDisplay(effectiveValue, hourCycle, showSeconds)}
        </div>
      </div>
    )
  },
)
TimePickerSteppers.displayName = 'TimePicker.Steppers'
