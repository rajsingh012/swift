import { useState } from 'react'
import { Input } from '@swift/components/Input'
import { Text } from '@swift/components/Text'
import { Mail } from '@swift/icons/Mail'
import { Person } from '@swift/icons/Person'
import { Search } from '@swift/icons/Search'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const INPUT_KNOBS: ReadonlyArray<Knob> = [
  {
    type: 'segmented',
    name: 'variant',
    options: ['outlined', 'filled', 'flushed'],
    defaultValue: 'outlined',
  },
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  {
    type: 'segmented',
    name: 'labelPlacement',
    options: ['top', 'floating'],
    defaultValue: 'top',
  },
  { type: 'text', name: 'label', defaultValue: 'Email' },
  { type: 'text', name: 'placeholder', defaultValue: 'you@example.com' },
  { type: 'boolean', name: 'disabled' },
  { type: 'boolean', name: 'invalid' },
]

const DESCRIPTION =
  'Form field component. Three variants, three sizes, four semantic states, top + floating labels, stackable end-slot affordances (clear / password toggle / loading), character count, full ARIA wiring, and an OTP-ready Input.Group.'

const INPUT_VARIANTS: ReadonlyArray<{
  name: 'outlined' | 'filled' | 'flushed'
  use: string
}> = [
  { name: 'outlined', use: 'Default · bordered field on the surface' },
  { name: 'filled', use: 'Muted surface · less visual weight' },
  { name: 'flushed', use: 'Underline only · minimal chrome' },
]

const INPUT_SIZES: ReadonlyArray<{
  size: 'sm' | 'md' | 'lg'
  height: string
}> = [
  { size: 'sm', height: '32px' },
  { size: 'md', height: '40px' },
  { size: 'lg', height: '48px' },
]

const INPUT_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Fixed-height sizing: 32 / 40 / 48 px. Drives wrapper height, horizontal padding, and font size. Floating-label variants get +4px height to make room for the floated label.',
  },
  {
    name: 'variant',
    type: `'outlined' | 'filled' | 'flushed'`,
    defaultValue: `'outlined'`,
    description:
      'Visual chrome around the field. Outlined uses a bordered surface, filled swaps to a muted surface that lights up on focus, flushed shows only a bottom underline.',
  },
  {
    name: 'state',
    type: `'default' | 'success' | 'warning' | 'error'`,
    defaultValue: `'default'`,
    description:
      'Non-error semantic state. Drives border colour and focus ring tint. Overridden by `invalid`, which always wins and uses the critical palette.',
  },
  {
    name: 'labelPlacement',
    type: `'top' | 'floating'`,
    defaultValue: `'top'`,
    description:
      'Where the label sits. Floating mode uses pure-CSS `peer-placeholder-shown` to animate between in-field and floated-up positions — no JS state.',
  },
  {
    name: 'label',
    type: 'ReactNode',
    description:
      'Field label. In top mode it renders above the wrapper; in floating mode it sits inside the wrapper and floats up on focus or when the field has a value.',
  },
  {
    name: 'helperText',
    type: 'ReactNode',
    description:
      'Subtle text under the field, linked via aria-describedby. Hidden when an active errorMessage is shown — error takes precedence.',
  },
  {
    name: 'errorMessage',
    type: 'ReactNode',
    description:
      'Critical message under the field, rendered with role="alert" and aria-live="polite". Only visible when `invalid` is true.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Switches the wrapper, focus ring, and label to critical chrome, sets aria-invalid, and reveals errorMessage. Overrides the `state` prop.',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Forwards `required` to the native input, sets aria-required, and renders a critical asterisk after the label.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Disables the input. Sets data-disabled="true" on the root and wrapper so chrome dims and hover/focus states short-circuit.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Standard read-only state. Forwards `readOnly` to the input, sets data-readonly="true". Different from disabled — the field is still focusable and selectable.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Switches the root from inline-flex to flex with w-full. Useful in mobile-first forms and modal layouts where the field should fill the track.',
  },
  {
    name: 'startAdornment',
    type: 'ReactNode',
    description:
      'Content rendered before the input — typically a small icon. In floating-label mode, the label is shifted right past the icon in its in-field state to avoid collision.',
  },
  {
    name: 'endAdornment',
    type: 'ReactNode',
    description:
      'Content rendered after the input. Stacks with the built-in clear / password / loading affordances; consumer content sits furthest from the input.',
  },
  {
    name: 'clearable',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Shows a ✕ button while the field has a value. Works for both controlled and uncontrolled inputs — the component tracks length internally either way.',
  },
  {
    name: 'showPasswordToggle',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Adds an eye toggle that flips the input between password and text. Ignored for non-password types.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Renders a spinner in the end slot and sets aria-busy. Does not block typing — pair with `readOnly` if you need to lock input during async validation.',
  },
  {
    name: 'showCount',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Renders `value.length / maxLength` under the field. Requires `maxLength` to be set; otherwise the count is hidden.',
  },
  {
    name: 'onClear',
    type: '() => void',
    description:
      'Called when the clear button is pressed. If omitted, the component clears the input via a native setter so React picks up the change event for uncontrolled inputs.',
  },
  {
    name: 'classes',
    type: '{ root?, wrapper?, label?, field?, helperText?, errorMessage?, startAdornment?, endAdornment?, count? }',
    description:
      'Slot-level className overrides. Composes with the built-in classes — your overrides win cascade order.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLInputElement>',
    description:
      'Forwarded to the underlying <input>. Useful for focus management, validation libraries, and DOM-level event listening.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
    description:
      'Anything else (type, value, defaultValue, name, placeholder, autoComplete, maxLength, onChange, onFocus/onBlur, data-*, aria-*) forwards to the native input.',
  },
]

