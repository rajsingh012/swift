import { forwardRef } from 'react'
import { Slot } from '../internal/Slot'
import { useSwitchContext } from './Switch.context'
import { cx, thumbClasses } from './Switch.styles'
import type { SwitchThumbProps } from './Switch.types'

function Spinner() {
  return <span aria-hidden className="swift-switch-spinner" />
}

/**
 * The travelling circle. Renders, in priority order:
 *   1. a spinner when `loading` is true (suppresses all icons), then
 *   2. the icon supplied via the matching prop on `<Switch.Thumb>`, then
 *   3. the icon supplied via `checkedIcon` / `uncheckedIcon` on the Root.
 *
 * Position (inset-inline-start) is driven by CSS from the root's
 * data-state attribute, so this component knows nothing about geometry.
 *
 * When `asChild` is true, the consumer's element replaces the wrapper.
 * Glyph resolution is skipped — only the spinner is injected (because
 * loading is the one state the wrapper *must* reflect for a11y).
 */
export const SwitchThumb = forwardRef<HTMLSpanElement, SwitchThumbProps>(
  function SwitchThumb(props, ref) {
    const ctx = useSwitchContext()
    const {
      className,
      checkedIcon: checkedIconProp,
      uncheckedIcon: uncheckedIconProp,
      asChild = false,
      children,
      ...rest
    } = props

    const thumbProps = {
      'aria-hidden': true,
      'data-state': ctx.checked ? 'checked' : 'unchecked',
      className: cx(thumbClasses, className),
      ...rest,
    }

    if (asChild) {
      return (
        <Slot ref={ref} {...thumbProps}>
          {children ?? (ctx.loading ? <Spinner /> : null)}
        </Slot>
      )
    }

    const glyph = ctx.loading
      ? <Spinner />
      : ctx.checked
        ? (checkedIconProp ?? ctx.checkedIcon)
        : (uncheckedIconProp ?? ctx.uncheckedIcon)

    return (
      <span ref={ref} {...thumbProps}>
        {children ?? glyph ?? null}
      </span>
    )
  },
)

SwitchThumb.displayName = 'Switch.Thumb'
