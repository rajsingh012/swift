import {
  forwardRef,
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
import { useDatePicker } from './DatePicker.context'
import { cx, inputClasses } from './DatePicker.styles'
import { dayjs } from './DatePicker.utils'
import type { DatePickerInputProps } from './DatePicker.types'

/**
 * Free-text date input — typing fallback for the calendar. Strict parsing
 * via Day.js `customParseFormat`: input that doesn't match `format` is
 * held in local state but never committed. Commit happens on blur or
 * Enter. Calendar selections sync back into the input via `value`.
 *
 * Range mode: pass `slot="start"` / `slot="end"` to bind to one side.
 */
export const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
  function DatePickerInput(props, ref) {
    const {
      format = 'YYYY-MM-DD',
      openOnFocus = true,
      slot,
      placeholder,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      className,
      ...rest
    } = props
    const {
      mode,
      value,
      rangeValue,
      selectDate,
      setOpen,
      isDateDisabled,
    } = useDatePicker('DatePicker.Input')

    // Resolve which underlying date this input represents.
    const boundDate: Date | null =
      mode === 'range'
        ? slot === 'end'
          ? rangeValue.end
          : rangeValue.start
        : value

    const [text, setText] = useState(() =>
      boundDate ? dayjs(boundDate).format(format) : '',
    )

    // Sync context → input on external changes (calendar click, controlled
    // value, etc.). Doesn't fire during typing because the bound date
    // hasn't changed yet — only changes when a value is committed.
    useEffect(() => {
      setText(boundDate ? dayjs(boundDate).format(format) : '')
    }, [boundDate, format])

    const commit = () => {
      const trimmed = text.trim()
      const revert = () =>
        setText(boundDate ? dayjs(boundDate).format(format) : '')
      if (!trimmed) {
        // Empty input reverts to the current value. Clearing the value
        // via the Input isn't supported in v1 — consumers can wire a
        // separate clear button to setValue(null) / setRangeValue(...).
        revert()
        return
      }
      const parsed = dayjs(trimmed, format, true)
      if (!parsed.isValid() || isDateDisabled(parsed.toDate())) {
        revert()
        return
      }
      selectDate(parsed.toDate())
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
      if (event.defaultPrevented) return
      setText(event.target.value)
    }

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      onFocus?.(event)
      if (event.defaultPrevented) return
      if (openOnFocus) setOpen(true)
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      onBlur?.(event)
      if (event.defaultPrevented) return
      commit()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.key === 'Enter') {
        event.preventDefault()
        commit()
      }
    }

    return (
      <input
        ref={ref}
        type="text"
        value={text}
        placeholder={placeholder ?? format.toLowerCase()}
        autoComplete="off"
        spellCheck={false}
        inputMode="numeric"
        data-slot={slot}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cx(inputClasses, className)}
        {...rest}
      />
    )
  },
)
DatePickerInput.displayName = 'DatePicker.Input'
