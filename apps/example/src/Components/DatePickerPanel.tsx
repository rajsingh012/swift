import { useState } from 'react'
import { Button } from '@swift/components/Button'
import { DatePicker } from '@swift/components/DatePicker'
import type { DatePickerRangeValue } from '@swift/components/DatePicker'
import { Input } from '@swift/components/Input'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Accessible date picker built as a compound API. Single + range selection (check-in / check-out), free-text Input with strict parse, MonthSelect / YearSelect for fast navigation, hidden inputs for form-library compat, uncontrolled & controlled, popover under the Trigger, locale-aware labels, configurable week-start, min/max bounds, disabled dates (array or predicate), hover-range preview, full keyboard navigation (roving tabindex, arrows, PgUp/PgDn, Home/End, Enter/Space), ARIA grid semantics, asChild Trigger / RangeTrigger, theme tokens, SSR-safe portal.'

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'value',
    type: 'Date | null',
    description:
      'Controlled selected date. Pair with `onValueChange`. Use `null` to express "no selection".',
  },
  {
    name: 'defaultValue',
    type: 'Date | null',
    description:
      'Uncontrolled initial selection. Ignored when `value` is provided.',
  },
  {
    name: 'onValueChange',
    type: '(value: Date | null) => void',
    description:
      'Fires whenever a day is selected. The popover auto-closes on selection — combine with controlled `open` to override that.',
  },
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled popover open state. Pair with `onOpenChange`.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Uncontrolled initial open state.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description:
      'Fires on every open/close request — Trigger click, Esc, outside click, day select.',
  },
  {
    name: 'weekStartsOn',
    type: '0 | 1 | … | 6',
    defaultValue: '0',
    description:
      'First column of the week — 0 (Sunday) for US, 1 (Monday) for ISO / most of Europe. Drives both the weekday header order and the grid alignment.',
  },
  {
    name: 'numberOfMonths',
    type: 'number',
    defaultValue: '1',
    description:
      'Number of month panels to show side-by-side. 2 is the booking-site convention. Prev/Next step by this number so both panels move in lockstep. Range hover-preview spans across panels.',
  },
  {
    name: 'showWeekNumbers',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Render an ISO 8601 week-number column on the left of each grid. Common in European reporting / scheduling tools.',
  },
  {
    name: 'withTime',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Embed a TimePicker inside the popover. The Date value preserves its time component (default noon for the first selection). Day-click no longer auto-closes — users explicitly confirm via the Done button. Hidden form input switches to ISO datetime (`YYYY-MM-DDTHH:MM`).',
  },
  {
    name: 'timeProps',
    type: '{ hourCycle?, step?, showSeconds?, min?, max? }',
    description:
      'Pass-through config for the embedded TimePicker(s). Only consulted when `withTime` is true.',
  },
  {
    name: 'min',
    type: 'Date',
    description:
      'Earliest selectable date (inclusive). Dates before this are disabled; Prev button is disabled when the previous month is entirely out of range.',
  },
  {
    name: 'max',
    type: 'Date',
    description:
      'Latest selectable date (inclusive). Dates after this are disabled; Next button is disabled when the next month is entirely out of range.',
  },
  {
    name: 'disabledDates',
    type: 'Date[] | ((date: Date) => boolean)',
    description:
      'Disabled dates beyond the min/max window. Pass an array for fixed holidays / blackouts, or a predicate for dynamic rules (weekends only, sold-out inventory). Predicate runs once per visible cell per render.',
  },
  {
    name: 'locale',
    type: 'string',
    description:
      'BCP-47 tag for month + weekday labels. Defaults to `navigator.language`. Uses `Intl.DateTimeFormat` — no shipped translation tables.',
  },
  {
    name: 'id',
    type: 'string',
    description:
      'Explicit id for the popover content (else auto-generated). Useful when wiring external `aria-controls`.',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Native form name. Renders hidden ISO-date inputs that participate in form submission. Single mode: one input. Range mode: two — `${name}.start` and `${name}.end`.',
  },
  {
    name: 'form',
    type: 'string',
    description:
      'Associates the hidden input(s) with an external `<form id>`. Useful when the picker lives outside the form it submits to.',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Marks the hidden input(s) as required for native HTML validation.',
  },
]

