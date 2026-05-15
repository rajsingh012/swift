import {
  cloneElement,
  createElement,
  forwardRef,
  isValidElement,
  type Ref,
  type RefObject,
} from 'react'
import type {
  TextAlign,
  TextColor,
  TextElementTag,
  TextFontFamily,
  TextFontWeight,
  TextProps,
  TextRenderProps,
  TextVariant,
} from './text.types'

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

function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): Ref<T> {
  return (node: T | null) => {
    for (const r of refs) {
      if (!r) continue
      if (typeof r === 'function') r(node)
      else (r as RefObject<T | null>).current = node
    }
  }
}

function mergeProps(
  internal: Record<string, unknown>,
  external: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...internal, ...external }

  if (internal.className || external.className) {
    merged.className = cx(
      internal.className as string | undefined,
      external.className as string | undefined,
    )
  }

  if (internal.style || external.style) {
    merged.style = {
      ...(internal.style as object | undefined),
      ...(external.style as object | undefined),
    }
  }

  for (const key of Object.keys(external)) {
    if (
      key.startsWith('on') &&
      typeof internal[key] === 'function' &&
      typeof external[key] === 'function'
    ) {
      const a = internal[key] as (...args: unknown[]) => void
      const b = external[key] as (...args: unknown[]) => void
      merged[key] = (...args: unknown[]) => {
        a(...args)
        b(...args)
      }
    }
  }

  return merged
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
    const merged = mergeProps(ownProps as Record<string, unknown>, externalProps)
    merged.ref = mergeRefs(
      (render as { ref?: Ref<HTMLElement> }).ref,
      ref,
    )
    return cloneElement(render, merged)
  }

  return createElement(tag, ownProps)
})

Text.displayName = 'Text'
