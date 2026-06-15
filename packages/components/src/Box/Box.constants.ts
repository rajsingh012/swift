import type {
  BoxBg,
  BoxBorderTone,
  BoxRadius,
  BoxShadow,
  SpaceScale,
} from './Box.types'

export const DEFAULT_ELEMENT = 'div' as const

/** Scale steps exposed for docs / playground knobs. */
export const SPACE_SCALE: ReadonlyArray<SpaceScale> = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24,
]

export const radiusVar: Record<BoxRadius, string> = {
  none: '0',
  xs: 'var(--radius-xs)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
}

export const shadowVar: Record<BoxShadow, string> = {
  none: 'none',
  level1: 'var(--shadow-level1)',
  level2: 'var(--shadow-level2)',
  level3: 'var(--shadow-level3)',
  level4: 'var(--shadow-level4)',
  level5: 'var(--shadow-level5)',
  level6: 'var(--shadow-level6)',
}

export const bgVar: Record<BoxBg, string> = {
  transparent: 'transparent',
  surface: 'var(--color-surface)',
  'surface-muted': 'var(--color-surface-muted)',
  'surface-subtle': 'var(--color-surface-subtle)',
  'surface-elevated': 'var(--color-surface-elevated)',
  'surface-inverse': 'var(--color-surface-inverse)',
  brand: 'var(--color-surface-brand)',
  'brand-muted': 'var(--color-surface-brand-muted)',
  'success-muted': 'var(--color-surface-success-muted)',
  'warning-muted': 'var(--color-surface-warning-muted)',
  'critical-muted': 'var(--color-surface-critical-muted)',
  'highlight-muted': 'var(--color-surface-highlight-muted)',
}

export const borderColorVar: Record<BoxBorderTone, string> = {
  default: 'var(--color-stroke)',
  muted: 'var(--color-stroke-muted)',
  strong: 'var(--color-stroke-strong)',
  brand: 'var(--color-stroke-brand)',
  success: 'var(--color-stroke-success)',
  warning: 'var(--color-stroke-warning)',
  critical: 'var(--color-stroke-critical)',
}
