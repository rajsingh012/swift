import { useRef, useState } from 'react'
import { Tabs, type TabsApi } from '@swift/components/Tabs'
import { Text } from '@swift/components/Text'
import { Button } from '@swift/components/Button'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Accessible compound tabs primitive: controlled & uncontrolled state, WAI-ARIA-compliant ARIA wiring, full keyboard navigation (Arrow / Home / End / Enter / Space), horizontal & vertical orientations, automatic & manual activation modes, animated indicator that tracks the active trigger, lazy-mount / force-mount strategies, scrollable list for narrow viewports, RTL-aware keyboard nav, ref forwarding, and theme tokens.'

const TABS_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'value',
    type: 'string',
    description:
      'Controlled active tab. When provided, the component never updates its own state — call onValueChange and feed the next value back to render it.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description:
      'Uncontrolled initial tab. If neither `value` nor `defaultValue` is supplied, the first non-disabled trigger is selected automatically on mount (matches Radix).',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Fires after each activation with the next tab value.',
  },
  {
    name: 'orientation',
    type: `'horizontal' | 'vertical'`,
    defaultValue: `'horizontal'`,
    description:
      'Layout direction. Affects keyboard nav (Left/Right vs Up/Down), where the visual border sits on the list (bottom vs end), and the indicator axis.',
  },
  {
    name: 'activationMode',
    type: `'automatic' | 'manual'`,
    defaultValue: `'automatic'`,
    description:
      'Automatic: arrow keys move focus AND change the active tab in one step. Manual: arrow keys only move focus; Enter / Space commit the focused tab. Use manual mode for heavy panels (API-loaded, charts, large forms) so accidental arrow presses don\'t trigger work.',
  },
  {
    name: 'lazyMount',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, `<Tabs.Content>` is mounted only after its first activation. Once mounted, it stays mounted so form state survives subsequent tab switches. Override per-content with `forceMount` on a single panel.',
  },
  {
    name: 'loop',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Whether arrow-key navigation wraps around at the ends. Set false for "bounded" navigation where focus stops at the first / last non-disabled trigger.',
  },
  {
    name: 'swipeable',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Enable horizontal-swipe gesture on `Tabs.Content` to flip tabs. Threshold: 25% of the content width or 60 px, whichever is greater. Axis-locked so pure vertical drags are ignored (preserves panel scroll). Swipes that start on `<button>` / `<a>` / form controls are also ignored.',
  },
  {
    name: 'apiRef',
    type: 'Ref<TabsApi>',
    description:
      'Imperative handle exposing `select(value)` / `focus(value?)` / `blur()` / `getValue()`. Useful when an external control needs to drive the tabs without owning state — e.g. a "Next step" button on a wizard.',
  },
  {
    name: 'dir',
    type: `'ltr' | 'rtl'`,
    description:
      'Explicit direction. When omitted, the closest `[dir]` ancestor is sniffed on mount. Affects horizontal arrow-key handling (RTL flips Left/Right).',
  },
  {
    name: 'id',
    type: 'string',
    description:
      'Override the generated id prefix used to compose trigger/content ARIA ids. Useful when a stable id is needed for external `aria-labelledby` wiring or SSR alignment.',
  },
  {
    name: 'classes',
    type: '{ root?, list?, trigger?, content?, indicator? }',
    description: 'Slot-level className overrides. Composes with the built-in classes.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLDivElement>',
    description: 'Forwarded to the root <div>.',
  },
]

