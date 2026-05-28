import { forwardRef } from 'react'
import { useListItemContext } from './ListItem.context'
import {
  clampClasses,
  cx,
  descriptionClasses,
  descriptionSizeClasses,
} from './ListItem.styles'
import type { ListItemDescriptionProps } from './ListItem.types'

/**
 * Secondary text under the title. `lines` switches between an ellipsis
 * truncate (1) and `-webkit-line-clamp` (2/3) so multi-line descriptions
 * (notification bodies, flight details) clip predictably.
 */
export const ListItemDescription = forwardRef<
  HTMLParagraphElement,
  ListItemDescriptionProps
>(function ListItemDescription({ className, lines = 1, ...rest }, ref) {
  const { size } = useListItemContext()
  return (
    <p
      ref={ref}
      data-slot="description"
      className={cx(
        descriptionClasses,
        descriptionSizeClasses[size],
        clampClasses[lines],
        className,
      )}
      {...rest}
    />
  )
})
ListItemDescription.displayName = 'ListItem.Description'
