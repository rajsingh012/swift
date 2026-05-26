import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import { DEFAULT_SIZE } from './Checkbox.constants'
import {
  CheckboxContext,
  useCheckboxGroupContext,
  type CheckboxContextValue,
} from './Checkbox.context'
import {
  cx,
  descriptionClasses,
  errorMessageClasses,
  rootClasses,
  textWrapperClasses,
} from './Checkbox.styles'
import { CheckboxInput } from './CheckboxInput'
import { CheckboxLabel } from './CheckboxLabel'
import type { CheckboxProps, CheckboxState } from './Checkbox.types'

/**
 * Convenience single-element API. Renders the box, the real input, the
 * indicator, label (from `children`), description and error message in one
 * shot. For non-standard layouts use `<Checkbox.Root>` and compose the parts.
 */
const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const {
      size = DEFAULT_SIZE,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
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

    const handleCheckedChange = useCallback(
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

    const handleNativeChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event)
      },
      [onChange],
    )

    // Group-level state cascades unless the checkbox sets its own override.
    const effectiveDisabled = group?.disabled || disabled
    const effectiveReadOnly = group?.readOnly || readOnly
    const effectiveRequired = group?.required || required
    const effectiveInvalid = group?.invalid || invalid
    const effectiveSize = group?.size ?? size
    const effectiveName = name ?? group?.name

    const hasDescription = Boolean(description)
    const hasErrorMessage = Boolean(errorMessage) && effectiveInvalid

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
        hasDescription,
        hasErrorMessage,
        indicator,
        onCheckedChange: handleCheckedChange,
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
        handleCheckedChange,
        effectiveName,
        value,
      ],
    )

    const dataState =
      checked === 'indeterminate'
        ? 'indeterminate'
        : checked
          ? 'checked'
          : 'unchecked'

    return (
      <CheckboxContext.Provider value={ctx}>
        <span
          data-disabled={effectiveDisabled ? 'true' : 'false'}
          data-invalid={effectiveInvalid ? 'true' : 'false'}
          data-state={dataState}
          className={cx(rootClasses, className, classes?.root)}
        >
          <CheckboxInput
            ref={ref}
            onChange={handleNativeChange}
            className={classes?.box}
            {...rest}
          />

          {children !== undefined || description || (errorMessage && effectiveInvalid) ? (
            <span className={cx(textWrapperClasses, classes?.text)}>
              {children !== undefined ? (
                <CheckboxLabel className={classes?.label}>
                  {children}
                </CheckboxLabel>
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
      </CheckboxContext.Provider>
    )
  },
)

CheckboxComponent.displayName = 'Checkbox'

export { CheckboxComponent }
