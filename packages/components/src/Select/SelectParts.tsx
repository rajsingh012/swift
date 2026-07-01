import { forwardRef, useEffect, useState } from 'react'
import { useId } from 'react'
import { createPortal } from 'react-dom'
import {
  cx,
  groupLabelClasses,
  separatorClasses,
} from './Select.styles'
import type {
  SelectGroupProps,
  SelectPortalProps,
  SelectSeparatorProps,
} from './Select.types'

export function SelectPortal({ container, children }: SelectPortalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, container ?? document.body)
}
SelectPortal.displayName = 'Select.Portal'

export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  function SelectSeparator({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cx(separatorClasses, className)}
        {...rest}
      />
    )
  },
)
SelectSeparator.displayName = 'Select.Separator'

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  function SelectGroup({ label, className, children, ...rest }, ref) {
    const reactId = useId()
    const labelId = `swift-select-group-${reactId}`
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={label != null ? labelId : undefined}
        className={className}
        {...rest}
      >
        {label != null ? (
          <div id={labelId} className={groupLabelClasses}>
            {label}
          </div>
        ) : null}
        {children}
      </div>
    )
  },
)
SelectGroup.displayName = 'Select.Group'
