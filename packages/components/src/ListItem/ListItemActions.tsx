import { forwardRef } from 'react'
import { actionsClasses, cx } from './ListItem.styles'
import type { ListItemActionsProps } from './ListItem.types'

/**
 * Distinct slot for inline actions (icon buttons, kebab menus, swipe
 * actions). Kept separate from `Trailing` so consumers can mix passive
 * trailing content (timestamps, badges) with action affordances and
 * keep keyboard tab order predictable.
 */
export const ListItemActions = forwardRef<HTMLDivElement, ListItemActionsProps>(
  function ListItemActions({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="actions"
        className={cx(actionsClasses, className)}
        {...rest}
      />
    )
  },
)
ListItemActions.displayName = 'ListItem.Actions'
