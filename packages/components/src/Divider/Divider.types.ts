import type { HTMLAttributes, ReactNode } from 'react'

export type DividerOrientation = 'horizontal' | 'vertical'

/** Visual line style. */
export type DividerVariant = 'solid' | 'dashed' | 'dotted'

/** Position of an optional label along a horizontal divider. */
export type DividerLabelAlign = 'start' | 'center' | 'end'

export interface DividerClasses {
  root?: string
  line?: string
  label?: string
}

export interface DividerOwnProps {
  orientation?: DividerOrientation
  variant?: DividerVariant
  /**
   * Optional inline label. Only meaningful for horizontal dividers — the
   * line splits around the label. Ignored for vertical orientation.
   */
  children?: ReactNode
  /** Where the label sits when one is provided. @default 'center' */
  labelAlign?: DividerLabelAlign
  /**
   * When `true` the divider is purely decorative (`role="none"`), removed
   * from the accessibility tree. When it carries a label or visually
   * separates regions, leave it `false` so it announces as a separator.
   * @default false
   */
  decorative?: boolean
  classes?: DividerClasses
}

export type DividerProps = DividerOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof DividerOwnProps>