const COMPOUND_PARTS: ReadonlyArray<{ name: string; desc: string }> = [
  {
    name: 'DatePicker.Trigger',
    desc: 'The element that opens the calendar. Renders a `<button>` showing the formatted value (or the placeholder). Pass `asChild` to wrap your own Button.',
  },
  {
    name: 'DatePicker.RangeTrigger',
    desc: 'Booking-style two-field trigger for `mode="range"`. Pass `slot="start"` for the check-in field and `slot="end"` for check-out; both share one popover.',
  },
  {
    name: 'DatePicker.Input',
    desc: 'Free-text date input with strict parse on blur / Enter. Format default `"YYYY-MM-DD"`; override via `format`. In range mode use `slot="start" | "end"` to bind to one side.',
  },
  {
    name: 'DatePicker.Portal',
    desc: 'Portals its children into `document.body` (or `container`) so the popover escapes transformed / clipped ancestors. SSR-safe — defers until client mount.',
  },
  {
    name: 'DatePicker.Content',
    desc: 'The popover surface. Owns positioning (v1: naive `getBoundingClientRect` under the Trigger), Esc / outside-click dismissal, presence-for-exit animation, and focus restore.',
  },
  {
    name: 'DatePicker.Calendar',
    desc: 'Layout shell — `Header + Grid` by default. Pass children to compose a custom calendar layout (e.g. a sidebar of presets next to the grid).',
  },
  {
    name: 'DatePicker.Header',
    desc: 'Month navigation row. Default children: `PrevButton`, the live-announced month label, and `NextButton`.',
  },
  {
    name: 'DatePicker.PrevButton / .NextButton',
    desc: 'Step the visible month by ±1. Disabled automatically when the adjacent month is entirely out of `min` / `max` bounds. Default chevron icons; override via `children`.',
  },
  {
    name: 'DatePicker.MonthSelect',
    desc: 'Native `<select>` for fast month navigation. Months outside `min` / `max` are disabled. Place it inside `Header` to replace or augment the static label.',
  },
  {
    name: 'DatePicker.YearSelect',
    desc: 'Native `<select>` for year navigation. Range defaults to ±20 from the current year (or `min` / `max` if set); override via `from` / `to` for DOB-style pickers.',
  },
  {
    name: 'DatePicker.Presets',
    desc: 'Container for a quick-pick sidebar (right-bordered, narrow column). Place it as a sibling to `Calendar` inside `Content` for a "Today / Last 7 days" style preset list.',
  },
  {
    name: 'DatePicker.Preset',
    desc: 'A single quick-pick button. `value` is a Date (single mode) or `{ start, end }` (range mode) — pass a function for date-of-day accuracy ("Today" stays correct across midnight). Click commits and closes.',
  },
  {
    name: 'DatePicker.TimeFields',
    desc: 'Embedded TimePicker(s) for `withTime` mode. Single: one input bound to the value\'s time. Range: two inputs (Start time / End time), each bound to its side. Disabled until the corresponding date is set. Auto-rendered by `Content` when `withTime` is on; compose explicitly to customise placement.',
  },
  {
    name: 'DatePicker.DoneButton',
    desc: 'Closes the popover. Necessary in `withTime` mode (day-click no longer auto-closes). Pass `asChild` to wrap your own Button.',
  },
  {
    name: 'DatePicker.Grid',
    desc: 'The `role="grid"` calendar. Weekday header row + 6 week rows of `DatePicker.Day` cells. Always rectangular (leading / trailing cells come from neighbour months).',
  },
  {
    name: 'DatePicker.Day',
    desc: 'A single day cell. Exposes `data-selected`, `data-today`, `data-outside-month` for styling hooks. Click selects + closes the popover.',
  },
]

