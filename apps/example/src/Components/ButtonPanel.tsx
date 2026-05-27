import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@swift/components/Button'
import { Card } from '@swift/components/Card'
import { Text } from '@swift/components/Text'
import { Add } from '@swift/icons/Add'
import { ArrowRight } from '@swift/icons/ArrowRight'
import { Check } from '@swift/icons/Check'
import { Delete } from '@swift/icons/Delete'
import { Edit } from '@swift/icons/Edit'
import { Person } from '@swift/icons/Person'
import { Search } from '@swift/icons/Search'
import { Settings } from '@swift/icons/Settings'
import { Star } from '@swift/icons/Star'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Clickable affordance built as a compound component. Six variants, three sizes, polymorphic via `as`, loading + icon-only states, slot-level className overrides, and a built-in ripple.'

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
    type: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link' | 'unstyled'`,
    defaultValue: `'primary'`,
    description:
      'Visual emphasis level. Each variant maps to a fixed combination of surface, content, and stroke tokens — so all variants theme together under [data-theme="dark"]. Use "unstyled" to skip all chrome and size classes (primitive mode for compound triggers and custom CTAs).',
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

export function ButtonPanel() {
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
          {DESCRIPTION}
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
        <SectionHeader>Unstyled · primitive mode</SectionHeader>
        <PreviewRow>
          <Button
            variant="unstyled"
            className="rounded-full bg-linear-to-r from-violet-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
          >
            Fully custom CTA
          </Button>
          <Button
            variant="unstyled"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-content-strong hover:bg-surface-muted focus-visible:bg-surface-muted"
          >
            <Star size={16} className="text-content-highlight" />
            Row-style affordance
          </Button>
          <Button
            variant="unstyled"
            className="w-full justify-between gap-3 px-5 py-4 text-left text-base font-semibold text-content-strong hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stroke-brand [&>span:first-child]:w-full [&>span:first-child]:justify-between"
          >
            Section trigger
            <ArrowRight size={16} />
          </Button>
        </PreviewRow>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Use <code>variant=&quot;unstyled&quot;</code> when Button&apos;s default chrome (radius, size, font, ring, ripple) gets in the way — compound triggers like Accordion or Tabs, row-style affordances, or fully bespoke CTAs. You keep the structural behavior (focus management, <code>disabled</code> handling, polymorphism via <code>as</code>, accessibility) and own every visual decision via <code>className</code>.
        </Text>
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
          <Card>
            <Card.Header divider>
              <Card.Title>Saved card · Visa ····4242</Card.Title>
            </Card.Header>
            <Card.Content>
              <Text variant="body-sm" color="secondary">
                Expires 09/27 · Used last on 14 May 2026 for IndiGo 6E 2134.
              </Text>
            </Card.Content>
            <Card.Footer divider muted>
              <div className="flex w-full justify-between">
                <Button variant="ghost" size="sm">
                  <Button.LeftIcon><Edit size={14} /></Button.LeftIcon>
                  Edit
                </Button>
                <Button variant="danger" size="sm">
                  <Button.LeftIcon><Delete size={14} /></Button.LeftIcon>
                  Remove
                </Button>
              </div>
            </Card.Footer>
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
