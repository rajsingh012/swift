import type { ComponentType } from 'react'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { ArrowRight } from '@swift/icons/ArrowRight'
import { Building } from '@swift/icons/Building'
import { City } from '@swift/icons/City'
import { Home } from '@swift/icons/Home'

type IconProps = { size?: number; className?: string }

type Segment = {
  Icon: ComponentType<IconProps>
  title: string
  description: string
  stat: string
  statLabel: string
  cta: string
  delay: string
}

const segments: Segment[] = [
  {
    Icon: Home,
    title: 'Home',
    description: 'Cut your household electricity bill and generate clean power from your own rooftop.',
    stat: 'Up to 90%',
    statLabel: 'lower bills',
    cta: 'Explore home solar',
    delay: 'animate__delay-100',
  },
  {
    Icon: Building,
    title: 'Housing Societies',
    description: 'Slash common-area power costs and add lasting value for every resident.',
    stat: '1 Lakh+',
    statLabel: 'homes powered',
    cta: 'Explore societies',
    delay: 'animate__delay-200',
  },
]

/** Conic halo that slowly rotates behind a solid brand-gradient icon chip. */
function IconTile({ Icon }: { Icon: ComponentType<IconProps> }) {
  return (
    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      {/* Rotating conic ring */}
      <span
        aria-hidden="true"
        className="ds-spin-slow absolute inset-0 rounded-2xl opacity-70"
        style={{
          background:
            'conic-gradient(from 0deg, transparent, color-mix(in oklab, var(--color-surface-brand) 85%, transparent), color-mix(in oklab, var(--color-surface-new) 70%, transparent), transparent 78%)',
        }}
      />
      {/* Soft glow */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-surface-brand opacity-40 blur-md"
      />
      {/* Solid gradient chip carved out of the ring */}
      <span
        className="relative flex h-11 w-11 items-center justify-center rounded-xl text-content-on-brand shadow-md"
        style={{
          background:
            'linear-gradient(135deg, var(--color-surface-brand), color-mix(in oklab, var(--color-surface-brand) 55%, #000))',
        }}
      >
        <Icon size={22} className="relative" />
      </span>
    </span>
  )
}

const CarouselSection = () => {
  return (
    <section className="relative z-20 -mt-28 lg:-mt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          {/* Two audience segments */}
          {segments.map((segment) => (
            <article
              key={segment.title}
              className={`group animate__animated animate__fadeInUpShort ${segment.delay} relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-stroke bg-surface-elevated p-7 shadow-level3 transition duration-300 hover:-translate-y-1.5 hover:border-stroke-brand/50 hover:shadow-level4 lg:col-span-3`}
            >
              {/* Top hairline sheen */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-surface-brand) 65%, transparent), transparent)',
                }}
              />
              {/* Corner glow revealed on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-surface-brand/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative flex flex-col gap-5">
                <IconTile Icon={segment.Icon} />
                <div className="flex flex-col gap-1.5">
                  <Text variant="heading-sm" fontWeight="bold" className="text-content-strong">
                    {segment.title}
                  </Text>
                  <Text variant="para-sm" color="secondary">
                    {segment.description}
                  </Text>
                </div>
              </div>

              <div className="relative flex items-end justify-between gap-3 border-t border-stroke pt-4">
                <div className="flex flex-col">
                  <span className="brand-gradient-text text-2xl font-bold tracking-tight">
                    {segment.stat}
                  </span>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-content-muted">
                    {segment.statLabel}
                  </span>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-brand-muted text-content-brand transition-all duration-300 group-hover:bg-surface-brand group-hover:text-content-on-brand group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </span>
              </div>
            </article>
          ))}

          {/* Featured — Commercial */}
          <div className="animate__animated animate__fadeInUpShort animate__delay-300 md:col-span-2 lg:col-span-6">
            <div className="group relative h-full min-h-72 overflow-hidden rounded-3xl shadow-level4">
              <img
                src="https://cdn.solarsquare.in/blog/wp-content/uploads/2026/04/23202032/Hero-Web-1.webp"
                alt="Commercial solar installation"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Diagonal shine sweep on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-y-8 -left-1/3 w-1/3 -translate-x-full -skew-x-12 bg-white/20 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
              />
              {/* Bottom-anchored gradient for legible text */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-transparent" />

              <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-8 sm:p-10">
                <div className="flex items-center gap-2">
                  <span className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
                    <City size={14} />
                    For Business
                  </span>
                  {/* Floating glass stat chip */}
                  <span className="flex w-fit items-baseline gap-1.5 rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                    <span className="text-sm font-bold">500+</span>
                    <span className="text-[0.7rem] font-medium uppercase tracking-wider text-white/70">
                      businesses
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                    Commercial &amp; Industrial
                  </h3>
                  <p className="max-w-md text-base leading-relaxed text-white/85">
                    Power your business with green energy, meet ESG goals and cut
                    operating costs at scale.
                  </p>
                </div>
                <div>
                  <Button variant="primary" size="md">
                    Explore Our Services
                    <Button.RightIcon>
                      <ArrowRight size={16} />
                    </Button.RightIcon>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CarouselSection
