import { forwardRef, type HTMLAttributes } from 'react'

export type ToggleLabelProps = HTMLAttributes<HTMLSpanElement>

/**
 * Text content of a Toggle. Optional — `<Toggle>Bold</Toggle>` still works —
 * but wrapping the label lets you target it with `className` when composing
 * alongside an icon.
 */
export const ToggleLabel = forwardRef<HTMLSpanElement, ToggleLabelProps>(
  function ToggleLabel({ className, children, ...rest }, ref) {
    return (
      <span ref={ref} className={className} {...rest}>
        {children}
      </span>
    )
  },
)
ToggleLabel.displayName = 'Toggle.Label'
