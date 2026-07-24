/**
 * Isometric SVG illustrations for the "Where solar works" coverflow.
 *
 * Every scene is built from a tiny isometric toolkit (a 2:1 dimetric
 * projection) so the nine cards share one lighting model and read as a
 * single 3D icon set — each an ordinary building carrying a blue rooftop
 * solar array, differentiated by silhouette, colour and one emblem.
 *
 * The geometry is generated as an SVG markup string per scene and injected
 * with `dangerouslySetInnerHTML`: it is purely decorative, static, and
 * computed once at module load, which keeps the drawing code compact and
 * avoids threading React keys through hundreds of generated polygons.
 */

export type SceneKey =
    | 'homes'
    | 'housing'
    | 'farms'
    | 'factories'
    | 'hospitals'
    | 'schools'
    | 'retail'
    | 'warehouses'
    | 'petrol';

/* ── Isometric vector toolkit (screen y is down) ───────────────── */

type P = [number, number];

const E = (n: number): P => [0.866 * n, -0.5 * n]; // east  → up-right
const N = (n: number): P => [-0.866 * n, -0.5 * n]; // north → up-left
const D = (n: number): P => [0, n]; // down (height)
const add = (...ps: P[]): P => ps.reduce<P>((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const mul = (p: P, k: number): P => [p[0] * k, p[1] * k];
const norm = (p: P): P => {
    const m = Math.hypot(p[0], p[1]) || 1;
    return [p[0] / m, p[1] / m];
};
const eU = E(1);
const nU = N(1);
const dU: P = [0, 1];
const fmt = (...ps: P[]) => ps.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const PANEL = '#1e3a8a';
const PANEL_EDGE = '#3b82f6';

function poly(pts: string, fill: string, stroke = 'none', sw = 1) {
    return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
}

// Parallelogram grid on any plane defined by unit vectors u, v.
function grid(
    o: P,
    u: P,
    v: P,
    uLen: number,
    vLen: number,
    cols: number,
    rows: number,
    fill: string,
    edge = 'none',
    gap = 0.6,
) {
    const su = uLen / cols;
    const sv = vLen / rows;
    let s = '';
    for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
            const c0 = add(o, mul(u, i * su), mul(v, j * sv), mul(u, gap), mul(v, gap));
            const c1 = add(c0, mul(u, su - 2 * gap));
            const c2 = add(c1, mul(v, sv - 2 * gap));
            const c3 = add(c0, mul(v, sv - 2 * gap));
            s += poly(fmt(c0, c1, c2, c3), fill, edge, 0.6);
        }
    return s;
}

// An isometric box. `f` is the top-front corner; walls extrude down by `h`.
function box(f: P, w: number, d: number, h: number, top: string, right: string, left: string) {
    const rC = add(f, E(w));
    const lC = add(f, N(d));
    const bC = add(rC, N(d));
    const fD = add(f, D(h));
    const rD = add(rC, D(h));
    const lD = add(lC, D(h));
    return (
        poly(fmt(f, lC, lD, fD), left, '#0f172a', 0.8) +
        poly(fmt(f, rC, rD, fD), right, '#0f172a', 0.8) +
        poly(fmt(f, rC, bC, lC), top, '#0f172a', 0.8)
    );
}

// Pitched gable roof on a box's top face; ridge runs along E.
function gable(f: P, w: number, d: number, hr: number, front: string, back: string, gEnd: string) {
    const rC = add(f, E(w));
    const lC = add(f, N(d));
    const bC = add(rC, N(d));
    const rs = add(f, N(d / 2), D(-hr)); // ridge start
    const re = add(rs, E(w)); // ridge end
    const svg =
        poly(fmt(lC, bC, re, rs), back, '#0f172a', 0.8) +
        poly(fmt(f, lC, rs), gEnd, '#0f172a', 0.8) +
        poly(fmt(rC, bC, re), gEnd, '#0f172a', 0.8) +
        poly(fmt(f, rC, re, rs), front, '#0f172a', 0.8);
    const slope = sub(f, rs);
    return { svg, rs, slopeU: eU, slopeV: norm(slope), slopeLen: Math.hypot(slope[0], slope[1]) };
}

const roof = (f: P, w: number, d: number, cols = 4, rows = 4, ins = 0.16) =>
    grid(add(f, E(w * ins), N(d * ins)), eU, nU, w * (1 - 2 * ins), d * (1 - 2 * ins), cols, rows, PANEL, PANEL_EDGE, 0.7);

const winR = (f: P, w: number, h: number, cols: number, rows: number, fill = '#bae6fd') =>
    grid(add(f, E(w * 0.16), D(h * 0.16)), eU, dU, w * 0.68, h * 0.6, cols, rows, fill, '#475569', 0.9);

const winL = (f: P, d: number, h: number, cols: number, rows: number, fill = '#bae6fd') =>
    grid(add(f, N(d * 0.16), D(h * 0.16)), nU, dU, d * 0.68, h * 0.6, cols, rows, fill, '#475569', 0.9);

const plateL = (f: P, d: number, h: number, ou: number, ov: number, du: number, dv: number, fill: string, stroke = 'none') =>
    grid(add(f, N(d * ou), D(h * ov)), nU, dU, d * du, h * dv, 1, 1, fill, stroke, 0);

// Ground-shadow geometry per scene [cx, cy, rx, ry]. Drawn (and animated)
// outside the floating group so it stays pinned while the building levitates.
const SHADOW: Record<SceneKey, [number, number, number, number]> = {
    homes: [150, 250, 92, 25],
    housing: [155, 250, 118, 26],
    farms: [150, 250, 110, 26],
    factories: [155, 250, 122, 26],
    hospitals: [152, 250, 100, 26],
    schools: [152, 250, 104, 26],
    retail: [152, 250, 104, 26],
    warehouses: [152, 250, 130, 26],
    petrol: [152, 250, 112, 26],
};

/* ── Scenes ────────────────────────────────────────────────────── */

type Scene = { from: string; to: string; body: () => string };

const SCENES: Record<SceneKey, Scene> = {
    homes: {
        from: '#dbeeff',
        to: '#eef7ff',
        body: () => {
            const f: P = [160, 190];
            const w = 80;
            const d = 80;
            const h = 60;
            const hr = 40;
            const G = gable(f, w, d, hr, '#f2b8a0', '#d98b6f', '#e6a086');
            const po = add(G.rs, mul(G.slopeU, w * 0.14), mul(G.slopeV, G.slopeLen * 0.16));
            const panels = grid(po, G.slopeU, G.slopeV, w * 0.72, G.slopeLen * 0.62, 4, 3, PANEL, PANEL_EDGE, 0.7);
            return (
                box(f, w, d, h, '#fef7ec', '#f4d7a6', '#e9bf84') +
                `<g class="uc-twinkle">${winR(f, w, h, 2, 1, '#fde047')}</g>` +
                plateL(f, d, h, 0.36, 0.28, 0.28, 0.62, '#8a5a2b') +
                G.svg +
                panels
            );
        },
    },
    housing: {
        from: '#dbeafe',
        to: '#eff6ff',
        body: () => {
            let g = '';
            const towers: { f: P; w: number; d: number; h: number }[] = [
                { f: [160, 100], w: 58, d: 58, h: 150 },
                { f: [110, 132], w: 54, d: 54, h: 118 },
                { f: [205, 172], w: 54, d: 54, h: 78 },
            ];
            for (const t of towers) {
                g += box(t.f, t.w, t.d, t.h, '#eef2f7', '#c3ccd8', '#a9b4c3');
                g += roof(t.f, t.w, t.d, 3, 3);
                g += winR(t.f, t.w, t.h, 2, 5);
                g += winL(t.f, t.d, t.h, 2, 5);
            }
            return g;
        },
    },
    farms: {
        from: '#d9f2ff',
        to: '#eafbea',
        body: () => {
            const f: P = [132, 188];
            const w = 86;
            const d = 74;
            const h = 62;
            const hr = 30;
            let g = '';
            const sc: P = [246, 176];
            const sr = 15;
            const scTop = add(sc, E(sr), N(sr));
            g += box(sc, sr * 2, sr * 2, 74, '#e7ecf2', '#c6cfdb', '#aeb9c8');
            g += `<ellipse cx="${scTop[0].toFixed(1)}" cy="${scTop[1].toFixed(1)}" rx="${(0.866 * sr * 2).toFixed(1)}" ry="${(0.5 * sr * 2).toFixed(1)}" fill="#d5dde7" stroke="#94a3b8" stroke-width="0.8"/>`;
            const G = gable(f, w, d, hr, '#e5544f', '#b83b37', '#cf4642');
            const po = add(G.rs, mul(G.slopeU, w * 0.12), mul(G.slopeV, G.slopeLen * 0.16));
            const panels = grid(po, G.slopeU, G.slopeV, w * 0.76, G.slopeLen * 0.6, 5, 3, PANEL, PANEL_EDGE, 0.7);
            g += box(f, w, d, h, '#f26d6d', '#c93f3f', '#ad3232');
            g += plateL(f, d, h, 0.34, 0.24, 0.32, 0.66, '#fbe9e9', '#ad3232');
            g += G.svg + panels;
            return g;
        },
    },
    factories: {
        from: '#e6ebf1',
        to: '#f3f6fa',
        body: () => {
            const f: P = [150, 192];
            const w = 118;
            const d = 76;
            const h = 58;
            let g = '';
            g += box([214, 120], 15, 15, 96, '#c3ccd8', '#9aa6b6', '#8592a6');
            g += box([236, 136], 13, 13, 80, '#c3ccd8', '#9aa6b6', '#8592a6');
            g += `<g class="uc-smoke" fill="#ffffff" opacity="0.9"><circle cx="218" cy="106" r="11" style="animation-delay:0s"/><circle cx="232" cy="96" r="8" style="animation-delay:1.1s"/><circle cx="247" cy="102" r="7" style="animation-delay:2.1s"/></g>`;
            g += box(f, w, d, h, '#d7dee7', '#aeb9c7', '#97a3b4');
            g += roof(f, w, d, 7, 3);
            g += winR(f, w, h, 5, 1);
            return g;
        },
    },
    hospitals: {
        from: '#e0f2fe',
        to: '#f0f9ff',
        body: () => {
            const f: P = [160, 154];
            const w = 88;
            const d = 82;
            const h = 96;
            let g = '';
            g += box(f, w, d, h, '#ffffff', '#e2ebf3', '#cdd9e6');
            g += roof(f, w, d, 5, 4);
            g += winR(f, w, h, 3, 3);
            g += winL(f, d, h, 3, 3);
            g += grid(add(f, E(w * 0.5), D(h * 0.22)), eU, dU, w * 0.11, h * 0.28, 1, 1, '#ef4444');
            g += grid(add(f, E(w * 0.38), D(h * 0.31)), eU, dU, w * 0.33, h * 0.09, 1, 1, '#ef4444');
            return g;
        },
    },
    schools: {
        from: '#ece9fe',
        to: '#f5f3ff',
        body: () => {
            const f: P = [160, 172];
            const w = 92;
            const d = 82;
            const h = 78;
            let g = '';
            g += box(f, w, d, h, '#fdf5e3', '#e9d29a', '#d9bd7a');
            g += roof(f, w, d, 5, 4);
            g += `<g class="uc-twinkle">${winR(f, w, h, 3, 2, '#fde047')}</g>`;
            g += winL(f, d, h, 3, 2);
            const tf = add(f, E(w * 0.5), N(d * 0.5), E(-11), N(-11));
            g += box(tf, 22, 22, 40, '#fffbeb', '#e6cf94', '#d3b877');
            const rc = add(tf, E(11), N(11));
            const apex = add(rc, D(-22));
            g += poly(fmt(tf, add(tf, E(22)), apex), '#9a6a34');
            g += poly(fmt(add(tf, E(22)), add(tf, E(22), N(22)), apex), '#83571f');
            g += `<line x1="${rc[0].toFixed(1)}" y1="${(rc[1] - 24).toFixed(1)}" x2="${rc[0].toFixed(1)}" y2="${(rc[1] - 44).toFixed(1)}" stroke="#78350f" stroke-width="2"/>`;
            g += `<g class="uc-flag">${poly(fmt([rc[0], rc[1] - 44], [rc[0] + 18, rc[1] - 40], [rc[0], rc[1] - 34]), '#ef4444')}</g>`;
            return g;
        },
    },
    retail: {
        from: '#cffafe',
        to: '#ecfeff',
        body: () => {
            const f: P = [160, 178];
            const w = 92;
            const d = 80;
            const h = 72;
            let g = '';
            g += box(f, w, d, h, '#f7fbff', '#cfe0ec', '#b7cddd');
            g += roof(f, w, d, 6, 3);
            g += grid(add(f, E(w * 0.12), D(h * 0.12)), eU, dU, w * 0.76, h * 0.14, 1, 1, '#06b6d4');
            for (let i = 0; i < 5; i++) {
                const o = add(f, E(w * 0.1 + i * w * 0.16), D(h * 0.34));
                g += grid(o, eU, dU, w * 0.16, h * 0.12, 1, 1, i % 2 ? '#ef4444' : '#ffffff', '#e11d48');
            }
            g += grid(add(f, E(w * 0.14), D(h * 0.55)), eU, dU, w * 0.72, h * 0.32, 1, 1, '#bae6fd', '#475569');
            return g;
        },
    },
    warehouses: {
        from: '#fef3c7',
        to: '#fffbeb',
        body: () => {
            const f: P = [168, 198];
            const w = 130;
            const d = 96;
            const h = 52;
            let g = '';
            g += box(f, w, d, h, '#eef1f5', '#c7cfda', '#aeb8c6');
            g += roof(f, w, d, 8, 5);
            for (let i = 0; i < 3; i++) {
                const o = add(f, E(w * 0.12 + i * w * 0.28), D(h * 0.28));
                g += grid(o, eU, dU, w * 0.2, h * 0.64, 1, 4, '#8fa0b5', '#5b6b80', 0.5);
            }
            return g;
        },
    },
    petrol: {
        from: '#d1fae5',
        to: '#ecfdf5',
        body: () => {
            const GROUND = 250;
            let g = '';
            const cf: P = [168, 96];
            const cw = 100;
            const cd = 76;
            const ch = 12;
            const pw = 9;
            const rightTop = add(cf, E(cw - pw), D(ch));
            const leftTop = add(cf, N(cd - pw), D(ch));
            g += box(rightTop, pw, pw, GROUND - rightTop[1], '#c3ccd8', '#9aa6b6', '#8592a6');
            g += box(leftTop, pw, pw, GROUND - leftTop[1], '#c3ccd8', '#9aa6b6', '#8592a6');
            g += box([150, GROUND - 40], 22, 20, 40, '#ef5a5a', '#c93f3f', '#ad3232');
            g += `<rect x="156" y="${GROUND - 32}" width="15" height="11" rx="1.5" fill="#0f172a"/>`;
            g += box(cf, cw, cd, ch, '#10b981', '#0e9f74', '#0b8763');
            g += roof(cf, cw, cd, 6, 4);
            return g;
        },
    },
};

// Precompute each scene's inner markup once, and fix a stable scene order
// so each card gets a staggered float delay (they don't all bob in unison).
const ORDER = Object.keys(SCENES) as SceneKey[];
const BODY = Object.fromEntries(ORDER.map((k) => [k, SCENES[k].body()])) as Record<SceneKey, string>;

// Eight sun rays evenly around the sun; the group slowly rotates.
const SUN: P = [262, 58];
const RAYS = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x1: SUN[0] + 26 * c, y1: SUN[1] + 26 * s, x2: SUN[0] + 36 * c, y2: SUN[1] + 36 * s };
});

