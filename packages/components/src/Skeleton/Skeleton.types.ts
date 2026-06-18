import type { HTMLAttributes } from 'react'

/** Shape of the placeholder. */
export type SkeletonVariant = 'text' | 'rect' | 'rounded' | 'circle'

/** Loading shimmer style. */
export type SkeletonAnimation = 'pulse' | 'wave' | 'none'

export interface SkeletonOwnProps {
  variant?: SkeletonVariant
  animation?: SkeletonAnimation
  /** Width — number → px, string passes through (e.g. '60%'). */
  width?: number | string
  /** Height — number → px, string passes through. */
  height?: number | string
  /**
   * For `variant="text"` — render this many stacked lines. The last line is
   * rendered shorter to mimic a paragraph's ragged edge. @default 1
   */
  lines?: number
}

export type SkeletonProps = SkeletonOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof SkeletonOwnProps | 'children'>
