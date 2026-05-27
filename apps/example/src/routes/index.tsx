import { useState, type ComponentType } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Accordion } from '@swift/components/Accordion'
import { Badge } from '@swift/components/Badge'
import { Button } from '@swift/components/Button'
import { Card } from '@swift/components/Card'
import { Checkbox } from '@swift/components/Checkbox'
import { Chip } from '@swift/components/Chip'
import { Input } from '@swift/components/Input'
import { Text } from '@swift/components/Text'
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
import { useTheme, type Theme } from '../lib/theme'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

type IconComponent = ComponentType<{ size?: number; className?: string }>

const STATS: ReadonlyArray<{
  label: string
  value: string
  icon: IconComponent
  accent: string
  blurb: string
}> = [
  { label: 'Icons', value: '310', icon: Star, accent: 'text-content-highlight', blurb: 'tree-shakeable SVGs' },
  { label: 'Components', value: '8', icon: Settings, accent: 'text-content-brand', blurb: 'typed & themable' },
  { label: 'Themes', value: '2', icon: Afternoon, accent: 'text-content-new', blurb: 'light & dark, same tokens' },
  { label: 'Variants', value: '40+', icon: Tag, accent: 'text-content-success', blurb: 'across the system' },
]

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
    a: 'A small design system — icons, components, and tokens — built for ixigo product surfaces. Tree-shakeable, themed, and typed end-to-end.',
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

