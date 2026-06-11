import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Accordion } from '@swift/components/Accordion'
import { Avatar, AvatarGroup } from '@swift/components/Avatar'
import { Badge } from '@swift/components/Badge'
import { Button } from '@swift/components/Button'
import { Card } from '@swift/components/Card'
import { Checkbox } from '@swift/components/Checkbox'
import { Chip } from '@swift/components/Chip'
import { Input } from '@swift/components/Input'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Switch } from '@swift/components/Switch'
import { Tabs } from '@swift/components/Tabs'
import { Text } from '@swift/components/Text'
import { toast } from '@swift/components/Toast'
import { Afternoon } from '@swift/icons/Afternoon'
import { ArrowRight } from '@swift/icons/ArrowRight'
import { Bag } from '@swift/icons/Bag'
import { Beach } from '@swift/icons/Beach'
import { Bookmark } from '@swift/icons/Bookmark'
import { Bus } from '@swift/icons/Bus'
import { Calendar } from '@swift/icons/Calendar'
import { Cafe } from '@swift/icons/Cafe'
import { Check } from '@swift/icons/Check'
import { CheckCircle } from '@swift/icons/CheckCircle'
import { City } from '@swift/icons/City'
import { CreditCard } from '@swift/icons/CreditCard'
import { Discount } from '@swift/icons/Discount'
import { Document } from '@swift/icons/Document'
import { Edit } from '@swift/icons/Edit'
import { ExpandMore } from '@swift/icons/ExpandMore'
import { Filter } from '@swift/icons/Filter'
import { Flash } from '@swift/icons/Flash'
import { Flight } from '@swift/icons/Flight'
import { GridSmallFilled } from '@swift/icons/GridSmallFilled'
import { Heart } from '@swift/icons/Heart'
import { Home } from '@swift/icons/Home'
import { Hotel } from '@swift/icons/Hotel'
import { InfoCircle } from '@swift/icons/InfoCircle'
import { Location } from '@swift/icons/Location'
import { Mail } from '@swift/icons/Mail'
import { Night } from '@swift/icons/Night'
import { Notifications } from '@swift/icons/Notifications'
import { Person } from '@swift/icons/Person'
import { Search } from '@swift/icons/Search'
import { Settings } from '@swift/icons/Settings'
import { Spa } from '@swift/icons/Spa'
import { Star } from '@swift/icons/Star'
import { Tag } from '@swift/icons/Tag'
import { ThumbUp } from '@swift/icons/ThumbUp'
import { Train } from '@swift/icons/Train'
import { TrendUp } from '@swift/icons/TrendUp'
import { Wallet } from '@swift/icons/Wallet'
import { Wifi } from '@swift/icons/Wifi'
import { CodeBlock } from '../Components/shared'
import { useTheme, type Theme } from '../lib/Theme'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

type IconComponent = ComponentType<{ size?: number; className?: string }>

/** Inline custom property consumed by motion.css stagger (55ms per step). */
const stagger = (i: number): CSSProperties => ({ '--stagger-i': i }) as CSSProperties

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** rAF count-up from 0 → target on mount; renders the target immediately
 *  when the user prefers reduced motion. Cubic ease-out, ~0.9s. */
function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return value
}

/** IntersectionObserver "has scrolled into view" flag. Reduced-motion
 *  users (and pre-IO browsers) see content immediately. */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return { ref, shown }
}

/** Fades a below-the-fold section up once it scrolls into view. */
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, shown } = useReveal()
  return (
    <div ref={ref} className={`${shown ? 'anim-fade-up' : 'opacity-0'} ${className}`}>
      {children}
    </div>
  )
}

/* ── Bento grid plumbing ────────────────────────────────────────────
   The grid is split into horizontal "bands" — each band is its own
   2/4/6-column grid (mobile/md/lg) sharing the same gap, so visually
   they read as one continuous bento. Each band owns an
   IntersectionObserver and broadcasts `shown` via context so tiles run
   their own staggered fade-up the moment the band scrolls in. */

const BandShownContext = createContext(true)

function BentoBand({ children }: { children: ReactNode }) {
  const { ref, shown } = useReveal()
  return (
    <BandShownContext.Provider value={shown}>
      <div
        ref={ref}
        className="grid auto-rows-[minmax(140px,auto)] grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {children}
      </div>
    </BandShownContext.Provider>
  )
}

const TILE_CHROME =
  'hover-lift group flex flex-col gap-3 overflow-hidden rounded-2xl border border-stroke bg-surface-elevated p-5 hover:border-stroke-brand'

/** Per-tile entrance: staggered fade-up once the band reveals.
 *  Stagger index is capped at 10 so late tiles don't lag behind. */
function useTileEntrance(i: number) {
  const shown = useContext(BandShownContext)
  return {
    entranceClass: shown ? 'anim-fade-up' : 'opacity-0',
    entranceStyle: stagger(Math.min(i, 10)),
  }
}

/** Shared bento tile. `bare` skips the chrome for children that already
 *  draw their own card (e.g. TripCard). Pass grid spans via className. */
function Tile({
  i = 0,
  className = '',
  bare = false,
  children,
}: {
  i?: number
  className?: string
  bare?: boolean
  children: ReactNode
}) {
  const { entranceClass, entranceStyle } = useTileEntrance(i)
  return (
    <div
      className={`${entranceClass} ${bare ? '' : TILE_CHROME} ${className}`}
      style={entranceStyle}
    >
      {children}
    </div>
  )
}

function TileHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="flex flex-col">
      <Text variant="body-md" fontWeight="semibold" color="primary">
        {title}
      </Text>
      {desc ? (
        <Text variant="body-xs" color="muted">
          {desc}
        </Text>
      ) : null}
    </div>
  )
}

const SHOWCASE_ICONS: ReadonlyArray<{ Icon: IconComponent; color: string }> = [
  { Icon: Star, color: 'text-content-highlight' },
  { Icon: Check, color: 'text-content-success' },
  { Icon: Search, color: 'text-content-brand' },
  { Icon: Settings, color: 'text-content' },
  { Icon: CreditCard, color: 'text-content-new' },
  { Icon: Document, color: 'text-content-warning' },
]

