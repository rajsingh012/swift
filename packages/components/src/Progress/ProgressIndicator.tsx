import { forwardRef, type HTMLAttributes } from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import { useProgressContext } from './Progress.context'
import { cx, indicatorClasses, variantClasses } from './Progress.styles'

export type ProgressIndicatorProps = HTMLAttributes<HTMLDivElement>

/**
 * The filled portion of the bar. Reads its width (percentage) and colour
 * (variant) from the enclosing `<Progress.Root>` context. Width is omitted
 * while indeterminate so the CSS slide animation can take over.
 */
export const ProgressIndicator = forwardRef<
  HTMLDivElement,
  ProgressIndicatorProps
>(function ProgressIndicator({ className, style, ...rest }, ref) {
  const ctx = useProgressContext('Progress.Indicator')
  const mergedStyle: CSSPropertiesWithVars = {
    '--progress-percent': `${ctx.percent}%`,
    ...(ctx.indeterminate ? {} : { width: 'var(--progress-percent)' }),
    ...style,
  }
  return (
    <div
      ref={ref}
      data-state={ctx.indeterminate ? 'indeterminate' : 'determinate'}
      className={cx(indicatorClasses, variantClasses[ctx.variant], className)}
      style={mergedStyle}
      {...rest}
    />
  )
})
ProgressIndicator.displayName = 'Progress.Indicator'
