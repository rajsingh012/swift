import { TabsContent } from './TabsContent'
import { TabsIndicator } from './TabsIndicator'
import { TabsList } from './TabsList'
import { TabsRoot } from './TabsRoot'
import { TabsTrigger } from './TabsTrigger'

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator,
})

export default Tabs

export type {
  TabsApi,
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsIndicatorProps,
  TabsOrientation,
  TabsActivationMode,
  TabsDirection,
  TabsClasses,
} from './Tabs.types'
