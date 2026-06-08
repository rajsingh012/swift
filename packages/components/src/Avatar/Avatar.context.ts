import { createContext, useContext } from 'react'
import {
  DEFAULT_SHAPE,
  DEFAULT_SIZE,
  FALLBACK_DELAY_MS,
} from './Avatar.constants'
import type {
  AvatarImageState,
  AvatarShape,
  AvatarSize,
} from './Avatar.types'

/* ── Per-Avatar context ──────────────────────────────────────── */

export interface AvatarContextValue {
  size: AvatarSize
  shape: AvatarShape
  /** Display name from props — used by Fallback for auto-initials and
   *  by the colour-hash CSS variable. */
  name?: string
  /** Live image-loading lifecycle. Image part publishes via
   *  `setImageState`; Fallback subscribes to decide when to render. */
  imageState: AvatarImageState
  setImageState: (state: AvatarImageState) => void
  /** Default delay before showing the fallback while an image loads.
   *  Per-fallback `delay` prop overrides. */
  fallbackDelay: number
}

/** Soft-default fallback so compound parts rendered without a Root
 *  fail soft instead of crashing — rare in practice, but matches the
 *  pattern used by Alert.context. */
const FALLBACK_CTX: AvatarContextValue = {
  size: DEFAULT_SIZE,
  shape: DEFAULT_SHAPE,
  imageState: 'idle',
  setImageState: () => {},
  fallbackDelay: FALLBACK_DELAY_MS,
}

export const AvatarContext = createContext<AvatarContextValue | null>(null)

export function useAvatarContext(): AvatarContextValue {
  return useContext(AvatarContext) ?? FALLBACK_CTX
}

/* ── AvatarGroup context ─────────────────────────────────────── */

/** Group cascades size/shape to nested avatars and flags them as
 *  in-group so the styles can apply the ring/border that visually
 *  separates them under the negative-margin overlap. */
export interface AvatarGroupContextValue {
  size?: AvatarSize
  shape?: AvatarShape
  inGroup: boolean
}

export const AvatarGroupContext = createContext<AvatarGroupContextValue>({
  inGroup: false,
})

export function useAvatarGroupContext(): AvatarGroupContextValue {
  return useContext(AvatarGroupContext)
}
