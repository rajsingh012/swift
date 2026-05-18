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

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonClasses {
  root?: string
  label?: string
  leftIcon?: string
  rightIcon?: string
  loader?: string
}

export interface ButtonOwnProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  iconOnly?: boolean
  disableRipple?: boolean
  classes?: ButtonClasses
}

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
