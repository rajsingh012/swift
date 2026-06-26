import { type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useReveal } from './useReveal'

type RevealProps = {
  children: ReactNode
  /** Stagger index — drives `--reveal-i` for sequential delays. */
  index?: number
  /** Element/component to render as. Default `div`. */
  as?: ElementType
  className?: string
  style?: CSSProperties
}

/**
 * Convenience wrapper around {@link useReveal}. Sets `data-reveal`,
 * `data-revealed`, and the `--reveal-i` stagger custom property. The visual
 * transition lives in App.css under `[data-reveal]`.
 */
export function Reveal({
  children,
  index = 0,
  as,
  className,
  style,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const { ref, revealed } = useReveal<HTMLElement>()
  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-revealed={revealed ? 'true' : 'false'}
      className={className}
      style={{ '--reveal-i': index, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
