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

/** Brand-gradient icon tile with a soft glow, shared across the site. */
function IconTile({ Icon }: { Icon: ComponentType<IconProps> }) {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-content-on-brand shadow-md">
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
      <Icon size={22} className="relative" />
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
            <div
              key={segment.title}
              className={`group animate__animated animate__fadeInUpShort ${segment.delay} flex flex-col justify-between gap-6 rounded-3xl border border-stroke bg-surface-elevated p-7 shadow-level3 transition duration-300 hover:-translate-y-1 hover:border-stroke-brand/40 hover:shadow-level4 lg:col-span-3`}
            >
              <div className="flex flex-col gap-4">
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

              <div className="flex items-end justify-between gap-3 border-t border-stroke pt-4">
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-content-brand">
                    {segment.stat}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-content-muted">
                    {segment.statLabel}
                  </span>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-brand-muted text-content-brand transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          ))}

          {/* Featured — Commercial */}
          <div className="animate__animated animate__fadeInUpShort animate__delay-300 md:col-span-2 lg:col-span-6">
            <div className="group relative h-full min-h-72 overflow-hidden rounded-3xl shadow-level4">
              <img
                src="https://cdn.solarsquare.in/blog/wp-content/uploads/2026/04/23202032/Hero-Web-1.webp"
                alt="Commercial solar installation"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Bottom-anchored gradient for legible text */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

              <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-8 sm:p-10">
                <span className="flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  <City size={14} />
                  For Business
                </span>
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
