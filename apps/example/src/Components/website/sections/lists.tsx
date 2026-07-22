import { useEffect, useRef, useState } from 'react';
import { Home } from '@swift/icons/Home';
import { Image } from '@swift/icons/Image';
import { Services } from '@swift/icons/Services';
import { Flash } from '@swift/icons/Flash';
import { useInView } from '../../../hooks/useInView';

const sections = [
    {
        id: 'offerings',
        title: 'We Handle Everything. You Just Save.',
        description:
            'We handle the full solar journey from survey to installation, so you can start saving without the paperwork.',
        image:
            'https://cdn.solarsquare.in/blog/wp-content/uploads/2025/09/03143632/joureny-ty.webp',
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
        id: 'solutions',
        title: 'Wind Turbine Maintenance',
        description:
            'Suspendisse suscipit sagittis leo sitea Consectetur elit. Nulla vitae elit libero, a pharetra.',
        image:
            'https://images.pexels.com/photos/20208374/pexels-photo-20208374.jpeg',
    },
    {
        id: 'inspection',
        title: 'Wind Turbine Inspection',
        description:
            'Suspendisse suscipit sagittis leo sitea Consectetur elit. Nulla vitae elit libero, a pharetra.',
        image:
            'https://images.pexels.com/photos/20208374/pexels-photo-20208374.jpeg',
    },
];

const STACK_GAP = 35;
const CARD_SCALE_STEP = 0.055;
const STAGE_TOP = 120;

const initialTransforms = sections.map((_, index) => ({
    scale: 1 - CARD_SCALE_STEP * index,
}));

type CardTransform = {
    scale: number;
};

function clamp(value: number, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function Lists() {
    const [transforms, setTransforms] =
        useState<CardTransform[]>(initialTransforms);

    const sectionRefs = useRef<Array<HTMLElement | null>>([]);
    const rafId = useRef<number | null>(null);
    const [gridRef, inView] = useInView<HTMLUListElement>();

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
        <div className="bg-surface px-4 py-12 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="relative">
                    {sections.map((section, index) => {
                        const transform = transforms[index] ?? { scale: 1 };

                        return (
                            <article
                                id={section.id}
                                key={`${section.title}-${index}`}
                                ref={(node) => {
                                    sectionRefs.current[index] = node;
                                }}
                                className="sticky mx-auto mb-8 flex max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-stroke bg-surface-elevated shadow-level4 will-change-transform md:flex-row"
                                style={{
                                    top: STAGE_TOP + index * STACK_GAP,
                                    transform: `scale(${transform.scale})`,
                                    transformOrigin: 'top center',
                                    zIndex: index + 1,
                                }}
                            >
                                <div className="h-64 w-full shrink-0 md:h-auto md:w-1/2">
                                    <img
                                        src={section.image}
                                        alt={section.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col justify-center bg-surface-muted p-8 text-content sm:p-12 md:p-16">

                                    <h2 className="mb-6 text-3xl font-bold text-content-strong sm:text-4xl">
                                        {section.title}
                                    </h2>

                                    {section.items ? (
                                        <ul ref={gridRef} className="mb-8 space-y-6 text-content-secondary">
                                            {section.items.map((item, itemIndex) => (
                                                <li
                                                    key={`${item.title}-${itemIndex}`}
                                                    className={`flex gap-4 ${inView ? `animate__animated ${item.className}` : 'opacity-0'}`}
                                                    style={inView ? { animationDelay: `${itemIndex * 200}ms` } : undefined}
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stroke bg-surface text-content-strong">
                                                        <item.Icon size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-content-strong">{item.title}</h3>
                                                        <p className="mt-2 text-sm leading-relaxed text-content-secondary flex gap-2 items-start"> <span className="h-px w-6 bg-surface-brand mt-3" /> {item.description}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mb-8 text-lg leading-relaxed text-content-secondary">
                                            {section.description}
                                        </p>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Lists;