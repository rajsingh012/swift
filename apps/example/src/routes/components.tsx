import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button, Card } from '@swift/components'
import { ArrowRight, Check, Person, Settings } from '@swift/icons'
import { CopyableImport } from '../lib/CopyableImport'

export const Route = createFileRoute('/components')({
  component: RouteComponent,
})

type ComponentName = 'Button' | 'Card'

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
        {selected === 'Button' ? <ButtonPanel /> : <CardPanel />}
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
