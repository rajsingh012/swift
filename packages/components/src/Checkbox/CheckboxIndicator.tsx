import { forwardRef } from 'react'
import { useCheckboxContext } from './Checkbox.context'
import {
  cx,
  indicatorClasses,
  indicatorSizeClasses,
} from './Checkbox.styles'
import type { CheckboxIndicatorProps } from './Checkbox.types'

function TickGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.5 8.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DashGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.5 8h9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const CheckboxIndicator = forwardRef<
  HTMLSpanElement,
  CheckboxIndicatorProps
>(function CheckboxIndicator(props, ref) {
  const ctx = useCheckboxContext()
  const { forceState, className, children, ...rest } = props
  const state = forceState ?? ctx.checked

  if (state === false) return null

  return (
    <span
      ref={ref}
      aria-hidden
      data-state={state === 'indeterminate' ? 'indeterminate' : 'checked'}
      className={cx(indicatorClasses, indicatorSizeClasses[ctx.size], className)}
      {...rest}
    >
      {children ??
        ctx.indicator ??
        (state === 'indeterminate' ? <DashGlyph /> : <TickGlyph />)}
    </span>
  )
})

CheckboxIndicator.displayName = 'Checkbox.Indicator'
