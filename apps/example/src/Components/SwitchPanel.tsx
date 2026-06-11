import { useRef, useState } from 'react'
import { Switch, SwitchGroup, type SwitchApi } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { Check } from '@swift/icons/Check'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

type SwitchKnobVariant = 'default' | 'success' | 'warning' | 'info' | 'neutral'

const SWITCH_KNOBS: ReadonlyArray<Knob> = [
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  {
    type: 'select',
    name: 'variant',
    options: ['default', 'success', 'warning', 'info', 'neutral'],
    defaultValue: 'default',
  },
  { type: 'boolean', name: 'disabled' },
  { type: 'boolean', name: 'loading' },
  {
    type: 'text',
    name: 'children',
    defaultValue: 'Enable notifications',
    asChildren: true,
  },
]

const DESCRIPTION =
  'Accessible toggle switch with three sizes, semantic variants, loading state, controlled & uncontrolled APIs, native form compatibility, full ARIA wiring, and a compound API for custom layouts. Built on a hidden <input type="checkbox" role="switch">, so labels click-toggle, Space activates, and form submission Just Works.'

const SIZES: ReadonlyArray<{
  size: 'sm' | 'md' | 'lg'
  track: string
}> = [
  { size: 'sm', track: '28×16 px' },
  { size: 'md', track: '36×20 px' },
  { size: 'lg', track: '44×24 px' },
]

const VARIANTS: ReadonlyArray<{
  variant: 'default' | 'success' | 'warning' | 'info' | 'neutral'
  label: string
}> = [
  { variant: 'default', label: 'Default (brand)' },
  { variant: 'success', label: 'Success' },
  { variant: 'warning', label: 'Warning' },
  { variant: 'info', label: 'Info' },
  { variant: 'neutral', label: 'Neutral (low emphasis)' },
]

function MiniClose() {
  return (
    <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden>
      <path
        d="M4.5 4.5l7 7M11.5 4.5l-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MiniCheck() {
  return (
    <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden>
      <path
        d="M3.5 8.5l3 3 6-6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SWITCH_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'checked',
    type: 'boolean',
    description:
      'Controlled state. When provided, the component never updates its own state — call onCheckedChange and feed the next value back to render it.',
  },
  {
    name: 'defaultChecked',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Uncontrolled initial state. Ignored when `checked` is provided.',
  },
  {
    name: 'onCheckedChange',
    type: '(checked: boolean) => void',
    description:
      'Fires after each toggle with the next boolean value. Suppressed while `loading` or `readOnly` is true.',
  },
  {
    name: 'onChange',
    type: '(event: ChangeEvent<HTMLInputElement>) => void',
    description:
      'Native input onChange. Fires alongside onCheckedChange — use this when you need the raw event (e.g. for form library integration that subscribes to native events).',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Track dimensions: 28×16 / 36×20 / 44×24 px. Scales the thumb and the label text alongside it.',
  },
  {
    name: 'variant',
    type: `'default' | 'success' | 'warning' | 'info' | 'neutral'`,
    defaultValue: `'default'`,
    description:
      'Colour scheme applied to the checked state. Unchecked stays neutral across variants — variant communicates the meaning of "on", not the off state. `neutral` keeps the checked-state pill grey for low-emphasis acknowledgement toggles. `invalid` overrides variant entirely.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Disables the native input, removes it from the tab order, and dims the chrome. Sets data-disabled="true" on the root.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Native checkboxes ignore readOnly, so the component intercepts the change event, re-asserts the visual state, and suppresses onCheckedChange. Sets aria-readonly and data-readonly="true". The input stays focusable.',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Forwards `required` to the native input, sets aria-required, and renders a visible asterisk after the label.',
  },
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Switches the track and focus ring to critical chrome, sets aria-invalid, and reveals `errorMessage` if supplied.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Renders a spinner inside the thumb, sets aria-busy, suppresses interaction (no toggle on click / Space), and skips onCheckedChange. The `disabled` prop is unchanged — visual distinction comes from data-loading="true".',
  },
  {
    name: 'description',
    type: 'ReactNode',
    description:
      'Helper text rendered below the label and linked via aria-describedby. Hidden when an active errorMessage is shown — error takes precedence.',
  },
  {
    name: 'errorMessage',
    type: 'ReactNode',
    description:
      'Message rendered with role="alert" and aria-live="polite" when `invalid` is true. Linked via aria-describedby.',
  },
  {
    name: 'checkedIcon / uncheckedIcon',
    type: 'ReactNode',
    description:
      'Glyphs rendered inside the thumb in each state. Both are optional and independent — supply one, the other, or both. Hidden during loading (the spinner takes over).',
  },
  {
    name: 'value',
    type: 'string',
    description:
      'Forwarded to the native input. Useful for plain form submissions where `name=value` should appear in the payload only when the switch is on.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Forwarded to the native input — required for form submission.',
  },
  {
    name: 'classes',
    type: '{ root?, control?, track?, thumb?, input?, label?, description?, errorMessage?, text? }',
    description:
      'Slot-level className overrides. Composes with the built-in classes — your overrides win cascade order.',
  },
  {
    name: 'apiRef',
    type: 'Ref<SwitchApi>',
    description:
      'Imperative handle exposing toggle / setChecked / focus / blur / getChecked. Useful when an external control needs to drive the switch — e.g. a "Reset all" button on a settings page. Independent of the regular ref (which still forwards to the native input).',
  },
  {
    name: 'dragToToggle',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Enables the drag-to-toggle gesture: the thumb tracks the pointer once movement exceeds 4 px, and a release past the midpoint flips state. Click + Space behave identically regardless. Set false for environments where any pointer drag should be ignored (e.g. inside a horizontally-scrolling list).',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLInputElement>',
    description:
      'Forwarded to the underlying <input type="checkbox" role="switch">. Useful for focus management, validation libraries, and DOM-level event listening.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
    description:
      'Anything else forwards to the native input: id, form, autoFocus, onFocus/onBlur, data-*, aria-*, etc.',
  },
]

