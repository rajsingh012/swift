import {
  useEffect,
  useState,
  type ComponentType,
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
import { Reveal } from '../lib/Reveal'
import { useTheme } from '../lib/Theme'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

type IconComponent = ComponentType<{ size?: number; className?: string }>
type SectionPath = '/icons' | '/components' | '/foundations' | '/css'

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** rAF count-up from 0 → target on mount. Renders the target immediately
 *  for reduced-motion users (set in the initializer, so the effect never
 *  calls setState synchronously). */
function useCountUp(target: number, durationMs = 1400): number {
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

const STATS: ReadonlyArray<{ value: number; suffix: string; label: string; note: string }> = [
  { value: 24, suffix: '', label: 'Components', note: 'Typed, themed, composable' },
  { value: 310, suffix: '+', label: 'Icons', note: 'Tree-shakeable SVG set' },
  { value: 39, suffix: '', label: 'CSS lessons', note: 'Interactive playgrounds' },
  { value: 2, suffix: '', label: 'Themes', note: 'Light & dark, one token layer' },
]

const PRINCIPLES: ReadonlyArray<{ icon: IconComponent; title: string; blurb: string }> = [
  { icon: Flash, title: 'Zero dependencies', blurb: 'Every primitive is hand-rolled. React is the only thing in your bundle.' },
  { icon: Afternoon, title: 'Token-driven theming', blurb: 'Light and dark resolve from one semantic token layer — no per-component logic.' },
  { icon: CheckCircle, title: 'Accessible by default', blurb: 'Keyboard nav, ARIA wiring, focus rings, RTL, and reduced-motion support.' },
  { icon: TrendUp, title: 'Tree-shakeable', blurb: 'Per-component and per-icon entry points — you ship only what you import.' },
]

const INTERESTS: ReadonlyArray<{ value: string; label: string; icon: IconComponent }> = [
  { value: 'flights', label: 'Flights', icon: Flight },
  { value: 'hotels', label: 'Hotels', icon: Hotel },
  { value: 'trains', label: 'Trains', icon: Train },
  { value: 'cabs', label: 'Cabs', icon: Bus },
]

/** Icons shown in the Icons preview tile. */
const ICON_WALL: ReadonlyArray<IconComponent> = [Flight, Hotel, Train, Bus, Star, Heart, Person, Flash]

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

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
      {children}
    </Text>
  )
}

/** Looping wordmark marquee — the Kudos "KUDOS KUDOS KUDOS" band, reused
 *  here as "SWIFT". Outlined display type drifting horizontally. */
function WordmarkMarquee({ word = 'SWIFT', count = 8 }: { word?: string; count?: number }) {
  const words = Array.from({ length: count })
  return (
    <div className="marquee select-none py-6" aria-hidden>
      <div className="marquee-track items-center gap-8">
        {words.map((_, i) => (
          <span key={`a-${i}`} className="kudos-marquee-word">
            {word}
          </span>
        ))}
        {words.map((_, i) => (
          <span key={`b-${i}`} className="kudos-marquee-word">
            {word}
          </span>
        ))}
      </div>
    </div>
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
    <div className="overflow-hidden rounded-2xl border border-stroke bg-surface-elevated text-content shadow-level4">
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

/** A single big count-up stat, Kudos style: huge number, mint accent, note. */
function StatBlock({ value, suffix, label, note }: {
  value: number; suffix: string; label: string; note: string
}) {
  const n = useCountUp(value)
  return (
    <div className="flex flex-col gap-1 border-t border-white/10 pt-5">
      <Text variant="heading-xl" fontWeight="bold" color="inherit" className="kudos-accent-text tabular-nums leading-none">
        {n}{suffix}
      </Text>
      <Text variant="body-md" fontWeight="semibold" color="inherit">{label}</Text>
      <Text variant="body-sm" color="inherit" className="opacity-70">{note}</Text>
    </div>
  )
}

/** A live mini-preview of what each tab contains — real components. */
function ExplorePreview({ to }: { to: SectionPath }) {
  if (to === '/components') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">Book</Button>
        <Badge variant="success" appearance="soft" startIcon={<Check size={12} />}>New</Badge>
        <Switch size="sm" defaultChecked aria-label="preview switch" />
      </div>
    )
  }
  if (to === '/icons') {
    return (
      <div className="grid grid-cols-4 gap-1.5">
        {ICON_WALL.map((Icon, idx) => (
          <span key={idx} className="flex size-8 items-center justify-center rounded-lg bg-surface text-content-secondary">
            <Icon size={15} />
          </span>
        ))}
      </div>
    )
  }
  if (to === '/css') {
    return (
      <div className="flex items-center gap-2.5">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background:
              'conic-gradient(from 0deg, var(--color-brand-500), var(--color-success-500), var(--color-warning-500), var(--color-brand-500))',
          }}
        />
        <div
          style={{
            width: 52,
            height: 40,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--color-brand-400), var(--color-new-500))',
          }}
        />
        <div className="size-10 rounded-lg border border-stroke bg-surface-elevated shadow-level2" />
      </div>
    )
  }
  // foundations
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-5 overflow-hidden rounded-md border border-stroke">
        {['bg-surface-brand', 'bg-surface-highlight', 'bg-surface-success', 'bg-surface-warning', 'bg-surface-critical', 'bg-surface-new'].map((c) => (
          <span key={c} className={`flex-1 ${c}`} />
        ))}
      </div>
      <div className="flex gap-1.5">
        {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-full'].map((r) => (
          <span key={r} className={`size-6 border border-stroke-brand bg-surface-brand-muted ${r}`} />
        ))}
      </div>
    </div>
  )
}

