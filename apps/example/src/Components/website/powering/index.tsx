import { Home } from '@swift/icons/Home'
import { Power } from '@swift/icons/Power'
import { RupeeCircleFilled } from '@swift/icons/RupeeCircleFilled'
import { StarFilled } from '@swift/icons/StarFilled'
import { useInView } from '../../../hooks/useInView'
import { Odometer } from './Odometer'

const stats = [
  { value: '50,000+', label: 'Homes Solarized', Icon: Home, className: 'animate__fadeInRightShort animate__delay-200' },
  { value: '200+ MW', label: 'Power Installed', Icon: Power, className: 'animate__fadeInRightShort animate__delay-400' },
  { value: '₹300+ Cr', label: 'Subsidy Delivered', Icon: RupeeCircleFilled, className: 'animate__fadeInRightShort animate__delay-600' },
  { value: '#1 Home Solar', label: 'On National Portal', Icon: StarFilled, className: 'animate__fadeInRightShort animate__delay-800' },
]

const PoweringSection = () => {
  const [gridRef, inView] = useInView<HTMLDivElement>()

  return (
    <section id="powering" className="bg-surface py-20 text-content">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex">
          <div ref={gridRef} className={`space-y-6 self-start lg:sticky lg:top-24 w-1/3 ${inView ? 'animate__animated animate__fadeInLeftShort' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-content-strong sm:text-5xl">
              Powering Homes Across India
            </h2>
            <p className="max-w-2xl text-base leading-8 text-content-secondary">
              We are present in 31 Cities across 10 States, and are growing every day.
            </p>
            <a
              href="#offerings"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-surface-brand px-6 py-4 text-sm font-semibold text-content-on-brand shadow-xl shadow-[color:var(--shadow-level2)] transition hover:bg-surface-brand/90"
            >
              Unlock Your Solar Savings
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <div ref={gridRef} className="grid grid-cols-2 gap-8 lg:gap-12 w-2/3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`group relative overflow-hidden rounded-3xl border border-stroke bg-surface-elevated p-8 shadow-level2 transition duration-300 hover:-translate-y-1 hover:border-surface-brand/40 hover:shadow-level3 ${
                  inView ? `animate__animated ${stat.className}` : 'opacity-0'
                }`}
              >
                {/* Brand glow that reveals on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-surface-brand/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex flex-col gap-6">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-brand text-content-on-brand shadow-lg">
                    <stat.Icon size={30} className="icon-float" />
                  </span>

                  <div className="flex flex-col gap-2">
                    <p className="text-4xl font-bold tracking-tight text-content-strong">
                      <Odometer value={stat.value} />
                    </p>
                    <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-content-muted">
                      <span className="h-px w-6 bg-surface-brand" />
                      {stat.label}
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
