import { type ComponentType } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@swift/components/Button'
import { Check } from '@swift/icons/Check'
import { CheckCircle } from '@swift/icons/CheckCircle'
import { CheckCircleFilled } from '@swift/icons/CheckCircleFilled'
import { CreditCard } from '@swift/icons/CreditCard'
import { ArrowRightLong } from '@swift/icons/ArrowRightLong'
import { Document } from '@swift/icons/Document'
import { Edit } from '@swift/icons/Edit'
import { Filter } from '@swift/icons/Filter'
import { GridSmall } from '@swift/icons/GridSmall'
import { Tag } from '@swift/icons/Tag'
import {
  AccordionPanel,
  BadgePanel,
  ButtonPanel,
  CardPanel,
  CheckboxPanel,
  ChipPanel,
  InputPanel,
  ListItemPanel,
  RadioPanel,
  SheetPanel,
  SliderPanel,
  TextPanel,
} from '../Components'
import { SidebarLayout } from '../lib/SidebarLayout'

type IconComponent = ComponentType<{ size?: number; className?: string }>

type ComponentName =
  | 'Accordion'
  | 'Badge'
  | 'Button'
  | 'Card'
  | 'Checkbox'
  | 'Chip'
  | 'Input'
  | 'ListItem'
  | 'Radio'
  | 'Sheet'
  | 'Slider'
  | 'Text'

// Sidebar list — kept alphabetically ascending. New components should be
// inserted in the right slot, not appended.
const components: ReadonlyArray<{ name: ComponentName; icon: IconComponent }> = [
  { name: 'Accordion', icon: GridSmall },
  { name: 'Badge', icon: Tag },
  { name: 'Button', icon: Check },
  { name: 'Card', icon: CreditCard },
  { name: 'Checkbox', icon: CheckCircle },
  { name: 'Chip', icon: Filter },
  { name: 'Input', icon: Edit },
  { name: 'ListItem', icon: Document },
  { name: 'Radio', icon: CheckCircleFilled },
  { name: 'Sheet', icon: ArrowRightLong },
  { name: 'Slider', icon: Filter },
  { name: 'Text', icon: Document },
]

const panelMap: Record<ComponentName, ComponentType> = {
  Accordion: AccordionPanel,
  Badge: BadgePanel,
  Button: ButtonPanel,
  Card: CardPanel,
  Checkbox: CheckboxPanel,
  Chip: ChipPanel,
  Input: InputPanel,
  ListItem: ListItemPanel,
  Radio: RadioPanel,
  Sheet: SheetPanel,
  Slider: SliderPanel,
  Text: TextPanel,
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
          {components.map(({ name, icon: Icon }) => {
            const isActive = name === selected
            return (
              <li key={name}>
                <Button
                  variant="unstyled"
                  onClick={() => setSelected(name)}
                  classes={{
                    root: `flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'font-medium text-content hover:bg-surface-muted'
                    }`,
                  }}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="truncate">{name}</span>
                </Button>
              </li>
            )
          })}
        </ul>
      }
    >
      <Panel />
    </SidebarLayout>
  )
}
