import { useState, type ReactNode } from 'react'
import { Check } from '@swift/icons/Check'
import { Text } from '@swift/components/Text'
import { useToast } from '../lib/Toast'

export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <Text
      variant="body-xs"
      fontWeight="semibold"
      color="muted"
      className="mb-3 flex items-center gap-2 uppercase tracking-wide"
      variantMapping={{ 'body-xs': 'h2' }}
    >
      {/* Leading accent dash — decorative, neon-mint accent. */}
      <span
        aria-hidden
        className="h-0.5 w-3 shrink-0 rounded-full bg-[var(--kudos-accent)]"
      />
      {children}
    </Text>
  )
}

/**
 * Browser-compatibility block shared by every component panel.
 *
 * - `baseline` is the same default everywhere ("supported in modern
 *   evergreen browsers") so consumers don't have to repeat the line.
 *   Override only when the component is more conservative (universal)
 *   or more demanding.
 * - `features` lists the specific DOM / CSS APIs the component
 *   depends on, with a one-line note and a "supported since" range.
 * - `caveats` is for known edge cases — fallback behaviour in older
 *   browsers, platform-specific quirks.
 *
 * Layout is responsive: stacks vertically on narrow viewports, two
 * columns at md+. Matches the wider props-table styling so consumers
 * skim it the same way as the rest of the panel.
 */
export type BrowserFeature = {
  name: string
  notes?: string
  support?: string
}

