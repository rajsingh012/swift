import { useState, type ComponentType } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Text } from '@swift/components'
import { Check, CreditCard, Document, GridSmall } from '@swift/icons'
import {
  AccordionPanel,
  ButtonPanel,
  CardPanel,
  TextPanel,
} from '../Components'

type IconComponent = ComponentType<{ size?: number; className?: string }>

export const Route = createFileRoute('/components')({
  component: RouteComponent,
})

type ComponentName = 'Button' | 'Card' | 'Text' | 'Accordion'

const components: ReadonlyArray<{ name: ComponentName; icon: IconComponent }> = [
  { name: 'Button', icon: Check },
  { name: 'Card', icon: CreditCard },
  { name: 'Text', icon: Document },
  { name: 'Accordion', icon: GridSmall },
]

const panelMap: Record<ComponentName, ComponentType> = {
  Button: ButtonPanel,
  Card: CardPanel,
  Text: TextPanel,
  Accordion: AccordionPanel,
}

function RouteComponent() {
  const [selected, setSelected] = useState<ComponentName>('Button')
  const Panel = panelMap[selected]

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">
      <aside className="flex w-72 shrink-0 flex-col border-r border-stroke bg-surface">
        <div className="border-b border-stroke px-4 py-3.5">
          <Text variant="body-sm" fontWeight="semibold">
            @swift/components
          </Text>
          <Text variant="body-xs" color="muted" className="block">
            {components.length} components
          </Text>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
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
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Panel />
      </main>
    </div>
  )
}
