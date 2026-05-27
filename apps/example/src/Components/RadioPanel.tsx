import { useState } from 'react'
import { Radio, RadioGroup } from '@swift/components/Radio'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Accessible radio group with three sizes, controlled & uncontrolled APIs, native form compatibility, full ARIA wiring, browser-native arrow-key navigation, and a Radix-style compound API for custom layouts.'

const SIZES: ReadonlyArray<{ size: 'sm' | 'md' | 'lg'; box: string }> = [
  { size: 'sm', box: '14px' },
  { size: 'md', box: '16px' },
  { size: 'lg', box: '20px' },
]

const CABIN_OPTIONS = [
  { value: 'economy', label: 'Economy', desc: 'Standard seat · 7 kg cabin bag' },
  { value: 'premium', label: 'Premium Economy', desc: 'Extra legroom · 10 kg cabin bag' },
  { value: 'business', label: 'Business', desc: 'Lie-flat seat · lounge access' },
  { value: 'first', label: 'First Class', desc: 'Private suite · chauffeur transfer' },
] as const

const RADIO_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'value',
    type: 'string',
    description:
      'Required. Identifier used by the surrounding RadioGroup to track selection. Also forwarded as the native input `value` so plain form submissions include it.',
  },
  {
    name: 'checked',
    type: 'boolean',
    description:
      'Controlled state. Use sparingly — most radios live inside a RadioGroup and let the group own selection. Useful for standalone radios outside a group.',
  },
  {
    name: 'defaultChecked',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Uncontrolled initial state. Ignored when inside a RadioGroup or when `checked` is provided.',
  },
  {
    name: 'onChange',
    type: '(checked: boolean) => void',
    description:
      'Fires after toggle with the next checked value. Inside a RadioGroup, this fires AND the group also updates — keep both wired if you need per-item side effects. Note: this is the typed boolean callback, not the native input change event — drop to compound mode (`<Radio.Input onChange={...}>`) if you need the raw ChangeEvent.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Circle edge size: 14 / 16 / 20 px. Scales the dot and the label text. Overridden by the parent RadioGroup if present.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Switches the circle and focus ring to critical chrome, sets aria-invalid, and reveals `errorMessage` if supplied. Cascades from RadioGroup.',
  },
  {
    name: 'errorMessage',
    type: 'ReactNode',
    description:
      'Message rendered with role="alert" and aria-live="polite" when `invalid` is true. Linked via aria-describedby on the input.',
  },
  {
    name: 'description',
    type: 'ReactNode',
    description:
      'Helper text rendered below the label and linked via aria-describedby. Hidden when an active errorMessage is shown — error takes precedence.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Disables the native input and dims the chrome. Sets data-disabled="true" on the root, circle, and label. Cascades from RadioGroup.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Native radios ignore readOnly, so the component intercepts the change event, re-asserts the visual state, and suppresses onCheckedChange. Sets aria-readonly and data-readonly="true".',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Forwards `required` to the native input, sets aria-required, and renders a visible asterisk after the label.',
  },
  {
    name: 'indicator',
    type: 'ReactNode',
    description:
      'Custom glyph rendered in place of the default dot when checked. Use Radio.Indicator in compound mode for full control over its container.',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Forwarded to the native input. Inherits from a parent RadioGroup unless overridden — radios sharing a name form a native browser group, enabling arrow-key navigation.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Convenience label. Omit and pair with Radio.Root / Radio.Label if you need a non-standard layout.',
  },
  {
    name: 'classes',
    type: '{ root?, control?, box?, input?, indicator?, label?, description?, errorMessage?, text? }',
    description:
      'Slot-level className overrides. Composes with the built-in classes — your overrides win cascade order.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLInputElement>',
    description:
      'Forwarded to the underlying <input type="radio">. Useful for focus management, validation libraries, and DOM-level event listening.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
    description:
      'Anything else forwards to the native input: id, form, autoFocus, onFocus/onBlur, data-*, aria-*, etc.',
  },
]

