import { useState, type ComponentType } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, Card, Text } from '@swift/components'
import {
  Add,
  ArrowRight,
  Check,
  CreditCard,
  Delete,
  Document,
  Edit,
  Person,
  Search,
  Settings,
  Star,
} from '@swift/icons'
import { CopyableImport } from '../lib/CopyableImport'

type IconComponent = ComponentType<{ size?: number; className?: string }>

export const Route = createFileRoute('/components')({
  component: RouteComponent,
})

type ComponentName = 'Button' | 'Card' | 'Text'

const components: Array<{ name: ComponentName; icon: IconComponent; description: string }> = [
  {
    name: 'Button',
    icon: Check,
    description:
      'Clickable affordance built as a compound component. Six variants, three sizes, polymorphic via `as`, loading + icon-only states, slot-level className overrides, and a built-in ripple.',
  },
  {
    name: 'Card',
    icon: CreditCard,
    description:
      'Container with optional title and footer slots. Body renders any children — use it to group related content.',
  },
  {
    name: 'Text',
    icon: Document,
    description:
      'Typography primitive with semantic variants, font weight/family, alignment, color tokens, gutter, ellipsis, per-variant tag mapping, and a polymorphic render prop.',
  },
]

function RouteComponent() {
  const [selected, setSelected] = useState<ComponentName>('Button')

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">
      <aside className="flex w-72 shrink-0 flex-col border-r border-stroke bg-surface">
        <div className="border-b border-stroke px-4 py-3.5">
          <Text variant="body-sm" fontWeight="semibold">
            @swift/components
          </Text>
          <Text variant="body-xs" color="muted" className="block">
            {components.length} components
          </Text>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="space-y-0.5">
            {components.map(({ name, icon: Icon }) => {
              const isActive = name === selected
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => setSelected(name)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'font-medium text-content hover:bg-surface-muted'
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
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

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded bg-surface-inverse p-3 text-xs leading-relaxed text-content-inverse">
      {code}
    </pre>
  )
}

function PreviewRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-stroke bg-surface-muted p-4">
      {children}
    </div>
  )
}

const BUTTON_VARIANTS: ReadonlyArray<{
  name: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'
  use: string
}> = [
  { name: 'primary', use: 'Main CTA · highest emphasis' },
  { name: 'secondary', use: 'Supporting action · subtle surface' },
  { name: 'outline', use: 'Neutral action · stroke-only affordance' },
  { name: 'ghost', use: 'Minimal · for toolbars and dense UI' },
  { name: 'danger', use: 'Destructive · delete, remove, irreversible' },
  { name: 'link', use: 'Looks like text · inline navigation' },
]

const BUTTON_SIZES: ReadonlyArray<{
  size: 'sm' | 'md' | 'lg'
  height: string
  iconPx: number
}> = [
  { size: 'sm', height: '32px', iconPx: 14 },
  { size: 'md', height: '40px', iconPx: 16 },
  { size: 'lg', height: '48px', iconPx: 20 },
]

