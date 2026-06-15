import { Box } from '@swift/components/Box'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'The lowest-level layout primitive. A polymorphic element with token-driven box-model props — spacing (margin/padding), sizing, background, radius, border, and shadow — that resolve to inline styles built from design tokens. Adds no classes of its own, so your className / style always wins the cascade.'

const BOX_KNOBS: ReadonlyArray<Knob> = [
  {
    type: 'select',
    name: 'p',
    label: 'p (padding)',
    options: ['0', '2', '4', '6', '8', '10', '12'],
    defaultValue: '6',
  },
  {
    type: 'select',
    name: 'bg',
    options: [
      'surface',
      'surface-muted',
      'surface-subtle',
      'surface-elevated',
      'brand-muted',
      'success-muted',
      'warning-muted',
      'critical-muted',
    ],
    defaultValue: 'surface-elevated',
  },
  {
    type: 'select',
    name: 'radius',
    options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
    defaultValue: 'lg',
  },
  {
    type: 'select',
    name: 'shadow',
    options: ['none', 'level1', 'level2', 'level3', 'level4'],
    defaultValue: 'level1',
  },
  { type: 'boolean', name: 'border', defaultValue: true },
]

const SPACE_SCALE: ReadonlyArray<{ step: string; px: string }> = [
  { step: '0', px: '0' },
  { step: '1', px: '4px' },
  { step: '2', px: '8px' },
  { step: '3', px: '12px' },
  { step: '4', px: '16px' },
  { step: '5', px: '20px' },
  { step: '6', px: '24px' },
  { step: '7', px: '28px' },
  { step: '8', px: '32px' },
  { step: '10', px: '40px' },
  { step: '12', px: '48px' },
  { step: '16', px: '64px' },
  { step: '20', px: '80px' },
  { step: '24', px: '96px' },
]

const BG_TOKENS: ReadonlyArray<{
  name:
    | 'surface'
    | 'surface-muted'
    | 'surface-subtle'
    | 'surface-elevated'
    | 'surface-inverse'
    | 'brand'
    | 'brand-muted'
    | 'success-muted'
    | 'warning-muted'
    | 'critical-muted'
    | 'highlight-muted'
  inverseText?: boolean
}> = [
  { name: 'surface' },
  { name: 'surface-muted' },
  { name: 'surface-subtle' },
  { name: 'surface-elevated' },
  { name: 'surface-inverse', inverseText: true },
  { name: 'brand', inverseText: true },
  { name: 'brand-muted' },
  { name: 'success-muted' },
  { name: 'warning-muted' },
  { name: 'critical-muted' },
  { name: 'highlight-muted' },
]

const RADII = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const
const SHADOWS = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'] as const
const BORDER_TONES = [
  'default',
  'muted',
  'strong',
  'brand',
  'success',
  'warning',
  'critical',
] as const

const BOX_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'as',
    type: 'ElementType',
    defaultValue: `'div'`,
    description:
      'Polymorphic element override — render the Box as any tag or component (`section`, `ul`, `a`, a router link). TypeScript narrows the rest of the props to that element.',
  },
  {
    name: 'p / px / py / pt pr pb pl',
    type: 'SpaceValue',
    description:
      'Padding. A number is a step on the spacing scale (`p={4}` → `var(--space-4)`); a string passes through raw (`p="2rem"`). Precedence: side > axis > shorthand.',
  },
  {
    name: 'm / mx / my / mt mr mb ml',
    type: 'SpaceValue',
    description:
      'Margin. Same scale and precedence as padding. `mx="auto"` centres a fixed-width Box.',
  },
  {
    name: 'display',
    type: `'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none' | 'contents'`,
    description: 'Sets the CSS display mode.',
  },
  {
    name: 'width / height',
    type: 'number | string',
    description:
      'Sizing. A number is pixels (`width={240}` → `240px`); a string passes through (`width="100%"`).',
  },
  {
    name: 'minWidth / minHeight / maxWidth / maxHeight',
    type: 'number | string',
    description: 'Min / max sizing constraints, same number-vs-string rule.',
  },
  {
    name: 'overflow',
    type: `'visible' | 'hidden' | 'clip' | 'scroll' | 'auto'`,
    description: 'Sets the overflow behaviour on both axes.',
  },
  {
    name: 'bg',
    type: `'transparent' | 'surface' | 'surface-muted' | 'surface-subtle' | 'surface-elevated' | 'surface-inverse' | 'brand' | 'brand-muted' | '*-muted'`,
    description:
      'Semantic background token (maps to `--color-surface-*`). Themes automatically under [data-theme="dark"].',
  },
  {
    name: 'radius',
    type: `'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'`,
    description: 'Corner radius token (maps to `--radius-*`).',
  },
  {
    name: 'border',
    type: `boolean | 'default' | 'muted' | 'strong' | 'brand' | 'success' | 'warning' | 'critical'`,
    description:
      'A 1px border in a stroke tone. `true` is shorthand for `"default"`.',
  },
  {
    name: 'shadow',
    type: `'none' | 'level1' … 'level6'`,
    description: 'Elevation shadow token (maps to `--shadow-*`).',
  },
  {
    name: 'style',
    type: 'CSSProperties',
    description:
      'Standard inline style. Merged over the token-derived style — your values win per property.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Forwarded to the rendered element. Box adds no classes of its own.',
  },
  {
    name: 'ref',
    type: 'Ref to the rendered element',
    description: 'Forwarded to the underlying element (or the one named by `as`).',
  },
  {
    name: '...rest',
    type: 'Attributes of the rendered element',
    description:
      'Anything else (id, role, aria-*, data-*, event handlers) forwards through to the element.',
  },
]

