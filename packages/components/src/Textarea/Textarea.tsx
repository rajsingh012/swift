import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import {
  DEFAULT_MIN_ROWS,
  DEFAULT_RESIZE,
  DEFAULT_SIZE,
  DEFAULT_STATE,
  DEFAULT_VARIANT,
} from './Textarea.constants'
import {
  countClasses,
  cx,
  errorMessageClasses,
  fieldClasses,
  helperTextClasses,
  labelClasses,
  requiredAsteriskClasses,
  resizeClasses,
  rootClasses,
  wrapperClasses,
  wrapperSizeClasses,
} from './Textarea.styles'
import type { TextareaProps } from './Textarea.types'

// useLayoutEffect on the client, useEffect on the server (no SSR warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * A multi-line text field. Mirrors the `<Input>` API (size / variant / state /
 * invalid / label / helperText / errorMessage / showCount) for a multi-line
 * control, and adds `resize="auto"` for content-driven height.
 *
 *   <Textarea label="Bio" placeholder="Tell us about yourself" />
 *   <Textarea resize="auto" minRows={2} maxRows={8} />
 *
 * Built on a real native `<textarea>`, so it participates in forms and works
 * with `value`/`defaultValue` exactly like the browser element.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const {
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      state = DEFAULT_STATE,

      label,
      helperText,
      errorMessage,

      invalid = false,
      required = false,
      disabled = false,
      readOnly = false,
      fullWidth = false,

      resize = DEFAULT_RESIZE,
      minRows = DEFAULT_MIN_ROWS,
      maxRows,

      showCount = false,

      classes,
      className,

      id: idProp,
      value: valueProp,
      defaultValue,
      onChange: onChangeProp,
      maxLength,
      placeholder,
      'aria-describedby': describedByProp,
      ...rest
    } = props

    const reactId = useId()
    const id = idProp ?? `swift-textarea-${reactId}`
    const helperTextId = `${id}-helper`
    const errorMessageId = `${id}-error`

    const hasHelperText = Boolean(helperText)
    const hasErrorMessage = Boolean(errorMessage) && invalid

    // Track value length for showCount (controlled + uncontrolled).
    const isControlled = valueProp !== undefined
    const [internalLength, setInternalLength] = useState<number>(
      () => String(defaultValue ?? '').length,
    )
    const valueLength = isControlled
      ? String(valueProp ?? '').length
      : internalLength

    // Bridge the forwarded ref with a local one for auto-resize measurement.
    const innerRef = useRef<HTMLTextAreaElement | null>(null)
    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref)
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      },
      [ref],
    )

    // ── Auto-resize: grow the textarea to fit its content. ──
    const resizeToFit = useCallback(() => {
      const node = innerRef.current
      if (!node || resize !== 'auto') return
      node.style.height = 'auto'
      const style = window.getComputedStyle(node)
      const lineHeight = parseFloat(style.lineHeight) || 20
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      const borderY =
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
      const maxHeight = maxRows
        ? maxRows * lineHeight + paddingY + borderY
        : Infinity
      const next = Math.min(node.scrollHeight, maxHeight)
      node.style.height = `${next}px`
      node.style.overflowY = node.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }, [resize, maxRows])

    useIsoLayoutEffect(() => {
      resizeToFit()
    }, [resizeToFit, valueProp, defaultValue])

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) setInternalLength(event.target.value.length)
        resizeToFit()
        onChangeProp?.(event)
      },
      [isControlled, onChangeProp, resizeToFit],
    )

    const describedBy =
      [
        hasHelperText ? helperTextId : '',
        hasErrorMessage ? errorMessageId : '',
        describedByProp ?? '',
      ]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <div
        className={cx(rootClasses, fullWidth && 'flex w-full', className, classes?.root)}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        data-size={size}
        data-variant={variant}
      >
        {label !== undefined ? (
          <label
            htmlFor={id}
            data-disabled={disabled || undefined}
            className={cx(labelClasses, classes?.label)}
          >
            {label}
            {required ? (
              <span aria-hidden className={requiredAsteriskClasses}>
                {' *'}
              </span>
            ) : null}
          </label>
        ) : null}

        <div
          className={cx(
            wrapperClasses(variant, state, invalid),
            wrapperSizeClasses[size],
            classes?.wrapper,
          )}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
          data-readonly={readOnly || undefined}
        >
          <textarea
            ref={setRefs}
            id={id}
            rows={minRows}
            value={valueProp}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            maxLength={maxLength}
            placeholder={placeholder}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            className={cx(fieldClasses, resizeClasses[resize], classes?.field)}
            {...rest}
          />
        </div>

        {(hasHelperText || hasErrorMessage || (showCount && maxLength)) && (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {hasErrorMessage ? (
                <p
                  id={errorMessageId}
                  role="alert"
                  aria-live="polite"
                  className={cx(errorMessageClasses, classes?.errorMessage)}
                >
                  {errorMessage}
                </p>
              ) : hasHelperText ? (
                <p id={helperTextId} className={cx(helperTextClasses, classes?.helperText)}>
                  {helperText}
                </p>
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
    )
  },
)
Textarea.displayName = 'Textarea'
