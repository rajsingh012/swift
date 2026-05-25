import type { ReactNode } from 'react'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, SectionHeader } from './shared'

const DESCRIPTION =
  'Typography primitive with semantic variants, font weight/family, alignment, color tokens, gutter, ellipsis, per-variant tag mapping, and a polymorphic render prop.'

const TYPE_RAMP: ReadonlyArray<{
  variant:
    | 'heading-xl'
    | 'heading-lg'
    | 'heading-md'
    | 'heading-sm'
    | 'heading-xs'
    | 'body-xl'
    | 'body-lg'
    | 'body-md'
    | 'body-sm'
    | 'body-xs'
    | 'para-lg'
    | 'para-md'
    | 'para-sm'
  size: string
  use: string
}> = [
  { variant: 'heading-xl', size: '40 / 44', use: 'Page hero' },
  { variant: 'heading-lg', size: '30 / 36', use: 'Section title' },
  { variant: 'heading-md', size: '24 / 30', use: 'Subsection' },
  { variant: 'heading-sm', size: '20 / 26', use: 'Card title' },
  { variant: 'heading-xs', size: '16 / 22', use: 'Group label' },
  { variant: 'body-xl', size: '20 / 28', use: 'Lead UI text' },
  { variant: 'body-lg', size: '18 / 28', use: 'Emphasised body' },
  { variant: 'body-md', size: '16 / 24', use: 'Default body' },
  { variant: 'body-sm', size: '14 / 20', use: 'Helper, hint' },
  { variant: 'body-xs', size: '12 / 16', use: 'Label, caption' },
  { variant: 'para-lg', size: '18 / 30', use: 'Lead paragraph' },
  { variant: 'para-md', size: '16 / 26', use: 'Article body' },
  { variant: 'para-sm', size: '14 / 24', use: 'Compact prose' },
]

const TEXT_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'variant',
    type: `'heading-xl' | 'heading-lg' | 'heading-md' | 'heading-sm' | 'heading-xs' | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'para-lg' | 'para-md' | 'para-sm'`,
    defaultValue: `'body-md'`,
    description:
      'Applies a named typographic style (font size, line-height, tracking). Determines the default semantic tag — heading-* → h1..h5, para-* → p, body-* → span.',
  },
  {
    name: 'fontWeight',
    type: `'normal' | 'medium' | 'semibold' | 'bold'`,
    description:
      'Sets the font weight independent of the variant. Useful for emphasising body text or de-emphasising a heading.',
  },
  {
    name: 'fontFamily',
    type: `'sans' | 'serif' | 'mono'`,
    description:
      'Overrides the font stack. Common use: mono for codes, references, and tabular values.',
  },
  {
    name: 'align',
    type: `'inherit' | 'left' | 'center' | 'right' | 'justify'`,
    defaultValue: `'inherit'`,
    description: 'Sets text alignment on the rendered element.',
  },
  {
    name: 'color',
    type: `'inherit' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error' | 'info'`,
    defaultValue: `'inherit'`,
    description:
      'Semantic color token. Each token maps to a Tailwind text color with a paired dark-mode value.',
  },
  {
    name: 'gutterBottom',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Adds a bottom margin of 0.35em to create breathing room beneath the element — most useful after headings.',
  },
  {
    name: 'noWrap',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Forces a single line and truncates overflowing text with an ellipsis.',
  },
  {
    name: 'variantMapping',
    type: 'Partial<Record<TextVariant, keyof JSX.IntrinsicElements>>',
    description:
      'Overrides the default HTML tag for a variant. E.g. {"heading-lg": "h1"} promotes a card title to the page H1 without changing its visual style.',
  },
  {
    name: 'render',
    type: 'ReactElement | (props) => ReactElement',
    description:
      'Polymorphic escape hatch. Pass an element to clone it with merged className/ref/handlers, or a function to fully control the rendered node.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Additional CSS classes appended after the variant and modifier classes — your styles win the cascade.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLElement>',
    description:
      'Forwarded to the root element (or the element returned by render).',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes<HTMLElement>',
    description:
      'All other standard HTML attributes (id, role, aria-*, data-*, event handlers, etc.) are forwarded to the rendered element.',
  },
]

function SpecimenCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-stroke bg-surface-elevated p-5">
      <Text
        variant="body-xs"
        fontWeight="semibold"
        color="muted"
        className="mb-3 block tracking-wider uppercase"
      >
        {label}
      </Text>
      {children}
    </div>
  )
}

