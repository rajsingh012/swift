import { forwardRef, type HTMLAttributes } from 'react'

export type ChipLabelProps = HTMLAttributes<HTMLSpanElement>

/**
 * Text content of a Chip. Optional — `<Chip>Text</Chip>` still works — but
 * wrapping the label lets you target it with `className` when composing with
 * icons or a remove button.
 */
export const ChipLabel = forwardRef<HTMLSpanElement, ChipLabelProps>(
  function ChipLabel({ className, children, ...rest }, ref) {
    return (
      <span ref={ref} className={className} {...rest}>
        {children}
      </span>
    )
  },
)
ChipLabel.displayName = 'Chip.Label'