const BUTTON_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'variant',
    type: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link'`,
    defaultValue: `'primary'`,
    description:
      'Visual emphasis level. Each variant maps to a fixed combination of surface, content, and stroke tokens — so all variants theme together under [data-theme="dark"].',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg'`,
    defaultValue: `'md'`,
    description:
      'Fixed-height sizing: 32 / 40 / 48 px. Drives padding, font size, gap, and border radius. The link variant ignores height/padding so it can sit on a baseline.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Replaces content with a centred spinner while preserving the button width. Sets aria-busy, blocks clicks and ripple. Pair with a stable label so screen readers do not announce a new control.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Standard disabled state. On a native <button> it forwards the disabled attribute; on a non-native element (e.g. as="a"), it sets aria-disabled and tabIndex=-1.',
  },
  {
    name: 'iconOnly',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Square padding for an icon-only affordance. The consumer MUST also pass an aria-label — there is no visible text to read.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Spans the full width of the parent flex/grid track. Useful in mobile-first forms and modal footers.',
  },
  {
    name: 'as',
    type: 'ElementType',
    defaultValue: `'button'`,
    description:
      'Polymorphic element override. Use "a" for external links, or a router component like TanStack/React Router Link for client-side navigation. TypeScript narrows the rest of the props to that element.',
  },
  {
    name: 'disableRipple',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Suppresses the click ripple. Already suppressed automatically for the link variant and during loading.',
  },
  {
    name: 'classes',
    type: '{ root?, label?, leftIcon?, rightIcon?, loader? }',
    description:
      'Slot-level className overrides. Composes with the built-in classes — your overrides win cascade order. Prefer this to deep CSS selectors.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Appended to the root after variant/size classes. Equivalent to classes.root — use whichever reads cleaner at the call site.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Render any combination of <Button.LeftIcon>, raw text or <Button.Label>, and <Button.RightIcon>. Ordering is whatever you write — full layout control.',
  },
  {
    name: 'onClick',
    type: '(e: MouseEvent<HTMLElement>) => void',
    description:
      'Standard click handler. Short-circuited when disabled or loading — your handler will not fire and the ripple is suppressed.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLElement>',
    description:
      'Forwarded to the rendered element. Useful for focus management, animations, and tooltip anchors.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes of the rendered element',
    description:
      'Anything else (href, target, rel for anchors; type, form, name for buttons; id, role, aria-*, data-*, event handlers) forwards through.',
  },
]

