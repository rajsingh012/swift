import { useState, type ReactNode } from 'react'
import { Check } from '@swift/icons/Check'
import { Text } from '@swift/components/Text'
import { useToast } from '../lib/toast'

export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <Text
      variant="body-xs"
      fontWeight="semibold"
      color="muted"
      className="mb-3 block uppercase tracking-wide"
      variantMapping={{ 'body-xs': 'h2' }}
    >
      {children}
    </Text>
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
