import { useState } from 'react'
import { Badge } from '@swift/components/Badge'
import { Button } from '@swift/components/Button'
import { Card } from '@swift/components/Card'
import { Text } from '@swift/components/Text'
import { Alert } from '@swift/icons/Alert'
import { ArrowRight } from '@swift/icons/ArrowRight'
import { Check } from '@swift/icons/Check'
import { Flash } from '@swift/icons/Flash'
import { InfoCircle } from '@swift/icons/InfoCircle'
import { Notifications } from '@swift/icons/Notifications'
import { Person } from '@swift/icons/Person'
import { Star } from '@swift/icons/Star'
import { Tag } from '@swift/icons/Tag'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

type BadgeKnobVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

const BADGE_KNOBS: ReadonlyArray<Knob> = [
  {
    type: 'select',
    name: 'variant',
    options: ['default', 'success', 'warning', 'error', 'info'],
    defaultValue: 'default',
  },
  {
    type: 'segmented',
    name: 'appearance',
    options: ['solid', 'soft', 'outline', 'subtle'],
    defaultValue: 'soft',
  },
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', name: 'pill' },
  { type: 'text', name: 'children', defaultValue: 'New', asChildren: true },
]

const DESCRIPTION =
  'Compact status, count, and label element. Five variants × four appearances × three sizes, with built-in support for dots, counts, icons, removable chips, and clickable affordances. Themes automatically under [data-theme="dark"].'

const VARIANTS: ReadonlyArray<{
  name: 'default' | 'success' | 'warning' | 'error' | 'info'
  use: string
  label: string
}> = [
  { name: 'default', use: 'Generic · neutral label', label: 'New' },
  { name: 'success', use: 'Active · completed · healthy', label: 'Active' },
  { name: 'warning', use: 'Pending · attention required', label: 'Pending' },
  { name: 'error', use: 'Failed · destructive · critical', label: 'Failed' },
  { name: 'info', use: 'Informational · highlight', label: 'Beta' },
]

const APPEARANCES: ReadonlyArray<{
  name: 'solid' | 'soft' | 'outline' | 'subtle'
  use: string
}> = [
  { name: 'solid', use: 'High emphasis · filled' },
  { name: 'soft', use: 'Default · tinted background (recommended)' },
  { name: 'outline', use: 'Stroke-only · ghost surface' },
  { name: 'subtle', use: 'Text-only · no chrome' },
]

const SIZES: ReadonlyArray<{
  size: 'sm' | 'md' | 'lg'
  height: string
}> = [
  { size: 'sm', height: '20px' },
  { size: 'md', height: '24px' },
  { size: 'lg', height: '28px' },
]

