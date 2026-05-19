import { Button, Card, Text } from '@swift/components'
import { ArrowRight } from '@swift/icons'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Container with optional title and footer slots. Body renders any children — use it to group related content.'

export function CardPanel() {
  return (
    <div className="grid gap-8">
      <header>
        <Text variant="heading-lg" fontWeight="semibold" gutterBottom>
          Card
        </Text>
        <Text variant="body-sm" color="secondary">
          {DESCRIPTION}
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
