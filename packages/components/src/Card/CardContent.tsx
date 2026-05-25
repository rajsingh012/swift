import { forwardRef, type HTMLAttributes } from 'react'
import { useCardContext } from './Card.context'
import { contentPaddingYClasses, cx, paddingXClasses } from './Card.styles'

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function CardContent({ className, ...rest }, ref) {
  const { size } = useCardContext()
  return (
    <div
      ref={ref}
      className={cx(
        paddingXClasses[size],
        contentPaddingYClasses[size],
        className,
      )}
      {...rest}
    />
  )
})
