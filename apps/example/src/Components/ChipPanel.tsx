import { useState } from 'react'
import { Chip, ChipGroup } from '@swift/components/Chip'
import { Text } from '@swift/components/Text'
import { Bus } from '@swift/icons/Bus'
import { Check } from '@swift/icons/Check'
import { Filter } from '@swift/icons/Filter'
import { Flight } from '@swift/icons/Flight'
import { Food } from '@swift/icons/Food'
import { Hotel } from '@swift/icons/Hotel'
import { Location } from '@swift/icons/Location'
import { Person } from '@swift/icons/Person'
import { Star } from '@swift/icons/Star'
import { Tag } from '@swift/icons/Tag'
import { Train } from '@swift/icons/Train'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

type ChipKnobVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

const CHIP_KNOBS: ReadonlyArray<Knob> = [
  {
    type: 'select',
    name: 'variant',
    options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
    defaultValue: 'default',
  },
  {
    type: 'segmented',
    name: 'appearance',
    options: ['solid', 'soft', 'outline'],
    defaultValue: 'soft',
  },
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', name: 'selected' },
  { type: 'boolean', name: 'disabled' },
  { type: 'text', name: 'children', defaultValue: 'Flights', asChildren: true },
]

const DESCRIPTION =
  'Interactive label. Six variants × three appearances × three sizes, with a `<ChipGroup>` wrapper for single / multi-select filter UIs. Use Chip for actions and selection; use Badge for read-only labels and counts.'

const VARIANTS: ReadonlyArray<{
  name: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  use: string
  label: string
}> = [
  { name: 'default', use: 'Neutral · uncategorised', label: 'Default' },
  { name: 'primary', use: 'Brand · most-emphasised action', label: 'Primary' },
  { name: 'success', use: 'Confirmation · active filter', label: 'Verified' },
  { name: 'warning', use: 'Caution · attention required', label: 'Limited' },
  { name: 'error', use: 'Removal · destructive selection', label: 'Blocked' },
  { name: 'info', use: 'Informational · new / beta', label: 'Beta' },
]

const APPEARANCES: ReadonlyArray<{
  name: 'solid' | 'soft' | 'outline'
  use: string
}> = [
  { name: 'solid', use: 'High emphasis · filled' },
  { name: 'soft', use: 'Default · tinted background (recommended)' },
  { name: 'outline', use: 'Stroke-only · ghost surface' },
]

const SIZES: ReadonlyArray<{
  size: 'sm' | 'md' | 'lg'
  height: string
}> = [
  { size: 'sm', height: '28px' },
  { size: 'md', height: '32px' },
  { size: 'lg', height: '40px' },
]