const INPUT_GROUP_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'length',
    type: 'number',
    description:
      'Number of cells. Each cell is a single-character input with shared focus, keyboard, and paste handling.',
  },
  {
    name: 'value',
    type: 'string',
    description:
      'Controlled value. Length is always normalised to `length` characters — missing positions render empty cells.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description:
      'Uncontrolled initial value. Filtered against `type` and truncated to `length` on mount.',
  },
  {
    name: 'onChange',
    type: '(next: string) => void',
    description:
      'Fires on every cell change with the full concatenated value (trimmed of trailing empties).',
  },
  {
    name: 'onComplete',
    type: '(next: string) => void',
    description:
      'Fires once when every cell is filled. Useful for auto-submit on the last digit of an OTP.',
  },
  {
    name: 'type',
    type: `'numeric' | 'alphanumeric' | 'all'`,
    defaultValue: `'numeric'`,
    description:
      'Character filter. `numeric` keeps digits only and sets inputMode="numeric"; `alphanumeric` adds letters; `all` accepts any character.',
  },
  {
    name: 'mask',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Renders cells as type="password" (dots) while still emitting the raw characters. Useful for sensitive codes.',
  },
  {
    name: 'autoFocus',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Focuses the first cell on mount.',
  },
  {
    name: 'ariaLabel',
    type: '(cellNumber: number) => string',
    description:
      'Per-cell label for screen readers. Receives the 1-indexed cell number; defaults to "Digit N".',
  },
  {
    name: 'size / variant / state / disabled / readOnly / required / invalid',
    type: 'InputSize / InputVariant / InputState / boolean',
    description:
      'Same semantics as the main Input — applied to every cell.',
  },
  {
    name: 'classes',
    type: '{ root?, cell? }',
    description:
      'Slot-level className overrides for the group container and each cell wrapper.',
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

const INPUT_COMPOUND_PARTS: ReadonlyArray<PartBlock> = [
  {
    name: 'Input.Root',
    summary:
      'Owns shared state (id, ARIA ids, size, variant) and exposes it via context. Renders no chrome — compose Input.Label / Input.Field / Input.HelperText / Input.ErrorMessage yourself.',
    props: [
      {
        name: 'size',
        type: `'sm' | 'md' | 'lg'`,
        defaultValue: `'md'`,
        description: 'Cascades to every child part through context.',
      },
      {
        name: 'variant',
        type: `'outlined' | 'filled' | 'flushed'`,
        defaultValue: `'outlined'`,
        description: 'Cascades to label and field styling.',
      },
      {
        name: 'state',
        type: `'default' | 'success' | 'warning' | 'error'`,
        defaultValue: `'default'`,
        description: 'Semantic state. `invalid` overrides this with critical chrome.',
      },
      {
        name: 'labelPlacement',
        type: `'top' | 'floating'`,
        defaultValue: `'top'`,
        description: 'Drives whether Input.Label renders above the wrapper or as a floating overlay.',
      },
      {
        name: 'invalid / disabled / readOnly / required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Cascade to Input.Field and Input.Label via context.',
      },
      {
        name: 'id',
        type: 'string',
        description:
          'Manual override of the generated input id. Input.Label uses this as its htmlFor automatically.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Switches the root from inline-flex to flex w-full.',
      },
      {
        name: 'hasStartAdornment',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Set this when composing a startAdornment alongside Input.Field — shifts the floating label past the icon in its in-field state.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the root <div>.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Compose Input.Label, the wrapper (with Input.Field inside), Input.HelperText, Input.ErrorMessage.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLDivElement>',
        description: 'Forwarded to the root <div>.',
      },
      {
        name: '...rest',
        type: 'HTMLAttributes<HTMLDivElement>',
        description: 'Forwards to the root <div>: id, data-*, aria-*, event handlers.',
      },
    ],
  },
  {
    name: 'Input.Label',
    summary:
      'Native <label> with htmlFor wired to the input id. Handles both top and floating placement, including the colour and position transitions in floating mode.',
    props: [
      {
        name: 'htmlFor',
        type: 'string',
        description: 'Override the auto-wired htmlFor. Defaults to the input id from context.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the <label>.',
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
        description: 'Forwards to the <label>: id, onClick, data-*, aria-*.',
      },
    ],
  },
  {
    name: 'Input.Field',
    summary:
      'The actual <input>. Auto-wires aria-describedby to helper and error ids from context; injects a placeholder space in floating mode so :placeholder-shown works for empty fields.',
    props: [
      {
        name: 'id',
        type: 'string',
        description: 'Override the input id. Defaults to the id from context.',
      },
      {
        name: 'placeholder',
        type: 'string',
        description:
          'Native placeholder. In floating-label mode, the component injects a single space when this is omitted so the float animation works for empty fields.',
      },
      {
        name: 'aria-describedby',
        type: 'string',
        description:
          'Appended to the auto-generated describedby chain (helper + error ids from context).',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the <input> after the base field classes.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLInputElement>',
        description: 'Forwarded to the <input>.',
      },
      {
        name: '...rest',
        type: 'InputHTMLAttributes<HTMLInputElement>',
        description:
          'Forwards to the <input>: type, value, defaultValue, name, autoComplete, maxLength, onChange, onFocus/onBlur, data-*, aria-*. The `size` attribute is stripped — it conflicts with the typed `size` prop on the Root.',
      },
    ],
  },
  {
    name: 'Input.HelperText',
    summary: 'Subtle helper paragraph, id linked to the field via aria-describedby.',
    props: [
      {
        name: 'id',
        type: 'string',
        description:
          'Override the auto-generated helper id. Defaults to `${rootId}-helper`, which Input.Field references via aria-describedby.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the <p>.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Helper text.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLParagraphElement>',
        description: 'Forwarded to the <p>.',
      },
    ],
  },
  {
    name: 'Input.ErrorMessage',
    summary:
      'Critical paragraph with role="alert" and aria-live="polite". Only render this when invalid is true on the Root — the simple API hides it automatically; in compound mode the consumer controls visibility.',
    props: [
      {
        name: 'id',
        type: 'string',
        description:
          'Override the auto-generated error id. Defaults to `${rootId}-error`, which Input.Field references via aria-describedby when invalid.',
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
  {
    name: 'Input.Group',
    summary:
      'OTP-style fixed-length group of single-character inputs. Handles focus advancement, backspace, arrow keys, Home/End, and paste auto-distribution. Used standalone — not as a child of Input.Root. See the "Props · Input.Group" section above for the full prop list.',
    props: [],
  },
]

export function InputPanel() {
  const [otp, setOtp] = useState('')
  const [withCount, setWithCount] = useState('')

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Input
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Input"
          knobs={INPUT_KNOBS}
          render={(v) => (
            <Input
              variant={v.variant as 'outlined' | 'filled' | 'flushed'}
              size={v.size as 'sm' | 'md' | 'lg'}
              labelPlacement={v.labelPlacement as 'top' | 'floating'}
              label={String(v.label)}
              placeholder={String(v.placeholder)}
              disabled={v.disabled === true}
              invalid={v.invalid === true}
            />
          )}
        />
      </section>

      <section>
        <SectionHeader>Variants · top label</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {INPUT_VARIANTS.map(({ name, use }) => (
            <div
              key={name}
              className="grid grid-cols-[140px_1fr_minmax(280px,auto)] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {use}
              </Text>
              <div className="flex justify-end">
                <Input
                  variant={name}
                  label="Email"
                  placeholder="you@example.com"
                  startAdornment={<Mail size={16} />}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Variants · floating label</SectionHeader>
        <PreviewRow
          code={`{/* Floating labels animate via pure CSS (peer-placeholder-shown) —
    no JS state. Works for controlled and uncontrolled inputs. */}
<Input
  variant="outlined"
  labelPlacement="floating"
  label="Full name"
  startAdornment={<Person size={16} />}
/>

<Input variant="filled"  labelPlacement="floating" label="Email" />
<Input variant="flushed" labelPlacement="floating" label="Phone" />`}
        >
          <Input
            variant="outlined"
            labelPlacement="floating"
            label="Full name"
            startAdornment={<Person size={16} />}
          />
          <Input
            variant="filled"
            labelPlacement="floating"
            label="Email"
          />
          <Input
            variant="flushed"
            labelPlacement="floating"
            label="Phone"
          />
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Floating labels animate via pure CSS (<code>peer-placeholder-shown</code>) — no JS state. Works for controlled and uncontrolled inputs.
        </Text>
      </section>

      <section>
        <SectionHeader>Sizes</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {INPUT_SIZES.map(({ size, height }) => (
            <div
              key={size}
              className="grid grid-cols-[80px_140px_1fr] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {size}
              </Text>
              <Text variant="body-xs" color="muted">
                h {height}
              </Text>
              <div className="flex items-end gap-3">
                <Input size={size} placeholder="Type something…" />
                <Input
                  size={size}
                  placeholder="Search"
                  startAdornment={<Search size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Form states</SectionHeader>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Required"
            placeholder="Hello World"
            defaultValue="Hello World"
            required
          />
          <Input
            label="Disabled"
            placeholder="Hello World"
            disabled
            defaultValue="Hello World"
          />
          <Input
            label="Read Only"
            placeholder="Hello World"
            readOnly
            defaultValue="Hello World"
          />
          <Input
            label="Invalid"
            placeholder="you@example.com"
            invalid
            errorMessage="Email is required"
            defaultValue="not-an-email"
          />
          <Input
            label="With helper"
            placeholder="Pick a username"
            helperText="Lowercase, 3 – 20 characters."
          />
          <Input
            label="Success"
            state="success"
            defaultValue="raj"
            helperText="Username available."
          />
        </div>
      </section>

      <section>
        <SectionHeader>End-slot · clear · password · loading</SectionHeader>
        <PreviewRow
          code={`{/* End-slot order: clear → password toggle → loading spinner → endAdornment. */}
<Input label="Clearable" clearable defaultValue="Type to see ✕" />
<Input label="Password" type="password" showPasswordToggle />
<Input label="Async validating" loading defaultValue="checking@example.com" />
<Input
  label="All four stacked"
  type="password"
  clearable
  showPasswordToggle
  loading
  endAdornment={<Text variant="body-xs" color="muted">USD</Text>}
/>`}
        >
          <Input
            label="Clearable"
            defaultValue="Type to see ✕"
            clearable
          />
          <Input
            label="Password"
            type="password"
            defaultValue="hunter2"
            showPasswordToggle
          />
          <Input
            label="Async validating"
            defaultValue="checking@example.com"
            loading
          />
          <Input
            label="All four stacked"
            type="password"
            defaultValue="hunter2"
            clearable
            showPasswordToggle
            loading
            endAdornment={<Text variant="body-xs" color="muted">USD</Text>}
          />
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Affordances stack in the end slot in a fixed order: clear → password toggle → loading spinner → consumer endAdornment.
        </Text>
      </section>

      <section>
        <SectionHeader>Character count</SectionHeader>
        <div className="max-w-md">
          <Input
            label="Bio"
            placeholder="Tell us about yourself"
            value={withCount}
            onChange={(e) => setWithCount(e.target.value)}
            maxLength={100}
            showCount
            helperText="Keep it short and sweet."
          />
        </div>
      </section>

      <section>
        <SectionHeader>Input.Group · OTP</SectionHeader>
        <div className="grid gap-3">
          <Input.Group
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={(v) => console.log('complete:', v)}
            type="numeric"
            className='w-100'
            // autoFocus
          />
          <Text variant="body-xs" color="muted">
            Value: <code>{otp || '(empty)'}</code> · Paste a 6-digit code to see auto-distribute.
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>Compound mode · Input.Root</SectionHeader>
        <div className="max-w-md">
          <Input.Root invalid>
            <Input.Label>Password</Input.Label>
            <div className="relative inline-flex h-10 w-full items-center gap-2 rounded-md border border-stroke-critical bg-surface px-3 focus-within:ring-2 focus-within:ring-stroke-critical/40">
              <Input.Field type="password" placeholder="Enter password" />
            </div>
            <Input.ErrorMessage>Password must be at least 8 characters.</Input.ErrorMessage>
          </Input.Root>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Reach for <code>Input.Root</code> only when the convenience <code>&lt;Input /&gt;</code> can&apos;t express your layout — e.g. an action row between input and helper, or a label on the right.
        </Text>
      </section>

      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Label association.</strong> <code>Input.Label</code> sets <code>htmlFor</code> from the auto-generated input id, so clicking the label focuses the field. The simple <code>&lt;Input label=&quot;…&quot; /&gt;</code> API wires this up for you.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Describedby chain.</strong> <code>aria-describedby</code> on the input is built from the helper text and error message ids. When <code>invalid</code> flips to true the error id is appended automatically, so assistive tech announces both helper and error context.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Invalid + error.</strong> <code>invalid</code> sets <code>aria-invalid</code> on the input and switches chrome to critical. <code>errorMessage</code> renders with <code>role=&quot;alert&quot;</code> and <code>aria-live=&quot;polite&quot;</code> so the message is announced when it appears.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Required.</strong> Forwards <code>required</code> to the native input, sets <code>aria-required</code>, and renders a visible critical-coloured asterisk after the label.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Focus ring.</strong> A 2px coloured ring lights the wrapper on <code>focus-within</code> — brand by default, semantic tint for success/warning, critical for invalid. The flushed variant skips the ring (it would clash with the underline) and just deepens the border.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Disabled vs readOnly.</strong> <code>disabled</code> dims the chrome, sets the native attribute, and removes the input from the tab order. <code>readOnly</code> keeps the input focusable and selectable but blocks edits — different states, different intent.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Loading.</strong> Sets <code>aria-busy</code> on the wrapper and renders a spinner in the end slot. The input itself stays editable — pair with <code>readOnly</code> if you need to lock the field during async validation.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Password toggle.</strong> The eye button is a real <code>&lt;button&gt;</code> with <code>aria-pressed</code> reflecting visibility, and <code>aria-label</code> that swaps between &ldquo;Show password&rdquo; and &ldquo;Hide password&rdquo;.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Clear button.</strong> Rendered with <code>aria-label=&quot;Clear input&quot;</code>. Hidden when the field is empty, disabled, or read-only so screen readers don&apos;t announce a no-op affordance.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Floating label.</strong> Pure CSS via <code>:placeholder-shown</code> + <code>:peer-focus</code> — no JS state. A single-space placeholder is injected when the consumer doesn&apos;t supply one so the float animation works for empty fields.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Input.Group (OTP).</strong> Container renders as <code>role=&quot;group&quot;</code>. Cells use <code>inputMode=&quot;numeric&quot;</code> for the numeric type, <code>autoComplete=&quot;one-time-code&quot;</code> on the first cell so iOS surfaces the SMS code, and per-cell <code>aria-label</code>s like &ldquo;Digit 3&rdquo;. Backspace, arrow keys, Home/End, and paste-distribute are wired explicitly.
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>Props · Input</SectionHeader>
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
          {INPUT_PROPS.map(({ name, type, defaultValue, description }) => (
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
        <SectionHeader>Props · Input.Group</SectionHeader>
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
          {INPUT_GROUP_PROPS.map(({ name, type, defaultValue, description }) => (
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
          {INPUT_COMPOUND_PARTS.map(({ name, summary, props }) => (
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
              {props.length > 0 ? (
                <>
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
                </>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Input } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import Input from '@swift/components/Input'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Input, type InputProps, type InputSize, type InputVariant, type InputState, type InputGroupProps } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Input
  label="Email"
  placeholder="you@example.com"
  startAdornment={<Mail size={16} />}
  helperText="We'll never share your email"
  required
/>`}
        />
      </section>
    </div>
  )
}
