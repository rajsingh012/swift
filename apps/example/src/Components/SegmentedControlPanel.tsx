import { useState } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Badge } from '@swift/components/Badge'
import { Text } from '@swift/components/Text'
import { Flight } from '@swift/icons/Flight'
import { Hotel } from '@swift/icons/Hotel'
import { Train } from '@swift/icons/Train'
import { GridSmall } from '@swift/icons/GridSmall'
import { View } from '@swift/icons/View'
import { CopyableImport } from '../lib/CopyableImport'
import { BrowserCompat, CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'A single-selection control — a hybrid of Tabs and a Radio Group. Built on role="radiogroup" / role="radio" with aria-checked, full keyboard navigation (Arrow / Home / End / Space / Enter with selection-follows-focus), and an animated pill that slides behind the selected segment. Horizontal & vertical orientation, three sizes, fit / equal / full width layouts, disabled & read-only states, RTL-aware navigation, hidden-input form submission, asChild for custom segment elements, ref forwarding, and a fully token-driven theme. Icons, labels, and badges are just children — no special API.'

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'value',
    type: 'string',
    description:
      'Controlled selected value. When provided, the component never updates its own state — call onValueChange and feed the next value back.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description:
      'Uncontrolled initial value. If neither value nor defaultValue is supplied, the first non-disabled item is selected automatically on mount — a segmented control always shows a selection.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Fires after each selection with the next value.',
  },
  {
    name: 'orientation',
    type: `'horizontal' | 'vertical'`,
    defaultValue: `'horizontal'`,
    description:
      'Layout direction. Affects keyboard nav (Left/Right vs Up/Down) and the axis items stack on.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description: 'Drives height, padding, and font-size via tokens.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Disable the whole control — no item can be selected and arrow navigation is inert. Cascades onto every item.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Focusable but immutable — items receive focus but selection attempts (click, arrows, Space/Enter) are ignored.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Stretch to fill the container; items share the available width equally. Common on mobile.',
  },
  {
    name: 'equalWidth',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Every item takes the width of the widest item while the container stays content-sized. Ignored when fullWidth is set.',
  },
  {
    name: 'loop',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Whether arrow navigation wraps at the ends. Set false to stop at the first / last non-disabled item.',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Renders a hidden input so the selected value submits with the surrounding form.',
  },
  {
    name: 'dir',
    type: `'ltr' | 'rtl'`,
    description:
      'Explicit direction. When omitted, the closest [dir] ancestor is sniffed on mount. RTL flips horizontal arrow handling and pill movement.',
  },
  {
    name: 'classes',
    type: '{ root?, item?, indicator? }',
    description:
      'Slot-level className overrides. Composes with the built-in classes.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLDivElement>',
    description: 'Forwarded to the root <div>.',
  },
]

const ITEM_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'value',
    type: 'string',
    description: 'Identifies this segment. Must be unique within the root.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Marks the item inert — skipped by arrow navigation, sets aria-disabled, dims the chrome.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      "Render the consumer's single child element instead of a <button>, with all roles / aria / handlers cloned on.",
  },
  {
    name: 'className / ref',
    type: 'string / Ref<HTMLButtonElement>',
    description: 'Standard pass-through.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Label, icon, icon + label, or a badge — any combination.',
  },
]

const COMPOUND_PARTS: ReadonlyArray<{ name: string; summary: string }> = [
  {
    name: 'SegmentedControl.Item',
    summary:
      'role="radio" button. Implements roving tabindex (only the checked item is Tab-reachable). Registers itself with the root so the indicator and keyboard nav can find it. Accepts any children — text, an icon, an icon + label, or a badge.',
  },
  {
    name: 'SegmentedControl.Indicator',
    summary:
      'Optional sliding pill that sits behind the checked item. Matches the item box on both axes, so the same component works horizontal & vertical. Positioned imperatively (no per-frame React render) and re-measured on resize. Drop it anywhere inside the root.',
  },
]

