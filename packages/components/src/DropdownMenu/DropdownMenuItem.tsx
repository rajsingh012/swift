import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { useDropdownMenu } from './DropdownMenu.context'
import {
  cx,
  itemClasses,
  itemIconClasses,
  itemShortcutClasses,
} from './DropdownMenu.styles'
import type { DropdownMenuItemProps } from './DropdownMenu.types'
import { mergeRefs } from './DropdownMenu.utils'

/**
 * A selectable menu command. Roving-focus tab stop (`tabIndex=-1`), activates
 * on click / Enter / Space, and closes the menu unless `closeOnSelect` is
 * false or the consumer calls `event.preventDefault()` in `onSelect`.
 */
export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(props, ref) {
    const {
      disabled = false,
      onSelect,
      closeOnSelect = true,
      icon,
      shortcut,
      className,
      children,
      onClick,
      onKeyDown,
      onPointerEnter,
      ...rest
    } = props

    const { setOpen, registerItem } = useDropdownMenu('DropdownMenu.Item')
    const [highlighted, setHighlighted] = useState(false)

    const select = useCallback(() => {
      if (disabled) return
      let prevented = false
      const event = {
        preventDefault: () => {
          prevented = true
        },
        get defaultPrevented() {
          return prevented
        },
      }
      onSelect?.(event)
      if (!prevented && closeOnSelect) setOpen(false)
    }, [disabled, onSelect, closeOnSelect, setOpen])

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
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        data-disabled={disabled ? '' : undefined}
        data-highlighted={highlighted && !disabled ? '' : undefined}
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
        {icon != null ? <span className={itemIconClasses}>{icon}</span> : null}
        <span className="flex-1">{children}</span>
        {shortcut != null ? (
          <span className={itemShortcutClasses}>{shortcut}</span>
        ) : null}
      </div>
    )
  },
)
DropdownMenuItem.displayName = 'DropdownMenu.Item'