const CHIP_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'variant',
    type: `'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'`,
    defaultValue: `'default'`,
    description:
      'Semantic colour. Maps to project palettes (brand / neutral / success / warning / critical / highlight) — every variant themes together under [data-theme="dark"].',
  },
  {
    name: 'appearance',
    type: `'solid' | 'soft' | 'outline'`,
    defaultValue: `'soft'`,
    description:
      'Visual treatment. `soft` is the default — tinted background with readable accent text and a clear toggle target.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Fixed-height sizing: 28 / 32 / 40 px. Drives padding, font size, gap, and icon scale. Inherited from `<ChipGroup>` if not set.',
  },
  {
    name: 'radius',
    type: `'sm' | 'md' | 'full'`,
    defaultValue: `'full'`,
    description:
      'Corner radius. Chips default to the pill shape; switch to `sm` / `md` when chips sit inline with squared inputs.',
  },
  {
    name: 'selected',
    type: 'boolean',
    description:
      'Toggled state. Overridden by `<ChipGroup>` if the chip has a `value` and lives inside a group. Drives a filled fallback look plus a leading check by default.',
  },
  {
    name: 'onSelectedChange',
    type: '(next: boolean) => void',
    description:
      'Standalone toggle callback. Ignored when inside a `<ChipGroup>` — the group owns selection there.',
  },
  {
    name: 'value',
    type: 'string',
    description:
      'Identifier read by `<ChipGroup>`. Without a group ancestor this is purely an HTML attribute and has no behaviour.',
  },
  {
    name: 'showCheckOnSelected',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Shows a leading check glyph when selected. Disable for pure colour-based selection.',
  },
  {
    name: 'avatar',
    type: 'ReactNode',
    description:
      'Leading thumbnail slot — rounded and edge-aligned. Use for user / channel / brand chips. Suppressed when selected (the check takes its place) and when `loading` is set.',
  },
  {
    name: 'startIcon',
    type: 'ReactNode',
    description: 'Leading icon. Suppressed when `avatar`, `loading`, or selected-check is showing.',
  },
  {
    name: 'endIcon',
    type: 'ReactNode',
    description: 'Trailing icon. Suppressed when `removable` is set — the close button takes that slot.',
  },
  {
    name: 'removable',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Renders a trailing close button. Pair with `onRemove`. The close button stops propagation so the chip click does not also fire.',
  },
  {
    name: 'onRemove',
    type: '(e: MouseEvent<HTMLButtonElement>) => void',
    description: 'Callback fired by the close button. Suppressed when disabled or loading.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Replaces the leading slot with a spinner. Sets aria-busy and blocks click / remove.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Standard disabled state. Lowers opacity, blocks interaction, and prevents toggling.',
  },
  {
    name: 'as',
    type: 'ElementType',
    defaultValue: `'button'`,
    description:
      'Polymorphic element override. Use "a" for navigation chips or a router component for client-side links — TypeScript narrows the rest of the props to that element.',
  },
  {
    name: 'classes',
    type: '{ root?, startIcon?, endIcon?, avatar?, label?, removeButton?, check? }',
    description: 'Slot-level className overrides. Composes with the built-in classes — your overrides win cascade order.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Appended to the root after variant/size classes. Equivalent to `classes.root`.',
  },
]

const GROUP_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'selectionMode',
    type: `'single' | 'multiple' | 'none'`,
    defaultValue: `'none'`,
    description:
      'Selection semantics. `single` allows one chip at a time (clicking the selected chip deselects). `multiple` is a multi-toggle. `none` is decorative — the group passes through `size` / `disabled` but does not own selection.',
  },
  {
    name: 'value',
    type: 'string | string[] | null',
    description:
      'Controlled selection. Use a string for single, an array for multiple. Pass null / [] for nothing selected.',
  },
  {
    name: 'defaultValue',
    type: 'string | string[]',
    description: 'Initial selection for uncontrolled groups. Ignored when `value` is set.',
  },
  {
    name: 'onValueChange',
    type: '(next: string | string[] | null) => void',
    description: 'Fires when the selection changes. The argument shape matches `selectionMode`.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables every chip in the group at once.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    description: 'Default size applied to chips without an explicit `size` prop.',
  },
  {
    name: 'orientation',
    type: `'horizontal' | 'vertical'`,
    defaultValue: `'horizontal'`,
    description: 'Layout direction. Horizontal wraps; vertical stacks left-aligned.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Accessible name for the group. Required for assistive tech if no visible heading sits adjacent.',
  },
]

const PERSONA_TAGS = ['React', 'TypeScript', 'Vite', 'Tailwind', 'Bun']