function StatsStrip() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map(({ label, value, icon: Icon, accent, blurb }) => (
        <Card key={label} variant="outlined" size="sm">
          <Card.Content>
            <div className="flex items-start gap-3">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted ${accent}`}>
                <Icon size={18} />
              </span>
              <div className="flex min-w-0 flex-col">
                <Text variant="heading-md" fontWeight="bold" color="primary">
                  {value}
                </Text>
                <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                  {label}
                </Text>
                <Text variant="body-xs" color="secondary" className="mt-0.5">
                  {blurb}
                </Text>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </section>
  )
}

function ButtonsCard() {
  return (
    <Card variant="outlined" className="h-full">
      <Card.Header divider>
        <Card.Title>Buttons</Card.Title>
        <Card.Description>Seven variants · three sizes · loading + icon slots.</Card.Description>
      </Card.Header>
      <Card.Content>
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
      </Card.Content>
    </Card>
  )
}

function BadgesCard() {
  return (
    <Card variant="outlined" className="h-full">
      <Card.Header divider>
        <Card.Title>Badges</Card.Title>
        <Card.Description>Status pills · counts · soft & solid appearance.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-wrap items-center gap-2">
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
      </Card.Content>
    </Card>
  )
}

function ChipsCard() {
  const [filter, setFilter] = useState<string>('flights')
  return (
    <Card variant="outlined" className="h-full">
      <Card.Header divider>
        <Card.Title>Chips</Card.Title>
        <Card.Description>Selectable, grouped, with leading icons.</Card.Description>
      </Card.Header>
      <Card.Content>
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
      </Card.Content>
    </Card>
  )
}

function FormCard() {
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(true)
  const [notify, setNotify] = useState(false)
  return (
    <Card variant="outlined" className="h-full">
      <Card.Header divider>
        <Card.Title>Inputs & checkboxes</Card.Title>
        <Card.Description>Floating labels, helper text, group state.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-4">
          <Input
            size="sm"
            label="Email"
            placeholder="you@ixigo.com"
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
        </div>
      </Card.Content>
    </Card>
  )
}

function FaqCard() {
  return (
    <Card variant="outlined" className="h-full">
      <Card.Header divider>
        <Card.Title>FAQ</Card.Title>
        <Card.Description>Accordion · single · collapsible.</Card.Description>
      </Card.Header>
      <Card.Content>
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
      </Card.Content>
    </Card>
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

function TypographyCard() {
  return (
    <Card variant="filled" className="h-full">
      <Card.Header divider>
        <Card.Title>Typography</Card.Title>
        <Card.Description>Headings, paragraphs, body sizes — one Text component.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-2">
          <Text variant="heading-lg" fontWeight="bold">Built for travel.</Text>
          <Text variant="para-md" color="secondary">
            Type scale tuned for dense product surfaces. Mix headings, body, and mono in one place.
          </Text>
          <Text variant="body-sm" fontFamily="mono" color="muted">
            tokens → tailwind → components
          </Text>
        </div>
      </Card.Content>
    </Card>
  )
}

function ComponentPlayground() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <SectionLabel>Component playground</SectionLabel>
          <Text variant="body-sm" color="secondary">
            Every Swift component, live and themable. Click around — state is real.
          </Text>
        </div>
        <Link
          to="/components"
          className="inline-flex items-center gap-1 text-sm font-semibold text-content-brand hover:underline"
        >
          Open the docs
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <ButtonsCard />
        <BadgesCard />
        <ChipsCard />
        <FormCard />
        <FaqCard />
        <TripCard />
        <TypographyCard />
        <ThemeCardInline />
        <SearchCard />
      </div>
    </section>
  )
}

function ThemeCardInline() {
  const { theme, toggle } = useTheme()
  const Icon = theme === 'light' ? Night : Afternoon
  return (
    <Card variant="outlined" className="h-full">
      <Card.Header divider>
        <Card.Title>Themes</Card.Title>
        <Card.Description>Same tokens, different surfaces.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-3">
          <div className="flex h-7 overflow-hidden rounded-md border border-stroke">
            {SWATCHES.map((bg) => (
              <div key={bg} className={`flex-1 ${bg}`} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Text variant="body-sm" color="secondary">
              Current: <strong className="text-content-strong capitalize">{theme}</strong>
            </Text>
            <Button size="sm" variant="secondary" onClick={toggle}>
              <Button.LeftIcon><Icon size={14} /></Button.LeftIcon>
              Switch
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

function SearchCard() {
  const [q, setQ] = useState('')
  return (
    <Card variant="outlined" className="h-full">
      <Card.Header divider>
        <Card.Title>Where next?</Card.Title>
        <Card.Description>Input + Chip group, working together.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-3">
          <Input
            size="sm"
            placeholder="Goa, Manali, Pondicherry…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            startAdornment={<Search size={14} />}
          />
          <div className="flex flex-wrap gap-1.5">
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
        </div>
      </Card.Content>
    </Card>
  )
}

function IconWall() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col">
          <SectionLabel>310 icons · ready to grab</SectionLabel>
          <Text variant="body-sm" color="secondary">
            Travel, transport, amenities, finance — sized 14 → 24 px out of the box.
          </Text>
        </div>
        <Link
          to="/icons"
          className="inline-flex items-center gap-1 text-sm font-semibold text-content-brand hover:underline"
        >
          Browse all
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-15">
        {ICON_WALL.map(({ Icon, color }, i) => (
          <div
            key={i}
            className="group flex aspect-square items-center justify-center rounded-lg border border-stroke bg-surface-elevated transition-colors hover:border-stroke-brand hover:bg-surface-muted"
            title={Icon.name}
          >
            <Icon size={18} className={`${color} transition-transform group-hover:scale-110`} />
          </div>
        ))}
      </div>
    </section>
  )
}

function HomeRoute() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-full w-full overflow-y-auto bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-8 py-16">
        <header className="flex flex-col items-center gap-3 text-center">
          <Badge variant="info" appearance="soft" startIcon={<Flash size={12} />}>
            Swift Design System
          </Badge>
          <Text variant="heading-xl" fontWeight="bold">
            icons, components, and tokens — all in one place.
          </Text>
          <Text variant="para-md" color="secondary" className="max-w-xl">
            A small, themed set of building blocks. Browse the icon library, explore components, or
            inspect the design tokens that power them.
          </Text>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
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

        <StatsStrip />

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

        <ComponentPlayground />

        <IconWall />

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
