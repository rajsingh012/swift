import { useState } from 'react'
import {
  Tooltip,
  TooltipProvider,
  type Placement,
  type TooltipVariant,
} from '@swift/components/Tooltip'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { InfoCircle } from '@swift/icons/InfoCircle'
import { CopyableImport } from '../lib/CopyableImport'
import { BrowserCompat, CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Compound, accessible, collision-aware tooltip built on a new shared positioning engine (internal/floating.ts — flip + shift + arrow, no external deps). Opens on hover and keyboard focus, with configurable open/close delays. Twelve placements with automatic flip when an edge is hit and shift-to-fit along the cross-axis; the arrow tracks the trigger after shifting. Portaled (escapes overflow:hidden), SSR-safe (no document access on the server, no (0,0) flash), RTL-aware (placement mirrors via logical properties), and reduced-motion friendly. Extras: TooltipProvider for shared delays + a "skip delay" window, interactive tooltips (pointer can enter rich content), and touch long-press. asChild by default so it decorates an existing element without an extra wrapper.'

const PLACEMENTS: ReadonlyArray<Placement> = [
  'top-start',
  'top',
  'top-end',
  'right-start',
  'right',
  'right-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end',
]

// Laid out for a 3-column grid: `right`-placement in the left column and
// `left`-placement in the right column, so each side-opening tooltip has room
// to render away from its neighbours instead of over them.
const RICH_EXAMPLES: ReadonlyArray<{
  key: string
  variant: TooltipVariant
  placement: Placement
  label: string
}> = [
  { key: 'b-right', variant: 'brand', placement: 'right', label: 'Right' },
  { key: 'd-top', variant: 'default', placement: 'top', label: 'Top' },
  { key: 'b-left', variant: 'brand', placement: 'left', label: 'Left' },
  { key: 'd-right', variant: 'default', placement: 'right', label: 'Right' },
  { key: 'b-bottom', variant: 'brand', placement: 'bottom', label: 'Bottom' },
  { key: 'd-left', variant: 'default', placement: 'left', label: 'Left' },
]

/** Inline chain-link glyph — @swift/icons doesn't ship a plain link icon. */
function LinkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'open / defaultOpen',
    type: 'boolean',
    description:
      'Controlled / uncontrolled open state. Omit both for the standard hover/focus-driven tooltip.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Fires on every open/close request (delay timers resolved).',
  },
  {
    name: 'trigger',
    type: `'hover' | 'click' | ('hover' | 'click')[]`,
    defaultValue: `'hover'`,
    description:
      "What opens it. 'hover' = pointer hover + keyboard focus + touch long-press. 'click' = click/Enter/Space toggles, dismisses on outside-click or Escape. Pass both to let hover preview and a click pin it open.",
  },
  {
    name: 'placement',
    type: `'top' | 'bottom' | 'left' | 'right' (+ '-start' / '-end')`,
    defaultValue: `'top'`,
    description:
      'Preferred placement. Flips to the opposite side when clipped; the cross-axis position shifts to stay on screen.',
  },
  {
    name: 'offset',
    type: 'number',
    defaultValue: '8',
    description: 'Gap between the trigger and the tooltip, in px.',
  },
  {
    name: 'openDelay / closeDelay',
    type: 'number',
    defaultValue: '700 / 300',
    description:
      'Hover/focus dwell before opening, and grace period before closing. Inherited from TooltipProvider when present; own props win.',
  },
  {
    name: 'interactive',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Let the pointer move into the tooltip without it closing (rich content with links/buttons). Interactive tooltips also dismiss on Escape.',
  },
  {
    name: 'disableTouch',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disable the touch long-press trigger.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Fully disable — the tooltip never opens.',
  },
  {
    name: 'dir',
    type: `'ltr' | 'rtl'`,
    description:
      'Writing direction for placement mirroring. Auto-detected from the trigger when omitted.',
  },
]

