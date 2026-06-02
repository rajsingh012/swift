import { DatePickerCalendar } from './DatePickerCalendar'
import { DatePickerContent } from './DatePickerContent'
import { DatePickerDay } from './DatePickerDay'
import { DatePickerDoneButton } from './DatePickerDoneButton'
import { DatePickerGrid } from './DatePickerGrid'
import { DatePickerHeader } from './DatePickerHeader'
import { DatePickerInput } from './DatePickerInput'
import { DatePickerMonthSelect } from './DatePickerMonthSelect'
import { DatePickerNextButton } from './DatePickerNextButton'
import { DatePickerPortal } from './DatePickerPortal'
import { DatePickerPreset } from './DatePickerPreset'
import { DatePickerPresets } from './DatePickerPresets'
import { DatePickerPrevButton } from './DatePickerPrevButton'
import { DatePickerRangeTrigger } from './DatePickerRangeTrigger'
import { DatePickerRoot } from './DatePickerRoot'
import { DatePickerTimeFields } from './DatePickerTimeFields'
import { DatePickerTrigger } from './DatePickerTrigger'
import { DatePickerYearSelect } from './DatePickerYearSelect'

/**
 * DatePicker — compound calendar popover.
 *
 * Without children, renders a sensible default:
 *   <DatePicker.Trigger />
 *   <DatePicker.Portal><DatePicker.Content /></DatePicker.Portal>
 *
 * With children, compose the parts yourself — Trigger / Portal / Content /
 * Calendar / Header / PrevButton / NextButton / Grid / Day. Each part
 * reads from the root via context, so layouts can be rearranged without
 * prop drilling.
 */
export const DatePicker = Object.assign(DatePickerRoot, {
  Trigger: DatePickerTrigger,
  RangeTrigger: DatePickerRangeTrigger,
  Input: DatePickerInput,
  Portal: DatePickerPortal,
  Content: DatePickerContent,
  Calendar: DatePickerCalendar,
  Header: DatePickerHeader,
  PrevButton: DatePickerPrevButton,
  NextButton: DatePickerNextButton,
  MonthSelect: DatePickerMonthSelect,
  YearSelect: DatePickerYearSelect,
  Grid: DatePickerGrid,
  Day: DatePickerDay,
  Presets: DatePickerPresets,
  Preset: DatePickerPreset,
  TimeFields: DatePickerTimeFields,
  DoneButton: DatePickerDoneButton,
}) as typeof DatePickerRoot & {
  Trigger: typeof DatePickerTrigger
  RangeTrigger: typeof DatePickerRangeTrigger
  Input: typeof DatePickerInput
  Portal: typeof DatePickerPortal
  Content: typeof DatePickerContent
  Calendar: typeof DatePickerCalendar
  Header: typeof DatePickerHeader
  PrevButton: typeof DatePickerPrevButton
  NextButton: typeof DatePickerNextButton
  MonthSelect: typeof DatePickerMonthSelect
  YearSelect: typeof DatePickerYearSelect
  Grid: typeof DatePickerGrid
  Day: typeof DatePickerDay
  Presets: typeof DatePickerPresets
  Preset: typeof DatePickerPreset
  TimeFields: typeof DatePickerTimeFields
  DoneButton: typeof DatePickerDoneButton
}
