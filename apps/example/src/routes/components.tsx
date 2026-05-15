import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Card, Text } from '@swift/components'
import { ArrowRight, Check, Person, Settings } from '@swift/icons'
import { CopyableImport } from '../lib/CopyableImport'

export const Route = createFileRoute('/components')({
  component: RouteComponent,
})

type ComponentName = 'Button' | 'Card' | 'Text'

const components: Array<{ name: ComponentName; description: string }> = [
  {
    name: 'Button',
    description:
      'Clickable affordance with primary, secondary, and ghost variants, three sizes, optional left/right icons, and a full-width option.',
  },
  {
    name: 'Card',
    description:
      'Container with optional title and footer slots. Body renders any children — use it to group related content.',
  },
  {
    name: 'Text',
    description:
      'Typography primitive with semantic variants, font weight/family, alignment, color tokens, gutter, ellipsis, per-variant tag mapping, and a polymorphic render prop.',
  },
]

function RouteComponent() {
  const [selected, setSelected] = useState<ComponentName>('Button')

  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-gray-950">
      <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-200 px-4 py-3.5 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            @swift/components
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {components.length} components
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="space-y-0.5">
            {components.map(({ name }) => {
              const isActive = name === selected
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => setSelected(name)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${isActive
                        ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                        : 'font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                  >
                    <span className="truncate">{name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {selected === 'Button' ? (
          <ButtonPanel />
        ) : selected === 'Card' ? (
          <CardPanel />
        ) : (
          <TextPanel />
        )}
      </main>
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {children}
    </h2>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded bg-gray-900 p-3 text-xs leading-relaxed text-gray-100 dark:border dark:border-gray-700">
      {code}
    </pre>
  )
}

function PreviewRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      {children}
    </div>
  )
}

function ButtonPanel() {
  const info = components[0]
  return (
    <div className="grid gap-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Button</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
      </header>

      <section>
        <SectionHeader>Variants</SectionHeader>
        <PreviewRow>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Sizes</SectionHeader>
        <PreviewRow>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>With icons</SectionHeader>
        <PreviewRow>
          <Button leftIcon={<Check size={16} />}>Confirm</Button>
          <Button variant="secondary" leftIcon={<Person size={16} />}>
            Profile
          </Button>
          <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
            Continue
          </Button>
          <Button leftIcon={<Settings size={16} />}>Settings</Button>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Full width</SectionHeader>
        <PreviewRow>
          <Button fullWidth>Save changes</Button>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Disabled</SectionHeader>
        <PreviewRow>
          <Button disabled>Primary</Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Button } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import Button from '@swift/components/Button'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Button>Primary</Button>
<Button variant="secondary" size="lg">Secondary</Button>
<Button leftIcon={<Check size={16} />}>Confirm</Button>
<Button fullWidth>Save changes</Button>`}
        />
      </section>
    </div>
  )
}

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

function SpecimenCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
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

function TextPanel() {
  const info = components[2]

  return (
    <div className="grid gap-10">
      <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Text
        </Text>
        <Text variant="para-lg" color="secondary">
          {info.description}
        </Text>
      </header>

      <section>
        <SectionHeader>Type ramp</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {TYPE_RAMP.map(({ variant, size, use }) => (
            <div
              key={variant}
              className="grid grid-cols-[180px_1fr] items-baseline gap-6 border-b border-gray-100 px-6 py-5 last:border-0 dark:border-gray-800"
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
        <article className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
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
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
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
              <div className="rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700">
                <Text variant="body-md" fontFamily="mono">
                  4242 4242 4242 4242
                </Text>
              </div>
              <Text variant="body-xs" color="muted">
                We never store your full card number.
              </Text>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {[
            { variant: 'heading-xl..xs', tag: 'h1 → h5' },
            { variant: 'para-*', tag: 'p' },
            { variant: 'body-*', tag: 'span' },
          ].map(({ variant, tag }) => (
            <div
              key={variant}
              className="flex items-center justify-between border-b border-gray-100 px-5 py-3 last:border-0 dark:border-gray-800"
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
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
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
            <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
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
            <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
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
                      className={`${props.className ?? ''} cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700`}
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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-950/40 md:grid">
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
              className="grid gap-2 border-b border-gray-100 px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6 dark:border-gray-800"
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

function CardPanel() {
  const info = components[1]
  return (
    <div className="grid gap-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Card</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow>
          <Card>
            <p className="m-0 text-sm text-gray-800">
              A simple card with just a body. Drop any children in.
            </p>
          </Card>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>With title</SectionHeader>
        <PreviewRow>
          <Card title="Account details">
            <p className="m-0 text-sm text-gray-800">
              The title slot renders above the body with a hairline divider.
            </p>
          </Card>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>With title and footer</SectionHeader>
        <PreviewRow>
          <Card
            title="Confirm your trip"
            footer={
              <Button rightIcon={<ArrowRight size={16} />}>Continue to payment</Button>
            }
          >
            <p className="m-0 text-sm text-gray-800">
              Wrap actions or summary text in the footer slot. The body stays focused on content.
            </p>
          </Card>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Card } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import Card from '@swift/components/Card'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Card title="Account details" footer={<Button>Save</Button>}>
  Body content goes here.
</Card>`}
        />
      </section>
    </div>
  )
}
