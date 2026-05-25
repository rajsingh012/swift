import { forwardRef, type HTMLAttributes } from 'react'
import { useCardContext } from './Card.context'
import { cx, paddingXClasses, paddingYClasses } from './Card.styles'

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a hairline bottom divider between header and body. */
  divider?: boolean
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, divider = false, ...rest }, ref) {
    const { size } = useCardContext()
    return (
      <div
        ref={ref}
        className={cx(
          'flex flex-col gap-1',
          paddingXClasses[size],
          paddingYClasses[size],
          divider && 'border-b border-stroke',
          className,
        )}
        {...rest}
      />
    )
  },
)
