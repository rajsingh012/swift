import { PopoverRoot } from './PopoverRoot'
import { PopoverTrigger } from './PopoverTrigger'
import { PopoverAnchor } from './PopoverAnchor'
import { PopoverPortal } from './PopoverPortal'
import { PopoverContent } from './PopoverContent'
import { PopoverArrow } from './PopoverArrow'
import { PopoverClose } from './PopoverClose'

/**
 * Popover — a non-modal floating panel anchored to a trigger. Collision-aware
 * positioning (shared floating engine), focus management, and Escape /
 * outside-click dismissal.
 *
 *   <Popover>
 *     <Popover.Trigger>Open</Popover.Trigger>
 *     <Popover.Portal>
 *       <Popover.Content>
 *         …
 *         <Popover.Arrow />
 *       </Popover.Content>
 *     </Popover.Portal>
 *   </Popover>
 */
export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Anchor: PopoverAnchor,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
})
