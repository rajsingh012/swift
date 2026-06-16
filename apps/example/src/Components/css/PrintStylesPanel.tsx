import { type CSSProperties } from 'react'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Print-styles lesson. You can't render a real print job inline, so this
 * pairs a "paper" preview (what print CSS typically produces) with the
 * @media print patterns — and a button that opens the real print dialog.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

export function PrintStylesPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Print styles
        </Text>
        <Text variant="para-lg" color="secondary">
          A <code>@media print</code> block overrides your screen CSS for the printed page (and
          &ldquo;Save as PDF&rdquo;). The usual job: hide chrome like nav and buttons, force
          high-contrast ink, expand link URLs, and control where pages break.
        </Text>
      </header>

      <section>
        <SectionHeader>Screen vs paper</SectionHeader>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Screen */}
          <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5" style={STAGE_STYLE}>
            <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="muted" className="uppercase tracking-wide">on screen</Text>
            <div className="rounded-lg border border-stroke bg-surface p-4">
              <div className="mb-3 flex items-center justify-between rounded-md bg-surface-brand px-3 py-2 text-content-on-brand">
                <span className="text-sm font-semibold">Swift · nav bar</span>
                <span className="rounded bg-white/20 px-2 py-0.5 text-xs">Book now</span>
              </div>
              <Text variant="body-sm" color="secondary">
                Boarding pass for <a href="#print" onClick={(e) => e.preventDefault()} className="text-content-brand underline">DEL → GOX</a>.
              </Text>
            </div>
          </div>

          {/* Paper */}
          <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5" style={STAGE_STYLE}>
            <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="muted" className="uppercase tracking-wide">printed (simulated)</Text>
            <div className="rounded-lg border border-stroke bg-white p-4 text-black shadow-level2">
              {/* nav + button hidden; ink is black; link URL shown */}
              <p className="text-sm">
                Boarding pass for <span className="underline">DEL → GOX</span>{' '}
                <span className="text-neutral-500">(https://swift.app/print)</span>.
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => window.print()}>
              Print this page
            </Button>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>The @media print recipe</SectionHeader>
        <CodeBlock
          code={`@media print {
  nav, .no-print, button { display: none; }      /* drop chrome */
  body { color: #000; background: #fff; }          /* ink-friendly */
  a::after { content: " (" attr(href) ")"; }       /* reveal URLs */
  table, figure, .card { break-inside: avoid; }    /* don't split */
  h2 { break-before: page; }                        /* new page per section */
}

/* keep brand colours / images in the printout */
.logo { print-color-adjust: exact; }`}
        />
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Use the page-break properties <code>break-before</code> / <code>break-after</code> /{' '}
          <code>break-inside</code>, size the sheet with the <code>@page</code> rule (margins,
          size), and test via the browser&rsquo;s &ldquo;Print → Save as PDF&rdquo;.
        </Text>
      </section>
    </div>
  )
}
