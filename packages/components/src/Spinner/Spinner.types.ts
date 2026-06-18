import type { HTMLAttributes, ReactNode } from 'react'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Colour scheme of the spinner stroke. */
export type SpinnerVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'inverse'

export interface SpinnerOwnProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  /**
   * Accessible label announced to assistive tech. @default 'Loading'
   * Pass `label={false}` only when an adjacent visible element already
   * labels the loading state.
   */
  label?: string
  /**
   * Optional visible text rendered beside the spinner (e.g. "Loading…").
   * When provided it also becomes the accessible label.
   */
  children?: ReactNode
}

export type SpinnerProps = SpinnerOwnProps &
  Omit<HTMLAttributes<HTMLSpanElement>, keyof SpinnerOwnProps>
