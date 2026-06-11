import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react'
import { Slot } from '../internal/Slot'
import { mergeRefs } from '../internal/refs'
import { useSegmentedControlRoot } from './SegmentedControl.context'
import { cx, itemClasses } from './SegmentedControl.styles'
import type { SegmentedControlItemProps } from './SegmentedControl.types'

/**
 * `role="radio"` button. Registers itself with the root on mount so keyboard
 * nav, default-value resolution, and the indicator can all find it by
 * `value`. Implements roving tabindex (only the checked item is tab-reachable;
 * arrows move focus + selection among items).
 *
 * `asChild` clones the consumer's single child element with our props via the
 * internal Slot — useful for rendering a custom element as a segment.
 */
export const SegmentedControlItem = forwardRef<
  HTMLButtonElement,
  SegmentedControlItemProps
>(function SegmentedControlItem(props, ref) {
  const {
    value,
    disabled = false,
    asChild = false,
    className,
    children,
    onClick,
    onKeyDown,
    ...rest
  } = props
  const root = useSegmentedControlRoot('SegmentedControl.Item')

  // CRITICAL: depend only on the stable destructured callbacks below, never
  // on the whole `root` object — its identity changes on every measureToken
  // bump, and wiring that to the callback ref would re-fire registerItem each
  // render → infinite update loop. (See project-tabs trap #1.) The functions
  // below are useCallback'd in the root with empty / id-only deps.
  const { registerItem, setValue, focusItem, itemId } = root

  const isActive = root.value === value
  // Group-level disabled/readOnly cascade onto every item.
  const isDisabled = disabled || root.disabled
  const isReadOnly = root.readOnly

  const setItemRef = useCallback(
    (node: HTMLElement | null) => {
      registerItem(value, node)
    },
    [value, registerItem],
  )
  useEffect(() => {
    return () => {
      registerItem(value, null)
    }
  }, [value, registerItem])

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event as unknown as MouseEvent<HTMLButtonElement>)
    if (event.defaultPrevented) return
    if (isDisabled || isReadOnly) return
    setValue(value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>)
    if (event.defaultPrevented) return
    if (isDisabled) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!isReadOnly) setValue(value)
      return
    }

    const isHorizontal = root.orientation === 'horizontal'
    const isRtl = root.dir === 'rtl'

    let direction: 'next' | 'prev' | 'first' | 'last' | null = null
    switch (event.key) {
      case 'ArrowRight':
        if (isHorizontal) direction = isRtl ? 'prev' : 'next'
        break
      case 'ArrowLeft':
        if (isHorizontal) direction = isRtl ? 'next' : 'prev'
        break
      case 'ArrowDown':
        if (!isHorizontal) direction = 'next'
        break
      case 'ArrowUp':
        if (!isHorizontal) direction = 'prev'
        break
      case 'Home':
        direction = 'first'
        break
      case 'End':
        direction = 'last'
        break
    }

    if (direction) {
      event.preventDefault()
      focusItem(value, direction)
    }
  }

  const itemProps = {
    role: 'radio' as const,
    id: itemId(value),
    type: 'button' as const,
    'aria-checked': isActive,
    'aria-disabled': isDisabled || undefined,
    'aria-readonly': isReadOnly || undefined,
    // Roving tabindex — only the checked item is reachable via Tab.
    tabIndex: isActive ? 0 : -1,
    disabled: isDisabled,
    // data-disabled is what registerItem / focusItem filter on.
    'data-disabled': isDisabled ? '' : undefined,
    'data-state': isActive ? ('checked' as const) : ('unchecked' as const),
    'data-orientation': root.orientation,
    className: cx(itemClasses, className, root.itemClass),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...rest,
  }

  // CRITICAL #2: memoize the merged ref. mergeRefs(...) returns a brand-new
  // function every render; passed raw to ref={...} React would re-fire it
  // each render → registerItem churns measureToken → loop. (project-tabs
  // trap #2.) Stable inputs keep the identity stable.
  const mergedRef = useMemo(
    () => mergeRefs(setItemRef, ref),
    [setItemRef, ref],
  )

  if (asChild) {
    return (
      <Slot ref={mergedRef} {...itemProps}>
        {children}
      </Slot>
    )
  }

  return (
    <button ref={mergedRef as Ref<HTMLButtonElement>} {...itemProps}>
      {children}
    </button>
  )
})

SegmentedControlItem.displayName = 'SegmentedControl.Item'
