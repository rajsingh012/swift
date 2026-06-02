import { useState } from 'react'
import { Text } from '@swift/components/Text'
import { YearPicker } from '@swift/components/YearPicker'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Scrollable year picker with visual hierarchy — the selected year is large and bold, adjacent years are smaller and muted, distant years fade out. Click to select; the scroll automatically keeps the selected year centred. Useful for date-of-birth, vintage, decade-spanning selectors where a fast scan beats a dropdown.'

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'value',
    type: 'number',
    description: 'Controlled selected year.',
  },
  {
    name: 'defaultValue',
    type: 'number',
    description:
      'Uncontrolled initial selection. Defaults to the current year.',
  },
  {
    name: 'onValueChange',
    type: '(year: number) => void',
    description: 'Fires when a year is clicked.',
  },
  {
    name: 'min',
    type: 'number',
    description:
      'Earliest selectable year. Default `currentYear − 50`. Use a wider window (e.g. 1900) for DOB pickers.',
  },
  {
    name: 'max',
    type: 'number',
    description: 'Latest selectable year. Default `currentYear + 10`.',
  },
  {
    name: 'label',
    type: 'string',
    defaultValue: `'Year'`,
    description: 'Header label rendered above the year list.',
  },
  {
    name: 'name / form / required',
    type: 'string / string / boolean',
    description:
      'Native form name. Renders a hidden numeric input for form submission.',
  },
]

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

export function YearPickerPanel() {
  const [year, setYear] = useState(new Date().getFullYear())

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>YearPicker</Text>
        <Text variant="para-lg" color="secondary">{DESCRIPTION}</Text>
      </header>

      {/* Basic ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Basic · default range (±50 / +10)</SectionHeader>
        <PreviewRow
          code={`<YearPicker defaultValue={${new Date().getFullYear()}} onValueChange={(y) => …} />`}
        >
          <YearPicker defaultValue={new Date().getFullYear()} />
        </PreviewRow>
      </section>

      {/* Controlled ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Controlled · external state</SectionHeader>
        <PreviewRow
          code={`const [year, setYear] = useState(${new Date().getFullYear()})

<YearPicker value={year} onValueChange={setYear} />`}
        >
          <YearPicker value={year} onValueChange={setYear} />
          <Text variant="body-xs" color="muted">
            value = {year}
          </Text>
        </PreviewRow>
      </section>

      {/* DOB picker ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Date-of-birth · wide year range</SectionHeader>
        <PreviewRow
          code={`<YearPicker
  label="Year of birth"
  min={1940}
  max={new Date().getFullYear() - 13}
  defaultValue={2000}
/>`}
        >
          <YearPicker
            label="Year of birth"
            min={1940}
            max={new Date().getFullYear() - 13}
            defaultValue={2000}
          />
        </PreviewRow>
      </section>

      {/* Vintage ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Vintage / model year · narrow range</SectionHeader>
        <PreviewRow
          code={`<YearPicker label="Model year" min={2010} max={2026} defaultValue={2024} />`}
        >
          <YearPicker label="Model year" min={2010} max={2026} defaultValue={2024} />
        </PreviewRow>
      </section>

      {/* Form compat ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Form compat · hidden numeric input</SectionHeader>
        <PreviewRow
          code={`<form action="/save">
  <YearPicker name="graduationYear" required defaultValue={2025} />
  <button type="submit">Save</button>
</form>`}
        >
          <Text variant="body-sm" color="secondary">
            Setting <code>name</code> renders a hidden input — inspect the DOM
            to see the year posted with the form.
          </Text>
          <YearPicker name="graduationYear" defaultValue={2025} />
        </PreviewRow>
      </section>

      {/* Accessibility ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Listbox semantics.</strong>{' '}
            The year list is <code>role="listbox"</code> with{' '}
            <code>role="option"</code> children and <code>aria-selected</code>{' '}
            on the active year.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Auto-centre.</strong> The
            selected year auto-scrolls to the centre of the viewport on mount
            and whenever the value changes.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion.</strong>{' '}
            Year-to-year hover transitions collapse to 0ms under{' '}
            <code>prefers-reduced-motion</code>.
          </Text>
        </div>
      </section>

      {/* Props ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>YearPicker · props</SectionHeader>
        <PropsTable rows={PROPS} />
      </section>

      {/* Import ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { YearPicker } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { YearPicker } from '@swift/components/YearPicker'`}
          />
        </div>
      </section>

      {/* Usage ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<YearPicker
  label="Year of birth"
  min={1940}
  max={new Date().getFullYear() - 13}
  defaultValue={2000}
  onValueChange={(y) => console.log(y)}
  name="birthYear"
/>`}
        />
      </section>
    </div>
  )
}
