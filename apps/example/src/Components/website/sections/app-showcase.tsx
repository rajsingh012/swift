import { type ReactNode } from 'react';
import { Badge } from '@swift/components/Badge';
import { Text } from '@swift/components/Text';
import { Flash } from '@swift/icons/Flash';
import { Eye } from '@swift/icons/Eye';
import { GroupFilled } from '@swift/icons/GroupFilled';
import { CheckShieldFilled } from '@swift/icons/CheckShieldFilled';
import { useScrollProgress } from '../../../hooks/useScrollProgress';

/* ── App feature steps ─────────────────────────────────────────────
   Each step maps to one phone screen. As the section is pinned, scroll
   progress advances the active step, the screen crossfades, the
   ambient glow morphs to the step's accent, and contextual glass
   cards float in around the phone. */

type IconProps = { size?: number; className?: string };

type FloatCard = {
    /** Tailwind positioning classes relative to the phone wrapper. */
    pos: string;
    /** Float animation flavour. */
    drift: 'card-float-a' | 'card-float-b';
    node: ReactNode;
};

type Step = {
    key: string;
    label: string;
    title: string;
    desc: string;
    Icon: (props: IconProps) => ReactNode;
    accent: string;
    Screen: () => ReactNode;
    cards: FloatCard[];
};

/* ── Little glass card used for the floating callouts ───────────── */

