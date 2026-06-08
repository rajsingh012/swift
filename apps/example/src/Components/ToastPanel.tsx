import { useRef } from 'react'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import {
  toast,
  type ToastAppearance,
  type ToastPosition,
  type ToastType,
} from '@swift/components/Toast'
import { Bookmark } from '@swift/icons/Bookmark'
import { CopyableImport } from '../lib/CopyableImport'
import { BrowserCompat, CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Notification system with a singleton store + portal viewport + imperative `toast()` API. Fire from anywhere — render-time, effects, router loaders, fetch error handlers — without wiring state into the component tree. FIFO stacking with hover-to-expand (oldest at the front, newer cards recede behind with scale-down + opacity dim, expand to clearly separated cards on pointer hover), pause-on-hover/focus, six positions with RTL-aware insets, prefers-reduced-motion fallback, type-driven a11y roles (status / alert), and SSR-safe portal mount. The visual layer (icon + title + description + action + close + per-variant accent + per-appearance surface) is a nested `<Alert>`, so the appearance vocabulary is identical to the Alert component.'

const POSITIONS: ReadonlyArray<ToastPosition> = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

const TYPES_FOR_DEMO: ReadonlyArray<ToastType> = [
  'default',
  'success',
  'error',
  'warning',
  'info',
]

const APPEARANCES_FOR_DEMO: ReadonlyArray<ToastAppearance> = ['soft', 'solid']

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const TOAST_OPTIONS: ReadonlyArray<PropRow> = [
  {
    name: 'id',
    type: 'string',
    description:
      'Stable id. Used as the React key + dismiss target. Auto-generated when omitted. Passing the same id twice replaces the existing toast in place rather than appending — useful for status workflows ("uploading…" → "uploaded").',
  },
  {
    name: 'type',
    type: `'default' | 'success' | 'error' | 'warning' | 'info'`,
    defaultValue: `'default'`,
    description:
      'Visual + a11y category. Drives the default icon and the role (`status` for default/success/info/warning, `alert` for error). Equivalent to calling the corresponding `toast.success(...)` / `toast.error(...)` shortcut.',
  },
  {
    name: 'appearance',
    type: `'subtle' | 'soft' | 'solid' | 'unstyled'`,
    defaultValue: `'subtle'` + " (or the provider's setting)",
    description:
      'Surface treatment. `subtle` (default): neutral surface, accent only on the icon. `soft`: tinted bg per type using `--color-surface-{type}-muted` + faint accent border. `solid`: saturated bg per type (raw `*-600` shades) with white text + icon — best for must-acknowledge notifications. `unstyled`: strips every cosmetic default (bg, border, padding, shadow, colour) so you can drop in your own surface via `className` while keeping the stacking, animations, and a11y.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    description:
      'Primary line. When called as `toast(message)`, the first arg is used as the title unless this option is set explicitly. Accepts any ReactNode — JSX, fragments, custom components.',
  },
  {
    name: 'description',
    type: 'ReactNode',
    description: 'Secondary line rendered below the title. Accepts any ReactNode.',
  },
  {
    name: 'action',
    type: '{ label: ReactNode; onClick: (event) => void }',
    description:
      'Single inline action button. Clicking fires the handler then dismisses the toast — call `event.preventDefault()` in your handler to keep it open.',
  },
  {
    name: 'duration',
    type: 'number',
    defaultValue: '5000',
    description:
      'Milliseconds before auto-dismiss. Pause-on-hover / pause-on-focus are automatic. Pass `Infinity` for a persistent toast that must be dismissed manually.',
  },
  {
    name: 'position',
    type: `ToastPosition`,
    description:
      "Position override for this single toast. Defaults to the provider's `position`. Uses logical insets internally (start/end) so `top-left` renders on the right edge in RTL automatically.",
  },
  {
    name: 'icon',
    type: 'ReactNode | null',
    description:
      'Override the type-driven default icon. Pass any ReactNode to swap the glyph, or `null` to suppress the icon entirely.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra class appended to the toast root <li>.',
  },
]

const PROVIDER_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'position',
    type: 'ToastPosition',
    defaultValue: `'bottom-right'`,
    description:
      'Default position for every toast. Per-toast `position` overrides this.',
  },
  {
    name: 'appearance',
    type: `'subtle' | 'soft' | 'solid' | 'unstyled'`,
    defaultValue: `'subtle'`,
    description:
      'App-wide default appearance. Per-toast `appearance` still overrides this — useful for setting a uniform tinted or solid look while keeping individual toasts free to opt out (e.g. `subtle` default app-wide but `solid` for error toasts).',
  },
  {
    name: 'duration',
    type: 'number',
    defaultValue: '5000',
    description:
      'Default auto-dismiss duration in ms. Per-toast `duration` overrides this.',
  },
  {
    name: 'maxVisible',
    type: 'number',
    defaultValue: '3',
    description:
      'Cap on visible toasts per position. Additional toasts wait in a FIFO queue and mount automatically as visible ones dismiss — their auto-dismiss timer doesn\'t start until they become visible.',
  },
  {
    name: 'renderViewport',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Render the default `<ToastViewport>` alongside the children. Set to false when you want to place the viewport manually (e.g. inside a specific layout container, or to drive multiple positions independently).',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Your app tree.',
  },
]