const BADGE_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'variant',
    type: `'default' | 'success' | 'warning' | 'error' | 'info'`,
    defaultValue: `'default'`,
    description:
      'Semantic colour. Maps to project palettes (success / warning / critical / highlight / neutral) so every variant themes together under [data-theme="dark"]. Overridden if `status` is set.',
  },
  {
    name: 'appearance',
    type: `'solid' | 'soft' | 'outline' | 'subtle'`,
    defaultValue: `'soft'`,
    description:
      'Visual treatment. `soft` is the recommended default — tinted background with readable accent text. Use `solid` for emphasis on neutral surfaces and `subtle` for inline labels next to body text.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Fixed-height sizing: 20 / 24 / 28 px. Drives padding, font size, gap, and the dot / icon scale.',
  },
  {
    name: 'radius',
    type: `'sm' | 'md' | 'full'`,
    defaultValue: `'md'`,
    description:
      'Corner radius. `full` produces a pill — equivalent to passing `pill`.',
  },
  {
    name: 'pill',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Shorthand for `radius="full"`. Wins over `radius` if both passed.',
  },
  {
    name: 'dot',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Renders a leading coloured dot before the children. Colour follows the variant.',
  },
  {
    name: 'status',
    type: `'online' | 'offline' | 'away' | 'busy'`,
    description:
      'Renders a dot-only status indicator. Maps onto variant colours (online → success, offline → default, away → warning, busy → error). With no children, the badge collapses to a coloured dot and receives a sensible aria-label.',
  },
  {
    name: 'count',
    type: 'number',
    description:
      'Numeric content — replaces children. Capped by `max`. Pair with `pill` for the classic notification pip.',
  },
  {
    name: 'max',
    type: 'number',
    defaultValue: '99',
    description: 'Cap for `count`. Anything above renders as `${max}+` (e.g. 120 with max=99 → "99+").',
  },
  {
    name: 'startIcon',
    type: 'ReactNode',
    description:
      'Leading icon. Wrapped in an `aria-hidden` span sized to the badge. Suppressed when `dot` or `loading` is set.',
  },
  {
    name: 'endIcon',
    type: 'ReactNode',
    description:
      'Trailing icon. Suppressed when `removable` is set — the close button takes that slot.',
  },
  {
    name: 'removable',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Renders a trailing close button. Pair with `onRemove` for behaviour. The button stops propagation so a clickable badge does not also fire onClick.',
  },
  {
    name: 'onRemove',
    type: '(e: MouseEvent<HTMLButtonElement>) => void',
    description: 'Callback fired by the close button. Suppressed when disabled or loading.',
  },
  {
    name: 'clickable',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Adds button semantics — role="button", tabIndex=0, and Enter/Space keyboard activation. The root stays a `<span>` so a removable + clickable badge does not nest buttons.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Replaces the leading slot with a spinner. Sets aria-busy and blocks remove/click.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Standard disabled state. Lowers opacity, sets aria-disabled, and blocks interaction.',
  },
  {
    name: 'as',
    type: 'ElementType',
    defaultValue: `'span'`,
    description:
      'Polymorphic element override. Use "a" to render an anchor or a router component for client-side navigation. TypeScript narrows the rest of the props to that element.',
  },
  {
    name: 'classes',
    type: '{ root?, dot?, startIcon?, endIcon?, label?, removeButton? }',
    description:
      'Slot-level className overrides. Composes with the built-in classes — your overrides win cascade order.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Appended to the root after variant/size classes. Equivalent to `classes.root`.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'The badge label. Replaced by `count` when set, and hidden when the badge is a dot-only `status`.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLElement>',
    description: 'Forwarded to the rendered element.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes of the rendered element',
    description:
      'Anything else (id, role, aria-*, data-*, event handlers) forwards through.',
  },
]

export function BadgePanel() {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript', 'Vite', 'Tailwind'])
  const [clickCount, setClickCount] = useState(0)
  const [showLoading, setShowLoading] = useState(false)

  const triggerLoading = () => {
    setShowLoading(true)
    window.setTimeout(() => setShowLoading(false), 1500)
  }

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Badge
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Badge"
          knobs={BADGE_KNOBS}
          render={(v) => (
            <Badge
              variant={v.variant as BadgeKnobVariant}
              appearance={v.appearance as 'solid' | 'soft' | 'outline' | 'subtle'}
              size={v.size as 'sm' | 'md' | 'lg'}
              pill={v.pill === true}
            >
              {String(v.children)}
            </Badge>
          )}
        />
      </section>

      {/* ── Variants ───────────────────────────────────────────────── */}
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
                <Badge variant={name}>{label}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Appearances ───────────────────────────────────────────── */}
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
                  <Badge key={v} variant={v} appearance={name}>
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The same variant in four different visual weights. <code>soft</code> is the default — it stays legible on every surface and themes cleanly under dark mode.
        </Text>
      </section>

      {/* ── Sizes ───────────────────────────────────────────────── */}
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
                <Badge size={size}>New</Badge>
                <Badge variant="success" size={size}>Active</Badge>
                <Badge variant="info" size={size} dot>Live</Badge>
                <Badge variant="error" size={size} startIcon={<Alert />}>Failed</Badge>
                <Badge variant="warning" size={size} pill>Pending</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Radius / pill ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Radius</SectionHeader>
        <PreviewRow
          code={`<Badge radius="sm" variant="success">sm</Badge>
<Badge radius="md" variant="success">md (default)</Badge>
<Badge radius="full" variant="success">full</Badge>
<Badge pill variant="info">pill shorthand</Badge>`}
        >
          <Badge radius="sm" variant="success">sm</Badge>
          <Badge radius="md" variant="success">md (default)</Badge>
          <Badge radius="full" variant="success">full</Badge>
          <Badge pill variant="info">pill shorthand</Badge>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>pill</code> is shorthand for <code>radius=&quot;full&quot;</code>. Common for notification pips and status pills.
        </Text>
      </section>

      {/* ── Dot ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Dot · leading indicator</SectionHeader>
        <PreviewRow
          code={`<Badge dot variant="success">Online</Badge>
<Badge dot variant="warning">Pending review</Badge>
<Badge dot variant="error">Down</Badge>
<Badge dot variant="info" appearance="outline">Live</Badge>`}
        >
          <Badge dot variant="success">Online</Badge>
          <Badge dot variant="warning">Pending review</Badge>
          <Badge dot variant="error">Down</Badge>
          <Badge dot variant="info" appearance="outline">Live</Badge>
          <Badge dot variant="default" appearance="subtle">Idle</Badge>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The dot colour follows <code>variant</code> regardless of appearance — it stays visible even on subtle backgrounds.
        </Text>
      </section>

      {/* ── Status ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Status · dot-only presence indicators</SectionHeader>
        <PreviewRow
          code={`{/* No children → collapses to a coloured dot.
    Auto-sets aria-label="Status: online" (etc). */}
