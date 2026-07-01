import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react'
import {
  DEFAULT_SIZE,
  DEFAULT_STATE,
  DEFAULT_VARIANT,
} from './Select.constants'
import { useSelect } from './Select.context'
import {
  cx,
  triggerClasses,
  triggerSizeClasses,
} from './Select.styles'
import type { SelectTriggerProps } from './Select.types'
import { mergeRefs } from './Select.utils'

/**
 * The button that opens the listbox and shows the current value. Renders
 * `role="combobox"` wired to the listbox via aria-controls/aria-expanded.
 * Opens on click and ArrowUp/Down/Enter/Space; typeahead works while closed.
 */
export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger(props, ref) {
    const {
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      state = DEFAULT_STATE,
      invalid = false,
      fullWidth = false,
      className,
      children,
      type,
      onClick,
      onKeyDown,
      ...rest
    } = props

    const {
      open,
      setOpen,
      value,
      disabled,
      required,
      contentId,
      triggerId,
      triggerRef,
      moveHighlight,
      onTypeahead,
    } = useSelect('Select.Trigger')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented && !disabled) setOpen(!open)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || disabled) return
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (!open) setOpen(true)
          else moveHighlight(event.key === 'ArrowUp' ? 'prev' : 'next')
          break
        default:
          if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
            onTypeahead(event.key)
          }
      }
    }

    const composedRef = mergeRefs<HTMLButtonElement>(ref, (node) => {
      triggerRef.current = node
    })

    const hasValue = value !== null && value !== undefined && value !== ''

    return (
      <button
        ref={composedRef}
        type={type ?? 'button'}
        id={triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        data-state={open ? 'open' : 'closed'}
        data-placeholder={hasValue ? undefined : ''}
        className={cx(
          triggerClasses(variant, state, invalid),
          triggerSizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </button>
    )
  },
)
SelectTrigger.displayName = 'Select.Trigger'
