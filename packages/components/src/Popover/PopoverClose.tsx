import { forwardRef, type MouseEvent, type ReactNode } from 'react'
import { Slot } from '../internal/Slot'
import { usePopover } from './Popover.context'
import { closeButtonClasses, cx } from './Popover.styles'
import type { PopoverCloseProps } from './Popover.types'
import { mergeRefs } from './Popover.utils'

function CloseGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  )
}

export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose(
    { asChild = false, onClick, type, children, className, ...rest },
    ref,
  ) {
    const { setOpen } = usePopover('Popover.Close')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) setOpen(false)
    }

    if (asChild) {
      return (
        <Slot
          ref={mergeRefs<HTMLButtonElement>(ref) as never}
          onClick={handleClick as never}
          {...rest}
        >
          {children as ReactNode}
        </Slot>
      )
    }

    const isIconButton = children == null
    const { 'aria-label': ariaLabel, ...buttonRest } = rest

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        aria-label={ariaLabel ?? (isIconButton ? 'Close' : undefined)}
        onClick={handleClick}
        className={cx(isIconButton && closeButtonClasses, className)}
        {...buttonRest}
      >
        {isIconButton ? <CloseGlyph /> : children}
      </button>
    )
  },
)
PopoverClose.displayName = 'Popover.Close'
