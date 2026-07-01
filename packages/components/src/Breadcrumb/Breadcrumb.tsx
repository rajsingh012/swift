import { BreadcrumbRoot } from './BreadcrumbRoot'
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './BreadcrumbParts'

/**
 * Breadcrumb — a navigation trail.
 *
 *   <Breadcrumb>
 *     <Breadcrumb.List>
 *       <Breadcrumb.Item>
 *         <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
 *       </Breadcrumb.Item>
 *       <Breadcrumb.Separator />
 *       <Breadcrumb.Item>
 *         <Breadcrumb.Page>Settings</Breadcrumb.Page>
 *       </Breadcrumb.Item>
 *     </Breadcrumb.List>
 *   </Breadcrumb>
 */
export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
})
