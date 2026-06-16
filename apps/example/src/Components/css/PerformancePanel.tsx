import { useState, type CSSProperties } from 'react'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Rendering-performance lesson: will-change & contain. These don't change
 * how things look — they hint the engine so it can promote layers and
 * isolate work. The demo shows the declarations being applied; the wins
 * are in the compositor, not on screen.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const CONTAIN: ReadonlyArray<{ value: string; note: string }> = [
  { value: 'layout', note: 'The element’s inner layout can’t affect anything outside it.' },
  { value: 'paint', note: 'Descendants never paint outside the box — skippable when off-screen.' },
  { value: 'size', note: 'The box’s size doesn’t depend on its children (you must size it).' },
  { value: 'content', note: 'Shorthand for layout + paint — the common, safe choice.' },
  { value: 'strict', note: 'layout + paint + size — maximum isolation.' },
]

export function PerformancePanel() {
  const [willChange, setWillChange] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Performance
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>will-change</code> and <code>contain</code> are rendering <em>hints</em> — they
          don&rsquo;t change appearance, they tell the browser how to optimise.{' '}
          <code>will-change</code> pre-promotes an element for an upcoming animation;{' '}
          <code>contain</code> walls off a subtree so layout/paint work can be skipped or
          isolated. Both cost memory, so use them deliberately.
        </Text>
      </header>

      <section>
        <SectionHeader>will-change · hover to animate</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-56 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{ willChange: willChange ? 'transform' : 'auto' }}
              className="grid size-28 place-items-center rounded-2xl bg-surface-brand text-content-on-brand shadow-level2 transition-transform duration-300 hover:scale-110 hover:rotate-3"
            >
              hover
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="flex items-center justify-between gap-3">
              <Text variant="body-xs" fontFamily="mono" color="secondary">will-change: transform</Text>
              <Switch size="sm" checked={willChange} onCheckedChange={setWillChange} aria-label="will-change" />
            </div>
            <Text variant="body-xs" color="secondary">
              Both states animate identically here — the difference is under the hood: with the
              hint on, the browser puts the box on its own compositor layer ahead of time, avoiding
              a hitch on the first frame.
            </Text>
            <Text variant="body-xs" color="muted">
              Anti-pattern: <code>will-change: transform</code> on hundreds of elements, or left on
              permanently. Add it just before animating, remove it after.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock
              code={`.card:hover { will-change: transform; } /* hint right before it moves */
.card { transition: transform .3s; }
.card:hover { transform: scale(1.1); }`}
            />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>contain · isolate a subtree</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {CONTAIN.map(({ value, note }) => (
            <div key={value} className="grid gap-1 border-b border-stroke-muted px-5 py-3 last:border-0 md:grid-cols-[160px_1fr] md:items-center md:gap-4">
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">contain: {value}</Text>
              <Text variant="body-sm" color="secondary">{note}</Text>
            </div>
          ))}
        </div>
        <CodeBlock code={`/* a long feed of independent cards */
.card {
  contain: content;        /* layout + paint isolation */
  content-visibility: auto; /* skip rendering off-screen cards entirely */
  contain-intrinsic-size: 0 200px; /* reserve space while skipped */
}`} />
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>content-visibility: auto</code> pairs with containment to skip the rendering work
          for off-screen content — one of the biggest easy wins for very long pages.
        </Text>
      </section>
    </div>
  )
}
