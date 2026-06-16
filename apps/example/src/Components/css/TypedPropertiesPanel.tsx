import { useState, type CSSProperties } from 'react'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive @property lesson. Registering a custom property with a type
 * lets the browser INTERPOLATE it — so an animated `--angle` smoothly
 * spins a conic gradient. An unregistered custom property is just a
 * string and can't animate. Both run side by side for the contrast.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const SHEET = `
@property --tp-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
@keyframes tp-reg-spin { to { --tp-angle: 360deg; } }
@keyframes tp-unreg-spin { to { --tp-unreg: 360deg; } }
.tp-reg {
  --tp-angle: 0deg;
  background: conic-gradient(from var(--tp-angle), #5b8def, #22c55e, #f59e0b, #5b8def);
  animation: tp-reg-spin 3s linear infinite;
}
.tp-unreg {
  --tp-unreg: 0deg;
  background: conic-gradient(from var(--tp-unreg), #5b8def, #22c55e, #f59e0b, #5b8def);
  animation: tp-unreg-spin 3s linear infinite;
}
`

const ROUND: CSSProperties = { width: 130, height: 130, borderRadius: '50%' }

export function TypedPropertiesPanel() {
  const [paused, setPaused] = useState(false)
  const playState: CSSProperties = { animationPlayState: paused ? 'paused' : 'running' }

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <style>{SHEET}</style>

      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Typed properties
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>@property</code> registers a custom property with a <code>syntax</code> type, an{' '}
          <code>inherits</code> flag, and an <code>initial-value</code>. Giving it a type means the
          browser can <strong className="text-content-strong">animate and interpolate</strong> it —
          something a plain <code>--var</code> (always just a string) can&rsquo;t do.
        </Text>
      </header>

      <section>
        <SectionHeader>Registered vs unregistered · same animation</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="flex min-h-72 flex-wrap items-center justify-center gap-8 bg-surface-muted p-8" style={STAGE_STYLE}>
            <div className="flex flex-col items-center gap-2">
              <div className="tp-reg border border-stroke shadow-level2" style={{ ...ROUND, ...playState }} />
              <Text variant="body-xs" fontFamily="mono" color="success" className="font-semibold">@property → spins</Text>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="tp-unreg border border-stroke shadow-level2" style={{ ...ROUND, ...playState }} />
              <Text variant="body-xs" fontFamily="mono" color="muted">plain --var → frozen</Text>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Button size="sm" variant="secondary" onClick={() => setPaused((p) => !p)}>
              {paused ? 'Play' : 'Pause'}
            </Button>
            <Text variant="body-xs" color="secondary">
              Both boxes animate <code>from var(--angle)</code> on a conic gradient with the same
              keyframes. Only the <strong className="text-content-strong">registered</strong>{' '}
              <code>&lt;angle&gt;</code> interpolates — the unregistered one can&rsquo;t, so it never
              turns.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock
              code={`@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
@keyframes spin { to { --angle: 360deg; } }
.ring {
  background: conic-gradient(from var(--angle), …);
  animation: spin 3s linear infinite;
}`}
            />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>syntax</code> can be <code>&lt;color&gt;</code>, <code>&lt;length&gt;</code>,{' '}
          <code>&lt;number&gt;</code>, <code>&lt;percentage&gt;</code>, and more — so you can animate
          gradient colours, custom offsets, and other things that were previously impossible.
        </Text>
      </section>
    </div>
  )
}
