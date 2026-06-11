import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from 'react'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'link'
  | 'unstyled'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonClasses {
  root?: string
  label?: string
  leftIcon?: string
  rightIcon?: string
  loader?: string
}

export interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  disableRipple?: boolean
  classes?: ButtonClasses
}

/** Icon-only buttons render no visible text, so an accessible name is
 *  required — `iconOnly: true` forces `aria-label` or `aria-labelledby`
 *  at the type level. */
export type ButtonIconOnlyProps =
  | { iconOnly: true; 'aria-label': string; 'aria-labelledby'?: string }
  | { iconOnly: true; 'aria-label'?: string; 'aria-labelledby': string }
  | { iconOnly?: false; 'aria-label'?: string; 'aria-labelledby'?: string }

export type ButtonOwnProps = ButtonBaseProps & ButtonIconOnlyProps

type AsProp<E extends ElementType> = { as?: E }

type PropsToOmit<E extends ElementType, P> = keyof (AsProp<E> & P)

export type PolymorphicProps<E extends ElementType, P = object> = P &
  AsProp<E> &
  Omit<ComponentPropsWithoutRef<E>, PropsToOmit<E, P>>

export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>['ref']

export type ButtonProps<E extends ElementType = 'button'> = PolymorphicProps<
  E,
  ButtonOwnProps
> & { ref?: PolymorphicRef<E> }

export type ButtonComponent = <E extends ElementType = 'button'>(
  props: ButtonProps<E>,
) => ReactNode