export function BoxPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Box
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Box"
          knobs={BOX_KNOBS}
          render={(v) => (
            <Box
              p={Number(v.p) as 0}
              bg={v.bg as 'surface'}
              radius={v.radius as 'lg'}
              shadow={v.shadow as 'level1'}
              border={v.border === true}
              width={220}
            >
              <Text variant="body-sm" color="secondary">
                A Box is just a styled element. Tweak the knobs to see the
                box-model props compose.
              </Text>
            </Box>
          )}
          code={(v) => {
            const attrs = [`p={${v.p}}`, `bg="${v.bg}"`, `radius="${v.radius}"`]
            if (v.shadow !== 'none') attrs.push(`shadow="${v.shadow}"`)
            if (v.border === true) attrs.push('border')
            return `<Box ${attrs.join(' ')}>\n  …\n</Box>`
          }}
        />
      </section>

      {/* ── Spacing scale ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Spacing scale · p / m props</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {SPACE_SCALE.map(({ step, px }) => (
            <div
              key={step}
              className="grid grid-cols-[80px_80px_1fr] items-center gap-6 border-b border-stroke-muted px-6 py-3 last:border-0"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {step}
              </Text>
              <Text variant="body-xs" fontFamily="mono" color="muted">
                {px}
              </Text>
              <Box display="flex" style={{ alignItems: 'center' }}>
                <Box
                  height={16}
                  width={px === '0' ? 2 : px}
                  bg="brand"
                  radius="xs"
                />
              </Box>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          A numeric prop is a scale step — <code>p={'{4}'}</code> resolves to{' '}
          <code>var(--space-4)</code>. Pass a string for anything off-scale:{' '}
          <code>p=&quot;2rem&quot;</code>, <code>mx=&quot;auto&quot;</code>.
        </Text>
      </section>

      {/* ── Padding shorthands ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Padding shorthands · side &gt; axis &gt; all</SectionHeader>
        <PreviewRow
          code={`<Box p={4}>all sides</Box>
<Box px={6} py={2}>axis: px + py</Box>
<Box p={2} pl={8}>shorthand + side override</Box>`}
        >
          <Box bg="surface-elevated" border radius="md" p={4}>
            <Box bg="brand-muted" radius="sm">
              <Text variant="body-xs" fontFamily="mono">p={'{4}'}</Text>
            </Box>
          </Box>
          <Box bg="surface-elevated" border radius="md" px={6} py={2}>
            <Box bg="brand-muted" radius="sm">
              <Text variant="body-xs" fontFamily="mono">px={'{6}'} py={'{2}'}</Text>
            </Box>
          </Box>
          <Box bg="surface-elevated" border radius="md" p={2} pl={8}>
            <Box bg="brand-muted" radius="sm">
              <Text variant="body-xs" fontFamily="mono">p={'{2}'} pl={'{8}'}</Text>
            </Box>
          </Box>
        </PreviewRow>
      </section>

      {/* ── Background tokens ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Background tokens</SectionHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BG_TOKENS.map(({ name, inverseText }) => (
            <Box key={name} bg={name} radius="lg" border p={4} minHeight={72}>
              <Text
                variant="body-xs"
                fontFamily="mono"
                fontWeight="semibold"
                className={inverseText ? 'text-content-inverse' : undefined}
                color={inverseText ? 'inherit' : 'primary'}
              >
                {name}
              </Text>
            </Box>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Each <code>bg</code> token maps to a <code>--color-surface-*</code> variable, so
          every Box re-themes under dark mode with no extra work.
        </Text>
      </section>

      {/* ── Radius ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Radius</SectionHeader>
        <div className="flex flex-wrap items-end gap-4">
          {RADII.map((r) => (
            <div key={r} className="flex flex-col items-center gap-2">
              <Box bg="brand-muted" border="brand" radius={r} width={64} height={64} />
              <Text variant="body-xs" fontFamily="mono" color="muted">
                {r}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shadow ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Shadow · elevation</SectionHeader>
        <div className="flex flex-wrap gap-6 rounded-xl bg-surface-muted p-8">
          {SHADOWS.map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <Box bg="surface-elevated" radius="lg" shadow={s} width={72} height={72} />
              <Text variant="body-xs" fontFamily="mono" color="muted">
                {s}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Border tones ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Border tones</SectionHeader>
        <div className="flex flex-wrap gap-4">
          {BORDER_TONES.map((t) => (
            <div key={t} className="flex flex-col items-center gap-2">
              <Box bg="surface" border={t} radius="md" width={88} height={56} />
              <Text variant="body-xs" fontFamily="mono" color="muted">
                {t}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>border</code> (or <code>border={'{true}'}</code>) is the default tone;
          pass a string for any other stroke token.
        </Text>
      </section>

      {/* ── Polymorphism ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Polymorphism · the `as` prop</SectionHeader>
        <PreviewRow
          code={`{/* Renders a real <section> with a token background */}
