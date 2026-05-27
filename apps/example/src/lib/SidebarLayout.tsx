import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@swift/components/Button'
import { Sheet } from '@swift/components/Sheet'
import { Text } from '@swift/components/Text'

function MenuGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

/**
 * Section shell shared by the Icons / Components / Foundations pages.
 *
 * - `lg+`: a persistent left `<aside>` (the classic w-72 sidebar).
 * - below `lg`: the sidebar collapses into a left drawer Sheet, opened from a
 *   compact bar above the content. The drawer auto-closes whenever
 *   `selectedKey` changes, so picking an item dismisses it.
 *
 * `sidebar` is rendered in both the aside and the drawer; keep it to the list
 * itself (the layout supplies the titled header in each place).
 */
export function SidebarLayout({
  title,
  subtitle,
  selectedKey,
  triggerLabel,
  sidebar,
  children,
}: {
  title: ReactNode
  subtitle?: ReactNode
  selectedKey: string
  triggerLabel: ReactNode
  sidebar: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  // Close the mobile drawer when the active item changes.
  useEffect(() => {
    setOpen(false)
  }, [selectedKey])

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-stroke bg-surface lg:flex">
        <div className="border-b border-stroke px-4 py-3.5">
          <Text variant="body-sm" fontWeight="semibold">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="body-xs" color="muted" className="block">
              {subtitle}
            </Text>
          ) : null}
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">{sidebar}</div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile section switcher */}
        <div className="flex shrink-0 items-center gap-2 border-b border-stroke bg-surface px-4 py-2.5 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            classes={{ root: 'max-w-full' }}
          >
            <Button.LeftIcon>
              <MenuGlyph />
            </Button.LeftIcon>
            <span className="truncate">{triggerLabel}</span>
          </Button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen} modal>
        <Sheet.Portal>
          <Sheet.Overlay />
          <Sheet.Content side="left" size="sm">
            <Sheet.Header>
              <Sheet.Title>{title}</Sheet.Title>
              {subtitle ? <Sheet.Description>{subtitle}</Sheet.Description> : null}
              <Sheet.Close />
            </Sheet.Header>
            <Sheet.Body>{sidebar}</Sheet.Body>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet>
    </div>
  )
}
