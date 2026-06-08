import {
  Children,
  forwardRef,
  isValidElement,
  useMemo,
  type ReactNode,
} from 'react'
import { Avatar } from './Avatar'
import {
  AvatarGroupContext,
  type AvatarGroupContextValue,
} from './Avatar.context'
import { cx } from './Avatar.styles'
import type { AvatarGroupProps } from './Avatar.types'
import { AvatarFallback } from './AvatarFallback'

/**
 * Horizontal stack of avatars with negative-margin overlap and an
 * optional `+N` overflow tile when there are more children than `max`.
 *
 * Cascades `size` + `shape` to nested avatars via context (per-avatar
 * props still win). Sets `data-in-group="true"` on each child so the
 * styles can apply the surface-coloured ring that separates overlapping
 * siblings cleanly.
 *
 * Z-stacking (leftmost on top — the conventional look) is handled in
 * `theme/avatar.css` via `nth-child`-derived z-indices, so no per-child
 * inline `style` is needed. DOM order = visual order = consumer order.
 *
 *     <AvatarGroup max={3} overlap="medium">
 *       <Avatar src="/raj.jpg" name="Raj Singh" />
 *       <Avatar src="/jane.jpg" name="Jane Doe" />
 *       <Avatar src="/aman.jpg" name="Aman Mehta" />
 *       <Avatar name="Priya Singh" />        // collapsed into +2 tile
 *       <Avatar name="Lee Park" />
 *     </AvatarGroup>
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    {
      max,
      renderOverflow,
      overlap = 'medium',
      size,
      shape,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const items = useMemo(() => {
      // Only count valid React elements — skip falsy / string children
      // that consumers might leak through map functions.
      const arr: ReactNode[] = []
      Children.forEach(children, (child) => {
        if (isValidElement(child)) arr.push(child)
      })
      return arr
    }, [children])

    const cap = max ?? items.length
    const visible = items.slice(0, cap)
    const overflowCount = Math.max(0, items.length - cap)

    const ctx = useMemo<AvatarGroupContextValue>(
      () => ({ size, shape, inGroup: true }),
      [size, shape],
    )

    return (
      <AvatarGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          role="group"
          data-overlap={overlap}
          className={cx('swift-avatar-group inline-flex', className)}
          {...rest}
        >
          {visible}
          {overflowCount > 0 ? (
            // Wrap the `+N` content in <Avatar.Fallback> so the Avatar
            // root's auto-detection skips its default Person silhouette
            // — otherwise both the silhouette and the +N would render.
            <Avatar aria-label={`${overflowCount} more`}>
              <AvatarFallback>
                {renderOverflow ? renderOverflow(overflowCount) : `+${overflowCount}`}
              </AvatarFallback>
            </Avatar>
          ) : null}
        </div>
      </AvatarGroupContext.Provider>
    )
  },
)
AvatarGroup.displayName = 'AvatarGroup'