export function TextPanel() {
  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Text
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Type ramp</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {TYPE_RAMP.map(({ variant, size, use }) => (
            <div
              key={variant}
              className="grid grid-cols-[180px_1fr] items-baseline gap-6 border-b border-stroke-muted px-6 py-5 last:border-0"
            >
              <div className="flex flex-col gap-0.5">
                <Text
                  variant="body-xs"
                  fontFamily="mono"
                  fontWeight="semibold"
                  color="primary"
                >
                  {variant}
                </Text>
                <Text variant="body-xs" color="muted">
                  {size} · {use}
                </Text>
              </div>
              <Text
                variant={variant}
                fontWeight={variant.startsWith('heading') ? 'bold' : 'normal'}
              >
                The quick brown fox jumps over the lazy dog
              </Text>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>In context · Editorial</SectionHeader>
        <article className="rounded-xl border border-stroke bg-surface-elevated p-8">
          <Text
            variant="body-xs"
            fontWeight="bold"
            color="primary"
            gutterBottom
            className="tracking-widest uppercase"
          >
            Design systems
          </Text>
          <Text variant="heading-xl" fontWeight="bold" gutterBottom>
            Typography as a system, not a setting
          </Text>
          <Text variant="para-lg" color="secondary" gutterBottom>
            A consistent type scale removes hundreds of micro-decisions from
            your design process. Define it once, and every screen inherits the
            same rhythm.
          </Text>
          <Text variant="para-md" gutterBottom>
            Most apps end up with a long tail of one-off font sizes — 13px
            here, 17px there — because designers reach for whatever feels right
            in the moment. The fix is to ramp size and weight together, in
            steps that read clearly at every level: hero, section, body, hint.
          </Text>
          <Text variant="body-sm" color="muted">
            Published May 14, 2026 · 4 min read
          </Text>
        </article>
      </section>

      <section>
        <SectionHeader>In context · UI surface</SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stroke bg-surface-elevated p-6">
            <Text variant="heading-sm" fontWeight="semibold" gutterBottom>
              Payment details
            </Text>
            <Text variant="body-sm" color="secondary" className="mb-4 block">
              Add a card for your subscription. You can change or remove it
              anytime.
            </Text>
            <div className="grid gap-1.5">
              <Text
                variant="body-xs"
                fontWeight="semibold"
                color="secondary"
                className="tracking-wide uppercase"
              >
                Card number
              </Text>
              <div className="rounded-md border border-stroke-strong px-3 py-2">
                <Text variant="body-md" fontFamily="mono">
                  4242 4242 4242 4242
                </Text>
              </div>
              <Text variant="body-xs" color="muted">
                We never store your full card number.
              </Text>
            </div>
          </div>

          <div className="rounded-xl border border-stroke bg-surface-elevated p-6">
            <Text
              variant="body-xs"
              fontWeight="bold"
              color="success"
              gutterBottom
              className="tracking-widest uppercase"
            >
              On time
            </Text>
            <Text variant="heading-md" fontWeight="bold">
              Delhi → Bengaluru
            </Text>
            <Text variant="body-sm" color="secondary" className="mb-4 block">
              IndiGo · 6E 2134 · 2h 45m
            </Text>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text
                  variant="body-xs"
                  color="muted"
                  fontWeight="semibold"
                  className="tracking-wide uppercase"
                >
                  Booking ref
                </Text>
                <Text variant="body-md" fontFamily="mono" fontWeight="semibold">
                  TRIP-8821-XK
                </Text>
              </div>
              <div>
                <Text
                  variant="body-xs"
                  color="muted"
                  fontWeight="semibold"
                  className="tracking-wide uppercase"
                >
                  Departs
                </Text>
                <Text variant="body-md" fontWeight="semibold">
                  Tue, 14 May · 08:35
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Font weight</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(['normal', 'medium', 'semibold', 'bold'] as const).map((w) => (
            <SpecimenCard key={w} label={w}>
              <Text variant="heading-lg" fontWeight={w}>
                Aa
              </Text>
              <Text variant="body-sm" fontWeight={w} color="secondary">
                The quick brown fox
              </Text>
            </SpecimenCard>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Font family</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-3">
          {(['sans', 'serif', 'mono'] as const).map((f) => (
            <SpecimenCard key={f} label={f}>
              <Text variant="heading-xl" fontFamily={f} fontWeight="semibold">
                Aa
              </Text>
              <Text variant="body-sm" fontFamily={f} color="secondary">
                The quick brown fox
              </Text>
            </SpecimenCard>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Color tokens</SectionHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              'primary',
              'secondary',
              'muted',
              'success',
              'warning',
              'error',
              'info',
              'inherit',
            ] as const
          ).map((c) => (
            <SpecimenCard key={c} label={c}>
              <Text variant="body-lg" color={c} fontWeight="semibold">
                Sample text
              </Text>
            </SpecimenCard>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Align</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['left', 'center', 'right', 'justify'] as const).map((a) => (
            <SpecimenCard key={a} label={a}>
              <Text variant="para-md" align={a}>
                The quick brown fox jumps over the lazy dog. The quick brown
                fox jumps over the lazy dog.
              </Text>
            </SpecimenCard>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Modifiers · gutterBottom</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <SpecimenCard label="without">
            <Text variant="heading-md" fontWeight="bold">
              Section title
            </Text>
            <Text variant="para-md">
              Body sits flush against the heading — tight rhythm.
            </Text>
          </SpecimenCard>
          <SpecimenCard label="with gutterBottom">
            <Text variant="heading-md" fontWeight="bold" gutterBottom>
              Section title
            </Text>
            <Text variant="para-md">
              Body has breathing room from the heading.
            </Text>
          </SpecimenCard>
        </div>
      </section>

      <section>
        <SectionHeader>Modifiers · noWrap</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <SpecimenCard label="default · wraps">
            <div className="w-full max-w-72">
              <Text variant="body-md">
                This is a long sentence that wraps onto multiple lines inside
                a constrained container.
              </Text>
            </div>
          </SpecimenCard>
          <SpecimenCard label="noWrap · truncates">
            <div className="w-full max-w-72">
              <Text variant="body-md" noWrap>
                This is a long sentence that wraps onto multiple lines inside
                a constrained container.
              </Text>
            </div>
          </SpecimenCard>
        </div>
      </section>

      <section>
        <SectionHeader>Semantic tag mapping</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {[
            { variant: 'heading-xl..xs', tag: 'h1 → h5' },
            { variant: 'para-*', tag: 'p' },
            { variant: 'body-*', tag: 'span' },
          ].map(({ variant, tag }) => (
            <div
              key={variant}
              className="flex items-center justify-between border-b border-stroke-muted px-5 py-3 last:border-0"
            >
              <Text variant="body-sm" fontFamily="mono" color="primary">
                {variant}
              </Text>
              <Text variant="body-sm" color="muted">
                renders as
              </Text>
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold">
                &lt;{tag}&gt;
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Override per call with the <code>variantMapping</code> prop or per
          element with the <code>render</code> prop.
        </Text>
      </section>

      <section>
        <SectionHeader>Polymorphism · variantMapping & render</SectionHeader>
        <div className="rounded-xl border border-stroke bg-surface-elevated p-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-4">
              <Text variant="body-xs" color="muted" fontFamily="mono">
                variantMapping={'{'}{`'body-md': 'strong'`}{'}'}
              </Text>
              <Text
                variant="body-md"
                variantMapping={{ 'body-md': 'strong' }}
                fontWeight="bold"
              >
                Important inline text
              </Text>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-stroke-muted pt-4">
              <Text variant="body-xs" color="muted" fontFamily="mono">
                render={'{<a href />}'}
              </Text>
              <Text
                variant="body-md"
                fontWeight="semibold"
                color="primary"
                render={<a href="#" className="underline" />}
              >
                Read the docs
              </Text>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-stroke-muted pt-4">
              <Text variant="body-xs" color="muted" fontFamily="mono">
                render={'{(p) => <button {...p} />}'}
              </Text>
              <Text
                variant="body-md"
                fontWeight="semibold"
                render={(props) => {
                  const { ref: _ref, ...rest } = props
                  return (
                    <button
                      type="button"
                      {...rest}
                      className={`${props.className ?? ''} cursor-pointer rounded-md bg-surface-brand px-3 py-1.5 text-content-on-brand hover:opacity-90`}
                    />
                  )
                }}
              >
                Continue
              </Text>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Props</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
            <Text
              variant="body-xs"
              fontWeight="bold"
              color="secondary"
              className="tracking-wider uppercase"
            >
              Prop
            </Text>
            <Text
              variant="body-xs"
              fontWeight="bold"
              color="secondary"
              className="tracking-wider uppercase"
            >
              Type
            </Text>
            <Text
              variant="body-xs"
              fontWeight="bold"
              color="secondary"
              className="tracking-wider uppercase"
            >
              Default
            </Text>
          </div>
          {TEXT_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
            >
              <div className="flex flex-col gap-1">
                <Text
                  variant="body-sm"
                  fontFamily="mono"
                  fontWeight="semibold"
                  color="primary"
                >
                  {name}
                </Text>
              </div>
              <div className="flex flex-col gap-1.5">
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

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Text } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import Text from '@swift/components/Text'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Text variant="heading-lg" fontWeight="bold" gutterBottom>Title</Text>
<Text variant="para-md" align="justify">Paragraph body copy.</Text>
<Text variant="body-sm" color="error">Something went wrong.</Text>
<Text variant="body-md" noWrap>Long text that gets truncated…</Text>
<Text variant="heading-lg" variantMapping={{ 'heading-lg': 'h1' }}>Page title</Text>
<Text variant="body-md" render={<a href="/x" />}>Link</Text>
<Text variant="body-md" render={(p) => <button {...p} />}>Click</Text>`}
        />
      </section>
    </div>
  )
}
