import { TooltipRoot } from './TooltipRoot'
import { TooltipTrigger } from './TooltipTrigger'
import { TooltipPortal } from './TooltipPortal'
import { TooltipContent } from './TooltipContent'
import { TooltipArrow } from './TooltipArrow'
import { TooltipClose } from './TooltipClose'

/**
 * Tooltip — compound, accessible, collision-aware popup label.
 *
 *   <Tooltip>
 *     <Tooltip.Trigger>
 *       <Button>Save</Button>
 *     </Tooltip.Trigger>
 *     <Tooltip.Portal>
 *       <Tooltip.Content>
 *         Save changes
 *         <Tooltip.Arrow />
 *       </Tooltip.Content>
 *     </Tooltip.Portal>
 *   </Tooltip>
 *
 * Wrap a subtree in `TooltipProvider` (exported separately) to share
 * open/close delays and the "skip delay" window across many tooltips.
 */
export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  Close: TooltipClose,
}) as typeof TooltipRoot & {
  Trigger: typeof TooltipTrigger
  Portal: typeof TooltipPortal
  Content: typeof TooltipContent
  Arrow: typeof TooltipArrow
  Close: typeof TooltipClose
}
