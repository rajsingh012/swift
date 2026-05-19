import { useState } from 'react'
import { Accordion, Text } from '@swift/components'
import { ExpandMore } from '@swift/icons'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, SectionHeader } from './shared'

const DESCRIPTION =
  'Compound accordion with single/multiple expansion, controlled/uncontrolled state, collapsible mode, keyboard roving focus, render-prop based asChild, and data-state driven CSS animation.'

const ACCORDION_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
  {
    name: 'type',
    type: `'single' | 'multiple'`,
    defaultValue: `'single'`,
    description:
      'Determines whether one panel or many panels can be open at once. Drives whether value is a string or string[].',
  },
  {
    name: 'collapsible',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When type="single", allows the currently open panel to be closed by clicking its trigger. With type="multiple" this is implicit (always true).',
  },
  {
    name: 'value / defaultValue',
    type: `string | null  |  string[]`,
    description:
      'Controlled / uncontrolled open state. Shape follows type — null/string for single, array for multiple.',
  },
  {
    name: 'onValueChange',
    type: `(value) => void`,
    description: 'Fires whenever the open set changes. Argument shape matches type.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disables every item in the accordion in one place.',
  },
]

const ACCORDION_PARTS: ReadonlyArray<{ name: string; desc: string }> = [
  {
    name: 'Accordion',
    desc: 'Root. Owns open state and keyboard focus ring. Renders a flex column of items.',
  },
  {
    name: 'Accordion.Item',
    desc: 'Section wrapper. Exposes data-state and data-disabled. Required value prop is the item id used by the root.',
  },
  {
    name: 'Accordion.Header',
    desc: 'Heading wrapper around the trigger. Defaults to <h3>; override with as.',
  },
  {
    name: 'Accordion.Trigger',
    desc: 'Toggle button. Wires aria-expanded/aria-controls automatically. Pass render to clone into a custom element.',
  },
  {
    name: 'Accordion.Content',
    desc: 'Collapsible region. Always mounted so the open/close height transition can run smoothly; hidden from a11y when closed via aria-hidden.',
  },
]

