import { useEffect, useState, type ReactNode } from 'react';
import { Badge } from '@swift/components/Badge';
import { Text } from '@swift/components/Text';
import { Flash } from '@swift/icons/Flash';
import { Home } from '@swift/icons/Home';
import { useInView } from '../../../hooks/useInView';

/* ── Small SVG glyphs reused in the legend ─────────────────────── */

function SunGlyph() {
    return (
        <svg
            viewBox="0 0 64 64"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={5}
            strokeLinecap="round"
            aria-hidden="true"
        >
            <line x1="32" y1="3" x2="32" y2="12" />
            <line x1="32" y1="52" x2="32" y2="61" />
            <line x1="3" y1="32" x2="12" y2="32" />
            <line x1="52" y1="32" x2="61" y2="32" />
            <line x1="11" y1="11" x2="17" y2="17" />
            <line x1="47" y1="47" x2="53" y2="53" />
            <line x1="53" y1="11" x2="47" y2="17" />
            <line x1="17" y1="47" x2="11" y2="53" />
            <circle cx="32" cy="32" r="10" fill="currentColor" stroke="none" />
        </svg>
    );
}

function PanelGlyph() {
    return (
        <svg
            viewBox="0 0 64 64"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M14 42 L24 18 L54 18 L44 42 Z" />
            <path d="M34 18 L29 42" />
            <path d="M44 18 L39 42" />
            <path d="M19 30 L49 30" />
            <path d="M29 42 L29 54" />
            <path d="M20 54 L38 54" />
        </svg>
    );
}

/* ── Falling-bill card ─────────────────────────────────────────── */

function MiniBars() {
    const bars = [
        { h: 16, c: '#fca5a5' },
        { h: 12, c: '#fcd34d' },
        { h: 8, c: '#86efac' },
        { h: 5, c: '#22c55e' },
    ];
    return (
        <svg width="56" height="20" viewBox="0 0 56 20" aria-hidden="true">
            {bars.map((b, i) => (
                <rect
                    key={i}
                    x={i * 14 + 2}
                    y={20 - b.h}
                    width="9"
                    height={b.h}
                    rx="1.5"
                    fill={b.c}
                />
            ))}
        </svg>
    );
}

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function BillCard({ active }: { active: boolean }) {
    const [value, setValue] = useState(() => (prefersReducedMotion() ? 300 : 4000));

    useEffect(() => {
        if (!active || prefersReducedMotion()) return;

        const from = 4000;
        const to = 300;
        const duration = 1700;
        let raf = 0;
        let startTs = 0;

        const tick = (ts: number) => {
            if (!startTs) startTs = ts;
            const progress = Math.min((ts - startTs) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(from + (to - from) * eased));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active]);

    return (
        <div className="absolute right-3 top-3 w-40 rounded-2xl border border-black/5 bg-white/95 p-3 shadow-level3 backdrop-blur sm:right-6 sm:top-6">
            <p
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: '#64748b' }}
            >
                Monthly bill
            </p>
            <p
                className="mt-0.5 text-2xl font-bold leading-none tabular-nums"
                style={{ color: '#0f172a' }}
            >
                ₹{value.toLocaleString('en-IN')}
            </p>
            <div className="mt-2 flex items-center justify-between">
                <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
                >
                    <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true">
                        <path
                            d="M6 2 V9 M3 6 L6 9.5 L9 6"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                    90%
                </span>
                <MiniBars />
            </div>
        </div>
    );
}

/* ── The animated scene ────────────────────────────────────────── */

