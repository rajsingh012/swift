import { useState } from 'react'
import { Badge } from '@swift/components/Badge'
import { Button } from '@swift/components/Button'
import { Checkbox } from '@swift/components/Checkbox'
import { List, ListItem } from '@swift/components/ListItem'
import type { ListItemDensity, ListItemSize } from '@swift/components/ListItem'
import { Text } from '@swift/components/Text'
import { Bookmark } from '@swift/icons/Bookmark'
import { Calendar } from '@swift/icons/Calendar'
import { ChevronRight } from '@swift/icons/ChevronRight'
import { Flight } from '@swift/icons/Flight'
import { Hotel } from '@swift/icons/Hotel'
import { Mail } from '@swift/icons/Mail'
import { Notifications } from '@swift/icons/Notifications'
import { Person } from '@swift/icons/Person'
import { Wallet } from '@swift/icons/Wallet'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Layout + interaction primitive for list cells. Compose three slots (Leading · Content · Trailing) or pass `title` / `description` for the simple case. Polymorphic (`as` / `asChild`), sizes, density, selected / active / disabled / loading states, full keyboard + ARIA, RTL-safe, virtualization-ready.'

/** Local class-list joiner — keeps the demo dependency-light. */
const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ')

const SIZES: ReadonlyArray<ListItemSize> = ['sm', 'md', 'lg']
const DENSITIES: ReadonlyArray<ListItemDensity> = [
  'compact',
  'comfortable',
  'spacious',
]

const INBOX_MESSAGES: ReadonlyArray<{
  id: 'msg1' | 'msg2' | 'msg3'
  title: string
  body: string
  /** Either the literal text shown on the trailing side, or `'badge'`. */
  trailing: 'badge' | string
}> = [
  {
    id: 'msg1',
    title: 'Air India · Your boarding pass is ready',
    body:
      'Web check-in is open for AI 805 (DEL→BOM). Seats 14C, 14D confirmed. ' +
      'Bag drop closes 45 minutes before departure.',
    trailing: 'badge',
  },
  {
    id: 'msg2',
    title: 'ixigo · Refund processed',
    body:
      'Your refund of ₹2,340 for booking IX12345 has been credited back to ' +
      'the original payment method. Allow 3–5 business days.',
    trailing: 'Tue',
  },
  {
    id: 'msg3',
    title: 'Hotel offers near you',
    body:
      'Weekend escapes from ₹2,499 — Lonavala, Mahabaleshwar, and Alibaug. ' +
      'Limited inventory; flexible cancellation.',
    trailing: 'Mon',
  },
]

const SETTINGS_ROWS = [
  { id: 'notifications', label: 'Notifications', icon: Notifications, hint: 'Push, email, in-app' },
  { id: 'profile', label: 'Profile', icon: Person, hint: 'Personal details' },
  { id: 'wallet', label: 'Wallet & cards', icon: Wallet, hint: 'Saved cards, refunds' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, hint: 'Trips, cancellations' },
] as const

type SettingsRowId = (typeof SETTINGS_ROWS)[number]['id']

/**
 * Model picker grid. Each entry uses ListItem in `orientation="vertical"`
 * — image on top, title + description stacked below. The `gradient`
 * field drives an inline background so the demo doesn't depend on
 * external image hosting.
 */
const MODELS: ReadonlyArray<{
  id: 'sm' | 'lg' | 'mini'
  name: string
  hint: string
  gradient: string
}> = [
  {
    id: 'sm',
    name: 'v0-1.5-sm',
    hint: 'Everyday tasks and UI generation.',
    gradient:
      'radial-gradient(120% 80% at 10% 10%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%), ' +
      'linear-gradient(135deg, #1f2937 0%, #0b0f1a 100%)',
  },
  {
    id: 'lg',
    name: 'v0-1.5-lg',
    hint: 'Advanced thinking or reasoning.',
    gradient:
      'radial-gradient(120% 80% at 80% 20%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%), ' +
      'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)',
  },
  {
    id: 'mini',
    name: 'v0-2.0-mini',
    hint: 'Open Source model for everyone.',
    gradient:
      'radial-gradient(140% 90% at 30% 80%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%), ' +
      'linear-gradient(135deg, #4b5563 0%, #111827 100%)',
  },
]

