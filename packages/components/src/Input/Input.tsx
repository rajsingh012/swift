import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import {
  DEFAULT_LABEL_PLACEMENT,
  DEFAULT_SIZE,
  DEFAULT_STATE,
  DEFAULT_VARIANT,
} from './Input.constants'
import { InputContext, type InputContextValue } from './Input.context'
import { InputErrorMessage } from './InputErrorMessage'
import { InputField } from './InputField'
import { InputHelperText } from './InputHelperText'
import { InputLabel } from './InputLabel'
import {
  adornmentBaseClasses,
  countClasses,
  cx,
  endActionButtonClasses,
  rootClasses,
  wrapperClasses,
  wrapperFloatingSizeClasses,
  wrapperSizeClasses,
} from './Input.styles'
import type { InputProps } from './Input.types'

/* ── Tiny inline glyphs (no @swift/icons dep at the Input layer) ── */

function ClearGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function EyeGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function EyeOffGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 6.1A9.7 9.7 0 0 1 12 6c6.5 0 10 6 10 6a16.7 16.7 0 0 1-3.3 4M6.2 7.7A16.7 16.7 0 0 0 2 12s3.5 6 10 6a9.7 9.7 0 0 0 3.4-.6M9.9 9.9a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ── Root ───────────────────────────────────────────────────────── */

