import { forwardRef } from 'react'
import { useAlertContext } from './Alert.context'
import { DEFAULT_VARIANT_ICON } from './Alert.icons'
import { cx, iconWrapperClasses } from './Alert.styles'
import type { AlertIconProps } from './Alert.types'

/** Variant-driven default icon, with override via `children`. For the
 *  `default` variant there's no default glyph; pass children to render
 *  anything, otherwise nothing renders. */
export const AlertIcon = forwardRef<HTMLSpanElement, AlertIconProps>(
  function AlertIcon({ className, children, ...rest }, ref) {
    const { variant } = useAlertContext()

    // Explicit null suppresses the icon entirely.
    if (children === null) return null

    const Default = DEFAULT_VARIANT_ICON[variant]
    const resolved = children ?? (Default ? <Default size={18} /> : null)
    if (resolved === null) return null

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cx(iconWrapperClasses, className)}
        {...rest}
      >
        {resolved}
      </span>
    )
  },
)
AlertIcon.displayName = 'Alert.Icon'