const SWITCH_GROUP_PROPS: ReadonlyArray<{
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
      'Fires after each toggle with the next value array. The array preserves insertion order — newly switched-on items are appended.',
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
    description: 'Rendered between the label and items, linked via aria-describedby.',
  },
  {
    name: 'errorMessage',
    type: 'ReactNode',
    description:
      'Rendered below the items when `invalid` is true. Uses role="alert" and is appended to aria-describedby.',
  },
  {
    name: 'size / variant / disabled / readOnly / required / invalid',
    type: 'SwitchSize / SwitchVariant / boolean',
    description:
      'Cascade to every child Switch unless the child sets its own override. The group also sets matching aria-* and data-* attributes for styling and assistive tech.',
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
    description: 'Slot-level className overrides for the group container parts.',
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

const SWITCH_COMPOUND_PARTS: ReadonlyArray<PartBlock> = [
  {
    name: 'Switch.Root',
    summary:
      'Owns state, ARIA ids, and the cascading flags but renders no chrome itself. Reach for it when the convenience <Switch> can\'t express your layout — e.g. label above the pill, custom description placement.',
    props: [
      {
        name: 'checked / defaultChecked / onCheckedChange',
        type: 'boolean / boolean / (boolean) => void',
        description: 'Same semantics as on <Switch>.',
      },
      {
        name: 'size / variant',
        type: `'sm' | 'md' | 'lg' / 'default' | 'success' | 'warning'`,
        description: 'Cascade to every child part through context.',
      },
      {
        name: 'disabled / readOnly / required / invalid / loading',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Cascade to nested parts and to the native input rendered by Switch.Input.',
      },
      {
        name: 'id',
        type: 'string',
        description:
          'Override the generated input id. Switch.Label uses this to set its htmlFor automatically.',
      },
      {
        name: 'value / name',
        type: 'string',
        description:
          'Forwarded to the native input. Useful for form submissions.',
      },
      {
        name: 'classes',
        type: 'SwitchClasses',
        description: 'Slot-level className overrides.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Compose Switch.Input, Switch.Label, Switch.Description, Switch.ErrorMessage in any order.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLSpanElement>',
        description: 'Forwarded to the root <span>.',
      },
      {
        name: 'apiRef',
        type: 'Ref<SwitchApi>',
        description:
          'Imperative handle (toggle / setChecked / focus / blur / getChecked). The native input is reached via context, so focus/blur work even when you compose Switch.Input manually inside this root.',
      },
      {
        name: 'dragToToggle',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Same as on <Switch>. Cascades to the nested Switch.Input.',
      },
    ],
  },
  {
    name: 'Switch.Input',
    summary:
      'The hit area: a wrapper <span> with a hidden <input type="checkbox" role="switch"> overlaid on the visible Track + Thumb. Clicks on the pill and Space-key activation are delegated to the input, so native form submission and screen readers work without extra wiring.',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Override the default Track + Thumb composition. Pass <Switch.Track><Switch.Thumb /></Switch.Track> with custom slots inside the thumb (e.g. an icon row) when you need finer control.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the wrapper <span>.',
      },
      {
        name: 'id / name / value',
        type: 'string',
        description:
          'Override the corresponding native input attributes. Each defaults to the value held by the surrounding Switch.Root.',
      },
      {
        name: 'onChange',
        type: '(e: ChangeEvent<HTMLInputElement>) => void',
        description:
          'Native input onChange. Fires alongside onCheckedChange on the Root.',
      },
      {
        name: 'aria-describedby / aria-labelledby',
        type: 'string',
        description:
          'Appended to the auto-generated describedby chain (description + errorMessage ids).',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLInputElement>',
        description:
          'Forwarded to the underlying <input type="checkbox" role="switch">.',
      },
      {
        name: '...rest',
        type: 'InputHTMLAttributes<HTMLInputElement>',
        description:
          'Forwards to the native input. The `type`, `size`, `checked`, and `defaultChecked` attributes are stripped — they are owned by the Root.',
      },
    ],
  },
  {
    name: 'Switch.Track',
    summary:
      'The visible pill. Renders a `swift-switch-track` <span> with data-state on it; sizing and colour come from the `--switch-*` tokens on the root.',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Typically a single <Switch.Thumb />.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the track <span>.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Render the consumer\'s single child element instead of a <span>. Our className, data-state, data-disabled etc. are cloned onto it via Slot.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLSpanElement>',
        description: 'Forwarded to the track <span>.',
      },
    ],
  },
  {
    name: 'Switch.Thumb',
    summary:
      'The travelling circle. Position is driven by data-state on the root; this component renders the glyph (checked icon, unchecked icon, or a spinner when loading).',
    props: [
      {
        name: 'checkedIcon / uncheckedIcon',
        type: 'ReactNode',
        description:
          'Per-thumb overrides. Take precedence over the same-named props on the root <Switch> / <Switch.Root>.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description:
          'Bypass the icon resolution and render arbitrary content inside the thumb. The spinner is still shown when `loading` is true.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Appended to the thumb <span>.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Render the consumer\'s single child element instead of a <span>. Default icon resolution is skipped — the consumer\'s element owns its own glyph (the spinner still appears during loading).',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLSpanElement>',
        description: 'Forwarded to the thumb <span>.',
      },
    ],
  },
  {
    name: 'Switch.Label',
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
        name: 'className',
        type: 'string',
        description: 'Appended to the <label>.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Render the consumer\'s single child element instead of a <label>. The required asterisk is suppressed — the consumer takes over rendering responsibilities.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Label content.',
      },
      {
        name: 'ref',
        type: 'Ref<HTMLLabelElement>',
        description: 'Forwarded to the <label>.',
      },
    ],
  },
  {
    name: 'Switch.Description',
    summary:
      'Helper paragraph linked to the input via aria-describedby. Dims when the switch is disabled.',
    props: [
      {
        name: 'id',
        type: 'string',
        description:
          'Override the auto-generated description id. Defaults to `${rootId}-description`.',
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
    ],
  },
  {
    name: 'Switch.ErrorMessage',
    summary:
      'Error paragraph with role="alert" and aria-live="polite". Only render when invalid is true on the Root — the convenience <Switch> hides it automatically; in compound mode the consumer controls visibility.',
    props: [
      {
        name: 'id',
        type: 'string',
        description:
          'Override the auto-generated error id. Defaults to `${rootId}-error`.',
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
    ],
  },
]

export function SwitchPanel() {
  const [controlled, setControlled] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingChecked, setSavingChecked] = useState(false)
  const [groupValue, setGroupValue] = useState<string[]>(['email', 'push'])

  // Simulated async toggle — flips loading while a pretend network call is
  // in flight, then commits the new value. Mirrors a real settings UX.
  const onAsyncToggle = (next: boolean) => {
    setSaving(true)
    window.setTimeout(() => {
      setSavingChecked(next)
      setSaving(false)
    }, 900)
  }

  // Imperative handle for the apiRef demo. The two buttons drive the
  // switch without storing its state in React — the handle's getChecked
  // is read on demand to update the label.
  const apiRef = useRef<SwitchApi | null>(null)
  const [apiLabel, setApiLabel] = useState('Click a button to drive the switch')

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Switch
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Switch"
          knobs={SWITCH_KNOBS}
          render={(v) => (
            <Switch
              size={v.size as 'sm' | 'md' | 'lg'}
              variant={v.variant as SwitchKnobVariant}
              disabled={v.disabled === true}
              loading={v.loading === true}
            >
              {String(v.children)}
            </Switch>
          )}
        />
      </section>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow
          code={`<Switch defaultChecked>Enable notifications</Switch>
<Switch>Subscribe to newsletter</Switch>`}
        >
          <Switch defaultChecked>Enable notifications</Switch>
          <Switch>Subscribe to newsletter</Switch>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Sizes</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {SIZES.map(({ size, track }) => (
            <div
              key={size}
              className="grid gap-3 border-b border-stroke-muted p-4 last:border-0 md:grid-cols-[80px_120px_1fr] md:items-center md:gap-6 md:p-6"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {size}
              </Text>
              <Text variant="body-xs" color="muted">
                {track}
              </Text>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Switch size={size}>Off</Switch>
                <Switch size={size} defaultChecked>
                  On
                </Switch>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Variants</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {VARIANTS.map(({ variant, label }) => (
            <div
              key={variant}
              className="grid gap-3 border-b border-stroke-muted p-4 last:border-0 md:grid-cols-[160px_1fr] md:items-center md:gap-6 md:p-6"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {variant}
              </Text>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Switch variant={variant} defaultChecked>
                  {label}
                </Switch>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Form states</SectionHeader>
        <div className="grid grid-cols-2 gap-4">
          <Switch required defaultChecked>
            Required
          </Switch>
          <Switch disabled>Disabled · off</Switch>
          <Switch disabled defaultChecked>
            Disabled · on
          </Switch>
          <Switch readOnly defaultChecked>
            Read only · locked on
          </Switch>
          <Switch invalid errorMessage="You must accept the terms to continue.">
            Accept terms
          </Switch>
          <Switch description="We'll send updates about your bookings.">
            Email notifications
          </Switch>
        </div>
      </section>

      <section>
        <SectionHeader>Controlled</SectionHeader>
        <PreviewRow
          code={`const [enabled, setEnabled] = useState(false)

<Switch checked={enabled} onCheckedChange={setEnabled}>
  Auto-renew subscription
</Switch>`}
        >
          <Switch
            checked={controlled}
            onCheckedChange={setControlled}
          >
            Auto-renew subscription
          </Switch>
          <Text variant="body-xs" color="muted">
            state: <code>{String(controlled)}</code>
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Thumb icons</SectionHeader>
        <PreviewRow
          code={`<Switch checkedIcon={<CheckIcon />} uncheckedIcon={<CloseIcon />} defaultChecked>
  Dark mode
</Switch>`}
        >
          <Switch
            checkedIcon={<MiniCheck />}
            uncheckedIcon={<MiniClose />}
            defaultChecked
          >
            Dark mode
          </Switch>
          <Switch
            size="lg"
            checkedIcon={<Check size={12} />}
            defaultChecked
            variant="success"
          >
            Subscribed
          </Switch>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Icon-as-state · large thumb glyph</SectionHeader>
        <PreviewRow
          code={`{/* Bump --switch-thumb-icon-scale so the icon dominates the thumb. */}
<Switch
  size="lg"
  style={{ ['--switch-thumb-icon-scale' as never]: 0.85 }}
  checkedIcon={<MoonGlyph />}
  uncheckedIcon={<SunGlyph />}
  defaultChecked
>
  Dark mode
</Switch>`}
        >
          <Switch
            size="lg"
            style={{ ['--switch-thumb-icon-scale' as never]: 0.85 }}
            checkedIcon={<MiniCheck />}
            uncheckedIcon={<MiniClose />}
            defaultChecked
          >
            Notifications
          </Switch>
          <Switch
            size="lg"
            style={{ ['--switch-thumb-icon-scale' as never]: 0.85 }}
            checkedIcon={<MiniCheck />}
            uncheckedIcon={<MiniClose />}
            variant="info"
          >
            Auto-sync
          </Switch>
          <Text variant="body-xs" color="muted">
            The token defaults to <code>0.6</code>. Pushing it to <code>0.85</code> makes the glyph the dominant visual cue — the variant colour becomes the supporting accent. Available on <code>--switch-thumb-icon-scale</code>.
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Hover preview</SectionHeader>
        <PreviewRow
          code={`{/* Default — thumb nudges 2px on hover toward the toggle direction. */}
<Switch>Hover me</Switch>

{/* Disable per-instance by zero-ing the token. */}
<Switch style={{ ['--switch-hover-preview' as never]: '0' }}>
  No preview
</Switch>

{/* Or push it further for a more obvious hint. */}
<Switch style={{ ['--switch-hover-preview' as never]: '4px' }}>
  Bigger nudge
</Switch>`}
        >
          <Switch>Hover me</Switch>
          <Switch style={{ ['--switch-hover-preview' as never]: '0' }}>
            No preview
          </Switch>
          <Switch style={{ ['--switch-hover-preview' as never]: '4px' }}>
            Bigger nudge
          </Switch>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The nudge respects logical writing direction (RTL flips correctly) and is suppressed when <code>disabled</code> / <code>readOnly</code> / <code>loading</code> are set, so it can&apos;t lie about the state. Honors <code>prefers-reduced-motion</code> automatically.
        </Text>
      </section>

      <section>
        <SectionHeader>Loading · async settings update</SectionHeader>
        <PreviewRow
          code={`const [saving, setSaving] = useState(false)
const [checked, setChecked] = useState(false)

<Switch
  loading={saving}
  checked={checked}
  onCheckedChange={(next) => {
    setSaving(true)
    saveToServer(next).then(() => {
      setChecked(next)
      setSaving(false)
    })
  }}
>
  Two-factor auth
</Switch>`}
        >
          <Switch
            loading={saving}
            checked={savingChecked}
            onCheckedChange={onAsyncToggle}
          >
            Two-factor auth
          </Switch>
          <Text variant="body-xs" color="muted">
            {saving ? 'Updating…' : `state: ${String(savingChecked)}`}
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>RTL · thumb mirrors automatically</SectionHeader>
        <div className="rounded-lg border border-stroke bg-surface-elevated p-4" dir="rtl">
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
            description="هل تريد تلقي تحديثات الحجز؟"
          >
            تفعيل الإشعارات
          </Switch>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The thumb position uses <code>inset-inline-start</code>, so RTL flipping is handled by the browser — no manual transform reversal.
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
            // eslint-disable-next-line no-alert
            alert(v || '(no switches on)')
          }}
        >
          <Switch name="notifications" value="on" defaultChecked>
            Notifications
          </Switch>
          <Switch name="newsletter" value="on">
            Newsletter
          </Switch>
          <Switch name="marketing" value="on">
            Marketing emails
          </Switch>
          <button
            type="submit"
            className="self-start rounded-md border border-stroke bg-surface-brand px-3 py-1.5 text-sm font-medium text-content-on-brand"
          >
            Submit
          </button>
        </form>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Only switches that are on appear in the form payload — same semantics as a native checkbox.
        </Text>
      </section>

      <section>
        <SectionHeader>SwitchGroup · cascading flags</SectionHeader>
        <div className="max-w-md">
          <SwitchGroup
            label="Notification channels"
            description="Pick how you want to hear from us."
            value={groupValue}
            onValueChange={setGroupValue}
            name="channels"
          >
            <Switch value="email">Email</Switch>
            <Switch value="sms">SMS</Switch>
            <Switch value="push">Push</Switch>
            <Switch value="in_app">In-app</Switch>
          </SwitchGroup>
          <Text variant="body-xs" color="muted" className="mt-2 block">
            Selected: <code>{groupValue.join(', ') || '(none)'}</code>
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>SwitchGroup · horizontal · disabled cascade</SectionHeader>
        <SwitchGroup
          label="Trip preferences"
          orientation="horizontal"
          variant="success"
          disabled
          defaultValue={['flexible']}
        >
          <Switch value="direct">Direct flights only</Switch>
          <Switch value="flexible">Flexible dates</Switch>
          <Switch value="overnight">Allow overnight layovers</Switch>
        </SwitchGroup>
      </section>

      <section>
        <SectionHeader>Imperative apiRef · drive from outside</SectionHeader>
        <PreviewRow
          code={`const apiRef = useRef<SwitchApi | null>(null)

<Switch apiRef={apiRef}>Two-factor auth</Switch>

<button onClick={() => apiRef.current?.toggle()}>Toggle</button>
<button onClick={() => apiRef.current?.focus()}>Focus</button>
<button onClick={() => alert(apiRef.current?.getChecked())}>Read</button>`}
        >
          <Switch apiRef={apiRef} defaultChecked>
            Two-factor auth
          </Switch>
          <button
            type="button"
            onClick={() => apiRef.current?.toggle()}
            className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
          >
            Toggle
          </button>
          <button
            type="button"
            onClick={() => apiRef.current?.setChecked(true)}
            className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
          >
            Force on
          </button>
          <button
            type="button"
            onClick={() => apiRef.current?.focus()}
            className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
          >
            Focus
          </button>
          <button
            type="button"
            onClick={() =>
              setApiLabel(
                `checked is ${String(apiRef.current?.getChecked() ?? null)}`,
              )
            }
            className="rounded-sm border border-stroke px-2 py-1 text-xs hover:bg-surface-muted"
          >
            Read
          </button>
          <Text variant="body-xs" color="muted">
            {apiLabel}
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Drag-to-toggle</SectionHeader>
        <PreviewRow
          code={`{/* default — drag past the midpoint to flip */}
<Switch defaultChecked>Drag me</Switch>

{/* opt out for click-only environments */}
<Switch dragToToggle={false}>Click-only</Switch>`}
        >
          <Switch defaultChecked>Drag me</Switch>
          <Switch dragToToggle={false}>Click-only</Switch>
          <Text variant="body-xs" color="muted">
            Drag activates after 4 px of pointer movement so accidental swipes don&apos;t toggle. RTL flips the drag direction automatically — try the RTL demo above with a pointer.
          </Text>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>asChild · render as a custom element</SectionHeader>
        <PreviewRow
          code={`<Switch.Root>
  <Switch.Input>
    <Switch.Track asChild>
      <div className="my-custom-track">
        <Switch.Thumb />
      </div>
    </Switch.Track>
  </Switch.Input>
  <Switch.Label asChild>
    <h3>Custom heading-style label</h3>
  </Switch.Label>
</Switch.Root>`}
        >
          <Switch.Root defaultChecked>
            <Switch.Input />
            <Switch.Label asChild>
              <h3 className="text-base font-semibold text-content-strong">
                Heading-style label
              </h3>
            </Switch.Label>
          </Switch.Root>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>asChild</code> clones the consumer&apos;s element with our props (htmlFor, className, data-*). Available on <code>Switch.Label</code>, <code>Switch.Track</code>, and <code>Switch.Thumb</code>. When used on <code>Switch.Label</code> the auto-appended required asterisk is suppressed — the consumer takes over.
        </Text>
      </section>

      <section>
        <SectionHeader>Compound mode · Switch.Root</SectionHeader>
        <div className="max-w-md">
          <Switch.Root invalid required defaultChecked={false}>
            <Switch.Input />
            <span className="flex flex-col">
              <Switch.Label>Accept terms</Switch.Label>
              <Switch.Description>
                Read the full agreement before continuing.
              </Switch.Description>
              <Switch.ErrorMessage>
                This field is required.
              </Switch.ErrorMessage>
            </span>
          </Switch.Root>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Reach for <code>Switch.Root</code> only when the convenience <code>&lt;Switch /&gt;</code> can&apos;t express your layout.
        </Text>
      </section>

      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Native input + role=&quot;switch&quot;.</strong> A real <code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</code> sits invisibly above the pill. Screen readers announce &quot;Switch, on/off&quot; (or &quot;toggle button&quot; depending on platform) instead of &quot;Checkbox, checked/unchecked&quot;.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong> <code>Space</code> toggles, <code>Tab</code> / <code>Shift+Tab</code> move focus. Native behaviour — no custom key handlers.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Focus ring.</strong> A 3 px brand wash on the track only fires on <code>:focus-visible</code>, so mouse users don&apos;t see a ring after click. Switches to critical-coloured when <code>invalid</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Label association.</strong> <code>Switch.Label</code> sets <code>htmlFor</code> from the input id automatically. Clicking anywhere on the label toggles the pill — including in the simple <code>&lt;Switch&gt;children&lt;/Switch&gt;</code> API.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Disabled vs readOnly.</strong> <code>disabled</code> forwards to the native input and removes it from the tab order. <code>readOnly</code> is non-standard for checkboxes — the component intercepts the change event, re-asserts the visual state, sets <code>aria-readonly</code>, and the input stays focusable.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Loading.</strong> Sets <code>aria-busy=&quot;true&quot;</code>, disables the underlying input (so Space and clicks are inert), and suppresses <code>onCheckedChange</code>. The <code>disabled</code> prop is unchanged so the off-state vs busy-state stay visually distinguishable.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Required + invalid + error.</strong> Forwards <code>required</code> + sets <code>aria-required</code>. <code>invalid</code> flips chrome to critical, sets <code>aria-invalid</code>, and reveals the error paragraph (<code>role=&quot;alert&quot;</code>, <code>aria-live=&quot;polite&quot;</code>) so it&apos;s announced when it appears.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Describedby chain.</strong> <code>aria-describedby</code> on the input automatically links both the description and (when invalid) the error message ids.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Touch target.</strong> On coarse pointers the input&apos;s hit area is inflated to <code>44×44 px</code> (WCAG 2.5.5) without resizing the visible track.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion.</strong> <code>prefers-reduced-motion: reduce</code> collapses the thumb travel and spinner animation to <code>1 ms</code>.
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>Props · Switch</SectionHeader>
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
          {SWITCH_PROPS.map(({ name, type, defaultValue, description }) => (
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
        <SectionHeader>Props · SwitchGroup</SectionHeader>
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
          {SWITCH_GROUP_PROPS.map(({ name, type, defaultValue, description }) => (
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
          {SWITCH_COMPOUND_PARTS.map(({ name, summary, props }) => (
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
        <SectionHeader>Theme tokens · custom palette per instance</SectionHeader>
        <PreviewRow
          code={`{/* Re-skin one switch inline — track, thumb, focus ring all swappable. */}
<Switch
  defaultChecked
  style={{
    ['--switch-track-bg-checked' as never]: '#a855f7',
    ['--switch-thumb-bg' as never]: '#fef3c7',
    ['--switch-track-width' as never]: '52px',
    ['--switch-thumb-size' as never]: '24px',
  }}
>
  Custom palette
</Switch>`}
        >
          <Switch
            defaultChecked
            style={{
              ['--switch-track-bg-checked' as never]: '#a855f7',
              ['--switch-thumb-bg' as never]: '#fef3c7',
              ['--switch-track-width' as never]: '52px',
              ['--switch-thumb-size' as never]: '24px',
            }}
          >
            Custom palette
          </Switch>
          <Switch
            defaultChecked
            style={{
              ['--switch-track-bg-checked' as never]: 'oklch(70% 0.2 220)',
              ['--switch-thumb-shadow' as never]:
                '0 2px 8px rgb(0 0 0 / 0.3), 0 0 0 1px rgb(0 0 0 / 0.04)',
            }}
          >
            Heavier shadow
          </Switch>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Theme tokens · reference</SectionHeader>
        <CodeBlock
          code={`/* Every visible dimension and colour flows from one of these.
   Override per-instance via inline style, or globally via a higher-
   level selector (e.g. \`[data-theme="dark"] .swift-switch { ... }\`). */

/* Geometry */
--switch-track-width          /* default 36px (sm 28, lg 44) */
--switch-track-height         /* default 20px (sm 16, lg 24) */
--switch-thumb-size           /* default 16px (sm 12, lg 20) */
--switch-thumb-inset          /* gap between thumb and track edge — 2px */
--switch-thumb-icon-scale     /* icon fill as fraction of thumb diameter — 0.6 */
--switch-hover-preview        /* hover nudge distance — 2px; set to 0 to disable */

/* Colour */
--switch-track-bg             /* off-state pill */
--switch-track-bg-checked     /* on-state pill (variant overrides this) */
--switch-thumb-bg
--switch-thumb-shadow
--switch-focus-ring           /* applied to track when input is :focus-visible */

/* Motion */
--switch-transition-duration  /* 160ms (collapsed to 1ms under prefers-reduced-motion) */
--switch-transition-ease`}
        />
      </section>

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Switch, SwitchGroup } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Switch, SwitchGroup } from '@swift/components/Switch'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Switch, SwitchGroup, type SwitchProps, type SwitchSize, type SwitchVariant, type SwitchApi, type SwitchGroupProps } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  description="Allow background sync."
  variant="success"
>
  Sync to cloud
</Switch>`}
        />
      </section>
    </div>
  )
}
