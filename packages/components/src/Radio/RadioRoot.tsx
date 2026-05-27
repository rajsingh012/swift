import { forwardRef, useCallback, useId, useMemo, useState } from 'react'
import { DEFAULT_SIZE } from './Radio.constants'
import {
  RadioContext,
  useRadioGroupContext,
  type RadioContextValue,
} from './Radio.context'
import { cx, rootClasses } from './Radio.styles'
import type { RadioRootProps } from './Radio.types'

/**
 * Compound-mode root. Holds the shared state (controlled/uncontrolled
 * toggle, ARIA ids) and exposes it via context. Renders no chrome, so
 * consumers compose `<Radio.Input/>`, `<Radio.Label/>`, etc.
 *
 * Reach for `<Radio.Root>` only when the convenience `<Radio>` can't
 * express your layout — e.g. label above the dot, custom description slot.
 */
export const RadioRoot = forwardRef<HTMLSpanElement, RadioRootProps>(
  function RadioRoot(props, ref) {
    const {
      size = DEFAULT_SIZE,
      checked: checkedProp,
      defaultChecked,
      onChange,
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
          // Radios can only be "selected"; deselection happens implicitly
          // when another radio in the group gets selected.
          if (next) group.onItemChange(value)
        }
        if (!isControlled && groupChecked === undefined) {
          setInternalChecked(next)
        }
        onChange?.(next)
      },
      [group, value, isControlled, groupChecked, onChange],
    )

    // Group-level state cascades unless the radio overrides it explicitly.
    const effectiveDisabled = group?.disabled || disabled
    const effectiveReadOnly = group?.readOnly || readOnly
    const effectiveRequired = group?.required || required
    const effectiveInvalid = group?.invalid || invalid
    const effectiveSize = group?.size ?? size
    const effectiveName = name ?? group?.name

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
        hasDescription: false,
        hasErrorMessage: false,
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
        handleChange,
        effectiveName,
        value,
      ],
    )

    return (
      <RadioContext.Provider value={ctx}>
        <span
          ref={ref}
          data-disabled={effectiveDisabled ? 'true' : 'false'}
          data-invalid={effectiveInvalid ? 'true' : 'false'}
          data-state={checked ? 'checked' : 'unchecked'}
          className={cx(rootClasses, className, classes?.root)}
          {...rest}
        >
          {children}
        </span>
      </RadioContext.Provider>
    )
  },
)

RadioRoot.displayName = 'Radio.Root'