/**
 * Hotel booking widget — the canonical real-world DatePicker use case.
 * Uses everything the picker offers: range mode, two-month display,
 * separate check-in / check-out triggers, presets sidebar, min date
 * (no past nights), and the `name` prop so the picker emits hidden
 * ISO inputs alongside the rest of the form fields.
 */
function HotelBookingWidget() {
  const [destination, setDestination] = useState('')
  const [stay, setStay] = useState<DatePickerRangeValue>({
    start: null,
    end: null,
  })
  const [guests, setGuests] = useState(2)
  const [submission, setSubmission] = useState<string | null>(null)

  // No past nights — earliest selectable date is today.
  const today = (() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })()

  /** Tonight = today → tomorrow. */
  const tonight = (): DatePickerRangeValue => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 1)
    return { start, end }
  }

  /** Friday → Sunday of the current week. */
  const thisWeekend = (): DatePickerRangeValue => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    // Days until Friday (5). If today is Sat (6) or Sun (0), this rolls
    // to next Friday — feels natural for "this weekend" said on Sat.
    const day = start.getDay()
    const daysToFriday = (5 - day + 7) % 7
    start.setDate(start.getDate() + daysToFriday)
    const end = new Date(start)
    end.setDate(start.getDate() + 2)
    return { start, end }
  }

  /** Next weekend = this weekend + 7 days. */
  const nextWeekend = (): DatePickerRangeValue => {
    const w = thisWeekend()
    w.start!.setDate(w.start!.getDate() + 7)
    w.end!.setDate(w.end!.getDate() + 7)
    return w
  }

  /** A week-long stay starting today. */
  const weekStay = (): DatePickerRangeValue => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 7)
    return { start, end }
  }

  // ── Derived stay info for the summary line ──────────────────────
  const nights =
    stay.start && stay.end
      ? Math.round(
          (stay.end.getTime() - stay.start.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0
  const formatDate = (d: Date | null) =>
    d
      ? new Intl.DateTimeFormat('en', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(d)
      : null

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!destination || !stay.start || !stay.end) {
          setSubmission('Fill in destination + dates first.')
          return
        }
        const data = new FormData(event.currentTarget)
        const parts: string[] = []
        data.forEach((value, key) => parts.push(`${key}=${value}`))
        setSubmission(`POST: ${parts.join(' · ')}`)
      }}
      className="rounded-2xl border border-stroke bg-surface-elevated p-5 shadow-(--shadow-level3)"
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_2fr_0.8fr_auto] lg:items-end">
        {/* Destination */}
        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Destination
          </Text>
          <Input
            name="destination"
            placeholder="City, hotel, airport"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Stay dates */}
        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Stay dates
          </Text>
          <DatePicker
            mode="range"
            numberOfMonths={2}
            min={today}
            name="stay"
            value={stay}
            onValueChange={setStay}
          >
            <div className="flex flex-1 gap-2">
              <DatePicker.RangeTrigger
                slot="start"
                placeholder="Check-in"
                className="flex-1"
              />
              <DatePicker.RangeTrigger
                slot="end"
                placeholder="Check-out"
                className="flex-1"
              />
            </div>
            <DatePicker.Portal>
              <DatePicker.Content>
                <div className="flex gap-4">
                  <DatePicker.Presets>
                    <Text variant="body-xs" fontWeight="semibold" color="muted" className="px-2 pb-1 uppercase tracking-wide">
                      Quick pick
                    </Text>
                    <DatePicker.Preset value={tonight}>Tonight</DatePicker.Preset>
                    <DatePicker.Preset value={thisWeekend}>This weekend</DatePicker.Preset>
                    <DatePicker.Preset value={nextWeekend}>Next weekend</DatePicker.Preset>
                    <DatePicker.Preset value={weekStay}>1 week stay</DatePicker.Preset>
                  </DatePicker.Presets>
                  <DatePicker.Calendar />
                </div>
              </DatePicker.Content>
            </DatePicker.Portal>
          </DatePicker>
        </div>

        {/* Guests */}
        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Guests
          </Text>
          <Input
            name="guests"
            type="number"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
          />
        </div>

        {/* Search */}
        <Button type="submit" variant="primary" classes={{ root: 'lg:h-10' }}>
          Search hotels
        </Button>
      </div>

      {/* Live summary + last submission */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stroke-muted pt-3">
        <Text variant="body-sm" color="secondary">
          <strong className="text-content-strong">Stay:</strong>{' '}
          {stay.start && stay.end ? (
            <>
              {formatDate(stay.start)} → {formatDate(stay.end)}{' '}
              <span className="text-content-muted">
                ({nights} {nights === 1 ? 'night' : 'nights'})
              </span>
            </>
          ) : (
            <span className="text-content-muted">not selected</span>
          )}
        </Text>
        {submission ? (
          <Text variant="body-sm" color="primary" fontFamily="mono">
            {submission}
          </Text>
        ) : null}
      </div>
    </form>
  )
}

