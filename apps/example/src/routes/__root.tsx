import { useState, type ComponentType, type ReactNode } from 'react'
import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { Sheet } from '@swift/components/Sheet'
import { Afternoon } from '@swift/icons/Afternoon'
import { Close } from '@swift/icons/Close'
import { Filter } from '@swift/icons/Filter'
import { Night } from '@swift/icons/Night'
import { Search } from '@swift/icons/Search'
import { Settings } from '@swift/icons/Settings'
import { Star } from '@swift/icons/Star'
import { IconSearchContext } from '../lib/iconSearch'
import { ToastProvider } from '../lib/Toast'
import { ThemeProvider, useTheme } from '../lib/Theme'
import { Button } from '@swift/components'

type IconComponent = ComponentType<{ size?: number; className?: string }>

type NavRoute = {
  to: '/icons' | '/components' | '/foundations'
  label: string
  icon: IconComponent
  iconColorClass: string
}

const NAV_ROUTES: ReadonlyArray<NavRoute> = [
  { to: '/icons', label: 'Icons', icon: Star, iconColorClass: 'text-content-highlight' },
  { to: '/components', label: 'Components', icon: Settings, iconColorClass: 'text-content-brand' },
  { to: '/foundations', label: 'Foundations', icon: Filter, iconColorClass: 'text-content-new' },
]

export const Route = createRootRoute({
  component: RootLayout,
})

function MenuGlyph({ size = 20 }: { size?: number }) {
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

function RootLayout() {
  const [query, setQuery] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const showSearch = pathname === '/icons'

  return (
    <ThemeProvider>
      <IconSearchContext.Provider value={{ query, setQuery }}>
        <ToastProvider>
          <div className="flex h-screen flex-col bg-surface-muted text-content">
            <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-stroke bg-surface/80 px-4 shadow-level1 backdrop-blur sm:px-6">
              <div className="flex min-w-0 items-center gap-3 lg:gap-8">
                <button
                  type="button"
                  onClick={() => setNavOpen(true)}
                  aria-label="Open navigation"
                  className="-ml-1 shrink-0 cursor-pointer rounded-md p-1.5 text-content transition-colors hover:bg-surface-muted lg:hidden"
                >
                  <MenuGlyph size={20} />
                </button>
                <Link
                  to="/"
                  className="text-base font-semibold tracking-tight text-content-strong"
                >
                  Swift
                </Link>
                <nav className="hidden items-center gap-1 lg:flex">
                  {NAV_ROUTES.map(({ to, label, icon, iconColorClass }) => (
                    <NavItem key={to} to={to} icon={icon} iconColorClass={iconColorClass}>
                      {label}
                    </NavItem>
                  ))}
                </nav>
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
                {showSearch && (
                  <label className="group relative flex w-40 items-center sm:w-56 lg:w-72">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 text-content-muted transition-colors group-focus-within:text-content-brand"
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search icons…"
                      className="h-9 w-full rounded-lg border border-transparent bg-surface-muted pl-9 pr-9 text-sm text-content-strong outline-none transition-colors placeholder:text-content-muted focus:border-stroke-brand focus:bg-surface focus:ring-2 focus:ring-stroke-brand/20"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="absolute right-2 flex size-6 cursor-pointer items-center justify-center rounded text-content-muted transition-colors hover:bg-surface-subtle hover:text-content-strong"
                      >
                        <Close size={14} />
                      </button>
                    )}
                  </label>
                )}
                <ThemeToggleButton />
              </div>
            </header>

            <Sheet open={navOpen} onOpenChange={setNavOpen} modal>
              <Sheet.Portal>
                <Sheet.Overlay />
                <Sheet.Content side="left" size="sm">
                  <Sheet.Header>
                    <Sheet.Title>Swift</Sheet.Title>
                    <Sheet.Description>Design system</Sheet.Description>
                    <Sheet.Close />
                  </Sheet.Header>
                  <Sheet.Body>
                    <nav className="grid gap-0.5">
                      {NAV_ROUTES.map(({ to, label, icon: Icon, iconColorClass }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setNavOpen(false)}
                          activeProps={{ className: 'bg-surface-brand-muted text-content-brand' }}
                          activeOptions={{ exact: true }}
                          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-content transition-colors hover:bg-surface-muted hover:text-content-strong"
                        >
                          <Icon size={16} className={`${iconColorClass} shrink-0`} />
                          <span>{label}</span>
                        </Link>
                      ))}
                    </nav>
                  </Sheet.Body>
                </Sheet.Content>
              </Sheet.Portal>
            </Sheet>

            <main className="flex-1 overflow-hidden">
              <Outlet />
            </main>
          </div>
        </ToastProvider>
      </IconSearchContext.Provider>
    </ThemeProvider>
  )
}

function ThemeToggleButton() {
  const { theme, toggle } = useTheme()
  return (
    <Button
      variant="primary"
      onClick={toggle}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Night size={18} /> : <Afternoon size={18} />}
    </Button>
  )
}

function NavItem({
  to,
  icon: Icon,
  iconColorClass,
  children,
}: {
  to: string
  icon?: IconComponent
  iconColorClass?: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      activeProps={{
        className: 'bg-surface-brand-muted text-content-brand',
      }}
      activeOptions={{ exact: true }}
      className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-content transition-colors hover:bg-surface-muted hover:text-content-strong"
    >
      {Icon ? <Icon size={16} className={`${iconColorClass ?? ''} shrink-0`} /> : null}
      <span>{children}</span>
    </Link>
  )
}
