import { type ComponentType, type CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { Alert } from '@swift/icons/Alert'
import { Calendar } from '@swift/icons/Calendar'
import { Flag } from '@swift/icons/Flag'
import { Person } from '@swift/icons/Person'
import { Check } from '@swift/icons/Check'
import { SandTimeFilled } from '@swift/icons/SandTimeFilled'
import { CalendarModify } from '@swift/icons/CalendarModify'
import { CheckCircle } from '@swift/icons/CheckCircle'
import { CheckCircleFilled } from '@swift/icons/CheckCircleFilled'
import { CreditCard } from '@swift/icons/CreditCard'
import { ArrowRightLong } from '@swift/icons/ArrowRightLong'
import { Document } from '@swift/icons/Document'
import { Edit } from '@swift/icons/Edit'
import { Filter } from '@swift/icons/Filter'
import { GridSmall } from '@swift/icons/GridSmall'
import { InfoCircle } from '@swift/icons/InfoCircle'
import { Notifications } from '@swift/icons/Notifications'
import { Tag } from '@swift/icons/Tag'
import { View } from '@swift/icons/View'
import {
  AccordionPanel,
  AlertPanel,
  AvatarPanel,
  BadgePanel,
  BoxPanel,
  BreadcrumbPanel,
  ButtonPanel,
  CardPanel,
  CarouselPanel,
  CheckboxPanel,
  ChipPanel,
  CollapsiblePanel,
  DatePickerPanel,
  DialogPanel,
  DividerPanel,
  DropdownMenuPanel,
  InputPanel,
  ListItemPanel,
  PaginationPanel,
  PopoverPanel,
  ProgressPanel,
  RadioPanel,
  SegmentedControlPanel,
  SelectPanel,
  SheetPanel,
  SkeletonPanel,
  SliderPanel,
  SpinnerPanel,
  SwitchPanel,
  TabsPanel,
  TextPanel,
  TextareaPanel,
  ToastPanel,
  TimePickerPanel,
  TogglePanel,
  TooltipPanel,
  YearPickerPanel,
} from '../Components'
import { SidebarLayout } from '../lib/SidebarLayout'

type IconComponent = ComponentType<{ size?: number; className?: string }>

type ComponentName =
  | 'Accordion'
  | 'Alert'
  | 'Avatar'
  | 'Badge'
  | 'Box'
  | 'Breadcrumb'
  | 'Button'
  | 'Card'
  | 'Carousel'
  | 'Checkbox'
  | 'Chip'
  | 'Collapsible'
  | 'DatePicker'
  | 'Dialog'
  | 'Divider'
  | 'DropdownMenu'
  | 'Input'
  | 'ListItem'
  | 'Pagination'
  | 'Popover'
  | 'Progress'
  | 'Radio'
  | 'SegmentedControl'
  | 'Select'
  | 'Sheet'
  | 'Skeleton'
  | 'Slider'
  | 'Spinner'
  | 'Switch'
  | 'Tabs'
  | 'Text'
  | 'Textarea'
  | 'Toast'
  | 'TimePicker'
  | 'Toggle'
  | 'Tooltip'
  | 'YearPicker'

// Sidebar list — kept alphabetically ascending. New components should be
// inserted in the right slot, not appended.
const components: ReadonlyArray<{ name: ComponentName; icon: IconComponent }> = [
  { name: 'Accordion', icon: GridSmall },
  { name: 'Alert', icon: Flag },
  { name: 'Avatar', icon: Person },
  { name: 'Badge', icon: Tag },
  { name: 'Box', icon: GridSmall },
  { name: 'Breadcrumb', icon: ArrowRightLong },
  { name: 'Button', icon: Check },
  { name: 'Card', icon: CreditCard },
  { name: 'Carousel', icon: ArrowRightLong },
  { name: 'Checkbox', icon: CheckCircle },
  { name: 'Chip', icon: Filter },
  { name: 'Collapsible', icon: GridSmall },
  { name: 'DatePicker', icon: Calendar },
  { name: 'Dialog', icon: View },
  { name: 'Divider', icon: GridSmall },
  { name: 'DropdownMenu', icon: Filter },
  { name: 'Input', icon: Edit },
  { name: 'ListItem', icon: Document },
  { name: 'Pagination', icon: ArrowRightLong },
  { name: 'Popover', icon: InfoCircle },
  { name: 'Progress', icon: SandTimeFilled },
  { name: 'Radio', icon: CheckCircleFilled },
  { name: 'SegmentedControl', icon: GridSmall },
  { name: 'Select', icon: Filter },
  { name: 'Sheet', icon: ArrowRightLong },
  { name: 'Skeleton', icon: Document },
  { name: 'Slider', icon: Filter },
  { name: 'Spinner', icon: SandTimeFilled },
  { name: 'Switch', icon: Notifications },
  { name: 'Tabs', icon: View },
  { name: 'Text', icon: Document },
  { name: 'Textarea', icon: Edit },
  { name: 'Toast', icon: Alert },
  { name: 'TimePicker', icon: SandTimeFilled },
  { name: 'Toggle', icon: Check },
  { name: 'Tooltip', icon: InfoCircle },
  { name: 'YearPicker', icon: CalendarModify },
]

const panelMap: Record<ComponentName, ComponentType> = {
  Accordion: AccordionPanel,
  Alert: AlertPanel,
  Avatar: AvatarPanel,
  Badge: BadgePanel,
  Box: BoxPanel,
  Breadcrumb: BreadcrumbPanel,
  Button: ButtonPanel,
  Card: CardPanel,
  Carousel: CarouselPanel,
  Checkbox: CheckboxPanel,
  Chip: ChipPanel,
  Collapsible: CollapsiblePanel,
  DatePicker: DatePickerPanel,
  Dialog: DialogPanel,
  Divider: DividerPanel,
  DropdownMenu: DropdownMenuPanel,
  Input: InputPanel,
  ListItem: ListItemPanel,
  Pagination: PaginationPanel,
  Popover: PopoverPanel,
  Progress: ProgressPanel,
  Radio: RadioPanel,
  SegmentedControl: SegmentedControlPanel,
  Select: SelectPanel,
  Sheet: SheetPanel,
  Skeleton: SkeletonPanel,
  Slider: SliderPanel,
  Spinner: SpinnerPanel,
  Switch: SwitchPanel,
  Tabs: TabsPanel,
  Text: TextPanel,
  Textarea: TextareaPanel,
  Toast: ToastPanel,
  TimePicker: TimePickerPanel,
  Toggle: TogglePanel,
  Tooltip: TooltipPanel,
  YearPicker: YearPickerPanel,
}

const DEFAULT_SELECTED: ComponentName = 'Accordion'

const isComponentName = (v: unknown): v is ComponentName =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(panelMap, v)

type ComponentsSearch = { c?: ComponentName }

export const Route = createFileRoute('/components')({
  validateSearch: (search: Record<string, unknown>): ComponentsSearch =>
    isComponentName(search.c) ? { c: search.c } : {},
  component: RouteComponent,
})

function RouteComponent() {
  const { c } = Route.useSearch()
  const navigate = Route.useNavigate()
  const selected: ComponentName = c ?? DEFAULT_SELECTED
  const Panel = panelMap[selected]

  const setSelected = (name: ComponentName) => {
    // `replace: true` keeps the back button useful — tab switches don't
    // pollute browser history, but the URL is still shareable + survives reload.
    navigate({
      search: (prev: ComponentsSearch) => ({ ...prev, c: name }),
      replace: true,
    })
  }

  return (
    <SidebarLayout
      title="@swift/components"
      subtitle={`${components.length} components`}
      selectedKey={selected}
      triggerLabel={selected}
      sidebar={
        <ul className="space-y-0.5">
          {components.map(({ name, icon: Icon }, i) => {
            const isActive = name === selected
            return (
              <li
                key={name}
                className="anim-fade-in"
                // Cap the stagger so the tail of the list doesn't take
                // seconds to appear — items 15+ share one delay slot.
                style={{ '--stagger-i': Math.min(i, 15) } as CSSProperties}
              >
                <Button
                  variant="unstyled"
                  onClick={() => setSelected(name)}
                  classes={{
                    root: `group relative flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-[background-color,color] duration-(--motion-duration-fast) ease-(--motion-ease-standard) ${
                      isActive
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'font-medium text-content hover:bg-surface-muted'
                    }`,
                  }}
                >
                  {/* Active accent bar — scale + opacity transition makes
                      switching items feel alive without any layout shift. */}
                  <span
                    aria-hidden
                    className={`absolute left-0.5 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-surface-brand transition-[opacity,scale] duration-(--motion-duration-normal) ease-(--motion-ease-emphasized) ${
                      isActive ? 'scale-y-100 opacity-100' : 'scale-y-50 opacity-0'
                    }`}
                  />
                  <Icon
                    size={16}
                    className={`shrink-0 transition-[color,scale] duration-(--motion-duration-fast) ease-(--motion-ease-standard) group-hover:scale-[1.06] ${
                      isActive
                        ? ''
                        : 'text-content-muted group-hover:text-content'
                    }`}
                  />
                  <span className="truncate">{name}</span>
                </Button>
              </li>
            )
          })}
        </ul>
      }
      header={
        /* Slim breadcrumb chrome. Panels render their own heading-xl title,
           so this stays minimal: "Components / Button". Rendered by the
           layout as fixed chrome above the scroll area — content scrolls
           under it, never over it. */
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
          <Text variant="body-xs" color="muted">
            Components
          </Text>
          <span aria-hidden className="select-none text-xs text-content-muted">
            /
          </span>
          {/* Keyed so the name cross-fades when the selection changes. */}
          <Text
            key={selected}
            variant="body-xs"
            fontWeight="semibold"
            className="anim-fade-in inline-block"
          >
            {selected}
          </Text>
        </nav>
      }
    >
      {/* `key` remounts the panel on switch — state reset between components
          is intentional — and re-runs the entrance animation each time. */}
      <div key={selected} className="anim-fade-up">
        <Panel />
      </div>
    </SidebarLayout>
  )
}
