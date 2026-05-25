import { forwardRef, type HTMLAttributes } from 'react'
import { useCardContext } from './Card.context'
import { cx, paddingXClasses, paddingYClasses } from './Card.styles'

export interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Horizontal alignment of the action row. */
  align?: 'start' | 'center' | 'end' | 'between'
  divider?: boolean
  /** Tints with the muted surface — useful for footer-style action strips. */
  muted?: boolean
}

const alignClasses: Record<NonNullable<CardActionsProps['align']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  function CardActions(
    { className, align = 'end', divider = false, muted = false, ...rest },
    ref,
  ) {
    const { size } = useCardContext()
    return (
      <div
        ref={ref}
        className={cx(
          'flex flex-wrap items-center gap-2',
          alignClasses[align],
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
