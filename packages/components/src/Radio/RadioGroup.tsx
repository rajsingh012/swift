import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react'
import { DEFAULT_SIZE } from './Radio.constants'
import {
  RadioGroupContext,
  type RadioGroupContextValue,
} from './Radio.context'
import {
  cx,
  descriptionClasses,
  errorMessageClasses,
  groupItemsClasses,
  groupLabelClasses,
  groupRootClasses,
} from './Radio.styles'
import type { RadioGroupProps } from './Radio.types'

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(props, ref) {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,

      size = DEFAULT_SIZE,
      disabled = false,
      readOnly = false,
      required = false,
      invalid = false,
      name: nameProp,

      label,
      description,
      errorMessage,
      orientation = 'vertical',

      classes,
      className,
      children,
      ...rest
    } = props

    const isControlled = valueProp !== undefined
    const [internal, setInternal] = useState<string | null>(
      defaultValue ?? null,
    )
    const value = isControlled ? (valueProp as string | null) : internal

    const reactId = useId()
    // A shared `name` is what lets the browser treat radios as one native
    // group — Tab in/out and arrow navigation between them all rely on it.
    const name = nameProp ?? `swift-radiogroup-${reactId}`

    const labelId = label ? `${name}-label` : undefined
    const descriptionId = description ? `${name}-description` : undefined
    const errorMessageId = errorMessage ? `${name}-error` : undefined

    const onItemChange = useCallback(
      (itemValue: string) => {
        if (readOnly) return
        if (value === itemValue) return
        if (!isControlled) setInternal(itemValue)
        onValueChange?.(itemValue)
      },
      [value, isControlled, onValueChange, readOnly],
    )

    const ctx = useMemo<RadioGroupContextValue>(
      () => ({
        value,
        size,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        onItemChange,
      }),
      [value, size, disabled, readOnly, required, invalid, name, onItemChange],
    )

    const describedBy =
      [descriptionId, errorMessageId].filter(Boolean).join(' ') || undefined

    return (
      <RadioGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          role="radiogroup"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-disabled={disabled || undefined}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          aria-readonly={readOnly || undefined}
          aria-orientation={orientation}
          data-disabled={disabled ? 'true' : 'false'}
          data-invalid={invalid ? 'true' : 'false'}
          className={cx(groupRootClasses, className, classes?.root)}
          {...rest}
        >
          {label ? (
            <span
              id={labelId}
              data-disabled={disabled ? 'true' : 'false'}
              className={cx(groupLabelClasses, classes?.label)}
            >
              {label}
              {required ? (
                <span aria-hidden className="ms-0.5 text-content-critical">
                  *
                </span>
              ) : null}
            </span>
          ) : null}

          {description ? (
            <p
              id={descriptionId}
              className={cx(descriptionClasses, classes?.description)}
            >
              {description}
            </p>
          ) : null}

          <div className={cx(groupItemsClasses[orientation], classes?.items)}>
            {children}
          </div>

          {errorMessage && invalid ? (
            <p
              id={errorMessageId}
              role="alert"
              aria-live="polite"
              className={cx(errorMessageClasses, classes?.errorMessage)}
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      </RadioGroupContext.Provider>
    )
  },
)

RadioGroup.displayName = 'RadioGroup'