function SolarScene({ active }: { active: boolean }) {
    return (
        <div
            className="relative w-full overflow-hidden rounded-3xl border border-stroke shadow-level3"
            style={{
                background:
                    'linear-gradient(180deg,#cfe8ff 0%,#eaf4ff 58%,#e7fbe6 100%)',
            }}
        >
            <svg
                viewBox="0 0 600 360"
                className="h-auto w-full"
                role="img"
                aria-label="Sunlight hits a solar panel, flows through an inverter, and lights up a home while the electricity bill falls."
            >
                {/* ─ Sun ─ */}
                <circle cx="95" cy="82" r="54" fill="#fde68a" opacity="0.45" />
                <g
                    className="sun-rays"
                    stroke="#fbbf24"
                    strokeWidth="6"
                    strokeLinecap="round"
                >
                    <line x1="95" y1="28" x2="95" y2="40" />
                    <line x1="95" y1="124" x2="95" y2="136" />
                    <line x1="41" y1="82" x2="53" y2="82" />
                    <line x1="137" y1="82" x2="149" y2="82" />
                    <line x1="57" y1="44" x2="66" y2="53" />
                    <line x1="124" y1="111" x2="133" y2="120" />
                    <line x1="133" y1="44" x2="124" y2="53" />
                    <line x1="66" y1="111" x2="57" y2="120" />
                </g>
                <circle
                    className="sun-core"
                    cx="95"
                    cy="82"
                    r="30"
                    fill="#fbbf24"
                />

                {/* ─ Sun beams to the panel ─ */}
                <g stroke="#fbbf24" strokeWidth="9" strokeLinecap="round">
                    <line
                        className="beam"
                        x1="110"
                        y1="100"
                        x2="165"
                        y2="150"
                        style={{ animationDelay: '0ms' }}
                    />
                    <line
                        className="beam"
                        x1="120"
                        y1="95"
                        x2="215"
                        y2="140"
                        style={{ animationDelay: '400ms' }}
                    />
                    <line
                        className="beam"
                        x1="125"
                        y1="105"
                        x2="255"
                        y2="150"
                        style={{ animationDelay: '800ms' }}
                    />
                </g>

                {/* ─ Drifting clouds (sky depth) ─ */}
                <g fill="#ffffff" opacity="0.75">
                    <g className="cloud-drift">
                        <ellipse cx="360" cy="70" rx="34" ry="15" />
                        <ellipse cx="392" cy="76" rx="24" ry="12" />
                        <ellipse cx="332" cy="78" rx="20" ry="10" />
                    </g>
                    <g className="cloud-drift" style={{ animationDelay: '4s' }} opacity="0.85">
                        <ellipse cx="490" cy="112" rx="26" ry="12" />
                        <ellipse cx="514" cy="118" rx="18" ry="9" />
                    </g>
                </g>

                {/* ─ Ground ─ */}
                <line
                    x1="24"
                    y1="285"
                    x2="576"
                    y2="285"
                    stroke="#86efac"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.7"
                />
                {/* Grass tufts for depth */}
                <g stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
                    <path d="M70 285 q-3 -9 -6 -12 M70 285 q0 -10 0 -13 M70 285 q3 -9 6 -12" fill="none" />
                    <path d="M300 285 q-3 -8 -5 -11 M300 285 q0 -9 0 -12 M300 285 q3 -8 5 -11" fill="none" />
                    <path d="M410 285 q-2 -7 -4 -10 M410 285 q0 -8 0 -11 M410 285 q2 -7 4 -10" fill="none" />
                </g>
                {/* Soft ground shadows under panel pole + house */}
                <ellipse cx="217" cy="287" rx="26" ry="4" fill="#166534" opacity="0.12" />
                <ellipse cx="495" cy="288" rx="70" ry="5" fill="#166534" opacity="0.12" />

                {/* ─ Solar panel (tilted, ground-mounted) ─ */}
                <line
                    x1="217"
                    y1="182"
                    x2="217"
                    y2="285"
                    stroke="#64748b"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <g stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round">
                    <polygon
                        points="150,150 255,135 270,175 165,190"
                        fill="#1e3a8a"
                    />
                    <line x1="185" y1="145" x2="200" y2="185" />
                    <line x1="220" y1="140" x2="235" y2="180" />
                    <line x1="157" y1="170" x2="262" y2="155" />
                </g>

                {/* ─ Energy wire: panel → inverter → home ─ */}
                <path
                    className="flow-line"
                    d="M217 285 H350 M384 285 H430"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Energy packets travelling along the wire */}
                <g fill="#fbbf24">
                    <circle
                        className="energy-dot"
                        cx="217"
                        cy="285"
                        r="4"
                        style={{ animationDelay: '0ms' }}
                    />
                    <circle
                        className="energy-dot"
                        cx="217"
                        cy="285"
                        r="4"
                        style={{ animationDelay: '730ms' }}
                    />
                    <circle
                        className="energy-dot"
                        cx="217"
                        cy="285"
                        r="4"
                        style={{ animationDelay: '1460ms' }}
                    />
                </g>

                {/* ─ Inverter ─ */}
                <rect
                    x="350"
                    y="232"
                    width="34"
                    height="53"
                    rx="4"
                    fill="#e2e8f0"
                    stroke="#64748b"
                    strokeWidth="2"
                />
                <rect x="356" y="240" width="22" height="15" rx="2" fill="#94a3b8" />
                <circle className="lit" cx="361" cy="266" r="3" fill="#22c55e" />
                <circle cx="373" cy="266" r="3" fill="#cbd5e1" />

                {/* ─ House ─ */}
                <rect
                    x="430"
                    y="205"
                    width="130"
                    height="80"
                    fill="#f1f5f9"
                    stroke="#94a3b8"
                    strokeWidth="2"
                />
                <polygon
                    points="418,207 495,156 572,207"
                    fill="#f59e0b"
                    stroke="#b45309"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Warm glow radiating from the bulb */}
                <circle
                    className="home-glow"
                    cx="486"
                    cy="239"
                    r="30"
                    fill="#fde047"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />

                {/* Hanging bulb — light on (cord → cap → glass) */}
                <line
                    x1="486"
                    y1="205"
                    x2="486"
                    y2="224"
                    stroke="#64748b"
                    strokeWidth="2"
                />
                <circle className="lit" cx="486" cy="239" r="17" fill="#fde047" />
                <circle
                    cx="486"
                    cy="239"
                    r="9"
                    fill="#fef9c3"
                    stroke="#eab308"
                    strokeWidth="2"
                />
                <rect x="482" y="224" width="8" height="7" rx="1.5" fill="#a16207" />

                {/* Door */}
                <rect x="436" y="245" width="24" height="40" fill="#94a3b8" />
                <circle cx="456" cy="266" r="2" fill="#f8fafc" />

                {/* Window — lights on */}
                <rect
                    x="524"
                    y="224"
                    width="28"
                    height="28"
                    fill="#cbd5e1"
                    stroke="#64748b"
                    strokeWidth="2"
                />
                <rect
                    className="lit"
                    x="524"
                    y="224"
                    width="28"
                    height="28"
                    fill="#fde047"
                />
                <g stroke="#64748b" strokeWidth="2">
                    <line x1="538" y1="224" x2="538" y2="252" />
                    <line x1="524" y1="238" x2="552" y2="238" />
                </g>

                {/* ─ Numbered labels ─ */}
                <g
                    fill="#334155"
                    fontSize="13"
                    fontWeight="700"
                    textAnchor="middle"
                >
                    <text x="95" y="170">
                        1 · Sunlight
                    </text>
                    <text x="210" y="312">
                        2 · Panels
                    </text>
                    <text x="367" y="312">
                        3 · Inverter
                    </text>
                    <text x="497" y="312">
                        4 · Home
                    </text>
                </g>
            </svg>

            <BillCard active={active} />
        </div>
    );
}

