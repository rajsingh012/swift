import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import { DEFAULT_SHAPE, DEFAULT_SIZE, FALLBACK_DELAY_MS } from './Avatar.constants'
import {
  AvatarContext,
  useAvatarGroupContext,
  type AvatarContextValue,
} from './Avatar.context'
import {
  cx,
  rootClasses,
  rootShapeClasses,
  rootSizeClasses,
} from './Avatar.styles'
import type { AvatarImageState, AvatarProps } from './Avatar.types'
import { getColourIndex } from './Avatar.utils'
import { AvatarFallback } from './AvatarFallback'
import { AvatarImage } from './AvatarImage'

/**
 * Avatar root. Two render modes, picked from children:
 *
 * 1. **Convenience** — when no `<Avatar.Image>` / `<Avatar.Fallback>` is
 *    in the children, the root auto-composes them from `src` / `name`.
 *    Extra children (e.g. `<Avatar.Badge>`) still render alongside.
 *
 *        <Avatar src="/raj.jpg" name="Raj Singh">
 *          <Avatar.Badge status="online" />
 *        </Avatar>
 *
 * 2. **Compound** — when the children include `<Avatar.Image>` or
 *    `<Avatar.Fallback>`, the matching auto-render is skipped. The
 *    consumer's tree wins.
 *
 *        <Avatar>
 *          <Avatar.Image src="/raj.jpg" alt="Raj Singh" />
 *          <Avatar.Fallback>RS</Avatar.Fallback>
 *          <Avatar.Badge status="online" />
 *        </Avatar>
 *
 * Group integration: when nested in `<AvatarGroup size shape>`, the
 * group's size/shape become the per-avatar default. Per-avatar props
 * still win.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  props,
  ref,
) {
  const {
    src,
    alt,
    name,
    size: sizeProp,
    shape: shapeProp,
    loading = false,
    fallbackDelay = FALLBACK_DELAY_MS,
    decorative = false,
    className,
    children,
    style,
    ...rest
  } = props

  const group = useAvatarGroupContext()
  const size = sizeProp ?? group.size ?? DEFAULT_SIZE
  const shape = shapeProp ?? group.shape ?? DEFAULT_SHAPE

  const [imageState, setImageState] = useState<AvatarImageState>('idle')

  const setImageStateStable = useCallback((next: AvatarImageState) => {
    setImageState((prev) => (prev === next ? prev : next))
  }, [])

  const ctx = useMemo<AvatarContextValue>(
    () => ({
      size,
      shape,
      name,
      imageState,
      setImageState: setImageStateStable,
      fallbackDelay,
    }),
    [size, shape, name, imageState, setImageStateStable, fallbackDelay],
  )

  // Colour-palette index from the name — drives the `--avatar-bg`
  // inline style which falls through to the palette CSS vars in
  // `theme/avatar.css`. SSR-safe (pure function of `name`).
  //
  // When `name` isn't set the avatar represents *no specific person*
  // (overflow tiles, default placeholder, generic icon avatar), so we
  // pick the neutral `--color-surface-muted` instead of palette slot 0
  // — avoids implying that a nameless avatar belongs to a specific
  // colour-coded identity.
  const colourIndex = useMemo(() => getColourIndex(name), [name])

  const inlineStyle: CSSPropertiesWithVars = {
    '--avatar-bg': name
      ? `var(--avatar-palette-${colourIndex})`
      : 'var(--color-surface-muted)',
    '--avatar-color': name
      ? `var(--avatar-palette-${colourIndex}-color, var(--color-content-strong))`
      : 'var(--color-content-muted)',
    ...(style as CSSProperties | undefined),
  }

  // Decide which auto-rendered defaults to omit based on what the
  // consumer already supplied. We peek one level deep — `Avatar.Image`
  // or `Avatar.Fallback` wrapped inside a Fragment won't be detected,
  // which is fine: consumers using Fragments are in compound territory.
  const overrides = detectOverrides(children)

  // The root carries the accessible name via `aria-label` (see below).
  // The inner `<img>` is intentionally given an empty alt so it's
  // treated as decorative — without this, a *broken* image renders its
  // alt text on top of the Fallback (the browser draws alt as the
  // broken-image placeholder), producing a double-label visual.
  // Consumers using compound mode can still pass a meaningful `alt` on
  // `<Avatar.Image>` directly; the `data-state="error"` CSS rule in
  // `theme/avatar.css` hides the broken image element regardless.
  void alt
  void decorative

  // Loading skeleton wins over everything else: don't render image,
  // fallback, or badge children — just the shimmering placeholder.
  // Decorative + no children: still announce something useful via
  // aria-label when `name` is set; the inner content is hidden.
  const ariaLabel = decorative ? undefined : (alt ?? name)

  return (
    <AvatarContext.Provider value={ctx}>
      <span
        ref={ref}
        role={decorative ? undefined : 'img'}
        aria-hidden={decorative ? 'true' : undefined}
        aria-label={ariaLabel}
        data-size={size}
        data-shape={shape}
        data-state={loading ? 'loading' : imageState}
        data-loading={loading ? 'true' : undefined}
        data-in-group={group.inGroup ? 'true' : undefined}
        className={cx(
          rootClasses,
          rootSizeClasses[size],
          rootShapeClasses[shape],
          className,
        )}
        style={inlineStyle}
        {...rest}
      >
        {loading ? null : (
          <>
            {!overrides.hasImage && src ? (
              // Empty alt — the root <span role="img" aria-label> carries
              // the accessible name. See the `void alt` comment above for
              // why we don't forward the outer `alt`/`name` here.
              <AvatarImage src={src} alt="" />
            ) : null}
            {!overrides.hasFallback ? <AvatarFallback /> : null}
            {children}
          </>
        )}
      </span>
    </AvatarContext.Provider>
  )
})
Avatar.displayName = 'Avatar'

interface ChildOverrides {
  hasImage: boolean
  hasFallback: boolean
}

/** Peek at the direct children for `Avatar.Image` / `Avatar.Fallback`
 *  so we know whether to auto-render the matching default. One-level-
 *  deep only; Fragments / nested wrappers are treated as compound.
 *  Type comparison is by reference, so re-exporting the parts is fine
 *  but rebuilding them is not — matches Alert's detection. */
function detectOverrides(children: ReactNode): ChildOverrides {
  const out: ChildOverrides = { hasImage: false, hasFallback: false }
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    const type = (child as ReactElement).type
    if (type === AvatarImage) out.hasImage = true
    else if (type === AvatarFallback) out.hasFallback = true
  })
  return out
}