function GlassCard({
    icon,
    label,
    value,
    accent,
}: {
    icon?: ReactNode;
    label: string;
    value: string;
    accent: string;
}) {
    return (
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2.5 shadow-level3 backdrop-blur-md">
            {icon && (
                <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${accent}33`, color: accent }}
                >
                    {icon}
                </span>
            )}
            <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-medium uppercase tracking-wide text-white/60">
                    {label}
                </span>
                <span className="text-sm font-bold text-white">{value}</span>
            </div>
        </div>
    );
}

/* ── Individual phone screens (token-driven, no images) ─────────── */

function GenerationScreen() {
    return (
        <div className="flex h-full flex-col gap-3.5 p-5 pt-10">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Generated today
                </span>
                <span className="text-[11px] font-medium text-white/50">
                    32°C · 8 hrs light
                </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-0.5 pt-1">
                <span className="value-glow text-5xl font-bold leading-none text-white tabular-nums">
                    14.2
                </span>
                <span className="text-sm font-medium text-white/70">
                    Units generated
                </span>
                <span className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    Online · updated 12:29 PM
                </span>
            </div>

            {/* Live production bars */}
            <div className="mt-1 flex items-end justify-between gap-1.5 px-1">
                {[38, 55, 42, 70, 88, 64, 96, 78, 52, 84, 60, 44].map((h, i) => (
                    <span
                        key={i}
                        className="bar-breathe flex-1 rounded-full bg-linear-to-t from-amber-500 to-amber-300"
                        style={{
                            height: `${h}%`,
                            minHeight: 6,
                            animationDelay: `${i * 90}ms`,
                        }}
                    />
                ))}
            </div>

            <div className="mt-auto flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wide text-white/50">
                        Lifetime
                    </span>
                    <span className="text-sm font-bold text-white tabular-nums">
                        14,093 Units
                    </span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase tracking-wide text-white/50">
                        Saved
                    </span>
                    <span className="text-sm font-bold text-emerald-300 tabular-nums">
                        ₹1,40,930
                    </span>
                </div>
            </div>
        </div>
    );
}

function SavingsScreen() {
    const bars = [42, 58, 51, 73, 66, 88];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return (
        <div className="flex h-full flex-col gap-4 p-5 pt-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Lifetime savings
            </span>
            <div className="flex flex-col">
                <span className="value-glow text-4xl font-bold leading-none text-white tabular-nums">
                    ₹1,40,930
                </span>
                <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                    ▲ 18% vs last month
                </span>
            </div>

            {/* Monthly savings chart */}
            <div className="mt-auto flex items-end justify-between gap-2">
                {bars.map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                        <div className="flex h-24 w-full items-end">
                            <span
                                className="chart-grow w-full rounded-md bg-linear-to-t from-sky-500 to-sky-300"
                                style={{
                                    height: `${h}%`,
                                    animationDelay: `${i * 180}ms`,
                                }}
                            />
                        </div>
                        <span className="text-[10px] text-white/50">{months[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReferralScreen() {
    const friends = [
        { name: 'Aarav S.', status: 'Installed', reward: '₹5,000', done: true },
        { name: 'Priya M.', status: 'Site survey', reward: '₹5,000', done: false },
        { name: 'Rohan K.', status: 'Invited', reward: '₹5,000', done: false },
    ];
    return (
        <div className="flex h-full flex-col gap-4 p-5 pt-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Refer &amp; earn
            </span>
            <div className="flex flex-col">
                <span className="value-glow text-5xl font-bold leading-none text-white tabular-nums">
                    ₹15,000
                </span>
                <span className="mt-1.5 text-[11px] font-medium text-white/60">
                    Earned from 3 referrals
                </span>
            </div>

            <div className="mt-1 flex flex-col gap-2.5">
                {friends.map((f, i) => (
                    <div
                        key={f.name}
                        className="row-shimmer flex items-center justify-between rounded-2xl bg-white/8 px-3.5 py-2.5"
                        style={{ animationDelay: `${i * 600}ms` }}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-white">
                                {f.name}
                            </span>
                            <span className="text-[11px] text-white/50">
                                {f.status}
                            </span>
                        </div>
                        <span
                            className={`text-sm font-bold tabular-nums ${
                                f.done ? 'text-emerald-300' : 'text-white/40'
                            }`}
                        >
                            {f.reward}
                        </span>
                    </div>
                ))}
            </div>

            <p className="mt-auto text-center text-[11px] text-white/50">
                Earn ₹5,000 for every friend who goes solar
            </p>
        </div>
    );
}

function TransparencyScreen() {
    const rows = [
        { month: 'April', promised: 420, actual: 438 },
        { month: 'May', promised: 465, actual: 471 },
        { month: 'June', promised: 480, actual: 502 },
    ];
    const max = 560;
    return (
        <div className="flex h-full flex-col gap-4 p-5 pt-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Promised vs actual
            </span>

            <div className="row-shimmer flex items-center gap-2 overflow-hidden rounded-2xl bg-emerald-500/15 px-3.5 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/25 text-emerald-300">
                    <CheckShieldFilled size={18} />
                </span>
                <div className="flex flex-col leading-tight">
                    <span className="text-[11px] text-white/60">
                        Delivering 100% of our
                    </span>
                    <span className="text-sm font-bold text-white">
                        generation commitment
                    </span>
                </div>
            </div>

            <div className="mt-1 flex flex-col gap-3.5">
                {rows.map((r, i) => (
                    <div key={r.month} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-white/60">{r.month}</span>
                            <span className="font-semibold text-emerald-300 tabular-nums">
                                {r.actual} / {r.promised} units
                            </span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                            {/* Promised marker */}
                            <span
                                className="absolute top-0 z-10 h-full w-px bg-white/40"
                                style={{ left: `${(r.promised / max) * 100}%` }}
                            />
                            {/* Actual fill */}
                            <span
                                className="relative block h-full overflow-hidden rounded-full bg-linear-to-r from-emerald-500 to-emerald-300"
                                style={{ width: `${(r.actual / max) * 100}%` }}
                            >
                                {/* Travelling shine */}
                                <span
                                    className="bar-shine absolute inset-y-0 w-8 bg-linear-to-r from-transparent via-white/60 to-transparent"
                                    style={{ animationDelay: `${i * 500}ms` }}
                                />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-auto text-center text-[11px] text-white/50">
                Full transparency, every single month
            </p>
        </div>
    );
}

const STEPS: Step[] = [
    {
        key: 'generation',
        label: 'Power generation',
        title: 'Track your power generation',
        desc: 'Watch your panels generate power in real time, right from your pocket — down to the exact unit.',
        Icon: Flash,
        accent: '#f59e0b',
        Screen: GenerationScreen,
        cards: [
            {
                pos: '-left-10 top-10 sm:-left-28',
                drift: 'card-float-a',
                node: (
                    <GlassCard
                        icon={<Flash size={16} />}
                        label="Peak today"
                        value="4.2 kW"
                        accent="#f59e0b"
                    />
                ),
            },
            {
                pos: '-right-8 bottom-24 sm:-right-24',
                drift: 'card-float-b',
                node: (
                    <GlassCard
                        label="Grid export"
                        value="+1.9 kW"
                        accent="#f59e0b"
                    />
                ),
            },
        ],
    },
    {
        key: 'savings',
        label: 'Savings visibility',
        title: 'Get 100% visibility on your savings',
        desc: 'Month-on-month savings, bill offset and lifetime returns — all in one clean, always-live dashboard.',
        Icon: Eye,
        accent: '#0ea5e9',
        Screen: SavingsScreen,
        cards: [
            {
                pos: '-right-10 top-14 sm:-right-28',
                drift: 'card-float-a',
                node: (
                    <GlassCard
                        icon={<Eye size={16} />}
                        label="This month"
                        value="₹3,240"
                        accent="#0ea5e9"
                    />
                ),
            },
            {
                pos: '-left-8 bottom-20 sm:-left-24',
                drift: 'card-float-b',
                node: (
                    <GlassCard
                        label="Bill offset"
                        value="92%"
                        accent="#0ea5e9"
                    />
                ),
            },
        ],
    },
    {
        key: 'referrals',
        label: 'Referrals & rewards',
        title: 'Track your referrals & rewards on the go',
        desc: 'Invite friends to go solar and follow every reward — from invite sent to ₹5,000 credited.',
        Icon: GroupFilled,
        accent: '#8b5cf6',
        Screen: ReferralScreen,
        cards: [
            {
                pos: '-left-10 top-16 sm:-left-28',
                drift: 'card-float-a',
                node: (
                    <GlassCard
                        icon={<GroupFilled size={16} />}
                        label="Earned"
                        value="₹15,000"
                        accent="#8b5cf6"
                    />
                ),
            },
            {
                pos: '-right-8 bottom-24 sm:-right-24',
                drift: 'card-float-b',
                node: (
                    <GlassCard
                        label="Per install"
                        value="₹5,000"
                        accent="#8b5cf6"
                    />
                ),
            },
        ],
    },
    {
        key: 'transparency',
        label: 'Full transparency',
        title: 'Full transparency on promised vs. actual',
        desc: 'See exactly what we committed against what your system delivered — verified, every month.',
        Icon: CheckShieldFilled,
        accent: '#10b981',
        Screen: TransparencyScreen,
        cards: [
            {
                pos: '-right-10 top-12 sm:-right-28',
                drift: 'card-float-a',
                node: (
                    <GlassCard
                        icon={<CheckShieldFilled size={16} />}
                        label="Delivering"
                        value="100%"
                        accent="#10b981"
                    />
                ),
            },
            {
                pos: '-left-8 bottom-24 sm:-left-24',
                drift: 'card-float-b',
                node: (
                    <GlassCard
                        label="This month"
                        value="+4% vs promise"
                        accent="#10b981"
                    />
                ),
            },
        ],
    },
];

/* ── Store badges ──────────────────────────────────────────────── */

function StoreBadge({
    kicker,
    store,
    glyph,
}: {
    kicker: string;
    store: string;
    glyph: ReactNode;
}) {
    return (
        <a
            href="#"
            className="flex items-center gap-2.5 rounded-full bg-content px-4 py-2.5 text-surface transition-transform duration-200 hover:-translate-y-0.5"
        >
            <span className="shrink-0">{glyph}</span>
            <span className="flex flex-col leading-tight">
                <span className="text-[10px] opacity-80">{kicker}</span>
                <span className="text-sm font-semibold">{store}</span>
            </span>
        </a>
    );
}

/* ── Phone + floating callouts ─────────────────────────────────── */

function PhoneStage({ active }: { active: number }) {
    const accent = STEPS[active].accent;

    return (
        <div className="relative flex items-center justify-center">
            {/* Accent glow that morphs per step */}
            <div
                aria-hidden="true"
                className="blob-float pointer-events-none absolute h-80 w-80 rounded-full blur-3xl transition-colors duration-700"
                style={{ backgroundColor: `${accent}40` }}
            />

            {/* Floating glass callouts (per step) */}
            {STEPS.map((step, i) =>
                step.cards.map((card, j) => (
                    <div
                        key={`${step.key}-${j}`}
                        className={`${card.drift} absolute z-20 hidden transition-all duration-500 sm:block ${card.pos}`}
                        style={{
                            opacity: i === active ? 1 : 0,
                            transform: `scale(${i === active ? 1 : 0.9})`,
                            pointerEvents: i === active ? 'auto' : 'none',
                        }}
                        aria-hidden={i !== active}
                    >
                        {card.node}
                    </div>
                )),
            )}

            {/* Phone */}
            <div className="phone-float relative">
                <div className="relative aspect-[9/19] w-60 rounded-[2.75rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-level3 sm:w-64">
                    {/* Notch */}
                    <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-neutral-900" />

                    {/* Screen */}
                    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-linear-to-b from-slate-900 to-slate-800">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.key}
                                className="absolute inset-0 transition-all duration-500 ease-out"
                                style={{
                                    opacity: i === active ? 1 : 0,
                                    transform:
                                        i === active
                                            ? 'translateX(0) scale(1)'
                                            : `translateX(${i < active ? -24 : 24}px) scale(0.97)`,
                                    pointerEvents: i === active ? 'auto' : 'none',
                                }}
                                aria-hidden={i !== active}
                            >
                                <step.Screen />
                            </div>
                        ))}

                        {/* Sweeping glare */}
                        <div
                            aria-hidden="true"
                            className="screen-glare pointer-events-none absolute -top-10 left-0 z-20 h-[140%] w-16 bg-linear-to-r from-transparent via-white/25 to-transparent"
                        />
                    </div>
                </div>

                {/* Reflection */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-8 left-1/2 h-10 w-40 -translate-x-1/2 rounded-[50%] bg-black/40 blur-xl"
                />
            </div>
        </div>
    );
}

/* ── Section ───────────────────────────────────────────────────── */

function AppShowcaseSection() {
    const [ref, progress] = useScrollProgress<HTMLDivElement>();

    // Spread the active step across a comfortable window of the section's
    // scroll travel, leaving lead-in and exit room while it's pinned.
    const start = 0.05;
    const end = 0.85;
    const fill = Math.min(Math.max((progress - start) / (end - start), 0), 1);
    const active = Math.min(Math.floor(fill * STEPS.length), STEPS.length - 1);
    const accent = STEPS[active].accent;

    return (
        <section
            id="app"
            ref={ref}
            className="section-seam relative bg-surface text-content"
            style={{ height: `${STEPS.length * 100}vh` }}
        >
            {/* Pinned viewport */}
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                {/* Backdrop: soft grid + giant ghost step number */}
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
                    style={{ color: `${accent}12` }}
                >
                    {active + 1}
                </span>

                <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
                    {/* Copy + step rail */}
                    <div className="flex flex-col gap-6">
                        <Badge
                            pill
                            variant="info"
                            appearance="soft"
                            className="w-fit uppercase tracking-wider"
                        >
                            Real-time monitoring app
                        </Badge>
                        <Text variant="heading-lg" fontWeight="bold">
                            Track your solar system, in real time
                        </Text>
                        <Text variant="para-md" className="text-content-muted">
                            Track the performance of your solar system — anywhere,
                            anytime. Scroll to take the tour.
                        </Text>

                        <div className="mt-2 flex gap-4">
                            {/* Vertical tour progress bar */}
                            <div className="relative hidden w-1 shrink-0 rounded-full bg-stroke sm:block">
                                <span
                                    className="absolute left-0 top-0 w-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        height: `${((active + 1) / STEPS.length) * 100}%`,
                                        backgroundColor: accent,
                                    }}
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-3">
                                {STEPS.map((step, i) => {
                                    const on = i === active;
                                    return (
                                        <div
                                            key={step.key}
                                            className="flex gap-3.5 transition-opacity duration-300"
                                            style={{ opacity: on ? 1 : 0.4 }}
                                        >
                                            <span
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: on
                                                        ? `${step.accent}26`
                                                        : 'transparent',
                                                    color: step.accent,
                                                    transform: on
                                                        ? 'scale(1.1)'
                                                        : 'scale(1)',
                                                }}
                                            >
                                                <step.Icon size={18} />
                                            </span>

                                            <div className="flex flex-col gap-0.5 pb-2">
                                                <Text
                                                    variant="body-md"
                                                    fontWeight="semibold"
                                                >
                                                    {step.title}
                                                </Text>
                                                <div
                                                    className="grid transition-all duration-300"
                                                    style={{
                                                        gridTemplateRows: on
                                                            ? '1fr'
                                                            : '0fr',
                                                    }}
                                                >
                                                    <div className="overflow-hidden">
                                                        <Text
                                                            variant="body-sm"
                                                            className='text-content-muted'
                                                        >
                                                            {step.desc}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Store badges */}
                        <div className="mt-2 flex flex-wrap gap-3">
                            <StoreBadge
                                kicker="GET IT ON"
                                store="Google Play"
                                glyph={
                                    <svg
                                        width="18"
                                        height="20"
                                        viewBox="0 0 512 512"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M47 24 305 256 47 488a24 24 0 0 1-13-22V46a24 24 0 0 1 13-22Zm288 200 71-40-89-49-70 63 88 88 91-50-91-50Zm-2 64L91 494l254-145-12-61Zm0-128 12-61L91 18l242 142Z"
                                        />
                                    </svg>
                                }
                            />
                            <StoreBadge
                                kicker="Download on the"
                                store="App Store"
                                glyph={
                                    <svg
                                        width="18"
                                        height="20"
                                        viewBox="0 0 384 512"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M318 268c-1-49 40-72 42-73-23-33-58-38-70-38-30-3-58 17-73 17s-38-17-63-17c-32 1-62 19-79 48-34 59-9 145 24 193 16 23 35 49 60 48 24-1 33-15 62-15s37 15 63 15 42-24 58-47c18-27 26-53 26-54-1-1-50-19-50-77zM271 78c13-16 22-38 20-60-19 1-43 13-56 29-12 14-23 36-20 57 21 2 42-11 56-26z"
                                        />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {/* Phone stage */}
                    <div className="order-first flex justify-center lg:order-none">
                        <PhoneStage active={active} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AppShowcaseSection;
