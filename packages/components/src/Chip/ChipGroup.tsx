import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { DEFAULT_SELECTION_MODE } from './Chip.constants'
import { ChipGroupContext, type ChipGroupContextValue } from './Chip.context'
import { cx, groupOrientationClasses } from './Chip.styles'
import type { ChipGroupOwnProps, ChipSelectionMode } from './Chip.types'

type ChipGroupValue = string | readonly string[] | null

interface ChipGroupProps
  extends ChipGroupOwnProps,
    Omit<HTMLAttributes<HTMLDivElement>, keyof ChipGroupOwnProps | 'role'> {
  children?: ReactNode
}

function toSet(
  value: ChipGroupValue | undefined,
  mode: ChipSelectionMode,
): Set<string> {
  if (value === null || value === undefined) return new Set()
  if (Array.isArray(value)) return new Set(value)
  if (typeof value === 'string') {
    return value === '' ? new Set() : new Set([value])
  }
  void mode
  return new Set()
}

function setToValue(
  set: ReadonlySet<string>,
  mode: ChipSelectionMode,
): ChipGroupValue {
  if (mode === 'multiple') return Array.from(set)
  if (mode === 'single') {
    const [first] = set
    return first ?? null
  }
  return null
}

export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(
  function ChipGroup(props, ref) {
    const {
      value: controlledValue,
      defaultValue,
      onValueChange,
      selectionMode = DEFAULT_SELECTION_MODE,
      disabled = false,
      size,
      orientation = 'horizontal',
      classes,
      className,
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    } = props

    const isControlled = controlledValue !== undefined
    const [internal, setInternal] = useState<Set<string>>(() =>
      toSet(defaultValue, selectionMode),
    )

    // When controlled, recompute the set from props on every render. Cheap
    // for the realistic sizes a Chip group reaches.
    const selectedValues = isControlled
      ? toSet(controlledValue, selectionMode)
      : internal

    // Keep a stable ref to the latest selection so `toggle` doesn't need to
    // close over the snapshot — it always reads the current value.
    const valuesRef = useRef(selectedValues)
    valuesRef.current = selectedValues

    const toggle = useCallback(
      (chipValue: string) => {
        if (disabled) return
        const current = valuesRef.current
        const next = new Set(current)

        if (selectionMode === 'none') {
          // No-op selection; consumers can still listen via onClick on the chip.
          return
        }

        if (selectionMode === 'single') {
          if (next.has(chipValue)) {
            next.delete(chipValue)
          } else {
            next.clear()
            next.add(chipValue)
          }
        } else {
          // 'multiple'
          if (next.has(chipValue)) {
            next.delete(chipValue)
          } else {
            next.add(chipValue)
          }
        }

        if (!isControlled) setInternal(next)
        onValueChange?.(setToValue(next, selectionMode))
      },
      [disabled, selectionMode, isControlled, onValueChange],
    )

    const ctx = useMemo<ChipGroupContextValue>(
      () => ({ selectionMode, selectedValues, toggle, disabled, size }),
      [selectionMode, selectedValues, toggle, disabled, size],
    )

    return (
      <ChipGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          role="group"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-disabled={disabled || undefined}
          data-orientation={orientation}
          data-selection-mode={selectionMode}
          className={cx(
            groupOrientationClasses[orientation],
            className,
            classes?.root,
          )}
          {...rest}
        >
          {children}
        </div>
      </ChipGroupContext.Provider>
    )
  },
)
