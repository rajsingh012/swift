import {
  useEffect,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Avatar } from '@swift/components/Avatar'
import { Badge } from '@swift/components/Badge'
import { Button } from '@swift/components/Button'
import { Card } from '@swift/components/Card'
import { Chip } from '@swift/components/Chip'
import { Input } from '@swift/components/Input'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Slider } from '@swift/components/Slider'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { Afternoon } from '@swift/icons/Afternoon'
import { ArrowRight } from '@swift/icons/ArrowRight'
import { Bus } from '@swift/icons/Bus'
import { Check } from '@swift/icons/Check'
import { CheckCircle } from '@swift/icons/CheckCircle'
import { ExpandMore } from '@swift/icons/ExpandMore'
import { Flash } from '@swift/icons/Flash'
import { Flight } from '@swift/icons/Flight'
import { GridSmall } from '@swift/icons/GridSmall'
import { GridSmallFilled } from '@swift/icons/GridSmallFilled'
import { Heart } from '@swift/icons/Heart'
import { Hotel } from '@swift/icons/Hotel'
import { Night } from '@swift/icons/Night'
import { Person } from '@swift/icons/Person'
import { Settings } from '@swift/icons/Settings'
import { Star } from '@swift/icons/Star'
import { Train } from '@swift/icons/Train'
import { TrendUp } from '@swift/icons/TrendUp'
import { CodeBlock } from '../Components/shared'
import { useTheme } from '../lib/Theme'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

type IconComponent = ComponentType<{ size?: number; className?: string }>
type SectionPath = '/icons' | '/components' | '/foundations' | '/css'

/** Inline custom property consumed by motion.css stagger. */
const stagger = (i: number): CSSProperties => ({ '--stagger-i': i }) as CSSProperties

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** rAF count-up from 0 → target on mount. Renders the target immediately
 *  for reduced-motion users (set in the initializer, so the effect never
 *  calls setState synchronously). */
function useCountUp(target: number, durationMs = 1000): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])
  return value
}

/* ── Data ───────────────────────────────────────────────────────────── */

const SECTIONS: ReadonlyArray<{
  to: SectionPath
  label: string
  icon: IconComponent
  accent: string
  meta: string
  blurb: string
}> = [
  {
    to: '/components',
    label: 'Components',
    icon: Settings,
    accent: 'text-content-brand',
    meta: '24 components',
    blurb: 'Buttons, inputs, overlays — typed, themed, and composable.',
  },
  {
    to: '/icons',
    label: 'Icons',
    icon: Star,
    accent: 'text-content-highlight',
    meta: '310 icons',
    blurb: 'A tree-shakeable SVG set with sizing, colour, and search.',
  },
  {
    to: '/css',
    label: 'CSS',
    icon: GridSmall,
    accent: 'text-content-success',
    meta: '39 lessons',
    blurb: 'Interactive playgrounds for the CSS that powers the system.',
  },
  {
    to: '/foundations',
    label: 'Foundations',
    icon: GridSmallFilled,
    accent: 'text-content-new',
    meta: 'tokens',
    blurb: 'Palettes, semantic tokens, radius, and shadow scales.',
  },
]

const STATS: ReadonlyArray<{ icon: IconComponent; value: number; suffix: string; label: string; accent: string }> = [
  { icon: Settings, value: 24, suffix: '', label: 'Components', accent: 'text-content-brand' },
  { icon: Star, value: 310, suffix: '', label: 'Icons', accent: 'text-content-highlight' },
  { icon: GridSmall, value: 39, suffix: '', label: 'CSS lessons', accent: 'text-content-success' },
  { icon: Afternoon, value: 2, suffix: '', label: 'Themes', accent: 'text-content-new' },
]

const PRINCIPLES: ReadonlyArray<{ icon: IconComponent; accent: string; title: string; blurb: string }> = [
  { icon: Flash, accent: 'text-content-warning', title: 'Zero dependencies', blurb: 'Every primitive is hand-rolled. React is the only thing in your bundle.' },
  { icon: Afternoon, accent: 'text-content-new', title: 'Token-driven theming', blurb: 'Light and dark resolve from one semantic token layer — no per-component logic.' },
  { icon: CheckCircle, accent: 'text-content-success', title: 'Accessible by default', blurb: 'Keyboard nav, ARIA wiring, focus rings, RTL, and reduced-motion support.' },
  { icon: TrendUp, accent: 'text-content-brand', title: 'Tree-shakeable', blurb: 'Per-component and per-icon entry points — you ship only what you import.' },
]

