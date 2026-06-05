import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { mergeRefs } from '../internal/refs'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Switch.constants'
import {
  SwitchContext,
  useSwitchGroupContext,
  type SwitchContextValue,
} from './Switch.context'
import {
  cx,
  descriptionClasses,
  errorMessageClasses,
  rootClasses,
  textWrapperClasses,
} from './Switch.styles'
import { SwitchInput } from './SwitchInput'
import { SwitchLabel } from './SwitchLabel'
import type { SwitchApi, SwitchProps } from './Switch.types'

/**
 * Convenience single-element API. Renders the pill (track + thumb + hidden
 * input), the label (from `children`), description and error message in
 * one shot. For non-standard layouts use `<Switch.Root>` and compose the
 * parts directly.
 */
const SwitchComponent = forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    const {
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      onChange,

      disabled = false,
      readOnly = false,
      required = false,
      invalid = false,
      loading = false,

      description,
      errorMessage,
      checkedIcon,
      uncheckedIcon,

      value,
      name,
      id: idProp,
      classes,
      className,
      children,
      apiRef,
      dragToToggle = true,

      ...rest
    } = props

    const group = useSwitchGroupContext()

    const reactId = useId()
    const id = idProp ?? `swift-switch-${reactId}`
    const descriptionId = `${id}-description`
    const errorMessageId = `${id}-error`

    // Local state covers the non-group case. When inside a group + value is
    // set, the group owns the truth; we still keep `internal` around so a
    // group-less switch retains its uncontrolled behaviour. Inlined rather
    // than going through useControllableState because the group cascade
    // adds a third layer the helper doesn't model — same shape as
    // CheckboxRoot's three-way resolution.
    const isControlled = checkedProp !== undefined
    const [internalChecked, setInternalChecked] = useState<boolean>(
      defaultChecked ?? false,
    )

    const groupChecked: boolean | undefined =
      group && value !== undefined ? group.value.includes(value) : undefined

    const checked: boolean =
      groupChecked !== undefined
        ? groupChecked
        : isControlled
          ? (checkedProp as boolean)
          : internalChecked

    const handleCheckedChange = useCallback(
      (next: boolean) => {
        if (group && value !== undefined) {
          group.onItemChange(value, next)
        }
        if (!isControlled && groupChecked === undefined) {
          setInternalChecked(next)
        }
        onCheckedChange?.(next)
      },
      [group, value, isControlled, groupChecked, onCheckedChange],
    )

    const handleNativeChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
    }

    // Mirror the live checked value into a ref so the imperative handle
    // can read it without re-rendering and the toggle() call stays correct
    // even if it fires inside a stale closure.
    const checkedRef = useRef<boolean>(checked)
    checkedRef.current = checked
    const inputRef = useRef<HTMLInputElement | null>(null)

    useImperativeHandle(
      apiRef,
      (): SwitchApi => ({
        toggle: () => handleCheckedChange(!checkedRef.current),
        setChecked: (next: boolean) => handleCheckedChange(next),
        focus: (options) => inputRef.current?.focus(options),
        blur: () => inputRef.current?.blur(),
        getChecked: () => checkedRef.current,
      }),
      [handleCheckedChange],
    )

    // Group-level state cascades unless the switch sets its own override.
    const effectiveDisabled = group?.disabled || disabled
    const effectiveReadOnly = group?.readOnly || readOnly
    const effectiveRequired = group?.required || required
    const effectiveInvalid = group?.invalid || invalid
    const effectiveSize = group?.size ?? size
    const effectiveVariant = group?.variant ?? variant
    const effectiveName = name ?? group?.name

    const hasDescription = Boolean(description)
    const hasErrorMessage = Boolean(errorMessage) && effectiveInvalid

    const ctx = useMemo<SwitchContextValue>(
      () => ({
        id,
        descriptionId,
        errorMessageId,
        size: effectiveSize,
        variant: effectiveVariant,
        checked,
        disabled: effectiveDisabled,
        readOnly: effectiveReadOnly,
        required: effectiveRequired,
        invalid: effectiveInvalid,
        loading,
        hasDescription,
        hasErrorMessage,
        checkedIcon,
        uncheckedIcon,
        onCheckedChange: handleCheckedChange,
        name: effectiveName,
        value,
        dragToToggle,
      }),
      [
        id,
        descriptionId,
        errorMessageId,
        effectiveSize,
        effectiveVariant,
        checked,
        effectiveDisabled,
        effectiveReadOnly,
        effectiveRequired,
        effectiveInvalid,
        loading,
        hasDescription,
        hasErrorMessage,
        checkedIcon,
        uncheckedIcon,
        handleCheckedChange,
        effectiveName,
        value,
        dragToToggle,
      ],
    )

    return (
      <SwitchContext.Provider value={ctx}>
        <span
          data-size={effectiveSize}
          data-variant={effectiveVariant}
          data-state={checked ? 'checked' : 'unchecked'}
          data-disabled={effectiveDisabled ? 'true' : 'false'}
          data-readonly={effectiveReadOnly ? 'true' : 'false'}
          data-invalid={effectiveInvalid ? 'true' : 'false'}
          data-loading={loading ? 'true' : 'false'}
          className={cx(rootClasses, className, classes?.root)}
        >
          <SwitchInput
            ref={mergeRefs(ref, inputRef)}
            onChange={handleNativeChange}
            className={classes?.control}
            {...rest}
          />

          {children !== undefined || description || (errorMessage && effectiveInvalid) ? (
            <span className={cx(textWrapperClasses, classes?.text)}>
              {children !== undefined ? (
                <SwitchLabel className={classes?.label}>{children}</SwitchLabel>
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
      </SwitchContext.Provider>
    )
  },
)

SwitchComponent.displayName = 'Switch'

export { SwitchComponent }
