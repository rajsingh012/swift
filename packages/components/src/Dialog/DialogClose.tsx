import { forwardRef, type MouseEvent, type ReactNode } from 'react'
import { Slot } from '../internal/Slot'
import { useDialog } from './Dialog.context'
import { closeButtonClasses, cx } from './Dialog.styles'
import type { DialogCloseProps } from './Dialog.types'
import { mergeRefs } from './Dialog.utils'

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

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose(
    { asChild = false, onClick, type, children, className, ...rest },
    ref,
  ) {
    const { setOpen } = useDialog('Dialog.Close')

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
DialogClose.displayName = 'Dialog.Close'
