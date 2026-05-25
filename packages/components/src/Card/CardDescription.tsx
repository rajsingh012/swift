import { forwardRef, type HTMLAttributes } from 'react'
import { useCardContext } from './Card.context'
import { cx, descriptionSizeClasses } from './Card.styles'

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...rest }, ref) {
  const { size } = useCardContext()
  return (
    <p
      ref={ref}
      className={cx('m-0 leading-snug', descriptionSizeClasses[size], className)}
      {...rest}
    />
  )
})
