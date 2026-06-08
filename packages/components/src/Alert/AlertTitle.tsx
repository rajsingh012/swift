import { forwardRef } from 'react'
import { useAlertContext } from './Alert.context'
import { cx, titleClasses } from './Alert.styles'
import type { AlertTitleProps } from './Alert.types'

/** Primary heading inside the alert. Sets `id={context.titleId}` so the
 *  root can wire `aria-labelledby` automatically. */
export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(
  function AlertTitle({ className, id, ...rest }, ref) {
    const { titleId } = useAlertContext()
    return (
      <div
        ref={ref}
        id={id ?? titleId}
        className={cx(titleClasses, className)}
        {...rest}
      />
    )
  },
)
AlertTitle.displayName = 'Alert.Title'
