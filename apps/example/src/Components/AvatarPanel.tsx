import { useState } from 'react'
import {
  Avatar,
  AvatarGroup,
  type AvatarShape,
  type AvatarSize,
  type AvatarStatus,
} from '@swift/components/Avatar'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { Bookmark } from '@swift/icons/Bookmark'
import { CheckCircleFilled } from '@swift/icons/CheckCircleFilled'
import { CopyableImport } from '../lib/CopyableImport'
import { BrowserCompat, CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Compound profile / team avatar. Auto-renders an image (with onLoad/onError lifecycle), falls back to initials derived from `name` (then a Person silhouette), tinted by a deterministic colour-palette hash so the same name always gets the same surface. Five sizes (xs / sm / md / lg / xl), three shapes (circle / rounded / square), positioned status badges, custom badge content, loading shimmer, and an AvatarGroup with max + overflow + overlap. SSR-safe: initials + colour selection are pure functions of `name` — same input maps to the same output on the server and client, no hydration mismatches.'

const SIZES: ReadonlyArray<AvatarSize> = ['xs', 'sm', 'md', 'lg', 'xl']

const SHAPES: ReadonlyArray<AvatarShape> = ['circle', 'rounded', 'square']

const STATUSES: ReadonlyArray<AvatarStatus> = [
  'online',
  'busy',
  'away',
  'offline',
]

const SAMPLE_PEOPLE = [
  { name: 'Raj Singh', src: 'https://i.pravatar.cc/120?img=11' },
  { name: 'Jane Doe', src: 'https://i.pravatar.cc/120?img=23' },
  { name: 'Aman Mehta', src: 'https://i.pravatar.cc/120?img=33' },
  { name: 'Priya Sharma', src: 'https://i.pravatar.cc/120?img=44' },
  { name: 'Lee Park', src: 'https://i.pravatar.cc/120?img=55' },
  { name: 'Sara Khan', src: 'https://i.pravatar.cc/120?img=66' },
  { name: 'Tom Riley' },
  { name: 'Mira Patel' },
] as const

const PALETTE_DEMO_NAMES = [
  'Aanya',
  'Bobby',
  'Charlie',
  'Deepa',
  'Esha',
  'Fahad',
  'Gita',
  'Harshad',
  'Iris',
  'Jhanvi',
  'Kabir',
  'Lila',
] as const

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const AVATAR_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'src',
    type: 'string',
    description:
      'Image URL. Convenience for `<Avatar.Image src>` as a child — when set without children, the root auto-composes `<Image> + <Fallback>` for the common case.',
  },
  {
    name: 'alt',
    type: 'string',
    description:
      'Alt text for the auto-rendered image. Defaults to `name` when not provided. Set explicitly when the avatar is informative but the name isn\'t the right label (e.g. brand logo).',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Display name. Drives the auto-initials fallback (first letter of first + last token, uppercased) and the deterministic colour-palette index. Pure function of the input — same name always picks the same palette slot on the server and client.',
  },
  {
    name: 'size',
    type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`,
    defaultValue: `'md'`,
    description:
      'Pixel size: 24 / 32 / 40 / 48 / 64. Wider than the form-control 3-step scale because avatars genuinely need it. Inside an `<AvatarGroup>`, the group size becomes the default; per-avatar `size` still wins.',
  },
  {
    name: 'shape',
    type: `'circle' | 'rounded' | 'square'`,
    defaultValue: `'circle'`,
    description:
      '`rounded` uses `--avatar-radius` (default 0.5rem). `square` is sharp corners — useful inside table cells where circles waste horizontal space.',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Renders a shimmering skeleton placeholder (overrides image + fallback + children). Useful while user data is in flight. Honours `prefers-reduced-motion`.',
  },
  {
    name: 'fallbackDelay',
    type: 'number',
    defaultValue: '600',
    description:
      'Milliseconds to wait before showing the fallback while an image is loading. Prevents flash of fallback on fast networks. Renders the fallback immediately on `error` regardless. Per-`<Avatar.Fallback delay>` prop overrides.',
  },
  {
    name: 'decorative',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Mark the avatar as decorative. Sets `aria-hidden="true"` and clears the img\'s `alt`. Use when the avatar is redundant with an adjacent label.',
  },
  {
    name: 'classes',
    type: '{ root? }',
    description: 'Slot-level className overrides (currently just the root).',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Compound parts: `<Avatar.Image>`, `<Avatar.Fallback>`, `<Avatar.Badge>`. Image / Fallback in children skip the matching auto-render; Badge always renders alongside whatever else is there.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLSpanElement>',
    description: 'Forwarded to the root <span>. Tooltip-compatible.',
  },
]

const GROUP_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'max',
    type: 'number',
    description:
      'Maximum visible avatars. Children beyond this cap collapse into a `+N` overflow tile rendered after the visible set.',
  },
  {
    name: 'renderOverflow',
    type: '(count: number) => ReactNode',
    description:
      'Custom overflow renderer. Receives the hidden-child count; default renders `+${count}` as text inside an Avatar.Fallback.',
  },
  {
    name: 'overlap',
    type: `'small' | 'medium' | 'large'`,
    defaultValue: `'medium'`,
    description:
      'Negative `margin-inline-start` between adjacent avatars: -4 / -8 / -12 px respectively. Logical inset so RTL flips for free.',
  },
  {
    name: 'size',
    type: 'AvatarSize',
    description:
      'Cascades to every nested avatar via context. Per-avatar `size` still wins.',
  },
  {
    name: 'shape',
    type: 'AvatarShape',
    description:
      'Cascades to every nested avatar via context. Per-avatar `shape` still wins.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Avatars to render. Non-element children are skipped.',
  },
]

type PartBlock = {
  name: string
  summary: string
}

const AVATAR_COMPOUND_PARTS: ReadonlyArray<PartBlock> = [
  {
    name: 'Avatar.Image',
    summary:
      'Native `<img>` with `onLoad` + `onError` that publish the loading lifecycle (idle / loading / loaded / error) to the surrounding Avatar via context. The Fallback subscribes to decide when to render. Handles the cached-image case where the load event fires before React attaches.',
  },
  {
    name: 'Avatar.Fallback',
    summary:
      'Renders when the image isn\'t loaded. Priority: explicit `children` > auto-initials from `name` > `Person` silhouette. Honours `fallbackDelay` from context (or per-fallback `delay` prop) — won\'t flash during fast image loads.',
  },
  {
    name: 'Avatar.Badge',
    summary:
      'Corner indicator. Two flavours: pass `status` for a small coloured dot (online / busy / away / offline), or pass `children` for custom content (notification count, verification check, role icon). Position via `position` (default `bottom-end`); logical insets flip under RTL.',
  },
]

export function AvatarPanel() {
  const [skeletonLoading, setSkeletonLoading] = useState(true)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Avatar
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Basic ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Basic</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          The convenience props (<code>src</code> + <code>name</code>) cover
          the 90% case. Without compound children, the root auto-composes
          `&lt;Image&gt;` + `&lt;Fallback&gt;` for you.
        </Text>
        <PreviewRow
          code={`<Avatar src="https://i.pravatar.cc/120?img=11" name="Raj Singh" />
<Avatar name="Jane Doe" />              {/* initials fallback */}
<Avatar />                              {/* Person silhouette */}`}
        >
          <Avatar src="https://i.pravatar.cc/120?img=11" name="Raj Singh" />
          <Avatar name="Jane Doe" />
          <Avatar />
        </PreviewRow>
      </section>

      {/* ── Sizes ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Sizes</SectionHeader>
        <PreviewRow
          code={`<Avatar size="xs" name="Raj Singh" />  {/* 24 */}
<Avatar size="sm" name="Raj Singh" />  {/* 32 */}
<Avatar size="md" name="Raj Singh" />  {/* 40 — default */}
<Avatar size="lg" name="Raj Singh" />  {/* 48 */}
<Avatar size="xl" name="Raj Singh" />  {/* 64 */}`}
        >
          <div className="flex w-full items-end gap-4">
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-1">
                <Avatar size={size} name="Raj Singh" />
                <Text variant="body-xs" color="muted">
                  {size}
                </Text>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Shapes ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Shapes</SectionHeader>
        <PreviewRow
          code={`<Avatar shape="circle" name="Raj Singh" src="..." />
<Avatar shape="rounded" name="Raj Singh" src="..." />
<Avatar shape="square" name="Raj Singh" src="..." />`}
        >
          <div className="flex w-full items-center gap-4">
            {SHAPES.map((shape) => (
              <div key={shape} className="flex flex-col items-center gap-1">
                <Avatar
                  size="lg"
                  shape={shape}
                  name="Raj Singh"
                  src="https://i.pravatar.cc/120?img=11"
                />
                <Text variant="body-xs" color="muted">
                  {shape}
                </Text>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Fallback ladder ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Fallback ladder · image → initials → silhouette</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          The Fallback renders when the image isn&apos;t loaded. Priority:
          explicit <code>{'<Avatar.Fallback>'}</code> children &gt; auto-initials
          from <code>name</code> &gt; <code>Person</code> silhouette.
        </Text>
        <PreviewRow
          code={`{/* 1. Image loads — fallback never shows */}
<Avatar src="https://i.pravatar.cc/120?img=11" name="Raj Singh" />

{/* 2. Image fails — initials fall back (deterministic colour from name) */}
<Avatar src="https://bad-url.invalid" name="Raj Singh" />

{/* 3. No src — initials immediately */}
<Avatar name="Jane Doe" />

{/* 4. No src, no name — Person silhouette */}
<Avatar />

{/* 5. Custom fallback content overrides initials */}
<Avatar>
  <Avatar.Fallback>RS</Avatar.Fallback>
</Avatar>`}
        >
          <div className="flex w-full flex-wrap items-center gap-4">
            <Avatar src="https://i.pravatar.cc/120?img=11" name="Raj Singh" />
            <Avatar src="https://bad-url.invalid" name="Raj Singh" />
            <Avatar name="Raj Singh" />
            <Avatar />
            <Avatar>
              <Avatar.Fallback>RS</Avatar.Fallback>
            </Avatar>
          </div>
        </PreviewRow>
      </section>

      {/* ── Status badge ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Status badge</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Pass <code>status</code> to <code>{'<Avatar.Badge>'}</code> for the
          common online / busy / away / offline dot. Position defaults to{' '}
          <code>bottom-end</code> and flips automatically under{' '}
          <code>dir=&quot;rtl&quot;</code>.
        </Text>
        <PreviewRow
          code={`<Avatar src="..." name="Raj Singh">
  <Avatar.Badge status="online" />
</Avatar>`}
        >
          <div className="flex w-full flex-wrap items-center gap-6">
            {STATUSES.map((status) => (
              <div key={status} className="flex flex-col items-center gap-1">
                <Avatar
                  size="lg"
                  src="https://i.pravatar.cc/120?img=11"
                  name="Raj Singh"
                >
                  <Avatar.Badge status={status} />
                </Avatar>
                <Text variant="body-xs" color="muted">
                  {status}
                </Text>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Custom badge content ──────────────────────────────────── */}
      <section>
        <SectionHeader>Custom badge content</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Drop any ReactNode into <code>{'<Avatar.Badge>'}</code> for
          notification counts, verification ticks, role icons, etc. Pass{' '}
          <code>position</code> to anchor a corner.
        </Text>
        <PreviewRow
          code={`<Avatar src="..." name="Raj Singh" size="lg">
  <Avatar.Badge position="top-end">
    <CheckCircleFilled size={14} />
  </Avatar.Badge>
</Avatar>`}
        >
          <div className="flex w-full flex-wrap items-center gap-6">
            <Avatar size="lg" src="https://i.pravatar.cc/120?img=11" name="Raj Singh">
              <Avatar.Badge position="top-end" className="bg-content-success text-white p-0.5">
                <CheckCircleFilled size={14} />
              </Avatar.Badge>
            </Avatar>
            <Avatar size="lg" name="Jane Doe">
              <Avatar.Badge
                position="top-end"
                className="bg-content-critical text-white px-1.5 py-0.5 text-[10px] font-bold leading-none rounded-full"
              >
                12
              </Avatar.Badge>
            </Avatar>
            <Avatar size="lg" src="https://i.pravatar.cc/120?img=33" name="Aman Mehta">
              <Avatar.Badge position="bottom-end" className="bg-content-warning text-white p-0.5">
                <Bookmark size={12} />
              </Avatar.Badge>
            </Avatar>
          </div>
        </PreviewRow>
      </section>

      {/* ── Loading skeleton ──────────────────────────────────────── */}
      <section>
        <SectionHeader>Loading skeleton</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          <code>loading</code> renders a shimmering placeholder (overrides
          image + fallback + children). Honours{' '}
          <code>prefers-reduced-motion: reduce</code> by collapsing to a
          static placeholder.
        </Text>
        <PreviewRow
          code={`<Avatar loading size="lg" />
<Avatar loading size="lg" shape="rounded" />
<Avatar loading size="lg" shape="square" />`}
        >
          <div className="flex w-full flex-wrap items-center gap-4">
            {SHAPES.map((shape) => (
              <Avatar key={shape} loading={skeletonLoading} size="lg" shape={shape} />
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSkeletonLoading((v) => !v)}
            >
              {skeletonLoading ? 'Stop loading' : 'Restart loading'}
            </Button>
          </div>
        </PreviewRow>
      </section>

      {/* ── Group ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>AvatarGroup</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Horizontal stack with overlap and an optional <code>+N</code>{' '}
          overflow tile. The group cascades <code>size</code> + <code>shape</code> to
          nested avatars; each child gets a surface-coloured ring so the
          overlap reads cleanly.
        </Text>
        <PreviewRow
          code={`<AvatarGroup>
  {people.map((p) => (
    <Avatar key={p.name} src={p.src} name={p.name} />
  ))}
</AvatarGroup>`}
        >
          <AvatarGroup>
            {SAMPLE_PEOPLE.slice(0, 4).map((p) => (
              <Avatar
                key={p.name}
                src={'src' in p ? p.src : undefined}
                name={p.name}
              />
            ))}
          </AvatarGroup>
        </PreviewRow>
      </section>

      {/* ── Group · max + overflow ────────────────────────────────── */}
      <section>
        <SectionHeader>AvatarGroup · max + overflow</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Pass <code>max</code> to cap visible avatars; children beyond
          the cap collapse into a <code>+N</code> tile rendered after.
          Customise the tile via <code>renderOverflow</code>.
        </Text>
        <PreviewRow
          code={`<AvatarGroup max={3}>
  {people.map((p) => (
    <Avatar key={p.name} src={p.src} name={p.name} />
  ))}
</AvatarGroup>

<AvatarGroup
  max={3}
  renderOverflow={(n) => \`and \${n} more\`}
>
  ...
</AvatarGroup>`}
        >
          <div className="flex w-full flex-col gap-4">
            <AvatarGroup max={3}>
              {SAMPLE_PEOPLE.map((p) => (
                <Avatar
                  key={p.name}
                  src={'src' in p ? p.src : undefined}
                  name={p.name}
                />
              ))}
            </AvatarGroup>
            <AvatarGroup
              max={3}
              renderOverflow={(n) => (
                <span className="text-[10px] font-semibold">{`+${n} more`}</span>
              )}
            >
              {SAMPLE_PEOPLE.map((p) => (
                <Avatar
                  key={p.name}
                  src={'src' in p ? p.src : undefined}
                  name={p.name}
                />
              ))}
            </AvatarGroup>
          </div>
        </PreviewRow>
      </section>

      {/* ── Group · overlap ───────────────────────────────────────── */}
      <section>
        <SectionHeader>AvatarGroup · overlap</SectionHeader>
        <PreviewRow
          code={`<AvatarGroup overlap="small">  ...  </AvatarGroup>
<AvatarGroup overlap="medium"> ...  </AvatarGroup>   {/* default */}
<AvatarGroup overlap="large">  ...  </AvatarGroup>`}
        >
          <div className="flex w-full flex-col gap-3">
            {(['small', 'medium', 'large'] as const).map((overlap) => (
              <div key={overlap} className="flex items-center gap-4">
                <Text
                  variant="body-xs"
                  fontWeight="semibold"
                  color="muted"
                  className="min-w-[80px] tracking-wide uppercase"
                >
                  {overlap}
                </Text>
                <AvatarGroup overlap={overlap}>
                  {SAMPLE_PEOPLE.slice(0, 4).map((p) => (
                    <Avatar
                      key={p.name}
                      src={'src' in p ? p.src : undefined}
                      name={p.name}
                    />
                  ))}
                </AvatarGroup>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Group · cascading size/shape ──────────────────────────── */}
      <section>
        <SectionHeader>AvatarGroup · cascading size / shape</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Group <code>size</code> + <code>shape</code> become defaults for
          nested avatars via context. Per-avatar props still win — useful
          for highlighting one member.
        </Text>
        <PreviewRow
          code={`<AvatarGroup size="lg" shape="rounded">
  <Avatar name="Raj Singh" />
  <Avatar name="Jane Doe" />
  <Avatar size="xl" name="Aman Mehta" />     {/* override */}
</AvatarGroup>`}
        >
          <AvatarGroup size="lg" shape="rounded">
            <Avatar name="Raj Singh" />
            <Avatar name="Jane Doe" />
            <Avatar size="xl" name="Aman Mehta" />
          </AvatarGroup>
        </PreviewRow>
      </section>

      {/* ── Deterministic colour palette ──────────────────────────── */}
      <section>
        <SectionHeader>Deterministic colour palette · SSR-safe</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          The fallback bg is a pure function of <code>name</code> — DJB2
          hash modulo an 8-slot palette. Same name always picks the same
          slot, on the server and the client. No hydration mismatches.
        </Text>
        <PreviewRow
          code={`{/* Both <Avatar name="Aanya" /> instances always pick palette slot 3. */}
{NAMES.map((n) => <Avatar key={n} name={n} />)}`}
        >
          <div className="flex w-full flex-wrap gap-2">
            {PALETTE_DEMO_NAMES.map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <Avatar name={n} />
                <Text variant="body-xs" color="muted">
                  {n}
                </Text>
              </div>
            ))}
          </div>
        </PreviewRow>
      </section>

      {/* ── Compound usage ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound usage · finer control</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          Passing <code>{'<Avatar.Image>'}</code> or{' '}
          <code>{'<Avatar.Fallback>'}</code> as children skips the matching
          auto-render — your tree wins. <code>{'<Avatar.Badge>'}</code>{' '}
          always renders alongside whatever else is there.
        </Text>
        <PreviewRow
          code={`<Avatar size="lg" shape="rounded">
  <Avatar.Image
    src="https://i.pravatar.cc/120?img=11"
    alt="Raj Singh — engineering"
  />
  <Avatar.Fallback>RS</Avatar.Fallback>
  <Avatar.Badge status="online" />
</Avatar>`}
        >
          <Avatar size="lg" shape="rounded">
            <Avatar.Image
              src="https://i.pravatar.cc/120?img=11"
              alt="Raj Singh — engineering"
            />
            <Avatar.Fallback>RS</Avatar.Fallback>
            <Avatar.Badge status="online" />
          </Avatar>
        </PreviewRow>
      </section>

      {/* ── Accessibility ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Role + label.</strong>{' '}
            The root sets <code>role=&quot;img&quot;</code> with an{' '}
            <code>aria-label</code> derived from <code>alt</code> /{' '}
            <code>name</code>. The inner `&lt;img&gt;` carries the same{' '}
            <code>alt</code> for the rare case a screen reader prefers it.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Decorative avatars.</strong>{' '}
            Pass <code>decorative</code> to set <code>aria-hidden=&quot;true&quot;</code>{' '}
            on the root and clear the image alt — use when the avatar is
            redundant with an adjacent label (e.g. inside a card whose
            heading already names the person).
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Fallback semantics.</strong>{' '}
            Auto-initials are announced (they ARE the label when no image
            loads). The default <code>Person</code> silhouette is decorative
            (<code>aria-hidden</code>), so the avatar still announces the{' '}
            <code>name</code> via the root&apos;s aria-label.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Group label.</strong>{' '}
            <code>{'<AvatarGroup>'}</code> sets <code>role=&quot;group&quot;</code>{' '}
            — pass <code>aria-label</code> to name the group (e.g. &quot;Engineering team&quot;).
            Without one, screen readers just announce &quot;group&quot;.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Overflow tile label.</strong>{' '}
            The <code>+N</code> tile gets <code>aria-label=&quot;{`{N}`} more&quot;</code>{' '}
            so screen reader users get a meaningful announcement instead
            of just &quot;plus 5&quot;.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">SSR.</strong>{' '}
            <code>getInitials</code> and <code>getColourIndex</code> are
            pure functions of <code>name</code> — same input, same output
            on the server and the client. No <code>Math.random()</code>,
            no <code>Date.now()</code>, no <code>document</code>{' '}
            /
            <code>window</code> reads during render.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion.</strong>{' '}
            <code>prefers-reduced-motion: reduce</code> collapses the
            loading shimmer to a static placeholder. The loading state
            still applies; just no movement.
          </Text>
        </div>
      </section>

      {/* ── Props · Avatar ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Props · Avatar</SectionHeader>
        <PropsTable rows={AVATAR_PROPS} />
      </section>

      {/* ── Props · AvatarGroup ───────────────────────────────────── */}
      <section>
        <SectionHeader>Props · AvatarGroup</SectionHeader>
        <PropsTable rows={GROUP_PROPS} />
      </section>

      {/* ── Compound parts ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <Text variant="body-sm" color="secondary" className="mb-3 block">
          The convenience layout composes these automatically based on{' '}
          <code>src</code> / <code>name</code> / children. Each is also
          exported so consumers can drop into compound mode anytime.
        </Text>
        <div className="grid gap-3">
          {AVATAR_COMPOUND_PARTS.map(({ name, summary }) => (
            <div
              key={name}
              className="rounded-xl border border-stroke bg-surface-elevated px-6 py-4"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="bold" color="primary">
                {name}
              </Text>
              <Text variant="body-sm" color="secondary" className="mt-1 block">
                {summary}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Theme tokens ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Theme tokens · reference</SectionHeader>
        <CodeBlock
          code={`/* Defaults set on .swift-avatar / .swift-avatar-group and overridable
   per-instance via inline style, or globally via a higher-level selector. */

/* Per-avatar */
--avatar-radius          /* default 0.5rem — used by shape="rounded" */
--avatar-bg              /* auto-set from --avatar-palette-{0..7} */
--avatar-color           /* auto-set from --avatar-palette-{0..7}-color */
--avatar-badge-ring      /* default var(--color-surface) — ring around the badge */

/* 8-colour palette (consumer-themable) */
--avatar-palette-0       /* bg */
--avatar-palette-0-color /* text on bg */
... through --avatar-palette-7

/* Per-group */
--avatar-overlap-small   /* default -4px */
--avatar-overlap-medium  /* default -8px */
--avatar-overlap-large   /* default -12px */`}
        />
      </section>

      {/* ── Browser compatibility ─────────────────────────────────── */}
      <section>
        <SectionHeader>Browser compatibility</SectionHeader>
        <BrowserCompat
          features={[
            {
              name: 'CSS logical properties (margin-inline-start / inset-inline-*)',
              notes:
                'Group overlap, badge positions, and the in-group ring auto-flip under `dir="rtl"`.',
              support: 'Chrome 87+ · Safari 14.1+ · Firefox 66+',
            },
            {
              name: 'OKLCH color',
              notes:
                'Palette slots 4–7 use OKLCH for perceptually-uniform hues. Slots 0–3 use the design system tokens, so the avatar still renders correctly in any browser that supports the base palette.',
              support: 'Chrome 111+ · Safari 15.4+ · Firefox 113+',
            },
            {
              name: 'color-mix()',
              notes:
                'Used by the loading shimmer to fade the surface-muted token alpha mid-sweep.',
              support: 'Chrome 111+ · Safari 16.2+ · Firefox 113+',
            },
            {
              name: 'CSS animation + prefers-reduced-motion',
              notes:
                'Shimmer animation collapses to a static placeholder under reduced-motion.',
              support: 'Universal',
            },
          ]}
          caveats={[
            'The deterministic colour palette uses a DJB2 hash modulo 8. Two names can map to the same slot — by design (it\'s a fixed palette). The hash is stable across server / client / page reloads.',
            'The auto-fallback uses `Person` from `@swift/icons` as the ultimate placeholder. Replace by passing custom children to `<Avatar.Fallback>`.',
            'The cached-image path: `<Avatar.Image>` re-checks `img.complete` + `naturalWidth` in an effect to catch the case where the browser already decoded the image before React attached `onLoad` (typically a hydration scenario).',
          ]}
        />
      </section>

      {/* ── Import ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Avatar, AvatarGroup } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Avatar, AvatarGroup } from '@swift/components/Avatar'`}
          />
          <CopyableImport
            label="With types + utils"
            code={`import {
  Avatar,
  AvatarGroup,
  getInitials,
  getColourIndex,
  type AvatarProps,
  type AvatarSize,
  type AvatarShape,
  type AvatarStatus,
  type AvatarGroupProps,
} from '@swift/components/Avatar'`}
          />
        </div>
      </section>

      {/* ── Usage ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`// Convenience — most common.
<Avatar src={user.avatar} name={user.name} />

// With status badge.
<Avatar src={user.avatar} name={user.name} size="lg">
  <Avatar.Badge status={user.online ? 'online' : 'offline'} />
</Avatar>

// Team list — group with overflow.
<AvatarGroup max={3} aria-label="Engineering team">
  {team.map((m) => (
    <Avatar key={m.id} src={m.avatar} name={m.name} />
  ))}
</AvatarGroup>

// Full compound for custom layouts.
<Avatar size="lg" shape="rounded">
  <Avatar.Image src={user.avatar} alt={user.name} />
  <Avatar.Fallback>{user.initials}</Avatar.Fallback>
  <Avatar.Badge
    position="top-end"
    className="bg-content-critical text-white px-1.5 py-0.5 text-[10px] rounded-full"
  >
    {user.unreadCount}
  </Avatar.Badge>
</Avatar>`}
        />
      </section>
    </div>
  )
}

function PropsTable({ rows }: { rows: ReadonlyArray<PropRow> }) {
  return (
    <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
      <div className="hidden grid-cols-[200px_1fr_140px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
        <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
          Prop
        </Text>
        <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
          Type
        </Text>
        <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
          Default
        </Text>
      </div>
      {rows.map(({ name, type, defaultValue, description }) => (
        <div
          key={name}
          className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_140px] md:items-start md:gap-6"
        >
          <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
            {name}
          </Text>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Text variant="body-xs" fontFamily="mono" color="secondary" className="wrap-break-word">
              {type}
            </Text>
            <Text variant="body-sm" color="secondary">
              {description}
            </Text>
          </div>
          <Text
            variant="body-xs"
            fontFamily="mono"
            color={defaultValue ? 'inherit' : 'muted'}
          >
            {defaultValue ?? '—'}
          </Text>
        </div>
      ))}
    </div>
  )
}