/* ── Public component ──────────────────────────────────────────── */

export function UseCaseArt({ scene }: { scene: SceneKey }) {
    const s = SCENES[scene];
    const [sx, sy, srx, sry] = SHADOW[scene];
    const floatDelay = `${(ORDER.indexOf(scene) % 5) * 0.6}s`;
    return (
        <svg
            viewBox="0 0 320 320"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.from} />
                    <stop offset="100%" stopColor={s.to} />
                </linearGradient>
                <radialGradient id={`sun-${scene}`}>
                    <stop offset="0%" stopColor="#fff6d5" />
                    <stop offset="55%" stopColor="#fde68a" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#fde68a" stopOpacity={0} />
                </radialGradient>
                <filter id={`blur-${scene}`} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="4" />
                </filter>
            </defs>

            <rect width="320" height="320" fill={`url(#sky-${scene})`} />

            {/* Sun — pulsing glow, rotating rays, solid core */}
            <circle className="uc-glow" cx={SUN[0]} cy={SUN[1]} r={48} fill={`url(#sun-${scene})`} />
            <g className="uc-rays" stroke="#fcd34d" strokeWidth={3} strokeLinecap="round" opacity={0.75}>
                {RAYS.map((r, i) => (
                    <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
                ))}
            </g>
            <circle cx={SUN[0]} cy={SUN[1]} r={20} fill="#fcd34d" />

            {/* Grounded shadow (breathes with the float) */}
            <ellipse className="uc-shadow" cx={sx} cy={sy} rx={srx} ry={sry} fill="#064e3b" opacity={0.16} filter={`url(#blur-${scene})`} />

            {/* Building — gently levitates */}
            <g className="uc-float" style={{ animationDelay: floatDelay }} dangerouslySetInnerHTML={{ __html: BODY[scene] }} />
        </svg>
    );
}