export function AccordionPanel() {
  const [multiple, setMultiple] = useState<string[]>(['shipping'])

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Accordion
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Single · collapsible</SectionHeader>
        <Accordion type="single" collapsible defaultValue="overview">
          <Accordion.Item value="overview">
            <Accordion.Header>
              <Accordion.Trigger>
                What is Swift?
                <ExpandMore
                  size={18}
                  className="text-content-muted transition-transform group-data-[state=open]/accordion-item:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text variant="body-sm" color="secondary">
                Swift is a small design system: icons, components, and tokens — all in one place.
                The Accordion is one of its compound components.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="install">
            <Accordion.Header>
              <Accordion.Trigger>
                How do I install it?
                <ExpandMore
                  size={18}
                  className="text-content-muted transition-transform group-data-[state=open]/accordion-item:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text variant="body-sm" color="secondary">
                Install <code>@swift/components</code> and import the styles once at the root of your
                app. Then import individual components by name.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="theme">
            <Accordion.Header>
              <Accordion.Trigger>
                Does it support dark mode?
                <ExpandMore
                  size={18}
                  className="text-content-muted transition-transform group-data-[state=open]/accordion-item:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text variant="body-sm" color="secondary">
                Yes — toggle <code>data-theme=&quot;dark&quot;</code> on any ancestor element and every
                token re-resolves automatically.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Only one panel open at a time. <code>collapsible</code> lets the active panel close again
          when you click its trigger.
        </Text>
      </section>

      <section>
        <SectionHeader>Multiple · controlled</SectionHeader>
        <Accordion
          type="multiple"
          value={multiple}
          onValueChange={setMultiple}
        >
          {[
            {
              v: 'shipping',
              q: 'Shipping & delivery',
              a: 'Orders ship within two business days. Tracking is emailed when the label is created.',
            },
            {
              v: 'returns',
              q: 'Returns & exchanges',
              a: 'Send anything back within 30 days for a full refund — no questions asked.',
            },
            {
              v: 'support',
              q: 'Customer support',
              a: 'Reach us at help@example.com, or via chat in the bottom-right of every page.',
            },
          ].map(({ v, q, a }) => (
            <Accordion.Item key={v} value={v}>
              <Accordion.Header>
                <Accordion.Trigger>
                  {q}
                  <ExpandMore
                    size={18}
                    className="text-content-muted transition-transform group-data-[state=open]/accordion-item:rotate-180"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                <Text variant="body-sm" color="secondary">
                  {a}
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Open: <code>{multiple.length ? multiple.join(', ') : '∅'}</code>. State is fully owned by
          the parent — the accordion is a thin view.
        </Text>
      </section>

      <section>
        <SectionHeader>Disabled item</SectionHeader>
        <Accordion type="single" collapsible>
          <Accordion.Item value="enabled">
            <Accordion.Header>
              <Accordion.Trigger>
                Enabled section
                <ExpandMore
                  size={18}
                  className="text-content-muted transition-transform group-data-[state=open]/accordion-item:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text variant="body-sm" color="secondary">
                Clickable. The next item is disabled — keyboard navigation skips it.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="disabled" disabled>
            <Accordion.Header>
              <Accordion.Trigger>
                Disabled section
                <ExpandMore
                  size={18}
                  className="text-content-muted transition-transform group-data-[state=open]/accordion-item:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text variant="body-sm" color="secondary">
                You should not be able to reach this content.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="last">
            <Accordion.Header>
              <Accordion.Trigger>
                Another enabled section
                <ExpandMore
                  size={18}
                  className="text-content-muted transition-transform group-data-[state=open]/accordion-item:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text variant="body-sm" color="secondary">
                Try ArrowDown / ArrowUp from a trigger — focus jumps over the disabled item.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </section>

      <section>
        <SectionHeader>Render-as-child via render prop</SectionHeader>
        <Accordion type="single" collapsible>
          <Accordion.Item value="custom">
            <Accordion.Header as="h4">
              <Accordion.Trigger
                render={(props) => {
                  const { ref: _ref, ...rest } = props
                  return (
                    <button
                      {...rest}
                      className={`${props.className ?? ''} bg-surface-brand-muted text-content-brand hover:bg-surface-brand-muted/80`}
                    />
                  )
                }}
              >
                Custom trigger element
                <ExpandMore
                  size={18}
                  className="transition-transform group-data-[state=open]/accordion-item:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Text variant="body-sm" color="secondary">
                The <code>render</code> prop lets you clone the trigger into any element while
                keeping all data attributes, ARIA wiring, and event handlers.
              </Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </section>

      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {ACCORDION_PARTS.map(({ name, desc }) => (
            <div
              key={name}
              className="grid gap-1 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[220px_1fr] md:items-start md:gap-6"
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
        <SectionHeader>Root props</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
            <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">Prop</Text>
            <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">Type</Text>
            <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">Default</Text>
          </div>
          {ACCORDION_PROPS.map(({ name, type, defaultValue, description }) => (
            <div
              key={name}
              className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <div className="flex flex-col gap-1.5">
                <Text variant="body-xs" fontFamily="mono" color="secondary" className="wrap-break-word">
                  {type}
                </Text>
                <Text variant="body-sm" color="secondary">
                  {description}
                </Text>
              </div>
              <Text variant="body-xs" fontFamily="mono" color={defaultValue ? 'inherit' : 'muted'}>
                {defaultValue ?? '—'}
              </Text>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Headings.</strong> Each item wraps its trigger
            in <code>&lt;h3&gt;</code> by default — override with <code>as</code> to fit your page outline.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Wiring.</strong> Triggers and content panels are
            linked via <code>aria-expanded</code>, <code>aria-controls</code>, and{' '}
            <code>aria-labelledby</code>. The content uses <code>role=&quot;region&quot;</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong> ArrowUp/Down move focus
            between triggers; Home/End jump to the first/last enabled trigger. Disabled items are
            skipped.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Data attributes.</strong> Items, triggers, and
            content expose <code>data-state=&quot;open|closed&quot;</code> and <code>data-disabled</code>{' '}
            for CSS styling and animation.
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Accordion } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import Accordion from '@swift/components/Accordion'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Accordion, type AccordionRootProps } from '@swift/components'`}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Accordion type="single" collapsible defaultValue="a">
  <Accordion.Item value="a">
    <Accordion.Header>
      <Accordion.Trigger>Section A</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content A</Accordion.Content>
  </Accordion.Item>
</Accordion>

// Multiple, controlled
const [open, setOpen] = useState<string[]>([])
<Accordion type="multiple" value={open} onValueChange={setOpen}>
  ...
</Accordion>

// Render-as-child trigger
<Accordion.Trigger render={(p) => <button {...p} className="..." />}>
  Custom
</Accordion.Trigger>`}
        />
      </section>
    </div>
  )
}
