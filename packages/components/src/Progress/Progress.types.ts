import type { HTMLAttributes, ReactNode } from 'react'

export type ProgressSize = 'sm' | 'md' | 'lg'

export type ProgressVariant = 'brand' | 'success' | 'warning' | 'error'

export interface ProgressClasses {
  root?: string
  track?: string
  indicator?: string
  label?: string
  value?: string
}

export interface ProgressOwnProps {
  /**
   * Current value. Omit (or pass `null`) for an indeterminate bar that
   * animates continuously.
   */
  value?: number | null
  /** Lower bound. @default 0 */
  min?: number
  /** Upper bound. @default 100 */
  max?: number

  size?: ProgressSize
  variant?: ProgressVariant

  /**
   * Accessible label for the progress bar. Strongly recommended — screen
   * readers announce it alongside the percentage.
   */
  label?: ReactNode
  /** Show the numeric/percentage readout. @default false */
  showValue?: boolean
  /**
   * Format the value readout. Receives the raw value and the resolved
   * percentage. Defaults to `${percent}%`.
   */
  format?: (value: number, percent: number) => string

  classes?: ProgressClasses
}

export type ProgressProps = ProgressOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof ProgressOwnProps | 'children'>