/** Large editorial row: index number + label on the left, live preview +
 *  "open" link on the right. The whole row is a link target. Kudos uses
 *  these big bordered list rows that highlight on hover. */
function SectionRow({ n, to, label, meta, blurb }: {
  n: number; to: SectionPath; label: string; meta: string; blurb: string
}) {
  return (
    <Link
      to={to}
      className="group grid items-center gap-4 border-t border-stroke py-7 transition-colors hover:bg-surface-muted sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:px-2"
    >
      <Text variant="body-sm" fontFamily="mono" color="muted" className="kudos-accent-text">
        {String(n).padStart(2, '0')}
      </Text>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-baseline gap-3">
          <Text variant="heading-lg" fontWeight="bold" className="transition-transform duration-200 group-hover:translate-x-1">
            {label}
          </Text>
          <Text variant="body-xs" color="muted" className="uppercase tracking-wide">{meta}</Text>
        </div>
        <Text variant="body-sm" color="secondary" className="max-w-md">{blurb}</Text>
      </div>
      <div className="flex items-center gap-4 sm:justify-end">
        <div className="hidden rounded-xl border border-stroke-muted bg-surface-muted p-3 md:block">
          <ExplorePreview to={to} />
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-stroke text-content transition-colors duration-200 group-hover:border-transparent group-hover:bg-[var(--kudos-accent)] group-hover:text-[var(--kudos-accent-ink)]">
          <ArrowRight size={18} className="group-hover-nudge" />
        </span>
      </div>
    </Link>
  )
}

function HomeFooter() {
  return (
    <footer className="kudos-ink border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 sm:px-8">
        <div className="flex flex-col gap-6">
          <Text className="kudos-display-sm" color="inherit">
            Build product UIs, <span className="kudos-accent-text">swiftly</span>.
          </Text>
          <div>
            <Link to="/components" className="kudos-pill">
              Explore components
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <Text variant="body-xs" color="inherit" className="opacity-60">© {new Date().getFullYear()} Swift Design System</Text>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {SECTIONS.map(({ to, label }) => (
              <Link key={to} to={to} className="text-sm opacity-70 transition-opacity hover:opacity-100">
                {label}
              </Link>
            ))}
          </nav>
          <Text variant="body-xs" color="inherit" className="inline-flex items-center gap-1.5 opacity-60">
            Made with
            <Heart size={12} title="love" className="kudos-accent-text" />
            by the Swift team
          </Text>
        </div>
      </div>
    </footer>
  )
}

