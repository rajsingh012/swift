import {
    type ComponentType,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { Badge } from '@swift/components/Badge';
import { Text } from '@swift/components/Text';
import { CheckShieldFilled } from '@swift/icons/CheckShieldFilled';
import { RupeeCircleFilled } from '@swift/icons/RupeeCircleFilled';
import { StarFilled } from '@swift/icons/StarFilled';
import { TrendUp } from '@swift/icons/TrendUp';

type IconProps = { size?: number };

type Feature = {
    key: string;
    label: string;
    title: string;
    desc: string;
    color: string;
    Icon: ComponentType<IconProps>;
    /** Position of the circle within the left panel (percent). */
    left: number;
    top: number;
};

// Solar / energy palette: sky · teal · green · amber
const features: Feature[] = [
    {
        key: 'secure',
        label: 'Secure',
        title: 'Storm-Proof & Secure',
        desc: 'WindPro Mount™, validated by IIT Bombay, keeps your panels safe through storms, heavy rain and high winds — backed by a solid warranty.',
        color: '#0ea5e9',
        Icon: CheckShieldFilled,
        left: 30,
        top: 15,
    },
    {
        key: 'smart',
        label: 'Smart',
        title: 'Smart Monitoring',
        desc: 'Track your generation, savings and rewards live from the SolarSquare app, with 100% visibility into how your system performs.',
        color: '#14b8a6',
        Icon: TrendUp,
        left: 54,
        top: 38,
    },
    {
        key: 'savings',
        label: 'Savings',
        title: 'Guaranteed Savings',
        desc: 'Cut your electricity bills by up to 90% from day one — with GoodZero™ your savings are guaranteed, or we pay you the difference.',
        color: '#16a34a',
        Icon: RupeeCircleFilled,
        left: 54,
        top: 63,
    },
    {
        key: 'trusted',
        label: 'Trusted',
        title: 'Award-Winning',
        desc: 'India’s most trusted residential solar company — #1 on the national portal with over 1 lakh homes already solarized.',
        color: '#f59e0b',
        Icon: StarFilled,
        left: 31,
        top: 85,
    },
];

const BOX_POS = { left: 21, top: 49 };

// Central graphic — isometric open brand-coloured box.
function BoxGraphic() {
    return (
        <svg
            viewBox="0 0 200 210"
            className="h-28 w-28 sm:h-32 sm:w-32"
            aria-hidden="true"
        >
            <path
                d="M32 86 L94 102 L94 190 L36 160 Z"
                fill="#6d28d9"
                stroke="#6d28d9"
                strokeWidth="6"
                strokeLinejoin="round"
            />
            <path
                d="M106 102 L168 86 L164 160 L106 190 Z"
                fill="#6d28d9"
                stroke="#6d28d9"
                strokeWidth="6"
                strokeLinejoin="round"
            />
            <path
                d="M44 78 L104 94 L164 46 L104 30 Z"
                fill="#8b5cf6"
                stroke="#8b5cf6"
                strokeWidth="6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

type Line = { x1: number; x2: number; y: number };

function FeaturesSection() {
    const [active, setActive] = useState(0);
    const current = features[active];
    const { Icon } = current;

    const wrapRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const circleRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [lines, setLines] = useState<Array<Line | null>>([]);

    useLayoutEffect(() => {
        const compute = () => {
            const wrap = wrapRef.current;
            const card = cardRef.current;
            if (!wrap || !card || window.innerWidth < 1024) {
                setLines([]);
                return;
            }
            const w = wrap.getBoundingClientRect();
            const p = card.getBoundingClientRect();
            setLines(
                features.map((_, i) => {
                    const circle = circleRefs.current[i];
                    if (!circle) return null;
                    const c = circle.getBoundingClientRect();
                    return {
                        x1: c.right - w.left,
                        x2: p.left - w.left,
                        y: c.top + c.height / 2 - w.top,
                    };
                }),
            );
        };
        compute();
        window.addEventListener('resize', compute);
        return () => window.removeEventListener('resize', compute);
    }, []);

    return (
        <section
            id="features"
            className="relative overflow-hidden py-20 text-content"
            style={{
                background:
                    'linear-gradient(135deg, color-mix(in oklab, var(--color-surface-brand) 7%, var(--color-surface)) 0%, var(--color-surface) 45%, color-mix(in oklab, var(--color-surface-brand) 9%, var(--color-surface)) 100%)',
            }}
        >
            {/* Animated background blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <span
                    className="blob-float absolute -left-16 top-10 h-72 w-72 rounded-full blur-3xl"
                    style={{ backgroundColor: '#0ea5e9', opacity: 0.16 }}
                />
                <span
                    className="blob-float absolute right-0 top-24 h-80 w-80 rounded-full blur-3xl"
                    style={{
                        backgroundColor: '#f59e0b',
                        opacity: 0.14,
                        animationDelay: '3s',
                    }}
                />
                <span
                    className="blob-float absolute -bottom-16 left-1/3 h-80 w-80 rounded-full blur-3xl"
                    style={{
                        backgroundColor: '#16a34a',
                        opacity: 0.14,
                        animationDelay: '6s',
                    }}
                />
                <span
                    className="blob-float absolute bottom-10 right-1/4 h-64 w-64 rounded-full blur-3xl"
                    style={{
                        backgroundColor: '#14b8a6',
                        opacity: 0.14,
                        animationDelay: '9s',
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
                <Badge
                    pill
                    variant="info"
                    appearance="soft"
                    className="uppercase tracking-wider"
                >
                    Why SolarSquare
                </Badge>
                <Text variant="heading-lg" fontWeight="bold" className="mt-4">
                    Everything You Get, In One Package
                </Text>
                <Text variant="para-md" color="secondary" className="mt-3">
                    Tap any benefit to see what makes going solar with us a smart,
                    worry-free choice.
                </Text>
            </div>

            <div className="relative mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
                <div
                    ref={wrapRef}
                    className="relative grid gap-10 lg:grid-cols-2 lg:gap-14"
                >
                    {/* Left — scattered box + circles */}
                    <div className="relative h-110 sm:h-130">
                        <div
                            className="absolute"
                            style={{
                                left: `${BOX_POS.left}%`,
                                top: `${BOX_POS.top}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <BoxGraphic />
                        </div>

                        {features.map((feature, i) => {
                            const CircleIcon = feature.Icon;
                            const isActive = active === i;
                            return (
                                <button
                                    key={feature.key}
                                    ref={(el) => {
                                        circleRefs.current[i] = el;
                                    }}
                                    type="button"
                                    onClick={() => setActive(i)}
                                    aria-pressed={isActive}
                                    aria-label={feature.title}
                                    className="group absolute outline-none"
                                    style={{
                                        left: `${feature.left}%`,
                                        top: `${feature.top}%`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <span
                                        className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full text-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 sm:h-24 sm:w-24"
                                        style={{
                                            backgroundColor: feature.color,
                                            transform: isActive
                                                ? 'scale(1.08)'
                                                : undefined,
                                            boxShadow: isActive
                                                ? `0 0 0 5px ${feature.color}44`
                                                : undefined,
                                        }}
                                    >
                                        <CircleIcon size={24} />
                                        <span className="text-[10px] font-semibold uppercase tracking-wide">
                                            {feature.label}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right — content card (fills the row height) */}
                    <div
                        ref={cardRef}
                        className="flex overflow-hidden rounded-3xl shadow-level3 transition-colors duration-500"
                        style={{ backgroundColor: current.color }}
                    >
                        <div
                            key={current.key}
                            className="animate__animated animate__fadeInUpShort flex flex-col justify-center gap-4 p-8 text-white sm:p-10"
                        >
                            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                                <Icon size={32} />
                            </span>
                            <p className="text-2xl font-bold">{current.title}</p>
                            <p className="leading-relaxed text-white/85">
                                {current.desc}
                            </p>
                        </div>
                    </div>

                    {/* Dotted connectors (lg+) — active bright, others faded */}
                    {lines.length ? (
                        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block">
                            {lines.map((ln, i) =>
                                ln ? (
                                    <line
                                        key={features[i].key}
                                        x1={ln.x1}
                                        y1={ln.y}
                                        x2={ln.x2}
                                        y2={ln.y}
                                        stroke={features[i].color}
                                        strokeWidth={active === i ? 2.5 : 1.5}
                                        strokeDasharray="2 7"
                                        strokeLinecap="round"
                                        opacity={active === i ? 1 : 0.25}
                                    />
                                ) : null,
                            )}
                        </svg>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
