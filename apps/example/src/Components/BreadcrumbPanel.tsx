import { Breadcrumb } from '@swift/components/Breadcrumb'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A navigation trail rendered as a labelled <nav> landmark. Compose List / Item / Link / Page / Separator / Ellipsis parts. The current page carries aria-current="page" and separators are hidden from assistive tech.'

const PROPS: ReadonlyArray<PropRow> = [
  { name: 'Breadcrumb', type: 'size?, separator?, aria-label?', description: 'Root <nav>. size (sm/md/lg) and the default separator cascade to parts. aria-label defaults to "Breadcrumb".' },
  { name: 'Breadcrumb.List', type: 'OlHTMLAttributes', description: 'The ordered list wrapping the trail.' },
  { name: 'Breadcrumb.Item', type: 'LiHTMLAttributes', description: 'A single crumb wrapper (<li>).' },
  { name: 'Breadcrumb.Link', type: 'asChild?, AnchorHTMLAttributes', description: 'A navigable crumb. Use asChild to render a framework <Link>.' },
  { name: 'Breadcrumb.Page', type: 'HTMLAttributes', description: 'The current page — not a link; aria-current="page".' },
  { name: 'Breadcrumb.Separator', type: 'children?', description: 'Visual separator (decorative). Defaults to the root separator; override per-instance.' },
  { name: 'Breadcrumb.Ellipsis', type: 'HTMLAttributes', description: 'A collapsed-crumbs indicator (…) for long trails.' },
]

export function BreadcrumbPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Breadcrumb
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow code={`<Breadcrumb>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/settings">Settings</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Profile</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb>`}>
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Settings</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Profile</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Custom separator</SectionHeader>
        <PreviewRow code={`<Breadcrumb separator="›">…</Breadcrumb>`}>
          <Breadcrumb separator="›">
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Collapsed with ellipsis</SectionHeader>
        <PreviewRow code={`<Breadcrumb.Item>
  <Breadcrumb.Ellipsis />
</Breadcrumb.Item>`}>
          <Breadcrumb>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Ellipsis />
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Current</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PreviewRow>
      </section>

      <PropsTable title="Parts" rows={PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Breadcrumb } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Breadcrumb } from '@swift/components/Breadcrumb'`} />
        </div>
      </section>
    </div>
  )
}
