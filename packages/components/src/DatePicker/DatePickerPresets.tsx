import { forwardRef } from 'react'
import { cx, presetsClasses } from './DatePicker.styles'
import type { DatePickerPresetsProps } from './DatePicker.types'

/**
 * Wrapper for a quick-pick sidebar of `DatePicker.Preset` buttons.
 * Layout-only — visual styling is in the wrapper class. Compose inside
 * a custom Content layout:
 *
 *   <DatePicker.Content>
 *     <div className="flex">
 *       <DatePicker.Presets>
 *         <DatePicker.Preset value={today}>Today</DatePicker.Preset>
 *         <DatePicker.Preset value={() => last7Days()}>Last 7 days</DatePicker.Preset>
 *       </DatePicker.Presets>
 *       <DatePicker.Calendar />
 *     </div>
 *   </DatePicker.Content>
 */
export const DatePickerPresets = forwardRef<HTMLDivElement, DatePickerPresetsProps>(
  function DatePickerPresets({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cx(presetsClasses, className)} {...rest}>
        {children}
      </div>
    )
  },
)
DatePickerPresets.displayName = 'DatePicker.Presets'
