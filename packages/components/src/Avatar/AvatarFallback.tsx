import { Person } from '@swift/icons/Person'
import { forwardRef, useEffect, useState } from 'react'
import { useAvatarContext } from './Avatar.context'
import { cx, fallbackClasses } from './Avatar.styles'
import type { AvatarFallbackProps } from './Avatar.types'
import { getInitials } from './Avatar.utils'

/**
 * Renders when the image isn't loaded. Behaviour ladder, in priority:
 *
 * 1. `<Avatar.Fallback>custom</Avatar.Fallback>` — consumer-provided
 *    children win.
 * 2. Auto-initials from `name` when context has one.
 * 3. `Person` silhouette as the ultimate placeholder.
 *
 * Honours `fallbackDelay` (from context, or the per-fallback `delay`
 * prop) — won't render while an image is `loading` until the delay
 * elapses. Prevents flash of fallback on fast networks. Renders
 * immediately on `error` or when there's no `<Avatar.Image>` at all
 * (context stays at `idle`).
 */
export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ className, children, delay, ...rest }, ref) {
    const { imageState, fallbackDelay, name } = useAvatarContext()
    const effectiveDelay = delay ?? fallbackDelay

    // Gate the render on the delay timer. Tracked as state (not a ref)
    // so the gate flip triggers a re-render that mounts the fallback.
    const [delayElapsed, setDelayElapsed] = useState(effectiveDelay === 0)

    useEffect(() => {
      if (imageState !== 'loading') {
        // Idle / loaded / error: no need to wait.
        setDelayElapsed(true)
        return
      }
      if (effectiveDelay === 0) {
        setDelayElapsed(true)
        return
      }
      setDelayElapsed(false)
      const t = window.setTimeout(() => setDelayElapsed(true), effectiveDelay)
      return () => window.clearTimeout(t)
    }, [imageState, effectiveDelay])

    // While the image is loaded, the image covers the fallback anyway —
    // but we still mount nothing so the DOM is clean (and tests can
    // assert on absence).
    if (imageState === 'loaded') return null
    // During loading, wait for the delay to elapse before mounting.
    if (imageState === 'loading' && !delayElapsed) return null

    // Pick the resolved content: explicit children > initials > silhouette.
    const initials = getInitials(name)
    const resolved =
      children !== undefined && children !== null
        ? children
        : initials || <Person size={'70%' as unknown as number} aria-hidden />

    return (
      <span
        ref={ref}
        // The fallback is the announced content when the image is missing
        // / failed. The parent Avatar already carries aria-label (or
        // alt on the img); leave the fallback visually decorative.
        aria-hidden={initials ? undefined : 'true'}
        className={cx(fallbackClasses, className)}
        {...rest}
      >
        {resolved}
      </span>
    )
  },
)
AvatarFallback.displayName = 'Avatar.Fallback'
