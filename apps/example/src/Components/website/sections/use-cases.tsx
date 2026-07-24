import { useEffect, useState, type ReactNode } from 'react';
import { Carousel } from '@swift/components/Carousel';
import { Badge } from '@swift/components/Badge';
import { Text } from '@swift/components/Text';
import { Home } from '@swift/icons/Home';
import { Settings } from '@swift/icons/Settings';
import { GridSmallFilled } from '@swift/icons/GridSmallFilled';
import { HeartFilled } from '@swift/icons/HeartFilled';
import { MoreHoriz } from '@swift/icons/MoreHoriz';
import { Wifi } from '@swift/icons/Wifi';
import { Signal } from '@swift/icons/Signal';
import { BatteryFull } from '@swift/icons/BatteryFull';
import { useInView } from '../../../hooks/useInView';
import { UseCaseArt, type SceneKey } from './use-case-art';

/* ── Solar deployment scenarios ────────────────────────────────── */

type UseCase = {
    scene: SceneKey;
    label: string;
    tagline: string;
    /** Ambient accent that morphs the glow + live UI per scene. */
    accent: string;
    /** Live monitoring figures shown on the phone screen. */
    live: string;
    today: string;
    saved: string;
};

const USE_CASES: UseCase[] = [
    { scene: 'homes', label: 'Homes', tagline: 'Cut your bill up to 90%', accent: '#10b981', live: '4.2 kW', today: '14.2', saved: '₹1,240' },
    { scene: 'housing', label: 'Housing Societies', tagline: 'Power shared common areas', accent: '#0ea5e9', live: '38 kW', today: '182', saved: '₹9,600' },
    { scene: 'farms', label: 'Farms', tagline: 'Run pumps on free sunlight', accent: '#f59e0b', live: '11 kW', today: '46', saved: '₹3,100' },
    { scene: 'factories', label: 'Factories', tagline: 'Slash industrial energy costs', accent: '#8b5cf6', live: '120 kW', today: '640', saved: '₹42,000' },
    { scene: 'hospitals', label: 'Hospitals', tagline: 'Reliable round-the-clock power', accent: '#ef4444', live: '64 kW', today: '310', saved: '₹18,400' },
    { scene: 'schools', label: 'Schools', tagline: 'Learn under a greener roof', accent: '#3b82f6', live: '22 kW', today: '96', saved: '₹5,700' },
    { scene: 'retail', label: 'Retail Stores', tagline: 'Keep the lights on for less', accent: '#14b8a6', live: '9 kW', today: '38', saved: '₹2,450' },
    { scene: 'warehouses', label: 'Warehouses', tagline: 'Big roofs, bigger savings', accent: '#f97316', live: '86 kW', today: '410', saved: '₹27,800' },
    { scene: 'petrol', label: 'Petrol Pumps', tagline: 'Fuel stations gone solar', accent: '#22c55e', live: '17 kW', today: '72', saved: '₹4,900' },
];

/* ── Count-up number (animates when its phone becomes active) ───── */

