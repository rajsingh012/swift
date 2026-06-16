import { useMemo, useState, type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive writing-modes lesson. The sample text gets a real
 * `writing-mode` (and `text-orientation` for vertical modes), so the
 * inline/block axes rotate exactly as the browser lays out non-horizontal
 * scripts.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const MODES = ['horizontal-tb', 'vertical-rl', 'vertical-lr'] as const
type Mode = (typeof MODES)[number]
const ORIENTATIONS = ['mixed', 'upright', 'sideways'] as const
type Orientation = (typeof ORIENTATIONS)[number]

export function WritingModesPanel() {
  const [mode, setMode] = useState<Mode>('vertical-rl')
  const [orientation, setOrientation] = useState<Orientation>('mixed')
  const vertical = mode !== 'horizontal-tb'

  const css = useMemo(
    () =>
      `.text {
  writing-mode: ${mode};${vertical ? `\n  text-orientation: ${orientation};` : ''}
}`,
    [mode, orientation, vertical],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Writing modes
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>writing-mode</code> sets the direction text flows — horizontal top-to-bottom (the
          default), or vertical for scripts like Chinese, Japanese, and Korean, and for compact
          vertical labels. It swaps the <em>inline</em> and <em>block</em> axes, which is why
          logical properties pair so well with it.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                writingMode: mode,
                textOrientation: vertical ? orientation : undefined,
                maxHeight: 220,
                maxWidth: '100%',
                padding: 16,
                borderRadius: 10,
                border: '1px solid var(--color-stroke)',
                background: 'var(--color-surface)',
                color: 'var(--color-content)',
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              Typography flows along the inline axis — rotate it and the block axis follows.
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                writing-mode
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                      m === mode
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color={vertical ? 'secondary' : 'muted'}>
                text-orientation {vertical ? '' : '(vertical only)'}
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {ORIENTATIONS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    disabled={!vertical}
                    onClick={() => setOrientation(o)}
                    className={`rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                      !vertical
                        ? 'cursor-not-allowed bg-surface-muted text-content-muted opacity-60'
                        : o === orientation
                          ? 'cursor-pointer bg-surface-brand-muted font-semibold text-content-brand'
                          : 'cursor-pointer bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <Text variant="body-xs" color="secondary">
              {mode === 'horizontal-tb'
                ? 'The default: lines run left-to-right, stacking top-to-bottom.'
                : mode === 'vertical-rl'
                  ? 'Lines run top-to-bottom, columns stacking right-to-left (CJK default).'
                  : 'Lines run top-to-bottom, columns stacking left-to-right.'}
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>text-orientation: upright</code> keeps Latin letters facing up (handy for vertical
          UI labels); <code>mixed</code> rotates them, which is correct for CJK runs.
        </Text>
      </section>
    </div>
  )
}
