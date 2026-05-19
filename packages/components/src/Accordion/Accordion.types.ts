import type {
  HTMLAttributes,
  JSX,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'

export type AccordionType = 'single' | 'multiple'

export type AccordionValue<T extends AccordionType = AccordionType> =
  T extends 'multiple' ? string[] : string | null

export type AccordionState = 'open' | 'closed'

export interface AccordionSingleProps {
  type?: 'single'
  collapsible?: boolean
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}

export interface AccordionMultipleProps {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type AccordionRootProps = (
  | AccordionSingleProps
  | AccordionMultipleProps
) &
  Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & {
    disabled?: boolean
    children?: ReactNode
  }

export interface AccordionItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'value'> {
  value: string
  disabled?: boolean
  children?: ReactNode
}

export type AccordionHeaderTag = Extract<
  keyof JSX.IntrinsicElements,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
>

export interface AccordionHeaderProps extends HTMLAttributes<HTMLElement> {
  as?: AccordionHeaderTag
  children?: ReactNode
}

export type AccordionTriggerRenderProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>
  type?: 'button'
  disabled?: boolean
  'aria-expanded'?: boolean
  'aria-controls'?: string
  'data-state'?: AccordionState
  'data-disabled'?: '' | undefined
}

export type AccordionTriggerRender =
  | ReactElement
  | ((props: AccordionTriggerRenderProps) => ReactElement)

export interface AccordionTriggerProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  render?: AccordionTriggerRender
  children?: ReactNode | ((state: { open: boolean }) => ReactNode)
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