/**
 * Reminder widget — DatePicker with `withTime`. One trigger shows
 * "May 12, 2026, 2:30 PM" with date + time integrated in one popover.
 * Demonstrates the embedded TimePicker flow.
 */
function ReminderWidget() {
  const [title, setTitle] = useState('')
  const [remindAt, setRemindAt] = useState<Date | null>(null)
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly'>('none')
  const [submission, setSubmission] = useState<string | null>(null)

  const today = (() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!title || !remindAt) {
          setSubmission('Add a title and pick a date + time.')
          return
        }
        const data = new FormData(event.currentTarget)
        const parts: string[] = []
        data.forEach((value, key) => parts.push(`${key}=${value}`))
        setSubmission(`POST: ${parts.join(' · ')}`)
      }}
      className="rounded-2xl border border-stroke bg-surface-elevated p-5 shadow-(--shadow-level3)"
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1.4fr_0.8fr_auto] lg:items-end">
        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Reminder title
          </Text>
          <Input
            name="title"
            placeholder="Pick up dry cleaning"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Remind me at
          </Text>
          <DatePicker
            name="remindAt"
            min={today}
            withTime
            timeProps={{ hourCycle: 'h12', step: 900 }}
            value={remindAt}
            onValueChange={setRemindAt}
          />
        </div>

        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Repeat
          </Text>
          <select
            name="repeat"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value as typeof repeat)}
            className="h-9 w-full rounded-md border border-stroke bg-surface px-3 text-sm text-content outline-none hover:border-stroke-strong focus-visible:border-stroke-brand focus-visible:ring-2 focus-visible:ring-stroke-brand/30"
          >
            <option value="none">Never</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <Button type="submit" variant="primary" classes={{ root: 'lg:h-10' }}>
          Save reminder
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stroke-muted pt-3">
        <Text variant="body-sm" color="secondary">
          <strong className="text-content-strong">When:</strong>{' '}
          {remindAt ? (
            <>
              {new Intl.DateTimeFormat('en', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              }).format(remindAt)}{' '}
              <span className="text-content-muted">
                ({repeat === 'none' ? 'one-time' : `repeats ${repeat}`})
              </span>
            </>
          ) : (
            <span className="text-content-muted">not set</span>
          )}
        </Text>
        {submission ? (
          <Text variant="body-sm" color="primary" fontFamily="mono">
            {submission}
          </Text>
        ) : null}
      </div>
    </form>
  )
}

function PropsTable({ rows }: { rows: ReadonlyArray<PropRow> }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
      <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
        <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">Prop</Text>
        <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">Type</Text>
        <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">Default</Text>
      </div>
      {rows.map(({ name, type, defaultValue, description }) => (
        <div
          key={name}
          className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
        >
          <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">{name}</Text>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Text variant="body-xs" fontFamily="mono" color="secondary" className="wrap-break-word">{type}</Text>
            <Text variant="body-sm" color="secondary">{description}</Text>
          </div>
          <Text variant="body-xs" fontFamily="mono" color={defaultValue ? 'inherit' : 'muted'}>
            {defaultValue ?? '—'}
          </Text>
        </div>
      ))}
    </div>
  )
}