const PARTS: ReadonlyArray<{
  name: string
  summary: string
  rows: ReadonlyArray<{ prop: string; type: string; description: string }>
}> = [
  {
    name: 'Tabs.List',
    summary:
      'role="tablist" container. Sets aria-orientation and acts as the offset parent for the indicator + scroll-into-view target for the active trigger.',
    rows: [
      {
        prop: 'scrollable',
        type: 'boolean',
        description:
          'Enable horizontal overflow scrolling with native momentum. The active trigger is scrolled into view on every value change, so it stays reachable on narrow viewports. Horizontal orientation only in v1.',
      },
      {
        prop: 'className',
        type: 'string',
        description: 'Appended to the <div>.',
      },
      {
        prop: 'children',
        type: 'ReactNode',
        description: 'Tabs.Trigger items, plus an optional Tabs.Indicator.',
      },
      {
        prop: 'ref',
        type: 'Ref<HTMLDivElement>',
        description: 'Forwarded to the <div>.',
      },
    ],
  },
  {
    name: 'Tabs.Trigger',
    summary:
      'role="tab" button. Implements roving tabindex (only the active trigger is Tab-reachable). Registers itself with the root so the indicator and keyboard nav can find it.',
    rows: [
      {
        prop: 'value',
        type: 'string',
        description:
          'Identifies this trigger and the matching `Tabs.Content`. Must be unique within the Tabs root.',
      },
      {
        prop: 'disabled',
        type: 'boolean',
        description:
          'Marks the trigger as inert. Skipped by arrow-key navigation, sets aria-disabled, dims the chrome.',
      },
      {
        prop: 'asChild',
        type: 'boolean',
        description:
          'Render the consumer\'s single child element instead of a <button>. Useful when you want the trigger to be a <Button>, a custom link, or a styled wrapper.',
      },
      {
        prop: 'className / ref',
        type: 'string / Ref<HTMLButtonElement>',
        description: 'Standard pass-through.',
      },
    ],
  },
  {
    name: 'Tabs.Content',
    summary:
      'role="tabpanel" panel. Uses the native `hidden` attribute to collapse layout and remove inactive panels from the accessibility tree.',
    rows: [
      {
        prop: 'value',
        type: 'string',
        description: 'Matches one of the Tabs.Trigger values.',
      },
      {
        prop: 'forceMount',
        type: 'boolean',
        description:
          'Keep this panel mounted regardless of `lazyMount` on the root. Use for forms, editors, or media players where unmounting would lose state.',
      },
      {
        prop: 'className / ref',
        type: 'string / Ref<HTMLDivElement>',
        description: 'Standard pass-through.',
      },
    ],
  },
  {
    name: 'Tabs.Indicator',
    summary:
      'Optional animated bar that tracks the active trigger. Positioned absolutely against the list — works for both orientations. Position is updated imperatively (no per-frame React render) and re-measured on resize.',
    rows: [
      {
        prop: 'className',
        type: 'string',
        description: 'Appended to the indicator <span>.',
      },
      {
        prop: 'ref',
        type: 'Ref<HTMLSpanElement>',
        description: 'Forwarded to the <span>.',
      },
    ],
  },
]

