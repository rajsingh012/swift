import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type Ref,
} from 'react'
import { Button } from '../Button'
import { useAccordionItem, useAccordionRoot } from './Accordion.context'
import { cx, triggerClasses } from './Accordion.styles'
import type {
  AccordionTriggerProps,
  AccordionTriggerRenderProps,
} from './Accordion.types'
import { mergeProps, mergeRefs } from './Accordion.utils'

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(function AccordionTrigger(
  { className, children, render, onClick, onKeyDown, ...rest },
  ref,
) {
  const root = useAccordionRoot('Accordion.Trigger')
  const item = useAccordionItem('Accordion.Trigger')

  const localRef = useRef<HTMLElement | null>(null)
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node
      root.registerTrigger(item.value, node)
    },
    [item.value, root],
  )

  useEffect(() => {
    return () => {
      root.registerTrigger(item.value, null)
    }
  }, [item.value, root])

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event as unknown as MouseEvent<HTMLButtonElement>)
    if (event.defaultPrevented) return
    if (item.disabled) return
    root.toggle(item.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>)
    if (event.defaultPrevented) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        root.focusItem(item.value, 'next')
        break
      case 'ArrowUp':
        event.preventDefault()
        root.focusItem(item.value, 'prev')
        break
      case 'Home':
        event.preventDefault()
        root.focusItem(item.value, 'first')
        break
      case 'End':
        event.preventDefault()
        root.focusItem(item.value, 'last')
        break
      default:
        break
    }
  }

  const state = item.open ? 'open' : 'closed'

  const ownProps: AccordionTriggerRenderProps = {
    ...rest,
    type: 'button',
    id: item.triggerId,
    disabled: item.disabled,
    'aria-expanded': item.open,
    'aria-controls': item.contentId,
    'data-state': state,
    'data-disabled': item.disabled ? '' : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    className: cx(triggerClasses, className),
  }

  const resolvedChildren =
    typeof children === 'function' ? children({ open: item.open }) : children

  if (typeof render === 'function') {
    return render({
      ...ownProps,
      ref: mergeRefs(setRef, ref as Ref<HTMLElement>),
      children: resolvedChildren,
    } as AccordionTriggerRenderProps & { children?: unknown })
  }

  if (isValidElement(render)) {
    const externalProps = (render as ReactElement).props as Record<
      string,
      unknown
    >
    const merged = mergeProps(
      ownProps as unknown as Record<string, unknown>,
      externalProps,
    )
    merged.ref = mergeRefs(
      setRef,
      ref as Ref<HTMLElement>,
      (render as { ref?: Ref<HTMLElement> }).ref,
    )
    if (resolvedChildren !== undefined && externalProps.children === undefined) {
      merged.children = resolvedChildren
    }
    return cloneElement(render, merged)
  }

  return (
    <Button
      {...rest}
      variant="unstyled"
      type="button"
      id={item.triggerId}
      disabled={item.disabled}
      aria-expanded={item.open}
      aria-controls={item.contentId}
      data-state={state}
      data-disabled={item.disabled ? '' : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cx(triggerClasses, className)}
      ref={mergeRefs(setRef, ref as Ref<HTMLElement>) as Ref<HTMLButtonElement>}
    >
      {resolvedChildren}
    </Button>
  )
})
AccordionTrigger.displayName = 'Accordion.Trigger'
