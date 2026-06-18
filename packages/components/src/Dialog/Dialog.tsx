import { DialogRoot } from './DialogRoot'
import { DialogTrigger } from './DialogTrigger'
import { DialogPortal } from './DialogPortal'
import { DialogOverlay } from './DialogOverlay'
import { DialogContent } from './DialogContent'
import { DialogClose } from './DialogClose'
import {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './DialogParts'

/**
 * Dialog — a centered modal window. Same overlay machinery as Sheet (focus
 * trap, scroll lock, inert background, overlay stacking, presence-based exit)
 * but centered rather than edge-anchored.
 *
 *   <Dialog>
 *     <Dialog.Trigger>Open</Dialog.Trigger>
 *     <Dialog.Portal>
 *       <Dialog.Overlay />
 *       <Dialog.Content>
 *         <Dialog.Header>
 *           <Dialog.Title>Title</Dialog.Title>
 *           <Dialog.Description>Description</Dialog.Description>
 *         </Dialog.Header>
 *         <Dialog.Body>…</Dialog.Body>
 *         <Dialog.Footer>
 *           <Dialog.Close>Cancel</Dialog.Close>
 *         </Dialog.Footer>
 *         <Dialog.Close />
 *       </Dialog.Content>
 *     </Dialog.Portal>
 *   </Dialog>
 */
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
})