<Badge status="online" />
<Badge status="away" />
<Badge status="busy" />
<Badge status="offline" />
<Badge status="online" size="lg" />`}
        >
          <div className="flex items-center gap-2">
            <Badge status="online" />
            <Text variant="body-sm">Online</Text>
          </div>
          <div className="flex items-center gap-2">
            <Badge status="away" />
            <Text variant="body-sm">Away</Text>
          </div>
          <div className="flex items-center gap-2">
            <Badge status="busy" />
            <Text variant="body-sm">Busy</Text>
          </div>
          <div className="flex items-center gap-2">
            <Badge status="offline" />
            <Text variant="body-sm" color="muted">Offline</Text>
          </div>
          <div className="flex items-center gap-2">
            <Badge status="online" size="lg" />
            <Text variant="body-sm">Available now</Text>
          </div>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          With no children, <code>status</code> collapses the badge into a coloured dot and sets <code>aria-label=&quot;Status: online&quot;</code> automatically.
        </Text>
      </section>

      {/* ── Count / notification ───────────────────────────────── */}
      <section>
        <SectionHeader>Count · notification pips</SectionHeader>
        <PreviewRow
          code={`<Badge count={3}   variant="error" pill appearance="solid" />
<Badge count={42}  variant="error" pill appearance="solid" />
<Badge count={120} max={99} variant="error" pill appearance="solid" />

{/* Anchored to an icon button */}
<div className="relative inline-flex">
  <Button variant="secondary" iconOnly aria-label="Notifications">
    <Notifications size={20} />
  </Button>
  <Badge
    count={7}
    variant="error"
    pill
    appearance="solid"
    size="sm"
    className="absolute -top-1 -right-1"
  />
</div>`}
        >
          <Badge count={3} variant="error" pill appearance="solid" />
          <Badge count={42} variant="error" pill appearance="solid" />
          <Badge count={120} max={99} variant="error" pill appearance="solid" />
          <div className="relative inline-flex">
            <Button
              variant="secondary"
              iconOnly
              aria-label="Notifications"
              classes={{ root: 'rounded-full' }}
            >
              <Notifications size={20} />
            </Button>
            <Badge
              count={7}
              variant="error"
              pill
              appearance="solid"
              size="sm"
              className="absolute -top-1 -right-1"
            />
          </div>
          <div className="relative inline-flex">
            <Button
              variant="secondary"
              iconOnly
              aria-label="Messages"
              classes={{ root: 'rounded-full' }}
            >
              <Person size={20} />
            </Button>
            <Badge
              count={250}
              max={99}
              variant="error"
              pill
              appearance="solid"
              size="sm"
              className="absolute -top-1 -right-1"
            />
          </div>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>count</code> replaces children. Use <code>max</code> to cap the displayed value — anything above renders as <code>{`${'${max}'}+`}</code>.
        </Text>
      </section>

      {/* ── Icons ───────────────────────────────────────────────── */}
      <section>
        <SectionHeader>With icons</SectionHeader>
        <PreviewRow
          code={`<Badge variant="success" startIcon={<Check />}>Verified</Badge>
