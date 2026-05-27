import { SheetBody } from './SheetBody'
import { SheetClose } from './SheetClose'
import { SheetContent } from './SheetContent'
import { SheetDescription } from './SheetDescription'
import { SheetFooter } from './SheetFooter'
import { SheetHeader } from './SheetHeader'
import { SheetOverlay } from './SheetOverlay'
import { SheetPortal } from './SheetPortal'
import { SheetRoot } from './SheetRoot'
import { SheetTitle } from './SheetTitle'
import { SheetTrigger } from './SheetTrigger'

export const Sheet = Object.assign(SheetRoot, {
  Trigger: SheetTrigger,
  Portal: SheetPortal,
  Overlay: SheetOverlay,
  Content: SheetContent,
  Header: SheetHeader,
  Title: SheetTitle,
  Description: SheetDescription,
  Body: SheetBody,
  Footer: SheetFooter,
  Close: SheetClose,
})
