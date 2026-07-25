import { useEffect, useRef, useState } from 'react';
import { Badge } from '@swift/components/Badge';
import { Button } from '@swift/components/Button';
import { Card } from '@swift/components/Card';
import { Text } from '@swift/components/Text';
import { ArrowRight } from '@swift/icons/ArrowRight';
import { CheckShieldFilled } from '@swift/icons/CheckShieldFilled';
import { CustomerServiceFilled } from '@swift/icons/CustomerServiceFilled';
import { Flash } from '@swift/icons/Flash';
import { Home } from '@swift/icons/Home';
import { Image } from '@swift/icons/Image';
import { PriceLockFilled } from '@swift/icons/PriceLockFilled';
import { Services } from '@swift/icons/Services';
import { Settings } from '@swift/icons/Settings';
import { StarShieldFilled } from '@swift/icons/StarShieldFilled';
import { TrendUp } from '@swift/icons/TrendUp';
import { WalletFilled } from '@swift/icons/WalletFilled';
import { useInView } from '../../../hooks/useInView';

const sections = [
    {
        id: 'offerings',
        eyebrow: 'How it works',
        title: 'We Handle Everything. You Just Save.',
        description:
            'We handle the full solar journey from survey to installation, so you can start saving without the paperwork.',
        // TODO: replace with final asset
        image:
            'https://cdn.solarsquare.in/blog/wp-content/uploads/2025/09/03143632/joureny-ty.webp',
        cta: 'Get a free quote',
        items: [
            {
                title: 'Free Home Visit & Rooftop Survey',
                description:
                    'Our team measures your rooftop to design a solar system for maximum generation.',
                Icon: Home,
                className: 'animate__fadeInRightShort',
            },
            {
                title: 'Free 3D Solar Design',
                description:
                    'We share a personalised 3D rooftop solar design, so you can clearly see how it will look on your home.',
                Icon: Image,
                className: 'animate__fadeInRightShort',
            },
            {
                title: 'Hassle-Free Installation & Subsidy Support',
                description:
                    'Our experts install your solar system and handle all paperwork, including the subsidy—no follow-ups needed.',
                Icon: Services,
                className: 'animate__fadeInRightShort',
            },
            {
                title: 'Solar On. You Save. We Maintain.',
                description:
                    'Your system starts saving from day one, while we handle maintenance for smooth performance year after year.',
                Icon: Flash,
                className: 'animate__fadeInRightShort',
            },
        ],
    },
    {
        id: 'why-us',
        eyebrow: 'Why SolarSquare',
        title: 'Why 1 Lakh+ Homes Chose Us',
        description:
            'From guaranteed savings to storm-proof engineering, every part of your solar journey is built to last.',
        // TODO: replace with final asset (placeholder)
        image:
            'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg',
        cta: 'Explore benefits',
        items: [
            {
                title: 'Guaranteed Savings',
                description:
                    'Save up to 90% on your electricity bills, backed by a money-back promise.',
                Icon: CheckShieldFilled,
                className: 'animate__fadeInRightShort',
            },
            {
                title: 'Hassle-Free Process',
                description:
                    'Zero middlemen. We manage survey, installation and subsidy paperwork end to end.',
                Icon: Services,
                className: 'animate__fadeInRightShort',
            },
            {
                title: 'Storm-Proof Structure',
                description:
                    'WindPro Mount™, validated by IIT Bombay, keeps your panels safe in any weather.',
                Icon: StarShieldFilled,
                className: 'animate__fadeInRightShort',
            },
            {
                title: 'Reliable After-Sales Service',
                description:
                    'Dedicated support and proactive maintenance for smooth performance, year after year.',
                Icon: CustomerServiceFilled,
                className: 'animate__fadeInRightShort',
            },
        ],
    },
    {
        id: 'goodzero',
        eyebrow: 'GoodZero™ Plan',
        title: 'India’s Only Guaranteed Solar Savings Plan',
        description:
            'GoodZero™ locks in your savings and takes maintenance, repairs and monitoring off your plate.',
        // TODO: replace with final asset (placeholder)
        image:
            'https://images.pexels.com/photos/9799718/pexels-photo-9799718.jpeg',
        cta: 'Know More about GoodZero',
        items: [
            {
                title: 'Money-Back Guarantee at ₹8/unit',
                description:
                    'We guarantee your solar savings, or we pay you the difference. No fine print.',
                Icon: PriceLockFilled,
                className: 'animate__fadeInRightShort',
            },
            {
                title: 'Proactive Maintenance Visits',
                description:
                    'Scheduled service visits keep your system generating at peak efficiency.',
                Icon: Settings,
                className: 'animate__fadeInRightShort',
            },
            {
                title: '₹0 Repair Costs',
                description:
                    'All repairs are on us for the life of the plan. No surprise bills, ever.',
                Icon: WalletFilled,
                className: 'animate__fadeInRightShort',
            },
            {
                title: 'Real-Time App Tracking',
                description:
                    'Track generation, savings and rewards live from the SolarSquare app.',
                Icon: TrendUp,
                className: 'animate__fadeInRightShort',
            },
        ],
    },
];

const STACK_GAP = 35;
const CARD_SCALE_STEP = 0.055;
const STAGE_TOP = 120;

const initialTransforms = sections.map((_, index) => ({
    scale: 1 - CARD_SCALE_STEP * index,
}));

type Section = (typeof sections)[number];

type CardTransform = {
    scale: number;
};

