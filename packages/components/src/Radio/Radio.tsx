import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react'
import { DEFAULT_SIZE } from './Radio.constants'
import {
  RadioContext,
  useRadioGroupContext,
  type RadioContextValue,
} from './Radio.context'
import {
  cx,
  descriptionClasses,
  errorMessageClasses,
  rootClasses,
  textWrapperClasses,
} from './Radio.styles'
import { RadioInput } from './RadioInput'
import { RadioLabel } from './RadioLabel'
import type { RadioProps } from './Radio.types'

/**
 * Convenience single-element API. Renders the circle, the real input, the
 * indicator dot, label (from `children`), description and error message in
 * one shot. For non-standard layouts use `<Radio.Root>` and compose parts.
 */
const RadioComponent = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const {
      size = DEFAULT_SIZE,
      checked: checkedProp,
      defaultChecked,
      onChange,

      disabled = false,
      readOnly = false,
      required = false,
      invalid = false,

      description,
      errorMessage,
      indicator,

      value,
      name,
      id: idProp,
      classes,
      className,
      children,

      ...rest
    } = props

    const group = useRadioGroupContext()

    const reactId = useId()
    const id = idProp ?? `swift-radio-${reactId}`
    const descriptionId = `${id}-description`
    const errorMessageId = `${id}-error`

    const isControlled = checkedProp !== undefined
    const [internalChecked, setInternalChecked] = useState<boolean>(
      defaultChecked ?? false,
    )

    const groupChecked: boolean | undefined =
      group ? group.value === value : undefined

    const checked: boolean =
      groupChecked !== undefined
        ? groupChecked
        : isControlled
          ? (checkedProp as boolean)
          : internalChecked

    const handleChange = useCallback(
      (next: boolean) => {
        if (group) {
          if (next) group.onItemChange(value)
        }
        if (!isControlled && groupChecked === undefined) {
          setInternalChecked(next)
        }
        onChange?.(next)
      },
      [group, value, isControlled, groupChecked, onChange],
    )

    // Group-level state cascades unless the radio sets its own override.
    const effectiveDisabled = group?.disabled || disabled
    const effectiveReadOnly = group?.readOnly || readOnly
    const effectiveRequired = group?.required || required
    const effectiveInvalid = group?.invalid || invalid
    const effectiveSize = group?.size ?? size
    const effectiveName = name ?? group?.name

    const hasDescription = Boolean(description)
    const hasErrorMessage = Boolean(errorMessage) && effectiveInvalid

    const ctx = useMemo<RadioContextValue>(
      () => ({
        id,
        descriptionId,
        errorMessageId,
        size: effectiveSize,
        checked,
        disabled: effectiveDisabled,
        readOnly: effectiveReadOnly,
        required: effectiveRequired,
        invalid: effectiveInvalid,
        hasDescription,
        hasErrorMessage,
        indicator,
        onChange: handleChange,
        name: effectiveName,
        value,
      }),
      [
        id,
        descriptionId,
        errorMessageId,
        effectiveSize,
        checked,
        effectiveDisabled,
        effectiveReadOnly,
        effectiveRequired,
        effectiveInvalid,
        hasDescription,
        hasErrorMessage,
        indicator,
        handleChange,
        effectiveName,
        value,
      ],
    )

    return (
      <RadioContext.Provider value={ctx}>
        <span
          data-disabled={effectiveDisabled ? 'true' : 'false'}
          data-invalid={effectiveInvalid ? 'true' : 'false'}
          data-state={checked ? 'checked' : 'unchecked'}
          className={cx(rootClasses, className, classes?.root)}
        >
          <RadioInput
            ref={ref}
            className={classes?.box}
            {...rest}
          />

          {children !== undefined || description || (errorMessage && effectiveInvalid) ? (
            <span className={cx(textWrapperClasses, classes?.text)}>
              {children !== undefined ? (
                <RadioLabel className={classes?.label}>
                  {children}
                </RadioLabel>
              ) : null}
              {description ? (
                <p
                  id={descriptionId}
                  data-disabled={effectiveDisabled ? 'true' : 'false'}
                  className={cx(descriptionClasses, classes?.description)}
                >
                  {description}
                </p>
              ) : null}
              {errorMessage && effectiveInvalid ? (
                <p
                  id={errorMessageId}
                  role="alert"
                  aria-live="polite"
                  className={cx(errorMessageClasses, classes?.errorMessage)}
                >
                  {errorMessage}
                </p>
              ) : null}
            </span>
          ) : null}
        </span>
      </RadioContext.Provider>
    )
  },
)

RadioComponent.displayName = 'Radio'

export { RadioComponent }
