import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { useControllableState } from '../internal/state'
import { mergeRefs } from '../internal/refs'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Toggle.constants'
import { useToggleGroup } from './Toggle.context'
import {
  baseClasses,
  cx,
  sizeClasses,
  variantClasses,
} from './Toggle.styles'
import type { ToggleProps } from './Toggle.types'

/**
 * A two-state button — pressed or not. Use standalone for a single on/off
 * affordance (bold, italic, mute…) or inside a `ToggleGroup` for a set.
 *
 *   <Toggle aria-label="Bold"><BoldIcon /></Toggle>
 *
 * Standalone state is controlled/uncontrolled via
 * `pressed`/`defaultPressed`/`onPressedChange`. Inside a group, the group owns
 * the pressed state and the toggle reads it by `value`.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  props,
  ref,
) {
  const {
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,
    size: sizeProp,
    variant: variantProp,
    disabled: disabledProp = false,
    value,
    className,
    children,
    type,
    onClick,
    onKeyDown,
    ...rest
  } = props

  const group = useToggleGroup()

  // ── Standalone state (only used when not in a group) ──
  const [standalonePressed, setStandalonePressed] = useControllableState(
    pressedProp,
    defaultPressed,
    onPressedChange,
  )

  const inGroup = group !== null
  if (inGroup && value === undefined) {
    throw new Error('<Toggle> inside <ToggleGroup> requires a `value` prop.')
  }

  const size = sizeProp ?? group?.size ?? DEFAULT_SIZE
  const variant = variantProp ?? group?.variant ?? DEFAULT_VARIANT
  const disabled = disabledProp || (group?.disabled ?? false)

  const pressed = inGroup ? group!.isPressed(value!) : standalonePressed

  // ── Register with the group for keyboard nav / measurement ──
  const setItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (inGroup) group!.registerItem(value!, node)
    },
    [inGroup, group, value],
  )
  useEffect(() => {
    if (!inGroup) return
    return () => group!.registerItem(value!, null)
  }, [inGroup, group, value])

  const mergedRef = useMemo(
    () => mergeRefs<HTMLButtonElement>(ref, setItemRef as never),
    [ref, setItemRef],
  )

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || disabled) return
    if (inGroup) group!.toggle(value!)
    else setStandalonePressed(!standalonePressed)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !inGroup || disabled) return

    const isHorizontal = group!.orientation === 'horizontal'
    const isRtl = group!.dir === 'rtl'
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
      group!.focusItem(value!, direction)
    }
  }

  return (
    <button
      ref={mergedRef}
      type={type ?? 'button'}
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={group?.orientation}
      disabled={disabled}
      className={cx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className,
        group?.itemClass,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  )
})
Toggle.displayName = 'Toggle'
