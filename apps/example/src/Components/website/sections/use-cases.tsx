import { useEffect, useState } from 'react';
import { Carousel } from '@swift/components/Carousel';
import { Badge } from '@swift/components/Badge';
import { Text } from '@swift/components/Text';
import { useInView } from '../../../hooks/useInView';
import { UseCaseArt, type SceneKey } from './use-case-art';

/* ── Solar deployment scenarios ────────────────────────────────── */

type UseCase = {
    scene: SceneKey;
    label: string;
    tagline: string;
};

const USE_CASES: UseCase[] = [
    { scene: 'homes', label: 'Homes', tagline: 'Cut your bill up to 90%' },
    { scene: 'housing', label: 'Housing Societies', tagline: 'Power shared common areas' },
    { scene: 'farms', label: 'Farms', tagline: 'Run pumps on free sunlight' },
    { scene: 'factories', label: 'Factories', tagline: 'Slash industrial energy costs' },
    { scene: 'hospitals', label: 'Hospitals', tagline: 'Reliable round-the-clock power' },
    { scene: 'schools', label: 'Schools', tagline: 'Learn under a greener roof' },
    { scene: 'retail', label: 'Retail Stores', tagline: 'Keep the lights on for less' },
    { scene: 'warehouses', label: 'Warehouses', tagline: 'Big roofs, bigger savings' },
    { scene: 'petrol', label: 'Petrol Pumps', tagline: 'Fuel stations gone solar' },
];

/* ── A single coverflow card ───────────────────────────────────── */

function UseCaseCard({ item }: { item: UseCase }) {
    return (
        <div className="relative aspect-square w-full select-none overflow-hidden rounded-3xl border border-white/10 bg-surface-muted shadow-level3">
            {/* Scenario illustration */}
            <UseCaseArt scene={item.scene} />

            {/* Legibility gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />

            {/* Label plate */}
            <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-10 text-center">
                <p className="text-lg font-bold leading-tight text-white drop-shadow sm:text-xl">
                    {item.label}
                </p>
                <p className="mt-0.5 text-xs font-medium text-white/90 drop-shadow sm:text-sm">
                    {item.tagline}
                </p>
            </div>
        </div>
    );
}

/* ── Section ───────────────────────────────────────────────────── */

function UseCasesSection() {
    const [ref, inView] = useInView<HTMLDivElement>();

    // Responsive slidesPerView for the coverflow — fewer slides on
    // narrow viewports so each card stays large enough to read.
    const [slidesPerView, setSlidesPerView] = useState(3);
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w < 640) setSlidesPerView(1.6);
            else if (w < 1024) setSlidesPerView(2.4);
            else setSlidesPerView(3);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <section id="where-solar-works" className="bg-surface py-20 text-content">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div
                    ref={ref}
                    className={`mx-auto flex max-w-2xl flex-col items-center gap-3 text-center ${
                        inView
                            ? 'animate__animated animate__fadeInUpShort'
                            : 'opacity-0'
                    }`}
                >
                    <Badge
                        pill
                        variant="success"
                        appearance="soft"
                        className="uppercase tracking-wider"
                    >
                        Where It Works
                    </Badge>
                    <Text variant="heading-lg" fontWeight="bold">
                        Solar Power for Every Space
                    </Text>
                    <Text variant="para-md" color="secondary">
                        From a single rooftop to an entire factory, Swift solar
                        scales to fit — drag through to see where clean energy
                        is already at work.
                    </Text>
                </div>

                {/* Coverflow */}
                <div
                    className={`mt-12 ${
                        inView
                            ? 'animate__animated animate__fadeInUpShort animate__delay-100'
                            : 'opacity-0'
                    }`}
                >
                    <Carousel
                        effect="coverflow"
                        align="center"
                        slidesPerView={slidesPerView}
                        gap={0}
                        loop
                        aria-label="Where Swift solar works"
                    >
                        <Carousel.Viewport>
                            <Carousel.Track>
                                {USE_CASES.map((item) => (
                                    <Carousel.Item key={item.label}>
                                        <UseCaseCard item={item} />
                                    </Carousel.Item>
                                ))}
                            </Carousel.Track>
                        </Carousel.Viewport>
                        <Carousel.Previous />
                        <Carousel.Next />
                        <Carousel.Indicators />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

export default UseCasesSection;