const SWATCHES = [
  'bg-surface-brand',
  'bg-surface-highlight',
  'bg-surface-success',
  'bg-surface-warning',
  'bg-surface-critical',
  'bg-surface-new',
] as const

const SECTIONS: ReadonlyArray<{
  to: '/icons' | '/components' | '/foundations'
  label: string
  icon: IconComponent
  accent: string
  blurb: string
}> = [
  { to: '/icons', label: 'Icons', icon: Star, accent: 'text-content-highlight', blurb: 'A growing set of SVG icons with sizing, color, and download helpers.' },
  { to: '/components', label: 'Components', icon: Settings, accent: 'text-content-brand', blurb: 'Button, Card, Text — typed, themed, and composable.' },
  { to: '/foundations', label: 'Foundations', icon: GridSmallFilled, accent: 'text-content-new', blurb: 'Palettes, semantic tokens, radius, and shadow scales.' },
]

const TRAVEL_CHIPS: ReadonlyArray<{ value: string; label: string; icon: IconComponent }> = [
  { value: 'flights', label: 'Flights', icon: Flight },
  { value: 'hotels', label: 'Hotels', icon: Hotel },
  { value: 'trains', label: 'Trains', icon: Train },
  { value: 'buses', label: 'Buses', icon: Bus },
  { value: 'cabs', label: 'Cabs', icon: City },
]

const ICON_WALL: ReadonlyArray<{ Icon: IconComponent; color: string }> = [
  { Icon: Flight, color: 'text-content-brand' },
  { Icon: Hotel, color: 'text-content-new' },
  { Icon: Train, color: 'text-content-success' },
  { Icon: Bus, color: 'text-content-warning' },
  { Icon: Beach, color: 'text-content-highlight' },
  { Icon: City, color: 'text-content' },
  { Icon: Home, color: 'text-content-brand' },
  { Icon: Wifi, color: 'text-content-new' },
  { Icon: Cafe, color: 'text-content-warning' },
  { Icon: Spa, color: 'text-content-success' },
  { Icon: Bag, color: 'text-content-highlight' },
  { Icon: Wallet, color: 'text-content-brand' },
  { Icon: CreditCard, color: 'text-content-new' },
  { Icon: Discount, color: 'text-content-critical' },
  { Icon: TrendUp, color: 'text-content-success' },
  { Icon: Flash, color: 'text-content-warning' },
  { Icon: Bookmark, color: 'text-content-highlight' },
  { Icon: Heart, color: 'text-content-critical' },
  { Icon: ThumbUp, color: 'text-content-success' },
  { Icon: Star, color: 'text-content-highlight' },
  { Icon: Location, color: 'text-content-brand' },
  { Icon: Calendar, color: 'text-content-new' },
  { Icon: Mail, color: 'text-content' },
  { Icon: Person, color: 'text-content-brand' },
  { Icon: Notifications, color: 'text-content-warning' },
  { Icon: InfoCircle, color: 'text-content-highlight' },
  { Icon: CheckCircle, color: 'text-content-success' },
  { Icon: Settings, color: 'text-content' },
  { Icon: Filter, color: 'text-content-new' },
  { Icon: Search, color: 'text-content-brand' },
]

const FAQ: ReadonlyArray<{ value: string; q: string; a: string }> = [
  {
    value: 'what',
    q: 'What is Swift?',
    a: 'A small design system — icons, components, and tokens — built for swift product surfaces. Tree-shakeable, themed, and typed end-to-end.',
  },
  {
    value: 'tokens',
    q: 'How do themes work?',
    a: 'Both light and dark resolve from the same semantic tokens (surface, content, stroke). Toggle the theme and every component re-themes itself with zero per-component logic.',
  },
  {
    value: 'a11y',
    q: 'Is everything accessible?',
    a: 'Components ship with native semantics, full keyboard support, ARIA wiring, and visible focus rings. Checkbox, Input, Chip and Accordion all delegate to real inputs / buttons.',
  },
]

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

      <div className="flex items-center gap-3">
        <Switch size="sm" defaultChecked />
        <Switch size="sm" variant="success" defaultChecked />
        <Switch size="sm" variant="warning" defaultChecked />
        <Switch size="sm" />
        <Text variant="body-xs" color="muted" className="ml-auto">
          Switch · 3 sizes · 5 variants
        </Text>
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      variant="body-xs"
      fontWeight="semibold"
      color="muted"
      className="tracking-[0.18em] uppercase"
    >
      {children}
    </Text>
  )
}

/** Splits values like "60+" into a counted number + literal suffix. */
function StatValue({ value }: { value: string }) {
  const match = /^(\d+)(.*)$/.exec(value)
  const target = match ? Number(match[1]) : 0
  const count = useCountUp(target)
  return (
    <Text variant="heading-md" fontWeight="bold" color="primary" className="tabular-nums">
      {match ? `${count}${match[2]}` : value}
    </Text>
  )
}

