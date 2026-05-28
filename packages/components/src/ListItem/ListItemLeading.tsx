import { forwardRef } from 'react'
import { useListItemContext } from './ListItem.context'
import {
  cx,
  firstLineHeightClasses,
  leadingClasses,
  leadingSizeClasses,
  leadingWidthClasses,
} from './ListItem.styles'
import type { ListItemLeadingProps } from './ListItem.types'

/**
 * Container for the leading slot — avatar, icon, checkbox, status dot
 * in horizontal rows; full-width image / media in vertical cards.
 *
 * Sizing rules:
 *   - Vertical orientation → no clamps, the child (image) sets dimensions.
 *   - align="center" / "end" → square min-size grid so avatars / icons
 *     keep an optically aligned column across the list.
 *   - align="start" (multi-line content) → width clamped, height collapsed
 *     to the title's first-line height + items-center, so a checkbox or
 *     icon centers on the title's cap-mid instead of floating above it.
 */
export const ListItemLeading = forwardRef<HTMLDivElement, ListItemLeadingProps>(
  function ListItemLeading({ className, align, ...rest }, ref) {
    const ctx = useListItemContext()
    const isVertical = ctx.orientation === 'vertical'
    const effectiveAlign = align ?? ctx.align

    return (
      <div
        ref={ref}
        data-slot="leading"
        className={cx(
          leadingClasses,
          !isVertical &&
            (effectiveAlign === 'start'
              ? cx(
                  leadingWidthClasses[ctx.size],
                  firstLineHeightClasses[ctx.size],
                )
              : leadingSizeClasses[ctx.size]),
          className,
        )}
        {...rest}
      />
    )
  },
)
ListItemLeading.displayName = 'ListItem.Leading'
