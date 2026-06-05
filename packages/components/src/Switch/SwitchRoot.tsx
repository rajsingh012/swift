import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  SwitchContext,
  useSwitchGroupContext,
  type SwitchContextValue,
} from './Switch.context'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Switch.constants'
import { cx, rootClasses } from './Switch.styles'
import type { SwitchApi, SwitchRootProps } from './Switch.types'

/**
 * Compound-mode root. Owns the controlled/uncontrolled state, ARIA ids,
 * and the cascading flags, then exposes everything via context. Renders
 * a thin <span> wrapper with state-driven data-* attributes so the CSS
 * tokens in theme/switch.css can swap colours / positions.
 *
 * Use `<Switch.Root>` only when the convenience `<Switch>` can't express
 * the layout — for example, label above the pill, or a custom description
 * slot interleaved with other form chrome.
 *
 * When nested inside a `<SwitchGroup>`, the group owns the truth: this
 * root's `value` prop is looked up in the group's value array, and the
 * group's flags cascade unless the root sets its own overrides.
 */
export const SwitchRoot = forwardRef<HTMLSpanElement, SwitchRootProps>(
  function SwitchRoot(props, ref) {
    const {
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      disabled = false,
      readOnly = false,
      required = false,
      invalid = false,
      loading = false,
      id: idProp,
      value,
      name,
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

    const handleChange = useCallback(
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

    const effectiveDisabled = group?.disabled || disabled
    const effectiveReadOnly = group?.readOnly || readOnly
    const effectiveRequired = group?.required || required
    const effectiveInvalid = group?.invalid || invalid
    const effectiveSize = group?.size ?? size
    const effectiveVariant = group?.variant ?? variant
    const effectiveName = name ?? group?.name

    // Shared input ref so the imperative handle can focus/blur the native
    // input that Switch.Input renders. Populated through context.
    const inputRef = useRef<HTMLInputElement | null>(null)
    const checkedRef = useRef<boolean>(checked)
    checkedRef.current = checked

    useImperativeHandle(
      apiRef,
      (): SwitchApi => ({
        toggle: () => handleChange(!checkedRef.current),
        setChecked: (next: boolean) => handleChange(next),
        focus: (options) => inputRef.current?.focus(options),
        blur: () => inputRef.current?.blur(),
        getChecked: () => checkedRef.current,
      }),
      [handleChange],
    )

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
        hasDescription: false,
        hasErrorMessage: false,
        onCheckedChange: handleChange,
        name: effectiveName,
        value,
        inputRef,
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
        handleChange,
        effectiveName,
        value,
        dragToToggle,
      ],
    )

    return (
      <SwitchContext.Provider value={ctx}>
        <span
          ref={ref}
          data-size={effectiveSize}
          data-variant={effectiveVariant}
          data-state={checked ? 'checked' : 'unchecked'}
          data-disabled={effectiveDisabled ? 'true' : 'false'}
          data-readonly={effectiveReadOnly ? 'true' : 'false'}
          data-invalid={effectiveInvalid ? 'true' : 'false'}
          data-loading={loading ? 'true' : 'false'}
          className={cx(rootClasses, className, classes?.root)}
          {...rest}
        >
          {children}
        </span>
      </SwitchContext.Provider>
    )
  },
)

SwitchRoot.displayName = 'Switch.Root'

export type { SwitchRootProps }
