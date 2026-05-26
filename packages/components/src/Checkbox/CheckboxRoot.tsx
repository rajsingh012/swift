import { forwardRef, useCallback, useId, useMemo, useState } from 'react'
import { DEFAULT_SIZE } from './Checkbox.constants'
import {
  CheckboxContext,
  useCheckboxGroupContext,
  type CheckboxContextValue,
} from './Checkbox.context'
import { cx, rootClasses } from './Checkbox.styles'
import type { CheckboxRootProps, CheckboxState } from './Checkbox.types'

/**
 * Compound-mode root. Holds the shared state (controlled/uncontrolled toggle,
 * indeterminate, ARIA ids) and exposes it via context. Renders no chrome,
 * so consumers compose `<Checkbox.Input/>`, `<Checkbox.Label/>`, etc.
 *
 * Reach for `<Checkbox.Root>` only when the convenience `<Checkbox>` can't
 * express your layout — e.g. label above the box, custom description slot.
 */
export const CheckboxRoot = forwardRef<HTMLSpanElement, CheckboxRootProps>(
  function CheckboxRoot(props, ref) {
    const {
      size = DEFAULT_SIZE,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      disabled = false,
      readOnly = false,
      required = false,
      invalid = false,
      id: idProp,
      value,
      name,
      classes,
      className,
      children,
      ...rest
    } = props

    const group = useCheckboxGroupContext()

    const reactId = useId()
    const id = idProp ?? `swift-checkbox-${reactId}`
    const descriptionId = `${id}-description`
    const errorMessageId = `${id}-error`

    const isControlled = checkedProp !== undefined
    const [internalChecked, setInternalChecked] = useState<CheckboxState>(
      defaultChecked ?? false,
    )

    const groupChecked: CheckboxState | undefined =
      group && value !== undefined ? group.value.includes(value) : undefined

    const checked: CheckboxState =
      groupChecked !== undefined
        ? groupChecked
        : isControlled
          ? (checkedProp as CheckboxState)
          : internalChecked

    const handleChange = useCallback(
      (next: CheckboxState) => {
        if (group && value !== undefined) {
          group.onItemChange(value, next === true)
        }
        if (!isControlled && groupChecked === undefined) {
          setInternalChecked(next)
        }
        onCheckedChange?.(next)
      },
      [group, value, isControlled, groupChecked, onCheckedChange],
    )

    // When inside a group, group-level disabled/etc cascade unless the
    // checkbox itself overrides them explicitly.
    const effectiveDisabled = group?.disabled || disabled
    const effectiveReadOnly = group?.readOnly || readOnly
    const effectiveRequired = group?.required || required
    const effectiveInvalid = group?.invalid || invalid
    const effectiveSize = group?.size ?? size
    const effectiveName = name ?? group?.name

    const ctx = useMemo<CheckboxContextValue>(
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
        hasDescription: false,
        hasErrorMessage: false,
        onCheckedChange: handleChange,
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
        handleChange,
        effectiveName,
        value,
      ],
    )

    return (
      <CheckboxContext.Provider value={ctx}>
        <span
          ref={ref}
          data-disabled={effectiveDisabled ? 'true' : 'false'}
          data-invalid={effectiveInvalid ? 'true' : 'false'}
          data-state={
            checked === 'indeterminate'
              ? 'indeterminate'
              : checked
                ? 'checked'
                : 'unchecked'
          }
          className={cx(rootClasses, className, classes?.root)}
          {...rest}
        >
          {children}
        </span>
      </CheckboxContext.Provider>
    )
  },
)

CheckboxRoot.displayName = 'Checkbox.Root'

export type { CheckboxRootProps }