function clamp(value: number, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function SectionCard({
    section,
    index,
    transform,
    setRef,
}: {
    section: Section;
    index: number;
    transform: CardTransform;
    setRef: (node: HTMLElement | null) => void;
}) {
    const [listRef, inView] = useInView<HTMLUListElement>();
    const reverse = index % 2 === 1;

    return (
        <Card
            as="article"
            id={section.id}
            ref={setRef}
            variant="elevated"
            radius="lg"
            className={`group sticky mx-auto mb-8 flex max-w-6xl flex-col overflow-hidden ring-1 ring-black/5 transition-shadow duration-300 will-change-transform md:flex-row ${reverse ? 'md:flex-row-reverse' : ''}`}
            style={{
                top: STAGE_TOP + index * STACK_GAP,
                transform: `scale(${transform.scale})`,
                transformOrigin: 'top center',
                zIndex: index + 1,
            }}
        >
            <Card.Media className="relative h-64 shrink-0 md:h-auto md:w-1/4">
                <img
                    src={section.image}
                    alt={section.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/40 via-black/5 to-transparent" />
                <Badge
                    pill
                    appearance="solid"
                    className="absolute left-5 top-5 tabular-nums shadow-sm bg-surface-brand! text-content-on-brand!"
                >
                    {String(index + 1).padStart(2, '0')}
                </Badge>
            </Card.Media>

            <div className="flex flex-1 flex-col justify-center gap-5 bg-surface-muted p-5 sm:p-6">
                <div className="flex flex-col gap-3">
                    <Badge
                        pill
                        variant="info"
                        appearance="soft"
                        className="w-fit uppercase tracking-wider"
                    >
                        {section.eyebrow}
                    </Badge>
                    <Text variant="heading-lg" fontWeight="bold" className="text-balance">
                        {section.title}
                    </Text>
                    <Text
                        variant="para-md"
                        className="max-w-2xl text-pretty text-content-muted"
                    >
                        {section.description}
                    </Text>
                </div>

                <ul
                    ref={listRef}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                    {section.items.map((item, itemIndex) => (
                        <li
                            key={`${item.title}-${itemIndex}`}
                            className={`group/item relative flex h-full items-start gap-4 overflow-hidden rounded-2xl bg-surface p-4 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-level3 hover:ring-stroke-brand/40 ${
                                inView
                                    ? `animate__animated ${item.className}`
                                    : 'opacity-0'
                            }`}
                            style={
                                inView
                                    ? { animationDelay: `${itemIndex * 120}ms` }
                                    : undefined
                            }
                        >
                            {/* brand accent bar — grows in on hover */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-surface-brand to-transparent transition-transform duration-300 group-hover/item:scale-x-100"
                            />

                            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-content-on-brand shadow-md transition-transform duration-300 group-hover/item:-translate-y-0.5 group-hover/item:scale-105">
                                {/* soft glow behind the tile */}
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-xl bg-surface-brand opacity-30 blur-md transition-opacity duration-300 group-hover/item:opacity-60"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-xl"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, var(--color-surface-brand), color-mix(in oklab, var(--color-surface-brand) 55%, #000))',
                                    }}
                                />
                                <item.Icon size={20} className="relative" />
                            </span>

                            <div className="relative flex min-w-0 flex-col gap-1">
                                <Text variant="body-md" fontWeight="bold">
                                    {item.title}
                                </Text>
                                <Text
                                    variant="para-sm"
                                    className="text-pretty text-content-muted"
                                >
                                    {item.description}
                                </Text>
                            </div>

                            {/* ghosted step number, top-right */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute right-3 top-2 select-none text-3xl font-black leading-none tabular-nums text-content/6 transition-colors duration-300 group-hover/item:text-content-brand/15"
                            >
                                {String(itemIndex + 1).padStart(2, '0')}
                            </span>
                        </li>
                    ))}
                </ul>

                <div>
                    <Button variant={index === 0 ? 'primary' : 'outline'} size="md" className="!rounded-full">
                        {section.cta}
                        <Button.RightIcon>
                            <ArrowRight size={16} />
                        </Button.RightIcon>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function Lists() {
    const [transforms, setTransforms] =
        useState<CardTransform[]>(initialTransforms);

    const sectionRefs = useRef<Array<HTMLElement | null>>([]);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        const calculateTransforms = (): CardTransform[] => {
            return sections.map((_, index) => {
                const coveredByNextCards = sectionRefs.current
                    .slice(index + 1)
                    .reduce((depth, section, nextIndex) => {
                        if (!section) return depth;

                        const followingCardIndex = index + nextIndex + 1;
                        const stackTop = STAGE_TOP + followingCardIndex * STACK_GAP;
                        const rect = section.getBoundingClientRect();
                        const travelDistance = Math.max(window.innerHeight - stackTop, 1);
                        const progress = clamp(
                            (window.innerHeight - rect.top) / travelDistance,
                        );

                        return depth + progress;
                    }, 0);
                const scale = 1 - CARD_SCALE_STEP * coveredByNextCards;

                return { scale };
            });
        };

        const update = () => {
            setTransforms(calculateTransforms());
            rafId.current = null;
        };

        const handleScroll = () => {
            if (rafId.current === null) {
                rafId.current = window.requestAnimationFrame(update);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        update();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);

            if (rafId.current !== null) {
                window.cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    return (
        <div className="section-seam relative bg-surface-muted px-4 py-12 sm:px-8 lg:px-10">
            {/* Backdrop: dot grid fading toward the content. `inset-0` keeps
                it bounded, so no `overflow-hidden` is needed — which would
                otherwise break the cards' `position: sticky` stacking. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-dot-grid"
            />
            <div className="relative mx-auto max-w-7xl">
                <div className="relative">
                    {sections.map((section, index) => (
                        <SectionCard
                            key={`${section.id}-${index}`}
                            section={section}
                            index={index}
                            transform={transforms[index] ?? { scale: 1 }}
                            setRef={(node) => {
                                sectionRefs.current[index] = node;
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Lists;