/* ── Legend ────────────────────────────────────────────────────── */

type LegendItem = {
    n: number;
    title: string;
    desc: string;
    glyph: ReactNode;
    color: string;
};

const legend: LegendItem[] = [
    {
        n: 1,
        title: 'Sunlight',
        desc: 'The sun shines free energy onto your panels.',
        glyph: <SunGlyph />,
        color: '#f59e0b',
    },
    {
        n: 2,
        title: 'Solar Panels',
        desc: 'Panels convert that sunlight into DC electricity.',
        glyph: <PanelGlyph />,
        color: '#2563eb',
    },
    {
        n: 3,
        title: 'Inverter',
        desc: 'It converts DC into home-ready AC power.',
        glyph: <Flash size={18} />,
        color: '#7c3aed',
    },
    {
        n: 4,
        title: 'Lights On, Bills Down',
        desc: 'Your home runs on solar and your bill drops.',
        glyph: <Home size={18} />,
        color: '#16a34a',
    },
];

/* ── Section ───────────────────────────────────────────────────── */

function EnergyFlowSection() {
    const [ref, inView] = useInView<HTMLDivElement>();

    return (
        <section
            id="how-solar-works"
            className="section-seam relative overflow-hidden py-20 text-content"
        >
            {/* Backdrop: diagonal energy hatching + drifting brand glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-diagonal-lines"
            />
            <div
                aria-hidden="true"
                className="glow-brand pointer-events-none absolute -right-24 top-8 h-80 w-80 rounded-full blur-3xl"
            />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    ref={ref}
                    className="grid items-center gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-14"
                >
                    {/* Scene */}
                    <div
                        className={
                            inView
                                ? 'animate__animated animate__fadeInLeftShort'
                                : 'opacity-0'
                        }
                    >
                        <SolarScene active={inView} />
                    </div>

                    {/* Text + legend */}
                    <div
                        className={`flex flex-col gap-6 ${
                            inView
                                ? 'animate__animated animate__fadeInRightShort'
                                : 'opacity-0'
                        }`}
                    >
                        <div className="flex flex-col gap-3">
                            <Badge
                                pill
                                variant="info"
                                appearance="soft"
                                className="w-fit uppercase tracking-wider"
                            >
                                How It Works
                            </Badge>
                            <Text variant="heading-lg" fontWeight="bold">
                                From Sunlight to Savings
                            </Text>
                            <Text variant="para-md" className='text-content-muted'>
                                Watch a ray of sunlight travel from the sky to
                                your rooftop — turning the lights on and your
                                bill down.
                            </Text>
                        </div>

                        <div className="flex flex-col gap-4">
                            {legend.map((item) => (
                                <div key={item.n} className="flex gap-3">
                                    <span
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: `${item.color}1f`,
                                            color: item.color,
                                        }}
                                    >
                                        {item.glyph}
                                    </span>
                                    <div className="flex flex-col gap-0.5">
                                        <Text
                                            variant="body-md"
                                            fontWeight="semibold"
                                        >
                                            {item.n}. {item.title}
                                        </Text>
                                        <Text
                                            variant="body-sm"
                                            className='text-content-muted'
                                        >
                                            {item.desc}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EnergyFlowSection;