export function TabsPanel() {
  const [controlled, setControlled] = useState<string>('pricing')

  // apiRef demo — drives Tabs from outside React state.
  const apiRef = useRef<TabsApi | null>(null)
  const [apiReading, setApiReading] = useState('Click a button')

  // Dynamic tabs demo (v3 — FLIP animation on add/remove).
  const [dynamicTabs, setDynamicTabs] = useState<string[]>(['alpha', 'beta', 'gamma'])
  const [nextId, setNextId] = useState(4)
  const addTab = () => {
    const id = `tab-${nextId}`
    setDynamicTabs((prev) => [...prev, id])
    setNextId((n) => n + 1)
  }
  const insertTab = () => {
    const id = `tab-${nextId}`
    setDynamicTabs((prev) => {
      const i = Math.min(1, prev.length)
      return [...prev.slice(0, i), id, ...prev.slice(i)]
    })
    setNextId((n) => n + 1)
  }
  const removeFirst = () => setDynamicTabs((prev) => prev.slice(1))
  const removeLast = () => setDynamicTabs((prev) => prev.slice(0, -1))

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Tabs
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic · uncontrolled</SectionHeader>
        <PreviewRow
          code={`<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
    <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="overview">Product overview content.</Tabs.Content>
  <Tabs.Content value="pricing">Pricing tiers + comparison.</Tabs.Content>
  <Tabs.Content value="reviews">Customer reviews.</Tabs.Content>
</Tabs>`}
        >
          <Tabs defaultValue="overview" className="w-full">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
              <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="overview" className="py-4">
              <Text variant="body-sm" color="secondary">
                Product overview content. The first non-disabled tab is auto-selected when no <code>defaultValue</code> is supplied.
              </Text>
            </Tabs.Content>
            <Tabs.Content value="pricing" className="py-4">
              <Text variant="body-sm" color="secondary">
                Pricing tiers and comparison.
              </Text>
            </Tabs.Content>
            <Tabs.Content value="reviews" className="py-4">
              <Text variant="body-sm" color="secondary">
                Customer reviews.
              </Text>
            </Tabs.Content>
          </Tabs>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Controlled</SectionHeader>
        <PreviewRow
          code={`const [tab, setTab] = useState('pricing')

<Tabs value={tab} onValueChange={setTab}>
  ...
</Tabs>`}
        >
          <Tabs
            value={controlled}
            onValueChange={setControlled}
            className="w-full"
          >
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
              <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="overview" className="py-4">
              Overview
            </Tabs.Content>
            <Tabs.Content value="pricing" className="py-4">
              Pricing
            </Tabs.Content>
            <Tabs.Content value="reviews" className="py-4">
              Reviews
            </Tabs.Content>
          </Tabs>
          <div className="flex flex-wrap gap-2">
            {(['overview', 'pricing', 'reviews'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setControlled(v)}
                className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
              >
                Activate {v}
              </button>
            ))}
            <Text variant="body-xs" color="muted">
              state: <code>{controlled}</code>
            </Text>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Vertical orientation</SectionHeader>
        <PreviewRow
          code={`<Tabs orientation="vertical" defaultValue="account" className="flex gap-6">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="account">...</Tabs.Content>
  ...
</Tabs>`}
        >
          <Tabs
            orientation="vertical"
            defaultValue="account"
            className="flex gap-6 w-full"
          >
            <Tabs.List>
              <Tabs.Trigger value="account">Account</Tabs.Trigger>
              <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
              <Tabs.Trigger value="security">Security</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <div className="flex-1">
              <Tabs.Content value="account">Account settings.</Tabs.Content>
              <Tabs.Content value="billing">Billing & invoices.</Tabs.Content>
              <Tabs.Content value="security">
                Security & two-factor authentication.
              </Tabs.Content>
            </div>
          </Tabs>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Disabled tab</SectionHeader>
        <Tabs defaultValue="basics" className="w-full">
          <Tabs.List>
            <Tabs.Trigger value="basics">Basics</Tabs.Trigger>
            <Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
            <Tabs.Trigger value="premium" disabled>
              Premium (locked)
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Content value="basics" className="py-4">
            Disabled triggers are skipped by arrow-key navigation and aren&apos;t
            auto-selected when no <code>defaultValue</code> is set.
          </Tabs.Content>
          <Tabs.Content value="advanced" className="py-4">
            Advanced features.
          </Tabs.Content>
          <Tabs.Content value="premium" className="py-4">
            Premium-only content.
          </Tabs.Content>
        </Tabs>
      </section>

      <section>
        <SectionHeader>Manual activation</SectionHeader>
        <PreviewRow
          code={`{/* Arrow keys only move focus; Enter / Space activates. */}
<Tabs defaultValue="dashboard" activationMode="manual">
  ...
</Tabs>`}
        >
          <Tabs
            defaultValue="dashboard"
            activationMode="manual"
            className="w-full"
          >
            <Tabs.List>
              <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
              <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
              <Tabs.Trigger value="exports">Exports</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="dashboard" className="py-4">
              <Text variant="body-sm" color="secondary">
                Focus a tab, then arrow-key around. The active panel doesn&apos;t change until you press <kbd>Enter</kbd> or <kbd>Space</kbd>.
              </Text>
            </Tabs.Content>
            <Tabs.Content value="analytics" className="py-4">
              Analytics
            </Tabs.Content>
            <Tabs.Content value="exports" className="py-4">
              Exports
            </Tabs.Content>
          </Tabs>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Lazy mount + force mount</SectionHeader>
        <PreviewRow
          code={`<Tabs defaultValue="form" lazyMount>
  <Tabs.List>
    <Tabs.Trigger value="form">Form</Tabs.Trigger>
    <Tabs.Trigger value="preview">Preview (heavy)</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>

  {/* Lazy-mounted but stays mounted after first activation — form state survives. */}
  <Tabs.Content value="form">
    <Form />
  </Tabs.Content>

  {/* Always mounted regardless of lazyMount — e.g. a media player. */}
  <Tabs.Content value="preview" forceMount>
    <Player />
  </Tabs.Content>
</Tabs>`}
        >
          <Tabs defaultValue="form" lazyMount className="w-full">
            <Tabs.List>
              <Tabs.Trigger value="form">Form</Tabs.Trigger>
              <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="form" className="py-4">
              <Text variant="body-sm" color="secondary">
                Heavy form (lazy-mounted on first activation, then stays mounted).
              </Text>
              <input
                type="text"
                placeholder="Type something — switch tabs — come back. Value persists."
                className="mt-2 w-full rounded-sm border border-stroke px-2 py-1 text-sm"
              />
            </Tabs.Content>
            <Tabs.Content value="preview" className="py-4" forceMount>
              <Text variant="body-sm" color="secondary">
                Force-mounted: rendered from the start regardless of lazyMount.
              </Text>
            </Tabs.Content>
          </Tabs>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Scrollable list</SectionHeader>
        <PreviewRow
          code={`<Tabs defaultValue="day-1">
  <Tabs.List scrollable>
    {days.map(d => (
      <Tabs.Trigger key={d} value={d}>{d}</Tabs.Trigger>
    ))}
    <Tabs.Indicator />
  </Tabs.List>
  ...
</Tabs>`}
        >
          <div className="w-full max-w-md">
            <Tabs defaultValue="day-1">
              <Tabs.List scrollable>
                {Array.from({ length: 14 }, (_, i) => `day-${i + 1}`).map((d) => (
                  <Tabs.Trigger key={d} value={d}>
                    {d.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Tabs.Trigger>
                ))}
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value="day-1" className="py-4">
                Day 1 itinerary.
              </Tabs.Content>
              {Array.from({ length: 13 }, (_, i) => `day-${i + 2}`).map((d) => (
                <Tabs.Content key={d} value={d} className="py-4">
                  {d}
                </Tabs.Content>
              ))}
            </Tabs>
          </div>
          <Text variant="body-xs" color="muted">
            The active trigger scrolls into view on every value change — try arrow-keying through the days.
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>loop={`{false}`} · arrow nav stops at the ends</SectionHeader>
        <PreviewRow
          code={`<Tabs defaultValue="first" loop={false}>
  <Tabs.List>
    <Tabs.Trigger value="first">First</Tabs.Trigger>
    <Tabs.Trigger value="middle">Middle</Tabs.Trigger>
    <Tabs.Trigger value="last">Last</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
</Tabs>`}
        >
          <Tabs defaultValue="first" loop={false} className="w-full">
            <Tabs.List>
              <Tabs.Trigger value="first">First</Tabs.Trigger>
              <Tabs.Trigger value="middle">Middle</Tabs.Trigger>
              <Tabs.Trigger value="last">Last</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="first" className="py-4">
              Focus a tab and arrow-key past the end — focus stays put instead of wrapping.
            </Tabs.Content>
            <Tabs.Content value="middle" className="py-4">
              Middle
            </Tabs.Content>
            <Tabs.Content value="last" className="py-4">
              Last
            </Tabs.Content>
          </Tabs>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Imperative apiRef · drive Tabs from outside</SectionHeader>
        <PreviewRow
          code={`const apiRef = useRef<TabsApi | null>(null)

<Tabs defaultValue="alpha" apiRef={apiRef}>
  <Tabs.List>...</Tabs.List>
  ...
</Tabs>

<button onClick={() => apiRef.current?.select('gamma')}>Jump to gamma</button>
<button onClick={() => apiRef.current?.focus('beta')}>Focus beta</button>
<button onClick={() => alert(apiRef.current?.getValue())}>Read value</button>`}
        >
          <Tabs apiRef={apiRef} defaultValue="alpha" className="w-full">
            <Tabs.List>
              <Tabs.Trigger value="alpha">Alpha</Tabs.Trigger>
              <Tabs.Trigger value="beta">Beta</Tabs.Trigger>
              <Tabs.Trigger value="gamma">Gamma</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="alpha" className="py-4">
              Alpha panel.
            </Tabs.Content>
            <Tabs.Content value="beta" className="py-4">
              Beta panel.
            </Tabs.Content>
            <Tabs.Content value="gamma" className="py-4">
              Gamma panel.
            </Tabs.Content>
          </Tabs>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => apiRef.current?.select('gamma')}
              className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
            >
              Jump to gamma
            </button>
            <button
              type="button"
              onClick={() => apiRef.current?.focus('beta')}
              className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
            >
              Focus beta
            </button>
            <button
              type="button"
              onClick={() => apiRef.current?.blur()}
              className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
            >
              Blur
            </button>
            <button
              type="button"
              onClick={() =>
                setApiReading(`getValue() → ${apiRef.current?.getValue() ?? 'null'}`)
              }
              className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
            >
              Read value
            </button>
            <Text variant="body-xs" color="muted">
              {apiReading}
            </Text>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Vertical scrollable list</SectionHeader>
        <PreviewRow
          code={`{/* maxHeight directly on Tabs.List itself. The component already
    sets min-height:0 internally, so the cap works even inside a
    flex container (vertical tabs are typically a flex row).
    items-start on the Tabs root prevents the list from being
    stretched to the content's height. */}
<Tabs
  orientation="vertical"
  defaultValue="m-1"
  className="flex gap-6 items-start"
>
  <Tabs.List scrollable style={{ maxHeight: 240 }}>
    {months.map(m => <Tabs.Trigger key={m} value={m}>{m}</Tabs.Trigger>)}
    <Tabs.Indicator />
  </Tabs.List>
  <div className="flex-1">{...content...}</div>
</Tabs>`}
        >
          <div className="w-full">
            <Tabs
              orientation="vertical"
              defaultValue="m-1"
              className="flex gap-6 items-start w-full"
            >
              <Tabs.List scrollable style={{ maxHeight: 240 }}>
                {Array.from({ length: 12 }, (_, i) => `m-${i + 1}`).map((m) => (
                  <Tabs.Trigger key={m} value={m}>
                    Month {m.replace('m-', '')}
                  </Tabs.Trigger>
                ))}
                <Tabs.Indicator />
              </Tabs.List>
              <div className="flex-1">
                {Array.from({ length: 12 }, (_, i) => `m-${i + 1}`).map((m) => (
                  <Tabs.Content key={m} value={m} className="py-2">
                    Month {m.replace('m-', '')} content.
                  </Tabs.Content>
                ))}
              </div>
            </Tabs>
          </div>
          <Text variant="body-xs" color="muted" className="block w-full">
            Arrow-key up/down through the months — the active trigger stays in view via <code>scrollIntoView</code>.
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Swipeable panels (touch / mouse drag)</SectionHeader>
        <PreviewRow
          code={`<Tabs defaultValue="one" swipeable>
  <Tabs.List>
    <Tabs.Trigger value="one">One</Tabs.Trigger>
    <Tabs.Trigger value="two">Two</Tabs.Trigger>
    <Tabs.Trigger value="three">Three</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="one">{/* horizontal swipe flips */}</Tabs.Content>
  ...
</Tabs>`}
        >
          <Tabs defaultValue="one" swipeable className="w-full max-w-md">
            <Tabs.List>
              <Tabs.Trigger value="one">One</Tabs.Trigger>
              <Tabs.Trigger value="two">Two</Tabs.Trigger>
              <Tabs.Trigger value="three">Three</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            {(['one', 'two', 'three'] as const).map((v) => (
              <Tabs.Content
                key={v}
                value={v}
                className="py-6 px-4 rounded-md bg-surface-muted/50 text-center select-none"
              >
                <Text variant="heading-md" fontWeight="bold">
                  Panel {v}
                </Text>
                <Text variant="body-sm" color="muted" className="mt-1 block">
                  Drag left / right to switch. (Threshold: 25% width or 60 px, whichever is larger.)
                </Text>
              </Tabs.Content>
            ))}
          </Tabs>
          <Text variant="body-xs" color="muted">
            Vertical scroll inside panels is preserved — pure vertical drags are ignored via axis lock. Swipes that start on buttons / links / inputs are also ignored.
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Dynamic tabs · FLIP animation on add / remove</SectionHeader>
        <PreviewRow
          code={`{/* Triggers slide to their new positions on add/remove via
    Element.animate() (FLIP technique). The indicator follows
    smoothly via its existing transform transition. */}
<Tabs defaultValue="alpha">
  <Tabs.List>
    {tabs.map(t => <Tabs.Trigger key={t} value={t}>{t}</Tabs.Trigger>)}
    <Tabs.Indicator />
  </Tabs.List>
  ...
</Tabs>`}
        >
          <div className="w-full">
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={addTab}
                className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
              >
                Add at end
              </button>
              <button
                type="button"
                onClick={insertTab}
                className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
              >
                Insert at index 1
              </button>
              <button
                type="button"
                onClick={removeFirst}
                className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
                disabled={dynamicTabs.length === 0}
              >
                Remove first
              </button>
              <button
                type="button"
                onClick={removeLast}
                className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
                disabled={dynamicTabs.length === 0}
              >
                Remove last
              </button>
              <Text variant="body-xs" color="muted">
                {dynamicTabs.length} tab{dynamicTabs.length === 1 ? '' : 's'}
              </Text>
            </div>
            {dynamicTabs.length > 0 ? (
              <Tabs defaultValue={dynamicTabs[0]} key={dynamicTabs[0]}>
                <Tabs.List>
                  {dynamicTabs.map((t) => (
                    <Tabs.Trigger key={t} value={t}>
                      {t}
                    </Tabs.Trigger>
                  ))}
                  <Tabs.Indicator />
                </Tabs.List>
                {dynamicTabs.map((t) => (
                  <Tabs.Content key={t} value={t} className="py-4">
                    Content for <code>{t}</code>.
                  </Tabs.Content>
                ))}
              </Tabs>
            ) : (
              <Text variant="body-sm" color="muted">
                No tabs. Click &quot;Add at end&quot; to add one.
              </Text>
            )}
          </div>
          <Text variant="body-xs" color="muted">
            Add or remove tabs and watch the neighbours slide to their new positions. The animation uses <code>Element.animate()</code> with a pure transform — no React re-render per frame.
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Fling + visual swipe</SectionHeader>
        <PreviewRow
          code={`{/* Swipe with a flick — releases past 0.5 px/ms commit even
    if displacement is short. The panel follows the pointer
    during the drag and snaps back if you don't reach threshold. */}
<Tabs defaultValue="one" swipeable>
  ...
</Tabs>`}
        >
          <Tabs defaultValue="one" swipeable className="w-full max-w-md">
            <Tabs.List>
              <Tabs.Trigger value="one">Slow</Tabs.Trigger>
              <Tabs.Trigger value="two">Drag</Tabs.Trigger>
              <Tabs.Trigger value="three">vs</Tabs.Trigger>
              <Tabs.Trigger value="four">Flick</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            {(['one', 'two', 'three', 'four'] as const).map((v) => (
              <Tabs.Content
                key={v}
                value={v}
                className="py-8 px-4 rounded-md bg-surface-muted/50 text-center select-none"
              >
                <Text variant="heading-md" fontWeight="bold">
                  Panel {v}
                </Text>
                <Text variant="body-sm" color="muted" className="mt-1 block">
                  Drag slowly → must cross 25% width. Flick fast → commits at ~0.5 px/ms regardless.
                </Text>
              </Tabs.Content>
            ))}
          </Tabs>
          <Text variant="body-xs" color="muted">
            The panel translates with your finger during the drag (no transition). On release, it either snaps back (Web Animations API) or stays put while the new panel takes over.
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>RTL · arrow keys flip horizontally</SectionHeader>
        <div dir="rtl" className="w-full rounded-lg border border-stroke bg-surface-elevated p-4">
          <Tabs defaultValue="الرئيسية">
            <Tabs.List>
              <Tabs.Trigger value="الرئيسية">الرئيسية</Tabs.Trigger>
              <Tabs.Trigger value="الأسعار">الأسعار</Tabs.Trigger>
              <Tabs.Trigger value="المراجعات">المراجعات</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="الرئيسية" className="py-4">
              ArrowLeft moves to the next tab (rightward in visual reading order); ArrowRight moves back.
            </Tabs.Content>
            <Tabs.Content value="الأسعار" className="py-4">
              الأسعار
            </Tabs.Content>
            <Tabs.Content value="المراجعات" className="py-4">
              المراجعات
            </Tabs.Content>
          </Tabs>
        </div>
      </section>

      <section>
        <SectionHeader>asChild · trigger as a Button</SectionHeader>
        <PreviewRow
          code={`<Tabs defaultValue="one">
  <Tabs.List>
    <Tabs.Trigger value="one" asChild>
      <Button variant="unstyled">Tab one</Button>
    </Tabs.Trigger>
    ...
  </Tabs.List>
</Tabs>`}
        >
          <Tabs defaultValue="one" className="w-full">
            <Tabs.List>
              <Tabs.Trigger value="one" asChild>
                <Button variant="unstyled">Tab one</Button>
              </Tabs.Trigger>
              <Tabs.Trigger value="two" asChild>
                <Button variant="unstyled">Tab two</Button>
              </Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Content value="one" className="py-4">
              First panel.
            </Tabs.Content>
            <Tabs.Content value="two" className="py-4">
              Second panel.
            </Tabs.Content>
          </Tabs>
          <Text variant="body-xs" color="muted">
            The Slot clones the Button with our role / aria-selected / data-state / handlers — the Button keeps its own styling.
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">ARIA wiring.</strong> List is <code>role=&quot;tablist&quot;</code> with <code>aria-orientation</code>. Each trigger is <code>role=&quot;tab&quot;</code> with <code>aria-selected</code> + <code>aria-controls=&quot;panel-id&quot;</code>. Each panel is <code>role=&quot;tabpanel&quot;</code> with <code>aria-labelledby=&quot;trigger-id&quot;</code>. All ids come from a single <code>useId()</code> in the root, so SSR is stable.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Roving tabindex.</strong> Only the active trigger has <code>tabIndex=0</code>; the rest get <code>-1</code>. So <kbd>Tab</kbd> reaches the tablist exactly once and lands on the active tab; arrow keys move among the tabs from there.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong> Horizontal: <kbd>←</kbd>/<kbd>→</kbd> (flipped under RTL). Vertical: <kbd>↑</kbd>/<kbd>↓</kbd>. <kbd>Home</kbd>/<kbd>End</kbd> jump to first/last non-disabled tab. <kbd>Enter</kbd>/<kbd>Space</kbd> activates a focused tab — instant in automatic mode, required in manual mode.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Disabled triggers.</strong> Set <code>disabled</code>; they’re skipped by arrow nav, marked with <code>aria-disabled</code> + <code>data-disabled</code>, and excluded from auto-default selection.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Panel focus.</strong> Active panels have <code>tabIndex=0</code> so <kbd>Tab</kbd> from a trigger lands inside the panel body. Inactive panels use the native <code>hidden</code> attribute, removing them from the focus order and the accessibility tree in one go.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Indicator.</strong> Rendered with <code>aria-hidden</code> and pointer-events disabled — it’s a visual cue only. Position is updated imperatively (no per-frame re-render) and a <code>ResizeObserver</code> on the list keeps it correct through viewport / font-load / token overrides. Honors <code>prefers-reduced-motion</code>.
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>Props · Tabs</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          <div className="hidden grid-cols-[220px_1fr_140px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
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
          {TABS_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[220px_1fr_140px] md:items-start md:gap-6"
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

      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="grid gap-4">
          {PARTS.map(({ name, summary, rows }) => (
            <div
              key={name}
              className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated"
            >
              <div className="border-b border-stroke px-6 py-4">
                <Text variant="body-sm" fontFamily="mono" fontWeight="bold" color="primary">
                  {name}
                </Text>
                <Text variant="body-sm" color="secondary" className="mt-1 block">
                  {summary}
                </Text>
              </div>
              {rows.map(({ prop, type, description }) => (
                <div
                  key={prop}
                  className="grid gap-2 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[220px_1fr] md:items-start md:gap-6"
                >
                  <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                    {prop}
                  </Text>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <Text variant="body-xs" fontFamily="mono" color="secondary" className="wrap-break-word">
                      {type}
                    </Text>
                    <Text variant="body-sm" color="secondary">
                      {description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Theme tokens</SectionHeader>
        <CodeBlock
          code={`/* Override per-instance via inline style, or globally via a higher-level selector. */

--tabs-gap                      /* 0.25rem */
--tabs-trigger-padding-x        /* 0.75rem */
--tabs-trigger-padding-y        /* 0.5rem */
--tabs-trigger-radius

--tabs-trigger-fg
--tabs-trigger-fg-active
--tabs-trigger-fg-disabled
--tabs-trigger-bg-hover

--tabs-indicator-color
--tabs-indicator-size           /* underline thickness (horizontal) / bar width (vertical) */

--tabs-list-border
--tabs-transition-duration      /* 180ms; collapsed to 1ms under prefers-reduced-motion */
--tabs-transition-ease`}
        />
      </section>

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Tabs } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Tabs } from '@swift/components/Tabs'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Tabs, type TabsRootProps, type TabsApi, type TabsOrientation, type TabsActivationMode } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
    <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="overview">...</Tabs.Content>
  <Tabs.Content value="pricing">...</Tabs.Content>
  <Tabs.Content value="reviews">...</Tabs.Content>
</Tabs>`}
        />
      </section>
    </div>
  )
}