const KEYS: ReadonlyArray<{ key: string; action: string }> = [
  { key: '→ / ↓', action: 'Move selection to the next item' },
  { key: '← / ↑', action: 'Move selection to the previous item' },
  { key: 'Home', action: 'Select the first item' },
  { key: 'End', action: 'Select the last item' },
  { key: 'Space / Enter', action: 'Select the focused item' },
  { key: 'Tab', action: 'Enter / leave the group (lands on the selected item)' },
]

export function SegmentedControlPanel() {
  const [view, setView] = useState('grid')
  const [submitted, setSubmitted] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          SegmentedControl
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Basic · uncontrolled ──────────────────────────────────── */}
      <section>
        <SectionHeader>Basic · uncontrolled</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Drop in <code>{'<SegmentedControl.Item>'}</code>s and an optional{' '}
          <code>{'<SegmentedControl.Indicator>'}</code>. With no{' '}
          <code>defaultValue</code>, the first item is selected automatically.
        </Text>
        <PreviewRow
          code={`<SegmentedControl defaultValue="week">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
  <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
  <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
</SegmentedControl>`}
        >
          <SegmentedControl defaultValue="week">
            <SegmentedControl.Indicator />
            <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
            <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
          </SegmentedControl>
        </PreviewRow>
      </section>

      {/* ── Controlled ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Controlled</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Own the value with <code>value</code> + <code>onValueChange</code>.
          The component never mutates its own state in controlled mode.
        </Text>
        <PreviewRow
          code={`const [view, setView] = useState('grid')

<SegmentedControl value={view} onValueChange={setView}>
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
  <SegmentedControl.Item value="list">List</SegmentedControl.Item>
</SegmentedControl>`}
        >
          <div className="flex flex-col gap-3">
            <SegmentedControl value={view} onValueChange={setView}>
              <SegmentedControl.Indicator />
              <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
              <SegmentedControl.Item value="list">List</SegmentedControl.Item>
            </SegmentedControl>
            <Text variant="body-sm" color="muted">
              Selected: <code>{view}</code>
            </Text>
          </div>
        </PreviewRow>
      </section>

      {/* ── Icon + label ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Icon + label</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Icons and labels are plain children — common in travel products.
        </Text>
        <PreviewRow
          code={`<SegmentedControl defaultValue="flights">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="flights"><Flight size={16} />Flights</SegmentedControl.Item>
  <SegmentedControl.Item value="hotels"><Hotel size={16} />Hotels</SegmentedControl.Item>
  <SegmentedControl.Item value="trains"><Train size={16} />Trains</SegmentedControl.Item>
</SegmentedControl>`}
        >
          <SegmentedControl defaultValue="flights">
            <SegmentedControl.Indicator />
            <SegmentedControl.Item value="flights">
              <Flight size={16} />
              Flights
            </SegmentedControl.Item>
            <SegmentedControl.Item value="hotels">
              <Hotel size={16} />
              Hotels
            </SegmentedControl.Item>
            <SegmentedControl.Item value="trains">
              <Train size={16} />
              Trains
            </SegmentedControl.Item>
          </SegmentedControl>
        </PreviewRow>
      </section>

      {/* ── Icon-only ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Icon-only</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          For compact view-switchers, pass an icon alone and label each item
          with <code>aria-label</code> for screen readers.
        </Text>
        <PreviewRow
          code={`<SegmentedControl defaultValue="grid" aria-label="View mode">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="grid" aria-label="Grid view"><GridSmall size={16} /></SegmentedControl.Item>
  <SegmentedControl.Item value="list" aria-label="List view"><View size={16} /></SegmentedControl.Item>
</SegmentedControl>`}
        >
          <SegmentedControl defaultValue="grid" aria-label="View mode">
            <SegmentedControl.Indicator />
            <SegmentedControl.Item value="grid" aria-label="Grid view">
              <GridSmall size={16} />
            </SegmentedControl.Item>
            <SegmentedControl.Item value="list" aria-label="List view">
              <View size={16} />
            </SegmentedControl.Item>
          </SegmentedControl>
        </PreviewRow>
      </section>

      {/* ── With badge ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>With badge</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Useful for filter counts — compose any <code>{'<Badge>'}</code> into
          the item.
        </Text>
        <PreviewRow
          code={`<SegmentedControl defaultValue="all">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="all">All <Badge size="sm">12</Badge></SegmentedControl.Item>
  <SegmentedControl.Item value="open">Open <Badge size="sm">3</Badge></SegmentedControl.Item>
  <SegmentedControl.Item value="closed">Closed <Badge size="sm">9</Badge></SegmentedControl.Item>
</SegmentedControl>`}
        >
          <SegmentedControl defaultValue="all">
            <SegmentedControl.Indicator />
            <SegmentedControl.Item value="all">
              All <Badge size="sm">12</Badge>
            </SegmentedControl.Item>
            <SegmentedControl.Item value="open">
              Open <Badge size="sm">3</Badge>
            </SegmentedControl.Item>
            <SegmentedControl.Item value="closed">
              Closed <Badge size="sm">9</Badge>
            </SegmentedControl.Item>
          </SegmentedControl>
        </PreviewRow>
      </section>

      {/* ── Sizes ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Sizes</SectionHeader>
        <PreviewRow
          code={`<SegmentedControl size="sm" defaultValue="a">…</SegmentedControl>
<SegmentedControl size="md" defaultValue="a">…</SegmentedControl>
<SegmentedControl size="lg" defaultValue="a">…</SegmentedControl>`}
        >
          <div className="flex w-full flex-col items-start gap-4">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size} className="flex flex-col items-start gap-1">
                <SegmentedControl size={size} defaultValue="a">
                  <SegmentedControl.Indicator />
                  <SegmentedControl.Item value="a">First</SegmentedControl.Item>
                  <SegmentedControl.Item value="b">Second</SegmentedControl.Item>
                  <SegmentedControl.Item value="c">Third</SegmentedControl.Item>
                </SegmentedControl>
                <Text variant="body-xs" color="muted">
                  {size}
                </Text>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Width modes ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Width modes</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>fit</code> (default) sizes each item to its content;{' '}
          <code>equalWidth</code> makes every item as wide as the widest;{' '}
          <code>fullWidth</code> stretches to fill the container.
        </Text>
        <PreviewRow
          code={`{/* fit content (default) */}
