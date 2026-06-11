import {
  forwardRef,
  useMemo,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Slot } from '../internal/Slot'
import {
  DEFAULT_ALIGN,
  DEFAULT_DENSITY,
  DEFAULT_ORIENTATION,
  DEFAULT_SIZE,
} from './ListItem.constants'
import {
  ListItemContext,
  useListContext,
  type ListItemContextValue,
} from './ListItem.context'
import { ListItemContent } from './ListItemContent'
import { ListItemDescription } from './ListItemDescription'
import { ListItemLeading } from './ListItemLeading'
import {
  alignClasses,
  clickableMinHeightClasses,
  cx,
  densityYClasses,
  dividerClasses,
  orientationClasses,
  rootClasses,
  slotGapClasses,
} from './ListItem.styles'
import { ListItemTitle } from './ListItemTitle'
import type {
  ListItemComponent as ListItemComponentType,
  ListItemOwnProps,
} from './ListItem.types'

type ListItemRenderProps = ListItemOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof ListItemOwnProps | 'onClick'> & {
    as?: ElementType
    onClick?: (event: MouseEvent<HTMLElement>) => void
    type?: 'button' | 'submit' | 'reset'
    href?: string
    children?: ReactNode
  }

/**
 * Layout + interaction primitive for list cells. Composes the three
 * canonical slots (`Leading`, `Content`, `Trailing`) — or, for the most
 * common case, accepts `title` / `description` props directly and skips
 * the compound structure.
 *
 * Renders as `<div>` by default, `<button>` when `clickable` is true,
 * and anything via `as` / `asChild`. The interactive shim (role,
 * tabIndex, Enter/Space activation, aria-disabled) is only attached
 * when the row is actually clickable — static rows stay plain markup.
 */
const ListItemRoot = forwardRef<HTMLElement, ListItemRenderProps>(
  function ListItem(props, ref) {
    const list = useListContext()

    const {
      as,
      asChild = false,
      title,
      description,
      size = list?.size ?? DEFAULT_SIZE,
      density = list?.density ?? DEFAULT_DENSITY,
      align = DEFAULT_ALIGN,
      orientation = DEFAULT_ORIENTATION,
      clickable = false,
      selected = false,
      active = false,
      disabled = false,
      loading = false,
      // When the surrounding List manages dividers, swallow the per-row
      // setting so we don't double-paint borders.
      divider = false,
      classes,
      className,
      children,
      onClick,
      onKeyDown,
      type,
      ...rest
    } = props

    const showDivider = divider && !list?.dividers
    const isInteractionBlocked = disabled || loading
    const isVertical = orientation === 'vertical'

    // `asChild` wins over `as`. If neither is set, clickable picks
    // <button>, otherwise we default to <div> (let the consumer wrap
    // in a <List as="ul"> if they want semantic `<li>`s).
    const Component: ElementType = asChild
      ? Slot
      : (as ?? (clickable ? 'button' : 'div'))

    const isNativeButton = Component === 'button'
    const isNativeAnchor = Component === 'a'

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (isInteractionBlocked) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (!clickable || isInteractionBlocked) return
      // Browser handles activation for native button/anchor.
      if (isNativeButton || isNativeAnchor) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        ;(event.currentTarget as HTMLElement).click()
      }
    }

    const interactiveProps: HTMLAttributes<HTMLElement> & {
      type?: 'button' | 'submit' | 'reset'
      disabled?: boolean
      tabIndex?: number
    } = {}

    if (clickable) {
      if (isNativeButton) {
        interactiveProps.type = type ?? 'button'
        interactiveProps.disabled = isInteractionBlocked
      } else if (!isNativeAnchor) {
        // ARIA button shim for divs, lis, etc.
        interactiveProps.role = 'button'
        interactiveProps.tabIndex = isInteractionBlocked ? -1 : 0
      }
    }

    const ariaProps: HTMLAttributes<HTMLElement> = {
      'aria-busy': loading || undefined,
      'aria-disabled': isInteractionBlocked || undefined,
      'aria-current': active ? 'page' : undefined,
      'aria-selected': selected || undefined,
    }

    // Auto-build a Content stack from the convenience props if the
    // consumer didn't compose their own slots.
    const composedChildren =
      children ??
      ((title !== undefined || description !== undefined) && (
        <ListItemContent>
          {title !== undefined ? (
            <ListItemTitle>{title}</ListItemTitle>
          ) : null}
          {description !== undefined ? (
            <ListItemDescription>{description}</ListItemDescription>
          ) : null}
        </ListItemContent>
      ))

    const ctx = useMemo<ListItemContextValue>(
      () => ({
        size,
        density,
        align,
        orientation,
        disabled: isInteractionBlocked,
      }),
      [size, density, align, orientation, isInteractionBlocked],
    )

    return (
      <ListItemContext.Provider value={ctx}>
        <Component
          ref={ref}
          className={cx(
            rootClasses,
            slotGapClasses[size],
            densityYClasses[density],
            // Touch-target floor only applies to horizontal rows; vertical
            // cells are already tall by construction (image + text stack).
            !isVertical && clickable && clickableMinHeightClasses[density],
            isVertical ? orientationClasses.vertical : alignClasses[align],
            showDivider && dividerClasses,
            className,
            classes?.root,
          )}
          data-size={size}
          data-density={density}
          data-orientation={orientation}
          data-clickable={clickable ? 'true' : 'false'}
          data-disabled={isInteractionBlocked ? 'true' : 'false'}
          data-selected={selected ? 'true' : 'false'}
          data-active={active ? 'true' : 'false'}
          data-loading={loading ? 'true' : undefined}
          onClick={clickable ? handleClick : onClick}
          onKeyDown={clickable ? handleKeyDown : onKeyDown}
          {...interactiveProps}
          {...ariaProps}
          {...rest}
        >
          {loading ? <ListItemLoadingSkeleton /> : composedChildren}
        </Component>
      </ListItemContext.Provider>
    )
  },
)

function ListItemLoadingSkeleton() {
  return (
    <>
      <ListItemLeading aria-hidden>
        <span className="h-8 w-8 animate-pulse rounded-full bg-surface-muted" />
      </ListItemLeading>
      <ListItemContent aria-hidden>
        <span className="h-3.5 w-2/5 animate-pulse rounded bg-surface-muted" />
        <span className="mt-1.5 h-3 w-3/5 animate-pulse rounded bg-surface-muted" />
      </ListItemContent>
    </>
  )
}

export const ListItemComponent = ListItemRoot as unknown as ListItemComponentType
