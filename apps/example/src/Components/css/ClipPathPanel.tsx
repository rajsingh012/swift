import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive clip-path lesson. A real `clip-path` is applied to the box;
 * a dashed ghost shows the original, unclipped footprint so it's clear
 * clipping only hides pixels — the layout box is unchanged.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

type Shape = 'circle' | 'ellipse' | 'inset' | 'triangle' | 'hexagon'
const SHAPES: ReadonlyArray<Shape> = ['circle', 'ellipse', 'inset', 'triangle', 'hexagon']

function clipFor(shape: Shape, size: number): string {
  switch (shape) {
    case 'circle':
      return `circle(${size}% at 50% 50%)`
    case 'ellipse':
      return `ellipse(${size}% ${Math.round(size * 0.7)}% at 50% 50%)`
    case 'inset':
      return `inset(${Math.round(size / 3)}% round 14px)`
    case 'triangle':
      return 'polygon(50% 0%, 0% 100%, 100% 100%)'
    case 'hexagon':
      return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
  }
}

export function ClipPathPanel() {
  const [shape, setShape] = useState<Shape>('circle')
  const [size, setSize] = useState(50)
  const usesSize = shape === 'circle' || shape === 'ellipse' || shape === 'inset'
  const clip = clipFor(shape, size)

  const css = useMemo(() => `.box {\n  clip-path: ${clip};\n}`, [clip])

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Clip-path
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>clip-path</code> hides everything outside a shape — a circle, ellipse, inset
          rectangle, or arbitrary polygon — without changing the element&rsquo;s layout box. It
          works on any element (images, divs, buttons) and is animatable.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div style={{ position: 'relative', width: 180, height: 180 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px dashed var(--color-stroke-strong)',
                  borderRadius: 8,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: clip,
                  background:
                    'linear-gradient(135deg, var(--color-brand-400), var(--color-brand-600))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  fontWeight: 700,
                }}
              >
                {shape}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                shape
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {SHAPES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShape(s)}
                    className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                      s === shape
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color={usesSize ? 'secondary' : 'muted'}>
                  size {usesSize ? '' : '(n/a for polygons)'}
                </Text>
                <Text variant="body-xs" fontFamily="mono" color={usesSize ? 'primary' : 'muted'}>
                  {size}%
                </Text>
              </div>
              <Slider value={[size]} min={10} max={75} step={1} onValueChange={([v]) => setSize(v)} aria-label="size" />
            </div>
            <Text variant="body-xs" color="muted">
              The dashed square is the untouched layout box — clipping only changes what paints,
              not how much space the element takes.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>polygon()</code> takes any list of points, so you can carve arrows, badges, or
          diagonal section dividers — and transition between equal-point shapes.
        </Text>
      </section>
    </div>
  )
}
