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
    Art: ComponentType;
    Icon: ComponentType<IconProps>;
    /** Position of the circle within the left panel (percent). */
    left: number;
    top: number;
};

/* ── Flat-vector illustrations (one per feature) ──────────────────
   Same visual language as the "How It Works" scene: soft gradient
   backdrop, simple geometry, rounded caps, brand-adjacent colours. */

const artSvg =
    'h-full w-full animate__animated animate__fadeIn';

// 1 · Storm-Proof & Secure — panel under a shield, weathering rain & wind
function SecureArt() {
    return (
        <svg viewBox="0 0 520 200" preserveAspectRatio="xMidYMid slice" className={artSvg} aria-hidden="true">
            <defs>
                <linearGradient id="secure-bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#e0f2fe" />
                    <stop offset="1" stopColor="#f0f9ff" />
                </linearGradient>
            </defs>
            <rect width="520" height="200" fill="url(#secure-bg)" />
            {/* cloud + rain */}
            <g fill="#ffffff" opacity="0.85">
                <ellipse cx="110" cy="44" rx="36" ry="17" />
                <ellipse cx="146" cy="50" rx="24" ry="13" />
            </g>
            <g stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" opacity="0.55">
                <line x1="92" y1="66" x2="83" y2="86" />
                <line x1="118" y1="66" x2="109" y2="86" />
                <line x1="144" y1="66" x2="135" y2="86" />
            </g>
            {/* wind gusts */}
            <g stroke="#7dd3fc" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7">
                <path d="M40 108 H120 a10 10 0 1 0 -10 -10" />
                <path d="M40 130 H92 a8 8 0 1 1 -8 8" />
            </g>
            {/* ground */}
            <line x1="30" y1="172" x2="490" y2="172" stroke="#7dd3fc" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            {/* solar panel on a sturdy mount */}
            <line x1="150" y1="150" x2="150" y2="172" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            <g stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round">
                <polygon points="96,132 196,118 210,150 110,164" fill="#1e3a8a" />
                <line x1="130" y1="127" x2="144" y2="159" />
                <line x1="164" y1="123" x2="178" y2="155" />
                <line x1="103" y1="148" x2="203" y2="134" />
            </g>
            {/* shield with check */}
            <path
                d="M360 46 L412 32 L464 46 V96 C464 134 438 156 412 168 C386 156 360 134 360 96 Z"
                fill="#0ea5e9"
                stroke="#0284c7"
                strokeWidth="3"
                strokeLinejoin="round"
            />
            <path
                d="M388 100 L406 120 L440 76"
                stroke="#ffffff"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// 2 · Smart Monitoring — phone dashboard with a live generation chart
function SmartArt() {
    return (
        <svg viewBox="0 0 520 200" preserveAspectRatio="xMidYMid slice" className={artSvg} aria-hidden="true">
            <defs>
                <linearGradient id="smart-bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ccfbf1" />
                    <stop offset="1" stopColor="#f0fdfa" />
                </linearGradient>
                <linearGradient id="smart-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#14b8a6" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
            </defs>
            <rect width="520" height="200" fill="url(#smart-bg)" />
            {/* signal arcs */}
            <g stroke="#5eead4" strokeWidth="5" strokeLinecap="round" fill="none">
                <path d="M330 70 a48 48 0 0 1 70 0" />
                <path d="M345 84 a28 28 0 0 1 40 0" />
            </g>
            <circle cx="365" cy="98" r="6" fill="#14b8a6" />
            {/* floating stat pills */}
            <g>
                <rect x="330" y="120" width="118" height="26" rx="13" fill="#ffffff" />
                <circle cx="346" cy="133" r="6" fill="#22c55e" />
                <rect x="358" y="129" width="72" height="8" rx="4" fill="#99f6e4" />
            </g>
            {/* phone */}
            <rect x="118" y="34" width="120" height="150" rx="18" fill="#ffffff" stroke="#0f766e" strokeWidth="3" />
            <rect x="160" y="44" width="36" height="6" rx="3" fill="#99f6e4" />
            {/* screen */}
            <rect x="130" y="60" width="96" height="112" rx="8" fill="#f0fdfa" />
            {/* chart area + line */}
            <path d="M138 150 L160 128 L178 138 L196 108 L218 92 V164 H138 Z" fill="url(#smart-area)" />
            <path
                d="M138 150 L160 128 L178 138 L196 108 L218 92"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="218" cy="92" r="4.5" fill="#0f766e" />
            {/* mini bars on screen */}
            <g fill="#5eead4">
                <rect x="140" y="86" width="9" height="14" rx="2" />
                <rect x="154" y="80" width="9" height="20" rx="2" />
                <rect x="168" y="74" width="9" height="26" rx="2" />
            </g>
        </svg>
    );
}

// 3 · Guaranteed Savings — falling bill, descending bars, ₹ coin
function SavingsArt() {
    return (
        <svg viewBox="0 0 520 200" preserveAspectRatio="xMidYMid slice" className={artSvg} aria-hidden="true">
            <defs>
                <linearGradient id="savings-bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#dcfce7" />
                    <stop offset="1" stopColor="#f0fdf4" />
                </linearGradient>
            </defs>
            <rect width="520" height="200" fill="url(#savings-bg)" />
            {/* descending bar chart */}
            <g>
                <rect x="72" y="66" width="26" height="100" rx="5" fill="#fca5a5" />
                <rect x="108" y="90" width="26" height="76" rx="5" fill="#fcd34d" />
                <rect x="144" y="116" width="26" height="50" rx="5" fill="#86efac" />
                <rect x="180" y="138" width="26" height="28" rx="5" fill="#22c55e" />
            </g>
            {/* downward trend arrow */}
            <path
                d="M78 78 L120 104 L156 128 L206 150"
                fill="none"
                stroke="#15803d"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M206 150 L190 146 M206 150 L202 134"
                fill="none"
                stroke="#15803d"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* ₹ coin */}
            <circle cx="380" cy="98" r="52" fill="#22c55e" />
            <circle cx="380" cy="98" r="52" fill="none" stroke="#15803d" strokeWidth="4" strokeDasharray="4 7" opacity="0.6" />
            <text
                x="380"
                y="120"
                textAnchor="middle"
                fontSize="58"
                fontWeight="700"
                fill="#ffffff"
                fontFamily="system-ui, sans-serif"
            >
                ₹
            </text>
            {/* small coins */}
            <g fill="#4ade80" stroke="#16a34a" strokeWidth="2">
                <ellipse cx="440" cy="158" rx="26" ry="9" />
                <ellipse cx="440" cy="150" rx="26" ry="9" />
            </g>
        </svg>
    );
}

// 4 · Award-Winning — trophy, ribbon rosette, stars
function TrustedArt() {
    return (
        <svg viewBox="0 0 520 200" preserveAspectRatio="xMidYMid slice" className={artSvg} aria-hidden="true">
            <defs>
                <linearGradient id="trusted-bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fef3c7" />
                    <stop offset="1" stopColor="#fffbeb" />
                </linearGradient>
            </defs>
            <rect width="520" height="200" fill="url(#trusted-bg)" />
            {/* sparkle stars */}
            <g fill="#fbbf24">
                <path d="M120 46 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6 z" />
                <path d="M410 60 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" opacity="0.8" />
                <circle cx="150" cy="150" r="4" opacity="0.7" />
                <circle cx="390" cy="140" r="5" opacity="0.7" />
            </g>
            {/* trophy cup */}
            <path
                d="M212 44 H308 V78 a48 48 0 0 1 -96 0 Z"
                fill="#f59e0b"
                stroke="#b45309"
                strokeWidth="3"
                strokeLinejoin="round"
            />
            {/* handles */}
            <path d="M212 52 h-22 a16 16 0 0 0 0 32 h10" fill="none" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
            <path d="M308 52 h22 a16 16 0 0 1 0 32 h-10" fill="none" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
            {/* stem + base */}
            <rect x="252" y="122" width="16" height="22" fill="#d97706" />
            <rect x="228" y="144" width="64" height="12" rx="3" fill="#b45309" />
            <rect x="238" y="156" width="44" height="10" rx="3" fill="#92400e" />
            {/* star on the cup */}
            <path
                d="M260 62 l7 16 17 1 -13 11 4 17 -15 -9 -15 9 4 -17 -13 -11 17 -1 z"
                fill="#fffbeb"
            />
            {/* #1 ribbon rosette */}
            <circle cx="392" cy="118" r="26" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
            <path d="M380 140 l-8 26 14 -8 14 8 -8 -26" fill="#16a34a" />
            <text
                x="392"
                y="126"
                textAnchor="middle"
                fontSize="22"
                fontWeight="800"
                fill="#ffffff"
                fontFamily="system-ui, sans-serif"
            >
                #1
            </text>
        </svg>
    );
}

// Solar / energy palette: sky · teal · green · amber
const features: Feature[] = [
    {
        key: 'secure',
        label: 'Secure',
        title: 'Storm-Proof & Secure',
        desc: 'WindPro Mount™, validated by IIT Bombay, keeps your panels safe through storms, heavy rain and high winds — backed by a solid warranty.',
        color: '#0ea5e9',
        Art: SecureArt,
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
        Art: SmartArt,
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
        Art: SavingsArt,
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
        Art: TrustedArt,
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

                    {/* Right — image on top, content below (fills the row height) */}
                    <div
                        ref={cardRef}
                        className="flex flex-col overflow-hidden rounded-3xl shadow-level3"
                    >
                        <div
                            key={`${current.key}-art`}
                            className="h-44 w-full shrink-0 sm:h-52"
                        >
                            <current.Art />
                        </div>
                        <div
                            key={current.key}
                            className="animate__animated animate__revealUp flex flex-1 flex-col justify-center gap-4 p-8 text-white transition-colors duration-500 sm:p-10"
                            style={{ backgroundColor: current.color }}
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
