import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { Afternoon, Close, Filter, Night, Search, Settings, Star } from '@swift/icons'
import { IconSearchContext } from '../lib/icon-search'
import { ToastProvider } from '../lib/toast'

type IconComponent = ComponentType<{ size?: number; className?: string }>

type Theme = 'light' | 'dark'

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [query, setQuery] = useState('')
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const showSearch = pathname === '/'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <IconSearchContext.Provider value={{ query, setQuery }}>
      <ToastProvider>
      <div className="flex h-screen flex-col bg-surface-muted text-content">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-stroke bg-surface/80 px-6 shadow-level1 backdrop-blur">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-base font-semibold tracking-tight text-content-strong"
            >
              Swift
            </Link>
            <nav className="flex items-center gap-1">
              <NavItem to="/" icon={Star} iconColorClass="text-content-highlight">
                Icons
              </NavItem>
              <NavItem to="/components" icon={Settings} iconColorClass="text-content-brand">
                Components
              </NavItem>
              <NavItem to="/foundations" icon={Filter} iconColorClass="text-content-new">
                Foundations
              </NavItem>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {showSearch && (
              <label className="group relative flex w-72 items-center">
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
            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label="Toggle theme"
              className="shrink-0 cursor-pointer rounded-md border border-stroke bg-surface p-1.5 text-content transition-colors hover:bg-surface-muted hover:text-content-strong"
            >
              {theme === 'light' ? <Night size={18} /> : <Afternoon size={18} />}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
      </ToastProvider>
    </IconSearchContext.Provider>
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
