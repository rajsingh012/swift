import type { HTMLAttributes, JSX, ReactElement, Ref } from 'react'

export type TextVariant =
  | 'body-xs'
  | 'body-sm'
  | 'body-md'
  | 'body-lg'
  | 'body-xl'
  | 'heading-xs'
  | 'heading-sm'
  | 'heading-md'
  | 'heading-lg'
  | 'heading-xl'
  | 'para-sm'
  | 'para-md'
  | 'para-lg'

export type TextFontWeight = 'normal' | 'medium' | 'semibold' | 'bold'
export type TextFontFamily = 'sans' | 'serif' | 'mono'

export type TextAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify'

export type TextColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type TextElementTag = keyof JSX.IntrinsicElements

export type TextVariantMapping = Partial<Record<TextVariant, TextElementTag>>

export type TextRenderProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>
}

export type TextRender =
  | ReactElement
  | ((props: TextRenderProps) => ReactElement)

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant
  fontWeight?: TextFontWeight
  fontFamily?: TextFontFamily
  align?: TextAlign
  color?: TextColor
  gutterBottom?: boolean
  noWrap?: boolean
  variantMapping?: TextVariantMapping
  render?: TextRender
}
