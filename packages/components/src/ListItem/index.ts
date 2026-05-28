import { ListItemComponent } from './ListItem'
import { ListItemActions } from './ListItemActions'
import { ListItemContent } from './ListItemContent'
import { ListItemDescription } from './ListItemDescription'
import { ListItemLeading } from './ListItemLeading'
import { ListItemTitle } from './ListItemTitle'
import { ListItemTrailing } from './ListItemTrailing'
import type { ListItemComponent as ListItemComponentType } from './ListItem.types'

export const ListItem = Object.assign(ListItemComponent, {
  Leading: ListItemLeading,
  Content: ListItemContent,
  Title: ListItemTitle,
  Description: ListItemDescription,
  Trailing: ListItemTrailing,
  Actions: ListItemActions,
}) as ListItemComponentType & {
  Leading: typeof ListItemLeading
  Content: typeof ListItemContent
  Title: typeof ListItemTitle
  Description: typeof ListItemDescription
  Trailing: typeof ListItemTrailing
  Actions: typeof ListItemActions
}

export { List } from './List'

export type {
  ListItemProps,
  ListItemOwnProps,
  ListItemSize,
  ListItemDensity,
  ListItemAlign,
  ListItemClasses,
  ListItemLeadingProps,
  ListItemContentProps,
  ListItemTitleProps,
  ListItemDescriptionProps,
  ListItemTrailingProps,
  ListItemActionsProps,
  ListProps,
} from './ListItem.types'

export default ListItem
