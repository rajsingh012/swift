import { forwardRef, type CSSProperties } from 'react'
import {
  DEFAULT_ANIMATION,
  DEFAULT_LINES,
  DEFAULT_VARIANT,
  LAST_LINE_WIDTH,
} from './Skeleton.constants'
import {
  animationClasses,
  baseClasses,
  cx,
  groupClasses,
  variantClasses,
} from './Skeleton.styles'
import type { SkeletonProps } from './Skeleton.types'

/** number → px, string passes through. */
function dim(value: number | string | undefined): string | undefined {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * A loading placeholder that mimics the shape of not-yet-loaded content.
 *
 *   <Skeleton width={200} />               // one text line
 *   <Skeleton variant="circle" width={40} height={40} />
 *   <Skeleton variant="text" lines={3} />  // a paragraph
 *
 * Accessibility: each placeholder is `aria-hidden` and decorative. Wrap the
 * loading region in your own `aria-busy`/`role="status"` container so AT
 * announces the loading state once, rather than per-bone.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(props, ref) {
    const {
      variant = DEFAULT_VARIANT,
      animation = DEFAULT_ANIMATION,
      width,
      height,
      lines = DEFAULT_LINES,
      className,
      style,
      ...rest
    } = props

    const boneClassName = cx(
      baseClasses,
      variantClasses[variant],
      animationClasses[animation],
      className,
    )

    // ── Multi-line text ──
    if (variant === 'text' && lines > 1) {
      return (
        <div
          ref={ref}
          aria-hidden="true"
          data-variant={variant}
          data-animation={animation}
          className={cx(groupClasses)}
          {...rest}
        >
          {Array.from({ length: lines }).map((_, i) => {
            const isLast = i === lines - 1
            const lineStyle: CSSProperties = {
              width: isLast ? LAST_LINE_WIDTH : dim(width) ?? '100%',
              height: dim(height),
              ...style,
            }
            return (
              <span
                key={i}
                className={boneClassName}
                data-animation={animation}
                style={lineStyle}
              />
            )
          })}
        </div>
      )
    }

    // ── Single bone ──
    const singleStyle: CSSProperties = {
      width: dim(width),
      height: dim(height),
      ...style,
    }

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        aria-hidden="true"
        data-variant={variant}
        data-animation={animation}
        className={boneClassName}
        style={singleStyle}
        {...rest}
      />
    )
  },
)
Skeleton.displayName = 'Skeleton'