function CountUp({ value, active }: { value: string; active: boolean }) {
    const target = parseFloat(value);
    const decimals = value.includes('.') ? value.split('.')[1].length : 0;
    const [display, setDisplay] = useState(active ? 0 : target);

    useEffect(() => {
        let raf = 0;
        // Inactive: settle on the final figure (async, in a frame, so we
        // never call setState synchronously inside the effect body).
        if (!active) {
            raf = requestAnimationFrame(() => setDisplay(target));
            return () => cancelAnimationFrame(raf);
        }
        // Active: ease from 0 up to the target. The first frame writes 0,
        // subsequent frames animate — all setState calls happen in rAF.
        let startTs = 0;
        const duration = 900;
        const tick = (now: number) => {
            if (!startTs) startTs = now;
            const t = Math.min((now - startTs) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(target * eased);
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active, target]);

    return <>{display.toFixed(decimals)}</>;
}

/* ── Bottom-bar tab ────────────────────────────────────────────── */

function TabItem({
    Icon,
    label,
    active,
    badge,
    activeColor = '#10b981',
}: {
    Icon: (props: { size?: number }) => ReactNode;
    label: string;
    active?: boolean;
    badge?: string;
    activeColor?: string;
}) {
    return (
        <span
            className="relative flex flex-col items-center gap-0.5"
            style={{ color: active ? activeColor : undefined }}
        >
            <span className={active ? '' : 'text-white/45'}>
                <Icon size={18} />
            </span>
            <span className={`text-[9px] font-medium ${active ? '' : 'text-white/45'}`}>
                {label}
            </span>
            {badge && (
                <span className="absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white">
                    {badge}
                </span>
            )}
        </span>
    );
}

/* ── Phone slide — one shared frame for every scene, so all slides
   share the exact same footprint (fixes the uneven gaps). The centre
   / active slide lights up with the ambient glow, float, glare and
   live emphasis; the rest stay calm. ─────────────────────────────── */

function PhoneCard({ item, active }: { item: UseCase; active: boolean }) {
    const { accent } = item;

    return (
        <div className="relative flex w-full items-center justify-center">
            {/* Ambient accent glow (active only) */}
            {active && (
                <div
                    aria-hidden="true"
                    className="blob-float pointer-events-none absolute h-72 w-72 rounded-full blur-3xl transition-colors duration-700"
                    style={{ backgroundColor: `${accent}40` }}
                />
            )}

            <div className={`relative w-full ${active ? 'phone-float' : ''}`}>
                {/* Phone frame */}
                <div className="relative aspect-9/19 w-full rounded-[2.75rem] border-8 border-neutral-900 bg-neutral-900 shadow-level4">
                    {/* Dynamic island */}
                    <div className="absolute left-1/2 top-2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-neutral-900" />

                    {/* Screen */}
                    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.1rem] bg-slate-900 text-white">
                        {/* Status bar */}
                        <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[11px] font-semibold">
                            <span className="tabular-nums">14:26</span>
                            <span className="flex items-center gap-1 text-white/90">
                                <Signal size={13} />
                                <Wifi size={13} />
                                <BatteryFull size={15} />
                            </span>
                        </div>

                        {/* App header */}
                        <div className="flex items-center justify-between px-4 py-2">
                            <span className="flex h-7 w-7 flex-col items-center justify-center gap-0.75">
                                <span className="h-0.5 w-4 rounded-full bg-white/80" />
                                <span className="h-0.5 w-4 rounded-full bg-white/80" />
                                <span className="h-0.5 w-4 rounded-full bg-white/80" />
                            </span>
                            <div className="flex flex-col items-center leading-tight">
                                <span className="text-sm font-bold">Swift Solar</span>
                                <span className="text-[10px]" style={{ color: accent }}>
                                    Normal · On Grid
                                </span>
                            </div>
                            <span className="text-white/70">
                                <MoreHoriz size={18} />
                            </span>
                        </div>

                        {/* Hero illustration with live overlays */}
                        <div className="relative mx-3 mt-1 min-h-0 flex-1 overflow-hidden rounded-2xl">
                            <UseCaseArt scene={item.scene} />
                            {/* Live chip */}
                            <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-1 backdrop-blur-sm">
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${active ? 'animate-pulse' : ''}`}
                                    style={{ backgroundColor: accent }}
                                />
                                <span className="text-[9px] font-semibold text-white">
                                    Live · {item.live}
                                </span>
                            </div>
                            {/* Saved chip */}
                            <div className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-1 backdrop-blur-sm">
                                <span className="text-[9px] font-semibold text-white">
                                    Saved {item.saved}
                                </span>
                            </div>
                        </div>

                        {/* Live generation strip */}
                        <div className="flex items-end justify-between px-4 pt-2.5">
                            <div className="flex flex-col leading-none">
                                <span className="text-[9px] uppercase tracking-wide text-white/50">
                                    {item.label} · today
                                </span>
                                <span
                                    className={`mt-1 text-2xl font-bold tabular-nums ${
                                        active ? 'value-glow' : ''
                                    }`}
                                >
                                    <CountUp value={item.today} active={active} />
                                    <span className="ml-1 text-xs font-medium text-white/60">
                                        units
                                    </span>
                                </span>
                            </div>
                            {/* Mini live production bars */}
                            <div className="flex h-8 items-end gap-0.75">
                                {[40, 62, 48, 78, 90, 66, 84].map((h, i) => (
                                    <span
                                        key={i}
                                        className={`w-1 rounded-full ${active ? 'bar-breathe' : ''}`}
                                        style={{
                                            height: `${h}%`,
                                            backgroundColor: accent,
                                            animationDelay: `${i * 110}ms`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Bottom tab bar */}
                        <div className="mt-3 flex items-center justify-around border-t border-white/10 px-2 py-2.5">
                            <TabItem Icon={Home} label="Home" activeColor={accent} active />
                            <TabItem Icon={GridSmallFilled} label="Device" />
                            <TabItem Icon={HeartFilled} label="Service" badge="23" />
                            <TabItem Icon={Settings} label="Settings" />
                        </div>

                        {/* Sweeping screen glare (active only) */}
                        {active && (
                            <div
                                aria-hidden="true"
                                className="screen-glare pointer-events-none absolute -top-10 left-0 z-20 h-[140%] w-14 bg-linear-to-r from-transparent via-white/20 to-transparent"
                            />
                        )}
                    </div>
                </div>

                {/* Reflection (active only) */}
                {active && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-8 left-1/2 h-10 w-40 -translate-x-1/2 rounded-[50%] bg-black/40 blur-xl"
                    />
                )}
            </div>
        </div>
    );
}

/* ── Section ───────────────────────────────────────────────────── */

function UseCasesSection() {
    const [ref, inView] = useInView<HTMLDivElement>();
    const [active, setActive] = useState(0);

    // Every slide is the same phone footprint, so slidesPerView just sets
    // how wide each phone is; the slides sit a tight 16px apart.
    const [slidesPerView, setSlidesPerView] = useState(4);
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w < 640) setSlidesPerView(1.4);
            else if (w < 1024) setSlidesPerView(2.4);
            else setSlidesPerView(4);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <section
            id="where-solar-works"
            className="relative overflow-hidden bg-surface py-20 text-content"
        >
            {/* Backdrop: soft grid + giant ghost scene number (mirrors the
                app-showcase section), tinted to the active scene accent. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        'linear-gradient(var(--color-content) 1px, transparent 1px), linear-gradient(90deg, var(--color-content) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    maskImage:
                        'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
                }}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none text-[40vh] font-black leading-none tabular-nums transition-colors duration-700 sm:right-6"
                style={{ color: `${USE_CASES[active].accent}12` }}
            >
                {active + 1}
            </span>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                        scales to fit — drag through to watch each space go live.
                    </Text>
                </div>

                {/* Coverflow */}
                <div
                    className={`mt-14 ${
                        inView
                            ? 'animate__animated animate__fadeInUpShort animate__delay-100'
                            : 'opacity-0'
                    }`}
                >
                    <Carousel
                        effect="coverflow"
                        align="center"
                        slidesPerView={slidesPerView}
                        gap={16}
                        loop
                        autoplay
                        autoplayDelay={3000}
                        defaultIndex={0}
                        onIndexChange={setActive}
                        aria-label="Where Swift solar works"
                    >
                        <Carousel.Viewport>
                            <Carousel.Track>
                                {USE_CASES.map((item, i) => (
                                    <Carousel.Item key={item.label}>
                                        <PhoneCard item={item} active={i === active} />
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
