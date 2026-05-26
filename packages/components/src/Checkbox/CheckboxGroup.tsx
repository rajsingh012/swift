import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react'
import { DEFAULT_SIZE } from './Checkbox.constants'
import {
  CheckboxGroupContext,
  type CheckboxGroupContextValue,
} from './Checkbox.context'
import {
  cx,
  descriptionClasses,
  errorMessageClasses,
  groupItemsClasses,
  groupLabelClasses,
  groupRootClasses,
} from './Checkbox.styles'
import type { CheckboxGroupProps } from './Checkbox.types'

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(props, ref) {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,

      size = DEFAULT_SIZE,
      disabled = false,
      readOnly = false,
      required = false,
      invalid = false,
      name,

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
    const [internal, setInternal] = useState<string[]>(defaultValue ?? [])
    const value = isControlled ? (valueProp as string[]) : internal

    const groupId = useId()
    const labelId = label ? `${groupId}-label` : undefined
    const descriptionId = description ? `${groupId}-description` : undefined
    const errorMessageId = errorMessage ? `${groupId}-error` : undefined

    const onItemChange = useCallback(
      (itemValue: string, next: boolean) => {
        const has = value.includes(itemValue)
        let nextValue: string[]
        if (next && !has) nextValue = [...value, itemValue]
        else if (!next && has) nextValue = value.filter((v) => v !== itemValue)
        else return
        if (!isControlled) setInternal(nextValue)
        onValueChange?.(nextValue)
      },
      [value, isControlled, onValueChange],
    )

    const ctx = useMemo<CheckboxGroupContextValue>(
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
      <CheckboxGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-disabled={disabled || undefined}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          data-disabled={disabled ? 'true' : 'false'}
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
      </CheckboxGroupContext.Provider>
    )
  },
)

CheckboxGroup.displayName = 'CheckboxGroup'
