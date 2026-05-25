import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useCardContext } from './Card.context'
import { cx, titleSizeClasses } from './Card.styles'

type CardTitleOwnProps = {
  /** HTML heading level. Defaults to `h3` — Card sits inside other sections. */
  as?: ElementType
}

export type CardTitleProps<E extends ElementType = 'h3'> = CardTitleOwnProps &
  Omit<ComponentPropsWithoutRef<E>, keyof CardTitleOwnProps | 'children'> & {
    children?: ReactNode
  }

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ as, className, ...rest }, ref) {
    const { size } = useCardContext()
    const Component: ElementType = as ?? 'h3'
    return (
      <Component
        ref={ref}
        className={cx('m-0 leading-tight', titleSizeClasses[size], className)}
        {...(rest as HTMLAttributes<HTMLElement>)}
      />
    )
  },
)
