import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  footer?: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { title, footer, className, children, ...rest },
  ref,
) {
  const classes = [
    'overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={classes} {...rest}>
      {title ? (
        <div className="border-b border-gray-200 px-5 py-4 text-base font-semibold">
          {title}
        </div>
      ) : null}
      <div className="px-5 py-5">{children}</div>
      {footer ? (
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">{footer}</div>
      ) : null}
    </div>
  )
})