const INTERESTS: ReadonlyArray<{ value: string; label: string; icon: IconComponent }> = [
  { value: 'flights', label: 'Flights', icon: Flight },
  { value: 'hotels', label: 'Hotels', icon: Hotel },
  { value: 'trains', label: 'Trains', icon: Train },
  { value: 'cabs', label: 'Cabs', icon: Bus },
]

const SETUP_SNIPPET = `pnpm add @swift/components @swift/icons

// main.tsx — import the stylesheet once
import '@swift/components/styles.css'

// then compose anywhere
import { Button } from '@swift/components/Button'
import { Flight } from '@swift/icons/Flight'

<Button>
  <Button.LeftIcon><Flight size={16} /></Button.LeftIcon>
  Book now
</Button>`

/* ── Small shared bits ──────────────────────────────────────────────── */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-[0.18em] uppercase">
      {children}
    </Text>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
      {children}
    </Text>
  )
}

/* ── Live preview: a real composed mini-app that re-themes on the spot ── */

function PreviewApp() {
  const [name, setName] = useState('Raj Singh')
  const [theme, setTheme] = useState('system')
  const [interests, setInterests] = useState<ReadonlyArray<string>>(['flights', 'hotels'])
  const [alerts, setAlerts] = useState(true)
  const [budget, setBudget] = useState(45)
  // Drives the real app theme. Light tokens live at :root (not under a
  // [data-theme="light"] block), so a nested data-theme scope can't reset
  // them inside a dark page — toggling the global theme is what actually
  // re-themes the live components.
  const { theme: appTheme, setTheme: setAppTheme } = useTheme()

  const toggleInterest = (v: string) =>
    setInterests((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))

  return (
    <div className="overflow-hidden rounded-2xl border border-stroke bg-surface-elevated text-content shadow-level3">
      {/* Faux browser chrome with a light/dark toggle */}
      <div className="flex items-center gap-1.5 border-b border-stroke bg-surface-muted px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-surface-critical" />
        <span className="size-2.5 rounded-full bg-surface-warning" />
        <span className="size-2.5 rounded-full bg-surface-success" />
        <span className="ml-2 truncate text-xs text-content-muted">swift.app/settings</span>
        <div className="ml-auto flex items-center gap-0.5 rounded-lg bg-surface p-0.5">
          {(['light', 'dark'] as const).map((t) => {
            const Icon = t === 'light' ? Afternoon : Night
            const active = appTheme === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setAppTheme(t)}
                aria-label={`${t} theme`}
                aria-pressed={active}
                className={`flex size-6 cursor-pointer items-center justify-center rounded-md transition-colors ${
                  active ? 'bg-surface-brand-muted text-content-brand' : 'text-content-muted hover:text-content'
                }`}
              >
                <Icon size={13} />
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4">
        <Card variant="outlined">
          <Card.Header divider>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar size="md" src="https://i.pravatar.cc/120?img=11" name={name} />
                <div className="min-w-0">
                  <Card.Title>Travel preferences</Card.Title>
                  <Card.Description className="truncate">{name}</Card.Description>
                </div>
              </div>
              <Badge variant="info" appearance="soft" startIcon={<Star size={12} />}>
                Pro
              </Badge>
            </div>
          </Card.Header>

          <Card.Content>
            <div className="flex flex-col gap-4">
              <Input
                size="sm"
                label="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                startAdornment={<Person size={14} />}
              />

              <div className="flex flex-col gap-1.5">
                <FieldLabel>Theme</FieldLabel>
                <SegmentedControl size="sm" fullWidth value={theme} onValueChange={setTheme} aria-label="Theme">
                  <SegmentedControl.Indicator />
                  <SegmentedControl.Item value="system">System</SegmentedControl.Item>
                  <SegmentedControl.Item value="light">Light</SegmentedControl.Item>
                  <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
                </SegmentedControl>
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel>Travel interests</FieldLabel>
                <div className="flex flex-wrap gap-1.5">
                  {INTERESTS.map(({ value, label, icon: Icon }) => {
                    const selected = interests.includes(value)
                    return (
                      <Chip
                        key={value}
                        value={value}
                        size="sm"
                        variant="primary"
                        appearance={selected ? 'solid' : 'soft'}
                        selected={selected}
                        onSelectedChange={() => toggleInterest(value)}
                        startIcon={<Icon size={14} />}
                        showCheckOnSelected={false}
                      >
                        {label}
                      </Chip>
                    )
                  })}
                </div>
              </div>

              <Switch size="sm" checked={alerts} onCheckedChange={setAlerts} description="Ping me when fares drop.">
                Price alerts
              </Switch>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <FieldLabel>Max budget</FieldLabel>
                  <Text variant="body-xs" fontFamily="mono" color="primary">₹{budget}k</Text>
                </div>
                <Slider value={[budget]} min={10} max={100} step={5} onValueChange={([v]) => setBudget(v)} aria-label="Max budget" />
              </div>
            </div>
          </Card.Content>

          <Card.Footer divider muted>
            <div className="flex w-full items-center justify-end gap-2">
              <Button size="sm" variant="ghost">Reset</Button>
              <Button size="sm">
                <Button.LeftIcon><Check size={14} /></Button.LeftIcon>
                Save changes
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </div>
  )
}

/* ── Sections ───────────────────────────────────────────────────────── */

function StatItem({ icon: Icon, value, suffix, label, accent }: {
  icon: IconComponent; value: number; suffix: string; label: string; accent: string
}) {
  const n = useCountUp(value)
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted ${accent}`}>
        <Icon size={18} />
      </span>
      <div className="flex flex-col">
        <Text variant="heading-sm" fontWeight="bold" color="primary" className="tabular-nums">
          {n}{suffix}
        </Text>
        <Text variant="body-xs" color="muted" className="tracking-wide uppercase">
          {label}
        </Text>
      </div>
    </div>
  )
}

function SectionCard({ i, to, label, icon: Icon, accent, meta, blurb }: {
  i: number; to: SectionPath; label: string; icon: IconComponent; accent: string; meta: string; blurb: string
}) {
  return (
    <Link
      to={to}
      className="group hover-lift anim-fade-up flex flex-col gap-3 rounded-2xl border border-stroke bg-surface-elevated p-5 hover:border-stroke-brand"
      style={stagger(i)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted transition-transform duration-200 group-hover:scale-105 ${accent}`}>
          <Icon size={20} />
        </span>
        <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">{meta}</Text>
      </div>
      <Text variant="body-lg" fontWeight="semibold" color="primary">{label}</Text>
      <Text variant="body-sm" color="secondary">{blurb}</Text>
      <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-semibold text-content-brand">
        Open
        <ArrowRight size={14} className="group-hover-nudge" />
      </span>
    </Link>
  )
}

