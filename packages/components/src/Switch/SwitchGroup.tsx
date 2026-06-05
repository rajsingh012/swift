import { forwardRef, useCallback, useId, useMemo, useState } from 'react'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Switch.constants'
import {
  SwitchGroupContext,
  type SwitchGroupContextValue,
} from './Switch.context'
import {
  cx,
  descriptionClasses,
  errorMessageClasses,
  groupItemsClasses,
  groupLabelClasses,
  groupRootClasses,
} from './Switch.styles'
import type { SwitchGroupProps } from './Switch.types'

/**
 * SwitchGroup — settings-page style list of switches with cascading flags.
 * Tracks which children are on as a `string[]` keyed by each item's
 * `value` prop, matching CheckboxGroup's API so consumers can treat the
 * two interchangeably for multi-toggle form fields.
 *
 * Group-level `size`, `variant`, `disabled`, `readOnly`, `required`, and
 * `invalid` cascade to every child unless the child sets its own override.
 */
export const SwitchGroup = forwardRef<HTMLDivElement, SwitchGroupProps>(
  function SwitchGroup(props, ref) {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,

      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
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

    const ctx = useMemo<SwitchGroupContextValue>(
      () => ({
        value,
        size,
        variant,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        onItemChange,
      }),
      [
        value,
        size,
        variant,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        onItemChange,
      ],
    )

    const describedBy =
      [descriptionId, errorMessageId].filter(Boolean).join(' ') || undefined

    return (
      <SwitchGroupContext.Provider value={ctx}>
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
      </SwitchGroupContext.Provider>
    )
  },
)

SwitchGroup.displayName = 'SwitchGroup'
