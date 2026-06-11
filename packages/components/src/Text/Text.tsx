import {
  cloneElement,
  createElement,
  forwardRef,
  isValidElement,
  type Ref,
} from 'react'
import { cx } from '../internal/cx'
import { mergeRenderProps } from '../internal/props'
import { mergeRefs } from '../internal/refs'
import type {
  TextAlign,
  TextColor,
  TextElementTag,
  TextFontFamily,
  TextFontWeight,
  TextProps,
  TextRenderProps,
  TextVariant,
} from './Text.types'

const weightClassMap: Record<TextFontWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const fontFamilyMap: Record<TextFontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

const alignClassMap: Record<Exclude<TextAlign, 'inherit'>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

const colorClassMap: Record<Exclude<TextColor, 'inherit'>, string> = {
  primary: 'text-content-strong',
  secondary: 'text-content',
  muted: 'text-content-muted',
  success: 'text-content-success',
  warning: 'text-content-warning',
  error: 'text-content-critical',
  info: 'text-content-highlight',
}

const defaultVariantMapping: Record<TextVariant, TextElementTag> = {
  'heading-xl': 'h1',
  'heading-lg': 'h2',
  'heading-md': 'h3',
  'heading-sm': 'h4',
  'heading-xs': 'h5',
  'para-lg': 'p',
  'para-md': 'p',
  'para-sm': 'p',
  'body-xl': 'span',
  'body-lg': 'span',
  'body-md': 'span',
  'body-sm': 'span',
  'body-xs': 'span',
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    variant = 'body-md',
    fontWeight,
    fontFamily,
    align = 'inherit',
    color = 'inherit',
    gutterBottom = false,
    noWrap = false,
    variantMapping,
    className,
    render,
    ...rest
  },
  ref,
) {
  const weightClass = fontWeight ? weightClassMap[fontWeight] : undefined
  const fontFamilyClass = fontFamily ? fontFamilyMap[fontFamily] : undefined
  const alignClass = align !== 'inherit' ? alignClassMap[align] : undefined
  const colorClass = color !== 'inherit' ? colorClassMap[color] : undefined
  const gutterClass = gutterBottom ? 'mb-[0.35em]' : undefined
  const noWrapClass = noWrap ? 'block max-w-full truncate' : undefined

  const classNames = cx(
    variant,
    weightClass,
    fontFamilyClass,
    alignClass,
    colorClass,
    gutterClass,
    noWrapClass,
    className,
  )

  const tag: TextElementTag =
    variantMapping?.[variant] ?? defaultVariantMapping[variant]

  const ownProps: TextRenderProps = { ...rest, className: classNames, ref }

  if (typeof render === 'function') {
    return render(ownProps)
  }

  if (isValidElement(render)) {
    const externalProps = render.props as Record<string, unknown>
    const merged = mergeRenderProps(
      ownProps as Record<string, unknown>,
      externalProps,
    )
    merged.ref = mergeRefs(
      (render as { ref?: Ref<HTMLElement> }).ref,
      ref,
    )
    return cloneElement(render, merged)
  }

  return createElement(tag, ownProps)
})

Text.displayName = 'Text'
