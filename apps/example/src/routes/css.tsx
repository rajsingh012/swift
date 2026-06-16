import { type ComponentType, type CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { ArrowRightLong } from '@swift/icons/ArrowRightLong'
import { Bar } from '@swift/icons/Bar'
import { Bookmark } from '@swift/icons/Bookmark'
import { CheckCircle } from '@swift/icons/CheckCircle'
import { CheckCircleFilled } from '@swift/icons/CheckCircleFilled'
import { ContentCopy } from '@swift/icons/ContentCopy'
import { Document } from '@swift/icons/Document'
import { Edit } from '@swift/icons/Edit'
import { Eye } from '@swift/icons/Eye'
import { Filter } from '@swift/icons/Filter'
import { FilterFunnel } from '@swift/icons/FilterFunnel'
import { Flash } from '@swift/icons/Flash'
import { GridSmall } from '@swift/icons/GridSmall'
import { GridSmallFilled } from '@swift/icons/GridSmallFilled'
import { HideEye } from '@swift/icons/HideEye'
import { Image } from '@swift/icons/Image'
import { Keyboard } from '@swift/icons/Keyboard'
import { Language } from '@swift/icons/Language'
import { Location } from '@swift/icons/Location'
import { MoreVert } from '@swift/icons/MoreVert'
import { MyLocation } from '@swift/icons/MyLocation'
import { NearMe } from '@swift/icons/NearMe'
import { PlayFilled } from '@swift/icons/PlayFilled'
import { Refresh } from '@swift/icons/Refresh'
import { Report } from '@swift/icons/Report'
import { Search } from '@swift/icons/Search'
import { Settings } from '@swift/icons/Settings'
import { Signal } from '@swift/icons/Signal'
import { SortFilled } from '@swift/icons/SortFilled'
import { Star } from '@swift/icons/Star'
import { Swap } from '@swift/icons/Swap'
import { Sync } from '@swift/icons/Sync'
import { Tag } from '@swift/icons/Tag'
import { TrendUp } from '@swift/icons/TrendUp'
import { Tune } from '@swift/icons/Tune'
import { View } from '@swift/icons/View'
import { ZoomIn } from '@swift/icons/ZoomIn'
import { ZoomOut } from '@swift/icons/ZoomOut'
import {
  AnimationsPanel,
  AspectRatioPanel,
  BackgroundsPanel,
  BlendModesPanel,
  BlockInlinePanel,
  BoxModelPanel,
  CascadeLayersPanel,
  ClipPathPanel,
  ColorsPanel,
  ConicColorMixPanel,
  ContainerQueriesPanel,
  CountersMarkersPanel,
  CursorInteractionPanel,
  CustomPropertiesPanel,
  FeatureQueriesPanel,
  FlexboxPanel,
  FocusStatesPanel,
  FormsAccentPanel,
  GridPanel,
  LogicalPropertiesPanel,
  MaskingPanel,
  MultiColumnPanel,
  OverflowPanel,
  PerformancePanel,
  PositioningPanel,
  PrintStylesPanel,
  ScopedStylesPanel,
  ScrollbarStylingPanel,
  ScrollSnapPanel,
  SelectorsPanel,
  ShadowsFiltersPanel,
  SpecificityPanel,
  SubgridPanel,
  TransformsPanel,
  TransitionsPanel,
  TypedPropertiesPanel,
  TypographyPanel,
  UnitsPanel,
  WritingModesPanel,
} from '../Components/css'
import { SidebarLayout } from '../lib/SidebarLayout'

type IconComponent = ComponentType<{ size?: number; className?: string }>

// CSS concept topics. Mirrors the Components route — a sidebar list + a
// panel map, so new lessons drop in by adding one entry to each. Kept in
// alphabetical order so the sidebar reads predictably.
type TopicName =
  | 'Animations'
  | 'Aspect Ratio'
  | 'Backgrounds'
  | 'Blend Modes'
  | 'Block & Inline'
  | 'Box Model'
  | 'Cascade Layers'
  | 'Clip-path'
  | 'Colors & Gradients'
  | 'Conic & color-mix'
  | 'Container Queries'
  | 'Counters & Markers'
  | 'Cursor & Interaction'
  | 'Custom Properties'
  | 'Feature Queries'
  | 'Flexbox'
  | 'Focus & States'
  | 'Forms & Accent'
  | 'Grid'
  | 'Logical Properties'
  | 'Masking'
  | 'Multi-column'
  | 'Overflow'
  | 'Performance'
  | 'Positioning'
  | 'Print Styles'
  | 'Scoped Styles'
  | 'Scroll Snap'
  | 'Scrollbar Styling'
  | 'Selectors'
  | 'Shadows & Filters'
  | 'Specificity & Cascade'
  | 'Subgrid'
  | 'Transforms'
  | 'Transitions'
  | 'Typed Properties'
  | 'Typography'
  | 'Units & Sizing'
  | 'Writing Modes'

const topics: ReadonlyArray<{ name: TopicName; icon: IconComponent }> = [
  { name: 'Animations', icon: PlayFilled },
  { name: 'Aspect Ratio', icon: ZoomOut },
  { name: 'Backgrounds', icon: ContentCopy },
  { name: 'Blend Modes', icon: Bookmark },
  { name: 'Block & Inline', icon: Document },
  { name: 'Box Model', icon: GridSmall },
  { name: 'Cascade Layers', icon: SortFilled },
  { name: 'Clip-path', icon: Star },
  { name: 'Colors & Gradients', icon: Image },
  { name: 'Conic & color-mix', icon: Sync },
  { name: 'Container Queries', icon: ZoomIn },
  { name: 'Counters & Markers', icon: Signal },
  { name: 'Cursor & Interaction', icon: NearMe },
  { name: 'Custom Properties', icon: Settings },
  { name: 'Feature Queries', icon: CheckCircle },
  { name: 'Flexbox', icon: Filter },
  { name: 'Focus & States', icon: MyLocation },
  { name: 'Forms & Accent', icon: CheckCircleFilled },
  { name: 'Grid', icon: GridSmallFilled },
  { name: 'Logical Properties', icon: Language },
  { name: 'Masking', icon: HideEye },
  { name: 'Multi-column', icon: Bar },
  { name: 'Overflow', icon: View },
  { name: 'Performance', icon: TrendUp },
  { name: 'Positioning', icon: Location },
  { name: 'Print Styles', icon: Report },
  { name: 'Scoped Styles', icon: FilterFunnel },
  { name: 'Scroll Snap', icon: ArrowRightLong },
  { name: 'Scrollbar Styling', icon: MoreVert },
  { name: 'Selectors', icon: Search },
  { name: 'Shadows & Filters', icon: Eye },
  { name: 'Specificity & Cascade', icon: Tag },
  { name: 'Subgrid', icon: GridSmall },
  { name: 'Transforms', icon: Swap },
  { name: 'Transitions', icon: Refresh },
  { name: 'Typed Properties', icon: Flash },
  { name: 'Typography', icon: Edit },
  { name: 'Units & Sizing', icon: Tune },
  { name: 'Writing Modes', icon: Keyboard },
]

const panelMap: Record<TopicName, ComponentType> = {
  'Animations': AnimationsPanel,
  'Aspect Ratio': AspectRatioPanel,
  'Backgrounds': BackgroundsPanel,
  'Blend Modes': BlendModesPanel,
  'Block & Inline': BlockInlinePanel,
  'Box Model': BoxModelPanel,
  'Cascade Layers': CascadeLayersPanel,
  'Clip-path': ClipPathPanel,
  'Colors & Gradients': ColorsPanel,
  'Conic & color-mix': ConicColorMixPanel,
  'Container Queries': ContainerQueriesPanel,
  'Counters & Markers': CountersMarkersPanel,
  'Cursor & Interaction': CursorInteractionPanel,
  'Custom Properties': CustomPropertiesPanel,
  'Feature Queries': FeatureQueriesPanel,
  'Flexbox': FlexboxPanel,
  'Focus & States': FocusStatesPanel,
  'Forms & Accent': FormsAccentPanel,
  'Grid': GridPanel,
  'Logical Properties': LogicalPropertiesPanel,
  'Masking': MaskingPanel,
  'Multi-column': MultiColumnPanel,
  'Overflow': OverflowPanel,
  'Performance': PerformancePanel,
  'Positioning': PositioningPanel,
  'Print Styles': PrintStylesPanel,
  'Scoped Styles': ScopedStylesPanel,
  'Scroll Snap': ScrollSnapPanel,
  'Scrollbar Styling': ScrollbarStylingPanel,
  'Selectors': SelectorsPanel,
  'Shadows & Filters': ShadowsFiltersPanel,
  'Specificity & Cascade': SpecificityPanel,
  'Subgrid': SubgridPanel,
  'Transforms': TransformsPanel,
  'Transitions': TransitionsPanel,
  'Typed Properties': TypedPropertiesPanel,
  'Typography': TypographyPanel,
  'Units & Sizing': UnitsPanel,
  'Writing Modes': WritingModesPanel,
}

const DEFAULT_SELECTED: TopicName = 'Animations'

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