function ButtonPanel() {
  const info = components[0]
  const [demoLoading, setDemoLoading] = useState(false)

  const triggerLoading = () => {
    setDemoLoading(true)
    window.setTimeout(() => setDemoLoading(false), 1500)
  }

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Button
        </Text>
        <Text variant="para-lg" color="secondary">
          {info.description}
        </Text>
      </header>

      <section>
        <SectionHeader>Variants</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {BUTTON_VARIANTS.map(({ name, use }) => (
            <div
              key={name}
              className="grid grid-cols-[140px_1fr_minmax(160px,auto)] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {use}
              </Text>
              <div className="flex justify-end">
                <Button variant={name}>
                  {name === 'danger' ? (
                    <>
                      <Button.LeftIcon><Delete size={16} /></Button.LeftIcon>
                      Delete account
                    </>
                  ) : name === 'link' ? (
                    'Learn more'
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Sizes</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {BUTTON_SIZES.map(({ size, height, iconPx }) => (
            <div
              key={size}
              className="grid grid-cols-[80px_180px_1fr] items-center gap-6 border-b border-stroke-muted px-6 py-4 last:border-0"
            >
              <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                {size}
              </Text>
              <Text variant="body-xs" color="muted">
                h {height} · icon {iconPx}px
              </Text>
              <div className="flex items-end gap-3">
                <Button size={size}>Continue</Button>
                <Button variant="secondary" size={size}>
                  <Button.LeftIcon><Add size={iconPx} /></Button.LeftIcon>
                  Add item
                </Button>
                <Button variant="ghost" size={size} iconOnly aria-label="Search">
                  <Search size={iconPx} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>With icons · compound slots</SectionHeader>
        <PreviewRow>
          <Button>
            <Button.LeftIcon><Check size={16} /></Button.LeftIcon>
            Confirm
          </Button>
          <Button variant="secondary">
            <Button.LeftIcon><Person size={16} /></Button.LeftIcon>
            Profile
          </Button>
          <Button variant="ghost">
            Continue
            <Button.RightIcon><ArrowRight size={16} /></Button.RightIcon>
          </Button>
          <Button variant="outline">
            <Button.LeftIcon><Edit size={16} /></Button.LeftIcon>
            <Button.Label>Edit booking</Button.Label>
            <Button.RightIcon><ArrowRight size={16} /></Button.RightIcon>
          </Button>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The slots render in the order you write them — full layout control without ordering props.
        </Text>
      </section>

      <section>
        <SectionHeader>Icon-only</SectionHeader>
        <PreviewRow>
          <Button iconOnly aria-label="Add to favourites">
            <Star size={16} />
          </Button>
          <Button variant="secondary" iconOnly aria-label="Edit">
            <Edit size={16} />
          </Button>
          <Button variant="ghost" iconOnly aria-label="Settings">
            <Settings size={16} />
          </Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="Search">
            <Search size={14} />
          </Button>
          <Button variant="ghost" size="lg" iconOnly aria-label="Add">
            <Add size={20} />
          </Button>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Icon-only buttons must pass aria-label — there is no visible text for screen readers.
        </Text>
      </section>

      <section>
        <SectionHeader>Loading</SectionHeader>
        <PreviewRow>
          <Button loading>Saving…</Button>
          <Button variant="secondary" loading>
            Loading
          </Button>
          <Button variant="danger" loading>
            Deleting
          </Button>
          <Button onClick={triggerLoading} loading={demoLoading}>
            <Button.LeftIcon><Check size={16} /></Button.LeftIcon>
            Click to simulate
          </Button>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Content stays mounted but hidden — width is preserved so the layout never jumps. Clicks are suppressed and aria-busy is set.
        </Text>
      </section>

      <section>
        <SectionHeader>Polymorphism · the `as` prop</SectionHeader>
        <PreviewRow>
          <Button>Native button</Button>
          <Button as="a" href="https://example.com" target="_blank" rel="noreferrer">
            <Button.LeftIcon><ArrowRight size={16} /></Button.LeftIcon>
            External link
          </Button>
          <Button as={Link} to="/" variant="secondary">
            Router Link
          </Button>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Pass any element type or React component to <code>as</code>. TypeScript narrows the rest of the props to that element — only the anchor variant accepts <code>href</code>; only the router Link variant accepts <code>to</code>.
        </Text>
      </section>

      <section>
        <SectionHeader>Slot className overrides</SectionHeader>
        <PreviewRow>
          <Button
            classes={{
              root: 'rounded-full',
              leftIcon: 'text-content-highlight',
            }}
          >
            <Button.LeftIcon><Star size={16} /></Button.LeftIcon>
            Pill button
          </Button>
          <Button
            variant="secondary"
            classes={{ loader: 'text-content-brand' }}
            loading
          >
            Custom loader colour
          </Button>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Use the <code>classes</code> prop to target individual slots — root, label, leftIcon, rightIcon, loader. Composes with the built-in classes so you only override what you need.
        </Text>
      </section>

      <section>
        <SectionHeader>Full width</SectionHeader>
        <div className="max-w-md rounded-xl border border-stroke bg-surface-elevated p-4">
          <Button fullWidth>Save changes</Button>
        </div>
      </section>

      <section>
        <SectionHeader>Disabled</SectionHeader>
        <PreviewRow>
          <Button disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="outline" disabled>Outline</Button>
          <Button variant="ghost" disabled>Ghost</Button>
          <Button variant="danger" disabled>Danger</Button>
          <Button variant="link" disabled>Link</Button>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>In context · Form actions</SectionHeader>
        <div className="rounded-xl border border-stroke bg-surface-elevated p-6">
          <Text variant="heading-sm" fontWeight="semibold" gutterBottom>
            Confirm your booking
          </Text>
          <Text variant="body-sm" color="secondary" className="mb-5 block">
            Once confirmed, your seats are held for 20 minutes while we process payment.
          </Text>
          <div className="flex flex-wrap justify-end gap-2 border-t border-stroke-muted pt-4">
            <Button variant="ghost">Cancel</Button>
            <Button variant="outline">Save for later</Button>
            <Button>
              Confirm and pay
              <Button.RightIcon><ArrowRight size={16} /></Button.RightIcon>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>In context · Card with destructive action</SectionHeader>
        <div className="max-w-lg">
          <Card
            title="Saved card · Visa ····4242"
            footer={
              <div className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <Button.LeftIcon><Edit size={14} /></Button.LeftIcon>
                  Edit
                </Button>
                <Button variant="danger" size="sm">
                  <Button.LeftIcon><Delete size={14} /></Button.LeftIcon>
                  Remove
                </Button>
              </div>
            }
          >
            <Text variant="body-sm" color="secondary">
              Expires 09/27 · Used last on 14 May 2026 for IndiGo 6E 2134.
            </Text>
          </Card>
        </div>
      </section>

      <section>
        <SectionHeader>In context · Icon-only toolbar</SectionHeader>
        <div className="inline-flex items-center gap-1 rounded-lg border border-stroke bg-surface-elevated p-1">
          <Button variant="ghost" size="sm" iconOnly aria-label="Search">
            <Search size={14} />
          </Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="Add">
            <Add size={14} />
          </Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="Edit">
            <Edit size={14} />
          </Button>
          <span className="mx-1 h-5 w-px bg-stroke" aria-hidden />
          <Button variant="ghost" size="sm" iconOnly aria-label="Settings">
            <Settings size={14} />
          </Button>
        </div>
      </section>

      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Focus ring.</strong> All buttons show a 2px brand ring on keyboard focus. The native outline is replaced, not removed — Tab through the buttons above to see it.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Loading state.</strong> Sets <code>aria-busy=&quot;true&quot;</code>, blocks clicks, and keeps content mounted (invisible) so the announced label does not change mid-action.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Disabled state.</strong> Native buttons get the <code>disabled</code> attribute. With <code>as=&quot;a&quot;</code> there is no native disabled, so the component falls back to <code>aria-disabled</code> and <code>tabIndex=-1</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Icon-only.</strong> Requires <code>aria-label</code>. Decorative icons inside any button are marked <code>aria-hidden</code>.
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>Props</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
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
          {BUTTON_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
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
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {[
            {
              name: 'Button.LeftIcon',
              desc: 'Icon slot rendered before the label. Marked aria-hidden by default; accepts className and refs.',
            },
            {
              name: 'Button.Label',
              desc: 'Optional explicit wrapper for the text. Useful when you need a className or ref on the label itself — raw text children work fine without it.',
            },
            {
              name: 'Button.RightIcon',
              desc: 'Icon slot rendered after the label. Same shape as LeftIcon — the name only documents intent.',
            },
          ].map(({ name, desc }) => (
            <div
              key={name}
              className="grid gap-1 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[200px_1fr] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {desc}
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
            code={`import { Button } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import Button from '@swift/components/Button'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Button, type ButtonProps, type ButtonVariant } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Button>Primary</Button>
<Button variant="secondary" size="lg">Secondary</Button>

// Compound slots
<Button>
  <Button.LeftIcon><Check size={16} /></Button.LeftIcon>
  <Button.Label>Confirm</Button.Label>
  <Button.RightIcon><ArrowRight size={16} /></Button.RightIcon>
</Button>

// Loading — preserves width
<Button loading>Saving…</Button>

// Icon-only — requires aria-label
<Button iconOnly aria-label="Search">
  <Search size={16} />
</Button>

// Polymorphic
<Button as="a" href="/offers">Offers</Button>
<Button as={Link} to="/home">Home</Button>

// Slot overrides
<Button classes={{ root: 'rounded-full', loader: 'text-content-brand' }}>
  Pill
</Button>`}
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

function TextPanel() {
  const info = components[2]

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Text
        </Text>
        <Text variant="para-lg" color="secondary">
          {info.description}
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

function CardPanel() {
  const info = components[1]
  return (
    <div className="grid gap-8">
      <header>
        <Text variant="heading-lg" fontWeight="semibold" gutterBottom>
          Card
        </Text>
        <Text variant="body-sm" color="secondary">
          {info.description}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow>
          <Card>
            <Text variant="body-sm">
              A simple card with just a body. Drop any children in.
            </Text>
          </Card>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>With title</SectionHeader>
        <PreviewRow>
          <Card title="Account details">
            <Text variant="body-sm">
              The title slot renders above the body with a hairline divider.
            </Text>
          </Card>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>With title and footer</SectionHeader>
        <PreviewRow>
          <Card
            title="Confirm your trip"
            footer={
              <Button>
                Continue to payment
                <Button.RightIcon><ArrowRight size={16} /></Button.RightIcon>
              </Button>
            }
          >
            <Text variant="body-sm">
              Wrap actions or summary text in the footer slot. The body stays focused on content.
            </Text>
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