<SegmentedControl defaultValue="a">…</SegmentedControl>

{/* every item = widest item */}
<SegmentedControl equalWidth defaultValue="a">…</SegmentedControl>

{/* fill the container */}
<SegmentedControl fullWidth defaultValue="a">…</SegmentedControl>`}
        >
          <div className="flex w-full flex-col gap-4">
            {(
              [
                { label: 'fit (default)', props: {} },
                { label: 'equalWidth', props: { equalWidth: true } },
                { label: 'fullWidth', props: { fullWidth: true } },
              ] as const
            ).map(({ label, props }) => (
              <div key={label} className="flex flex-col items-start gap-1">
                <SegmentedControl defaultValue="a" {...props}>
                  <SegmentedControl.Indicator />
                  <SegmentedControl.Item value="a">Short</SegmentedControl.Item>
                  <SegmentedControl.Item value="b">A longer label</SegmentedControl.Item>
                  <SegmentedControl.Item value="c">Mid</SegmentedControl.Item>
                </SegmentedControl>
                <Text variant="body-xs" color="muted">
                  {label}
                </Text>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Vertical ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Vertical orientation</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Items stack vertically; the pill slides on the Y axis and arrow nav
          switches to Up / Down.
        </Text>
        <PreviewRow
          code={`<SegmentedControl orientation="vertical" defaultValue="profile">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="profile">Profile</SegmentedControl.Item>
  <SegmentedControl.Item value="account">Account</SegmentedControl.Item>
  <SegmentedControl.Item value="billing">Billing</SegmentedControl.Item>
