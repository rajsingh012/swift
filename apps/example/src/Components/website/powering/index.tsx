import type { ComponentType } from 'react'
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
  className: string
}

const stats: Stat[] = [
  {
    value: '50,000+',
    label: 'Homes Solarized',
    caption: 'Rooftops generating clean power',
    Icon: Home,
    className: 'animate__fadeInUpShort animate__delay-200',
  },
  {
    value: '200+ MW',
    label: 'Power Installed',
    caption: 'Total capacity across India',
    Icon: Power,
    className: 'animate__fadeInUpShort animate__delay-300',
  },
  {
    value: '₹300+ Cr',
    label: 'Subsidy Delivered',
    caption: 'Government savings passed on',
    Icon: RupeeCircleFilled,
    className: 'animate__fadeInUpShort animate__delay-400',
  },
  {
    value: '#1 Home Solar',
    label: 'On National Portal',
    caption: 'India’s most-trusted brand',
    Icon: StarFilled,
    className: 'animate__fadeInUpShort animate__delay-500',
  },
]

const PoweringSection = () => {
  const [copyRef, copyInView] = useInView<HTMLDivElement>()
  const [gridRef, gridInView] = useInView<HTMLDivElement>()

  return (
    <section id="powering" className="bg-surface py-20 text-content sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              Powering Homes Across India
            </h2>
            <p className="max-w-md text-base leading-8 text-content-secondary">
              We are present in 31 cities across 10 states — and growing every day.
              Every rooftop we solarize brings India closer to a cleaner future.
            </p>

            {/* Reach chips */}
            <div className="flex flex-wrap gap-3">
              {[
                { value: '31', label: 'Cities' },
                { value: '10', label: 'States' },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-baseline gap-2 rounded-2xl border border-stroke bg-surface-elevated px-4 py-2.5"
                >
                  <span className="text-xl font-bold text-content-strong">{chip.value}</span>
                  <span className="text-sm font-medium text-content-muted">{chip.label}</span>
                </div>
              ))}
            </div>

            <div>
              <Button variant="primary" size="lg">
                Unlock Your Solar Savings
                <Button.RightIcon>
                  <ArrowRight size={18} />
                </Button.RightIcon>
              </Button>
            </div>
          </div>

          {/* Right — stat grid */}
          <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-3 lg:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`group relative overflow-hidden rounded-3xl border border-stroke bg-surface-elevated p-7 shadow-level2 transition duration-300 hover:-translate-y-1 hover:border-stroke-brand/40 hover:shadow-level3 ${
                  gridInView ? `animate__animated ${stat.className}` : 'opacity-0'
                }`}
              >
                {/* Brand glow that reveals on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-surface-brand/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex flex-col gap-5">
                  {/* Brand-gradient icon tile with soft glow */}
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-content-on-brand shadow-md">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-2xl bg-surface-brand opacity-30 blur-md"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--color-surface-brand), color-mix(in oklab, var(--color-surface-brand) 55%, #000))',
                      }}
                    />
                    <stat.Icon size={24} className="relative" />
                  </span>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-3xl font-bold tracking-tight text-content-strong sm:text-4xl">
                      <Odometer value={stat.value} />
                    </p>
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-content-muted">
                      <span className="h-px w-6 bg-surface-brand" />
                      {stat.label}
                    </p>
                    <p className="text-sm leading-relaxed text-content-secondary">
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