/** Stat layout shared by the count-up tiles (icon top, number bottom). */
function StatBody({
  icon: Icon,
  accent,
  value,
  label,
  blurb,
}: {
  icon: IconComponent
  accent: string
  value: string
  label: string
  blurb: string
}) {
  return (
    <>
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted ${accent}`}>
        <Icon size={18} />
      </span>
      <div className="mt-auto flex min-w-0 flex-col">
        <StatValue value={value} />
        <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
          {label}
        </Text>
        <Text variant="body-xs" color="secondary" className="mt-0.5">
          {blurb}
        </Text>
      </div>
    </>
  )
}

/** 1×1 stat tile that links out (Icons → /icons, Components → /components). */
function StatLinkTile({
  i,
  to,
  ...stat
}: {
  i: number
  to: '/icons' | '/components'
  icon: IconComponent
  accent: string
  value: string
  label: string
  blurb: string
}) {
  const { entranceClass, entranceStyle } = useTileEntrance(i)
  return (
    <Link
      to={to}
      className={`${entranceClass} ${TILE_CHROME} col-span-1`}
      style={entranceStyle}
    >
      <StatBody {...stat} />
    </Link>
  )
}

/* ── Principles (Overview) ──────────────────────────────────────── */

const PRINCIPLES: ReadonlyArray<{
  icon: IconComponent
  accent: string
  title: string
  blurb: string
}> = [
  {
    icon: Flash,
    accent: 'text-content-warning',
    title: 'Zero dependencies',
    blurb:
      'Every primitive — positioning engine included — is hand-rolled. React is the only thing in your bundle.',
  },
  {
    icon: Afternoon,
    accent: 'text-content-new',
    title: 'Token-driven theming',
    blurb:
      'Palettes → semantic → component tokens. Light and dark resolve from the same semantic layer.',
  },
  {
    icon: CheckCircle,
    accent: 'text-content-success',
    title: 'Accessible by default',
    blurb:
      'Keyboard navigation, ARIA wiring, focus rings, RTL, and reduced-motion support across the set.',
  },
  {
    icon: TrendUp,
    accent: 'text-content-brand',
    title: 'Tree-shakeable',
    blurb:
      'Per-component and per-icon entry points — you ship only what you import.',
  },
]

function PrincipleTile({
  i,
  icon: Icon,
  accent,
  title,
  blurb,
}: {
  i: number
  icon: IconComponent
  accent: string
  title: string
  blurb: string
}) {
  return (
    <Tile i={i} className="col-span-1 gap-2">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted ${accent}`}>
        <Icon size={18} />
      </span>
      <Text variant="body-md" fontWeight="semibold" color="primary">
        {title}
      </Text>
      <Text variant="body-xs" color="secondary">
        {blurb}
      </Text>
    </Tile>
  )
}

/* ── Installation ───────────────────────────────────────────────── */

const PM_COMMANDS = {
  pnpm: 'pnpm add @swift/components @swift/icons',
  npm: 'npm install @swift/components @swift/icons',
  yarn: 'yarn add @swift/components @swift/icons',
  bun: 'bun add @swift/components @swift/icons',
} as const

type PackageManager = keyof typeof PM_COMMANDS

const SETUP_SNIPPET = `// main.tsx — import the stylesheet once
import '@swift/components/styles.css'

// then compose anywhere
import { Button } from '@swift/components/Button'
import { Flight } from '@swift/icons/Flight'

<Button>
  <Button.LeftIcon><Flight size={16} /></Button.LeftIcon>
  Book now
</Button>`

/** Step 1 of the old two-step install card, condensed into a tile.
 *  Step 2 (the stylesheet-import snippet) lives in SetupSection below. */
function InstallTile({ i }: { i: number }) {
  const [pm, setPm] = useState<PackageManager>('pnpm')
  const [copied, setCopied] = useState(false)
  const command = PM_COMMANDS[pm]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Tile i={i} className="col-span-2 md:col-span-4 lg:col-span-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <TileHeader title="Install" desc="Two packages, one stylesheet import." />
        <SegmentedControl
          size="sm"
          value={pm}
          onValueChange={(value) => setPm(value as PackageManager)}
          aria-label="Package manager"
        >
          <SegmentedControl.Indicator />
          {(Object.keys(PM_COMMANDS) as PackageManager[]).map((manager) => (
            <SegmentedControl.Item key={manager} value={manager}>
              {manager}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl>
      </div>
      <div className="relative mt-auto">
        {/* Keyed on the manager so switching re-runs the fade. */}
        <pre
          key={pm}
          className="anim-fade-in overflow-x-auto overscroll-contain touch-pan-x rounded-lg bg-surface-inverse p-3 pr-12 text-xs leading-relaxed text-content-inverse"
        >
          <span aria-hidden className="select-none opacity-50">
            ${' '}
          </span>
          {command}
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy install command'}
          className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-content-inverse/70 transition-colors hover:bg-content-inverse/10 hover:text-content-inverse"
        >
          {copied ? (
            <Check size={14} className="anim-scale-in text-content-success" />
          ) : (
            <Text variant="body-xs" className="text-inherit">
              copy
            </Text>
          )}
        </button>
      </div>
      <Text variant="body-xs" color="muted">
        Zero runtime dependencies — React is the only peer. Dark mode is one
        attribute: <code>{'<html data-theme="dark">'}</code>.
      </Text>
    </Tile>
  )
}

/** Step 2 of the old install card: stylesheet import + compose snippet. */
function SetupSection() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <SectionLabel>Setup</SectionLabel>
        <Text variant="body-sm" color="secondary">
          Import the stylesheet, then compose — themed and tree-shakeable out
          of the box.
        </Text>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5">
        <CodeBlock code={SETUP_SNIPPET} />
        <Text variant="body-xs" color="muted">
          Components and icons are deep-importable — bundlers ship only the
          entries you touch.
        </Text>
      </div>
    </section>
  )
}

/* ── Bento tiles ────────────────────────────────────────────────── */

function ButtonsTile({ i }: { i: number }) {
  return (
    <Tile i={i} className="col-span-2 row-span-2">
      <TileHeader title="Buttons" desc="Seven variants · three sizes · loading + icon slots." />
      <div className="flex flex-col gap-1.5">
        <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
          Variants
        </Text>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">
            <Button.LeftIcon><Check size={14} /></Button.LeftIcon>
            Book now
          </Button>
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button variant="outline" size="sm">
            <Button.LeftIcon><Edit size={14} /></Button.LeftIcon>
            Edit
          </Button>
          <Button variant="ghost" size="sm">
            Skip
            <Button.RightIcon><ArrowRight size={14} /></Button.RightIcon>
          </Button>
          <Button variant="danger" size="sm">Delete</Button>
          <Button variant="link" size="sm">Read more</Button>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-1.5">
        <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
          Sizes
        </Text>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
    </Tile>
  )
}