export function BrowserCompat({
  baseline = 'Supported in modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions). Tested with mouse, touch, pen, and keyboard. SSR-safe — no client-only APIs are read during render.',
  features,
  caveats,
}: {
  baseline?: ReactNode
  features?: ReadonlyArray<BrowserFeature>
  caveats?: ReadonlyArray<ReactNode>
}) {
  return (
    <div className="grid gap-4 rounded-xl border border-stroke bg-surface-elevated p-5 shadow-level1">
      <Text variant="body-sm" color="secondary">
        {baseline}
      </Text>
      {features && features.length > 0 ? (
        <div className="grid gap-2">
          <Text
            variant="body-xs"
            fontWeight="semibold"
            color="muted"
            className="uppercase tracking-wide"
          >
            Required platform APIs
          </Text>
          <div className="grid gap-2 rounded-lg border border-stroke-muted bg-surface">
            {features.map(({ name, notes, support }) => (
              <div
                key={name}
                className="grid gap-1 border-b border-stroke-muted px-4 py-3 last:border-0 md:grid-cols-[220px_1fr] md:items-start md:gap-4"
              >
                <Text
                  variant="body-sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                  color="primary"
                >
                  {name}
                </Text>
                <div className="flex flex-col gap-0.5">
                  {notes ? (
                    <Text variant="body-sm" color="secondary">
                      {notes}
                    </Text>
                  ) : null}
                  {support ? (
                    <Text variant="body-xs" fontFamily="mono" color="muted">
                      {support}
                    </Text>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {caveats && caveats.length > 0 ? (
        <div className="grid gap-2">
          <Text
            variant="body-xs"
            fontWeight="semibold"
            color="muted"
            className="uppercase tracking-wide"
          >
            Caveats
          </Text>
          <ul className="grid gap-1.5">
            {caveats.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="select-none text-content-muted">•</span>
                <Text variant="body-sm" color="secondary">
                  {c}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: ReactNode
}

/**
 * Shared props table used by component panels. Renders a responsive
 * three-column grid (Prop / Type / Default) inside the standard
 * elevated-surface card. Pass an optional `title` to override the
 * default "Props" section header (e.g. "Props · DropdownMenu.Item").
 */
export function PropsTable({
  title = 'Props',
  rows,
}: {
  title?: string
  rows: ReadonlyArray<PropRow>
}) {
  return (
    <section>
      <SectionHeader>{title}</SectionHeader>
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
        {rows.map(({ name, type, defaultValue, description }) => (
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
  )
}

export function CodeBlock({ code }: { code: string }) {
  // The <pre> itself is the only scroll container. `overscroll-contain`
  // (both axes) prevents the scroll from ever chaining to the parent —
  // even at the edges, even on diagonal trackpad swipes. `touch-pan-x`
  // limits touch gestures to horizontal pan inside the pre; nothing
  // bleeds out to the page.
  return (
    <pre className="overflow-x-auto overscroll-contain touch-pan-x rounded bg-surface-inverse p-3 text-xs leading-relaxed text-content-inverse">
      {code}
    </pre>
  )
}

/**
 * The `</>` glyph. We inline it instead of pulling from `@swift/icons`
 * because the package doesn't ship a code icon — and avoiding the
 * dependency keeps the demo wrapper self-contained.
 */
function CodeIcon({ size = 14 }: { size?: number }) {
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
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

/** Standard "two overlapping rectangles" copy glyph. Inlined for the same
 *  reason as CodeIcon — `@swift/icons` doesn't ship a copy icon yet. */
function CopyIcon({ size = 14 }: { size?: number }) {
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
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

/**
 * Preview frame for each example.
 *
 *   <PreviewRow code={`<Button>Click me</Button>`}>
 *     <Button>Click me</Button>
 *   </PreviewRow>
 *
 * Pass `code` to enable a circular `</>` toggle button in the top-right
 * corner — click smoothly expands a syntax-styled code panel beneath
 * the preview (with its own Copy button). Click again to collapse.
 * Omit `code` for layout-only previews — the toggle doesn't render.
 *
 * The expand/collapse animation reuses the Accordion's CSS classes
 * (`swift-accordion-content` + `swift-accordion-content__inner`) — the
 * `grid-template-rows: 0fr ↔ 1fr` trick handles unknown content heights
 * smoothly. We don't pull in the whole Accordion component because we
 * don't need its Header / Trigger / aria-labelledby plumbing — the
 * toggle is positioned in the preview's corner, not above the panel.
 */
export function PreviewRow({
  code,
  children,
}: {
  code?: string
  children: ReactNode
}) {
  // One `expanded` flag per instance — multiple examples on a page open
  // independently, so a "show code" on the Variants demo doesn't also
  // expand "Sizes" below it.
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="overflow-hidden rounded-lg border border-stroke">
      <div className="relative flex flex-wrap items-center gap-3 bg-surface-muted p-4">
        {children}
        {code ? (
          <ToggleCodeButton
            expanded={expanded}
            onToggle={() => setExpanded((e) => !e)}
          />
        ) : null}
      </div>
      {code ? (
        // `data-state` drives the height transition via accordion.css.
        // Kept mounted across toggles so the close animation runs (a
        // conditional render would unmount instantly with no transition).
        <div
          className="swift-accordion-content"
          data-state={expanded ? 'open' : 'closed'}
          aria-hidden={!expanded || undefined}
        >
          <div className="swift-accordion-content__inner">
            <CodePanel code={code} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

/**
 * The `</>` toggle in the preview's corner. Filled state on `expanded`
 * so it reads as a sticky toggle, not just a clickable affordance.
 * `aria-expanded` + `aria-controls` would require an id — kept simple
 * with just `aria-expanded` here; an extra DOM id is overkill for a
 * demo wrapper.
 */
function ToggleCodeButton({
  expanded,
  onToggle,
}: {
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={expanded ? 'Hide source code' : 'Show source code'}
      aria-expanded={expanded}
      title={expanded ? 'Hide source' : 'Show source'}
      className={
        'absolute right-2 top-2 inline-flex size-8 cursor-pointer items-center justify-center rounded-full border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-brand ' +
        (expanded
          ? 'border-stroke-strong bg-surface-elevated text-content-strong'
          : 'border-stroke bg-surface text-content-muted hover:border-stroke-strong hover:bg-surface-elevated hover:text-content-strong')
      }
    >
      <CodeIcon />
    </button>
  )
}

/**
 * The expanded code panel. Self-contained `copied` state so each
 * example's flash feedback stays local. Border-top continues the
 * surrounding frame; dark surface mirrors the existing CodeBlock.
 */
function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.show('Example code copied')
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* Clipboard unavailable — silent fail. */
    }
  }

  return (
    <div className="relative border-t border-stroke bg-surface-inverse">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Code copied' : 'Copy code'}
        title={copied ? 'Copied!' : 'Copy code'}
        className="absolute right-2 top-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-content-inverse/70 transition-colors hover:bg-white/10 hover:text-content-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-brand"
      >
        {copied ? <Check size={14} /> : <CopyIcon />}
      </button>
      <pre className="overflow-x-auto overscroll-contain touch-pan-x px-4 py-3 pr-12 text-xs leading-relaxed text-content-inverse">
        <code>{code}</code>
      </pre>
    </div>
  )
}