export function ChipPanel() {
  // Filter chip group — multi-select
  const [transitFilters, setTransitFilters] = useState<readonly string[]>(['flight'])

  // Sort chip group — single-select
  const [sortBy, setSortBy] = useState<string | null>('cheapest')

  // Removable tag list
  const [tags, setTags] = useState<string[]>(PERSONA_TAGS)

  // Standalone toggle
  const [favourited, setFavourited] = useState(false)

  // Loading demo
  const [pending, setPending] = useState(false)
  const triggerLoading = () => {
    setPending(true)
    window.setTimeout(() => setPending(false), 1500)
  }

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Chip
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Chip"
          knobs={CHIP_KNOBS}
          render={(v) => (
            <Chip
              variant={v.variant as ChipKnobVariant}
              appearance={v.appearance as 'solid' | 'soft' | 'outline'}
              size={v.size as 'sm' | 'md' | 'lg'}
              selected={v.selected === true}
              disabled={v.disabled === true}
            >
              {String(v.children)}
            </Chip>
          )}
        />
      </section>

      {/* ── Variants ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Variants</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {VARIANTS.map(({ name, use, label }) => (
            <div
              key={name}
              className="grid grid-cols-[120px_1fr_minmax(120px,auto)] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {use}
              </Text>
              <div className="flex justify-end">
                <Chip variant={name}>{label}</Chip>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Appearances ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Appearances · variant × treatment</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {APPEARANCES.map(({ name, use }) => (
            <div
              key={name}
              className="grid grid-cols-[120px_1fr] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <div className="flex flex-col gap-1">
                <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                  {name}
                </Text>
                <Text variant="body-xs" color="muted">
                  {use}
                </Text>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {VARIANTS.map(({ name: v, label }) => (
                  <Chip key={v} variant={v} appearance={name}>
                    {label}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sizes ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Sizes</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {SIZES.map(({ size, height }) => (
            <div
              key={size}
              className="grid grid-cols-[80px_120px_1fr] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {size}
              </Text>
              <Text variant="body-xs" color="muted">
                h {height}
              </Text>
              <div className="flex flex-wrap items-center gap-2">
                <Chip size={size}>Default</Chip>
                <Chip size={size} variant="primary">Primary</Chip>
                <Chip size={size} variant="success" startIcon={<Check />}>Verified</Chip>
                <Chip size={size} variant="info" appearance="outline">Beta</Chip>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Selected toggle ──────────────────────────────────── */}
      <section>
        <SectionHeader>Selected · toggle state</SectionHeader>
        <PreviewRow
          code={`<Chip
  selected={favourited}
  onSelectedChange={setFavourited}
  variant="info"
  startIcon={<Star />}
>
  {favourited ? 'Favourited' : 'Add to favourites'}
</Chip>

{/* Selected chips paint a filled look regardless of base appearance. */}
<Chip selected variant="success" appearance="outline">Outline · selected</Chip>
<Chip selected showCheckOnSelected={false} variant="error">No leading check</Chip>`}
        >
          <Chip
            selected={favourited}
            onSelectedChange={setFavourited}
            variant="info"
            startIcon={<Star />}
          >
            {favourited ? 'Favourited' : 'Add to favourites'}
          </Chip>
          <Chip selected variant="primary">Always selected</Chip>
          <Chip selected variant="success" appearance="outline">Outline · selected</Chip>
          <Chip selected showCheckOnSelected={false} variant="error">No leading check</Chip>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Selected chips paint with a filled look regardless of the base <code>appearance</code> — the toggled state stays unmistakable across all four. A leading check glyph is added unless you opt out with <code>showCheckOnSelected={`{false}`}</code>.
        </Text>
      </section>

      {/* ── Chip group · multi-select filter ──────────────── */}
      <section>
        <SectionHeader>ChipGroup · multi-select filters</SectionHeader>
        <div className="rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm" fontWeight="semibold" className="mb-3 block">
            Transit modes
          </Text>
          <ChipGroup
            value={transitFilters}
            onValueChange={(next) => setTransitFilters(next as string[])}
            selectionMode="multiple"
            aria-label="Transit modes"
          >
            <Chip value="flight" variant="primary" startIcon={<Flight />}>Flights</Chip>
            <Chip value="train" variant="primary" startIcon={<Train />}>Trains</Chip>
            <Chip value="bus" variant="primary" startIcon={<Bus />}>Buses</Chip>
            <Chip value="hotel" variant="primary" startIcon={<Hotel />}>Hotels</Chip>
            <Chip value="food" variant="primary" startIcon={<Food />}>Food</Chip>
          </ChipGroup>
          <Text variant="body-xs" color="muted" className="mt-3 block">
            Selected: <code>{transitFilters.length ? transitFilters.join(', ') : '(none)'}</code>
          </Text>
        </div>
      </section>

      {/* ── Chip group · single-select sort ──────────────── */}
      <section>
        <SectionHeader>ChipGroup · single-select sort</SectionHeader>
        <div className="rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm" fontWeight="semibold" className="mb-3 block">
            Sort by
          </Text>
          <ChipGroup
            value={sortBy}
            onValueChange={(next) => setSortBy(next as string | null)}
            selectionMode="single"
            aria-label="Sort order"
          >
            <Chip value="cheapest" appearance="outline">Cheapest</Chip>
            <Chip value="fastest" appearance="outline">Fastest</Chip>
            <Chip value="earliest" appearance="outline">Earliest</Chip>
            <Chip value="recommended" appearance="outline">Recommended</Chip>
          </ChipGroup>
          <Text variant="body-xs" color="muted" className="mt-3 block">
            Sorted by: <code>{sortBy ?? '(none — click again to deselect)'}</code>
          </Text>
        </div>
      </section>

      {/* ── Removable / tag list ──────────────────────────── */}
      <section>
        <SectionHeader>Removable · tag list</SectionHeader>
        <div className="rounded-xl border border-stroke bg-surface-elevated p-5">
          {tags.length === 0 ? (
            <div className="flex items-center justify-between">
              <Text variant="body-sm" color="muted">All tags removed.</Text>
              <button
                type="button"
                className="cursor-pointer text-sm text-content-brand underline"
                onClick={() => setTags(PERSONA_TAGS)}
              >
                Restore
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  variant="default"
                  appearance="outline"
                  startIcon={<Tag />}
                  removable
                  onRemove={() =>
                    setTags((current) => current.filter((t) => t !== tag))
                  }
                >
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The close button is a real <code>&lt;button&gt;</code> with <code>aria-label=&quot;Remove&quot;</code> and <code>stopPropagation</code>, so a clickable parent chip does not also fire.
        </Text>
      </section>

      {/* ── With avatar / user chips ─────────────────────── */}
      <section>
        <SectionHeader>Avatar · user / brand chips</SectionHeader>
        <PreviewRow
          code={`<Chip avatar={<Avatar>AR</Avatar>}>Anika R.</Chip>

<Chip
  avatar={<img src={url} alt="" className="h-full w-full object-cover" />}
  variant="info"
  appearance="outline"
  size="lg"
>
  Jordan P. · Designer
</Chip>`}
        >
          <Chip
            avatar={
              <span className="flex h-full w-full items-center justify-center bg-surface-brand text-[10px] font-semibold text-content-on-brand">
                AR
              </span>
            }
          >
            Anika R.
          </Chip>
          <Chip
            avatar={
              <span className="flex h-full w-full items-center justify-center bg-surface-success text-[10px] font-semibold text-content-on-brand">
                <Person size={12} />
              </span>
            }
            removable
            onRemove={() => undefined}
          >
            Karthik N.
          </Chip>
          <Chip
            avatar={
              <img
                src="https://api.dicebear.com/9.x/initials/svg?seed=JP&backgroundColor=2563eb&textColor=ffffff"
                alt=""
                className="h-full w-full object-cover"
              />
            }
            variant="info"
            appearance="outline"
            size="lg"
          >
            Jordan P. · Designer
          </Chip>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The avatar slot is rounded and flush with the chip's leading edge. Drop any node — initials, an image, or a small icon wrapper.
        </Text>
      </section>

      {/* ── Loading / disabled ─────────────────────────────── */}
      <section>
        <SectionHeader>Loading & disabled</SectionHeader>
        <PreviewRow
          code={`<Chip loading={pending} onClick={save} variant="primary">
  {pending ? 'Saving…' : 'Click to simulate'}
</Chip>

<Chip loading variant="success" startIcon={<Check />}>Verifying</Chip>

<Chip disabled variant="primary">Disabled</Chip>
<Chip disabled selected variant="success">Disabled · selected</Chip>
<Chip disabled removable onRemove={…}>Disabled · removable</Chip>`}
        >
          <Chip loading={pending} onClick={triggerLoading} variant="primary">
            {pending ? 'Saving…' : 'Click to simulate'}
          </Chip>
          <Chip loading variant="success" startIcon={<Check />}>
            Verifying
          </Chip>
          <Chip disabled variant="primary">Disabled</Chip>
          <Chip disabled selected variant="success">Disabled · selected</Chip>
          <Chip disabled removable onRemove={() => undefined}>Disabled · removable</Chip>
        </PreviewRow>
      </section>

      {/* ── Polymorphic ────────────────────────────────────── */}
      <section>
        <SectionHeader>Polymorphism · the `as` prop</SectionHeader>
        <PreviewRow
          code={`<Chip
  as="a"
  href="https://example.com"
  target="_blank"
  rel="noreferrer"
  variant="info"
  appearance="outline"
  startIcon={<Location />}
>
  Open in Maps
</Chip>

<Chip as="button" type="submit" variant="primary">Submit form</Chip>`}
        >
          <Chip
            as="a"
            href="https://example.com"
            target="_blank"
            rel="noreferrer"
            variant="info"
            appearance="outline"
            startIcon={<Location />}
          >
            Open in Maps
          </Chip>
          <Chip as="button" type="submit" variant="primary">
            Submit form
          </Chip>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Pass any element type to <code>as</code>. TypeScript narrows the rest of the props to that element — only the anchor variant accepts <code>href</code>.
        </Text>
      </section>

      {/* ── Orientation ───────────────────────────────────── */}
      <section>
        <SectionHeader>ChipGroup · vertical orientation</SectionHeader>
        <div className="rounded-xl border border-stroke bg-surface-elevated p-5">
          <ChipGroup
            selectionMode="single"
            defaultValue="economy"
            orientation="vertical"
            aria-label="Cabin class"
          >
            <Chip value="economy" appearance="outline">Economy</Chip>
            <Chip value="premium" appearance="outline">Premium economy</Chip>
            <Chip value="business" appearance="outline">Business</Chip>
            <Chip value="first" appearance="outline">First</Chip>
          </ChipGroup>
        </div>
      </section>

      {/* ── In context ───────────────────────────────────── */}
      <section>
        <SectionHeader>In context · Search filter bar</SectionHeader>
        <div className="rounded-xl border border-stroke bg-surface-elevated p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-content-muted" />
              <Text variant="body-sm" fontWeight="semibold">
                Active filters
              </Text>
            </div>
            <Chip variant="info" appearance="soft" size="sm">
              4 results
            </Chip>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip variant="default" appearance="outline" removable onRemove={() => undefined}>
              Direct flights
            </Chip>
            <Chip variant="default" appearance="outline" removable onRemove={() => undefined}>
              Under ₹6,000
            </Chip>
            <Chip variant="default" appearance="outline" removable onRemove={() => undefined}>
              Morning departures
            </Chip>
            <Chip variant="default" appearance="outline" removable onRemove={() => undefined}>
              IndiGo only
            </Chip>
            <Chip variant="info" appearance="soft">
              + Add filter
            </Chip>
          </div>
        </div>
      </section>

      {/* ── Badge vs Chip ────────────────────────────────── */}
      <section>
        <SectionHeader>Badge vs Chip · when to pick which</SectionHeader>
        <div className="grid gap-4 rounded-xl border border-stroke bg-surface-elevated p-5 md:grid-cols-2">
          <div>
            <Text variant="body-sm" fontWeight="semibold" gutterBottom>
              Use Badge
            </Text>
            <Text variant="body-sm" color="secondary">
              For read-only status, counts, and inline labels. Non-interactive by default. Smaller (20 / 24 / 28 px). Supports <code>dot</code>, <code>status</code>, and <code>count</code>.
            </Text>
          </div>
          <div>
            <Text variant="body-sm" fontWeight="semibold" gutterBottom>
              Use Chip
            </Text>
            <Text variant="body-sm" color="secondary">
              For selection, filters, and tags. Interactive by default. Larger (28 / 32 / 40 px). Supports <code>selected</code>, <code>avatar</code>, and group selection via <code>&lt;ChipGroup&gt;</code>.
            </Text>
          </div>
        </div>
      </section>

      {/* ── Accessibility ────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Toggled state.</strong> Selected chips set <code>aria-pressed=&quot;true&quot;</code>. Pair with the visible check glyph for redundancy with screen readers.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Group label.</strong> <code>&lt;ChipGroup&gt;</code> renders <code>role=&quot;group&quot;</code>. Pass <code>aria-label</code> or <code>aria-labelledby</code> so assistive tech can announce the group's purpose.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Remove button.</strong> Real <code>&lt;button&gt;</code> with <code>aria-label=&quot;Remove&quot;</code>, a visible focus ring, and <code>stopPropagation</code> to avoid double-firing.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Loading.</strong> Sets <code>aria-busy=&quot;true&quot;</code>; selection and remove handlers are suppressed for the duration.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong> Native button semantics — Enter / Space activate. When <code>as</code> renders a non-button, the chip falls back to <code>role=&quot;button&quot;</code>, <code>tabIndex=0</code>, and manual key handling.
          </Text>
        </div>
      </section>

      {/* ── Props ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Props · Chip</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
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
          {CHIP_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Text
                  variant="body-xs"
                  fontFamily="mono"
                  color="secondary"
                  className="wrap-break-word"
                >
                  {type}
                </Text>
                <Text variant="body-sm" color="secondary">
                  {description}
                </Text>
              </div>
              <Text
                variant="body-xs"
                fontFamily="mono"
                color={defaultValue ? 'inherit' : 'muted'}
              >
                {defaultValue ?? '—'}
              </Text>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Props · ChipGroup</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
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
          {GROUP_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Text
                  variant="body-xs"
                  fontFamily="mono"
                  color="secondary"
                  className="wrap-break-word"
                >
                  {type}
                </Text>
                <Text variant="body-sm" color="secondary">
                  {description}
                </Text>
              </div>
              <Text
                variant="body-xs"
                fontFamily="mono"
                color={defaultValue ? 'inherit' : 'muted'}
              >
                {defaultValue ?? '—'}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Imports ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named imports"
            code={`import { Chip, ChipGroup } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Chip, ChipGroup } from '@swift/components/Chip'`}
          />
          <CopyableImport
            label="With types"
            code={`import {
  Chip,
  ChipGroup,
  type ChipProps,
  type ChipVariant,
} from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`// Standalone toggle
<Chip selected={favourited} onSelectedChange={setFavourited}>
  Add to favourites
</Chip>

// Multi-select filter group
<ChipGroup
  value={filters}
  onValueChange={setFilters}
  selectionMode="multiple"
  aria-label="Transit"
>
  <Chip value="flight" startIcon={<Flight />}>Flights</Chip>
  <Chip value="train" startIcon={<Train />}>Trains</Chip>
</ChipGroup>

// Single-select sort
<ChipGroup
  value={sortBy}
  onValueChange={setSortBy}
  selectionMode="single"
>
  <Chip value="cheapest" appearance="outline">Cheapest</Chip>
  <Chip value="fastest" appearance="outline">Fastest</Chip>
</ChipGroup>

// Removable tag
<Chip removable onRemove={handleRemove}>React</Chip>

// User chip with avatar
<Chip avatar={<img src="..." alt="" />}>Anika R.</Chip>`}
        />
      </section>
    </div>
  )
}
