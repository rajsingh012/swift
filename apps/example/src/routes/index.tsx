import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, Text } from '@swift/components'
import {
  Afternoon,
  ArrowRight,
  Check,
  CreditCard,
  Document,
  GridSmallFilled,
  Night,
  Search,
  Settings,
  Star,
} from '@swift/icons'
import { useTheme, type Theme } from '../lib/theme'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

const SHOWCASE_ICONS = [
  { Icon: Star, color: 'text-content-highlight' },
  { Icon: Check, color: 'text-content-success' },
  { Icon: Search, color: 'text-content-brand' },
  { Icon: Settings, color: 'text-content' },
  { Icon: CreditCard, color: 'text-content-new' },
  { Icon: Document, color: 'text-content-warning' },
] as const

const SWATCHES = [
  'bg-surface-brand',
  'bg-surface-highlight',
  'bg-surface-success',
  'bg-surface-warning',
  'bg-surface-critical',
  'bg-surface-new',
] as const

const SECTIONS = [
  {
    to: '/icons',
    label: 'Icons',
    icon: Star,
    accent: 'text-content-highlight',
    blurb: 'A growing set of SVG icons with sizing, color, and download helpers.',
  },
  {
    to: '/components',
    label: 'Components',
    icon: Settings,
    accent: 'text-content-brand',
    blurb: 'Button, Card, Text — typed, themed, and composable.',
  },
  {
    to: '/foundations',
    label: 'Foundations',
    icon: GridSmallFilled,
    accent: 'text-content-new',
    blurb: 'Palettes, semantic tokens, radius, and shadow scales.',
  },
] as const

function Showcase() {
  return (
    <div className="flex flex-col gap-4 bg-surface p-5">
      <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
        A taste of Swift
      </Text>

      <div className="flex flex-wrap items-center gap-4">
        {SHOWCASE_ICONS.map(({ Icon, color }, i) => (
          <Icon key={i} size={22} className={color} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          <Button.LeftIcon><Check size={14} /></Button.LeftIcon>
          Primary
        </Button>
        <Button variant="secondary" size="sm">Secondary</Button>
        <Button variant="ghost" size="sm">
          More
          <Button.RightIcon><ArrowRight size={14} /></Button.RightIcon>
        </Button>
      </div>

      <div className="flex h-7 overflow-hidden rounded-md border border-stroke">
        {SWATCHES.map((bg) => (
          <div key={bg} className={`flex-1 ${bg}`} />
        ))}
      </div>
    </div>
  )
}

function ThemePreviewCard({
  scope,
  active,
  onActivate,
}: {
  scope: Theme
  active: boolean
  onActivate: () => void
}) {
  const Icon = scope === 'light' ? Afternoon : Night
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-pressed={active}
      data-theme={scope}
      className={`group cursor-pointer overflow-hidden rounded-xl border bg-surface text-left transition-shadow ${
        active ? 'border-stroke-brand shadow-level2' : 'border-stroke hover:shadow-level1'
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-stroke bg-surface-muted px-4 py-2.5">
        <span className="flex items-center gap-2">
          <Icon size={14} className="text-content-muted" />
          <Text variant="body-xs" fontWeight="semibold" color="primary" className="capitalize">
            {scope}
          </Text>
        </span>
        {active ? (
          <Text variant="body-xs" fontWeight="semibold" color="primary" className="text-content-brand">
            Active
          </Text>
        ) : (
          <Text variant="body-xs" color="muted">
            Click to apply
          </Text>
        )}
      </div>
      <Showcase />
    </button>
  )
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="inline-flex items-center rounded-lg border border-stroke bg-surface p-0.5">
      {(['light', 'dark'] as const).map((t) => {
        const Icon = t === 'light' ? Afternoon : Night
        const active = theme === t
        return (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            aria-pressed={active}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-surface-brand-muted text-content-brand'
                : 'text-content hover:bg-surface-muted'
            }`}
          >
            <Icon size={14} />
            <span className="capitalize">{t}</span>
          </button>
        )
      })}
    </div>
  )
}

function HomeRoute() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-full w-full overflow-y-auto bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-8 py-16">
        <header className="flex flex-col items-center gap-3 text-center">
          <Text
            variant="body-xs"
            fontWeight="semibold"
            color="muted"
            className="tracking-[0.2em] uppercase"
          >
            Swift Design System
          </Text>
          <Text variant="heading-xl" fontWeight="bold">
            icons, components, and tokens — all in one place.
          </Text>
          <Text variant="para-md" color="secondary" className="max-w-xl">
            A small, themed set of building blocks. Browse the icon library, explore components, or
            inspect the design tokens that power them.
          </Text>
        </header>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                Theme preview
              </Text>
              <Text variant="body-sm" color="secondary">
                Pick a mode — both surfaces below render with the same tokens.
              </Text>
            </div>
            <ThemeSwitcher />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ThemePreviewCard
              scope="light"
              active={theme === 'light'}
              onActivate={() => setTheme('light')}
            />
            <ThemePreviewCard
              scope="dark"
              active={theme === 'dark'}
              onActivate={() => setTheme('dark')}
            />
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {SECTIONS.map(({ to, label, icon: Icon, accent, blurb }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-2 rounded-xl border border-stroke bg-surface-elevated p-5 transition-colors hover:border-stroke-brand hover:bg-surface-muted"
            >
              <div className="flex items-center gap-2">
                <Icon size={18} className={accent} />
                <Text variant="body-md" fontWeight="semibold" color="primary" fontFamily='mono'>
                  {label}
                </Text>
              </div>
              <Text variant="body-sm" color="secondary">
                {blurb}
              </Text>
              <Text
                variant="body-xs"
                fontWeight="semibold"
                color="primary"
                className="mt-auto inline-flex items-center gap-1 pt-1 text-content-brand"
              >
                Browse
                <ArrowRight size={12} />
              </Text>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