const RADIO_GROUP_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'value',
    type: 'string | null',
    description:
      'Controlled value. The matching Radio renders checked. `null` means no selection.',
  },
  {
    name: 'defaultValue',
    type: 'string | null',
    defaultValue: 'null',
    description:
      'Uncontrolled initial value. The group owns the value and updates on each selection.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description:
      'Fires with the next selected value. Always a string — radios cannot be deselected via click.',
  },
  {
    name: 'orientation',
    type: `'vertical' | 'horizontal'`,
    defaultValue: `'vertical'`,
    description:
      'Layout for the items container. Horizontal wraps with row + column gaps; vertical stacks with a column gap. Also reflected as aria-orientation on the group.',
  },
  {
    name: 'label',
    type: 'ReactNode',
    description:
      'Rendered above the items, exposed as the group\'s aria-labelledby.',
  },
  {
    name: 'description',
    type: 'ReactNode',
    description:
      'Rendered between the label and items, linked via aria-describedby.',
  },
  {
    name: 'errorMessage',
    type: 'ReactNode',
    description:
      'Rendered below the items when `invalid` is true. Uses role="alert" and is appended to aria-describedby.',
  },
  {
    name: 'size / disabled / readOnly / required / invalid',
    type: 'RadioSize / boolean',
    description:
      'Cascade to every child Radio unless the child sets its own override. The group also sets matching aria-* and data-* attributes for styling and assistive tech.',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Shared `name` for every child input. Auto-generated if omitted — radios sharing a name form a native browser group so arrow-key navigation works for free.',
  },
  {
    name: 'classes',
    type: '{ root?, label?, description?, errorMessage?, items? }',
    description:
      'Slot-level className overrides for the group container parts.',
  },
]

type PartPropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

type PartBlock = {
  name: string
  summary: string
  props: ReadonlyArray<PartPropRow>
}

const RADIO_COMPOUND_PARTS: ReadonlyArray<PartBlock> = [
  {
    name: 'Radio.Root',
    summary:
      'Owns state, ARIA ids, and group integration but renders no chrome. Reach for it only when the convenience <Radio> can\'t express your layout — e.g. label above the dot, custom description slot.',
    props: [
      {
        name: 'value',
        type: 'string',
        description: 'Required. Same semantics as on <Radio>.',
      },
      {
        name: 'checked',
        type: 'boolean',
        description: 'Controlled state.',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Uncontrolled initial state.',
      },
      {
        name: 'onChange',
        type: '(next: boolean) => void',
        description: 'Fires after each toggle with the typed boolean value.',
      },
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        defaultValue: `'md'`,
        description: 'Cascades to every child part through context.',
      },
      {
        name: 'disabled / readOnly / required / invalid',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Cascade to nested parts and to the native input rendered by Radio.Input. Inherits from a parent RadioGroup unless overridden.',
      },
      {
        name: 'id',
        type: 'string',
        description:
          'Override the generated input id. Radio.Label uses this to set its htmlFor automatically — set it manually only when you need a stable id.',
      },
      {
        name: 'name',
        type: 'string',
        description:
          'Forwarded to the native input. Inherits from a parent RadioGroup unless overridden.',
      },
      {
        name: 'classes',
        type: 'RadioClasses',
        description:
          'Slot-level className overrides. Same shape as on the simple API.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Compose Radio.Input, Radio.Label, Radio.Description, Radio.ErrorMessage in any order.',
      },
    ],
  },
  {
    name: 'Radio.Input',
    summary:
      'The visible 14–20 px circle plus the real <input type="radio"> overlaid at opacity 0. Clicks on the circle and Space-key activation delegate to the input. When all radios in a group share a `name`, the browser handles Up/Down/Left/Right arrow navigation natively.',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Override the default indicator. Pass <Radio.Indicator> for state-driven dots, or any other node for a fixed glyph.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the visible circle <span>.',
      },
      {
        name: 'id / name / value',
        type: 'string',
        description:
          'Override the corresponding native input attributes. Each defaults to the value held by the surrounding Radio.Root.',
      },
      {
        name: 'onChange',
        type: '(e: ChangeEvent<HTMLInputElement>) => void',
        description:
          'Native input onChange (raw event). Fires before the Root\'s typed `onChange(boolean)` callback. Use this slot when you need access to the underlying ChangeEvent.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLInputElement>',
        description: 'Forwarded to the underlying <input type="radio">.',
      },
    ],
  },
  {
    name: 'Radio.Indicator',
    summary:
      'Renders the filled dot when checked. Returns null when unchecked. Pass children to override the default glyph; use `forceChecked` to render the dot regardless of context.',
    props: [
      {
        name: 'forceChecked',
        type: 'boolean',
        description:
          'Render the dot regardless of context. Handy for previews and storybook stories.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Custom glyph. Replaces the default dot. Sized via CSS — your icon should fill 100% of its parent.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the indicator <span>.',
      },
    ],
  },
  {
    name: 'Radio.Label',
    summary:
      'Native <label> with htmlFor wired to the input id from context. Appends a critical-coloured asterisk when the field is required.',
    props: [
      {
        name: 'htmlFor',
        type: 'string',
        description:
          'Override the auto-wired htmlFor. Defaults to the input id from context.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Label content. The required asterisk renders after children when applicable.',
      },
    ],
  },
  {
    name: 'Radio.Description',
    summary:
      'Helper paragraph linked to the input via aria-describedby. Dims when the radio is disabled.',
    props: [
      {
        name: 'id',
        type: 'string',
        description:
          'Override the auto-generated description id. Defaults to `${rootId}-description`.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Description text.',
      },
    ],
  },
  {
    name: 'Radio.ErrorMessage',
    summary:
      'Error paragraph with role="alert" and aria-live="polite". Only render this when `invalid` is true on the Root — the simple API hides it automatically; in compound mode the consumer controls visibility.',
    props: [
      {
        name: 'id',
        type: 'string',
        description:
          'Override the auto-generated error id. Defaults to `${rootId}-error`.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Error text.',
      },
    ],
  },
]

