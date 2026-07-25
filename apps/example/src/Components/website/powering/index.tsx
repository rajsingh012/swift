import type { ComponentType, CSSProperties } from 'react'
import { Badge } from '@swift/components/Badge'
import { Button } from '@swift/components/Button'
import { ArrowRight } from '@swift/icons/ArrowRight'
import { Home } from '@swift/icons/Home'
import { Power } from '@swift/icons/Power'
import { RupeeCircleFilled } from '@swift/icons/RupeeCircleFilled'
import { StarFilled } from '@swift/icons/StarFilled'
import { useInView } from '../../../hooks/useInView'
import { Odometer } from './Odometer'

type IconProps = { size?: number; className?: string }

type Stat = {
  value: string
  label: string
  caption: string
  Icon: ComponentType<IconProps>
  /** Accent surface token used for the ring, glow and hover bar. */
  accent: string
  className: string
}

const stats: Stat[] = [
  {
    value: '50,000+',
    label: 'Homes Solarized',
    caption: 'Rooftops generating clean power',
    Icon: Home,
    accent: 'var(--color-surface-brand)',
    className: 'animate__fadeInUpShort animate__delay-200',
  },
  {
    value: '200+ MW',
    label: 'Power Installed',
    caption: 'Total capacity across India',
    Icon: Power,
    accent: 'var(--color-surface-highlight)',
    className: 'animate__fadeInUpShort animate__delay-300',
  },
  {
    value: '₹300+ Cr',
    label: 'Subsidy Delivered',
    caption: 'Government savings passed on',
    Icon: RupeeCircleFilled,
    accent: 'var(--color-surface-highlight)',
    className: 'animate__fadeInUpShort animate__delay-400',
  },
  {
    value: '#1 Home Solar',
    label: 'On National Portal',
    caption: 'India’s most-trusted brand',
    Icon: StarFilled,
    accent: 'var(--color-surface-brand)',
    className: 'animate__fadeInUpShort animate__delay-500',
  },
]

/** Accent-tinted icon chip wrapped in a slowly-rotating conic halo. */
function StatIcon({ Icon }: { Icon: ComponentType<IconProps> }) {
  return (
    <span className="relative flex h-14 w-14 items-center justify-center">
      <span
        aria-hidden="true"
        className="ds-spin-slow absolute inset-0 rounded-2xl opacity-70"
        style={{
          background:
            'conic-gradient(from 0deg, transparent, color-mix(in oklab, var(--accent) 90%, transparent), transparent 78%)',
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl opacity-40 blur-md"
        style={{ backgroundColor: 'var(--accent)' }}
      />
      <span
        className="relative flex h-11 w-11 items-center justify-center rounded-xl text-content-on-brand shadow-md"
        style={{
          background:
            'linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 55%, #000))',
        }}
      >
        <Icon size={24} className="relative" />
      </span>
    </span>
  )
}

const PoweringSection = () => {
  const [copyRef, copyInView] = useInView<HTMLDivElement>()
  const [gridRef, gridInView] = useInView<HTMLDivElement>()

  return (
    <section
      id="powering"
      className="relative bg-surface-muted py-20 text-content sm:py-24"
    >
      {/* Backdrop: dot grid + brand spotlight bleeding from the top. Clipping
          lives on this layer (not the section) so the sticky intro column
          below still pins on scroll. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-dot-grid" />
        <div className="glow-brand absolute -top-24 left-1/2 h-72 w-xl -translate-x-1/2 rounded-full blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left — sticky intro */}
          <div
            ref={copyRef}
            className={`flex flex-col gap-6 self-start lg:col-span-2 lg:sticky lg:top-28 ${
              copyInView ? 'animate__animated animate__fadeInLeftShort' : 'opacity-0'
            }`}
          >
            <Badge pill variant="info" appearance="soft" className="w-fit uppercase tracking-wider">
              Our Impact
            </Badge>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-content-strong sm:text-5xl">
              Powering Homes{' '}
              <span className="brand-gradient-text">Across India</span>
            </h2>
            <p className="max-w-md text-base leading-8 text-content-muted">
              We are present in 31 cities across 10 states — and growing every day.
              Every rooftop we solarize brings India closer to a cleaner future.
            </p>

            {/* Reach chips + live presence */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { value: '31', label: 'Cities' },
                { value: '10', label: 'States' },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-baseline gap-2 rounded-2xl border border-stroke bg-surface-elevated px-4 py-2.5 shadow-level1"
                >
                  <span className="brand-gradient-text text-xl font-bold">{chip.value}</span>
                  <span className="text-sm font-medium text-content-muted">{chip.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-2xl border border-stroke bg-surface-elevated px-4 py-2.5 shadow-level1">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="ds-pulse-ring absolute inset-0 rounded-full bg-surface-brand" />
                  <span className="relative h-2 w-2 rounded-full bg-surface-brand" />
                </span>
                <span className="text-sm font-medium text-content-muted">Live &amp; growing</span>
              </div>
            </div>

            <div>
              <Button variant="primary" size="lg" className="!rounded-full">
                Unlock Your Solar Savings
                <Button.RightIcon>
                  <ArrowRight size={18} />
                </Button.RightIcon>
              </Button>
            </div>
          </div>

          {/* Right — stat bento */}
          <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-3 lg:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{ '--accent': stat.accent } as CSSProperties}
                className={`group relative overflow-hidden rounded-3xl border border-stroke bg-surface-elevated p-7 shadow-level2 transition duration-300 hover:-translate-y-1.5 hover:shadow-level3 ${
                  gridInView ? `animate__animated ${stat.className}` : 'opacity-0'
                }`}
              >
                {/* Top accent bar that grows on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-1 w-0 rounded-r-full transition-all duration-500 group-hover:w-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--accent), transparent)',
                  }}
                />
                {/* Accent glow that reveals on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: 'color-mix(in oklab, var(--accent) 30%, transparent)',
                  }}
                />
                {/* Accent inset ring on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow:
                      'inset 0 0 0 1px color-mix(in oklab, var(--accent) 45%, transparent)',
                  }}
                />

                <div className="relative flex flex-col gap-5">
                  <StatIcon Icon={stat.Icon} />

                  <div className="flex flex-col gap-1.5">
                    <p className="text-3xl font-bold tracking-tight text-content-strong sm:text-4xl">
                      <Odometer value={stat.value} />
                    </p>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-content-muted">
                      <span
                        className="h-px w-6"
                        style={{ backgroundColor: 'var(--accent)' }}
                      />
                      {stat.label}
                    </p>
                    <p className="text-sm leading-relaxed text-content-muted">
                      {stat.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PoweringSection