function TripCard() {
  return (
    <Card variant="elevated" className="h-full">
      <Card.Header divider>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Card.Title>Delhi → Goa</Card.Title>
            <Card.Description>Sat, 14 Jun · Non-stop · 2h 30m</Card.Description>
          </div>
          <Badge variant="success" appearance="soft" startIcon={<Check size={12} />}>
            Confirmed
          </Badge>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-3 items-center gap-3 text-center">
          <div>
            <Text variant="heading-sm" fontWeight="semibold">06:20</Text>
            <Text variant="body-xs" color="muted" className="block">DEL · T1</Text>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Flight size={18} className="text-content-brand" />
            <div className="h-px w-full bg-stroke" />
            <Text variant="body-xs" color="muted">2h 30m</Text>
          </div>
          <div>
            <Text variant="heading-sm" fontWeight="semibold">08:50</Text>
            <Text variant="body-xs" color="muted" className="block">GOX</Text>
          </div>
        </div>
      </Card.Content>
      <Card.Footer divider muted>
        <div className="flex w-full items-center justify-between">
          <Text variant="body-sm" fontWeight="semibold" color="primary">
            ₹4,820
          </Text>
          <Button size="sm">
            View
            <Button.RightIcon><ArrowRight size={14} /></Button.RightIcon>
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}

/** Sun/moon switch wired to the real theme + the token swatch strip
 *  (absorbed from the old ThemeCardInline + the "Themes" stat). */
function ThemeTile({ i }: { i: number }) {
  const { theme, toggle } = useTheme()
  const Icon = theme === 'light' ? Afternoon : Night
  return (
    <Tile i={i} className="col-span-1">
      <div className="flex items-center justify-between gap-2">
        {/* Keyed on the theme so .theme-icon-swap replays on every flip. */}
        <span key={theme} className="theme-icon-swap text-content-new">
          <Icon size={20} />
        </span>
        <Switch
          size="sm"
          checked={theme === 'dark'}
          onCheckedChange={toggle}
          aria-label="Toggle dark mode"
        />
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex h-4 overflow-hidden rounded-md border border-stroke">
          {SWATCHES.map((bg) => (
            <div key={bg} className={`flex-1 ${bg}`} />
          ))}
        </div>
        <div className="flex flex-col">
          <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
            2 themes
          </Text>
          <Text variant="body-xs" color="secondary">
            light & dark, same tokens — current:{' '}
            <strong className="text-content-strong capitalize">{theme}</strong>
          </Text>
        </div>
      </div>
    </Tile>
  )
}

/** One-tap taste of the imperative toast() API (full playground below). */
function ToastTile({ i }: { i: number }) {
  return (
    <Tile i={i} className="col-span-1">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-content-success">
        <Notifications size={18} />
      </span>
      <div className="mt-auto flex flex-col gap-2">
        <TileHeader title="Toast" desc="Imperative toast() API." />
        <Button size="sm" variant="secondary" onClick={() => toast.success('Profile updated')}>
          Fire a toast
        </Button>
      </div>
    </Tile>
  )
}

/** Live Switches + selectable Chips (merged SwitchCard + ChipsCard). */
function SwitchChipsTile({ i }: { i: number }) {
  const [filter, setFilter] = useState<string>('flights')
  const [wifi, setWifi] = useState(true)
  const [push, setPush] = useState(false)
  const [eco, setEco] = useState(true)
  return (
    <Tile i={i} className="col-span-2">
      <TileHeader
        title="Switches & Chips"
        desc="Three sizes · five variants · selectable groups with leading icons."
      />
      <div className="flex flex-wrap gap-2">
        {TRAVEL_CHIPS.map(({ value, label, icon: Icon }) => (
          <Chip
            key={value}
            value={value}
            size="sm"
            variant="primary"
            appearance={filter === value ? 'solid' : 'soft'}
            selected={filter === value}
            onSelectedChange={() => setFilter(value)}
            startIcon={<Icon size={14} />}
            showCheckOnSelected={false}
          >
            {label}
          </Chip>
        ))}
      </div>
      <div className="mt-auto grid gap-x-4 gap-y-2 sm:grid-cols-2">
        <Switch size="sm" checked={wifi} onCheckedChange={setWifi}>
          In-flight Wi-Fi
        </Switch>
        <Switch size="sm" variant="success" checked={eco} onCheckedChange={setEco}>
          Eco fares only
        </Switch>
        <Switch size="sm" variant="info" checked={push} onCheckedChange={setPush}>
          Push notifications
        </Switch>
        <Switch size="sm" variant="warning" disabled>
          Premium add-ons
        </Switch>
      </div>
    </Tile>
  )
}

/** Deep-link into the components playground (old ComponentPlayground header). */
function PlaygroundCtaTile({ i }: { i: number }) {
  const { entranceClass, entranceStyle } = useTileEntrance(i)
  return (
    <Link
      to="/components"
      search={{ c: 'Button' }}
      className={`${entranceClass} ${TILE_CHROME} col-span-2 md:col-span-3 lg:col-span-2`}
      style={entranceStyle}
    >
      <TileHeader
        title="Try the live playground"
        desc="Every Swift component, live and themable. Click around — state is real."
      />
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-content-brand">
        Open the docs
        <ArrowRight size={14} className="group-hover-nudge" />
      </span>
    </Link>
  )
}

/** "Just shipped" — the two newest primitives, wired live (old WhatsNew). */
function WhatsNewTile({ i }: { i: number }) {
  const [alerts, setAlerts] = useState(true)
  const [savings, setSavings] = useState(false)
  return (
    <Tile i={i} className="col-span-2 row-span-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <SectionLabel>Just shipped</SectionLabel>
          <Text variant="body-xs" color="secondary">
            The two newest primitives — wired live, click between them.
          </Text>
        </div>
        <Badge variant="info" appearance="soft" startIcon={<Flash size={12} />}>
          new
        </Badge>
      </div>

      <Tabs defaultValue="tabs">
        <Tabs.List>
          <Tabs.Trigger value="tabs">Tabs</Tabs.Trigger>
          <Tabs.Trigger value="switch">Switch</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="tabs" className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Text variant="heading-sm" fontWeight="semibold" color="primary">
                Compound Tabs · automatic & manual activation.
              </Text>
              <Text variant="body-sm" color="secondary">
                Animated indicator, horizontal-swipe gestures, optional lazy mounts. Roving
                focus, arrow keys, Home/End — all wired. Yes, this tile is using it.
              </Text>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Chip size="sm" variant="default" appearance="soft" showCheckOnSelected={false}>
                  indicator
                </Chip>
                <Chip size="sm" variant="default" appearance="soft" showCheckOnSelected={false}>
                  lazyMount
                </Chip>
                <Chip size="sm" variant="default" appearance="soft" showCheckOnSelected={false}>
                  RTL
                </Chip>
                <Chip size="sm" variant="default" appearance="soft" showCheckOnSelected={false}>
                  swipeable
                </Chip>
              </div>
            </div>
            <Tabs defaultValue="overview" className="rounded-lg border border-stroke bg-surface p-3">
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
                <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value="overview" className="pt-3">
                <Text variant="body-xs" color="secondary">
                  Nested Tabs render inside their parent. State is independent.
                </Text>
              </Tabs.Content>
              <Tabs.Content value="pricing" className="pt-3">
                <Text variant="body-xs" color="secondary">
                  ₹4,820 onwards · taxes & fees included.
                </Text>
              </Tabs.Content>
              <Tabs.Content value="reviews" className="pt-3">
                <Text variant="body-xs" color="secondary">
                  4.6 ★ from 2,418 travellers.
                </Text>
              </Tabs.Content>
            </Tabs>
          </div>
        </Tabs.Content>
        <Tabs.Content value="switch" className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Text variant="heading-sm" fontWeight="semibold" color="primary">
                Switch · accessible toggle, three sizes, five variants.
              </Text>
              <Text variant="body-sm" color="secondary">
                Native <code>input[type=checkbox][role=switch]</code> under the hood — labels
                click-toggle, Space activates, form submission works. Loading state included.
              </Text>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Chip size="sm" variant="default" appearance="soft" showCheckOnSelected={false}>
                  sm · md · lg
                </Chip>
                <Chip size="sm" variant="default" appearance="soft" showCheckOnSelected={false}>
                  success / warning / info
                </Chip>
                <Chip size="sm" variant="default" appearance="soft" showCheckOnSelected={false}>
                  loading
                </Chip>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-stroke bg-surface p-3">
              <Switch
                size="sm"
                checked={alerts}
                onCheckedChange={setAlerts}
                description="Pings you when fares drop."
              >
                Price alerts
              </Switch>
              <Switch
                size="sm"
                variant="success"
                checked={savings}
                onCheckedChange={setSavings}
              >
                Auto-apply savings
              </Switch>
              <Switch size="sm" variant="warning" disabled defaultChecked>
                Sync (disabled)
              </Switch>
            </div>
          </div>
        </Tabs.Content>
      </Tabs>
    </Tile>
  )
}

const TEAM = [
  { name: 'Raj Singh', src: 'https://i.pravatar.cc/120?img=11' },
  { name: 'Jane Doe', src: 'https://i.pravatar.cc/120?img=23' },
  { name: 'Aman Mehta', src: 'https://i.pravatar.cc/120?img=33' },
  { name: 'Priya Sharma', src: 'https://i.pravatar.cc/120?img=44' },
  { name: 'Lee Park', src: 'https://i.pravatar.cc/120?img=55' },
  { name: 'Sara Khan', src: 'https://i.pravatar.cc/120?img=66' },
] as const

function AvatarsTile({ i }: { i: number }) {
  return (
    <Tile i={i} className="col-span-2">
      <TileHeader title="Avatars" desc="5 sizes · 3 shapes · status badge · group with overflow." />
      <div className="flex flex-wrap items-center gap-3">
        <Avatar size="sm" src="https://i.pravatar.cc/120?img=11" name="Raj Singh" />
        <Avatar size="md" src="https://i.pravatar.cc/120?img=23" name="Jane Doe" />
        <Avatar size="lg" src="https://i.pravatar.cc/120?img=33" name="Aman Mehta">
          <Avatar.Badge status="online" />
        </Avatar>
        <Avatar size="lg" name="Priya Sharma" />
        <Avatar size="lg" />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3">
        <Text variant="body-xs" color="muted" className="tracking-wide uppercase">
          Team
        </Text>
        <AvatarGroup max={3} aria-label="Engineering team">
          {TEAM.map((p) => (
            <Avatar key={p.name} src={p.src} name={p.name} />
          ))}
        </AvatarGroup>
      </div>
    </Tile>
  )
}

function BadgesTile({ i }: { i: number }) {
  return (
    <Tile i={i} className="col-span-2">
      <TileHeader title="Badges" desc="Status pills · counts · soft & solid appearance." />
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Badge variant="success" appearance="soft" startIcon={<Check size={12} />}>Confirmed</Badge>
        <Badge variant="warning" appearance="soft" startIcon={<Flash size={12} />}>Limited</Badge>
        <Badge variant="error" appearance="soft">Sold out</Badge>
        <Badge variant="info" appearance="soft" startIcon={<InfoCircle size={12} />}>New</Badge>
        <Badge variant="default" appearance="outline">Beta</Badge>
        <Badge variant="error" count={12} />
        <Badge status="online" />
        <Badge status="away" />
        <Badge status="busy" />
      </div>
    </Tile>
  )
}

function TabsTile({ i }: { i: number }) {
  return (
    <Tile i={i} className="col-span-2">
      <TileHeader title="Tabs" desc="Animated indicator · roving focus · swipeable." />
      <Tabs defaultValue="onward">
        <Tabs.List>
          <Tabs.Trigger value="onward">Onward</Tabs.Trigger>
          <Tabs.Trigger value="return">Return</Tabs.Trigger>
          <Tabs.Trigger value="multi">Multi-city</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="onward" className="pt-3">
          <Text variant="body-sm" color="secondary">
            DEL → GOX · Sat, 14 Jun · from <strong className="text-content-strong">₹4,820</strong>
          </Text>
        </Tabs.Content>
        <Tabs.Content value="return" className="pt-3">
          <Text variant="body-sm" color="secondary">
            Add a return to see round-trip fares.
          </Text>
        </Tabs.Content>
        <Tabs.Content value="multi" className="pt-3">
          <Text variant="body-sm" color="secondary">
            Stitch up to six legs into a single itinerary.
          </Text>
        </Tabs.Content>
      </Tabs>
    </Tile>
  )
}

function FormTile({ i }: { i: number }) {
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(true)
  const [notify, setNotify] = useState(false)
  return (
    <Tile i={i} className="col-span-2 lg:col-span-3">
      <TileHeader title="Inputs & checkboxes" desc="Floating labels, helper text, group state." />
      <Input
        size="sm"
        label="Email"
        placeholder="you@swift.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startAdornment={<Mail size={14} />}
        helperText="We'll only mail you about deals."
      />
      <div className="flex flex-col gap-2">
        <Checkbox
          size="sm"
          checked={agree}
          onCheckedChange={(next) => setAgree(next === true)}
        >
          I accept the terms
        </Checkbox>
        <Checkbox
          size="sm"
          checked={notify}
          onCheckedChange={(next) => setNotify(next === true)}
        >
          Email me about price drops
        </Checkbox>
      </div>
    </Tile>
  )
}

function TypographyTile({ i }: { i: number }) {
  return (
    <Tile i={i} className="col-span-2 md:col-span-4 lg:col-span-3">
      <TileHeader title="Typography" desc="Headings, paragraphs, body sizes — one Text component." />
      <div className="mt-auto flex flex-col gap-2">
        <Text variant="heading-lg" fontWeight="bold">Built for travel.</Text>
        <Text variant="para-md" color="secondary">
          Type scale tuned for dense product surfaces. Mix headings, body, and mono in one place.
        </Text>
        <Text variant="body-sm" fontFamily="mono" color="muted">
          tokens → tailwind → components
        </Text>
      </div>
    </Tile>
  )
}

/** Input + Chip group working together (old SearchCard). */
function SearchTile({ i }: { i: number }) {
  const [q, setQ] = useState('')
  return (
    <Tile i={i} className="col-span-2">
      <TileHeader title="Where next?" desc="Input + Chip group, working together." />
      <Input
        size="sm"
        placeholder="Goa, Manali, Pondicherry…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        startAdornment={<Search size={14} />}
      />
      <div className="mt-auto flex flex-wrap gap-1.5">
        {['Goa', 'Manali', 'Pondicherry', 'Jaipur', 'Coorg'].map((city) => (
          <Chip
            key={city}
            size="sm"
            variant="default"
            appearance="soft"
            startIcon={<Location size={12} />}
            showCheckOnSelected={false}
            onSelectedChange={() => setQ(city)}
          >
            {city}
          </Chip>
        ))}
      </div>
    </Tile>
  )
}

/* ── Toast playground (full API drive-through, below the grid) ────── */

const TOAST_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

function ToastPlayground() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <SectionLabel>Toast playground</SectionLabel>
          <Text variant="body-sm" color="secondary">
            Drives the imperative <code>toast()</code> API — variants, positions, queue, action, persistent.
          </Text>
        </div>
        <Badge variant="info" appearance="soft" startIcon={<Flash size={12} />}>
          new
        </Badge>
      </div>

      <Card variant="outlined">
        <Card.Content>
          <div className="flex flex-col gap-5">
            {/* Variants */}
            <div className="flex flex-col gap-2">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                Variants
              </Text>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => toast('Saved')}>
                  Default
                </Button>
                <Button size="sm" onClick={() => toast.success('Profile updated')}>
                  Success
                </Button>
                <Button size="sm" variant="danger" onClick={() => toast.error('Payment failed')}>
                  Error
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toast.warning('Storage almost full')}>
                  Warning
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.info('New version available')}>
                  Info
                </Button>
              </div>
            </div>

            {/* Positions */}
            <div className="flex flex-col gap-2">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                Positions
              </Text>
              <div className="flex flex-wrap gap-2">
                {TOAST_POSITIONS.map((pos) => (
                  <Button
                    key={pos}
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toast.info(`Position: ${pos}`, {
                        description: 'Fired from the position button row.',
                        position: pos,
                      })
                    }
                  >
                    {pos}
                  </Button>
                ))}
              </div>
            </div>

            {/* Edge cases */}
            <div className="flex flex-col gap-2">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                Edge cases
              </Text>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    toast.success('File uploaded', {
                      description: 'shared-photos.zip · 24.6 MB',
                      action: { label: 'Undo', onClick: () => toast('Undone') },
                    })
                  }
                >
                  With description + action
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    toast.warning('Persistent — dismiss manually', {
                      description: 'duration: Infinity',
                      duration: Infinity,
                    })
                  }
                >
                  Persistent
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    toast.info('Queued #1')
                    toast.success('Queued #2')
                    toast.warning('Queued #3')
                    toast.error('Queued #4 — waits in queue')
                    toast('Queued #5 — waits in queue')
                  }}
                >
                  Stack 5 (3 visible, 2 queued)
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast.dismiss()}>
                  Dismiss all
                </Button>
              </div>
              <Text variant="body-xs" color="muted">
                Tip: hover any toast to pause its auto-dismiss timer.
              </Text>
            </div>
          </div>
        </Card.Content>
      </Card>
    </section>
  )
}

