import { useMemo, useState } from 'react'
import { Checkbox, CheckboxGroup } from '@swift/components/Checkbox'
import { Text } from '@swift/components/Text'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Accessible checkbox with three sizes, indeterminate state, controlled & uncontrolled APIs, group support, native form compatibility, full ARIA wiring, and a Radix-style compound API for custom layouts.'

const SIZES: ReadonlyArray<{ size: 'sm' | 'md' | 'lg'; box: string }> = [
  { size: 'sm', box: '14px' },
  { size: 'md', box: '16px' },
  { size: 'lg', box: '20px' },
]

const FRAMEWORKS = ['react', 'vue', 'angular', 'svelte'] as const

const CHECKBOX_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'checked',
    type: `boolean | 'indeterminate'`,
    description:
      'Controlled state. The "indeterminate" value renders the dash glyph and sets aria-checked="mixed" plus the native input.indeterminate DOM flag (still serialises as unchecked in form data).',
  },
  {
    name: 'defaultChecked',
    type: `boolean | 'indeterminate'`,
    defaultValue: 'false',
    description:
      'Uncontrolled initial state. Internal state is owned by the component and updates on user toggle. Ignored when `checked` is provided.',
  },
  {
    name: 'onCheckedChange',
    type: `(checked: boolean | 'indeterminate') => void`,
    description:
      'Fires after each toggle with the next checked value. Inside a CheckboxGroup, this fires AND the group also updates — keep both wired if you need per-item side effects.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Box edge size: 14 / 16 / 20 px. Scales the indicator glyph and the label text alongside it. Overridden by the parent CheckboxGroup if present.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Switches the box and focus ring to critical chrome, sets aria-invalid, and reveals `errorMessage` if supplied. Cascades from CheckboxGroup.',
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
      'Disables the native input and dims the chrome. Sets data-disabled="true" on the root, box, and label. Cascades from CheckboxGroup.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Native checkboxes ignore readOnly, so the component intercepts the change event, re-asserts the visual state, and suppresses onCheckedChange. Sets aria-readonly and data-readonly="true".',
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
      'Custom glyph rendered in place of the default tick when checked. The dash for the indeterminate state is rendered separately and cannot be overridden via this prop — use the compound Checkbox.Indicator for full control.',
  },
  {
    name: 'value',
    type: 'string',
    description:
      'Used by CheckboxGroup to identify the item. Also forwarded to the native input as `value` so plain form submissions include it.',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Forwarded to the native input. Inherits from a parent CheckboxGroup unless overridden — useful when a group represents a single named array field.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Convenience label. Omit and pair with Checkbox.Root / Checkbox.Label if you need a non-standard layout.',
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
      'Forwarded to the underlying <input type="checkbox">. Useful for focus management, validation libraries, and DOM-level event listening.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
    description:
      'Anything else forwards to the native input: id, form, autoFocus, onFocus/onBlur, data-*, aria-*, etc.',
  },
]

