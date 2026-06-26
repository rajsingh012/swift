import { forwardRef } from 'react'
import {
  DEFAULT_LABEL_ALIGN,
  DEFAULT_ORIENTATION,
  DEFAULT_VARIANT,
} from './Divider.constants'
import {
  cx,
  horizontalClasses,
  labelClasses,
  labelLineClasses,
  labelledRootClasses,
  rootClasses,
  variantClasses,
  verticalClasses,
} from './Divider.styles'
import type { DividerProps } from './Divider.types'

/**
 * A thin rule that separates content — horizontally or vertically — with an
 * optional inline label on horizontal dividers.
 *
 *   <Divider />
 *   <Divider orientation="vertical" />
 *   <Divider>OR</Divider>
 *
 * Accessibility: a bare divider renders `role="separator"` with the matching
 * `aria-orientation`. Pass `decorative` to drop it from the a11y tree
 * (`role="none"`) when it's purely visual. A labelled divider exposes the
 * label text as its accessible name.
 */
const DividerRoot = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  props,
  ref,
) {
  const {
    orientation = DEFAULT_ORIENTATION,
    variant = DEFAULT_VARIANT,
    labelAlign = DEFAULT_LABEL_ALIGN,
    decorative = false,
    children,
    classes,
    className,
    ...rest
  } = props

  const role = decorative ? 'none' : 'separator'
  // aria-orientation defaults to horizontal; only set it for vertical to keep
  // the DOM clean and match the WAI-ARIA separator pattern.
  const ariaOrientation =
    !decorative && orientation === 'vertical' ? 'vertical' : undefined

  // ── Labelled divider (horizontal only) ──
  const hasLabel = children != null && orientation === 'horizontal'
  if (hasLabel) {
    // Grow ratios position the label: center = equal, start = tiny leading
    // line, end = tiny trailing line.
    const startGrow = labelAlign === 'start' ? 'grow-0 basis-6' : 'grow'
    const endGrow = labelAlign === 'end' ? 'grow-0 basis-6' : 'grow'

    return (
      <div
        ref={ref}
        role={role}
        aria-orientation={ariaOrientation}
        data-orientation="horizontal"
        data-variant={variant}
        className={cx(labelledRootClasses, className, classes?.root)}
        {...rest}
      >
        <span
          aria-hidden="true"
          className={cx(startGrow, labelLineClasses, variantClasses[variant], classes?.line)}
        />
        <span className={cx(labelClasses, classes?.label)}>{children}</span>
        <span
          aria-hidden="true"
          className={cx(endGrow, labelLineClasses, variantClasses[variant], classes?.line)}
        />
      </div>
    )
  }

  // ── Plain line ──
  return (
    <div
      ref={ref}
      role={role}
      aria-orientation={ariaOrientation}
      data-orientation={orientation}
      data-variant={variant}
      className={cx(
        rootClasses,
        orientation === 'vertical' ? verticalClasses : horizontalClasses,
        variantClasses[variant],
        className,
        classes?.root,
        classes?.line,
      )}
      {...rest}
    />
  )
})
DividerRoot.displayName = 'Divider'

export const Divider = Object.assign(DividerRoot, { Root: DividerRoot })
