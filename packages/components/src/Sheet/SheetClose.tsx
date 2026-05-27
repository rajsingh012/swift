import { forwardRef, type MouseEvent, type ReactNode } from 'react'
import { Slot } from '../internal/Slot'
import { useSheet } from './Sheet.context'
import { closeButtonClasses } from './Sheet.styles'
import type { SheetCloseProps } from './Sheet.types'
import { cx, mergeRefs } from './Sheet.utils'

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

export const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(
  function SheetClose(
    { asChild = false, onClick, type, children, className, ...rest },
    ref,
  ) {
    const { setOpen } = useSheet('Sheet.Close')

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

    // Bare default = the floating "×" icon button; with children the consumer
    // owns the styling (we only attach the close behaviour).
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
SheetClose.displayName = 'Sheet.Close'
