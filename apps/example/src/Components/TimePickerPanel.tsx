import { useState } from 'react'
import { Button } from '@swift/components/Button'
import { DatePicker } from '@swift/components/DatePicker'
import type { DatePickerValue } from '@swift/components/DatePicker'
import { Input } from '@swift/components/Input'
import { Text } from '@swift/components/Text'
import { TimePicker } from '@swift/components/TimePicker'
import type { TimeValue } from '@swift/components/TimePicker'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Accessible time picker — compound popover with a stepper UI per slot (▲ value ▼), AM/PM segmented toggle, formatted preview, and OK / Cancel actions. 12h or 24h display, configurable minute step (5/15/30), min / max bounds, hidden ISO input for form-library compat.'

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'value',
    type: 'TimeValue | null',
    description:
      'Controlled time. `TimeValue` is `{ hours, minutes, seconds? }` (always 24-hour internally).',
  },
  {
    name: 'defaultValue',
    type: 'TimeValue | null',
    description:
      'Uncontrolled initial value. Ignored when `value` is provided.',
  },
  {
    name: 'onValueChange',
    type: '(value: TimeValue | null) => void',
    description:
      'Fires when OK commits the staged value (or when an option is clicked in inline `<TimePicker.Columns />` usage).',
  },
  {
    name: 'open / defaultOpen / onOpenChange',
    type: 'boolean / boolean / (open) => void',
    description: 'Controlled or uncontrolled popover open state.',
  },
  {
    name: 'hourCycle',
    type: `'h12' | 'h23'`,
    defaultValue: `'h23'`,
    description:
      '12-hour display shows `1–12` plus an AM/PM column. 24-hour shows `00–23` with no period column.',
  },
  {
    name: 'showSeconds',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Render an extra seconds column.',
  },
  {
    name: 'step',
    type: 'number',
    defaultValue: '60',
    description:
      'Step in seconds for the minute / seconds columns. Common: 60 (every minute), 300 (5 min), 900 (15 min), 1800 (30 min).',
  },
  {
    name: 'min',
    type: 'TimeValue',
    description:
      'Earliest selectable time (inclusive). Options that would produce an out-of-range value are disabled.',
  },
  {
    name: 'max',
    type: 'TimeValue',
    description: 'Latest selectable time (inclusive).',
  },
  {
    name: 'disabled / readOnly',
    type: 'boolean / boolean',
    description:
      'Disable all interaction / make focusable but not editable. Disabled hides the picker chevron states.',
  },
  {
    name: 'name / form / required',
    type: 'string / string / boolean',
    description:
      'Native form name. Renders a hidden ISO-time input (`HH:MM` or `HH:MM:SS`). Empty when value is null.',
  },
]

const COMPOUND_PARTS: ReadonlyArray<{ name: string; desc: string }> = [
  {
    name: 'TimePicker.Trigger',
    desc: 'Input-like button (formatted time + clock icon). Click toggles the popover. Pass `asChild` to wrap your own Button.',
  },
  {
    name: 'TimePicker.Portal',
    desc: 'SSR-safe portal — defers until client mount. Defaults to `document.body`; override with `container`.',
  },
  {
    name: 'TimePicker.Content',
    desc: 'Popover container. Owns positioning, Esc / outside-click dismissal (both behave as Cancel), focus restore. Default children: `Steppers + Actions(OK + Cancel)`.',
  },
  {
    name: 'TimePicker.Steppers',
    desc: 'Stepper UI — ▲ value ▼ per slot (hour / minute / [second]), AM/PM segmented toggle for h12, formatted preview line. Built from `@swift/components/Button` so it inherits theme + ripple.',
  },
  {
    name: 'TimePicker.Actions',
    desc: 'Bottom bar holding Cancel + OK. Border-top separates it from the columns.',
  },
  {
    name: 'TimePicker.Cancel',
    desc: 'Discards the staged value and closes the popover. Esc / outside-click behave identically.',
  },
  {
    name: 'TimePicker.OK',
    desc: 'Promotes the staged value to the committed value and closes the popover. Fires `onValueChange` with the new time.',
  },
]

