import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
  SyntheticEvent,
} from 'react'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type AvatarShape = 'circle' | 'rounded' | 'square'

export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

/** Image lifecycle, surfaced via context so Fallback can subscribe.
 *  - `idle`    — no `<Avatar.Image>` mounted yet, or src isn't set
 *  - `loading` — image is in flight (fallback delay starts here)
 *  - `loaded`  — onLoad fired
 *  - `error`   — onError fired; fallback shows immediately */
export type AvatarImageState = 'idle' | 'loading' | 'loaded' | 'error'

/** Position of the badge within the avatar's bounding box. */
export type AvatarBadgePosition =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'

/* ── Avatar root ──────────────────────────────────────────────── */

export interface AvatarOwnProps {
  /** Convenience: image src. Equivalent to passing `<Avatar.Image src>`
   *  as a child. When set without children, the default render path is
   *  `<Image> + <Fallback>` so the consumer doesn't have to spell out
   *  the compound tree for the common case. */
  src?: string
  /** Alt text for the image. Defaults to `name` when not provided. */
  alt?: string
  /** Display name. Drives the auto-initials fallback and the
   *  deterministic colour-palette index. */
  name?: string

  size?: AvatarSize
  shape?: AvatarShape

  /** Render a shimmering skeleton (overrides image + fallback). Useful
   *  while user data is in flight. */
  loading?: boolean

  /** ms to wait before showing the fallback while an image is loading.
   *  Prevents fallback flash on fast networks. Default 600 ms. Per-
   *  fallback `delay` prop overrides this. */
  fallbackDelay?: number

  /** Mark the avatar as decorative. Sets `aria-hidden="true"` and
   *  removes the `alt` from the inner img — use when the avatar is
   *  redundant with an adjacent label. */
  decorative?: boolean
}

export type AvatarProps = AvatarOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof AvatarOwnProps>

/* ── Compound parts ───────────────────────────────────────────── */

export interface AvatarImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  /** Fires when the image successfully loads. Component also publishes
   *  the state to context regardless. */
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void
  /** Fires when the image fails to load. Component also publishes
   *  `error` to context, which switches the fallback on immediately. */
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void
}

export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {
  /** Override the per-avatar `fallbackDelay` for this fallback. Useful
   *  if a specific fallback needs to appear instantly (delay=0) or only
   *  after a longer wait. */
  delay?: number
}

export interface AvatarBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Render a status dot — drops `children` in favour of a small
   *  coloured circle keyed off the status. */
  status?: AvatarStatus
  /** Corner placement. Default `'bottom-end'`. RTL flips end ↔ start
   *  automatically (positions use logical insets). */
  position?: AvatarBadgePosition
  children?: ReactNode
}

/* ── AvatarGroup ─────────────────────────────────────────────── */

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum visible avatars; the rest collapse into a `+N` overflow tile. */
  max?: number
  /** Custom overflow renderer. Default: `+${count}` text. */
  renderOverflow?: (count: number) => ReactNode
  /** Negative-margin overlap between adjacent avatars. */
  overlap?: 'small' | 'medium' | 'large'
  /** Cascade size to every nested avatar. Per-avatar `size` still wins. */
  size?: AvatarSize
  /** Cascade shape to every nested avatar. Per-avatar `shape` still wins. */
  shape?: AvatarShape
  children?: ReactNode
}
