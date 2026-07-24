import { useEffect, useRef, useState } from 'react'
import { Afternoon } from '@swift/icons/Afternoon'
import { Night } from '@swift/icons/Night'
import { useTheme } from '../../../lib/Theme'

// px scrolled before hide-on-scroll kicks in (keeps header visible near the top)
const SCROLL_REVEAL_THRESHOLD = 80

const NAV_ITEMS = [
  { label: 'Offerings', href: '#offerings' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Cities', href: '#cities' },
  { label: 'Blog', href: '#blog' },
  { label: 'More', href: '#more' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      const goingDown = currentY > lastScrollY.current

      // transparent near the very top, solid background once scrolled past 50px
      setScrolled(currentY > 50)

      // reveal near the top, otherwise follow scroll direction
      if (currentY <= SCROLL_REVEAL_THRESHOLD) {
        setHidden(false)
      } else if (goingDown) {
        setHidden(true)
        setMenuOpen(false)
      } else {
        setHidden(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transform-gpu text-content transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Legibility scrim over the hero while the nav is transparent at the top */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/50 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        className={`relative mx-auto mt-3 flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-full px-4 py-1 transition-colors duration-300 sm:px-6 lg:px-8 ${
          scrolled
            ? 'border border-stroke bg-surface/80 backdrop-blur-xl'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <img src="https://cdn.solarsquare.in/blog/wp-content/uploads/2025/11/05101757/logo.webp" alt="Solar Square" className="h-14 w-auto" />
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium uppercase tracking-[0.2em] transition ${
                scrolled
                  ? 'text-content-muted hover:text-content-strong'
                  : 'text-white/85 hover:text-white'
              }`}
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
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
              scrolled
                ? 'border-stroke bg-surface-muted text-content hover:bg-surface-elevated'
                : 'border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
            }`}
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
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition lg:hidden ${
              scrolled
                ? 'border-stroke bg-surface-muted text-content hover:bg-surface-elevated'
                : 'border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
            }`}
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
