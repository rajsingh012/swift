import { useState } from 'react'
import { Afternoon } from '@swift/icons/Afternoon'
import { Night } from '@swift/icons/Night'
import { useTheme } from '../../../lib/Theme'

const NAV_ITEMS = [
  { label: 'Offerings', href: '#offerings' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Cities', href: '#cities' },
  { label: 'Blog', href: '#blog' },
  { label: 'More', href: '#more' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-50 border-b border-stroke bg-surface/80 backdrop-blur-xl text-content">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src="https://cdn.solarsquare.in/blog/wp-content/uploads/2025/11/05101757/logo.webp" alt="Solar Square" className="h-14 w-auto" />
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium uppercase tracking-[0.2em] text-content-muted transition hover:text-content-strong"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stroke bg-surface-muted text-content transition hover:bg-surface-elevated"
          >
            {isDark ? <Afternoon size={18} /> : <Night size={18} />}
          </button>
          <a
            href="#quote"
            className="inline-flex items-center rounded-full bg-surface-brand px-5 py-2.5 text-sm font-semibold text-content-on-brand shadow-lg shadow-[color:var(--shadow-level2)] transition hover:bg-surface-brand/90"
          >
            Get Free Quote
          </a>
          <button
            type="button"
            aria-label="Open mobile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stroke bg-surface-muted text-content transition hover:bg-surface-elevated lg:hidden"
          >
            <span className="text-xl font-black">☰</span>
          </button>
        </div>

        {menuOpen ? (
          <div className="mt-4 w-full rounded-3xl border border-stroke bg-surface-elevated p-4 shadow-level3 lg:hidden">
            <div className="grid gap-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-content transition hover:bg-surface-muted"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#quote"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-surface-brand px-4 py-3 text-center text-sm font-semibold text-content-on-brand transition hover:bg-surface-brand/90"
              >
                Get Free Quote
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Header;
