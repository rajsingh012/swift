import { forwardRef } from 'react'
import { useListItemContext } from './ListItem.context'
import {
  cx,
  firstLineHeightClasses,
  trailingClasses,
} from './ListItem.styles'
import type { ListItemTrailingProps } from './ListItem.types'

/**
 * Right-edge slot (logical end — flips for RTL). Hosts chevrons,
 * switches, badges, timestamps. Nested interactive controls (Switch,
 * IconButton) stop click propagation themselves; the row still treats
 * the rest of its surface as a single hit target.
 *
 * When effective align is "start" (multi-line content), the slot
 * collapses to the title's first-line height + items-center, so a
 * "New" badge or timestamp sits optically on the title baseline rather
 * than at the very top of a tall row.
 */
export const ListItemTrailing = forwardRef<
  HTMLDivElement,
  ListItemTrailingProps
>(function ListItemTrailing({ className, align, ...rest }, ref) {
  const ctx = useListItemContext()
  const effectiveAlign = align ?? ctx.align
  return (
    <div
      ref={ref}
      data-slot="trailing"
      className={cx(
        trailingClasses,
        effectiveAlign === 'start' && firstLineHeightClasses[ctx.size],
        className,
      )}
      {...rest}
    />
  )
})
ListItemTrailing.displayName = 'ListItem.Trailing'
