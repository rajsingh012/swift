import { type ComponentType, type CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { Document } from '@swift/icons/Document'
import { GridSmall } from '@swift/icons/GridSmall'
import { Location } from '@swift/icons/Location'
import { BlockInlinePanel, BoxModelPanel, PositioningPanel } from '../Components'
import { SidebarLayout } from '../lib/SidebarLayout'

type IconComponent = ComponentType<{ size?: number; className?: string }>

// CSS concept topics. Mirrors the Components route — a sidebar list + a
// panel map, so new lessons (Flexbox, Grid, …) drop in by adding one
// entry to each.
type TopicName = 'Box Model' | 'Block & Inline' | 'Positioning'

const topics: ReadonlyArray<{ name: TopicName; icon: IconComponent }> = [
  { name: 'Box Model', icon: GridSmall },
  { name: 'Block & Inline', icon: Document },
  { name: 'Positioning', icon: Location },
]

const panelMap: Record<TopicName, ComponentType> = {
  'Box Model': BoxModelPanel,
  'Block & Inline': BlockInlinePanel,
  'Positioning': PositioningPanel,
}

const DEFAULT_SELECTED: TopicName = 'Box Model'

const isTopicName = (v: unknown): v is TopicName =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(panelMap, v)

type CssSearch = { t?: TopicName }

export const Route = createFileRoute('/css')({
  validateSearch: (search: Record<string, unknown>): CssSearch =>
    isTopicName(search.t) ? { t: search.t } : {},
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = Route.useSearch()
  const navigate = Route.useNavigate()
  const selected: TopicName = t ?? DEFAULT_SELECTED
  const Panel = panelMap[selected]

  const setSelected = (name: TopicName) => {
    navigate({
      search: (prev: CssSearch) => ({ ...prev, t: name }),
      replace: true,
    })
  }

  return (
    <SidebarLayout
      title="CSS"
      subtitle={`${topics.length} ${topics.length === 1 ? 'topic' : 'topics'}`}
      selectedKey={selected}
      triggerLabel={selected}
      sidebar={
        <ul className="space-y-0.5">
          {topics.map(({ name, icon: Icon }, i) => {
            const isActive = name === selected
            return (
              <li
                key={name}
                className="anim-fade-in"
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
                  <span
                    aria-hidden
                    className={`absolute left-0.5 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-surface-brand transition-[opacity,scale] duration-(--motion-duration-normal) ease-(--motion-ease-emphasized) ${
                      isActive ? 'scale-y-100 opacity-100' : 'scale-y-50 opacity-0'
                    }`}
                  />
                  <Icon
                    size={16}
                    className={`shrink-0 transition-[color,scale] duration-(--motion-duration-fast) ease-(--motion-ease-standard) group-hover:scale-[1.06] ${
                      isActive ? '' : 'text-content-muted group-hover:text-content'
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
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
          <Text variant="body-xs" color="muted">
            CSS
          </Text>
          <span aria-hidden className="select-none text-xs text-content-muted">
            /
          </span>
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
      <div key={selected} className="anim-fade-up">
        <Panel />
      </div>
    </SidebarLayout>
  )
}
