import { useState } from 'react'
import {
  Alert,
  type AlertAppearance,
  type AlertSize,
  type AlertVariant,
} from '@swift/components/Alert'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { Bookmark } from '@swift/icons/Bookmark'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { BrowserCompat, CodeBlock, PreviewRow, SectionHeader } from './shared'

const ALERT_KNOBS: ReadonlyArray<Knob> = [
  {
    type: 'select',
    name: 'variant',
    options: ['default', 'success', 'warning', 'error', 'info'],
    defaultValue: 'default',
  },
  {
    type: 'select',
    name: 'appearance',
    options: ['subtle', 'soft', 'solid', 'outline', 'left-accent'],
    defaultValue: 'subtle',
  },
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', name: 'dismissible' },
  { type: 'text', name: 'title', defaultValue: 'Payment received' },
  {
    type: 'text',
    name: 'children',
    defaultValue: 'Your booking is confirmed and the receipt is on its way.',
    asChildren: true,
  },
]

const DESCRIPTION =
  'Inline banner / notice for success, error, warning, info, and neutral system messages. Supports both a convenience API (variant + title + children + dismissible) and a fully compound API (`Alert.Icon`, `Alert.Title`, `Alert.Description`, `Alert.Actions`, `Alert.Close`) — picked automatically based on the children. Variant drives the default icon and ARIA role (`error` → `role="alert"`, others → `role="status"`); five appearances cover the common visual treatments (subtle, soft, solid, outline, left-accent); three sizes scale padding + gap + type. Dismiss runs through `usePresence` for a polished exit; reduced-motion collapses it to 1 ms.'

const VARIANTS: ReadonlyArray<AlertVariant> = [
  'default',
  'success',
  'warning',
  'error',
  'info',
]

const SIZES: ReadonlyArray<AlertSize> = ['sm', 'md', 'lg']

const APPEARANCES: ReadonlyArray<AlertAppearance> = [
  'subtle',
  'soft',
  'solid',
  'outline',
  'left-accent',
]

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const ALERT_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'variant',
    type: `'default' | 'success' | 'warning' | 'error' | 'info'`,
    defaultValue: `'default'`,
    description:
      'Semantic category. Drives the default icon and the ARIA role (`error` → `role="alert"` + assertive aria-live; others → `role="status"` + polite). Override via the `role` prop if you need to swap the default mapping.',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Scales padding (px-3/4/5, py-2/3/4), gap between slots, and the body type size.',
  },
  {
    name: 'appearance',
    type: `'subtle' | 'soft' | 'solid' | 'outline' | 'left-accent'`,
    defaultValue: `'subtle'`,
    description:
      'Surface treatment. `subtle` is the default (neutral surface, accent on icon). `soft` tints the bg per variant using `--color-surface-{variant}-muted` + faint accent border. `solid` drops a saturated `*-600` bg with white text. `outline` keeps the bg transparent and switches the border to the variant accent. `left-accent` keeps a neutral surface but adds a 4 px coloured stripe on the start edge.',
  },
  {
    name: 'open',
    type: 'boolean',
    description:
      'Controlled visibility. Pair with `onOpenChange` for full control. When omitted, Alert manages its own open state via `defaultOpen`.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Uncontrolled initial visibility. Ignored when `open` is provided.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description:
      'Fires when the alert is dismissed (close button clicked or `close()` called via the context). Both controlled and uncontrolled callers receive it — use it to persist dismissal, fire analytics, or coordinate with a parent.',
  },
  {
    name: 'dismissible',
    type: 'boolean',
    description:
      'Render the default close button. Auto-true when `open` or `onOpenChange` is supplied (you\'re clearly wiring the close path); explicitly true for uncontrolled alerts that should still be dismissable.',
  },
  {
    name: 'role',
    type: `'alert' | 'status'`,
    defaultValue: `derived from variant`,
    description:
      'Override the auto-derived ARIA role. By default, `error` → `alert`, everything else → `status`. Set explicitly if you want a non-error variant to be assertive (or vice versa).',
  },
  {
    name: 'title',
    type: 'ReactNode',
    description:
      'Convenience: title rendered above children in the default layout. Use `<Alert.Title>` inside compound children for finer control.',
  },
  {
    name: 'icon',
    type: 'ReactNode | null',
    description:
      'Override the variant-driven default icon. Pass any ReactNode to swap the glyph, or `null` to suppress the icon entirely.',
  },
  {
    name: 'actions',
    type: 'ReactNode',
    description:
      'Slot for action buttons rendered to the trailing edge of the alert. Use `<Alert.Actions>` directly for finer control.',
  },
  {
    name: 'classes',
    type: '{ root?, icon?, content?, title?, description?, actions?, close? }',
    description: 'Per-slot className overrides.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Either plain ReactNode (rendered as the description in the default layout) or compound parts (rendered as-is). Detection is automatic — if any direct child is an Alert.* part, the default layout is skipped.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLDivElement>',
    description: 'Forwarded to the root <div>. Useful for scrolling-to-error in form validation flows.',
  },
]

