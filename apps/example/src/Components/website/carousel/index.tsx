import { Avatar } from '@swift/components/Avatar'

const CarouselSection = () => {
  const stats = [
    {
      number: 'Home',
      label: 'Save up to 90% on your home electricity bills.',
      avatars: [
        'https://i.pravatar.cc/120?img=1',
        'https://i.pravatar.cc/120?img=2',
        'https://i.pravatar.cc/120?img=3',
      ],
    },
    {
      number: 'Housing Societies',
      label: 'Reduce common-area power costs and add long-term value.',
      avatars: [
        'https://i.pravatar.cc/120?img=4',
        'https://i.pravatar.cc/120?img=5',
        'https://i.pravatar.cc/120?img=6',
      ],
    },
  ]

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-[150px] bg-surface py-16 sm:py-20 rounded-3xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8 -mt-[200px]">
          {/* Left: Stats Cards - Stacked Vertically */}
          <div className="flex gap-6 lg:w-1/2">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center gap-4 rounded-3xl bg-surface-elevated p-8 text-content-strong shadow-level2 transition hover:shadow-level3 lg:w-1/2 ${
                  idx === 0 ? 'animate__animated animate__fadeInLeftShort animate__delay-100' : ''
                } ${ idx === 1 ? 'animate__animated animate__fadeInLeftShort animate__delay-200' : ''}`}
              >
                {/* Avatars */}
                <div className="flex -space-x-3">
                  {stat.avatars.map((avatar, i) => (
                    <Avatar
                      key={i}
                      src={avatar}
                      size="lg"
                      className="border-2 border-surface-elevated"
                    />
                  ))}
                </div>

                {/* Stats Info */}
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {stat.number}
                  </p>
                  <p className="mt-2 text-md font-semibold text-gray-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Featured Card - Large */}
          <div className="lg:w-1/2 animate__animated animate__fadeInRightShort animate__delay-200">
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-surface-success to-surface-brand shadow-level4">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src="https://cdn.solarsquare.in/blog/wp-content/uploads/2026/04/23202032/Hero-Web-1.webp"
                  alt="Nature-Powered Solutions"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Dark Overlay for text contrast */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Content Overlay */}
              <div className="relative z-10 flex h-full flex-col justify-end gap-6 p-8 sm:p-10">
                <div className="flex flex-col gap-1">
                  <h3 className="text-4xl font-bold leading-tight text-brand-300 sm:text-5xl">
                    Commercial
                  </h3>
                  <p className="text-base leading-relaxed text-white/90">
                    Power your business with green energy and save on costs.
                  </p>
                </div>

                <div>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 rounded-full bg-surface-brand px-5 py-3 font-semibold text-content-on-brand transition hover:bg-surface-brand/90"
                  >
                    Explore Our Services
                    <span aria-hidden="true">↗</span>
                  </a>
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
