import { forwardRef } from 'react'
import { contentClasses, cx } from './Alert.styles'
import type { AlertContentProps } from './Alert.types'

/** Wraps title + description in a flex column so the content stretches
 *  between the icon and the trailing actions / close. */
export const AlertContent = forwardRef<HTMLDivElement, AlertContentProps>(
  function AlertContent({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(contentClasses, className)} {...rest} />
  },
)
AlertContent.displayName = 'Alert.Content'
