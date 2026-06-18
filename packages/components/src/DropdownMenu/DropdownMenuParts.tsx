import { forwardRef, useId } from 'react'
import {
  cx,
  groupClasses,
  labelClasses,
  separatorClasses,
} from './DropdownMenu.styles'
import type {
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
} from './DropdownMenu.types'

export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(labelClasses, className)} {...rest} />
  },
)
DropdownMenuLabel.displayName = 'DropdownMenu.Label'

export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cx(separatorClasses, className)}
      {...rest}
    />
  )
})
DropdownMenuSeparator.displayName = 'DropdownMenu.Separator'

export const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup({ label, className, children, ...rest }, ref) {
    const reactId = useId()
    const labelId = `swift-menu-group-${reactId}`
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={label != null ? labelId : undefined}
        className={cx(groupClasses, className)}
        {...rest}
      >
        {label != null ? (
          <div id={labelId} className={labelClasses}>
            {label}
          </div>
        ) : null}
        {children}
      </div>
    )
  },
)
DropdownMenuGroup.displayName = 'DropdownMenu.Group'