<Box as="section" aria-label="Summary" p={5} bg="surface-muted" radius="lg">
  …
</Box>

{/* Renders an anchor — TS now accepts href */}
<Box as="a" href="/pricing" display="inline-block" p={3} bg="brand-muted" radius="md">
  View pricing
</Box>`}
        >
          <Box as="section" aria-label="Summary" p={5} bg="surface-muted" radius="lg" width="100%">
            <Text variant="body-sm" color="secondary">
              This is a semantic <code>&lt;section&gt;</code> rendered by Box.
            </Text>
          </Box>
          <Box
            as="a"
            href="#box"
            display="inline-block"
            p={3}
            bg="brand-muted"
            radius="md"
            border="brand"
          >
            <Text variant="body-sm" fontWeight="semibold" color="primary">
              View pricing →
            </Text>
          </Box>
        </PreviewRow>
      </section>

      {/* ── In context · composing layout ───────────────────────────── */}
      <section>
        <SectionHeader>In context · a card, built from Box</SectionHeader>
        <PreviewRow
          code={`<Box bg="surface-elevated" border radius="xl" shadow="level1" maxWidth={360} overflow="hidden">
  <Box height={120} bg="brand-muted" />
  <Box p={5}>
    <Text variant="heading-sm" fontWeight="bold" gutterBottom>Window seat, please</Text>
    <Text variant="body-sm" color="secondary">
      Box owns spacing, surface, radius, and elevation — no bespoke CSS.
    </Text>
    <Box display="flex" mt={4} style={{ gap: 'var(--space-2)' }}>
      <Box px={3} py={1} bg="success-muted" radius="full">
        <Text variant="body-xs" fontWeight="semibold" color="success">Refundable</Text>
      </Box>
      <Box px={3} py={1} bg="surface-subtle" radius="full">
        <Text variant="body-xs" fontWeight="semibold" color="secondary">Direct</Text>
      </Box>
    </Box>
  </Box>
</Box>`}
        >
          <Box
            bg="surface-elevated"
            border
            radius="xl"
            shadow="level1"
            maxWidth={360}
            width="100%"
            overflow="hidden"
          >
            <Box height={120} bg="brand-muted" />
            <Box p={5}>
              <Text variant="heading-sm" fontWeight="bold" gutterBottom>
                Window seat, please
              </Text>
              <Text variant="body-sm" color="secondary">
                Box owns spacing, surface, radius, and elevation — no bespoke CSS.
              </Text>
              <Box display="flex" mt={4} style={{ gap: 'var(--space-2)' }}>
                <Box px={3} py={1} bg="success-muted" radius="full">
                  <Text variant="body-xs" fontWeight="semibold" color="success">
                    Refundable
                  </Text>
                </Box>
                <Box px={3} py={1} bg="surface-subtle" radius="full">
                  <Text variant="body-xs" fontWeight="semibold" color="secondary">
                    Direct
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </PreviewRow>
      </section>

      {/* ── Props ───────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Props</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
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
          {BOX_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <div className="flex min-w-0 flex-col gap-1.5">
                <Text
                  variant="body-xs"
                  fontFamily="mono"
                  color="secondary"
                  className="wrap-break-word"
                >
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
      </section>

      {/* ── Import / usage ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Box } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import Box from '@swift/components/Box'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Box, type BoxProps, type SpaceValue } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Box p={4} bg="surface-muted" radius="lg">Content</Box>

// Spacing scale (number) vs raw CSS (string)
<Box px={6} py={2} mx="auto" maxWidth={640} />

// Surface + elevation
<Box bg="surface-elevated" border radius="xl" shadow="level2" />

// Polymorphic
<Box as="section" aria-label="Summary" p={5} />
<Box as="a" href="/pricing" display="inline-block" p={3} />`}
        />
      </section>
    </div>
  )
}