/* ── Icon marquee ───────────────────────────────────────────────── */

function IconTile({ Icon, color }: { Icon: IconComponent; color: string }) {
  return (
    <div
      className="group flex size-12 shrink-0 items-center justify-center rounded-xl border border-stroke bg-surface-elevated transition-colors hover:border-stroke-brand hover:bg-surface-muted"
      title={Icon.name}
    >
      <Icon size={18} className={`${color} transition-transform group-hover:scale-110`} />
    </div>
  )
}

/** One marquee lane. motion.css loops the track with a -50% translate, so
 *  each half must (a) be identical and (b) outgrow the container — the
 *  15-tile row renders four times (2 per half; duplicates aria-hidden).
 *  Trailing `pr-2` mirrors the inter-tile gap across the seam; hover
 *  pauses the lane. */
function MarqueeRow({
  icons,
  duration,
  reverse = false,
}: {
  icons: ReadonlyArray<{ Icon: IconComponent; color: string }>
  duration: string
  reverse?: boolean
}) {
  const row = (hidden: boolean) => (
    <div className="flex gap-2 pr-2" aria-hidden={hidden || undefined}>
      {icons.map((tile, i) => (
        <IconTile key={i} {...tile} />
      ))}
    </div>
  )
  return (
    <div
      className={`marquee ${reverse ? 'marquee-reverse' : ''}`}
      style={{ '--marquee-duration': duration } as CSSProperties}
    >
      <div className="marquee-track">
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  )
}