const InputRoot = forwardRef<HTMLInputElement, InputProps>(function Input(
  props,
  ref,
) {
  const {
    size = DEFAULT_SIZE,
    variant = DEFAULT_VARIANT,
    state = DEFAULT_STATE,
    labelPlacement = DEFAULT_LABEL_PLACEMENT,

    label,
    helperText,
    errorMessage,

    invalid = false,
    required = false,
    disabled = false,
    readOnly = false,
    fullWidth = false,

    startAdornment,
    endAdornment,

    clearable = false,
    showPasswordToggle = false,
    loading = false,
    showCount = false,

    classes,
    className,

    id: idProp,
    type: typeProp,
    value: valueProp,
    defaultValue,
    onChange: onChangeProp,
    onClear,
    maxLength,

    ...rest
  } = props

  const reactId = useId()
  const id = idProp ?? `swift-input-${reactId}`
  const helperTextId = `${id}-helper`
  const errorMessageId = `${id}-error`

  const hasHelperText = Boolean(helperText)
  const hasErrorMessage = Boolean(errorMessage) && invalid
  const hasStartAdornment = startAdornment !== undefined

  // Track value length for `clearable` visibility and `showCount` display.
  // Works for both controlled (valueProp) and uncontrolled inputs.
  const isControlled = valueProp !== undefined
  const [internalValueLength, setInternalValueLength] = useState<number>(
    () => String(defaultValue ?? '').length,
  )
  const valueLength = isControlled
    ? String(valueProp ?? '').length
    : internalValueLength
  const hasValue = valueLength > 0

  const [passwordVisible, setPasswordVisible] = useState(false)
  const resolvedType =
    typeProp === 'password' && showPasswordToggle && passwordVisible
      ? 'text'
      : typeProp

  // Mirror the consumer's onChange but also track length internally so
  // uncontrolled inputs still know whether to show the clear button.
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValueLength(event.target.value.length)
      onChangeProp?.(event)
    },
    [isControlled, onChangeProp],
  )

  // Bridge an internal ref with the forwarded one so onClear can clear an
  // uncontrolled input via the DOM when no onClear handler is supplied.
  const innerRef = useRef<HTMLInputElement | null>(null)
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ref],
  )

  const handleClear = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (onClear) {
        onClear()
        return
      }
      const node = innerRef.current
      if (!node) return
      // For uncontrolled inputs we drive the value through the native setter
      // so React picks it up as a real change event.
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set
      if (setter) {
        setter.call(node, '')
        node.dispatchEvent(new Event('input', { bubbles: true }))
      }
      node.focus()
    },
    [onClear],
  )

  const ctx = useMemo<InputContextValue>(
    () => ({
      id,
      helperTextId,
      errorMessageId,
      size,
      variant,
      state,
      labelPlacement,
      invalid,
      disabled,
      readOnly,
      required,
      hasHelperText,
      hasErrorMessage,
      hasStartAdornment,
    }),
    [
      id,
      helperTextId,
      errorMessageId,
      size,
      variant,
      state,
      labelPlacement,
      invalid,
      disabled,
      readOnly,
      required,
      hasHelperText,
      hasErrorMessage,
      hasStartAdornment,
    ],
  )

  const wrapperSize =
    labelPlacement === 'floating'
      ? wrapperFloatingSizeClasses[size]
      : wrapperSizeClasses[size]

  const wrapperClassName = cx(
    wrapperClasses(variant, state, invalid),
    wrapperSize,
    classes?.wrapper,
  )

  /* ── End-slot stacking order ──────────────────────────────────── */
  // Order chosen so the most "transient" affordances sit closest to the
  // input and persistent consumer adornments sit furthest out.
  const endSlots: ReactNode[] = []
  if (clearable && hasValue && !disabled && !readOnly) {
    endSlots.push(
      <button
        key="clear"
        type="button"
        aria-label="Clear input"
        onClick={handleClear}
        className={endActionButtonClasses}
      >
        <ClearGlyph />
      </button>,
    )
  }
  if (typeProp === 'password' && showPasswordToggle) {
    endSlots.push(
      <button
        key="password-toggle"
        type="button"
        aria-label={passwordVisible ? 'Hide password' : 'Show password'}
        aria-pressed={passwordVisible}
        onClick={() => setPasswordVisible((v) => !v)}
        disabled={disabled}
        className={endActionButtonClasses}
      >
        {passwordVisible ? <EyeOffGlyph /> : <EyeGlyph />}
      </button>,
    )
  }
  if (loading) {
    endSlots.push(
      <span
        key="loading"
        aria-hidden
        className={cx(adornmentBaseClasses, 'pointer-events-none')}
      >
        <Spinner />
      </span>,
    )
  }
  if (endAdornment !== undefined) {
    endSlots.push(
      <span
        key="end-adornment"
        className={cx(adornmentBaseClasses, classes?.endAdornment)}
      >
        {endAdornment}
      </span>,
    )
  }

  return (
    <InputContext.Provider value={ctx}>
      <div
        className={cx(
          rootClasses,
          fullWidth && 'flex w-full',
          className,
          classes?.root,
        )}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        data-size={size}
        data-variant={variant}
      >
        {/* Top-placed label sits above the wrapper. */}
        {label !== undefined && labelPlacement === 'top' ? (
          <InputLabel className={classes?.label}>{label}</InputLabel>
        ) : null}

        <div
          className={wrapperClassName}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
          data-readonly={readOnly || undefined}
          aria-busy={loading || undefined}
        >
          {startAdornment !== undefined ? (
            <span className={cx(adornmentBaseClasses, classes?.startAdornment)}>
              {startAdornment}
            </span>
          ) : null}

          <InputField
            ref={setRefs}
            id={id}
            type={resolvedType}
            value={valueProp}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            className={classes?.field}
            {...rest}
          />

          {/* Floating label is rendered after the input so peer-* selectors
              on the label resolve against the input above (`peer` class). */}
          {label !== undefined && labelPlacement === 'floating' ? (
            <InputLabel className={classes?.label}>{label}</InputLabel>
          ) : null}

          {endSlots.length > 0 ? (
            <span className="inline-flex shrink-0 items-center gap-1">
              {endSlots}
            </span>
          ) : null}
        </div>

        {/* Footer row: helper/error on the left, character count on the right. */}
        {(hasHelperText || hasErrorMessage || (showCount && maxLength)) && (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {hasErrorMessage ? (
                <InputErrorMessage className={classes?.errorMessage}>
                  {errorMessage}
                </InputErrorMessage>
              ) : hasHelperText ? (
                <InputHelperText className={classes?.helperText}>
                  {helperText}
                </InputHelperText>
              ) : null}
            </div>
            {showCount && maxLength ? (
              <span className={cx(countClasses, classes?.count)}>
                {valueLength} / {maxLength}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </InputContext.Provider>
  )
})

export const InputRootComponent = InputRoot