export function TooltipPanel() {
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Tooltip
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Basic ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Basic · hover or keyboard-focus</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Hover the button, or Tab to it — both open the tooltip. Move away
          or press Escape (interactive) to close. <code>asChild</code> is on
          by default, so the Button stays the real trigger.
        </Text>
        <PreviewRow
          code={`<Tooltip>
  <Tooltip.Trigger>
    <Button>Save</Button>
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>
      Save changes
      <Tooltip.Arrow />
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip>`}
        >
          <Tooltip>
            <Tooltip.Trigger>
              <Button>Save</Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>
                Save changes
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip>
          <Tooltip openDelay={0}>
            <Tooltip.Trigger>
              <Button variant="secondary">No open delay</Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>
                Opens instantly
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip>
        </PreviewRow>
      </section>

      {/* ── Trigger modes ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Trigger · hover · click · both</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>trigger</code> picks what opens the tooltip. <code>click</code>{' '}
          toggles it and stays open until you click outside or press Escape —
          handy on touch and for content you want to read at your own pace.
          Pass both so hover previews it and a click pins it.
        </Text>
        <PreviewRow
          code={`<Tooltip trigger="hover">...</Tooltip>           {/* default */}
<Tooltip trigger="click">...</Tooltip>
<Tooltip trigger={['hover', 'click']}>...</Tooltip>  {/* hover previews, click pins */}`}
        >
          <div className="flex w-full flex-wrap items-center gap-3">
            <Tooltip trigger="hover">
              <Tooltip.Trigger>
                <Button variant="outline" size="sm">
                  Hover me
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>
                  Opens on hover / focus
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>

            <Tooltip trigger="click">
              <Tooltip.Trigger>
                <Button variant="outline" size="sm">
                  Click me
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>
                  Click toggles · outside-click or Esc closes
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>

            <Tooltip trigger={['hover', 'click']}>
              <Tooltip.Trigger>
                <Button variant="outline" size="sm">
                  Hover + click
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>
                  Hover previews · click pins it open
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
          </div>
        </PreviewRow>
      </section>

      {/* ── Variants ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Variants · default & brand</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>{'<Tooltip.Content variant>'}</code> switches the surface —{' '}
          <code>default</code> (light, bordered) or <code>brand</code>{' '}
          (purple). The arrow inherits the surface colour automatically.
        </Text>
        <PreviewRow
          code={`<Tooltip.Content variant="default">Example of tooltip<Tooltip.Arrow /></Tooltip.Content>
<Tooltip.Content variant="brand">Example of tooltip<Tooltip.Arrow /></Tooltip.Content>`}
        >
          <div className="flex w-full flex-wrap items-center gap-3">
            <Tooltip openDelay={0}>
              <Tooltip.Trigger>
                <Button variant="outline" size="sm">
                  Default
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content variant="default">
                  Example of tooltip
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
            <Tooltip openDelay={0}>
              <Tooltip.Trigger>
                <Button size="sm">Brand</Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content variant="brand">
                  Example of tooltip
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
          </div>
        </PreviewRow>
      </section>

      {/* ── Icon + dismissible ────────────────────────────────────── */}
      <section>
        <SectionHeader>Leading icon · dismissible close</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Drop an icon and a <code>{'<Tooltip.Close>'}</code> (renders a ×, or
          pass your own) into the content. Pair with <code>trigger=&quot;click&quot;</code>{' '}
          so it stays open while the user reads or acts. Both variants, four
          placements — matching the design spec.
        </Text>
        <PreviewRow
          code={`<Tooltip trigger="click" placement="bottom">
  <Tooltip.Trigger><Button>Share</Button></Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content variant="brand">
      <LinkIcon />
      Example of tooltip
      <Tooltip.Close />
      <Tooltip.Arrow />
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip>`}
        >
          {/* Generous, evenly-spaced cells so each tooltip (and its arrow)
              has room to render on its chosen side without colliding with a
              neighbouring trigger. */}
          <div className="grid w-full grid-cols-2 gap-4 py-6 sm:grid-cols-3">
            {RICH_EXAMPLES.map(({ key, variant, placement, label }) => (
              <div
                key={key}
                className="flex min-h-[96px] items-center justify-center"
              >
                <Tooltip trigger="click" placement={placement}>
                  <Tooltip.Trigger>
                    <Button
                      variant={variant === 'brand' ? 'primary' : 'outline'}
                      size="sm"
                    >
                      {label}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content variant={variant}>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <LinkIcon />
                        Example of tooltip
                        <Tooltip.Close />
                      </span>
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Placements ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Placements · 12 sides × alignments</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Four sides, each with <code>-start</code> / centre / <code>-end</code>{' '}
          alignment. Near a viewport edge they flip to the opposite side
          automatically.
        </Text>
        <PreviewRow
          code={`<Tooltip placement="top-start" openDelay={0}>...</Tooltip>`}
        >
          <div className="grid w-full grid-cols-3 place-items-center gap-3 py-6">
            {PLACEMENTS.map((placement) => (
              <Tooltip key={placement} placement={placement} openDelay={0}>
                <Tooltip.Trigger>
                  <Button variant="outline" size="sm" className="w-full">
                    {placement}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content>
                    {placement}
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Collision / flip ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Collision detection · flip + shift</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          These triggers sit hard against the edges of a scroll box. Each
          prefers <code>top</code>, but flips to <code>bottom</code> when there
          isn&apos;t room above, and the long tooltip shifts sideways to stay
          inside the viewport — the arrow keeps pointing at the trigger.
        </Text>
        <PreviewRow>
          <div className="flex w-full items-center justify-between gap-2">
            {(['far-left', 'centre', 'far-right'] as const).map((where) => (
              <Tooltip key={where} placement="top" openDelay={0}>
                <Tooltip.Trigger>
                  <Button variant="outline" size="sm">
                    {where}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content>
                    A deliberately long tooltip that would overflow the
                    viewport without shift-to-fit collision handling.
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Rich + interactive ────────────────────────────────────── */}
      <section>
        <SectionHeader>Interactive · rich content</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          With <code>interactive</code>, the pointer can travel into the
          tooltip (across the offset gap, via an invisible bridge) without it
          closing — so links and buttons inside are usable. Escape closes it.
        </Text>
        <PreviewRow
          code={`<Tooltip interactive placement="bottom">
  <Tooltip.Trigger>
    <Button variant="outline">Storage</Button>
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>
      <strong>Storage</strong>
      <p>Current usage: 80%</p>
      <button>Manage</button>
      <Tooltip.Arrow />
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip>`}
        >
          <Tooltip interactive placement="bottom">
            <Tooltip.Trigger>
              <Button variant="outline">Storage</Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                classes={{ content: 'max-w-[15rem]' }}
                style={{ pointerEvents: 'auto' }}
              >
                <div className="flex flex-col gap-1.5 p-1">
                  <strong>Storage — 80% full</strong>
                  <span className="opacity-80">
                    1.6 GB of 2 GB used across photos and trips.
                  </span>
                  <button
                    type="button"
                    className="mt-1 self-start rounded bg-white/15 px-2 py-0.5 text-[11px] hover:bg-white/25"
                    onClick={() => alert('Manage storage')}
                  >
                    Manage
                  </button>
                </div>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip>
        </PreviewRow>
      </section>

      {/* ── Provider skip-delay ───────────────────────────────────── */}
      <section>
        <SectionHeader>TooltipProvider · shared skip-delay</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Wrap a group in <code>TooltipProvider</code> to share delays. The
          first tooltip waits the full <code>openDelay</code>; move to a
          neighbour within the skip window and it opens instantly — the
          familiar toolbar feel.
        </Text>
        <PreviewRow
          code={`<TooltipProvider openDelay={600} skipDelayDuration={400}>
  {actions.map((a) => (
    <Tooltip key={a}>
      <Tooltip.Trigger><Button>{a}</Button></Tooltip.Trigger>
      <Tooltip.Portal><Tooltip.Content>{a}<Tooltip.Arrow /></Tooltip.Content></Tooltip.Portal>
    </Tooltip>
  ))}
</TooltipProvider>`}
        >
          <TooltipProvider openDelay={600} skipDelayDuration={400}>
            <div className="flex w-full flex-wrap gap-2">
              {['Bold', 'Italic', 'Underline', 'Link', 'Code'].map((action) => (
                <Tooltip key={action}>
                  <Tooltip.Trigger>
                    <Button variant="ghost" size="sm">
                      {action}
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content>
                      {action}
                      <Tooltip.Arrow />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </PreviewRow>
      </section>

      {/* ── RTL ───────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>RTL · mirrored placement</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Under <code>dir=&quot;rtl&quot;</code>, <code>left</code>/
          <code>right</code> and <code>-start</code>/<code>-end</code> mirror
          so the tooltip lands where a right-to-left reader expects.
        </Text>
        <PreviewRow>
          <div dir="rtl" className="flex w-full gap-3">
            <Tooltip placement="right" dir="rtl" openDelay={0}>
              <Tooltip.Trigger>
                <Button variant="outline" size="sm">
                  placement=&quot;right&quot;
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>
                  Renders on the visual left in RTL
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
            <Tooltip placement="bottom-start" dir="rtl" openDelay={0}>
              <Tooltip.Trigger>
                <Button variant="outline" size="sm">
                  bottom-start
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>
                  start = right edge in RTL
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
          </div>
        </PreviewRow>
      </section>

      {/* ── Disabled trigger recipe ───────────────────────────────── */}
      <section>
        <SectionHeader>Disabled controls</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Native disabled buttons emit no pointer/focus events, so a tooltip
          would never open. Use <code>asChild=&#123;false&#125;</code> (the
          Trigger renders a focusable wrapper) and set{' '}
          <code>pointer-events: none</code> on the disabled control.
        </Text>
        <PreviewRow
          code={`<Tooltip>
  <Tooltip.Trigger asChild={false}>
    <button disabled style={{ pointerEvents: 'none' }}>
      Submit
    </button>
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>Complete the form first<Tooltip.Arrow /></Tooltip.Content>
  </Tooltip.Portal>
</Tooltip>`}
        >
          <Tooltip openDelay={0}>
            <Tooltip.Trigger asChild={false}>
              <Button disabled style={{ pointerEvents: 'none' }}>
                Submit
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>
                Complete the form first
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip>
        </PreviewRow>
      </section>

      {/* ── Controlled ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Controlled</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Drive <code>open</code> yourself — e.g. to surface a hint
          programmatically.
        </Text>
        <PreviewRow
          code={`const [open, setOpen] = useState(false)
<Tooltip open={open} onOpenChange={setOpen}>...</Tooltip>`}
        >
          <div className="flex w-full items-center gap-3">
            <Tooltip open={controlledOpen} onOpenChange={setControlledOpen}>
              <Tooltip.Trigger>
                <Button variant="outline">
                  <InfoCircle size={16} />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>
                  Controlled tooltip — toggled by the button on the right
                  <Tooltip.Arrow />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
            <Button size="sm" onClick={() => setControlledOpen((v) => !v)}>
              {controlledOpen ? 'Hide' : 'Show'} tooltip
            </Button>
          </div>
        </PreviewRow>
      </section>

      {/* ── Accessibility ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Roles + wiring.</strong>{' '}
            The content is <code>role=&quot;tooltip&quot;</code> and the trigger
            gets <code>aria-describedby</code> pointing at it while open, so
            screen readers associate the two. Use a visible label + tooltip
            for <em>extra</em> info — not as the element&apos;s only name (use{' '}
            <code>aria-label</code> there instead).
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong>{' '}
            Tab focuses the trigger and opens the tooltip (focus-visible only —
            a mouse click doesn&apos;t pop it); blur closes it. Interactive
            tooltips also close on Escape, dismissing one layer at a time when
            nested inside a Sheet/Dialog (shared overlay stack).
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Touch.</strong>{' '}
            Press-and-hold (~500ms) opens on touch devices; the synthetic
            click and the OS callout are suppressed during the press. Opt out
            with <code>disableTouch</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion + SSR.</strong>{' '}
            <code>prefers-reduced-motion</code> collapses the scale/fade to an
            instant show. The content is portaled behind a mount gate so the
            server never reads <code>document</code>, and it stays hidden until
            measured — no flash at (0,0), no hydration mismatch.
          </Text>
        </div>
      </section>

      {/* ── Props ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Props · Tooltip (root)</SectionHeader>
        <PropsTable rows={ROOT_PROPS} />
      </section>

      {/* ── Compound parts ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="grid gap-3">
          {[
            {
              name: 'Tooltip.Trigger',
              summary:
                'The element that opens the tooltip. asChild by default (wraps your existing element); set asChild={false} for the disabled-control wrapper recipe.',
            },
            {
              name: 'Tooltip.Portal',
              summary:
                'SSR-safe portal into document.body (or a custom container) so the tooltip escapes overflow:hidden ancestors.',
            },
            {
              name: 'Tooltip.Content',
              summary:
                'The surface. Props: variant ("default" | "brand"), forceMount, closeOnEscape, onEscapeKeyDown, classes. Accepts any rich content — icons, text, buttons.',
            },
            {
              name: 'Tooltip.Arrow',
              summary:
                'Decorative arrow that tracks the trigger and inherits the surface colour + border per variant.',
            },
            {
              name: 'Tooltip.Close',
              summary:
                'Dismiss button (renders a × by default; pass children to override). Closes the tooltip on click unless preventDefault() is called. Use with trigger="click" / interactive.',
            },
          ].map(({ name, summary }) => (
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
          code={`/* Defaults on .swift-tooltip-content — override per-instance via inline
   style, or globally via a higher-level selector. */

--tooltip-bg            /* default var(--color-surface-inverse) */
--tooltip-color         /* default var(--color-content-inverse) */
--tooltip-radius        /* default var(--radius-sm) */
--tooltip-shadow        /* default var(--shadow-level3) */
--tooltip-padding-inline /* default 0.5rem */
--tooltip-padding-block  /* default 0.25rem */
--tooltip-font-size     /* default 0.75rem */
--tooltip-max-width     /* default 18rem */
--tooltip-offset        /* default 8px — also the interactive hover bridge */
--tooltip-arrow-size    /* default 8px */
--tooltip-animation-duration /* default 150ms */
--tooltip-ease          /* default cubic-bezier(0.16, 1, 0.3, 1) */
--tooltip-z-index       /* default 70 — above Sheet (50) and Toast (60) */

/* Data attributes for styling:
   [data-state="open|closed"]  [data-side="top|bottom|left|right"]
   [data-align="start|center|end"]  [data-interactive] */`}
        />
      </section>

      {/* ── Browser compatibility ─────────────────────────────────── */}
      <section>
        <SectionHeader>Browser compatibility</SectionHeader>
        <BrowserCompat
          features={[
            {
              name: 'Pointer Events (pointerenter / pointerType)',
              notes:
                'Hover and touch long-press share one pointer pipeline; the touch branch is gated on pointerType === "touch".',
              support: 'Chrome 55+ · Safari 13+ · Firefox 59+',
            },
            {
              name: ':focus-visible',
              notes:
                'The tooltip opens on keyboard focus only — a mouse click on the trigger won\'t pop it.',
              support: 'Chrome 86+ · Safari 15.4+ · Firefox 85+',
            },
            {
              name: 'CSS logical properties (inset-inline-*)',
              notes:
                'Arrow position and the interactive bridge use logical insets, so RTL mirrors for free.',
              support: 'Chrome 87+ · Safari 14.1+ · Firefox 66+',
            },
            {
              name: 'prefers-reduced-motion',
              notes: 'Collapses the open/close animation to ~instant.',
              support: 'Universal',
            },
          ]}
          caveats={[
            'Positioning is hand-rolled (no Floating-UI/Popper). v1 flip is a single main-axis attempt (top↔bottom, left↔right) with cross-axis shift — sufficient for tooltips; it does not try perpendicular sides.',
            'Non-interactive tooltips set pointer-events:none and never intercept Escape; only interactive tooltips join the overlay stack.',
            'The arrow is a rotated square sharing the surface colour (no border/shadow on the arrow itself in v1).',
          ]}
        />
      </section>

      {/* ── Import ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Tooltip, TooltipProvider } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Tooltip, TooltipProvider } from '@swift/components/Tooltip'`}
          />
          <CopyableImport
            label="With types"
            code={`import {
  Tooltip,
  TooltipProvider,
  type TooltipRootProps,
  type TooltipContentProps,
  type TooltipVariant,
  type Placement,
} from '@swift/components/Tooltip'`}
          />
        </div>
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
