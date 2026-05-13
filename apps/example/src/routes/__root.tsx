import { useEffect, useState, type ReactNode } from 'react'
import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { Afternoon, Close, Night, Search } from '@swift/icons'
import { IconSearchContext } from '../lib/icon-search'
import { ToastProvider } from '../lib/toast'

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
      <div className="flex h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white/80 px-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur dark:border-gray-800 dark:bg-gray-950/80 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-50"
            >
              Swift
            </Link>
            <nav className="flex items-center gap-1">
              <NavItem to="/">Icons</NavItem>
              <NavItem to="/components">Components</NavItem>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {showSearch && (
              <label className="group relative flex w-72 items-center">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 text-gray-400 transition-colors group-focus-within:text-indigo-500 dark:text-gray-500 dark:group-focus-within:text-indigo-400"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search icons…"
                  className="h-9 w-full rounded-lg border border-transparent bg-gray-100 pl-9 pr-9 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:bg-gray-900 dark:focus:ring-indigo-400/20"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 flex size-6 cursor-pointer items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
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
              className="shrink-0 cursor-pointer rounded-md border border-gray-200 bg-white p-1.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
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

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      activeProps={{
        className:
          'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
      }}
      activeOptions={{ exact: true }}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    >
      {children}
    </Link>
  )
}