</SegmentedControl>`}
        >
          <SegmentedControl orientation="vertical" defaultValue="profile">
            <SegmentedControl.Indicator />
            <SegmentedControl.Item value="profile">Profile</SegmentedControl.Item>
            <SegmentedControl.Item value="account">Account</SegmentedControl.Item>
            <SegmentedControl.Item value="billing">Billing</SegmentedControl.Item>
          </SegmentedControl>
        </PreviewRow>
      </section>

      {/* ── Disabled ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Disabled · whole control & single item</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>disabled</code> on the root makes the whole control inert and
          cascades to items. <code>disabled</code> on a single item keeps it
          out of selection and arrow navigation.
        </Text>
        <PreviewRow
          code={`<SegmentedControl disabled defaultValue="a">…</SegmentedControl>

<SegmentedControl defaultValue="standard">
  <SegmentedControl.Item value="standard">Standard</SegmentedControl.Item>
  <SegmentedControl.Item value="premium" disabled>Premium</SegmentedControl.Item>
  <SegmentedControl.Item value="enterprise">Enterprise</SegmentedControl.Item>
</SegmentedControl>`}
        >
          <div className="flex flex-col items-start gap-3">
            <SegmentedControl disabled defaultValue="a">
              <SegmentedControl.Indicator />
              <SegmentedControl.Item value="a">First</SegmentedControl.Item>
              <SegmentedControl.Item value="b">Second</SegmentedControl.Item>
            </SegmentedControl>
            <SegmentedControl defaultValue="standard">
              <SegmentedControl.Indicator />
              <SegmentedControl.Item value="standard">Standard</SegmentedControl.Item>
              <SegmentedControl.Item value="premium" disabled>
                Premium
              </SegmentedControl.Item>
              <SegmentedControl.Item value="enterprise">Enterprise</SegmentedControl.Item>
            </SegmentedControl>
          </div>
        </PreviewRow>
      </section>

      {/* ── Read-only ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Read-only</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          The control can receive focus but its value can&apos;t change — handy
          for displaying a locked-in choice that still needs to be reachable.
        </Text>
        <PreviewRow code={`<SegmentedControl readOnly defaultValue="b">…</SegmentedControl>`}>
          <SegmentedControl readOnly defaultValue="b">
            <SegmentedControl.Indicator />
            <SegmentedControl.Item value="a">One</SegmentedControl.Item>
            <SegmentedControl.Item value="b">Two</SegmentedControl.Item>
            <SegmentedControl.Item value="c">Three</SegmentedControl.Item>
          </SegmentedControl>
        </PreviewRow>
      </section>

      {/* ── RTL ───────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>RTL</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Pass <code>dir=&quot;rtl&quot;</code> (or nest under an RTL ancestor).
          Arrow keys and the pill movement reverse to match reading direction.
        </Text>
        <PreviewRow code={`<SegmentedControl dir="rtl" defaultValue="day">…</SegmentedControl>`}>
          <SegmentedControl dir="rtl" defaultValue="day">
            <SegmentedControl.Indicator />
            <SegmentedControl.Item value="day">يوم</SegmentedControl.Item>
            <SegmentedControl.Item value="week">أسبوع</SegmentedControl.Item>
            <SegmentedControl.Item value="month">شهر</SegmentedControl.Item>
          </SegmentedControl>
        </PreviewRow>
      </section>

      {/* ── Form submission ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Form submission</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Set <code>name</code> and the selected value is mirrored into a
          hidden input, so it submits with the surrounding form like any
          native control.
        </Text>
        <PreviewRow
          code={`<form onSubmit={handleSubmit}>
  <SegmentedControl name="view" defaultValue="grid">
    <SegmentedControl.Indicator />
    <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
    <SegmentedControl.Item value="list">List</SegmentedControl.Item>
    <SegmentedControl.Item value="map">Map</SegmentedControl.Item>
  </SegmentedControl>
  <button type="submit">Submit</button>
