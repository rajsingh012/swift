import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'
import { DEFAULT_SIZE, DEFAULT_STATE, DEFAULT_VARIANT } from './Input.constants'
import {
  cx,
  groupCellInputClasses,
  groupCellSizeClasses,
  groupRootClasses,
  wrapperClasses,
} from './Input.styles'
import type { InputGroupProps, InputGroupType } from './Input.types'

const filterMap: Record<InputGroupType, RegExp> = {
  numeric: /\d/,
  alphanumeric: /[a-zA-Z0-9]/,
  all: /./,
}

function filterChars(input: string, type: InputGroupType): string {
  const re = filterMap[type]
  let out = ''
  for (const ch of input) if (re.test(ch)) out += ch
  return out
}

/** Pads/truncates the controlled value to exactly `length` characters. */
function normaliseValue(value: string, length: number): string[] {
  const out = new Array<string>(length).fill('')
  for (let i = 0; i < Math.min(value.length, length); i++) out[i] = value[i]!
  return out
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      length,
      value: valueProp,
      defaultValue,
      onChange,
      onComplete,
      type = 'numeric',
      mask = false,
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      state = DEFAULT_STATE,
      disabled = false,
      readOnly = false,
      invalid = false,
      required = false,
      autoFocus = false,
      ariaLabel,
      className,
      classes,
      ...rest
    } = props

    const isControlled = valueProp !== undefined
    const [internal, setInternal] = useState<string>(
      () => filterChars(String(defaultValue ?? ''), type).slice(0, length),
    )
    const value = isControlled ? (valueProp as string) : internal
    const cells = useMemo(() => normaliseValue(value, length), [value, length])

    const cellRefs = useRef<Array<HTMLInputElement | null>>([])
    const groupId = useId()

    const emit = useCallback(
      (next: string) => {
        if (!isControlled) setInternal(next)
        onChange?.(next)
        if (next.length === length && !next.includes('')) onComplete?.(next)
      },
      [isControlled, length, onChange, onComplete],
    )

    const focusCell = (idx: number) => {
      const target = cellRefs.current[idx]
      if (target) {
        target.focus()
        target.select()
      }
    }

    const writeCell = (idx: number, ch: string) => {
      const next = cells.slice()
      next[idx] = ch
      // Trim trailing empties so the emitted value matches what's filled
      // contiguously from the left.
      let trimmed = next.join('')
      while (trimmed.endsWith('') === false && trimmed.length > length) {
        trimmed = trimmed.slice(0, -1)
      }
      emit(next.join(''))
    }

    const clearCell = (idx: number) => {
      const next = cells.slice()
      next[idx] = ''
      emit(next.join(''))
    }

    const handleChange = (
      idx: number,
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const raw = event.target.value
      // The new char is whatever is _different_ from the current cell value.
      // If the user typed into a non-empty cell, last char wins.
      const filtered = filterChars(raw, type)
      if (filtered.length === 0) {
        clearCell(idx)
        return
      }
      const newest = filtered.slice(-1)
      writeCell(idx, newest)
      if (idx < length - 1) focusCell(idx + 1)
    }

    const handleKeyDown = (
      idx: number,
      event: KeyboardEvent<HTMLInputElement>,
    ) => {
      const key = event.key
      if (key === 'Backspace') {
        // If current cell has a value, the native backspace already clears it
        // via onChange. If it's already empty, jump back and clear the prior.
        if (cells[idx]) return
        event.preventDefault()
        if (idx > 0) {
          clearCell(idx - 1)
          focusCell(idx - 1)
        }
        return
      }
      if (key === 'ArrowLeft' && idx > 0) {
        event.preventDefault()
        focusCell(idx - 1)
      } else if (key === 'ArrowRight' && idx < length - 1) {
        event.preventDefault()
        focusCell(idx + 1)
      } else if (key === 'Home') {
        event.preventDefault()
        focusCell(0)
      } else if (key === 'End') {
        event.preventDefault()
        focusCell(length - 1)
      }
    }

    const handlePaste = (
      idx: number,
      event: ClipboardEvent<HTMLInputElement>,
    ) => {
      event.preventDefault()
      const pasted = filterChars(
        event.clipboardData.getData('text'),
        type,
      ).slice(0, length - idx)
      if (!pasted) return
      const next = cells.slice()
      for (let i = 0; i < pasted.length; i++) next[idx + i] = pasted[i]!
      emit(next.join(''))
      const focusIdx = Math.min(idx + pasted.length, length - 1)
      focusCell(focusIdx)
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-disabled={disabled || undefined}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        className={cx(groupRootClasses, className, classes?.root)}
        {...rest}
      >
        {cells.map((ch, idx) => (
          <div
            key={idx}
            className={cx(
              wrapperClasses(variant, state, invalid),
              groupCellSizeClasses[size],
              'justify-center',
              classes?.cell,
            )}
            data-disabled={disabled || undefined}
            data-invalid={invalid || undefined}
          >
            <input
              ref={(node) => {
                cellRefs.current[idx] = node
              }}
              id={`${groupId}-${idx}`}
              type={mask ? 'password' : 'text'}
              inputMode={type === 'numeric' ? 'numeric' : 'text'}
              autoComplete={idx === 0 ? 'one-time-code' : 'off'}
              maxLength={1}
              value={ch}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              autoFocus={autoFocus && idx === 0}
              aria-label={ariaLabel?.(idx + 1) ?? `Digit ${idx + 1}`}
              onChange={(e) => handleChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={(e) => handlePaste(idx, e)}
              onFocus={(e) => e.currentTarget.select()}
              className={groupCellInputClasses}
            />
          </div>
        ))}
      </div>
    )
  },
)

InputGroup.displayName = 'Input.Group'