function PropsTable({ rows }: { rows: ReadonlyArray<PropRow> }) {
  return (
    <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
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

const formatTime12 = (t: TimeValue | null) => {
  if (!t) return '—'
  const period = t.hours >= 12 ? 'PM' : 'AM'
  const hour12 = t.hours % 12 === 0 ? 12 : t.hours % 12
  return `${hour12}:${String(t.minutes).padStart(2, '0')} ${period}`
}

/** Meeting scheduler — DatePicker + TimePicker. */
function MeetingSchedulerWidget() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState<DatePickerValue>(null)
  const [startTime, setStartTime] = useState<TimeValue | null>({ hours: 10, minutes: 0 })
  const [duration, setDuration] = useState(30)
  const [submission, setSubmission] = useState<string | null>(null)

  const today = (() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })()

  const endTime: TimeValue | null = (() => {
    if (!startTime) return null
    const totalMinutes = startTime.hours * 60 + startTime.minutes + duration
    return {
      hours: Math.floor((totalMinutes / 60) % 24),
      minutes: totalMinutes % 60,
    }
  })()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!title || !date || !startTime) {
          setSubmission('Fill in title, date, and start time first.')
          return
        }
        const data = new FormData(event.currentTarget)
        const parts: string[] = []
        data.forEach((value, key) => parts.push(`${key}=${value}`))
        setSubmission(`POST: ${parts.join(' · ')}`)
      }}
      className="rounded-2xl border border-stroke bg-surface-elevated p-5 shadow-(--shadow-level3)"
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end">
        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Meeting title
          </Text>
          <Input
            name="title"
            placeholder="Quarterly review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Date
          </Text>
          <DatePicker name="date" min={today} value={date} onValueChange={setDate}>
            <DatePicker.Trigger placeholder="Pick a date" />
            <DatePicker.Portal>
              <DatePicker.Content />
            </DatePicker.Portal>
          </DatePicker>
        </div>
        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Start time
          </Text>
          <TimePicker
            name="startTime"
            hourCycle="h12"
            step={900}
            value={startTime}
            onValueChange={setStartTime}
          />
        </div>
        <div>
          <Text variant="body-xs" fontWeight="semibold" color="secondary" className="mb-1.5 block uppercase tracking-wide">
            Duration (min)
          </Text>
          <Input
            name="duration"
            type="number"
            min={5}
            max={480}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value) || 30)}
          />
        </div>
        <Button type="submit" variant="primary" classes={{ root: 'lg:h-10' }}>
          Schedule
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stroke-muted pt-3">
        <Text variant="body-sm" color="secondary">
          <strong className="text-content-strong">When:</strong>{' '}
          {date ? (
            <>
              {new Intl.DateTimeFormat('en', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }).format(date)}{' '}
              <span className="text-content-muted">·</span>{' '}
              {formatTime12(startTime)} → {formatTime12(endTime)}
            </>
          ) : (
            <span className="text-content-muted">no date</span>
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

export function TimePickerPanel() {
  const [controlled, setControlled] = useState<TimeValue | null>({
    hours: 15,
    minutes: 30,
  })

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>TimePicker</Text>
        <Text variant="para-lg" color="secondary">{DESCRIPTION}</Text>
      </header>

      {/* Real-world example ──────────────────────────────── */}
      <section>
        <SectionHeader>Meeting scheduler · DatePicker + TimePicker</SectionHeader>
        <div className="grid gap-3">
          <Text variant="body-sm" color="secondary">
            Pick a date, a 15-minute-stepped start time (click → columns →
            OK), and a duration — the end time updates live. Submit shows the
            form's full payload, including the picker's hidden ISO inputs.
          </Text>
          <MeetingSchedulerWidget />
        </div>
      </section>

      {/* Basic ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Basic · 12-hour · 5-minute steps</SectionHeader>
        <PreviewRow
          code={`<TimePicker
  hourCycle="h12"
  step={300}
  defaultValue={{ hours: 15, minutes: 30 }}
/>`}
        >
          <TimePicker
            hourCycle="h12"
            step={300}
            defaultValue={{ hours: 15, minutes: 30 }}
          />
        </PreviewRow>
      </section>

      {/* With seconds ─────────────────────────────────────── */}
      <section>
        <SectionHeader>With seconds · 12-hour</SectionHeader>
        <PreviewRow
          code={`<TimePicker
  hourCycle="h12"
  showSeconds
  defaultValue={{ hours: 1, minutes: 30, seconds: 30 }}
/>`}
        >
          <TimePicker
            hourCycle="h12"
            showSeconds
            defaultValue={{ hours: 1, minutes: 30, seconds: 30 }}
          />
        </PreviewRow>
      </section>

      {/* 24-hour ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>24-hour display</SectionHeader>
        <PreviewRow
          code={`<TimePicker hourCycle="h23" step={300} defaultValue={{ hours: 14, minutes: 30 }} />`}
        >
          <TimePicker hourCycle="h23" step={300} defaultValue={{ hours: 14, minutes: 30 }} />
        </PreviewRow>
      </section>

      {/* Controlled ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Controlled · external state</SectionHeader>
        <PreviewRow
          code={`const [value, setValue] = useState<TimeValue | null>({ hours: 15, minutes: 30 })

<TimePicker hourCycle="h12" step={300} value={value} onValueChange={setValue} />`}
        >
          <TimePicker
            hourCycle="h12"
            step={300}
            value={controlled}
            onValueChange={setControlled}
          />
          <Text variant="body-xs" color="muted">
            value = {controlled ? formatTime12(controlled) : 'null'}
          </Text>
        </PreviewRow>
      </section>

      {/* Step intervals ────────────────────────────────────── */}
      <section>
        <SectionHeader>Step intervals · 15 / 30 minutes</SectionHeader>
        <PreviewRow
          code={`<TimePicker hourCycle="h12" step={900}  defaultValue={{ hours: 9, minutes: 0 }} />
<TimePicker hourCycle="h12" step={1800} defaultValue={{ hours: 9, minutes: 0 }} />`}
        >
          <TimePicker hourCycle="h12" step={900} defaultValue={{ hours: 9, minutes: 0 }} />
          <TimePicker hourCycle="h12" step={1800} defaultValue={{ hours: 9, minutes: 0 }} />
        </PreviewRow>
      </section>

      {/* Business hours ────────────────────────────────────── */}
      <section>
        <SectionHeader>Business hours · min / max bounds</SectionHeader>
        <PreviewRow
          code={`<TimePicker
  hourCycle="h12"
  step={1800}
  min={{ hours: 9, minutes: 0 }}
  max={{ hours: 18, minutes: 0 }}
  defaultValue={{ hours: 9, minutes: 0 }}
/>`}
        >
          <TimePicker
            hourCycle="h12"
            step={1800}
            min={{ hours: 9, minutes: 0 }}
            max={{ hours: 18, minutes: 0 }}
            defaultValue={{ hours: 9, minutes: 0 }}
          />
        </PreviewRow>
      </section>

      {/* Form compat ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Form compat · hidden ISO input</SectionHeader>
        <PreviewRow
          code={`<form action="/save">
  <TimePicker name="startTime" required defaultValue={{ hours: 14, minutes: 30 }} />
  <button type="submit">Save</button>
</form>

{/* Submits startTime=14:30 (ISO 24-hour) regardless of display hourCycle. */}`}
        >
          <Text variant="body-sm" color="secondary">
            Setting <code>name</code> renders a hidden input. Inspect the DOM
            to see the ISO string the form will post.
          </Text>
          <TimePicker name="startTime" hourCycle="h12" step={300} defaultValue={{ hours: 14, minutes: 30 }} />
        </PreviewRow>
      </section>

      {/* Accessibility ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Spinbutton steppers.</strong>{' '}
            Each numeric slot exposes <code>role="spinbutton"</code> with{' '}
            <code>aria-valuenow</code> so screen readers announce the slot
            label and current value. Up/down buttons get descriptive{' '}
            <code>aria-label</code>s ("Increase hour", "Decrease minute"…).
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Cancel-safe.</strong> Esc,
            outside-click, and the Cancel button all discard the staged edit
            so the committed value stays unchanged.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Focus restore.</strong> The
            popover returns focus to the trigger on close.
          </Text>
        </div>
      </section>

      {/* Root props ────────────────────────────────────────── */}
      <section>
        <SectionHeader>TimePicker · root props</SectionHeader>
        <PropsTable rows={ROOT_PROPS} />
      </section>

      {/* Compound parts ────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {COMPOUND_PARTS.map(({ name, desc }) => (
            <div
              key={name}
              className="grid gap-1 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[200px_1fr] md:items-start md:gap-6"
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
            code={`import { TimePicker } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { TimePicker } from '@swift/components/TimePicker'`}
          />
        </div>
      </section>

      {/* Usage ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<TimePicker
  hourCycle="h12"
  step={900}
  min={{ hours: 9, minutes: 0 }}
  max={{ hours: 18, minutes: 0 }}
  defaultValue={{ hours: 9, minutes: 0 }}
  onValueChange={(v) => console.log(v)}
  name="startTime"
/>`}
        />
      </section>
    </div>
  )
}