export function RadioPanel() {
  const [cabin, setCabin] = useState<string>('economy')
  const [payment, setPayment] = useState<string | null>(null)

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Radio
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic · uncontrolled</SectionHeader>
        <PreviewRow>
          <RadioGroup defaultValue="economy" orientation="horizontal">
            <Radio value="economy">Economy</Radio>
            <Radio value="premium">Premium Economy</Radio>
            <Radio value="business">Business</Radio>
          </RadioGroup>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Sizes</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {SIZES.map(({ size, box }) => (
            <div
              key={size}
              className="grid grid-cols-[80px_120px_1fr] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {size}
              </Text>
              <Text variant="body-xs" color="muted">
                {box} circle
              </Text>
              <RadioGroup
                size={size}
                defaultValue="checked"
                orientation="horizontal"
                name={`size-demo-${size}`}
              >
                <Radio value="unchecked">Unchecked</Radio>
                <Radio value="checked">Checked</Radio>
              </RadioGroup>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Form states</SectionHeader>
        <div className="grid grid-cols-2 gap-6">
          <RadioGroup label="Required" required defaultValue="a" name="required-demo">
            <Radio value="a">Option A</Radio>
            <Radio value="b">Option B</Radio>
          </RadioGroup>
          <RadioGroup label="Disabled" disabled defaultValue="a" name="disabled-demo">
            <Radio value="a">Option A</Radio>
            <Radio value="b">Option B</Radio>
          </RadioGroup>
          <RadioGroup label="Read only" readOnly defaultValue="a" name="readonly-demo">
            <Radio value="a">Locked selection</Radio>
            <Radio value="b">Cannot select</Radio>
          </RadioGroup>
          <RadioGroup
            label="Invalid"
            invalid
            errorMessage="Pick one to continue."
            name="invalid-demo"
          >
            <Radio value="a">Option A</Radio>
            <Radio value="b">Option B</Radio>
          </RadioGroup>
        </div>
      </section>

      <section>
        <SectionHeader>Controlled · with descriptions</SectionHeader>
        <div className="max-w-xl rounded-lg border border-stroke bg-surface-elevated p-4">
          <RadioGroup
            label="Cabin class"
            description="Applied to all travellers on this booking."
            value={cabin}
            onValueChange={setCabin}
            name="cabin"
          >
            {CABIN_OPTIONS.map(({ value, label, desc }) => (
              <Radio key={value} value={value} description={desc}>
                {label}
              </Radio>
            ))}
          </RadioGroup>
          <Text variant="body-xs" color="muted" className="mt-3 block">
            Selected: <code>{cabin}</code>
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>Horizontal · no initial selection</SectionHeader>
        <RadioGroup
          label="Payment method"
          value={payment}
          onValueChange={setPayment}
          orientation="horizontal"
          name="payment"
        >
          <Radio value="card">Card</Radio>
          <Radio value="upi">UPI</Radio>
          <Radio value="netbanking">Net banking</Radio>
          <Radio value="wallet">Wallet</Radio>
        </RadioGroup>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Selected: <code>{payment ?? '(none)'}</code>
        </Text>
      </section>

      <section>
        <SectionHeader>Native form · check submission</SectionHeader>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const v = Array.from(fd.entries())
              .map(([k, val]) => `${k}=${val}`)
              .join(' · ')
            alert(v || '(nothing selected)')
          }}
        >
          <RadioGroup name="seat" label="Seat preference" defaultValue="window">
            <Radio value="window">Window</Radio>
            <Radio value="aisle">Aisle</Radio>
            <Radio value="middle">Middle</Radio>
          </RadioGroup>
          <button
            type="submit"
            className="self-start rounded-md border border-stroke bg-surface-brand px-3 py-1.5 text-sm font-medium text-content-on-brand"
          >
            Submit
          </button>
        </form>
      </section>

      <section>
        <SectionHeader>Compound mode · Radio.Root</SectionHeader>
        <div className="max-w-md">
          <RadioGroup name="compound-demo" defaultValue="b">
            <Radio.Root value="a">
              <Radio.Input />
              <span className="flex flex-col">
                <Radio.Label>Option A</Radio.Label>
                <Radio.Description>
                  Built from the compound parts directly.
                </Radio.Description>
              </span>
            </Radio.Root>
            <Radio.Root value="b">
              <Radio.Input />
              <span className="flex flex-col">
                <Radio.Label>Option B</Radio.Label>
                <Radio.Description>
                  Each part participates in the surrounding RadioGroup.
                </Radio.Description>
              </span>
            </Radio.Root>
          </RadioGroup>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Reach for <code>Radio.Root</code> only when the convenience{' '}
          <code>&lt;Radio /&gt;</code> can&apos;t express your layout.
        </Text>
      </section>

      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Native input.</strong> The circle delegates to a real <code>&lt;input type=&quot;radio&quot;&gt;</code> overlaid at <code>opacity:0</code>. Clicks on the circle, label, and Space-key activation all route through it — so screen readers, native form submission, and the browser&apos;s autofill heuristics work without extra wiring.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">role=&quot;radiogroup&quot;.</strong> RadioGroup sets <code>role=&quot;radiogroup&quot;</code> with <code>aria-labelledby</code> pointing at the group label, plus <code>aria-disabled</code> / <code>aria-invalid</code> / <code>aria-required</code> / <code>aria-readonly</code> / <code>aria-orientation</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Arrow-key navigation.</strong> Radios in a group share a <code>name</code> attribute, so the browser natively handles <code>↑</code> / <code>↓</code> / <code>←</code> / <code>→</code> — focus moves AND selection updates in one step, matching the WAI-ARIA radio-group pattern.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Tab order.</strong> Only the selected radio sits in the tab order (or the first when nothing is selected) — exactly the native radio-group behaviour. Tab in, arrow between, Tab out.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Focus ring.</strong> 2px brand ring on <code>:focus-visible</code> only, so mouse users don&apos;t see a ring after click. Switches to critical-coloured when <code>invalid</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Label association.</strong> <code>Radio.Label</code> sets <code>htmlFor</code> from the input id automatically. Clicking anywhere on the label toggles the dot — including in the simple <code>&lt;Radio&gt;children&lt;/Radio&gt;</code> API.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Disabled vs readOnly.</strong> <code>disabled</code> forwards to the native input and removes it from the tab order. <code>readOnly</code> is non-standard for radios — the component intercepts the change event, re-asserts the visual state, sets <code>aria-readonly</code>, and the input stays focusable.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Required.</strong> Forwards <code>required</code> to the native input, sets <code>aria-required</code>, and renders a visible critical-coloured asterisk after the label.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Invalid + error.</strong> <code>invalid</code> sets <code>aria-invalid</code> and flips the chrome to critical. <code>errorMessage</code> renders with <code>role=&quot;alert&quot;</code> and <code>aria-live=&quot;polite&quot;</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Describedby chain.</strong> <code>aria-describedby</code> on the input automatically links both the description and (when invalid) the error message ids.
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>Props · Radio</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
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
          {RADIO_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[220px_1fr_140px] md:items-start md:gap-6"
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
        <SectionHeader>Props · RadioGroup</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
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
          {RADIO_GROUP_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[220px_1fr_140px] md:items-start md:gap-6"
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
        <SectionHeader>Compound parts</SectionHeader>
        <div className="grid gap-4">
          {RADIO_COMPOUND_PARTS.map(({ name, summary, props }) => (
            <div
              key={name}
              className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated"
            >
              <div className="border-b border-stroke px-6 py-4">
                <Text variant="body-sm" fontFamily="mono" fontWeight="bold" color="primary">
                  {name}
                </Text>
                <Text variant="body-sm" color="secondary" className="mt-1 block">
                  {summary}
                </Text>
              </div>
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
              {props.map(({ name: propName, type, defaultValue, description }) => (
                <div
                  key={propName}
                  className="grid gap-2 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[220px_1fr_140px] md:items-start md:gap-6"
                >
                  <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                    {propName}
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
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Radio, RadioGroup } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Radio, RadioGroup } from '@swift/components/Radio'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Radio, RadioGroup, type RadioProps, type RadioSize, type RadioGroupProps } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<RadioGroup
  label="Cabin class"
  value={cabin}
  onValueChange={setCabin}
  name="cabin"
>
  <Radio value="economy" description="Standard seat">
    Economy
  </Radio>
  <Radio value="business" description="Lie-flat seat · lounge access">
    Business
  </Radio>
</RadioGroup>`}
        />
      </section>
    </div>
  )
}