/** Full-width marquee band (old IconWall, tile-ified). */
function MarqueeTile({ i }: { i: number }) {
  const mid = Math.ceil(ICON_WALL.length / 2)
  return (
    <Tile i={i} className="col-span-2 md:col-span-4 lg:col-span-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <SectionLabel>310 icons · ready to grab</SectionLabel>
          <Text variant="body-sm" color="secondary">
            Travel, transport, amenities, finance — sized 14 → 24 px out of the box.
          </Text>
        </div>
        <Link
          to="/icons"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-content-brand hover:underline"
        >
          Browse all
          <ArrowRight size={14} className="group-hover-nudge" />
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <MarqueeRow icons={ICON_WALL.slice(0, mid)} duration="44s" />
        <MarqueeRow icons={ICON_WALL.slice(mid)} duration="56s" reverse />
      </div>
    </Tile>
  )
}

/* ── Route ──────────────────────────────────────────────────────── */

/* ── Footer ─────────────────────────────────────────────────────── */

function FooterLink({
  to,
  search,
  children,
}: {
  to: '/icons' | '/components' | '/foundations'
  search?: { c: string }
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      search={search}
      className="text-sm text-content transition-colors hover:text-content-brand"
    >
      {children}
    </Link>
  )
}

function HomeFooter() {
  return (
    <footer className="border-t border-stroke bg-surface-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-8 py-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex max-w-xs flex-col gap-2">
            <Text variant="body-lg" fontWeight="bold">
              <span className="brand-gradient-text">Swift</span>
            </Text>
            <Text variant="body-sm" color="secondary">
              Icons, components, and tokens for swift product surfaces —
              typed, themed, zero dependencies.
            </Text>
          </div>

          <nav aria-label="Footer" className="flex gap-12 sm:gap-16">
            <div className="flex flex-col gap-2">
              <Text
                variant="body-xs"
                fontWeight="semibold"
                color="muted"
                className="tracking-wide uppercase"
              >
                Explore
              </Text>
              <FooterLink to="/icons">Icons</FooterLink>
              <FooterLink to="/components">Components</FooterLink>
              <FooterLink to="/foundations">Foundations</FooterLink>
            </div>
            <div className="flex flex-col gap-2">
              <Text
                variant="body-xs"
                fontWeight="semibold"
                color="muted"
                className="tracking-wide uppercase"
              >
                Try it
              </Text>
              <FooterLink to="/components" search={{ c: 'Button' }}>
                Live playground
              </FooterLink>
              <FooterLink to="/components" search={{ c: 'Toast' }}>
                Toast demos
              </FooterLink>
              <FooterLink to="/foundations">Design tokens</FooterLink>
            </div>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke pt-5">
          <Text variant="body-xs" color="muted">
            © {new Date().getFullYear()} Swift Design System
          </Text>
          <Text
            variant="body-xs"
            color="muted"
            className="inline-flex items-center gap-1.5"
          >
            Designed &amp; developed with
            <Heart
              size={12}
              title="love"
              className="footer-heart text-content-critical"
            />
            by the Swift team
          </Text>
        </div>
      </div>
    </footer>
  )
}