function HomeFooter() {
  return (
    <footer className="border-t border-stroke bg-surface-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-8 py-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex max-w-xs flex-col gap-2">
            <Text variant="body-lg" fontWeight="bold">
              <span className="brand-gradient-text">Swift</span>
            </Text>
            <Text variant="body-sm" color="secondary">
              Icons, components, tokens, and CSS lessons — typed, themed, zero dependencies.
            </Text>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">Explore</Text>
            {SECTIONS.map(({ to, label }) => (
              <Link key={to} to={to} className="text-sm text-content transition-colors hover:text-content-brand">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke pt-5">
          <Text variant="body-xs" color="muted">© {new Date().getFullYear()} Swift Design System</Text>
          <Text variant="body-xs" color="muted" className="inline-flex items-center gap-1.5">
            Designed &amp; developed with
            <Heart size={12} title="love" className="text-content-critical" />
            by the Swift team
          </Text>
        </div>
      </div>
    </footer>
  )
}

/** Full-width band with an inner max-width container. `tone` alternates
 *  the background so the page reads as stacked full-bleed sections. */
function Band({
  tone = 'surface',
  children,
}: {
  tone?: 'surface' | 'muted'
  children: ReactNode
}) {
  return (
    <section className={tone === 'muted' ? 'w-full bg-surface-muted' : 'w-full bg-surface'}>
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:py-20">{children}</div>
    </section>
  )
}

function HomeRoute() {
  return (
    <div className="h-full w-full overflow-y-auto bg-surface">
      {/* ── Hero — full screen, edge-to-edge ─────────────────────────── */}
      <section className="relative isolate flex min-h-full items-center overflow-hidden">
        <div aria-hidden className="hero-aurora aurora pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2">
          {/* Pitch */}
          <div className="flex flex-col items-start gap-5 text-left">
            <div className="anim-fade-up" style={stagger(0)}>
              <Badge variant="info" appearance="soft" startIcon={<Flash size={12} />}>
                Swift Design System
              </Badge>
            </div>
            <Text variant="heading-xl" fontWeight="bold" className="anim-fade-up" style={stagger(1)}>
              Build product UIs,{' '}
              <span className="brand-gradient-text">swiftly</span>.
            </Text>
            <Text variant="para-lg" color="secondary" className="anim-fade-up max-w-md" style={stagger(2)}>
              Icons, components, and tokens — typed, themed, and tree-shakeable. The preview
              beside this is live; flip it light/dark to watch the tokens re-theme.
            </Text>
            <div className="anim-fade-up flex flex-wrap items-center gap-2" style={stagger(3)}>
              <Button as={Link} to="/components" size="lg">
                <Button.LeftIcon><Settings size={16} /></Button.LeftIcon>
                Explore components
              </Button>
              <Button as={Link} to="/icons" variant="secondary" size="lg">
                <Button.LeftIcon><Star size={16} /></Button.LeftIcon>
                Browse icons
              </Button>
              <Button as={Link} to="/css" variant="ghost" size="lg">
                <Button.LeftIcon><GridSmall size={16} /></Button.LeftIcon>
                CSS lessons
              </Button>
            </div>
            <div className="anim-fade-up flex flex-wrap gap-1.5 pt-1" style={stagger(4)}>
              {['Zero dependencies', 'Light & dark', 'Typed end-to-end'].map((t) => (
                <span key={t} className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-content-secondary">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div className="anim-fade-up w-full max-w-sm justify-self-center lg:justify-self-end" style={stagger(2)}>
            <PreviewApp />
          </div>
        </div>

        {/* Scroll cue */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex">
          <span className="flex flex-col items-center gap-1 text-content-muted">
            <Text variant="body-xs" color="muted" className="tracking-wide uppercase">Scroll</Text>
            <ExpandMore size={18} className="animate-bounce" />
          </span>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <Band tone="muted">
        <div className="grid grid-cols-2 divide-y divide-stroke overflow-hidden rounded-2xl border border-stroke bg-surface-elevated sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </Band>

      {/* ── Why Swift ──────────────────────────────────────────────── */}
      <Band>
        <div className="mb-8 flex flex-col items-center gap-1 text-center">
          <SectionLabel>Why Swift</SectionLabel>
          <Text variant="heading-md" fontWeight="bold">Built to ship fast and stay consistent.</Text>
          <Text variant="para-md" color="secondary" className="max-w-xl">
            One token layer, accessible out of the box, and nothing you don&rsquo;t import.
          </Text>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map(({ icon: Icon, accent, title, blurb }, i) => (
            <div key={title} className="anim-fade-up flex flex-col gap-2 rounded-2xl border border-stroke bg-surface-elevated p-5" style={stagger(i)}>
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted ${accent}`}>
                <Icon size={18} />
              </span>
              <Text variant="body-md" fontWeight="semibold" color="primary">{title}</Text>
              <Text variant="body-xs" color="secondary">{blurb}</Text>
            </div>
          ))}
        </div>
      </Band>

      {/* ── Explore (tabs) ─────────────────────────────────────────── */}
      <Band tone="muted">
        <div className="mb-8 flex flex-col items-center gap-1 text-center">
          <SectionLabel>Explore</SectionLabel>
          <Text variant="heading-md" fontWeight="bold">Everything in its own tab.</Text>
          <Text variant="para-md" color="secondary" className="max-w-xl">
            Pick a destination — components, icons, the CSS lessons, or the design tokens.
          </Text>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s, i) => (
            <SectionCard key={s.to} i={i} {...s} />
          ))}
        </div>
      </Band>

      {/* ── Get started ────────────────────────────────────────────── */}
      <Band>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <SectionLabel>Get started</SectionLabel>
            <Text variant="heading-md" fontWeight="bold">Two packages, one import.</Text>
            <Text variant="para-md" color="secondary" className="max-w-md">
              Add the packages, import the stylesheet once, and compose — themed and
              tree-shakeable out of the box. Zero runtime dependencies; React is the only peer.
            </Text>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button as={Link} to="/components">
                Open the docs
                <Button.RightIcon><ArrowRight size={14} /></Button.RightIcon>
              </Button>
              <Button as={Link} to="/foundations" variant="secondary">Design tokens</Button>
            </div>
          </div>
          <div className="rounded-2xl border border-stroke bg-surface-elevated p-5 shadow-level1">
            <CodeBlock code={SETUP_SNIPPET} />
          </div>
        </div>
      </Band>

      <HomeFooter />
    </div>
  )
}