<Badge variant="info"    startIcon={<InfoCircle />}>Beta</Badge>
<Badge variant="warning" startIcon={<Alert />}>Action required</Badge>
<Badge variant="default" endIcon={<ArrowRight />} clickable onClick={…}>
  Upgrade
</Badge>`}
        >
          <Badge variant="success" startIcon={<Check />}>Verified</Badge>
          <Badge variant="info" startIcon={<InfoCircle />}>Beta</Badge>
          <Badge variant="warning" startIcon={<Alert />}>Action required</Badge>
          <Badge variant="default" endIcon={<ArrowRight />} clickable onClick={() => setClickCount((c) => c + 1)}>
            Upgrade
          </Badge>
          <Badge variant="info" appearance="solid" startIcon={<Flash />}>Pro</Badge>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Pass any node — <code>@swift/icons</code> components, an emoji, a tiny inline SVG. Slots are <code>aria-hidden</code> by default.
        </Text>
      </section>

      {/* ── Removable / chips ───────────────────────────────────── */}
      <section>
        <SectionHeader>Removable · filter chips</SectionHeader>
        <PreviewRow
          code={`{tags.map((tag) => (
  <Badge
    key={tag}
    variant="default"
    appearance="outline"
    pill
    startIcon={<Tag />}
    removable
    onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
  >
    {tag}
  </Badge>
))}`}
        >
          {tags.length === 0 ? (
            <Text variant="body-sm" color="muted">
              All tags removed.{' '}
              <Button
                variant="link"
                size="sm"
                onClick={() => setTags(['React', 'TypeScript', 'Vite', 'Tailwind'])}
              >
                Restore
              </Button>
            </Text>
          ) : (
            tags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                appearance="outline"
                pill
                startIcon={<Tag />}
                removable
                onRemove={() => setTags((current) => current.filter((t) => t !== tag))}
              >
                {tag}
              </Badge>
            ))
          )}
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The remove button is a real <code>&lt;button&gt;</code> with <code>aria-label=&quot;Remove&quot;</code>. Clicks <code>stopPropagation</code> so a clickable parent badge does not also fire.
        </Text>
      </section>

      {/* ── Clickable ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Clickable</SectionHeader>
        <PreviewRow
          code={`{/* role="button", tabIndex=0, Enter/Space activation. */}
<Badge clickable onClick={…} variant="info" startIcon={<Flash />}>
  Upgrade to Pro
</Badge>

<Badge
  clickable
  removable
  onClick={…}
  onRemove={…}
  variant="default"
  appearance="soft"
  startIcon={<Star />}
>
  Saved filter
</Badge>`}
        >
          <Badge clickable onClick={() => setClickCount((c) => c + 1)} variant="info" startIcon={<Flash />}>
            Upgrade to Pro
          </Badge>
          <Badge
            clickable
            onClick={() => setClickCount((c) => c + 1)}
            variant="success"
            appearance="outline"
            pill
            endIcon={<ArrowRight />}
          >
            View status
          </Badge>
          <Badge
            clickable
            removable
            onClick={() => setClickCount((c) => c + 1)}
            onRemove={() => undefined}
            variant="default"
            appearance="soft"
            startIcon={<Star />}
          >
            Saved filter
          </Badge>
          <Text variant="body-sm" color="muted">
            Clicked {clickCount}×
          </Text>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>clickable</code> adds <code>role=&quot;button&quot;</code>, <code>tabIndex=0</code>, and Enter / Space activation. Tab to a badge and press Space to try it.
        </Text>
      </section>

      {/* ── Polymorphic ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Polymorphism · the `as` prop</SectionHeader>
        <PreviewRow
          code={`<Badge
  as="a"
  href="https://example.com"
  target="_blank"
  rel="noreferrer"
  variant="info"
  appearance="outline"
  endIcon={<ArrowRight />}
>
  Read the docs
</Badge>

<Badge as="button" type="button" onClick={…} variant="success" startIcon={<Check />}>
  Mark complete
</Badge>`}
        >
          <Badge as="a" href="https://example.com" target="_blank" rel="noreferrer" variant="info" appearance="outline" endIcon={<ArrowRight />}>
            Read the docs
          </Badge>
          <Badge as="button" type="button" onClick={() => setClickCount((c) => c + 1)} variant="success" startIcon={<Check />}>
            Mark complete
          </Badge>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Pass any element type to <code>as</code>. TypeScript narrows the rest of the props to that element — only the anchor variant accepts <code>href</code>.
        </Text>
      </section>

      {/* ── Loading ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Loading</SectionHeader>
        <PreviewRow
          code={`{/* Spinner replaces the leading slot, aria-busy set,
    remove + click blocked. */}
