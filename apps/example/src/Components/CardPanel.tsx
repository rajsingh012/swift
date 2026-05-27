import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@swift/components/Badge'
import { Button } from '@swift/components/Button'
import { Card } from '@swift/components/Card'
import { Chip } from '@swift/components/Chip'
import { Text } from '@swift/components/Text'
import { ArrowRight } from '@swift/icons/ArrowRight'
import { Check } from '@swift/icons/Check'
import { Edit } from '@swift/icons/Edit'
import { Flight } from '@swift/icons/Flight'
import { Hotel } from '@swift/icons/Hotel'
import { Person } from '@swift/icons/Person'
import { Star } from '@swift/icons/Star'
import { Tag } from '@swift/icons/Tag'
import { TrendUp } from '@swift/icons/TrendUp'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Composable container. Eight compound parts (Header / Title / Description / Content / Footer / Actions / Media + root) let you assemble any card layout without prop-drilling. Four variants × three sizes × five radii, with built-in clickable, loading, and polymorphic / asChild support.'

const VARIANTS: ReadonlyArray<{
  name: 'elevated' | 'outlined' | 'filled' | 'ghost'
  use: string
}> = [
  { name: 'elevated', use: 'Shadow + surface · floats above the page' },
  { name: 'outlined', use: 'Border + surface · default · sits cleanly inline' },
  { name: 'filled', use: 'Tinted muted surface · for nested cards' },
  { name: 'ghost', use: 'No border, no surface · pure layout grouping' },
]

const SIZES: ReadonlyArray<{
  size: 'sm' | 'md' | 'lg'
  padX: string
  padY: string
}> = [
  { size: 'sm', padX: '16px', padY: '12 / 16 px' },
  { size: 'md', padX: '20px', padY: '16 / 20 px (default)' },
  { size: 'lg', padX: '24px', padY: '20 / 24 px' },
]

const CARD_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'variant',
    type: `'elevated' | 'outlined' | 'filled' | 'ghost'`,
    defaultValue: `'outlined'`,
    description:
      'Visual treatment. Elevated adds a soft shadow, outlined adds a hairline border, filled uses the muted surface, ghost is fully transparent — useful as a layout grouping for already-styled children.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Padding scale. Cascades to Header / Content / Footer / Actions via context — set it once on the root and every slot resizes together.',
  },
  {
    name: 'radius',
    type: `'none' | 'sm' | 'md' | 'lg' | 'full'`,
    defaultValue: `'lg'`,
    description: 'Corner radius. `none` for cards that sit edge-to-edge in a container; `full` for pill-shaped cards.',
  },
  {
    name: 'clickable',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Adds hover lift, focus ring, keyboard activation, and switches the implicit root to `<button>` (or applies ARIA button semantics when `as` is non-native).',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Replaces children with skeleton placeholders and sets `aria-busy=true`. Useful for dashboards and search results.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Standard disabled state. Lowers opacity, blocks click, and sets `aria-disabled`.',
  },
  {
    name: 'as',
    type: 'ElementType',
    defaultValue: `'div' (or 'button' when clickable)`,
    description:
      'Polymorphic element override. Use "article" / "section" for semantic HTML, "a" for native anchors, or a router component for client-side links.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Render the single child element as the root, merging the Card\'s props (className, data-attributes, click handler, ref) onto it. Use for routing components when you do not want an extra wrapper DOM node.',
  },
  {
    name: 'classes',
    type: '{ root? }',
    description: 'Slot-level className overrides. Equivalent to `className` on the root.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Appended to the root after variant/size classes.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLElement>',
    description: 'Forwarded to the rendered element.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes of the rendered element',
    description: 'Anything else (id, role, aria-*, data-*, event handlers, href / target / rel for anchors) forwards through.',
  },
]

const COMPOUND_PARTS: ReadonlyArray<{
  name: string
  desc: string
}> = [
  {
    name: 'Card.Header',
    desc: 'Padded top section — usually wraps Title + Description. Pass `divider` for a hairline border below.',
  },
  {
    name: 'Card.Title',
    desc: 'Heading text. Defaults to `<h3>` with the title font from the Card size context. Override via `as="h2"` etc.',
  },
  {
    name: 'Card.Description',
    desc: 'Secondary text — renders as `<p>` with muted colour. Pairs with Title inside Card.Header.',
  },
  {
    name: 'Card.Content',
    desc: 'The body slot. Padded vertically slightly more than Header / Footer so headers feel like crowns.',
  },
  {
    name: 'Card.Footer',
    desc: 'Bottom section. Pass `divider` for a top border and `muted` to tint the surface — ideal for actions strips.',
  },
  {
    name: 'Card.Actions',
    desc: 'Flex row for buttons. `align="end"` by default. Use instead of Footer when the only thing in the footer is a group of buttons.',
  },
  {
    name: 'Card.Media',
    desc: 'Edge-to-edge media slot. Pass `src` for an `<img>` or drop in custom children. Supports `aspectRatio` and `fit` for object-fit control.',
  },
]