const TEAM_AVATARS: ReadonlyArray<{ initials: string; bg: string }> = [
  { initials: 'AS', bg: 'bg-surface-warning' },
  { initials: 'KP', bg: 'bg-surface-highlight' },
  { initials: 'RX', bg: 'bg-surface-inverse' },
]

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-content-on-brand ${color}`}
      aria-hidden
    >
      {initials}
    </span>
  )
}

function StatusDot({ tone = 'success' as 'success' | 'warning' | 'critical' }) {
  const map = {
    success: 'bg-surface-success',
    warning: 'bg-surface-warning',
    critical: 'bg-surface-critical',
  }
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${map[tone]}`}
      aria-hidden
    />
  )
}

const LIST_ITEM_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'title',
    type: 'ReactNode',
    description:
      'Convenience shortcut for the title slot — auto-builds a `<ListItem.Content><ListItem.Title>` if you don\'t pass children. Skip it and compose the slots yourself for full control.',
  },
  {
    name: 'description',
    type: 'ReactNode',
    description:
      'Convenience shortcut for the description slot. Pairs with `title` to render the simple two-line variant in one prop.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Scales title / description typography and the leading-slot dimensions. Cascades to every compound part via context — set it once on the row (or once on the parent List).',
  },
  {
    name: 'density',
    type: `'compact' | 'comfortable' | 'spacious'`,
    defaultValue: `'comfortable'`,
    description:
      'Vertical padding scale. Independent of `size` so dense inboxes still get comfortable typography. Clickable rows are clamped to a 44px+ touch target regardless of density.',
  },
  {
    name: 'align',
    type: `'start' | 'center' | 'end'`,
    defaultValue: `'center'`,
    description:
      'Vertical alignment of Leading + Trailing against the content stack. Use `start` for multi-line descriptions where the avatar should align with the title.',
  },
  {
    name: 'clickable',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Adds hover background, focus ring, keyboard activation (Enter / Space), and switches the implicit root to `<button>`. Combine with `as="a"` for native anchors or `asChild` to wrap a router Link.',
  },
  {
    name: 'selected',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Selected state — multi-select lists, settings choice, table rows. Paints the row with `--list-item-selected-bg` and sets `aria-selected`.',
  },
  {
    name: 'active',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Current navigation target. Adds a leading accent bar and sets `aria-current="page"`. Pair with router state to mark the active route in a nav list.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Blocks clicks, lowers opacity, sets `aria-disabled`. Combined with `clickable` the row stays focusable but unactivatable, so screen-reader users still hear it.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Replaces children with an avatar + two-line text skeleton and sets `aria-busy`. Useful for async lists, inbox refresh, dashboard rows.',
  },
  {
    name: 'divider',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Hairline bottom border on this row. Prefer the container-level `<List dividers />` so the last row isn\'t doubled-up against the container border.',
  },
  {
    name: 'as',
    type: 'ElementType',
    defaultValue: `'div' (or 'button' when clickable)`,
    description:
      'Polymorphic element override. Use `"li"` inside a `<List>` for semantic markup, `"a"` for native links, or any component (Next/Link, TanStack Link) to opt into client-side routing.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Render the single child as the root, merging the ListItem\'s className, data-attributes, click handler, and ref. Avoids the extra wrapper DOM node common to routing libraries.',
  },
  {
    name: 'classes',
    type: '{ root?, leading?, content?, title?, description?, trailing?, actions? }',
    description:
      'Slot-level className overrides. Equivalent to `className` per part — useful when you can\'t easily reach the compound parts (e.g. when using the `title` / `description` shortcut).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Appended to the root after size / density classes.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLElement>',
    description:
      'Forwarded to the rendered element. Required for virtualization (TanStack Virtual / React Window) and focus management in keyboard-driven lists.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes of the rendered element',
    description:
      'Anything else (id, role, aria-*, data-*, event handlers, href / target / rel for anchors) forwards through to the rendered element.',
  },
]

