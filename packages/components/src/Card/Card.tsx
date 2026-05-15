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
    'overflow-hidden rounded-lg border border-stroke bg-surface-elevated text-content shadow-level1',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={ref} className={classes} {...rest}>
      {title ? (
        <div className="border-b border-stroke px-5 py-4 text-base font-semibold text-content-strong">
          {title}
        </div>
      ) : null}
      <div className="px-5 py-5">{children}</div>
      {footer ? (
        <div className="border-t border-stroke bg-surface-muted px-5 py-3">{footer}</div>
      ) : null}
    </div>
  )
})