const VIEWPORT_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'position',
    type: 'ToastPosition',
    description:
      'Render only the toasts at this position. When omitted, one viewport per position is rendered (the default behaviour inside <ToastProvider>).',
  },
  {
    name: 'container',
    type: 'HTMLElement',
    defaultValue: 'document.body',
    description:
      'Portal target. Useful when nesting the viewport into a specific shadow root or scrollable container.',
  },
  {
    name: 'wrapperClassName',
    type: 'string',
    description: 'Class applied to the portal wrapper div that holds every per-position <ol>.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Class applied to the per-position <ol> element.',
  },
  {
    name: 'style',
    type: 'CSSProperties',
    description:
      'Inline style on the per-position <ol>. Use this to override CSS custom properties like `--toast-max-width`, `--toast-gap`, `--toast-duration`.',
  },
]

/* Toast no longer ships its own compound parts — the visual layer is a
 * nested `<Alert>`, so consumers wanting custom toast rendering should
 * reach for `Alert.Title` / `Alert.Description` / `Alert.Actions` /
 * `Alert.Close` / `Alert.Icon` from `@swift/components/Alert` directly
 * (or via `ToastRoot` with a custom `children` override). */

export function ToastPanel() {
  // Used by the "update by id" demo so the loading → success transition
  // reuses the same toast id rather than appending a second card.
  const updateIdRef = useRef<string | null>(null)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Toast
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Basic ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow
          code={`toast('Saved')
toast.success('Profile updated')
toast.error('Payment failed')`}
        >
          <Button size="sm" variant="ghost" onClick={() => toast('Saved')}>
            toast()
          </Button>
          <Button size="sm" onClick={() => toast.success('Profile updated')}>
            toast.success()
          </Button>
          <Button size="sm" variant="danger" onClick={() => toast.error('Payment failed')}>
            toast.error()
          </Button>
        </PreviewRow>
      </section>

      {/* ── Variants ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Variants</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Each variant ships its own default icon and accent colour. <code>error</code>{' '}
          uses <code>role=&quot;alert&quot;</code> (assertive aria-live); the others use{' '}
          <code>role=&quot;status&quot;</code> (polite).
        </Text>
        <PreviewRow
          code={`toast('Saved')
toast.success('Profile updated')
toast.error('Payment failed')
toast.warning('Storage almost full')
toast.info('New version available')`}
        >
          <Button size="sm" variant="ghost" onClick={() => toast('Saved')}>
            Default
          </Button>
          <Button size="sm" onClick={() => toast.success('Profile updated')}>
            Success
          </Button>
          <Button size="sm" variant="danger" onClick={() => toast.error('Payment failed')}>
            Error
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast.warning('Storage almost full')}>
            Warning
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info('New version available')}>
            Info
          </Button>
        </PreviewRow>
      </section>

      {/* ── Appearance · soft + solid ─────────────────────────────── */}
      <section>
        <SectionHeader>Appearance · subtle · soft · solid</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Three surface treatments out of the box.{' '}
          <code>subtle</code> (default) uses the neutral surface and shows the
          type only on the icon. <code>soft</code> tints the bg using the
          design system&apos;s <code>--color-surface-{`{type}`}-muted</code>{' '}
          tokens (light + dark variants built in) plus a faint accent border.{' '}
          <code>solid</code> drops a saturated <code>*-600</code> shade as the
          bg with white text + icon — heavier weight, ideal for
          must-acknowledge notifications. Set via per-toast option or as a
          provider default.
        </Text>
        <PreviewRow
          code={`// Per-toast override
toast.success('Profile updated', { appearance: 'soft' })
toast.error('Payment failed', { appearance: 'solid' })

// Provider-wide default
<ToastProvider appearance="soft">{children}</ToastProvider>`}
        >
          <div className="flex w-full flex-col gap-3">
            {APPEARANCES_FOR_DEMO.map((appearance) => (
              <div key={appearance} className="flex flex-col gap-2">
                <Text
                  variant="body-xs"
                  fontWeight="semibold"
                  color="muted"
                  className="tracking-wide uppercase"
                >
                  {appearance}
                </Text>
                <div className="flex flex-wrap gap-2">
                  {TYPES_FOR_DEMO.map((type) => {
                    const label = type[0].toUpperCase() + type.slice(1)
                    const message =
                      type === 'success'
                        ? 'Profile updated'
                        : type === 'error'
                          ? 'Payment failed'
                          : type === 'warning'
                            ? 'Storage almost full'
                            : type === 'info'
                              ? 'New version available'
                              : 'Saved'
                    return (
                      <Button
                        key={`${appearance}-${type}`}
                        size="sm"
                        variant={
                          type === 'error'
                            ? 'danger'
                            : type === 'warning'
                              ? 'secondary'
                              : type === 'info'
                                ? 'outline'
                                : type === 'success'
                                  ? 'primary'
                                  : 'ghost'
                        }
                        onClick={() =>
                          toast(message, {
                            type,
                            appearance,
                            description: `appearance: ${appearance} · type: ${type}`,
                          })
                        }
                      >
                        {label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Appearance · unstyled ─────────────────────────────────── */}
      <section>
        <SectionHeader>Appearance · unstyled (bring your own skin)</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>unstyled</code> strips every cosmetic default — bg, border,
          padding, shadow, text colour, border-radius — and keeps the
          positioning, animations, and a11y wiring intact. Drop in your own
          surface via <code>className</code> without re-implementing the
          stacking or the timer. The default flex layout for the icon + body
          + close composition is preserved, so you can lean on it or override
          it with your own display rule.
        </Text>
        <PreviewRow
          code={`toast.success('Custom-skinned toast', {
  appearance: 'unstyled',
  className:
    'rounded-2xl bg-gradient-to-br from-content-brand to-content-success ' +
    'p-4 text-white shadow-level3',
})`}
        >
          <Button
            size="sm"
            onClick={() =>
              toast.success('Custom-skinned toast', {
                appearance: 'unstyled',
                description: 'Gradient bg · white text · custom radius + shadow.',
                className:
                  'rounded-2xl bg-gradient-to-br from-content-brand to-content-success p-4 text-white shadow-level3',
              })
            }
          >
            Gradient toast
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast('Pill-shaped toast', {
                appearance: 'unstyled',
                description: 'Borderless · neutral surface · rounded-full.',
                className:
                  'rounded-full bg-surface-inverse px-5 py-2 text-content-inverse shadow-level2',
              })
            }
          >
            Pill toast
          </Button>
        </PreviewRow>
      </section>

      {/* ── Positions ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Positions · 6 corners, RTL-aware</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Per-toast <code>position</code> overrides the provider default. Internally
          the viewport uses logical insets (<code>start</code> / <code>end</code>),
          so left/right positions auto-flip under <code>dir=&quot;rtl&quot;</code>.
        </Text>
        <PreviewRow
          code={`toast.info('Position: top-right', { position: 'top-right' })`}
        >
          {POSITIONS.map((pos) => (
            <Button
              key={pos}
              size="sm"
              variant="outline"
              onClick={() =>
                toast.info(`Position: ${pos}`, {
                  description: 'Fired from the position button row.',
                  position: pos,
                })
              }
            >
              {pos}
            </Button>
          ))}
        </PreviewRow>
      </section>

      {/* ── Description + action ──────────────────────────────────── */}
      <section>
        <SectionHeader>Description + action</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          The action button dismisses the toast after running your handler. Call{' '}
          <code>event.preventDefault()</code> inside <code>onClick</code> to keep it open.
        </Text>
        <PreviewRow
          code={`toast.success('File uploaded', {
  description: 'shared-photos.zip · 24.6 MB',
  action: {
    label: 'Undo',
    onClick: () => toast('Undone'),
  },
})`}
        >
          <Button
            size="sm"
            onClick={() =>
              toast.success('File uploaded', {
                description: 'shared-photos.zip · 24.6 MB',
                action: { label: 'Undo', onClick: () => toast('Undone') },
              })
            }
          >
            Fire with action
          </Button>
        </PreviewRow>
      </section>

      {/* ── Persistent ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Persistent · duration: Infinity</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Disables the auto-dismiss timer entirely. Useful for actions that demand
          a user response, or for long-running operations whose final state arrives
          asynchronously.
        </Text>
        <PreviewRow
          code={`toast.warning('Persistent — dismiss manually', {
  description: 'duration: Infinity',
  duration: Infinity,
})`}
        >
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toast.warning('Persistent — dismiss manually', {
                description: 'duration: Infinity',
                duration: Infinity,
              })
            }
          >
            Fire persistent
          </Button>
        </PreviewRow>
      </section>

      {/* ── Stacking + queue ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Stacking + queue · hover to expand</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Up to <code>maxVisible</code> (default 3) toasts render per position.
          When more arrive, they wait in a FIFO queue and mount as earlier ones
          dismiss. The visible stack collapses with the oldest at the front and
          newer cards receding behind (scale-down + opacity dim); hovering any
          card expands the stack into <code>12&nbsp;px</code>-separated cards
          smoothly.
        </Text>
        <PreviewRow
          code={`toast.info('Queued #1')
toast.success('Queued #2')
toast.warning('Queued #3')
toast.error('Queued #4 — waits in queue')
toast('Queued #5 — waits in queue')`}
        >
          <Button
            size="sm"
            onClick={() => {
              toast.info('Queued #1')
              toast.success('Queued #2')
              toast.warning('Queued #3')
              toast.error('Queued #4 — waits in queue')
              toast('Queued #5 — waits in queue')
            }}
          >
            Fire 5 (3 visible, 2 queued)
          </Button>
          <Button size="sm" variant="ghost" onClick={() => toast.dismiss()}>
            Dismiss all
          </Button>
        </PreviewRow>
      </section>

      {/* ── Update by id ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Update by id · status workflow</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Passing the same <code>id</code> twice replaces the existing toast in
          place rather than appending a duplicate. The pattern below shows a
          persistent &quot;Saving…&quot; toast that morphs into a &quot;Saved&quot;
          success after the async work resolves.
        </Text>
        <PreviewRow
          code={`const id = toast('Saving…', {
  id: 'save',
  description: 'Sending changes to the server.',
  duration: Infinity,
})

// later, when the request resolves
toast.success('Saved', {
  id: 'save',
  description: 'Changes synced.',
  duration: 3000,
})`}
        >
          <Button
            size="sm"
            onClick={() => {
              updateIdRef.current = toast('Saving…', {
                id: 'save-workflow',
                description: 'Sending changes to the server.',
                duration: Infinity,
              })
              window.setTimeout(() => {
                toast.success('Saved', {
                  id: 'save-workflow',
                  description: 'Changes synced.',
                  duration: 3000,
                })
              }, 1500)
            }}
          >
            Start save workflow
          </Button>
        </PreviewRow>
      </section>

      {/* ── Custom icon · or none ─────────────────────────────────── */}
      <section>
        <SectionHeader>Custom icon · or none</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          The <code>icon</code> option overrides the type-driven default. Pass any
          ReactNode to swap the glyph, or <code>null</code> to suppress the icon
          slot entirely.
        </Text>
        <PreviewRow
          code={`toast.success('Bookmarked', {
  icon: <Bookmark size={18} />,
})

toast('No icon, just a message', { icon: null })`}
        >
          <Button
            size="sm"
            onClick={() =>
              toast.success('Bookmarked', {
                icon: <Bookmark size={18} />,
                description: 'Saved to your reading list.',
              })
            }
          >
            Custom icon
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toast('No icon, just a message', { icon: null })}
          >
            Suppress icon
          </Button>
        </PreviewRow>
      </section>

      {/* ── Rich content ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Rich content · ReactNode in title / description</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>title</code> and <code>description</code> accept any ReactNode, so
          inline JSX, links, and styled fragments work without dropping into the
          compound API.
        </Text>
        <PreviewRow
          code={`toast.info(
  <span>
    New <strong>v3.2.0</strong> released
  </span>,
  {
    description: (
      <span>
        See the <a href="#" className="text-content-brand underline">changelog</a> for what shipped.
      </span>
    ),
  },
)`}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              toast.info(
                <span>
                  New <strong>v3.2.0</strong> released
                </span>,
                {
                  description: (
                    <span>
                      See the{' '}
                      <a href="#" className="text-content-brand underline" onClick={(e) => e.preventDefault()}>
                        changelog
                      </a>{' '}
                      for what shipped.
                    </span>
                  ),
                },
              )
            }
          >
            Fire rich-content toast
          </Button>
        </PreviewRow>
      </section>

      {/* ── Dismiss ───────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Dismiss programmatically</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>toast()</code> returns the id; pass it to <code>toast.dismiss(id)</code>{' '}
          to dismiss a specific toast, or call <code>toast.dismiss()</code> with
          no argument to dismiss everything. The exit animation plays cleanly in
          both cases (the store flags the item <code>exiting</code> first, then
          finalises after the transition).
        </Text>
        <PreviewRow
          code={`const id = toast('Will self-dismiss in 1.5s', { duration: Infinity })
window.setTimeout(() => toast.dismiss(id), 1500)

// or, clear everything
toast.dismiss()`}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const id = toast('Will self-dismiss in 1.5s', { duration: Infinity })
              window.setTimeout(() => toast.dismiss(id), 1500)
            }}
          >
            dismiss(id) after 1.5s
          </Button>
          <Button size="sm" variant="ghost" onClick={() => toast.dismiss()}>
            dismiss() — clear all
          </Button>
        </PreviewRow>
      </section>

      {/* ── Pause on hover ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Pause on hover · focus</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Built-in. Pointer-enter pauses the auto-dismiss timer; pointer-leave
          resumes from the remaining duration. Focus-in (e.g. tabbing into the
          action button) pauses too, so keyboard users get the same affordance as
          pointer users.
        </Text>
        <PreviewRow
          code={`toast.success('Hover the toast — the timer pauses while your cursor is over it.', {
  duration: 8000,
})`}
        >
          <Button
            size="sm"
            onClick={() =>
              toast.success(
                'Hover the toast — the timer pauses while your cursor is over it.',
                { duration: 8000 },
              )
            }
          >
            Fire 8s toast — try hovering
          </Button>
        </PreviewRow>
      </section>

      {/* ── Accessibility ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Role + aria-live.</strong>{' '}
            <code>error</code> toasts use <code>role=&quot;alert&quot;</code> +{' '}
            <code>aria-live=&quot;assertive&quot;</code> so they interrupt the
            screen reader. <code>default</code> / <code>success</code> /{' '}
            <code>info</code> / <code>warning</code> use{' '}
            <code>role=&quot;status&quot;</code> +{' '}
            <code>aria-live=&quot;polite&quot;</code> so they wait for the
            current utterance to finish. <code>aria-atomic=&quot;true&quot;</code>{' '}
            announces the whole toast as one chunk.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Pause on focus.</strong>{' '}
            Tabbing into the toast (e.g. to reach the action or close button)
            pauses the auto-dismiss timer, so keyboard users always get enough
            time to act. Resuming on blur uses the remaining duration, not a
            full reset.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong>{' '}
            <code>Toast.Action</code> and <code>Toast.Close</code> are native{' '}
            <code>&lt;button&gt;</code> elements — Space / Enter activate them
            and they participate in the regular tab order.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion.</strong>{' '}
            <code>prefers-reduced-motion: reduce</code> collapses every
            transition to 1 ms (kept non-zero so the JS-side{' '}
            <code>transitionend</code> handler still finalises the dismiss
            cleanly).
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Region label.</strong>{' '}
            Each per-position <code>&lt;ol&gt;</code> exposes{' '}
            <code>aria-label=&quot;Notifications (position)&quot;</code> so
            assistive tech can name the region.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">SSR.</strong>{' '}
            The portal mounts in an effect, so the server-rendered HTML stays
            empty and hydration matches. Nothing on the toast path reads{' '}
            <code>document</code> or <code>window</code> during render.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Pointer + hit area.</strong>{' '}
            The portal wrapper is <code>pointer-events: none</code> so
            underlying UI stays clickable; each toast restores{' '}
            <code>pointer-events: auto</code> on itself. A hidden{' '}
            <code>::after</code> bridge fills the gap between expanded cards
            so moving the cursor across the gap keeps the stack expanded.
          </Text>
        </div>
      </section>

      {/* ── Props · toast() options ───────────────────────────────── */}
      <section>
        <SectionHeader>Props · toast() options</SectionHeader>
        <PropsTable rows={TOAST_OPTIONS} />
      </section>

      {/* ── Props · ToastProvider ─────────────────────────────────── */}
      <section>
        <SectionHeader>Props · ToastProvider</SectionHeader>
        <PropsTable rows={PROVIDER_PROPS} />
      </section>

      {/* ── Props · ToastViewport ─────────────────────────────────── */}
      <section>
        <SectionHeader>Props · ToastViewport</SectionHeader>
        <PropsTable rows={VIEWPORT_PROPS} />
      </section>

      {/* ── Visual layer · powered by Alert ───────────────────────── */}
      <section>
        <SectionHeader>Visual layer · powered by Alert</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Each toast renders a nested <code>{'<Alert>'}</code> as its visual
          layer — the icon, title, description, action, and close chrome all
          come from there. Toast owns positioning, the stacking transform,
          the auto-dismiss timer, the queue, and the portal; Alert owns the
          look. That&apos;s why <code>appearance</code> on a toast accepts
          exactly the same vocabulary (<code>subtle</code> /{' '}
          <code>soft</code> / <code>solid</code> / <code>outline</code> /{' '}
          <code>left-accent</code> / <code>unstyled</code>) as on an inline
          Alert. Consumers wanting fully custom toast rendering can import
          <code>{' Alert.Title'}</code> /{' '}
          <code>Alert.Description</code> / <code>Alert.Actions</code> /{' '}
          <code>Alert.Close</code> from{' '}
          <code>@swift/components/Alert</code> and drop them into a{' '}
          <code>{'<ToastRoot>'}</code> via the <code>children</code> prop.
        </Text>
      </section>

      {/* ── Theme tokens · custom palette per instance ────────────── */}
      <section>
        <SectionHeader>Theme tokens · custom palette per instance</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Inline-style every visible dimension via CSS custom properties on the
          viewport. Trigger one of the buttons below to see the override land on
          the actual toast.
        </Text>
        <PreviewRow
          code={`{/* Override on the viewport — applies to every toast in it. */}
<ToastViewport
  style={{
    '--toast-max-width': '320px',
    '--toast-gap': '8px',
    '--toast-radius': '0.5rem',
    '--toast-duration': '180ms',
  }}
/>

{/* Or per-toast via the imperative className. */}
toast.success('Themed toast', {
  className: 'bg-surface-brand-muted border-stroke-brand',
})`}
        >
          <Button
            size="sm"
            onClick={() =>
              toast.success('Themed toast', {
                description: 'Per-toast className override.',
                className: 'bg-surface-brand-muted border-stroke-brand',
              })
            }
          >
            Custom className
          </Button>
        </PreviewRow>
      </section>

      {/* ── Theme tokens · reference ──────────────────────────────── */}
      <section>
        <SectionHeader>Theme tokens · reference</SectionHeader>
        <CodeBlock
          code={`/* Every visible dimension flows from one of these. Override per
   viewport via inline style, or globally via a higher-level selector
   (e.g. \`[data-theme="dark"] .swift-toast { ... }\`). */

/* Geometry — set on .swift-toast-viewport */
--toast-width          /* default calc(100vw - 2rem) */
--toast-max-width      /* default 420px */
--toast-gap            /* default 12px — expanded-state gap between cards */

/* Card — set on .swift-toast */
--toast-radius         /* default 0.625rem */
--toast-shadow         /* default 0 8px 24px rgb(0 0 0 / 0.12) — front + hover */
--toast-shadow-behind  /* default 0 4px 14px rgb(0 0 0 / 0.08) — behind toasts */

/* Stacking — controls the collapsed pile look */
--toast-peek           /* default 18px — per-step peek distance */
--toast-scale-step     /* default 0.04 — per-step scale shrink, 1 - i * step */
--toast-min-scale      /* default 0.85 — floor on the scale-down */

/* Motion */
--toast-duration       /* default 320ms (collapsed to 1ms under prefers-reduced-motion) */
--toast-ease           /* default cubic-bezier(0.22, 1, 0.36, 1) — out-quint */

/* Per-type accent — set on .swift-toast[data-type="..."] automatically */
--toast-accent         /* drives the icon colour + action button text + focus ring */`}
        />
      </section>

      {/* ── Browser compatibility ─────────────────────────────────── */}
      <section>
        <SectionHeader>Browser compatibility</SectionHeader>
        <BrowserCompat
          features={[
            {
              name: 'createPortal',
              notes:
                'Renders the viewport under document.body so toasts escape stacking contexts.',
              support: 'React 18+',
            },
            {
              name: 'useSyncExternalStore',
              notes:
                'Subscribes the viewport to the singleton store with concurrent-mode-safe semantics.',
              support: 'React 18+',
            },
            {
              name: 'ResizeObserver',
              notes:
                'Each toast reports its rendered height upward so the viewport can compute cumulative expanded-state offsets when content reflows (font load, action button toggling, description wrap).',
              support: 'Chrome 64+ · Firefox 69+ · Safari 13.1+ · Edge 79+',
            },
            {
              name: ':has() relational pseudo-class',
              notes:
                'Detects "any toast inside the viewport is hovered" so the whole stack expands without putting the listener on a (pointer-events: none) wrapper.',
              support: 'Chrome 105+ · Safari 15.4+ · Firefox 121+ · Edge 105+',
            },
            {
              name: 'CSS logical insets (inset-inline-start / end)',
              notes: 'Left/right positions auto-flip under dir="rtl".',
              support: 'Chrome 87+ · Safari 14.1+ · Firefox 66+',
            },
            {
              name: 'env(safe-area-inset-*)',
              notes:
                'Top/bottom viewports pad past the notch and the home indicator on iOS Safari.',
              support: 'Universal on modern mobile browsers',
            },
            {
              name: 'prefers-reduced-motion',
              notes:
                'Collapses enter/exit/reposition transitions to 1 ms (timer + a11y semantics unchanged).',
              support: 'Universal',
            },
          ]}
          caveats={[
            'The store is a module-singleton — `toast(...)` calls fired before <ToastProvider> mounts succeed but won\'t render until a viewport is mounted. When the last provider unmounts, in-flight toasts are cleared (HMR-friendly).',
            'Toast ids are auto-generated. Passing an explicit `id` that matches an existing toast replaces it in place rather than appending — used by the "update by id" pattern above.',
            'Heights are measured with `offsetHeight` (not `getBoundingClientRect().height`) so the enter @keyframes\' starting `scale(0.9)` doesn\'t pollute the layout-box measurement. Get the wrong reading and the expanded-state gaps collapse to ~5 px.',
          ]}
        />
      </section>

      {/* ── Import ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { ToastProvider, ToastViewport, Toast, toast } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { ToastProvider, ToastViewport, Toast, toast } from '@swift/components/Toast'`}
          />
          <CopyableImport
            label="With types"
            code={`import {
  ToastProvider,
  ToastViewport,
  Toast,
  toast,
  type ToastOptions,
  type ToastPosition,
  type ToastType,
  type ToastApi,
} from '@swift/components/Toast'`}
          />
        </div>
      </section>

      {/* ── Usage ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`// 1. Wrap your app once — the provider renders a default <ToastViewport>
//    alongside the children. Pass renderViewport={false} to place it yourself.
<ToastProvider position="bottom-right" duration={5000} maxVisible={3}>
  <App />
</ToastProvider>

// 2. Fire from anywhere — components, effects, router loaders, fetch handlers.
import { toast } from '@swift/components/Toast'

function SaveButton() {
  return (
    <button
      onClick={async () => {
        const id = toast('Saving…', { id: 'save', duration: Infinity })
        try {
          await api.save()
          toast.success('Saved', { id: 'save', duration: 3000 })
        } catch (err) {
          toast.error('Save failed', {
            id: 'save',
            description: String(err),
            action: { label: 'Retry', onClick: () => retry() },
          })
        }
      }}
    >
      Save
    </button>
  )
}`}
        />
      </section>
    </div>
  )
}

/* ── Local PropsTable (mirrors the convention used in SwitchPanel,
 *     TabsPanel, CarouselPanel, etc. — kept in-file rather than in
 *     shared.tsx so each panel can tune its own column widths). */
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
