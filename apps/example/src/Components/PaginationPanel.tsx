import { useState } from 'react'
import { Pagination } from '@swift/components/Pagination'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'Page navigation for paginated content — a labelled <nav> wrapping a row of page buttons with collision-aware ellipsis gaps, plus optional prev/next and first/last controls. Controlled/uncontrolled via page / defaultPage / onPageChange.'

const KNOBS: ReadonlyArray<Knob> = [
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'select', name: 'variant', options: ['ghost', 'solid', 'outline'], defaultValue: 'ghost' },
  { type: 'boolean', name: 'showFirstLast' },
]

const PROPS: ReadonlyArray<PropRow> = [
  { name: 'count', type: 'number', description: 'Total number of pages (required).' },
  { name: 'page', type: 'number', description: 'Controlled current page (1-indexed). Pair with onPageChange.' },
  { name: 'defaultPage', type: 'number', defaultValue: '1', description: 'Uncontrolled initial page.' },
  { name: 'onPageChange', type: '(page: number) => void', description: 'Fires with the next page on every change.' },
  { name: 'siblingCount', type: 'number', defaultValue: '1', description: 'Pages shown on each side of the current page.' },
  { name: 'boundaryCount', type: 'number', defaultValue: '1', description: 'Pages shown at the start and end.' },
  { name: 'size / variant', type: 'PaginationSize / Variant', description: 'Button dimensions and chrome (solid / outline / ghost).' },
  { name: 'showPrevNext', type: 'boolean', defaultValue: 'true', description: 'Show the previous/next arrow buttons.' },
  { name: 'showFirstLast', type: 'boolean', defaultValue: 'false', description: 'Show first/last jump buttons.' },
  { name: 'getItemAriaLabel', type: '(type, page?) => string', description: 'Customise the screen-reader label for each control.' },
  { name: 'classes', type: '{ root?, list?, item?, ellipsis?, prev?, next? }', description: 'Slot-level className overrides.' },
]

export function PaginationPanel() {
  const [page, setPage] = useState(1)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Pagination
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Pagination"
          knobs={KNOBS}
          render={(v) => (
            <Pagination
              count={10}
              defaultPage={4}
              size={v.size as 'sm' | 'md' | 'lg'}
              variant={v.variant as 'ghost' | 'solid' | 'outline'}
              showFirstLast={v.showFirstLast === true}
            />
          )}
        />
      </section>

      <section>
        <SectionHeader>Controlled</SectionHeader>
        <PreviewRow code={`const [page, setPage] = useState(1)

<Pagination count={20} page={page} onPageChange={setPage} />`}>
          <div>
            <Pagination count={20} page={page} onPageChange={setPage} />
            <Text variant="body-xs" color="muted" className="mt-2 block">
              page: <code>{page}</code> of 20
            </Text>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Variants</SectionHeader>
        <PreviewRow code={`<Pagination count={8} variant="ghost" />
<Pagination count={8} variant="outline" />
<Pagination count={8} variant="solid" />`}>
          <div className="flex flex-col gap-4">
            <Pagination count={8} defaultPage={3} variant="ghost" />
            <Pagination count={8} defaultPage={3} variant="outline" />
            <Pagination count={8} defaultPage={3} variant="solid" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>First / last controls</SectionHeader>
        <PreviewRow code={`<Pagination count={20} defaultPage={10} showFirstLast />`}>
          <Pagination count={20} defaultPage={10} showFirstLast />
        </PreviewRow>
      </section>

      <PropsTable rows={PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Pagination } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Pagination } from '@swift/components/Pagination'`} />
        </div>
      </section>
    </div>
  )
}
