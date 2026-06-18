import { forwardRef, useCallback, useId, useMemo } from 'react'
import { useControllableState } from '../internal/state'
import {
  CollapsibleContext,
  type CollapsibleContextValue,
} from './Collapsible.context'
import { cx, rootClasses } from './Collapsible.styles'
import type { CollapsibleRootProps } from './Collapsible.types'

/**
 * A single open/closed disclosure — the standalone sibling of one
 * `Accordion.Item`, for show/hide of a single section without the group
 * semantics.
 *
 *   <Collapsible>
 *     <Collapsible.Trigger>Details</Collapsible.Trigger>
 *     <Collapsible.Content>…</Collapsible.Content>
 *   </Collapsible>
 *
 * Controlled/uncontrolled via `open`/`defaultOpen`/`onOpenChange`.
 */
export const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleRootProps>(
  function Collapsible(props, ref) {
    const {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className,
      children,
      ...rest
    } = props

    const [open, setOpen] = useControllableState(
      openProp,
      defaultOpen,
      onOpenChange,
    )

    const reactId = useId()
    const contentId = `swift-collapsible-content-${reactId}`
    const triggerId = `swift-collapsible-trigger-${reactId}`

    const toggle = useCallback(() => {
      if (disabled) return
      setOpen(!open)
    }, [disabled, open, setOpen])

    const ctx = useMemo<CollapsibleContextValue>(
      () => ({ open, disabled, toggle, contentId, triggerId }),
      [open, disabled, toggle, contentId, triggerId],
    )

    return (
      <CollapsibleContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          className={cx(rootClasses, className)}
          {...rest}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  },
)
CollapsibleRoot.displayName = 'Collapsible'
