import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { useControllableState } from '../internal/state'
import { useDropdownMenu } from './DropdownMenu.context'
import {
  checkIndicatorClasses,
  cx,
  itemClasses,
  itemShortcutClasses,
} from './DropdownMenu.styles'
import type { DropdownMenuCheckboxItemProps } from './DropdownMenu.types'
import { mergeRefs } from './DropdownMenu.utils'

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * A menu item with a checkable state — `role="menuitemcheckbox"`. Toggles on
 * activate; keeps the menu open by default (`closeOnSelect`).
 */
export const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem(props, ref) {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    closeOnSelect = false,
    shortcut,
    className,
    children,
    onClick,
    onKeyDown,
    onPointerEnter,
    ...rest
  } = props

  const { setOpen, registerItem } = useDropdownMenu('DropdownMenu.CheckboxItem')
  const [checked, setChecked] = useControllableState(
    checkedProp,
    defaultChecked,
    onCheckedChange,
  )
  const [highlighted, setHighlighted] = useState(false)

  const select = useCallback(() => {
    if (disabled) return
    setChecked(!checked)
    if (closeOnSelect) setOpen(false)
  }, [disabled, checked, setChecked, closeOnSelect, setOpen])

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    select()
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      select()
    }
  }

  const mergedRef = useMemo(
    () => mergeRefs<HTMLDivElement>(ref, registerItem as never),
    [ref, registerItem],
  )

  return (
    <div
      ref={mergedRef}
      role="menuitemcheckbox"
      tabIndex={-1}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      data-highlighted={highlighted && !disabled ? '' : undefined}
      data-state={checked ? 'checked' : 'unchecked'}
      className={cx(itemClasses, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => setHighlighted(true)}
      onBlur={() => setHighlighted(false)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        if (!disabled) event.currentTarget.focus()
      }}
      {...rest}
    >
      <span className={checkIndicatorClasses}>{checked ? <CheckGlyph /> : null}</span>
      <span className="flex-1">{children}</span>
      {shortcut != null ? <span className={itemShortcutClasses}>{shortcut}</span> : null}
    </div>
  )
})
DropdownMenuCheckboxItem.displayName = 'DropdownMenu.CheckboxItem'