<Badge loading variant="info">Deploying</Badge>
<Badge loading variant="warning" appearance="outline">Syncing</Badge>`}
        >
          <Badge loading variant="info">Deploying</Badge>
          <Badge loading variant="warning" appearance="outline">Syncing</Badge>
          <Badge
            loading={showLoading}
            startIcon={<Check />}
            variant="success"
            clickable
            onClick={triggerLoading}
          >
            {showLoading ? 'Saving…' : 'Click to simulate'}
          </Badge>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The spinner replaces the leading slot; <code>aria-busy</code> is set and remove / click are blocked.
        </Text>
      </section>

      {/* ── Disabled ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Disabled</SectionHeader>
        <PreviewRow
          code={`<Badge disabled>Default</Badge>
<Badge disabled variant="success">Success</Badge>
<Badge disabled variant="error" removable onRemove={…}>Removable</Badge>
<Badge disabled clickable onClick={…} variant="info" startIcon={<Flash />}>
  Clickable
</Badge>`}
        >
          <Badge disabled>Default</Badge>
          <Badge disabled variant="success">Success</Badge>
          <Badge disabled variant="error" removable onRemove={() => undefined}>Removable</Badge>
          <Badge disabled clickable onClick={() => undefined} variant="info" startIcon={<Flash />}>Clickable</Badge>
        </PreviewRow>
      </section>

      {/* ── In context ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>In context · Inline with text</SectionHeader>
        <Card>
          <Card.Content>
            <Text variant="body-md">
              Authentication v2 <Badge variant="info" size="sm" appearance="soft">Beta</Badge> is now available
              in the dashboard. The legacy flow <Badge variant="warning" size="sm" appearance="soft">Deprecated</Badge>{' '}
              will be removed in Q4.
            </Text>
          </Card.Content>
        </Card>
      </section>

      <section>
        <SectionHeader>In context · List row status</SectionHeader>
        <Card>
          <Card.Content>
            {[
              { name: 'production-api', status: 'success' as const, label: 'Healthy', detail: 'Last deploy 2h ago' },
              { name: 'image-processor', status: 'warning' as const, label: 'Degraded', detail: 'Elevated p95 latency' },
              { name: 'legacy-cron', status: 'error' as const, label: 'Down', detail: 'Last seen 14m ago' },
              { name: 'docs-site', status: 'default' as const, label: 'Idle', detail: 'No traffic in 24h' },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between border-b border-stroke-muted py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Badge.Dot variant={row.status} size="md" />
                  <div>
                    <Text variant="body-sm" fontWeight="semibold">{row.name}</Text>
                    <Text variant="body-xs" color="muted" className="block">{row.detail}</Text>
                  </div>
                </div>
                <Badge variant={row.status} appearance="soft" dot>
                  {row.label}
                </Badge>
              </div>
            ))}
          </Card.Content>
        </Card>
      </section>

      <section>
        <SectionHeader>In context · Selected filters</SectionHeader>
        <Card>
          <Card.Content>
            <Text variant="body-sm" color="secondary" className="mb-3 block">
              Active filters
            </Text>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" appearance="outline" pill removable onRemove={() => undefined}>
                Direct flights
              </Badge>
              <Badge variant="default" appearance="outline" pill removable onRemove={() => undefined}>
                Under ₹6,000
              </Badge>
              <Badge variant="default" appearance="outline" pill removable onRemove={() => undefined}>
                Morning departures
              </Badge>
              <Badge variant="info" appearance="soft" pill clickable onClick={() => undefined}>
                + Add filter
              </Badge>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* ── Accessibility ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <Card>
          <Card.Content>
            <div className="grid gap-2">
              <Text variant="body-sm">
                <strong className="text-content-strong">Status badges.</strong> Dot-only <code>status</code> badges automatically receive <code>aria-label=&quot;Status: online&quot;</code> (etc.) since there is no visible text.
              </Text>
              <Text variant="body-sm">
                <strong className="text-content-strong">Decorative icons.</strong> The <code>startIcon</code>, <code>endIcon</code>, and dot slots are wrapped in <code>aria-hidden</code> so screen readers do not announce them twice.
              </Text>
              <Text variant="body-sm">
                <strong className="text-content-strong">Clickable.</strong> Adds <code>role=&quot;button&quot;</code>, <code>tabIndex=0</code>, and Enter / Space activation. The root stays a <code>&lt;span&gt;</code> to avoid nested-button violations when combined with <code>removable</code>.
              </Text>
              <Text variant="body-sm">
                <strong className="text-content-strong">Remove button.</strong> Real <code>&lt;button&gt;</code> with <code>aria-label=&quot;Remove&quot;</code> and a visible focus ring. Disabled / loading parents block its activation.
              </Text>
              <Text variant="body-sm">
                <strong className="text-content-strong">Loading.</strong> Sets <code>aria-busy=&quot;true&quot;</code> and suppresses remove / click handlers.
              </Text>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* ── Data attributes ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Data attributes · style hooks</SectionHeader>
        <Card>
          <Card.Content>
            <Text variant="body-sm" color="secondary" className="mb-3 block">
              Every Badge emits <code>data-variant</code>, <code>data-appearance</code>, <code>data-size</code>, and <code>data-clickable</code> on the root. Use them to target badges from app-level CSS without piercing component internals.
            </Text>
            <CodeBlock
              code={`/* App-level theming, no className gymnastics */