type PartBlock = {
  name: string
  summary: string
}

const ALERT_COMPOUND_PARTS: ReadonlyArray<PartBlock> = [
  {
    name: 'Alert.Icon',
    summary:
      'Variant-driven default glyph (CheckCircleFilled / CloseCircleFilled / ExclamationCircleFilled / InfoCircleFilled). Pass `children` to override; pass nothing for the auto default; pass `null` to suppress. `default` variant has no default glyph.',
  },
  {
    name: 'Alert.Content',
    summary:
      'Wraps Title + Description in a flex column so the body stretches between the icon and the trailing actions / close. Plain `<div>` underneath — forward any HTML attribute.',
  },
  {
    name: 'Alert.Title',
    summary:
      'Primary heading inside the alert. Auto-wires `id={context.titleId}` so the root sets `aria-labelledby` for you. Styled `<div>` (not a heading element by default — pass `role="heading"` + `aria-level` if you need it).',
  },
  {
    name: 'Alert.Description',
    summary:
      'Secondary body text. Auto-wires `id={context.descriptionId}` so the root sets `aria-describedby` for you.',
  },
  {
    name: 'Alert.Actions',
    summary:
      'Slot for action buttons. Renders trailing-edge with `margin-inline-start: auto` so it pushes to the end regardless of content length. Wrap Button instances inside.',
  },
  {
    name: 'Alert.Close',
    summary:
      'Dismiss button. Reads `close` + `dismissible` from context — renders nothing when the alert isn\'t dismissible so you can drop it unconditionally. Defaults to a ✕ glyph and `aria-label="Dismiss alert"`; override either.',
  },
]