export function DatePickerPanel() {
  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>DatePicker</Text>
        <Text variant="para-lg" color="secondary">{DESCRIPTION}</Text>
      </header>

      {/* Real-world example · Hotel booking ──────────────── */}
      <section>
        <SectionHeader>Real-world example · Hotel booking widget</SectionHeader>
        <div className="grid gap-3">
          <Text variant="body-sm" color="secondary">
            A complete booking search bar. Range mode + two-month calendar +
            check-in / check-out fields + a preset sidebar (Tonight / This
            weekend / Next weekend / 1 week stay) + <code>min</code> set to
            today so past nights can't be picked + <code>name="stay"</code>{' '}
            emits hidden ISO inputs that show up in the form submit summary.
          </Text>
          <HotelBookingWidget />
        </div>
      </section>

      {/* Real-world example · Reminder (withTime) ────────── */}
      <section>
        <SectionHeader>Real-world example · Reminder widget (date + time)</SectionHeader>
        <div className="grid gap-3">
          <Text variant="body-sm" color="secondary">
            Single picker for date + time via <code>withTime</code> — one
            trigger shows the combined date + time (e.g.{' '}
            <code>May 12, 2026, 2:30 PM</code>). The popover opens a
            calendar with a nested time picker beneath it. <code>min=today</code>{' '}
            prevents past reminders; the hidden input posts ISO datetime
            (<code>YYYY-MM-DDTHH:MM</code>).
          </Text>
          <ReminderWidget />
        </div>
      </section>

      {/* Booking-style range ──────────────────────────────── */}
      <section>
        <SectionHeader>Range · Check-in / Check-out</SectionHeader>
        <PreviewRow
          code={`<DatePicker mode="range">
  <div className="flex gap-2">
    <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
    <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
  </div>
  <DatePicker.Portal>
    <DatePicker.Content />
  </DatePicker.Portal>
</DatePicker>`}
        >
          <DatePicker mode="range">
            <div className="flex gap-2">
              <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
              <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
            </div>
            <DatePicker.Portal>
              <DatePicker.Content />
            </DatePicker.Portal>
          </DatePicker>
        </PreviewRow>
      </section>

      {/* Two-month display ────────────────────────────────── */}
      <section>
        <SectionHeader>Two months · the booking-site convention</SectionHeader>
        <PreviewRow
          code={`<DatePicker mode="range" numberOfMonths={2}>
  <div className="flex gap-2">
    <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
    <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
  </div>
  <DatePicker.Portal>
    <DatePicker.Content />
  </DatePicker.Portal>
</DatePicker>`}
        >
          <DatePicker mode="range" numberOfMonths={2}>
            <div className="flex gap-2">
              <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
              <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
            </div>
            <DatePicker.Portal>
              <DatePicker.Content />
            </DatePicker.Portal>
          </DatePicker>
        </PreviewRow>
      </section>

      {/* withTime · single ─────────────────────────────────── */}
      <section>
        <SectionHeader>withTime · DatePicker + TimePicker in one popover</SectionHeader>
        <PreviewRow
          code={`<DatePicker
  withTime
  timeProps={{ hourCycle: 'h12', step: 900 }}
  defaultValue={(() => { const d = new Date(); d.setHours(9, 0, 0, 0); return d })()}
/>`}
        >
          <DatePicker
            withTime
            timeProps={{ hourCycle: 'h12', step: 900 }}
            defaultValue={(() => {
              const d = new Date()
              d.setHours(9, 0, 0, 0)
              return d
            })()}
          />
        </PreviewRow>
      </section>

      {/* withTime · range ─────────────────────────────────── */}
      <section>
        <SectionHeader>withTime · Range (start + end with separate times)</SectionHeader>
        <PreviewRow
          code={`<DatePicker
  mode="range"
  withTime
  timeProps={{ hourCycle: 'h12', step: 1800 }}
  numberOfMonths={2}
>
  <div className="flex gap-2">
    <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
    <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
  </div>
  <DatePicker.Portal>
    <DatePicker.Content />
  </DatePicker.Portal>
</DatePicker>`}
        >
          <DatePicker
            mode="range"
            withTime
            timeProps={{ hourCycle: 'h12', step: 1800 }}
            numberOfMonths={2}
          >
            <div className="flex gap-2">
              <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
              <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
            </div>
            <DatePicker.Portal>
              <DatePicker.Content />
            </DatePicker.Portal>
          </DatePicker>
        </PreviewRow>
      </section>

      {/* Presets sidebar ─────────────────────────────────── */}
      <section>
        <SectionHeader>Presets · quick-pick sidebar</SectionHeader>
        <PreviewRow
          code={`<DatePicker mode="range">
  <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
  <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
  <DatePicker.Portal>
    <DatePicker.Content>
      <div className="flex gap-3">
        <DatePicker.Presets>
          <DatePicker.Preset value={() => new Date()}>Today</DatePicker.Preset>
          <DatePicker.Preset value={() => /* tomorrow */ ...}>Tomorrow</DatePicker.Preset>
          <DatePicker.Preset value={() => /* last 7 days */ ...}>Last 7 days</DatePicker.Preset>
        </DatePicker.Presets>
        <DatePicker.Calendar />
      </div>
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker>`}
        >
          <DatePicker mode="range">
            <div className="flex gap-2">
              <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
              <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
            </div>
            <DatePicker.Portal>
              <DatePicker.Content>
                <div className="flex gap-3">
                  <DatePicker.Presets>
                    <DatePicker.Preset value={() => new Date()}>Today</DatePicker.Preset>
                    <DatePicker.Preset
                      value={() => {
                        const d = new Date()
                        d.setDate(d.getDate() + 1)
                        return d
                      }}
                    >
                      Tomorrow
                    </DatePicker.Preset>
                    <DatePicker.Preset
                      value={() => {
                        const end = new Date()
                        const start = new Date()
                        start.setDate(end.getDate() - 6)
                        return { start, end }
                      }}
                    >
                      Last 7 days
                    </DatePicker.Preset>
                  </DatePicker.Presets>
                  <DatePicker.Calendar />
                </div>
              </DatePicker.Content>
            </DatePicker.Portal>
          </DatePicker>
        </PreviewRow>
      </section>

      {/* Min/Max bounds ────────────────────────────────────── */}
      <section>
        <SectionHeader>Min / Max bounds</SectionHeader>
        <PreviewRow
          code={`{/* Within a 30-day window centred on today. */}
const today = new Date()
const min = new Date(today); min.setDate(today.getDate() - 15)
const max = new Date(today); max.setDate(today.getDate() + 15)

<DatePicker min={min} max={max} />`}
        >
          {(() => {
            const today = new Date()
            const min = new Date(today)
            min.setDate(today.getDate() - 15)
            const max = new Date(today)
            max.setDate(today.getDate() + 15)
            return <DatePicker min={min} max={max} />
          })()}
        </PreviewRow>
      </section>

      {/* Disabled dates ────────────────────────────────────── */}
      <section>
        <SectionHeader>Disabled dates · predicate · weekends blocked</SectionHeader>
        <PreviewRow
          code={`<DatePicker
  disabledDates={(d) => {
    const day = d.getDay()
    return day === 0 || day === 6
  }}
/>`}
        >
          <DatePicker
            disabledDates={(d) => {
              const day = d.getDay()
              return day === 0 || day === 6
            }}
          />
        </PreviewRow>
      </section>

      {/* Month / Year select ─────────────────────────────── */}
      <section>
        <SectionHeader>MonthSelect + YearSelect · fast header navigation</SectionHeader>
        <PreviewRow
          code={`<DatePicker>
  <DatePicker.Trigger placeholder="Date of birth" />
  <DatePicker.Portal>
    <DatePicker.Content>
      <DatePicker.Calendar>
        <DatePicker.Header>
          <DatePicker.PrevButton />
          <div className="flex gap-2">
            <DatePicker.MonthSelect format="short" />
            <DatePicker.YearSelect from={1940} to={new Date().getFullYear()} />
          </div>
          <DatePicker.NextButton />
        </DatePicker.Header>
        <DatePicker.Grid />
      </DatePicker.Calendar>
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker>`}
        >
          <DatePicker>
            <DatePicker.Trigger placeholder="Date of birth" />
            <DatePicker.Portal>
              <DatePicker.Content>
                <DatePicker.Calendar>
                  <DatePicker.Header>
                    <DatePicker.PrevButton />
                    <div className="flex gap-2">
                      <DatePicker.MonthSelect format="short" />
                      <DatePicker.YearSelect
                        from={1940}
                        to={new Date().getFullYear()}
                      />
                    </div>
                    <DatePicker.NextButton />
                  </DatePicker.Header>
                  <DatePicker.Grid />
                </DatePicker.Calendar>
              </DatePicker.Content>
            </DatePicker.Portal>
          </DatePicker>
        </PreviewRow>
      </section>

      {/* Form compat ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Form library compat · hidden inputs</SectionHeader>
        <PreviewRow
          code={`{/* The picker emits hidden <input>s with ISO dates (YYYY-MM-DD) when
    \`name\` is set. Single mode: one input. Range mode: two, suffixed
    \`.start\` and \`.end\`. With \`withTime\`, switches to ISO datetime
    (YYYY-MM-DDTHH:MM). */}

<form action="/book">
  <DatePicker name="bookingDate" required />
  <button type="submit">Submit</button>
</form>`}
        >
          <Text variant="body-sm" color="secondary">
            Inspect the DOM — when <code>name</code> is set, the picker
            renders hidden inputs that participate in form submission
            and <code>FormData(form)</code>.
          </Text>
          <DatePicker name="bookingDate" defaultValue={new Date()} />
        </PreviewRow>
      </section>

      {/* Accessibility ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">role=&quot;grid&quot;.</strong>{' '}
            The calendar uses <code>role=&quot;grid&quot;</code> with{' '}
            <code>role=&quot;gridcell&quot;</code> day buttons.{' '}
            <code>aria-selected</code> reflects the value;{' '}
            <code>aria-disabled</code> + the native <code>disabled</code>{' '}
            attribute reflect <code>min</code> / <code>max</code> /{' '}
            <code>disabledDates</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Roving tabindex.</strong>{' '}
            Exactly one day cell holds <code>tabindex=0</code> at a time. Arrow
            keys move the tabbable cell; PageUp / PageDown step by month,
            Shift+PgUp/PgDn by year, Home / End jump to start/end of the
            focused week.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Focus restore.</strong>{' '}
            Focus lands on the selected (or today) day on open and returns to
            the Trigger on close. Escape and outside-click close the popover.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion.</strong>{' '}
            Popover enter / exit animations collapse to ~0ms under{' '}
            <code>prefers-reduced-motion</code>.
          </Text>
        </div>
      </section>

      {/* Root props ────────────────────────────────────────── */}
      <section>
        <SectionHeader>DatePicker · root props</SectionHeader>
        <PropsTable rows={ROOT_PROPS} />
      </section>

      {/* Compound parts ────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {COMPOUND_PARTS.map(({ name, desc }) => (
            <div
              key={name}
              className="grid gap-1 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[220px_1fr] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">{name}</Text>
              <Text variant="body-sm" color="secondary">{desc}</Text>
            </div>
          ))}
        </div>
      </section>

      {/* Import ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { DatePicker } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { DatePicker } from '@swift/components/DatePicker'`}
          />
        </div>
      </section>

      {/* Usage ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<DatePicker
  mode="range"
  numberOfMonths={2}
  min={today}
  name="stay"
  onValueChange={(v) => console.log(v)}
>
  <div className="flex gap-2">
    <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
    <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
  </div>
  <DatePicker.Portal>
    <DatePicker.Content />
  </DatePicker.Portal>
</DatePicker>`}
        />
      </section>
    </div>
  )
}