export function CardPanel() {
  const [favourited, setFavourited] = useState(false)
  const [loading, setLoading] = useState(false)

  const triggerLoading = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Card
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Compound architecture ──────────────────────────── */}
      <section>
        <SectionHeader>Compound architecture · the recommended way</SectionHeader>
        <PreviewRow>
          <Card className="w-full max-w-md">
            <Card.Header divider>
              <Card.Title>Flight details</Card.Title>
              <Card.Description>Delhi → Mumbai · Tue 14 Jul · IndiGo 6E 2134</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Text variant="body-xs" color="muted" className="block">DEPART</Text>
                  <Text variant="heading-sm" fontWeight="semibold">06:20</Text>
                  <Text variant="body-xs" color="muted" className="block">DEL · T1</Text>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <Text variant="body-xs" color="muted">2h 15m</Text>
                  <div className="h-px w-full bg-stroke" />
                  <Text variant="body-xs" color="muted">Non-stop</Text>
                </div>
                <div>
                  <Text variant="body-xs" color="muted" className="block">ARRIVE</Text>
                  <Text variant="heading-sm" fontWeight="semibold">08:35</Text>
                  <Text variant="body-xs" color="muted" className="block">BOM · T2</Text>
                </div>
              </div>
            </Card.Content>
            <Card.Footer divider muted>
              <div className="flex w-full items-center justify-between">
                <Text variant="heading-sm" fontWeight="bold">₹4,820</Text>
                <Button size="sm">
                  Book now
                  <Button.RightIcon><ArrowRight size={14} /></Button.RightIcon>
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Compose <code>Card.Header / Title / Description / Content / Footer / Actions / Media</code> in any order. The padding scale and typography come from the root — change <code>size</code> once and every slot resizes.
        </Text>
      </section>

      {/* ── Variants ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Variants</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {VARIANTS.map(({ name, use }) => (
            <div
              key={name}
              className="grid grid-cols-[120px_1fr_minmax(260px,auto)] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {use}
              </Text>
              <Card variant={name} className="w-64">
                <Card.Content>
                  <Text variant="body-sm" fontWeight="semibold">
                    {name[0].toUpperCase() + name.slice(1)} card
                  </Text>
                  <Text variant="body-xs" color="muted" className="block">
                    Drop any content inside.
                  </Text>
                </Card.Content>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sizes ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Sizes · padding scale cascade</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {SIZES.map(({ size, padX, padY }) => (
            <div
              key={size}
              className="grid grid-cols-[80px_180px_1fr] items-start gap-6 border-b border-stroke-muted px-6 py-5 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {size}
              </Text>
              <Text variant="body-xs" color="muted">
                pad x {padX}<br />pad y {padY}
              </Text>
              <Card size={size} className="max-w-sm">
                <Card.Header divider>
                  <Card.Title>Title at {size}</Card.Title>
                  <Card.Description>Description scales with the title.</Card.Description>
                </Card.Header>
                <Card.Content>
                  <Text variant="body-sm" color="secondary">
                    Body padding bumps up at every step.
                  </Text>
                </Card.Content>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ── Radius ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Radius</SectionHeader>
        <PreviewRow>
          {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
            <Card key={r} radius={r} className="w-32">
              <Card.Content>
                <Text variant="body-xs" fontFamily="mono" fontWeight="semibold">
                  radius={r}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </PreviewRow>
      </section>

      {/* ── Clickable ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Clickable · interactive cards</SectionHeader>
        <PreviewRow>
          <Card
            clickable
            variant="elevated"
            className="w-72 text-left"
            onClick={() => setFavourited((f) => !f)}
          >
            <Card.Content>
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="info" appearance="soft" startIcon={<TrendUp />}>
                  Trending
                </Badge>
                <Star size={18} className={favourited ? 'text-content-highlight' : 'text-content-muted'} />
              </div>
              <Text variant="body-sm" fontWeight="semibold">
                Goa beach getaway
              </Text>
              <Text variant="body-xs" color="muted" className="block">
                4 nights · ₹18,200 onwards · {favourited ? 'Saved!' : 'Tap to save'}
              </Text>
            </Card.Content>
          </Card>

          <Card clickable variant="outlined" className="w-72 text-left">
            <Card.Header>
              <Card.Title>Become a Pro member</Card.Title>
              <Card.Description>Unlock priority support and 2× points.</Card.Description>
            </Card.Header>
            <Card.Actions divider align="between">
              <Text variant="body-xs" color="muted">From ₹299 / mo</Text>
              <Text variant="body-sm" fontWeight="semibold" color="primary">
                Upgrade <ArrowRight size={14} className="inline" />
              </Text>
            </Card.Actions>
          </Card>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>clickable</code> implicitly renders the root as <code>&lt;button&gt;</code> (or wires ARIA button semantics when <code>as</code> is non-native). Adds hover lift, focus ring, and Enter / Space activation.
        </Text>
      </section>

      {/* ── Polymorphic ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Polymorphism · the `as` prop</SectionHeader>
        <PreviewRow>
          <Card as="article" className="w-72">
            <Card.Header>
              <Card.Title>Semantic article</Card.Title>
              <Card.Description>Renders as `&lt;article&gt;` for SEO and accessibility.</Card.Description>
            </Card.Header>
          </Card>

          <Card as="a" href="https://example.com" target="_blank" rel="noreferrer" clickable variant="outlined" className="block w-72 no-underline">
            <Card.Content>
              <Text variant="body-sm" fontWeight="semibold">Native anchor card</Text>
              <Text variant="body-xs" color="muted" className="block">Renders as `&lt;a&gt;` with full anchor semantics.</Text>
            </Card.Content>
          </Card>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          TypeScript narrows the rest of the props to whatever element you pick — only the anchor variant accepts <code>href</code>.
        </Text>
      </section>

      {/* ── asChild ────────────────────────────────────────── */}
      <section>
        <SectionHeader>asChild · merge into a router Link</SectionHeader>
        <PreviewRow>
          <Card asChild clickable variant="outlined" className="block w-72 no-underline">
            <Link to="/">
              <Card.Content>
                <Text variant="body-sm" fontWeight="semibold">TanStack Router Link</Text>
                <Text variant="body-xs" color="muted" className="block">
                  No extra wrapper DOM node — Card's props merge onto the Link.
                </Text>
              </Card.Content>
            </Link>
          </Card>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>asChild</code> renders the single child element as the Card root, merging Card's <code>className</code>, <code>data-*</code>, click handler, and ref onto it. Use this when <code>as</code> is awkward (because the child component has its own typed props that don't compose) or when you need to avoid the extra wrapper.
        </Text>
      </section>

      {/* ── Loading ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Loading · built-in skeleton</SectionHeader>
        <PreviewRow>
          <Card loading className="w-72" />
          <Card className="w-72">
            <Card.Content>
              <Button onClick={triggerLoading} variant="secondary" size="sm">
                {loading ? 'Loading…' : 'Click to simulate'}
              </Button>
            </Card.Content>
            <Card loading={loading} variant="ghost">
              <Card.Content>
                <Text variant="body-sm">When triggered, this nested card swaps in a skeleton.</Text>
              </Card.Content>
            </Card>
          </Card>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The built-in skeleton handles the common case. For custom skeletons, leave <code>loading</code> off and render your own placeholder children.
        </Text>
      </section>

      {/* ── Media ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Card.Media · product cards</SectionHeader>
        <PreviewRow>
          <Card clickable variant="elevated" className="w-72 text-left">
            <Card.Media
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=70"
              alt="Beach with turquoise water"
              aspectRatio="16 / 9"
            />
            <Card.Header>
              <div className="flex items-start justify-between gap-2">
                <Card.Title>Palolem beach stay</Card.Title>
                <Badge variant="success" appearance="soft" size="sm">9.2</Badge>
              </div>
              <Card.Description>Goa · 4 nights · breakfast included</Card.Description>
            </Card.Header>
            <Card.Footer divider>
              <div className="flex w-full items-center justify-between">
                <Text variant="heading-sm" fontWeight="bold">₹18,200</Text>
                <Text variant="body-xs" color="muted">per room</Text>
              </div>
            </Card.Footer>
          </Card>

          <Card variant="outlined" className="w-72">
            <Card.Media aspectRatio="16 / 9">
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand-500 to-highlight-500 text-content-on-brand">
                <Hotel size={48} />
              </div>
            </Card.Media>
            <Card.Header>
              <Card.Title>Custom media slot</Card.Title>
              <Card.Description>Drop any node — video, iframe, gradient — instead of an image.</Card.Description>
            </Card.Header>
          </Card>
        </PreviewRow>
      </section>

      {/* ── Actions ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Card.Actions · button row</SectionHeader>
        <PreviewRow>
          <Card className="w-80">
            <Card.Header>
              <Card.Title>Delete this saved card?</Card.Title>
              <Card.Description>This action cannot be undone.</Card.Description>
            </Card.Header>
            <Card.Actions divider align="end">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button variant="danger" size="sm">
                <Button.LeftIcon><Edit size={14} /></Button.LeftIcon>
                Delete
              </Button>
            </Card.Actions>
          </Card>

          <Card className="w-80">
            <Card.Header>
              <Card.Title>Trip summary</Card.Title>
            </Card.Header>
            <Card.Content>
              <Text variant="body-sm" color="secondary">
                2 adults · 1 child · Goa → Mumbai
              </Text>
            </Card.Content>
            <Card.Actions divider align="between" muted>
              <Text variant="body-xs" color="muted">Hold for 20 mins</Text>
              <Button size="sm">
                Continue
                <Button.RightIcon><ArrowRight size={14} /></Button.RightIcon>
              </Button>
            </Card.Actions>
          </Card>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>Card.Actions</code> is a flex row with <code>align</code> options (start, center, end, between). Pair with <code>divider</code> and <code>muted</code> to match the Footer look.
        </Text>
      </section>

      {/* ── Disabled ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Disabled</SectionHeader>
        <PreviewRow>
          <Card disabled className="w-64">
            <Card.Content>
              <Text variant="body-sm" fontWeight="semibold">Disabled card</Text>
              <Text variant="body-xs" color="muted" className="block">
                Lowered opacity, blocks pointer events.
              </Text>
            </Card.Content>
          </Card>
          <Card disabled clickable className="w-64 text-left">
            <Card.Content>
              <Text variant="body-sm" fontWeight="semibold">Disabled clickable</Text>
              <Text variant="body-xs" color="muted" className="block">
                Click handlers are blocked; sets aria-disabled.
              </Text>
            </Card.Content>
          </Card>
        </PreviewRow>
      </section>

      {/* ── Dashboard layout ───────────────────────────────── */}
      <section>
        <SectionHeader>In context · Dashboard grid</SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Active bookings', value: '128', delta: '+12 this week', tone: 'success' as const },
            { label: 'Cancellations', value: '4', delta: '−2 vs last week', tone: 'warning' as const },
            { label: 'Refunds pending', value: '₹42,800', delta: '7 tickets', tone: 'info' as const },
          ].map(({ label, value, delta, tone }) => (
            <Card key={label} variant="outlined">
              <Card.Content>
                <Text variant="body-xs" color="muted" className="block tracking-wide uppercase">
                  {label}
                </Text>
                <Text variant="heading-lg" fontWeight="bold" className="mt-1 block">
                  {value}
                </Text>
                <div className="mt-3">
                  <Badge variant={tone} appearance="soft" size="sm" dot>
                    {delta}
                  </Badge>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Filter sidebar ─────────────────────────────────── */}
      <section>
        <SectionHeader>In context · Filter sidebar (filled + ghost nesting)</SectionHeader>
        <Card variant="filled" className="max-w-md">
          <Card.Header divider>
            <Card.Title as="h4">Refine results</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid gap-4">
              <Card variant="ghost" radius="none">
                <Text variant="body-xs" color="muted" className="mb-2 block tracking-wide uppercase">
                  Transit
                </Text>
                <div className="flex flex-wrap gap-2">
                  <Chip variant="primary" startIcon={<Flight />}>Flights</Chip>
                  <Chip variant="primary" appearance="outline">Trains</Chip>
                </div>
              </Card>
              <Card variant="ghost" radius="none">
                <Text variant="body-xs" color="muted" className="mb-2 block tracking-wide uppercase">
                  Stops
                </Text>
                <div className="flex flex-wrap gap-2">
                  <Chip>Non-stop</Chip>
                  <Chip>1 stop</Chip>
                  <Chip>2+ stops</Chip>
                </div>
              </Card>
            </div>
          </Card.Content>
        </Card>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The <code>ghost</code> variant lets a Card act as a layout grouping with zero chrome — useful when nesting cards inside a filled or outlined parent.
        </Text>
      </section>

      {/* ── Profile card ───────────────────────────────────── */}
      <section>
        <SectionHeader>In context · Profile card with avatar</SectionHeader>
        <Card variant="elevated" className="max-w-md">
          <Card.Header>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-brand text-content-on-brand">
                <Person size={22} />
              </span>
              <div className="flex flex-col">
                <Card.Title as="h4">Anika Rao</Card.Title>
                <Card.Description>Pro member · Joined Mar 2024</Card.Description>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-wrap gap-2">
              <Chip size="sm" startIcon={<Check />} variant="success">Verified</Chip>
              <Chip size="sm" startIcon={<Tag />}>Frequent flyer</Chip>
              <Chip size="sm" startIcon={<Star />} variant="info">Early access</Chip>
            </div>
          </Card.Content>
          <Card.Footer divider>
            <div className="flex w-full justify-between">
              <Button variant="ghost" size="sm">Message</Button>
              <Button size="sm">Follow</Button>
            </div>
          </Card.Footer>
        </Card>
      </section>

      {/* ── Accessibility ──────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <Card variant="outlined">
          <Card.Content>
            <div className="grid gap-2">
              <Text variant="body-sm">
                <strong className="text-content-strong">Static cards.</strong> Default root is `&lt;div&gt;` with no special role — assistive tech treats it as a plain grouping.
              </Text>
              <Text variant="body-sm">
                <strong className="text-content-strong">Clickable cards.</strong> Implicitly render as `&lt;button&gt;`. With `as="a"` they become a native anchor. With any other `as`, the Card adds `role="button"`, `tabIndex=0`, and Enter / Space activation.
              </Text>
              <Text variant="body-sm">
                <strong className="text-content-strong">Loading.</strong> Sets `aria-busy="true"` and replaces children with a skeleton.
              </Text>
              <Text variant="body-sm">
                <strong className="text-content-strong">Disabled.</strong> Sets `aria-disabled`, lowers opacity, and blocks click handlers. Native buttons additionally get the `disabled` attribute.
              </Text>
              <Text variant="body-sm">
                <strong className="text-content-strong">Headings.</strong> `Card.Title` is `&lt;h3&gt;` by default — override via `as="h2"` etc. to fit the page's heading outline.
              </Text>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* ── Data attributes ────────────────────────────────── */}
      <section>
        <SectionHeader>Data attributes · style hooks</SectionHeader>
        <Card>
          <Card.Content>
            <Text variant="body-sm" color="secondary" className="mb-3 block">
              Every Card root emits <code>data-variant</code>, <code>data-size</code>, <code>data-clickable</code>, <code>data-loading</code>, and <code>data-disabled</code>. Target them from app CSS without piercing component internals.
            </Text>
            <CodeBlock
              code={`/* Lift only elevated cards on hover */
[data-variant="elevated"][data-clickable]:hover {
  transform: translateY(-2px);
  transition: transform 150ms ease-out;
}`}
            />
          </Card.Content>
        </Card>
      </section>

      {/* ── Props ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Props · Card root</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
            <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
              Prop
            </Text>
            <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
              Type
            </Text>
            <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
              Default
            </Text>
          </div>
          {CARD_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Text variant="body-xs" fontFamily="mono" color="secondary" className="wrap-break-word">
                  {type}
                </Text>
                <Text variant="body-sm" color="secondary">
                  {description}
                </Text>
              </div>
              <Text variant="body-xs" fontFamily="mono" color={defaultValue ? 'inherit' : 'muted'}>
                {defaultValue ?? '—'}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Compound parts table ───────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {COMPOUND_PARTS.map(({ name, desc }) => (
            <div
              key={name}
              className="grid gap-1 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[200px_1fr] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {desc}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Imports ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Card } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Card } from '@swift/components/Card'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Card, type CardProps, type CardVariant } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Card>
  <Card.Header divider>
    <Card.Title>Flight details</Card.Title>
    <Card.Description>Delhi → Mumbai</Card.Description>
  </Card.Header>
  <Card.Content>
    Body content
  </Card.Content>
  <Card.Footer divider muted>
    Footer content
  </Card.Footer>
</Card>

// Clickable
<Card clickable onClick={handleClick}>
  …
</Card>

// Polymorphic
<Card as="article">…</Card>
<Card as="a" href="/details" clickable>…</Card>

// asChild (router Link)
<Card asChild clickable>
  <Link to="/details">…</Link>
</Card>

// With media
<Card>
  <Card.Media src="hotel.jpg" alt="Hotel" aspectRatio="16 / 9" />
  <Card.Content>…</Card.Content>
</Card>

// Loading
<Card loading />`}
        />
      </section>
    </div>
  )
}