export function AlertPanel() {
  // Controlled-visibility demo
  const [controlledOpen, setControlledOpen] = useState(true)
  // "Dismissed permanently" demo
  const [permanentDismissed, setPermanentDismissed] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Alert
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Alert"
          knobs={ALERT_KNOBS}
          render={(v) => (
            <Alert
              /* Remount when any knob changes so a dismissed alert
                 (uncontrolled defaultOpen) comes back on interaction. */
              key={JSON.stringify(v)}
              variant={v.variant as AlertVariant}
              appearance={v.appearance as AlertAppearance}
              size={v.size as AlertSize}
              dismissible={v.dismissible === true}
              title={String(v.title)}
            >
              {String(v.children)}
            </Alert>
          )}
        />
      </section>

      {/* ── Basic ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow
          code={`<Alert>Profile updated successfully.</Alert>
<Alert variant="error">Failed to save profile.</Alert>`}
        >
          <div className="flex w-full flex-col gap-3">
            <Alert>Profile updated successfully.</Alert>
            <Alert variant="error">Failed to save profile.</Alert>
          </div>
        </PreviewRow>
      </section>

      {/* ── Variants ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Variants</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Each variant ships a default icon and an ARIA role:{' '}
          <code>error</code> uses <code>role=&quot;alert&quot;</code> (assertive);
          the others use <code>role=&quot;status&quot;</code> (polite).
        </Text>
        <PreviewRow
          code={`<Alert variant="default">System message.</Alert>
<Alert variant="success">Profile updated.</Alert>
<Alert variant="warning">Subscription expires tomorrow.</Alert>
<Alert variant="error">Failed to save.</Alert>
<Alert variant="info">New version available.</Alert>`}
        >
          <div className="flex w-full flex-col gap-3">
            {VARIANTS.map((variant) => (
              <Alert key={variant} variant={variant}>
                {variant === 'default' && 'System message.'}
                {variant === 'success' && 'Profile updated successfully.'}
                {variant === 'warning' && 'Subscription expires tomorrow.'}
                {variant === 'error' && 'Failed to save profile.'}
                {variant === 'info' && 'New version available.'}
              </Alert>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Sizes ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Sizes</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>size</code> scales padding (px-3/4/5, py-2/3/4), gap between
          slots, and the body type. Use <code>sm</code> in dense table
          contexts, <code>lg</code> for above-the-fold page banners.
        </Text>
        <PreviewRow
          code={`<Alert size="sm">Compact alert.</Alert>
<Alert size="md">Default alert.</Alert>
<Alert size="lg">Roomy alert.</Alert>`}
        >
          <div className="flex w-full flex-col gap-3">
            {SIZES.map((size) => (
              <Alert key={size} size={size} variant="info" title={`Size · ${size}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Alert>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Appearances ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Appearances</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Five surface treatments. <code>subtle</code> (default) is neutral.{' '}
          <code>soft</code> tints the bg per variant. <code>solid</code> drops
          a saturated bg with white text. <code>outline</code> keeps the bg
          transparent with a coloured border. <code>left-accent</code> keeps
          a neutral surface but adds a coloured stripe on the start edge.
        </Text>
        <PreviewRow
          code={`<Alert variant="success" appearance="soft">Profile updated.</Alert>
<Alert variant="error" appearance="solid">Failed to save.</Alert>
<Alert variant="warning" appearance="outline">Action required.</Alert>
<Alert variant="info" appearance="left-accent">New version available.</Alert>`}
        >
          <div className="flex w-full flex-col gap-6">
            {APPEARANCES.map((appearance) => (
              <div key={appearance} className="flex flex-col gap-2">
                <Text
                  variant="body-xs"
                  fontWeight="semibold"
                  color="muted"
                  className="tracking-wide uppercase"
                >
                  {appearance}
                </Text>
                <div className="flex flex-col gap-2">
                  {VARIANTS.map((variant) => (
                    <Alert
                      key={`${appearance}-${variant}`}
                      variant={variant}
                      appearance={appearance}
                    >
                      {`${appearance} · ${variant} — Lorem ipsum dolor sit amet.`}
                    </Alert>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Title + description ───────────────────────────────────── */}
      <section>
        <SectionHeader>Title + description</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Pass <code>title</code> for a heading; the children become the
          description. The root automatically sets{' '}
          <code>aria-labelledby</code> + <code>aria-describedby</code> on the
          title and description ids.
        </Text>
        <PreviewRow
          code={`<Alert variant="error" title="Payment failed">
  Please verify your card details and try again.
</Alert>`}
        >
          <div className="flex w-full flex-col gap-3">
            <Alert variant="error" title="Payment failed">
              Please verify your card details and try again.
            </Alert>
            <Alert variant="warning" appearance="soft" title="Subscription expiring">
              Your plan renews in 3 days. Update your payment method to avoid interruption.
            </Alert>
          </div>
        </PreviewRow>
      </section>

      {/* ── Custom icon · or none ─────────────────────────────────── */}
      <section>
        <SectionHeader>Custom icon · or none</SectionHeader>
        <PreviewRow
          code={`<Alert variant="success" icon={<Bookmark size={18} />}>
  Bookmarked to your reading list.
</Alert>

<Alert variant="info" icon={null}>
  No leading icon, just a message.
</Alert>`}
        >
          <div className="flex w-full flex-col gap-3">
            <Alert variant="success" icon={<Bookmark size={18} />} title="Bookmarked">
              Saved to your reading list.
            </Alert>
            <Alert variant="info" icon={null}>
              No leading icon, just a message.
            </Alert>
          </div>
        </PreviewRow>
      </section>

      {/* ── Action area ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Action area</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Pass <code>actions</code> with any ReactNode (typically{' '}
          <code>{'<Button>'}</code>s) — they render on the trailing edge,
          pushed there with <code>margin-inline-start: auto</code>.
        </Text>
        <PreviewRow
          code={`<Alert
  variant="info"
  title="Update available"
  actions={<Button size="sm">Update</Button>}
>
  A new version of the app is ready.
</Alert>`}
        >
          <div className="flex w-full flex-col gap-3">
            <Alert
              variant="info"
              title="Update available"
              actions={<Button size="sm">Update</Button>}
            >
              A new version of the app is ready.
            </Alert>
            <Alert
              variant="warning"
              appearance="soft"
              title="Storage almost full"
              actions={
                <>
                  <Button size="sm" variant="ghost">
                    Dismiss
                  </Button>
                  <Button size="sm">Upgrade</Button>
                </>
              }
            >
              You&apos;re using 95% of your plan&apos;s storage.
            </Alert>
          </div>
        </PreviewRow>
      </section>

      {/* ── Dismissible ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Dismissible · uncontrolled</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Set <code>dismissible</code> to render the default close button.
          Alert manages its own open state; the exit animation runs via{' '}
          <code>usePresence</code> and then the component unmounts.
        </Text>
        <PreviewRow
          code={`<Alert variant="success" dismissible title="Saved">
  Your changes are live.
</Alert>`}
        >
          <div className="flex w-full flex-col gap-3">
            <Alert variant="success" dismissible title="Saved">
              Your changes are live.
            </Alert>
            <Alert variant="info" appearance="left-accent" dismissible>
              Scheduled maintenance tonight from 02:00 to 04:00 UTC.
            </Alert>
          </div>
        </PreviewRow>
      </section>

      {/* ── Controlled visibility ─────────────────────────────────── */}
      <section>
        <SectionHeader>Controlled visibility</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Drive <code>open</code> + <code>onOpenChange</code> from your
          component state. Useful for validation summaries, form errors, or
          alerts that should reappear on conditions you control.
        </Text>
        <PreviewRow
          code={`const [open, setOpen] = useState(true)

<Alert
  variant="error"
  open={open}
  onOpenChange={setOpen}
  title="Network error"
>
  Failed to reach the server. Retrying…
</Alert>

<button onClick={() => setOpen(true)}>Show again</button>`}
        >
          <div className="flex w-full flex-col gap-3">
            <Alert
              variant="error"
              open={controlledOpen}
              onOpenChange={setControlledOpen}
              title="Network error"
            >
              Failed to reach the server. Retrying…
            </Alert>
            {!controlledOpen ? (
              <Button size="sm" variant="outline" onClick={() => setControlledOpen(true)}>
                Show alert again
              </Button>
            ) : null}
          </div>
        </PreviewRow>
      </section>

      {/* ── Compound usage ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound usage · finer control</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          When any direct child is a recognised compound part, the default
          layout is skipped and the children render as-is. Reach for this
          when the convenience props don&apos;t express what you need —
          custom Content ordering, an icon in a non-default position, or
          mixed media inside the description.
        </Text>
        <PreviewRow
          code={`<Alert variant="error" dismissible>
  <Alert.Icon />
  <Alert.Content>
    <Alert.Title>Deployment failed</Alert.Title>
    <Alert.Description>
      Step 3 of 7 exited with code 127.{' '}
      <a href="#" className="text-content-brand underline">View log</a>
    </Alert.Description>
  </Alert.Content>
  <Alert.Actions>
    <Button size="sm" variant="ghost">Cancel</Button>
    <Button size="sm">Retry</Button>
  </Alert.Actions>
  <Alert.Close />
</Alert>`}
        >
          <Alert variant="error" dismissible>
            <Alert.Icon />
            <Alert.Content>
              <Alert.Title>Deployment failed</Alert.Title>
              <Alert.Description>
                Step 3 of 7 exited with code 127.{' '}
                <a
                  href="#"
                  className="text-content-brand underline"
                  onClick={(e) => e.preventDefault()}
                >
                  View log
                </a>
              </Alert.Description>
            </Alert.Content>
            <Alert.Actions>
              <Button size="sm" variant="ghost">
                Cancel
              </Button>
              <Button size="sm">Retry</Button>
            </Alert.Actions>
            <Alert.Close />
          </Alert>
        </PreviewRow>
      </section>

      {/* ── Rich content ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Rich content · validation summary</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          ReactNode children flow naturally into the Description slot. Drop
          in a list, links, or any inline JSX — the alert handles wrapping
          and the a11y wiring stays clean.
        </Text>
        <PreviewRow
          code={`<Alert variant="error" title="Please fix the following errors">
  <ul className="ml-4 list-disc">
    <li>Email is required</li>
    <li>Password must be at least 8 characters</li>
    <li>Date of birth is required</li>
  </ul>
</Alert>`}
        >
          <Alert variant="error" title="Please fix the following errors">
            <ul className="ml-4 list-disc">
              <li>Email is required</li>
              <li>Password must be at least 8 characters</li>
              <li>Date of birth is required</li>
            </ul>
          </Alert>
        </PreviewRow>
      </section>

      {/* ── Persistent dismissal ──────────────────────────────────── */}
      <section>
        <SectionHeader>Persisting dismissal</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Alert doesn&apos;t persist dismissal automatically. Use{' '}
          <code>onOpenChange</code> to write a flag to localStorage / your
          backend, and gate rendering on that flag. This demo uses local
          component state — flip it back on by reloading the page or
          clicking &quot;Reset&quot;.
        </Text>
        <PreviewRow
          code={`const [dismissed, setDismissed] = useState(() =>
  localStorage.getItem('seen-banner') === 'true',
)

return !dismissed ? (
  <Alert
    variant="info"
    appearance="left-accent"
    dismissible
    onOpenChange={(o) => {
      if (!o) {
        localStorage.setItem('seen-banner', 'true')
        setDismissed(true)
      }
    }}
  >
    New onboarding flow is live — try it from Settings.
  </Alert>
) : null`}
        >
          <div className="flex w-full flex-col gap-3">
            {!permanentDismissed ? (
              <Alert
                variant="info"
                appearance="left-accent"
                dismissible
                onOpenChange={(o) => !o && setPermanentDismissed(true)}
              >
                New onboarding flow is live — try it from Settings.
              </Alert>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setPermanentDismissed(false)}>
                Reset
              </Button>
            )}
          </div>
        </PreviewRow>
      </section>

      {/* ── Accessibility ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Role + aria-live.</strong>{' '}
            <code>error</code> alerts use <code>role=&quot;alert&quot;</code> +{' '}
            <code>aria-live=&quot;assertive&quot;</code> so they interrupt the
            screen reader. <code>default</code> / <code>success</code> /{' '}
            <code>info</code> / <code>warning</code> use{' '}
            <code>role=&quot;status&quot;</code> +{' '}
            <code>aria-live=&quot;polite&quot;</code>. Override either via
            the <code>role</code> prop.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Labelled regions.</strong>{' '}
            <code>Alert.Title</code> auto-wires{' '}
            <code>id={'{titleId}'}</code> and the root sets{' '}
            <code>aria-labelledby</code>. Same for{' '}
            <code>Alert.Description</code> +{' '}
            <code>aria-describedby</code>. No manual id wiring needed.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Close button.</strong>{' '}
            Native <code>{'<button>'}</code> with a default{' '}
            <code>aria-label=&quot;Dismiss alert&quot;</code>. Renders only
            when the alert is dismissible (controlled or via the{' '}
            <code>dismissible</code> prop) so dropping{' '}
            <code>{'<Alert.Close />'}</code> unconditionally in compound
            usage stays safe.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong>{' '}
            <code>Alert.Actions</code> and <code>Alert.Close</code> are
            native buttons — Space / Enter activate them and they
            participate in the regular tab order.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion.</strong>{' '}
            <code>prefers-reduced-motion: reduce</code> collapses enter /
            exit animations to 1 ms (kept non-zero so the JS-side{' '}
            <code>animationend</code> handler still finalises the unmount
            cleanly).
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">SSR.</strong>{' '}
            No <code>document</code> / <code>window</code> reads during
            render. Hydration-safe.
          </Text>
        </div>
      </section>

      {/* ── Props · Alert ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Props · Alert</SectionHeader>
        <PropsTable rows={ALERT_PROPS} />
      </section>

      {/* ── Compound parts ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          The convenience layout composes these automatically based on{' '}
          <code>title</code> / <code>icon</code> / <code>actions</code> /{' '}
          children / <code>dismissible</code>. Each is also exported so
          consumers can drop into compound mode anytime.
        </Text>
        <div className="grid gap-3">
          {ALERT_COMPOUND_PARTS.map(({ name, summary }) => (
            <div
              key={name}
              className="rounded-xl border border-stroke bg-surface-elevated px-6 py-4"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="bold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary" className="mt-1 block">
                {summary}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Theme tokens ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Theme tokens · reference</SectionHeader>
        <CodeBlock
          code={`/* Defaults set on .swift-alert and overridable per-instance via
   inline style, or globally via a higher-level selector. */

/* Geometry */
--alert-radius             /* default 0.625rem */

/* Per-variant accent — auto-set by [data-variant] selectors */
--alert-accent             /* drives icon colour, left-accent stripe,
                              soft-appearance border, action button text */

/* Motion */
--alert-duration           /* enter animation duration — default 220ms */
--alert-exit-duration      /* exit animation duration — default 180ms */
--alert-ease               /* enter easing — default cubic-bezier(0.22, 1, 0.36, 1) */
                           /* exit uses ease-in cubic-bezier(0.4, 0, 0.6, 1) — snappier off */`}
        />
      </section>

      {/* ── Browser compatibility ─────────────────────────────────── */}
      <section>
        <SectionHeader>Browser compatibility</SectionHeader>
        <BrowserCompat
          features={[
            {
              name: 'CSS logical properties (border-inline-start, margin-inline-start)',
              notes:
                "The left-accent stripe and the trailing actions auto-flip under `dir=\"rtl\"`.",
              support: 'Chrome 87+ · Safari 14.1+ · Firefox 66+',
            },
            {
              name: 'color-mix()',
              notes:
                'Used for the soft-appearance border tint (accent at 25% alpha).',
              support: 'Chrome 111+ · Safari 16.2+ · Firefox 113+',
            },
            {
              name: 'CSS animation + animationend',
              notes:
                'Enter / exit driven by keyframes; `usePresence` listens for `animationend` to finalise the unmount.',
              support: 'Universal',
            },
            {
              name: 'prefers-reduced-motion',
              notes:
                'Collapses enter / exit to 1 ms (kept non-zero so the unmount path stays unified).',
              support: 'Universal',
            },
          ]}
          caveats={[
            'Alert doesn\'t persist dismissal automatically. Use `onOpenChange` to write to localStorage / your backend, then gate rendering on the flag.',
            'The compound-children detection compares `child.type` against the exported parts. Re-exporting parts from your own module is fine (same reference); rebuilding them is not.',
          ]}
        />
      </section>

      {/* ── Import ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Alert } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Alert } from '@swift/components/Alert'`}
          />
          <CopyableImport
            label="With types"
            code={`import {
  Alert,
  type AlertProps,
  type AlertVariant,
  type AlertSize,
  type AlertAppearance,
} from '@swift/components/Alert'`}
          />
        </div>
      </section>

      {/* ── Usage ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`// Convenience — most common case.
<Alert variant="success" title="Saved" dismissible>
  Your changes are live.
</Alert>

// With actions and a left-accent stripe — banner pattern.
<Alert
  variant="info"
  appearance="left-accent"
  title="Update available"
  actions={<Button size="sm">Update</Button>}
  dismissible
>
  A new version of the app is ready.
</Alert>

// Compound — full control over layout.
<Alert variant="error" open={open} onOpenChange={setOpen}>
  <Alert.Icon />
  <Alert.Content>
    <Alert.Title>Payment failed</Alert.Title>
    <Alert.Description>Please try another card.</Alert.Description>
  </Alert.Content>
  <Alert.Actions>
    <Button size="sm">Retry</Button>
  </Alert.Actions>
  <Alert.Close />
</Alert>`}
        />
      </section>
    </div>
  )
}

function PropsTable({ rows }: { rows: ReadonlyArray<PropRow> }) {
  return (
    <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
      <div className="hidden grid-cols-[200px_1fr_140px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
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
      {rows.map(({ name, type, defaultValue, description }) => (
        <div
          key={name}
          className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_140px] md:items-start md:gap-6"
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
  )
}