</form>`}
        >
          <form
            className="flex flex-wrap items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              const data = new FormData(e.currentTarget)
              setSubmitted(String(data.get('view')))
            }}
          >
            <SegmentedControl name="view" defaultValue="grid">
              <SegmentedControl.Indicator />
              <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
              <SegmentedControl.Item value="list">List</SegmentedControl.Item>
              <SegmentedControl.Item value="map">Map</SegmentedControl.Item>
            </SegmentedControl>
            <button
              type="submit"
              className="rounded-md border border-stroke bg-surface-elevated px-3 py-1.5 text-sm font-medium text-content-strong hover:bg-surface-muted"
            >
              Submit
            </button>
            {submitted ? (
              <Text variant="body-sm" color="muted">
                Submitted <code>view={submitted}</code>
              </Text>
            ) : null}
          </form>
        </PreviewRow>
      </section>

      {/* ── asChild ───────────────────────────────────────────────── */}
      <section>
        <SectionHeader>asChild · custom segment element</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Render a segment as your own element (a link, a styled wrapper) while
          keeping the radio role, <code>aria-checked</code>, roving tabindex,
          and handlers.
        </Text>
        <PreviewRow
          code={`<SegmentedControl defaultValue="docs">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="docs" asChild>
    <a href="#docs">Docs</a>
  </SegmentedControl.Item>
  <SegmentedControl.Item value="api" asChild>
    <a href="#api">API</a>
  </SegmentedControl.Item>
</SegmentedControl>`}
        >
          <SegmentedControl defaultValue="docs">
            <SegmentedControl.Indicator />
            <SegmentedControl.Item value="docs" asChild>
              <a href="#docs">Docs</a>
            </SegmentedControl.Item>
            <SegmentedControl.Item value="api" asChild>
              <a href="#api">API</a>
            </SegmentedControl.Item>
          </SegmentedControl>
        </PreviewRow>
      </section>

      {/* ── Keyboard ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Keyboard</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {KEYS.map(({ key, action }) => (
            <div
              key={key}
              className="grid gap-2 border-b border-stroke-muted px-6 py-3 last:border-0 md:grid-cols-[200px_1fr] md:items-center md:gap-6"
            >
              <kbd className="w-fit rounded-md border border-stroke-strong bg-surface-muted px-2 py-0.5 font-mono text-xs text-content-strong">
                {key}
              </kbd>
              <Text variant="body-sm" color="secondary">
                {action}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Accessibility ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Radio-group semantics.</strong>{' '}
            The root is <code>role=&quot;radiogroup&quot;</code> and each item is{' '}
            <code>role=&quot;radio&quot;</code> with <code>aria-checked</code> —
            screen readers announce &quot;radio button, N of M&quot;, the correct
            mental model for a single-choice control.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Roving tabindex.</strong>{' '}
            Only the selected item is in the Tab order; once focused, the arrow
            keys move between items (selection follows focus, like native
            radios). <code>Tab</code> then leaves the group.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Disabled vs read-only.</strong>{' '}
            Disabled items set <code>aria-disabled</code> and are skipped by
            arrow nav. A <code>readOnly</code> control still takes focus but
            ignores every selection attempt.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Icon-only items.</strong>{' '}
            Give each icon-only item an <code>aria-label</code> so its purpose
            is announced.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion.</strong>{' '}
            <code>prefers-reduced-motion: reduce</code> collapses the pill
            slide and colour transitions to ~1ms — the selection still updates,
            just without movement.
          </Text>
        </div>
      </section>

      {/* ── Props · SegmentedControl ──────────────────────────────── */}
      <section>
        <SectionHeader>Props · SegmentedControl</SectionHeader>
        <PropsTable rows={ROOT_PROPS} />
      </section>

      {/* ── Props · SegmentedControl.Item ─────────────────────────── */}
      <section>
        <SectionHeader>Props · SegmentedControl.Item</SectionHeader>
        <PropsTable rows={ITEM_PROPS} />
      </section>

      {/* ── Compound parts ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Compose these inside <code>{'<SegmentedControl>'}</code>. Each is
          exported off the root.
        </Text>
        <div className="grid gap-3">
          {COMPOUND_PARTS.map(({ name, summary }) => (
            <div
              key={name}
              className="rounded-xl border border-stroke bg-surface-elevated px-6 py-4"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="bold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary" className="mt-1 block">
                {summary}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Theme tokens ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Theme tokens · reference</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Set on <code>.swift-segmented</code> — override per-instance via
          inline <code>style</code>, or globally via a higher-level selector.
        </Text>
        <CodeBlock
          code={`/* Layout */