[data-variant="success"][data-appearance="soft"] {
  --custom-shadow: 0 0 0 1px var(--color-stroke-success);
}`}
            />
          </Card.Content>
        </Card>
      </section>

      {/* ── Props ───────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Props</SectionHeader>
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
          {BADGE_PROPS.map(({ name, type, defaultValue, description }) => (
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

      {/* ── Compound parts ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {[
            {
              name: 'Badge.Dot',
              desc: 'Standalone coloured dot. Same colour map as the parent — useful next to non-badge UI like avatar tiles or list rows. Accepts variant and size.',
              preview: (
                <div className="flex items-center gap-4">
                  <Badge.Dot variant="success" />
                  <Badge.Dot variant="warning" size="lg" />
                  <Badge.Dot variant="error" />
                  <Badge.Dot variant="info" />
                  <Badge.Dot variant="default" />
                </div>
              ),
            },
            {
              name: 'Badge.Icon',
              desc: 'Optional explicit wrapper for icons inside the badge. Equivalent to passing startIcon / endIcon but lets you customise className per slot.',
              preview: (
                <div className="flex items-center gap-2 text-content-strong">
                  <Badge.Icon size="sm"><Check /></Badge.Icon>
                  <Badge.Icon size="md"><Flash /></Badge.Icon>
                  <Badge.Icon size="lg"><Star /></Badge.Icon>
                </div>
              ),
            },
            {
              name: 'Badge.Label',
              desc: 'Optional explicit wrapper for the text. Useful when you need a ref or className on the label itself — raw text children work fine without it.',
              preview: (
                <Badge variant="info" appearance="soft" startIcon={<Flash />}>
                  <Badge.Label className="uppercase tracking-wider">Pro plan</Badge.Label>
                </Badge>
              ),
            },
          ].map(({ name, desc, preview }) => (
            <div
              key={name}
              className="grid gap-3 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[200px_1fr_minmax(160px,auto)] md:items-center md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {desc}
              </Text>
              <div className="flex md:justify-end">{preview}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Import / usage ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Badge } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import Badge from '@swift/components/Badge'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Badge, type BadgeProps, type BadgeVariant } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Badge>New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning" appearance="outline">Pending</Badge>

// Dot
<Badge dot variant="success">Online</Badge>

// Status indicator (dot-only)
<Badge status="online" />

// Notification count
<Badge count={120} max={99} variant="error" pill appearance="solid" />

// Icon
<Badge variant="info" startIcon={<Flash />}>Pro</Badge>

// Removable chip
<Badge removable onRemove={handleRemove}>React</Badge>

// Clickable
<Badge clickable onClick={handleClick} variant="info">Upgrade</Badge>

// Polymorphic
<Badge as="a" href="/pricing" variant="info">Pro</Badge>`}
        />
      </section>
    </div>
  )
}