function HomeRoute() {
  return (
    <div className="h-full w-full overflow-y-auto bg-surface">
      {/* ── Hero — dark editorial band ───────────────────────────────── */}
      <section className="kudos-ink kudos-ink-glow relative isolate overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          {/* Pitch */}
          <div className="flex flex-col items-start gap-6 text-left">
            <Reveal index={0}>
              <span className="kudos-eyebrow inline-flex items-center gap-2 opacity-80">
                <span className="size-2 rounded-full bg-[var(--kudos-accent)]" />
                Swift Design System
              </span>
            </Reveal>
            <Reveal index={1} as="h1">
              <span className="kudos-display block" style={{ color: 'var(--kudos-on-ink)' }}>
                Build product UIs,{' '}
                <span className="kudos-accent-text">swiftly</span>.
              </span>
            </Reveal>
            <Reveal index={2}>
              <Text variant="para-lg" color="inherit" className="max-w-md opacity-75">
                Icons, components, and tokens — typed, themed, and tree-shakeable.
                The preview beside this is live; flip it light/dark to watch the
                tokens re-theme.
              </Text>
            </Reveal>
            <Reveal index={3}>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/components" className="kudos-pill">
                  <Settings size={16} />
                  Explore components
                </Link>
                <Link to="/icons" className="kudos-pill-outline" style={{ color: 'var(--kudos-on-ink)' }}>
                  <Star size={16} />
                  Browse icons
                </Link>
              </div>
            </Reveal>
            <Reveal index={4}>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Zero dependencies', 'Light & dark', 'Typed end-to-end'].map((t) => (
                  <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium opacity-80">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Live preview */}
          <Reveal index={2} className="w-full max-w-sm justify-self-center lg:justify-self-end">
            <PreviewApp />
          </Reveal>
        </div>

        {/* Wordmark marquee at the bottom of the hero band */}
        <div className="border-t border-white/10" style={{ color: 'var(--kudos-on-ink)' }}>
          <WordmarkMarquee word="SWIFT" />
        </div>
      </section>

      {/* ── Stats — dark band, big count-up numbers ──────────────────── */}
      <section className="kudos-ink border-t border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:py-20">
          <Reveal>
            <span className="kudos-eyebrow opacity-70">By the numbers</span>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} index={i}>
                <StatBlock {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Swift ──────────────────────────────────────────────── */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="flex flex-col gap-3">
              <Reveal>
                <span className="kudos-eyebrow text-content-muted">Why Swift</span>
              </Reveal>
              <Reveal index={1}>
                <Text className="kudos-display-sm">
                  Built to ship fast and stay consistent.
                </Text>
              </Reveal>
              <Reveal index={2}>
                <Text variant="para-md" color="secondary" className="max-w-md">
                  One token layer, accessible out of the box, and nothing you
                  don&rsquo;t import.
                </Text>
              </Reveal>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-stroke bg-stroke sm:grid-cols-2">
              {PRINCIPLES.map(({ icon: Icon, title, blurb }, i) => (
                <Reveal key={title} index={i} className="bg-surface-elevated">
                  <div className="flex h-full flex-col gap-3 p-6">
                    <span className="flex size-11 items-center justify-center rounded-full bg-surface-muted text-content kudos-accent-text">
                      <Icon size={20} />
                    </span>
                    <Text variant="body-lg" fontWeight="semibold" color="primary">{title}</Text>
                    <Text variant="body-sm" color="secondary">{blurb}</Text>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore — big editorial rows ───────────────────────────── */}
      <section className="bg-surface-muted">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
          <div className="mb-8 flex flex-col gap-2">
            <Reveal>
              <span className="kudos-eyebrow text-content-muted">Explore</span>
            </Reveal>
            <Reveal index={1}>
              <Text className="kudos-display-sm">Everything in its own tab.</Text>
            </Reveal>
          </div>
          <div className="border-b border-stroke">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.to} index={i}>
                <SectionRow n={i + 1} to={s.to} label={s.label} meta={s.meta} blurb={s.blurb} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Get started ────────────────────────────────────────────── */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-4">
              <Reveal>
                <span className="kudos-eyebrow text-content-muted">Get started</span>
              </Reveal>
              <Reveal index={1}>
                <Text className="kudos-display-sm">Two packages, one import.</Text>
              </Reveal>
              <Reveal index={2}>
                <Text variant="para-md" color="secondary" className="max-w-md">
                  Add the packages, import the stylesheet once, and compose —
                  themed and tree-shakeable out of the box. Zero runtime
                  dependencies; React is the only peer.
                </Text>
              </Reveal>
              <Reveal index={3}>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Link to="/components" className="kudos-pill">
                    Open the docs
                    <ArrowRight size={16} />
                  </Link>
                  <Link to="/foundations" className="kudos-pill-outline text-content">
                    Design tokens
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal index={2} className="rounded-2xl border border-stroke bg-surface-elevated p-5 shadow-level2">
              <CodeBlock code={SETUP_SNIPPET} />
            </Reveal>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
