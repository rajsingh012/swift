import { forwardRef, type HTMLAttributes } from 'react'
import { useCardContext } from './Card.context'
import { cx, paddingXClasses, paddingYClasses } from './Card.styles'

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a hairline top divider between body and footer. */
  divider?: boolean
  /** Tints the footer with the muted surface — useful for actions strips. */
  muted?: boolean
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter(
    { className, divider = false, muted = false, ...rest },
    ref,
  ) {
    const { size } = useCardContext()
    return (
      <div
        ref={ref}
        className={cx(
          paddingXClasses[size],
          paddingYClasses[size],
          divider && 'border-t border-stroke',
          muted && 'bg-surface-muted',
          className,
        )}
        {...rest}
      />
    )
  },
)