function HomeRoute() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-full w-full overflow-y-auto bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-8 py-10">
        {/* Compact hero — aurora backdrop + staggered entrance. */}
        <header className="relative isolate flex flex-col items-center gap-3 overflow-hidden rounded-3xl px-6 py-10 text-center">
          <div aria-hidden="true" className="hero-aurora aurora pointer-events-none absolute inset-0 -z-10" />
          <div className="anim-fade-up" style={stagger(0)}>
            <Badge variant="info" appearance="soft" startIcon={<Flash size={12} />}>
              Swift Design System
            </Badge>
          </div>
          <div className="anim-fade-up" style={stagger(1)}>
            <Text variant="heading-xl" fontWeight="bold">
              Icons, components, and tokens — all in one place.
            </Text>
          </div>
          <div className="anim-fade-up" style={stagger(2)}>
            <Text variant="para-md" color="secondary" className="mx-auto max-w-2xl">
              A small, themed set of building blocks — browse the icon library, explore
              components, or inspect the tokens that power them.
            </Text>
          </div>
          <div className="anim-fade-up mt-2 flex flex-wrap items-center justify-center gap-2" style={stagger(3)}>
            <Button as={Link} to="/components">
              <Button.LeftIcon><Settings size={14} /></Button.LeftIcon>
              Explore components
            </Button>
            <Button as={Link} to="/icons" variant="secondary">
              <Button.LeftIcon><Star size={14} /></Button.LeftIcon>
              Browse icons
            </Button>
            <Button as={Link} to="/foundations" variant="ghost">
              <Button.LeftIcon><GridSmallFilled size={14} /></Button.LeftIcon>
              Foundations
            </Button>
          </div>
        </header>

        {/* ── The bento grid ──────────────────────────────────────────
            Bands stack with the same gap-3 as the grid itself so the
            whole thing reads as one bento. Column math per band at
            lg (6 cols) / md (4) / mobile (2):

            Band A  lg row 1: Buttons(2×2) Trip(2×2) Theme(1) Icons(1)   = 6
                    lg row 2: …Buttons…    …Trip…    Comp(1)  Toast(1)   = 6
                    md: Buttons(2×2)+Trip(2×2) fill rows 1–2, four 1×1s
                        fill row 3; mobile: 2-wide tiles stack, 1×1s pair.
            Band B  lg: Install(3) Playground CTA(2) Variants(1)         = 6
                    md: Install(4) / CTA(3)+Variants(1); mobile: stack.
            Band C  lg row 1: WhatsNew(2×2) P1(1) P2(1) Switch+Chips(2)  = 6
                    lg row 2: …WhatsNew…   P3(1) P4(1) Search(2)         = 6
                    md: WhatsNew(2×2)+P1+P2 / Switch+Chips(2) / P3+P4+
                        Search(2); mobile: principles pair up, rest stack.
            Band D  lg: Marquee(6); md: (4); mobile: (2) — full width.
            Band E  lg row 1: Avatars(2) Badges(2) Tabs(2)               = 6
                    lg row 2: Form(3) Typography(3)                      = 6
                    md: 2+2 / 2+2 / Typography(4); mobile: stack.      */}
        <section className="flex flex-col gap-4">
          <div className="anim-fade-up flex flex-col" style={stagger(4)}>
            <SectionLabel>Overview</SectionLabel>
            <Text variant="body-sm" color="secondary">
              Two packages — <code>@swift/components</code> and{' '}
              <code>@swift/icons</code> — built on one token layer.
            </Text>
          </div>

          <div className="flex flex-col gap-3">
            {/* Band A — hero demos + stat tiles. */}
            <BentoBand>
              <ButtonsTile i={0} />
              <Tile i={1} bare className="col-span-2 row-span-2">
                <TripCard />
              </Tile>
              <ThemeTile i={2} />
              <StatLinkTile
                i={3}
                to="/icons"
                icon={Star}
                accent="text-content-highlight"
                value="310"
                label="Icons"
                blurb="tree-shakeable SVGs"
              />
              <StatLinkTile
                i={4}
                to="/components"
                icon={Settings}
                accent="text-content-brand"
                value="23"
                label="Components"
                blurb="typed & themable"
              />
              <ToastTile i={5} />
            </BentoBand>

            {/* Band B — get started + jump in. */}
            <BentoBand>
              <InstallTile i={0} />
              <PlaygroundCtaTile i={1} />
              <Tile i={2} className="col-span-2 md:col-span-1">
                <StatBody
                  icon={Tag}
                  accent="text-content-success"
                  value="60+"
                  label="Variants"
                  blurb="across the system"
                />
              </Tile>
            </BentoBand>

            {/* Band C — just shipped + principles + live controls. */}
            <BentoBand>
              <WhatsNewTile i={0} />
              <PrincipleTile i={1} {...PRINCIPLES[0]} />
              <PrincipleTile i={2} {...PRINCIPLES[1]} />
              <SwitchChipsTile i={3} />
              <PrincipleTile i={4} {...PRINCIPLES[2]} />
              <PrincipleTile i={5} {...PRINCIPLES[3]} />
              <SearchTile i={6} />
            </BentoBand>

            {/* Band D — icon marquee, full width. */}
            <BentoBand>
              <MarqueeTile i={0} />
            </BentoBand>

            {/* Band E — more to explore. */}
            <BentoBand>
              <AvatarsTile i={0} />
              <BadgesTile i={1} />
              <TabsTile i={2} />
              <FormTile i={3} />
              <TypographyTile i={4} />
            </BentoBand>
          </div>
        </section>

        <Reveal>
          <SetupSection />
        </Reveal>

        <Reveal>
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col">
                <SectionLabel>Theme preview</SectionLabel>
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
        </Reveal>

        <Reveal>
          <ToastPlayground />
        </Reveal>

        <Reveal>
          <section className="flex flex-col gap-4">
            <div className="flex flex-col">
              <SectionLabel>FAQ</SectionLabel>
              <Text variant="body-sm" color="secondary">
                Accordion · single · collapsible.
              </Text>
            </div>
            <div className="rounded-xl border border-stroke bg-surface-elevated px-5 py-2">
              <Accordion type="single" collapsible defaultValue="what">
                {FAQ.map(({ value, q, a }) => (
                  <Accordion.Item key={value} value={value}>
                    <Accordion.Header>
                      <Accordion.Trigger>
                        <span className="text-left text-sm font-medium text-content-strong">{q}</span>
                        <ExpandMore
                          size={16}
                          className="text-content-muted transition-transform group-data-[state=open]/accordion-item:rotate-180"
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>
                      <Text variant="body-sm" color="secondary">
                        {a}
                      </Text>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="grid gap-3 sm:grid-cols-3">
            {SECTIONS.map(({ to, label, icon: Icon, accent, blurb }) => (
              <Link
                key={to}
                to={to}
                className="group hover-lift flex flex-col gap-2 rounded-xl border border-stroke bg-surface-elevated p-5 hover:border-stroke-brand"
              >
                <div className="flex items-center gap-2">
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-200 group-hover:scale-105 ${accent}`}>
                    <Icon size={18} />
                  </span>
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
                  <ArrowRight size={12} className="group-hover-nudge" />
                </Text>
              </Link>
            ))}
          </section>
        </Reveal>
      </div>

      <Reveal>
        <HomeFooter />
      </Reveal>
    </div>
  )
}