--segmented-radius         /* default var(--radius-full) — pill track */
--segmented-padding        /* default 0.3125rem — inset around the pill */
--segmented-gap            /* default 0 */

/* Track + pill */
--segmented-bg             /* default var(--color-surface-elevated) — white track */
--segmented-shadow         /* default var(--shadow-level2) — track float */
--segmented-indicator-bg   /* default var(--color-surface-brand) — the pill */
--segmented-indicator-radius
--segmented-indicator-shadow

/* Item text */
--segmented-item-color           /* default var(--color-content-brand) */
--segmented-item-active-color    /* default var(--color-content-on-brand) */
--segmented-item-disabled-color
--segmented-item-bg-hover        /* default var(--color-surface-brand-muted) */

/* Motion */
--segmented-transition-duration  /* default 200ms */
--segmented-transition-ease`}
        />
      </section>

      {/* ── Browser compatibility ─────────────────────────────────── */}
      <section>
        <SectionHeader>Browser compatibility</SectionHeader>
        <BrowserCompat
          features={[
            {
              name: 'ResizeObserver',
              notes:
                'Re-measures the sliding pill when the container or active item changes size (font load, viewport resize, token override).',
              support: 'Chrome 64+ · Safari 13.1+ · Firefox 69+',
            },
            {
              name: 'CSS custom properties',
              notes:
                'Every dimension and colour resolves through a --segmented-* token, so per-instance and global theming work without recompiling.',
              support: 'Universal',
            },
            {
              name: 'Element.offsetLeft / offsetTop',
              notes:
                'The pill is positioned imperatively from the active item\'s offset box — direction-correct, so RTL needs no special-casing.',
              support: 'Universal',
            },
            {
              name: 'prefers-reduced-motion',
              notes: 'Collapses the pill slide + colour transitions to ~1ms.',
              support: 'Universal',
            },
          ]}
          caveats={[
            'The indicator is opt-in: render <SegmentedControl.Indicator /> for the sliding pill. Without it, selection still works — there is just no animated background.',
            'Selection follows focus (native-radio behaviour): arrow keys move AND select in one step. There is no manual-activation mode in v1.',
            'When the whole control is uncontrolled with no defaultValue, the first non-disabled item is auto-selected on mount.',
          ]}
        />
      </section>

      {/* ── Import ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { SegmentedControl } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { SegmentedControl } from '@swift/components/SegmentedControl'`}
          />
          <CopyableImport
            label="With types"
            code={`import {
  SegmentedControl,
  type SegmentedControlRootProps,
  type SegmentedControlItemProps,
  type SegmentedControlSize,
  type SegmentedControlOrientation,
} from '@swift/components/SegmentedControl'`}
          />
        </div>
      </section>

      {/* ── Usage ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`// Uncontrolled — most common.
<SegmentedControl defaultValue="day">
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
  <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
  <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
</SegmentedControl>

// Controlled.
const [view, setView] = useState('grid')
<SegmentedControl value={view} onValueChange={setView}>
  <SegmentedControl.Indicator />
  <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
  <SegmentedControl.Item value="list">List</SegmentedControl.Item>
</SegmentedControl>

// In a form — submits as a hidden input.
<form>
  <SegmentedControl name="view" defaultValue="grid" fullWidth>
    <SegmentedControl.Indicator />
    <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
    <SegmentedControl.Item value="list">List</SegmentedControl.Item>
  </SegmentedControl>
</form>`}
        />
      </section>
    </div>
  )
}

function PropsTable({ rows }: { rows: ReadonlyArray<PropRow> }) {
  return (
    <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
      <div className="hidden grid-cols-[200px_1fr_140px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
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
      {rows.map(({ name, type, defaultValue, description }) => (
        <div
          key={name}
          className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_140px] md:items-start md:gap-6"
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
  )
}