const CHECKBOX_GROUP_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'value',
    type: 'string[]',
    description:
      'Controlled value. Children whose `value` is included are rendered checked. Items without a `value` prop are independent of the group.',
  },
  {
    name: 'defaultValue',
    type: 'string[]',
    defaultValue: '[]',
    description:
      'Uncontrolled initial value. The group owns the array and replaces it on each toggle.',
  },
  {
    name: 'onValueChange',
    type: '(value: string[]) => void',
    description:
      'Fires after each toggle with the next value array. The array preserves insertion order — newly checked items are appended.',
  },
  {
    name: 'orientation',
    type: `'vertical' | 'horizontal'`,
    defaultValue: `'vertical'`,
    description:
      'Layout for the items container. Horizontal wraps with row + column gaps; vertical stacks with a column gap.',
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
    type: 'CheckboxSize / boolean',
    description:
      'Cascade to every child Checkbox unless the child sets its own override. The group also sets matching aria-* and data-* attributes for styling and assistive tech.',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Default `name` for every child input — handy for native form submissions that expect an array under one key.',
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

const CHECKBOX_COMPOUND_PARTS: ReadonlyArray<PartBlock> = [
  {
    name: 'Checkbox.Root',
    summary:
      'Owns state, ARIA ids, and group integration but renders no chrome. Reach for it only when the convenience <Checkbox> can\'t express your layout — e.g. label above the box, custom description slot.',
    props: [
      {
        name: 'checked',
        type: `boolean | 'indeterminate'`,
        description: 'Controlled state. Same semantics as on <Checkbox>.',
      },
      {
        name: 'defaultChecked',
        type: `boolean | 'indeterminate'`,
        defaultValue: 'false',
        description: 'Uncontrolled initial state.',
      },
      {
        name: 'onCheckedChange',
        type: `(next: boolean | 'indeterminate') => void`,
        description: 'Fires after each toggle.',
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
          'Cascade to nested parts and to the native input rendered by Checkbox.Input. Inherits from a parent CheckboxGroup unless overridden.',
      },
      {
        name: 'id',
        type: 'string',
        description:
          'Override the generated input id. Checkbox.Label uses this to set its htmlFor automatically — set it manually only when you need a stable id (e.g. for external form labels).',
      },
      {
        name: 'value',
        type: 'string',
        description:
          'Per-item value when nested inside a CheckboxGroup. Also forwarded to the native input as `value` for plain form submissions.',
      },
      {
        name: 'name',
        type: 'string',
        description:
          'Forwarded to the native input. Inherits from a parent CheckboxGroup unless overridden.',
      },
      {
        name: 'classes',
        type: 'CheckboxClasses',
        description:
          'Slot-level className overrides. Same shape as on the simple API.',
      },
      {
        name: 'className',
        type: 'string',
        description:
          'Appended to the root <span>. Equivalent to classes.root — use whichever reads cleaner.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Compose Checkbox.Input, Checkbox.Label, Checkbox.Description, Checkbox.ErrorMessage in any order.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLSpanElement>',
        description: 'Forwarded to the root <span>. Useful for measurement, popovers, animation anchors.',
      },
      {
        name: '...rest',
        type: 'HTMLAttributes<HTMLSpanElement>',
        description:
          'Anything else (data-*, aria-*, role, event handlers) forwards to the root <span>. `defaultChecked` is the only HTML attribute removed — the typed prop above replaces it.',
      },
    ],
  },
  {
    name: 'Checkbox.Input',
    summary:
      'The visible 14–20 px box plus the real <input type="checkbox"> overlaid at opacity 0. Clicks on the box and Space-key activation are delegated to the input, so native form submission and screen readers work without extra wiring.',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Override the default indicator. Pass <Checkbox.Indicator> for state-driven glyphs, or any other node for a fixed icon.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the visible box <span>.',
      },
      {
        name: 'id / name / value',
        type: 'string',
        description:
          'Override the corresponding native input attributes. Each defaults to the value held by the surrounding Checkbox.Root.',
      },
      {
        name: 'onChange',
        type: '(e: ChangeEvent<HTMLInputElement>) => void',
        description:
          'Native input onChange. Fires alongside onCheckedChange on the Root — use this when you need the raw event (e.g. for checked.target.form).',
      },
      {
        name: 'aria-describedby / aria-labelledby',
        type: 'string',
        description:
          'Appended to the auto-generated describedby chain (description + errorMessage ids). Useful for linking out-of-tree helpers.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLInputElement>',
        description: 'Forwarded to the underlying <input type="checkbox">.',
      },
      {
        name: '...rest',
        type: 'InputHTMLAttributes<HTMLInputElement>',
        description:
          'Anything else (autoFocus, onFocus/onBlur, form, tabIndex, data-*) forwards to the native input. The `type`, `size`, `checked`, and `defaultChecked` attributes are stripped — they are owned by the Root.',
      },
    ],
  },
  {
    name: 'Checkbox.Indicator',
    summary:
      'Renders the tick (checked) or dash (indeterminate). Returns null when unchecked. Pass children to override the default glyph; use `forceState` to render a specific state regardless of context.',
    props: [
      {
        name: 'forceState',
        type: `boolean | 'indeterminate'`,
        description:
          'Render the glyph for this state instead of reading from context. Handy for previews, storybook stories, or showing both states side-by-side.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Custom glyph. When checked, this replaces the tick; when indeterminate, replaces the dash. Sized via CSS — your icon should fill 100% of its parent.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the indicator <span>.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLSpanElement>',
        description: 'Forwarded to the wrapper <span>.',
      },
      {
        name: '...rest',
        type: 'HTMLAttributes<HTMLSpanElement>',
        description: 'Forwards to the wrapper <span>. aria-hidden is set automatically.',
      },
    ],
  },
  {
    name: 'Checkbox.Label',
    summary:
      'Native <label> with htmlFor wired to the input id from context. Appends a critical-coloured asterisk when the field is required.',
    props: [
      {
        name: 'htmlFor',
        type: 'string',
        description:
          'Override the auto-wired htmlFor. Defaults to the input id from context — set this manually only when associating the label with an external input.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the <label> after the size and disabled classes.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Label content. The required asterisk renders after children when applicable.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLLabelElement>',
        description: 'Forwarded to the <label>.',
      },
      {
        name: '...rest',
        type: 'LabelHTMLAttributes<HTMLLabelElement>',
        description:
          'Anything else (id, onClick, data-*, aria-*) forwards to the <label>.',
      },
    ],
  },
  {
    name: 'Checkbox.Description',
    summary:
      'Helper paragraph linked to the input via aria-describedby. Dims when the checkbox is disabled.',
    props: [
      {
        name: 'id',
        type: 'string',
        description:
          'Override the auto-generated description id. Defaults to `${rootId}-description`, which Checkbox.Input automatically references via aria-describedby.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the <p>.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Description text.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLParagraphElement>',
        description: 'Forwarded to the <p>.',
      },
    ],
  },
  {
    name: 'Checkbox.ErrorMessage',
    summary:
      'Error paragraph with role="alert" and aria-live="polite". Only render this when `invalid` is true on the Root — the simple API hides it automatically; in compound mode the consumer controls visibility.',
    props: [
      {
        name: 'id',
        type: 'string',
        description:
          'Override the auto-generated error id. Defaults to `${rootId}-error`, which Checkbox.Input automatically references via aria-describedby when invalid.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the <p>.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Error text.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLParagraphElement>',
        description: 'Forwarded to the <p>.',
      },
    ],
  },
]

