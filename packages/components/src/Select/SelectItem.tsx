import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { useSelect } from './Select.context'
import { cx, itemClasses, itemIndicatorClasses } from './Select.styles'
import type { SelectItemProps } from './Select.types'
import { mergeRefs } from './Select.utils'

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * A selectable option. Registers with the root for keyboard nav / typeahead,
 * registers its label so the trigger can display it, and commits its value on
 * click. Highlight follows the root's `highlighted` value (pointer enter +
 * keyboard nav both drive it).
 */
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem(props, ref) {
    const {
      value,
      textValue,
      disabled = false,
      className,
      children,
      onClick,
      onKeyDown,
      onPointerEnter,
      ...rest
    } = props

    const {
      value: selectedValue,
      setValue,
      highlighted,
      setHighlighted,
      registerItem,
      unregisterItem,
      registerLabel,
    } = useSelect('Select.Item')

    const itemRef = useRef<HTMLElement | null>(null)

    // Resolve the display text: explicit textValue, else string children.
    const resolvedText =
      textValue ?? (typeof children === 'string' ? children : value)

    useEffect(() => {
      registerItem({ value, textValue: resolvedText, disabled, ref: itemRef })
      registerLabel(value, resolvedText)
      return () => unregisterItem(value)
    }, [value, resolvedText, disabled, registerItem, unregisterItem, registerLabel])

    const selected = selectedValue === value
    const isHighlighted = highlighted === value

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || disabled) return
      setValue(value)
    }

    // Keyboard nav is owned by the listbox (combobox pattern), but each option
    // also handles Enter/Space directly so it works if focused individually.
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || disabled) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setValue(value)
      }
    }

    const mergedRef = useMemo(
      () =>
        mergeRefs<HTMLDivElement>(ref, (node) => {
          itemRef.current = node
        }),
      [ref],
    )

    return (
      <div
        ref={mergedRef}
        role="option"
        tabIndex={-1}
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        data-highlighted={isHighlighted && !disabled ? '' : undefined}
        data-state={selected ? 'checked' : 'unchecked'}
        className={cx(itemClasses, className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          if (!disabled) setHighlighted(value)
        }}
        {...rest}
      >
        <span className={itemIndicatorClasses} aria-hidden>
          {selected ? <CheckGlyph /> : null}
        </span>
        <span className="min-w-0 flex-1 truncate">{children}</span>
      </div>
    )
  },
)
SelectItem.displayName = 'Select.Item'
