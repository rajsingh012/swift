import { forwardRef } from 'react'
import { useAlertContext } from './Alert.context'
import { cx, descriptionClasses } from './Alert.styles'
import type { AlertDescriptionProps } from './Alert.types'

/** Secondary body text. Sets `id={context.descriptionId}` so the root
 *  can wire `aria-describedby` automatically. */
export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  function AlertDescription({ className, id, ...rest }, ref) {
    const { descriptionId } = useAlertContext()
    return (
      <div
        ref={ref}
        id={id ?? descriptionId}
        className={cx(descriptionClasses, className)}
        {...rest}
      />
    )
  },
)
AlertDescription.displayName = 'Alert.Description'