export function CheckboxPanel() {
  const [controlled, setControlled] = useState<boolean | 'indeterminate'>(false)
  const [selected, setSelected] = useState<string[]>(['react'])

  // Parent ↔ children: a "Select All" header derives its state from the
  // children below, and toggling it cascades to every child.
  const [items, setItems] = useState<Record<'a' | 'b' | 'c', boolean>>({
    a: true,
    b: true,
    c: false,
  })
  const checkedKeys = useMemo(
    () => (Object.keys(items) as Array<keyof typeof items>).filter((k) => items[k]),
    [items],
  )
  const allState: boolean | 'indeterminate' =
    checkedKeys.length === 0
      ? false
      : checkedKeys.length === 3
        ? true
        : 'indeterminate'

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Checkbox
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow>
          <Checkbox defaultChecked>Accept terms and conditions</Checkbox>
          <Checkbox>Subscribe to newsletter</Checkbox>
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
                {box} box
              </Text>
              <div className="flex items-center gap-6">
                <Checkbox size={size}>Unchecked</Checkbox>
                <Checkbox size={size} defaultChecked>
                  Checked
                </Checkbox>
                <Checkbox size={size} checked="indeterminate" onCheckedChange={() => {}}>
                  Indeterminate
                </Checkbox>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Form states</SectionHeader>
        <div className="grid grid-cols-2 gap-4">
          <Checkbox required defaultChecked>
            Required
          </Checkbox>
          <Checkbox disabled>Disabled</Checkbox>
          <Checkbox disabled defaultChecked>
            Disabled · checked
          </Checkbox>
          <Checkbox readOnly defaultChecked>
            Read only · permanent selection
          </Checkbox>
          <Checkbox
            invalid
            errorMessage="You must accept the terms to continue."
          >
            Accept terms
          </Checkbox>
          <Checkbox description="We'll send you the occasional product update — no spam.">
            Email notifications
          </Checkbox>
        </div>
      </section>

      <section>
        <SectionHeader>Controlled · indeterminate cycle</SectionHeader>
        <PreviewRow>
          <Checkbox
            checked={controlled}
            onCheckedChange={(next) => setControlled(next)}
          >
            Click to toggle
          </Checkbox>
          <button
            type="button"
            onClick={() => setControlled('indeterminate')}
            className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
          >
            Set indeterminate
          </button>
          <Text variant="body-xs" color="muted">
            state: <code>{String(controlled)}</code>
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Parent / children · select all</SectionHeader>
        <div className="max-w-md rounded-lg border border-stroke bg-surface-elevated p-4">
          <Checkbox
            checked={allState}
            onCheckedChange={(next) => {
              const v = next === true
              setItems({ a: v, b: v, c: v })
            }}
          >
            Select all
          </Checkbox>
          <div className="ms-6 mt-2 flex flex-col gap-1.5">
            {(['a', 'b', 'c'] as const).map((key) => (
              <Checkbox
                key={key}
                checked={items[key]}
                onCheckedChange={(next) =>
                  setItems((prev) => ({ ...prev, [key]: next === true }))
                }
              >
                Item {key.toUpperCase()}
              </Checkbox>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>CheckboxGroup</SectionHeader>
        <div className="max-w-md">
          <CheckboxGroup
            label="Frameworks you use"
            description="Pick all that apply."
            value={selected}
            onValueChange={setSelected}
            name="frameworks"
          >
            {FRAMEWORKS.map((fw) => (
              <Checkbox key={fw} value={fw}>
                {fw[0]!.toUpperCase() + fw.slice(1)}
              </Checkbox>
            ))}
          </CheckboxGroup>
          <Text variant="body-xs" color="muted" className="mt-2 block">
            Selected: <code>{selected.join(', ') || '(none)'}</code>
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>CheckboxGroup · horizontal · invalid</SectionHeader>
        <CheckboxGroup
          label="Preferred contact method"
          orientation="horizontal"
          required
          invalid
          errorMessage="Select at least one contact method."
        >
          <Checkbox value="email">Email</Checkbox>
          <Checkbox value="sms">SMS</Checkbox>
          <Checkbox value="push">Push</Checkbox>
        </CheckboxGroup>
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
            // eslint-disable-next-line no-alert
            alert(v || '(no checkboxes ticked)')
          }}
        >
          <Checkbox name="newsletter" value="yes" defaultChecked>
            Newsletter
          </Checkbox>
          <Checkbox name="terms" value="accepted" required>
            Accept terms
          </Checkbox>
          <button
            type="submit"
            className="self-start rounded-md border border-stroke bg-surface-brand px-3 py-1.5 text-sm font-medium text-content-on-brand"
          >
            Submit
          </button>
        </form>
      </section>

      <section>
        <SectionHeader>Compound mode · Checkbox.Root</SectionHeader>
        <div className="max-w-md">
          <Checkbox.Root invalid required defaultChecked={false}>
            <Checkbox.Input />
            <span className="flex flex-col">
              <Checkbox.Label>Accept terms</Checkbox.Label>
              <Checkbox.Description>
                Read the full agreement before continuing.
              </Checkbox.Description>
              <Checkbox.ErrorMessage>
                This field is required.
              </Checkbox.ErrorMessage>
            </span>
          </Checkbox.Root>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Reach for <code>Checkbox.Root</code> only when the convenience{' '}
          <code>&lt;Checkbox /&gt;</code> can&apos;t express your layout.
        </Text>
      </section>

      <section>
        <SectionHeader>Props · Checkbox</SectionHeader>
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
          {CHECKBOX_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[220px_1fr_140px] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <div className="flex flex-col gap-1.5">
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
        <SectionHeader>Props · CheckboxGroup</SectionHeader>
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
          {CHECKBOX_GROUP_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[220px_1fr_140px] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <div className="flex flex-col gap-1.5">
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
          {CHECKBOX_COMPOUND_PARTS.map(({ name, summary, props }) => (
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
                  <div className="flex flex-col gap-1.5">
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
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  description="We'll send updates to your email."
  required
>
  Subscribe to product updates
</Checkbox>`}
        />
      </section>
    </div>
  )
}