const COMPOUND_PARTS: ReadonlyArray<{ name: string; desc: string }> = [
  {
    name: 'ListItem.Leading',
    desc: 'Left slot (logical start — flips for RTL). Avatar, icon, checkbox, status dot, image. Default min-size scales with the row size.',
  },
  {
    name: 'ListItem.Content',
    desc: 'The middle slot. `min-w-0` lets children opt into ellipsis truncation without the row pushing past its container.',
  },
  {
    name: 'ListItem.Title',
    desc: 'Primary text. Defaults to single-line `truncate`. Override the element with `as="h3"` etc. when the row functions as a section heading.',
  },
  {
    name: 'ListItem.Description',
    desc: 'Secondary text. `lines={1|2|3}` switches between ellipsis truncate and `-webkit-line-clamp` for multi-line clipping.',
  },
  {
    name: 'ListItem.Trailing',
    desc: 'Right slot (logical end). Chevron, switch, badge, timestamp. Nested interactive controls keep their own focus and click semantics.',
  },
  {
    name: 'ListItem.Actions',
    desc: 'Distinct slot for inline action buttons (icon buttons, kebab menus). Kept separate from Trailing so the tab order stays predictable.',
  },
  {
    name: 'List',
    desc: 'Optional container — cascades `size` / `density` to every child row, renders dividers between siblings, and offers a `bordered` variant with built-in radius + border.',
  },
]

export function ListItemPanel() {
  const [selectedSetting, setSelectedSetting] =
    useState<SettingsRowId>('notifications')
  const [checkedInbox, setCheckedInbox] = useState<Record<string, boolean>>({
    msg1: true,
    msg2: false,
    msg3: false,
  })
  const [notifications, setNotifications] = useState({ push: true, email: false })
  const [selectedModel, setSelectedModel] =
    useState<(typeof MODELS)[number]['id']>('lg')
  const [size, setSize] = useState<ListItemSize>('md')
  const [density, setDensity] = useState<ListItemDensity>('comfortable')

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          ListItem
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Simple API ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Simple · title + description</SectionHeader>
        <PreviewRow
          code={`<List variant="bordered">
  <ListItem
    as="li"
    title="Air India"
    description="Non-stop · 2h 15m · ₹4,890"
  />
  <ListItem
    as="li"
    title="IndiGo"
    description="Non-stop · 2h 25m · ₹4,650"
    divider
  />
</List>`}
        >
          <List variant="bordered" className="w-full max-w-md">
            <ListItem
              as="li"
              title="Air India"
              description="Non-stop · 2h 15m · ₹4,890"
            />
            <ListItem
              as="li"
              title="IndiGo"
              description="Non-stop · 2h 25m · ₹4,650"
              divider
            />
            <ListItem
              as="li"
              title="Vistara"
              description="1 stop · 4h 10m · ₹3,990"
            />
          </List>
        </PreviewRow>
      </section>

      {/* ── Compound · settings list ───────────────────────── */}
      <section>
        <SectionHeader>Compound · settings · selected state</SectionHeader>
        <PreviewRow
          code={`<List variant="bordered" dividers>
  <ListItem as="li" clickable selected={current === 'notifications'} onClick={() => setCurrent('notifications')}>
    <ListItem.Leading>
      <Notifications size={20} />
    </ListItem.Leading>
    <ListItem.Content>
      <ListItem.Title>Notifications</ListItem.Title>
      <ListItem.Description>Push, email, in-app</ListItem.Description>
    </ListItem.Content>
    <ListItem.Trailing>
      <ChevronRight size={16} />
    </ListItem.Trailing>
  </ListItem>
  {/* …more rows… */}
</List>`}
        >
          <List variant="bordered" dividers className="w-full max-w-md">
            {SETTINGS_ROWS.map(({ id, label, icon: Icon, hint }) => (
              <ListItem
                key={id}
                as="li"
                clickable
                selected={selectedSetting === id}
                onClick={() => setSelectedSetting(id)}
              >
                <ListItem.Leading>
                  <Icon size={20} className="text-content" />
                </ListItem.Leading>
                <ListItem.Content>
                  <ListItem.Title>{label}</ListItem.Title>
                  <ListItem.Description>{hint}</ListItem.Description>
                </ListItem.Content>
                <ListItem.Trailing>
                  <ChevronRight size={16} />
                </ListItem.Trailing>
              </ListItem>
            ))}
          </List>
        </PreviewRow>
      </section>

      {/* ── Inbox · selectable rows ────────────────────────── */}
      <section>
        <SectionHeader>
          Inbox · click anywhere on the row to toggle selection
        </SectionHeader>
        <PreviewRow
          code={`<ListItem
  as="li"
  clickable
  align="start"
  selected={checked}
  onClick={() => setChecked((c) => !c)}
  aria-label={\`\${checked ? 'Deselect' : 'Select'} message\`}
>
  {/* stopPropagation prevents a direct checkbox click from
      double-toggling via row's onClick. */}
  <ListItem.Leading align="start" onClick={(e) => e.stopPropagation()}>
    <Checkbox size="sm" checked={checked} onCheckedChange={setChecked} tabIndex={-1} />
  </ListItem.Leading>
  <ListItem.Content>
    <ListItem.Title>Air India · Your boarding pass is ready</ListItem.Title>
    <ListItem.Description lines={2}>
      Web check-in is open for AI 805 (DEL→BOM).
    </ListItem.Description>
  </ListItem.Content>
  <ListItem.Trailing align="start">
    <Badge variant="info" appearance="soft" size="sm">New</Badge>
  </ListItem.Trailing>
</ListItem>`}
        >
          <List variant="bordered" dividers className="w-full max-w-xl">
            {INBOX_MESSAGES.map((m) => {
              const checked = checkedInbox[m.id] ?? false
              const toggle = () =>
                setCheckedInbox((s) => ({ ...s, [m.id]: !s[m.id] }))
              return (
                <ListItem
                  key={m.id}
                  as="li"
                  clickable
                  align="start"
                  selected={checked}
                  onClick={toggle}
                  aria-label={`${checked ? 'Deselect' : 'Select'} message: ${m.title}`}
                >
                  {/*
                   * stopPropagation on the leading slot keeps a direct click
                   * on the checkbox from double-firing — the box updates via
                   * its own onCheckedChange, the row only fires on clicks
                   * outside the box.
                   */}
                  <ListItem.Leading
                    align="start"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      size="sm"
                      checked={checked}
                      onCheckedChange={(v) =>
                        setCheckedInbox((s) => ({ ...s, [m.id]: v === true }))
                      }
                      // The row owns the aria-label; the box is decorative
                      // for screen readers when reached via the row.
                      aria-label={`Select ${m.title}`}
                      tabIndex={-1}
                    />
                  </ListItem.Leading>
                  <ListItem.Content>
                    <ListItem.Title>{m.title}</ListItem.Title>
                    <ListItem.Description lines={2}>
                      {m.body}
                    </ListItem.Description>
                  </ListItem.Content>
                  <ListItem.Trailing align="start">
                    {m.trailing === 'badge' ? (
                      <Badge variant="info" appearance="soft" size="sm">
                        New
                      </Badge>
                    ) : (
                      <Text variant="body-xs" color="muted">
                        {m.trailing}
                      </Text>
                    )}
                  </ListItem.Trailing>
                </ListItem>
              )
            })}
          </List>
        </PreviewRow>
      </section>

      {/* ── Navigation · active state ──────────────────────── */}
      <section>
        <SectionHeader>Navigation · `active` ⇒ aria-current="page"</SectionHeader>
        <PreviewRow
          code={`<List variant="bordered">
  <ListItem as="li" clickable active>
    <ListItem.Leading><Flight size={18} /></ListItem.Leading>
    <ListItem.Content>
      <ListItem.Title>Flights</ListItem.Title>
    </ListItem.Content>
  </ListItem>
  <ListItem as="li" clickable>
    <ListItem.Leading><Hotel size={18} /></ListItem.Leading>
    <ListItem.Content>
      <ListItem.Title>Hotels</ListItem.Title>
    </ListItem.Content>
  </ListItem>
  <ListItem as="li" clickable disabled>
    <ListItem.Leading><Mail size={18} /></ListItem.Leading>
    <ListItem.Content>
      <ListItem.Title>Messages</ListItem.Title>
      <ListItem.Description>Coming soon</ListItem.Description>
    </ListItem.Content>
  </ListItem>
</List>`}
        >
          <List variant="bordered" className="w-full max-w-xs">
            <ListItem as="li" clickable active>
              <ListItem.Leading>
                <Flight size={18} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Flights</ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem as="li" clickable>
              <ListItem.Leading>
                <Hotel size={18} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Hotels</ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem as="li" clickable>
              <ListItem.Leading>
                <Bookmark size={18} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Saved trips</ListItem.Title>
              </ListItem.Content>
              <ListItem.Trailing>
                <Badge variant="default" appearance="soft" size="sm" radius="full">
                  3
                </Badge>
              </ListItem.Trailing>
            </ListItem>
            <ListItem as="li" clickable disabled>
              <ListItem.Leading>
                <Mail size={18} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Messages</ListItem.Title>
                <ListItem.Description>Coming soon</ListItem.Description>
              </ListItem.Content>
            </ListItem>
          </List>
        </PreviewRow>
      </section>

      {/* ── People · avatars + status ──────────────────────── */}
      <section>
        <SectionHeader>People · avatars, status dots, trailing actions</SectionHeader>
        <PreviewRow
          code={`<ListItem as="li" clickable>
  <ListItem.Leading>
    <Avatar initials="RS" />
  </ListItem.Leading>
  <ListItem.Content>
    <ListItem.Title>Raj Singh</ListItem.Title>
    <ListItem.Description>Frontend Engineer</ListItem.Description>
  </ListItem.Content>
  <ListItem.Trailing>
    <StatusDot tone="success" />
    <ChevronRight size={16} />
  </ListItem.Trailing>
</ListItem>`}
        >
          <List variant="bordered" dividers className="w-full max-w-md">
            <ListItem as="li" clickable>
              <ListItem.Leading>
                <Avatar initials="RS" color="bg-surface-brand" />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Raj Singh</ListItem.Title>
                <ListItem.Description>Frontend Engineer</ListItem.Description>
              </ListItem.Content>
              <ListItem.Trailing>
                <StatusDot tone="success" />
                <ChevronRight size={16} />
              </ListItem.Trailing>
            </ListItem>
            <ListItem as="li" clickable>
              <ListItem.Leading>
                <Avatar initials="AK" color="bg-surface-highlight" />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Aisha Kapoor</ListItem.Title>
                <ListItem.Description>Product Designer</ListItem.Description>
              </ListItem.Content>
              <ListItem.Trailing>
                <StatusDot tone="warning" />
                <ChevronRight size={16} />
              </ListItem.Trailing>
            </ListItem>
            <ListItem as="li" clickable>
              <ListItem.Leading>
                <Avatar initials="NV" color="bg-surface-success" />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Nikhil Verma</ListItem.Title>
                <ListItem.Description>iOS Engineer · Bengaluru</ListItem.Description>
              </ListItem.Content>
              <ListItem.Trailing>
                <StatusDot tone="critical" />
                <ChevronRight size={16} />
              </ListItem.Trailing>
            </ListItem>
          </List>
        </PreviewRow>
      </section>

      {/* ── Vertical · model picker card grid ──────────────── */}
      <section>
        <SectionHeader>
          Vertical · model picker grid · clickable cards with selection
        </SectionHeader>
        <PreviewRow
          code={`<div className="grid grid-cols-3 gap-4">
  {models.map((m) => (
    <ListItem
      key={m.id}
      orientation="vertical"
      clickable
      selected={selected === m.id}
      onClick={() => setSelected(m.id)}
      className={selected === m.id
        ? 'rounded-xl border border-stroke-brand p-3'
        : 'rounded-xl border border-stroke p-3 hover:border-stroke-strong'}
    >
      <ListItem.Leading>
        <div className="aspect-square w-full rounded-lg" style={{ background: m.gradient }} />
      </ListItem.Leading>
      <ListItem.Content className="mt-3">
        <ListItem.Title as="h3">{m.name}</ListItem.Title>
        <ListItem.Description lines={2}>{m.hint}</ListItem.Description>
      </ListItem.Content>
    </ListItem>
  ))}
</div>`}
        >
          {/*
           * Three vertical ListItems in a CSS grid. `orientation="vertical"`
           * stacks Leading (image) on top of the content stack; `as="div"`
           * because each card is its own bordered button, not a list cell.
           * Each card is `clickable` and `selected={…}` so only the focused
           * model gets the brand-tinted background + accent ring.
           */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {MODELS.map((m) => {
              const isSelected = selectedModel === m.id
              return (
                <ListItem
                  key={m.id}
                  orientation="vertical"
                  clickable
                  selected={isSelected}
                  onClick={() => setSelectedModel(m.id)}
                  aria-label={`Select model ${m.name}`}
                  className={cx(
                    'rounded-xl border p-3',
                    isSelected
                      ? 'border-stroke-brand'
                      : 'border-stroke hover:border-stroke-strong',
                  )}
                >
                  <ListItem.Leading>
                    <div
                      className="aspect-square w-full overflow-hidden rounded-lg"
                      style={{ background: m.gradient }}
                      aria-hidden
                    />
                  </ListItem.Leading>
                  <ListItem.Content className="mt-3">
                    <ListItem.Title as="h3">{m.name}</ListItem.Title>
                    <ListItem.Description lines={2}>
                      {m.hint}
                    </ListItem.Description>
                  </ListItem.Content>
                </ListItem>
              )
            })}
          </div>
        </PreviewRow>
      </section>

      {/* ── Team members · avatar stack + trailing action ──── */}
      <section>
        <SectionHeader>
          Empty state · avatar stack leading · trailing action
        </SectionHeader>
        <PreviewRow
          code={`<ListItem as="li" density="spacious">
  <ListItem.Leading>
    <div className="flex -space-x-2">
      {team.map((a) => (
        <span
          key={a.initials}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-surface-elevated"
        >
          {a.initials}
        </span>
      ))}
    </div>
  </ListItem.Leading>
  <ListItem.Content>
    <ListItem.Title>No Team Members</ListItem.Title>
    <ListItem.Description>
      Invite your team to collaborate on this project.
    </ListItem.Description>
  </ListItem.Content>
  <ListItem.Trailing>
    <Button variant="outline" size="sm">Invite</Button>
  </ListItem.Trailing>
</ListItem>`}
        >
          <List variant="bordered" className="w-full max-w-3xl">
            <ListItem as="li" density="spacious">
              <ListItem.Leading>
                {/*
                 * Overlapping avatars — `-space-x-2` collapses the gap and
                 * the `ring` token traces each circle so they read as a
                 * stack rather than a row.
                 */}
                <div className="flex -space-x-2">
                  {TEAM_AVATARS.map((a) => (
                    <span
                      key={a.initials}
                      className={cx(
                        'inline-flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-content-on-brand ring-2 ring-surface-elevated',
                        a.bg,
                      )}
                      aria-hidden
                    >
                      {a.initials}
                    </span>
                  ))}
                </div>
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>No Team Members</ListItem.Title>
                <ListItem.Description>
                  Invite your team to collaborate on this project.
                </ListItem.Description>
              </ListItem.Content>
              <ListItem.Trailing>
                <Button variant="outline" size="sm">
                  Invite
                </Button>
              </ListItem.Trailing>
            </ListItem>
          </List>
        </PreviewRow>
      </section>

      {/* ── Notifications · trailing switch (nested control) ─ */}
      <section>
        <SectionHeader>Trailing control · nested interactive element</SectionHeader>
        <PreviewRow
          code={`<ListItem as="li">
  <ListItem.Leading>
    <Notifications size={20} />
  </ListItem.Leading>
  <ListItem.Content>
    <ListItem.Title>Push notifications</ListItem.Title>
    <ListItem.Description>Booking updates, fare drops.</ListItem.Description>
  </ListItem.Content>
  <ListItem.Trailing>
    <Checkbox
      checked={push}
      onCheckedChange={(v) => setPush(v === true)}
      aria-label="Toggle push notifications"
    />
  </ListItem.Trailing>
</ListItem>`}
        >
          <List variant="bordered" dividers className="w-full max-w-md">
            <ListItem as="li">
              <ListItem.Leading>
                <Notifications size={20} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Push notifications</ListItem.Title>
                <ListItem.Description>
                  Booking updates, fare drops, gate changes.
                </ListItem.Description>
              </ListItem.Content>
              <ListItem.Trailing>
                <Checkbox
                  checked={notifications.push}
                  onCheckedChange={(v) =>
                    setNotifications((s) => ({ ...s, push: v === true }))
                  }
                  aria-label="Toggle push notifications"
                />
              </ListItem.Trailing>
            </ListItem>
            <ListItem as="li">
              <ListItem.Leading>
                <Mail size={20} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Email digests</ListItem.Title>
                <ListItem.Description>Weekly itinerary recap.</ListItem.Description>
              </ListItem.Content>
              <ListItem.Trailing>
                <Checkbox
                  checked={notifications.email}
                  onCheckedChange={(v) =>
                    setNotifications((s) => ({ ...s, email: v === true }))
                  }
                  aria-label="Toggle email digests"
                />
              </ListItem.Trailing>
            </ListItem>
          </List>
        </PreviewRow>
      </section>

      {/* ── Size + density playground ──────────────────────── */}
      <section>
        <SectionHeader>Sizes × density</SectionHeader>
        <div className="mb-3 flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`rounded-md border px-3 py-1.5 text-xs ${
                s === size
                  ? 'border-stroke-brand bg-surface-brand-muted text-content-brand'
                  : 'border-stroke text-content'
              }`}
            >
              size: {s}
            </button>
          ))}
          {DENSITIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDensity(d)}
              className={`rounded-md border px-3 py-1.5 text-xs ${
                d === density
                  ? 'border-stroke-brand bg-surface-brand-muted text-content-brand'
                  : 'border-stroke text-content'
              }`}
            >
              density: {d}
            </button>
          ))}
        </div>
        <PreviewRow
          code={`<List variant="bordered" dividers size="md" density="comfortable">
  <ListItem as="li" clickable>
    <ListItem.Leading>
      <Flight size={18} />
    </ListItem.Leading>
    <ListItem.Content>
      <ListItem.Title>Delhi → Mumbai</ListItem.Title>
      <ListItem.Description>Tue 14 Jul · 06:20 · 2h 15m</ListItem.Description>
    </ListItem.Content>
    <ListItem.Trailing>
      <ChevronRight size={16} />
    </ListItem.Trailing>
  </ListItem>
</List>`}
        >
          <List
            variant="bordered"
            dividers
            size={size}
            density={density}
            className="w-full max-w-md"
          >
            <ListItem as="li" clickable>
              <ListItem.Leading>
                <Flight size={18} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Delhi → Mumbai</ListItem.Title>
                <ListItem.Description>Tue 14 Jul · 06:20 · 2h 15m</ListItem.Description>
              </ListItem.Content>
              <ListItem.Trailing>
                <ChevronRight size={16} />
              </ListItem.Trailing>
            </ListItem>
            <ListItem as="li" clickable>
              <ListItem.Leading>
                <Flight size={18} />
              </ListItem.Leading>
              <ListItem.Content>
                <ListItem.Title>Bengaluru → Goa</ListItem.Title>
                <ListItem.Description>Fri 17 Jul · 11:45 · 1h 30m</ListItem.Description>
              </ListItem.Content>
              <ListItem.Trailing>
                <ChevronRight size={16} />
              </ListItem.Trailing>
            </ListItem>
          </List>
        </PreviewRow>
      </section>

      {/* ── States ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>States · selected · active · disabled · loading</SectionHeader>
        <PreviewRow
          code={`<List variant="bordered" dividers>
  <ListItem as="li" clickable selected title="Selected row" description="aria-selected" />
  <ListItem as="li" clickable active   title="Active row"   description='aria-current="page"' />
  <ListItem as="li" clickable disabled title="Disabled row" description="Pointer + keyboard blocked" />
  <ListItem as="li" loading />
</List>`}
        >
          <List variant="bordered" dividers className="w-full max-w-md">
            <ListItem as="li" clickable selected title="Selected row" description="aria-selected" />
            <ListItem as="li" clickable active title="Active row" description='aria-current="page"' />
            <ListItem as="li" clickable disabled title="Disabled row" description="Pointer + keyboard blocked" />
            <ListItem as="li" loading />
          </List>
        </PreviewRow>
      </section>

      {/* ── Accessibility ──────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Semantic root.</strong>{' '}
            Renders <code>&lt;div&gt;</code> by default; <code>clickable</code>{' '}
            promotes it to <code>&lt;button&gt;</code>. Inside a{' '}
            <code>&lt;List&gt;</code> pass <code>as="li"</code> so screen
            readers hear list structure.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong>{' '}
            Clickable rows take Tab focus, activate on Enter and Space, and
            paint a <code>:focus-visible</code> ring. When rendered as a
            non-native element we fall back to <code>role="button"</code> +{' '}
            <code>tabIndex</code> with a manual key handler — never a bare{' '}
            <code>&lt;div onClick&gt;</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">State attributes.</strong>{' '}
            <code>aria-selected</code> for <code>selected</code>,{' '}
            <code>aria-current="page"</code> for <code>active</code>,{' '}
            <code>aria-disabled</code> + <code>aria-busy</code> for{' '}
            <code>disabled</code> and <code>loading</code>. Mirrored as{' '}
            <code>data-*</code> so external CSS / animation libraries can hook
            in without depending on Tailwind class strings.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Touch targets.</strong>{' '}
            Clickable rows are clamped to 44 px / 48 px / 56 px minimum height
            across the three densities, meeting the mobile touch-target floor.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">RTL.</strong> Padding,
            slot order, and the <code>active</code> accent bar use logical
            properties (<code>inset-inline-start</code>, <code>padding-inline</code>),
            so the row flips correctly under <code>dir="rtl"</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Virtualization.</strong>{' '}
            Ref forwarding + no fixed height assumptions, so the row drops
            straight into TanStack Virtual / React Window. Density / size only
            change <em>min</em>-height for clickable rows, never a fixed one.
          </Text>
        </div>
      </section>

      {/* ── Theme tokens ───────────────────────────────────── */}
      <section>
        <SectionHeader>Theme tokens · overrideable per row or globally</SectionHeader>
        <CodeBlock
          code={`/* On the root, or per row via style="--list-item-hover-bg: …" */
.swift-list-item {
  --list-item-padding-x: 1rem;
  --list-item-gap: 0.75rem;
  --list-item-radius: 0px;
  --list-item-bg: transparent;
  --list-item-hover-bg: var(--color-surface-muted);
  --list-item-selected-bg: var(--color-surface-brand-muted);
  --list-item-active-bg: var(--color-surface-subtle);
  --list-item-active-accent: var(--color-stroke-brand);
}`}
        />
      </section>

      {/* ── Compound parts ─────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface-muted text-content-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Part</th>
                <th className="px-4 py-2 font-medium">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke">
              {COMPOUND_PARTS.map((p) => (
                <tr key={p.name} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-content-strong">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-content">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Props table ────────────────────────────────────── */}
      <section>
        <SectionHeader>ListItem props</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface-muted text-content-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Prop</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Default</th>
                <th className="px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke">
              {LIST_ITEM_PROPS.map((p) => (
                <tr key={p.name} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-content-strong">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] leading-5 text-content">
                    {p.type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-content-muted">
                    {p.defaultValue ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-content">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Import ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { ListItem, List } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { ListItem, List } from '@swift/components/ListItem'`}
          />
          <CopyableImport
            label="With types"
            code={`import { ListItem, List, type ListItemSize, type ListItemDensity } from '@swift/components'`}
          />
        </div>
      </section>

      {/* ── Usage ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`// Simple — title + description shortcut
<ListItem title="Air India" description="Non-stop · 2h 15m" />

// Compound — full control
<ListItem clickable as="li">
  <ListItem.Leading>
    <Avatar />
  </ListItem.Leading>

  <ListItem.Content>
    <ListItem.Title>Raj Singh</ListItem.Title>
    <ListItem.Description>Frontend Engineer</ListItem.Description>
  </ListItem.Content>

  <ListItem.Trailing>
    <ChevronRight />
  </ListItem.Trailing>
</ListItem>

// Inside a List — cascades size / density, manages dividers
<List variant="bordered" dividers size="md" density="comfortable">
  {items.map((item) => (
    <ListItem key={item.id} as="li" clickable selected={item.id === selected}>
      …
    </ListItem>
  ))}
</List>

// As a router link — no extra wrapper node
<ListItem asChild clickable>
  <Link to="/settings">…</Link>
</ListItem>`}
        />
      </section>
    </div>
  )
}
