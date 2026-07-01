# Swift Components — Behavior Guide

How every component in `@swift/components` behaves: its parts, how props are exposed, which props are **required**, keyboard/a11y behavior, and gotchas.

---

## How props are exposed (library-wide conventions)

Every component follows the same patterns, so once you know these, you know most of the API:

1. **Compound parts.** Components expose sub-parts as static properties (`Tabs.List`, `Sheet.Content`, `DatePicker.Grid`). Parts read shared state from React context provided by the root — **they must be nested inside their root** or they throw. Many components also have a *convenience mode*: pass props like `title` / `description` to the root and it renders the default layout; drop in compound parts and it gets out of your way.

2. **Controlled / uncontrolled pairs.** Stateful props always come in triples: `value` (controlled) / `defaultValue` (uncontrolled) / `onValueChange` (notification). Same shape for `open`/`defaultOpen`/`onOpenChange` and `checked`/`defaultChecked`/`onCheckedChange`. Passing the controlled prop makes the consumer the source of truth; otherwise internal state is used. Implemented by `internal/state.ts → useControllableState`.

3. **Cascading context.** Group/root-level props (`size`, `variant`, `disabled`, `readOnly`, `invalid`, `required`) cascade to children via context; a child's own prop always wins. Examples: `CheckboxGroup`, `RadioGroup`, `SwitchGroup`, `ChipGroup`, `AvatarGroup`, `Card`, `ListItem`.

4. **Polymorphism.** Two flavors:
   - `as` prop — change the rendered element (`<Badge as="button">`, `<Button as="a">`).
   - `asChild` — merge props onto your single child element via the internal `Slot` (`<Sheet.Trigger asChild><MyButton/></Sheet.Trigger>`). Fragments error; must be exactly one element.

5. **Styling escape hatches.** `className` on every part, plus a `classes` object on roots for slot-level overrides (`classes={{ root, label, icon, ... }}`).

6. **Render props — two distinct kinds.** When a part has more visual variations than props can reasonably cover, the library hands you state instead of adding props. Don't confuse the two mechanisms:

   - **`render*` callbacks build a slot's UI from state.** A named prop like `renderIndicator={({ index, selected, goTo }) => …}` is called with the component's internal state for that slot, and you return whatever you want to render. Pass a plain node instead of a function to reuse one custom UI everywhere. This is how you avoid prop bloat — rather than `indicatorColor`, `indicatorShape`, `activeIndicatorIcon`, … you get `selected`/`goTo` and draw the dot yourself. Reference implementation: `Carousel.Indicators` `renderIndicator` (see `CarouselIndicatorRenderProps`). Some older parts expose the same idea as a **function child** (`Carousel.Indicators` `children`, `Accordion.Trigger` `children` as `({ open }) => …`) — same concept, applied to the whole slot. Internally these resolve via `internal/props.ts → resolveRenderProp(prop, state)` (type `RenderProp<State>`); use it instead of hand-rolling `typeof x === 'function'` checks.
   - **`render` replaces the host element.** The bare `render` prop on `Text`, `Box`, `Badge`, `Button`, and `Accordion.Trigger` is the *element-swap* escape hatch (the `asChild`-as-a-function form): it receives the computed DOM props (`className`, handlers, refs) and you return the element to render in place of the default, with props merged via `mergeRenderProps`. It does **not** pass component state — keep it separate from `render*` content callbacks.

7. **Form integration.** Inputs/Checkbox/Radio/Switch use real native `<input>` elements (overlaid, opacity 0). Slider/SegmentedControl/DatePicker/TimePicker/YearPicker emit **hidden inputs** when you pass `name` (DatePicker range mode emits `name.start` + `name.end`; Slider emits one per thumb).

8. **Required props.** The library keeps required props minimal. The full list:

| Component part | Required prop | Why |
|---|---|---|
| `Accordion.Item` | `value: string` | identifies the item in single/multiple state |
| `Radio` / `Radio.Root` | `value: string` | identity inside RadioGroup + form value |
| `SegmentedControl.Item` | `value: string` | selection identity |
| `Tabs.Trigger` / `Tabs.Content` | `value: string` | pairs trigger ↔ panel |
| `Chip` (in a group) | `value: string` | group selection tracking |
| `Switch` (in a group) | `value: string` | group membership |
| `DatePicker.RangeTrigger` | `slot: 'start' \| 'end'` | which end of the range it controls |
| `DatePicker.Preset` | `value: Date \| range \| () => …` | the preset value |
| `Slider.Mark` | `value: number` | tick position |
| `Input.Group` (OTP) | `length: number` | number of cells |
| `Button` with `iconOnly` | `aria-label` or `aria-labelledby` | **enforced at the type level** |
| `Carousel.Indicator` | `index: number` | snap position it targets |
| `Avatar.Image` | `src: string` | the image itself |

Everything else has a sensible default (defaults are listed per component below).

---

## Accordion

**Parts:** `Accordion` (root) · `.Item` · `.Header` (`as` h1–h6, default `h3`) · `.Trigger` · `.Content`

**Key props (root):** `type: 'single' | 'multiple'` (default `'single'`), `collapsible` (default `false` in single mode), `value`/`defaultValue`/`onValueChange` (string for single, string[] for multiple), `disabled`.

**Behavior**
- Single mode keeps one item open; `collapsible` lets you close it. Multiple mode holds an array.
- Keyboard: ↑/↓ move between triggers, Home/End jump to first/last; disabled items are skipped.
- A11y: trigger gets `aria-expanded` + `aria-controls`; content is `role="region"` with `aria-labelledby`.
- Animations are CSS-driven via `data-state` attributes.
- `Trigger` children can be a function `({ open }) => ReactNode` for state-aware labels; it also accepts a `render` prop.

```jsx
<Accordion type="single" collapsible defaultValue="a">
  <Accordion.Item value="a">
    <Accordion.Header><Accordion.Trigger>Section A</Accordion.Trigger></Accordion.Header>
    <Accordion.Content>Content A</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

---

## Alert

**Parts:** `Alert` (convenience root) · `.Icon` · `.Content` · `.Title` · `.Description` · `.Actions` · `.Close`

**Key props:** `variant: 'default' | 'success' | 'warning' | 'error' | 'info'` (default `'default'`), `size: 'sm'|'md'|'lg'` (default `'md'`), `appearance: 'subtle'|'soft'|'solid'|'outline'|'left-accent'|'unstyled'` (default `'subtle'`), `open`/`defaultOpen` (default `true`)/`onOpenChange`, `dismissible` (auto-true when controlled), `title`, `icon` (`null` suppresses), `actions`.

**Behavior**
- **Convenience vs compound:** if children include Alert parts, the default layout is skipped.
- Role auto-derived: `error` → `role="alert"` (assertive), others → `role="status"` (polite). Override via `role`; `role="presentation"` opts out of live-region semantics (useful inside Toast).
- Title/Description auto-wire `aria-labelledby` / `aria-describedby`.
- Exit animation via `usePresence` — the alert stays mounted until `animationend`, then unmounts from the DOM.
- `Close` renders nothing unless dismissible — safe to always include. `onClick` on Close fires before dismiss; `preventDefault()` keeps it open.

```jsx
<Alert variant="success" title="Saved" dismissible>Your changes are live.</Alert>
```

---

## Avatar

**Parts:** `Avatar` (convenience root) · `.Image` · `.Fallback` · `.Badge` · plus `AvatarGroup`

**Key props:** `src`, `name` (drives initials + 8-slot color hash, SSR-safe), `size: 'xs'–'xl'` (default `'md'`), `shape: 'circle'|'rounded'|'square'` (default `'circle'`), `loading` (skeleton), `fallbackDelay` (default `600`ms), `decorative` (aria-hidden). Badge: `status: 'online'|'offline'|'busy'|'away'`, `position` (default `'bottom-end'`, logical → RTL-safe). Group: `max`, `renderOverflow` (default `+N` tile), `overlap`, cascading `size`/`shape`.

**Behavior**
- `Avatar.Image` publishes its load state (idle → loading → loaded/error) to context; `Fallback` waits `fallbackDelay` before showing (prevents flash on fast networks) unless the image errors.
- Initials and color are a deterministic hash of `name` — same name, same look, server and client.
- Root is `role="img"` with `aria-label`; the inner `<img>` deliberately gets an empty alt to avoid double-announcing.
- `loading` skeleton overrides everything.
- Group overflow tile only renders when count exceeds `max`; per-avatar `size`/`shape` overrides group defaults.

```jsx
<AvatarGroup max={3}>
  <Avatar src="/raj.jpg" name="Raj Singh"><Avatar.Badge status="online" /></Avatar>
  <Avatar name="Jane Doe" />
</AvatarGroup>
```

---

## Badge

**Parts:** `Badge` (polymorphic root, default `span`) · `.Dot` · `.Icon` · `.Label`

**Key props:** `variant` (default `'default'`), `appearance: 'solid'|'soft'|'outline'|'subtle'` (default `'soft'`), `size` (default `'md'`), `radius` (default `'md'`), `pill`, `dot`, `status` (**overrides** `variant`; status-only with no children renders a dot badge with auto `aria-label`), `count` (**replaces children**, capped as `${max}+`, `max` default `99`), `startIcon`/`endIcon`, `removable`/`onRemove`, `clickable`, `loading`, `disabled`.

**Behavior**
- `clickable` adds button semantics (role, tabIndex, Enter/Space) on non-button elements.
- `removable` replaces `endIcon` with a close button; its click stops propagation.
- `loading` shows a spinner in the start slot, sets `aria-busy`, and blocks interaction.

---

## Box

**Parts:** `Box` (polymorphic root, default `div`) — single element, no compound parts.

**Key props (all optional, no defaults):**
- **Spacing** — `p`/`px`/`py`/`pt`/`pr`/`pb`/`pl` (padding) and `m`/`mx`/`my`/`mt`/`mr`/`mb`/`ml` (margin). Value is a `SpaceValue`: a number is a step on the spacing scale (`p={4}` → `var(--space-4)`), a string passes through raw (`p="2rem"`, `mx="auto"`). Precedence: side > axis > shorthand.
- **Sizing** — `width`/`height`/`minWidth`/`minHeight`/`maxWidth`/`maxHeight`: a number is pixels (`width={240}` → `240px`), a string passes through (`width="100%"`).
- **Layout** — `display`, `overflow`.
- **Surface** — `bg` (`--color-surface-*` tokens), `radius` (`--radius-*`), `border` (`boolean | tone`, `true` → `'default'`), `shadow` (`--shadow-*`).

**Behavior**
- Adds **no classes of its own** — every style prop resolves to an inline style built from design tokens. A consumer `style` is merged over the top (wins per property); `className` forwards untouched.
- Token-driven `bg`/`border`/`shadow` re-theme automatically under `[data-theme="dark"]`.
- Style props are stripped from the props before spreading, so they never leak onto the DOM element.
- Polymorphic via `as`; TypeScript narrows `...rest` to the chosen element (`<Box as="a" href=…>`).

---

## Button

**Parts:** `Button` (polymorphic root, default `button`) · `.LeftIcon` · `.RightIcon` · `.Label`

**Key props:** `variant: 'primary'|'secondary'|'outline'|'ghost'|'danger'|'link'|'unstyled'` (default `'primary'`), `size` (default `'md'`), `loading`, `fullWidth`, `iconOnly` (**requires `aria-label`/`aria-labelledby` — TypeScript enforces it**), `disableRipple`.

**Behavior**
- Material-style ripple from the click point (Web Animations API, ~600ms); disabled for `link`/`unstyled` variants or via `disableRipple`.
- `loading`: children stay in the DOM but invisible; spinner overlays; interaction blocked; `aria-busy` set.
- Polymorphic non-buttons get `role="button"` + tabIndex + keyboard activation.

---

## Card

**Parts:** `Card` (root, default `div`; `button` when clickable) · `.Header` · `.Title` (default `h3`) · `.Description` · `.Content` · `.Footer` · `.Actions` · `.Media`

**Key props:** `variant: 'elevated'|'outlined'|'filled'|'ghost'` (default `'outlined'`), `size` (default `'md'`, cascades padding to sections via context), `radius` (default `'lg'`), `clickable` (hover lift + focus ring + keyboard activation), `loading` (skeleton lines, `aria-busy`), `asChild` (wins over `as`). Sections: `divider`, `muted` (Footer/Actions), `align` on Actions (default `'end'`).

```jsx
<Card clickable onClick={goToDetails}>
  <Card.Header divider><Card.Title>Trip summary</Card.Title></Card.Header>
  <Card.Content>…</Card.Content>
</Card>
```

---

## Carousel

**Parts:** `Carousel` (root) · `.Viewport` (focus surface, tabIndex=0) · `.Track` · `.Item` · `.Previous` · `.Next` · `.Indicators` · `.Indicator` · `.Progress`

**Key props:** `index`/`defaultIndex` (default `0`)/`onIndexChange`, `loop` (default `false`), `slidesPerView` (default `1`), `align: 'start'|'center'|'end'` (default `'start'`), `gap`, `dir` (default `'ltr'`), `duration` (default `500`ms), `draggable` (default `true`), `variant: 'slide'|'fade'` (default `'slide'`), `effect: 'none'|'peek'|'coverflow'`, `autoplay` (default `false`), `autoplayDelay` (default `4000`), `pauseOnHover` (default `true`).

**Behavior**
- Keyboard on Viewport: ←/→ (direction-aware in RTL), Home/End.
- Pointer drag with velocity-matched snap; a capture-phase listener swallows the click right after a drag.
- **Loop uses clones:** the track renders clones at both ends and does an invisible pre-snap jump at the boundary — you always speak in *real* indices (0..itemCount-1).
- Indicator count = `itemCount - slidesPerView + 1` (resting positions, not slides).
- Autoplay pauses on drag, focus, hover (if `pauseOnHover`), and hidden document; needs more than one item.
- `fade` variant disables drag/scroll entirely (opacity transitions in a CSS grid stack).
- Item add/remove is auto-detected (MutationObserver) and layout re-measured (ResizeObserver, paused during drag).
- `Carousel.Indicators` follows the render-prop convention (see #6 above): `renderIndicator={({ index, selected, goTo }) => …}` restyles each dot from its state; a function `children` (`{ count, selected, goTo }`) replaces the whole dots layout.

```jsx
<Carousel loop slidesPerView={3} gap={16} autoplay>
  <Carousel.Viewport>
    <Carousel.Track>
      <Carousel.Item>1</Carousel.Item>
      <Carousel.Item>2</Carousel.Item>
      <Carousel.Item>3</Carousel.Item>
    </Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous /><Carousel.Next />
  <Carousel.Indicators />
</Carousel>
```

---

## Checkbox

**Parts:** `Checkbox` (convenience) · `Checkbox.Root` · `.Input` (real `<input type="checkbox">`) · `.Indicator` · `.Label` · `.Description` · `.ErrorMessage` · plus `CheckboxGroup`

**Key props:** `checked: boolean | 'indeterminate'` / `defaultChecked` (default `false`) / `onCheckedChange`, `size` (default `'md'`), `disabled`, `readOnly`, `required`, `invalid`, `description`, `errorMessage` (only shows when `invalid`), `indicator` (custom glyph), `value` (for groups), `name`. Group: `value: string[]`/`defaultValue` (default `[]`)/`onValueChange`, `orientation` (default `'vertical'`), cascading `size`/`disabled`/`readOnly`/`required`/`invalid`/`name`.

**Behavior**
- Real native input → Space toggles, native form submission and RHF/Formik work out of the box.
- `indeterminate` mirrors the DOM property and announces `aria-checked="mixed"`; forms still submit checked/unchecked.
- `readOnly` is emulated (checkboxes have no native readOnly) by re-asserting state on change.
- Inside a group, a child with `value` reads selection from the group's array.

---

## Chip

**Parts:** `Chip` (single polymorphic element, default `button`) · plus `ChipGroup`

**Key props:** `variant` (default `'default'`), `appearance: 'solid'|'soft'|'outline'` (default `'solid'`), `size` (default `'md'`), `radius` (default `'full'`), `selected`/`onSelectedChange`, `value` (group identity), `disabled`, `loading`, `removable`/`onRemove`, `startIcon`/`endIcon`/`avatar`, `showCheckOnSelected` (default `true`). Group: `selectionMode: 'single'|'multiple'|'none'` (default `'single'`), `value`/`defaultValue`/`onValueChange`, `orientation` (default `'horizontal'`).

**Behavior**
- Single mode: clicking the selected chip deselects (value becomes `null`). Multiple mode: value is always an array. `none`: you drive everything via `onClick`.
- Slot precedence: loading spinner > avatar > startIcon (leading); remove button > endIcon (trailing). Remove click stops propagation so it doesn't toggle selection.
- A11y: `aria-pressed` when selected, `aria-busy` loading, `aria-disabled`; non-button `as` gets role/tabIndex/Enter/Space handling.

---

## DatePicker

**Parts:** `DatePicker` (root; renders a default layout if you pass no children) · `.Trigger` · `.RangeTrigger` (slot `'start'|'end'`, booking-style) · `.Input` (free-text, Day.js parsing) · `.Portal` · `.Content` (dialog, focus-trapped) · `.Calendar` · `.Header` · `.PrevButton`/`.NextButton` · `.MonthSelect`/`.YearSelect` · `.Grid` · `.Day` · `.Presets`/`.Preset` · `.TimeFields` · `.DoneButton`

**Key props (root):** `mode: 'single' | 'range'` (default `'single'`); single value is `Date | null`, range value is `{ start, end }`. `value`/`defaultValue`/`onValueChange`, `open`/`defaultOpen`/`onOpenChange`, `weekStartsOn` (default `0` Sunday), `numberOfMonths` (default `1`), `showWeekNumbers`, `withTime` + `timeProps`, `min`/`max`, `disabledDates` (array or predicate — keep predicates cheap, they run per visible cell per render), `locale` (default `navigator.language`), `dir`, `name`/`form`/`required`.

**Behavior**
- **Range swap:** picking an end date before the start automatically reorders so `start <= end` — no API needed.
- **Auto-close:** single mode closes on day click; range mode closes after the end date; with `withTime` nothing auto-closes — user must press `DoneButton`.
- `Input` parses strictly with the Day.js `format` (default `'YYYY-MM-DD'`); invalid text is held locally and reverts on blur; **clearing via the input is not supported** — call `onValueChange(null)` from a separate clear button.
- Multi-month panels: `Header`/`Grid` take `monthOffset`; Prev/Next step by the full `numberOfMonths`.
- Forms: hidden ISO-8601 input(s); range emits `name.start` + `name.end`.
- A11y: trigger `aria-haspopup="dialog"` + `aria-expanded`; content is a focus-trapped `role="dialog"`, Escape closes; arrow keys move within the grid.
- RTL flips month navigation; ids come from `useId()` so SSR-safe.

```jsx
<DatePicker mode="range">
  <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
  <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
  <DatePicker.Portal>
    <DatePicker.Content>
      <DatePicker.Calendar>
        <DatePicker.Header monthOffset={0} /><DatePicker.Grid monthOffset={0} />
        <DatePicker.Header monthOffset={1} /><DatePicker.Grid monthOffset={1} />
      </DatePicker.Calendar>
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker>
```

---

## Input

**Parts:** `Input` (convenience) · `Input.Root` · `.Label` · `.Field` · `.HelperText` · `.ErrorMessage` · `Input.Group` (OTP)

**Key props:** `size` (default `'md'`), `variant: 'outlined'|'filled'|'flushed'` (default `'outlined'`), `state: 'default'|'success'|'warning'|'error'`, `labelPlacement: 'top'|'floating'` (default `'top'`), `label`, `helperText`, `errorMessage` + `invalid`, `required`, `disabled`, `readOnly`, `fullWidth`, `startAdornment`/`endAdornment`, `clearable`/`onClear`, `showPasswordToggle`, `loading` (spinner, doesn't block typing), `showCount` (needs `maxLength`).

**OTP (`Input.Group`):** `length` (**required**), `type: 'numeric'|'alphanumeric'|'all'` (default `'numeric'`), `mask` (dots but raw chars emitted), `onChange` per keystroke, `onComplete` when every cell filled, `autoFocus`, per-cell `ariaLabel`.

**Behavior**
- End-slot stacking order: clear → password toggle → spinner → endAdornment.
- Error takes precedence over helper text in the footer (and only shows when `invalid`).
- Clear button: calls `onClear` if given, otherwise clears via native DOM setter + input event (uncontrolled-friendly).
- Floating label relies on the label rendering *after* the field (handled internally); when composing with `Input.Root` + a start adornment, set `hasStartAdornment` so the label clears the icon.
- OTP: arrows move between cells, Backspace on an empty cell focuses the previous one, paste distributes characters across cells; value is normalized to exactly `length` chars.

---

## ListItem

**Parts:** `ListItem` (root, `div`/`button` when clickable) · `.Leading` · `.Content` · `.Title` · `.Description` · `.Trailing` · `.Actions` (separate slot for predictable tab order)

**Key props:** convenience `title`/`description`, `size` (default `'md'`), `density: 'compact'|'comfortable'|'spacious'` (default `'comfortable'`), `align` (default `'center'`), `orientation` (default `'horizontal'`; vertical stacks for card grids), `clickable`, `selected` (`aria-selected`), `active` (`aria-current="page"`), `disabled`, `loading` (skeleton), `divider`, `asChild`/`as`.

**Behavior**
- Static rows stay plain markup; only `clickable` adds button semantics and Enter/Space activation.
- Root config (`size`/`density`/`align`/`orientation`) cascades to parts via context.
- Clickable comfortable/spacious rows enforce a min touch-target height (skipped in vertical orientation).
- Per-row `divider` is suppressed when the parent `<List dividers>` is on.
- Use `as="a"` or `asChild` with a link when you need real navigation semantics.

---

## Pagination

**Parts:** single `<nav>` landmark wrapping a `<ul>` of page buttons (no compound sub-parts).

**Key props:** `count` (**required**, total pages), `page`/`defaultPage` (default `1`)/`onPageChange`, `siblingCount` (default `1`), `boundaryCount` (default `1`), `size` (default `'md'`), `variant: 'solid'|'outline'|'ghost'`, `disabled`, `showPrevNext` (default `true`), `showFirstLast` (default `false`), `getItemAriaLabel`, `prevIcon`/`nextIcon`/`firstIcon`/`lastIcon`, `classes`.

**Behavior**
- Collision-aware ellipsis gaps; range computed by `getPaginationRange(count, current, siblingCount, boundaryCount)` (exported). Active page is clamped into `[1, count]`.
- Controlled/uncontrolled via `page`/`defaultPage`/`onPageChange`; active button gets `aria-current="page"`.
- Render-prop customization (convention #6): `renderItem={({ type, page, selected, disabled, goTo }) => …}` replaces each page/ellipsis slot's UI; `renderControl={({ control, page, disabled, goTo }) => …}` replaces the prev/next/first/last buttons (superseding the `*Icon` props). Both keep the wrapping `<li>` and respect `showPrevNext`/`showFirstLast`. The `*Icon` props remain for light glyph swaps.

```jsx
<Pagination
  count={20}
  defaultPage={1}
  onPageChange={setPage}
  renderItem={({ type, page, selected, goTo }) =>
    type === 'page' ? (
      <button aria-current={selected} onClick={goTo}>{page}</button>
    ) : <span>…</span>
  }
/>
```

---

## Radio

**Parts:** `Radio` (convenience) · `Radio.Root` · `.Input` (real `<input type="radio">`) · `.Indicator` · `.Label` · `.Description` · `.ErrorMessage` · plus `RadioGroup` (`role="radiogroup"`)

**Key props:** `value` (**required**), `checked`/`defaultChecked`/`onChange`, `size` (default `'md'`), `disabled`, `readOnly`, `required`, `invalid`, `description`, `errorMessage`, `indicator`. Group: `value: string | null`/`defaultValue`/`onValueChange`, `name` (auto-generated if omitted), `label`/`description`/`errorMessage`, `orientation` (default `'vertical'`), cascading state props.

**Behavior**
- Inside a group, the group's value is the truth — the individual radio's `checked`/`onChange` are ignored.
- Keyboard: Tab lands on the selected radio (or first); arrows move and **selection follows focus**; the native input handles Space.
- Values within a group must be unique.
- Native inputs → standard form submission.

---

## SegmentedControl

**Parts:** `SegmentedControl` (root, `role="radiogroup"`, hidden form input) · `.Item` (`role="radio"`, **required `value`**, `asChild`) · `.Indicator` (sliding pill)

**Key props:** `value`/`defaultValue`/`onValueChange` — **if uncontrolled with no default, the first non-disabled item auto-selects on mount**. `orientation` (default `'horizontal'`), `size` (default `'md'`), `disabled`, `readOnly`, `fullWidth`, `equalWidth` (widest-item width; ignored with fullWidth), `loop` (default `true`), `dir` (auto-detected from `[dir]` ancestor), `name`.

**Behavior**
- Roving tabindex: only the selected item is Tab-reachable; arrows move + select (RTL flips ←/→), Home/End jump.
- Indicator: first placement snaps without animation, later moves animate; tracked with ResizeObserver so font/content reflows re-measure; hidden while nothing is selected.

```jsx
<SegmentedControl value={trip} onValueChange={setTrip} fullWidth>
  <SegmentedControl.Item value="one-way">One-way</SegmentedControl.Item>
  <SegmentedControl.Item value="round">Round trip</SegmentedControl.Item>
  <SegmentedControl.Indicator />
</SegmentedControl>
```

---

## Sheet

**Parts:** `Sheet` (root) · `.Trigger` (`asChild`) · `.Portal` (SSR-safe, default `document.body`) · `.Overlay` · `.Content` · `.Header` · `.Title` · `.Description` · `.Body` · `.Footer` · `.Close` (`asChild`)

**Key props (root):** `open`/`defaultOpen` (default `false`)/`onOpenChange`, `modal` (default `true`). Content: `side: 'left'|'right'|'top'|'bottom'` (default `'right'`), `size: 'sm'|'md'|'lg'|'full'` (default `'md'`), `closeOnEscape` (default `true`), `closeOnInteractOutside` (default `true`), `initialFocusRef`, `forceMount`, and interceptors `onEscapeKeyDown` / `onInteractOutside` / `onOpenAutoFocus` / `onCloseAutoFocus` (call `preventDefault()` to override).

**Behavior**
- **Modal mode:** focus trap (Tab wraps), scroll lock, siblings inert, overlay. **Non-modal:** none of that — for inspectors/side panels.
- Opening focuses `initialFocusRef` or the first focusable; closing restores focus to the trigger.
- A global overlay stack means only the **top-most** open layer responds to Escape/outside-click (nests correctly with tooltips etc.).
- Content unmounts when closed unless `forceMount` (needed for custom exit animations).
- A11y: `role="dialog"`, `aria-modal`, `aria-labelledby`/`aria-describedby` auto-wired from Title/Description; trigger gets `aria-haspopup`/`aria-expanded`/`aria-controls`.

```jsx
<Sheet open={open} onOpenChange={setOpen}>
  <Sheet.Trigger>Filters</Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content side="left" size="sm">
      <Sheet.Header><Sheet.Title>Filters</Sheet.Title></Sheet.Header>
      <Sheet.Body>…</Sheet.Body>
      <Sheet.Footer><Sheet.Close>Done</Sheet.Close></Sheet.Footer>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet>
```

---

## Slider

**Parts:** `Slider` (root) · `.Track` · `.Range` · `.Thumb` (`role="slider"`) · `.Mark` (**required `value`**) · `.Value` · `.Label`

**Key props:** `value: number[]`/`defaultValue` (default `[min]`)/`onValueChange` (fires **every tick**) + `onValueCommit` (fires on release — use this for API calls), `min` (default `0`), `max` (default `100`), `step` (default `1`), `orientation` (default `'horizontal'`), `inverted`, `minStepsBetweenThumbs` (default `0`), `disabled`, `readOnly`, `dir`, `format` (drives `aria-valuetext` and `Slider.Value`), `name`/`form`/`required`.

**Behavior**
- Values are **always an array** — `[n]` for one thumb, `[lo, hi]` for a range. Multiple hidden inputs serialize as `name=lo&name=hi`.
- Keyboard per thumb: arrows ±step, Ctrl+arrow ±10% of range, Home/End to the extremes; RTL flips horizontal arrows.
- Pointer-down on the track snaps the **nearest** thumb and starts dragging; pointer capture keeps the drag alive outside the bounds.
- Thumb `index` is auto-assigned by render order — pass explicit `index` if thumbs are conditional/reordered.
- `inverted` + RTL cancel out.

---

## Switch

**Parts:** `Switch` (convenience) · `Switch.Root` · `.Input` (`<input type="checkbox" role="switch">`) · `.Track` (`asChild`) · `.Thumb` (`asChild`, hosts the loading spinner) · `.Label` · `.Description` · `.ErrorMessage` · plus `SwitchGroup`

**Key props:** `checked`/`defaultChecked` (default `false`)/`onCheckedChange`, `size` (default `'md'`), `variant: 'default'|'success'|'warning'|'info'|'neutral'`, `disabled`, `readOnly`, `required`, `invalid`, `loading` (spinner in thumb, blocks interaction, `aria-busy`), `checkedIcon`/`uncheckedIcon`, `dragToToggle` (default `true`), `value`/`name`, `apiRef` (imperative `toggle()`, `setChecked()`, `focus()`, `blur()`, `getChecked()`). Group: `value: string[]`/`defaultValue`/`onValueChange` + cascading props.

**Behavior**
- **Drag-to-toggle:** pointer drag past a 4px threshold moves the thumb 1:1; releasing past the midpoint flips the state; below it cancels. A plain click falls through to the native input. RTL direction is sniffed at gesture start.
- Space/Enter toggle via the native input — full form compatibility.
- Inside a `SwitchGroup`, checked state is derived from the group array + the switch's `value`; an explicit `checked` prop is ignored.

---

## Tabs

**Parts:** `Tabs` (root) · `.List` (`scrollable`) · `.Trigger` (**required `value`**, `disabled`, `asChild`) · `.Content` (**required `value`**, `forceMount`) · `.Indicator` (animated bar; zero DOM cost when omitted)

**Key props (root):** `value`/`defaultValue`/`onValueChange` — uncontrolled with no default auto-selects the first enabled trigger (but is `null` during SSR; **pass `defaultValue` for SSR**). `orientation` (default `'horizontal'`), `activationMode: 'automatic' | 'manual'` (default `'automatic'`), `lazyMount` (default `false`; once shown, stays mounted), `loop` (default `true`), `swipeable` (default `false`), `dir`, `apiRef`.

**Behavior**
- Roving tabindex; arrows move focus (mirrored in RTL), Home/End jump; in `automatic` mode focus selects immediately, in `manual` mode Enter/Space commits.
- `swipeable` enables axis-locked horizontal swipes on content (vertical scroll preserved), with velocity-based fling detection.
- A11y: `role="tab"`/`aria-selected`/`aria-controls` ↔ `role="tabpanel"`/`aria-labelledby`.
- `forceMount` on a panel wins over `lazyMount`.

```jsx
<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Content value="overview">…</Tabs.Content>
  <Tabs.Content value="reviews" lazyMount>…</Tabs.Content>
</Tabs>
```

---

## Text

Single stateless element, no parts.

**Key props:** `variant` (default `'body-md'`; `body-xs…xl`, `heading-xs…xl`, `para-sm/md/lg`) — each variant maps to a semantic tag (e.g. `heading-lg` → `<h2>`), overridable via `variantMapping` or per-instance `render`. `fontWeight`, `fontFamily`, `align` (default `'inherit'`), `color: 'primary'|'secondary'|'muted'|'success'|'warning'|'error'|'info'` (default `'inherit'`), `gutterBottom`, `noWrap` (single-line ellipsis).

---

## TimePicker

**Parts:** `TimePicker` (root) · `.Trigger` (`asChild`) · `.Portal` · `.Content` · `.Steppers` (hour/minute/optional seconds/AM-PM columns) · `.Actions` · `.OK` · `.Cancel`

**Key props:** `value: { hours, minutes, seconds? } | null`/`defaultValue`/`onValueChange`, `open`/`defaultOpen`/`onOpenChange`, `hourCycle: 'h12' | 'h23'` (default `'h23'`), `showSeconds` (default `false`), `step` in seconds (default `60`), `min`/`max`, `disabled`, `readOnly`, `dir` (re-sniffed on every open), `name`/`form`/`required`.

**Behavior**
- **Pending-commit model:** edits while open are staged; **OK commits, Cancel/Escape discards**. `onValueChange` fires only on commit.
- With no value, the popover seeds at 12:00/00:00 clamped to min/max — but the real value stays null until OK.
- ↑/↓ step the focused column; hidden form input serializes `HH:MM[:SS]`.

---

## Toast

**Two APIs:** imperative `toast()` (the main one) + declarative `ToastProvider`/`ToastViewport`/`ToastRoot`.

**Imperative:** `toast(message, options?)`, `toast.success/error/warning/info(message, options?)`, `toast.dismiss(id?)` (no arg = dismiss all). Returns the toast id; **reusing an `id` replaces the toast in place** (great for upload progress).

**Options:** `type` (default `'default'`), `appearance` (default provider's, `'subtle'`), `title`/`description`, `action: { label, onClick }`, `duration` (default `5000`ms; `Infinity` pins), `position` (default `'bottom-right'`, 6 positions), `icon` (`null` suppresses).

**Provider props:** `position`, `appearance`, `duration`, `maxVisible` (default `3` per position, extras queue), `renderViewport` (default `true`).

**Behavior**
- The store is a **module singleton** outside React — call `toast()` from anywhere (loaders, event handlers, routers). The viewport subscribes via `useSyncExternalStore`. When the last provider unmounts, the store clears (no stale toasts on HMR).
- Viewport portals to `document.body`; rendered as `<ol>` per position with `aria-live="polite"` (assertive for errors); error toasts are `role="alert"`.
- Stacked FIFO; hover expands the stack (heights tracked via ResizeObserver). Exit animation runs in parallel with re-indexing; removal finalizes on `transitionend`.
- SSR-safe: empty list on the server.

```jsx
// app root
<ToastProvider position="bottom-right" maxVisible={3}><App /></ToastProvider>

// anywhere
toast.success('Saved!', { description: 'Your changes are live.' })
toast('Uploading…', { id: 'upload', duration: Infinity })
toast.success('Uploaded', { id: 'upload' }) // replaces in place
```

---

## Tooltip

**Parts:** `Tooltip` (root) · `.Trigger` (**`asChild` defaults to `true`** — decorates your element directly) · `.Portal` · `.Content` (`variant: 'default' | 'brand'`) · `.Arrow` · `.Close` · `Tooltip.Provider` (shared delays)

**Key props (root):** `open`/`defaultOpen`/`onOpenChange`, `trigger: 'hover' | 'click' | ['hover','click']` (default `'hover'`), `placement` (default `'top'`, 12 placements), `offset` (default `8`px), `openDelay` (default `700`ms via Provider), `closeDelay` (default `300`ms), `interactive` (pointer can enter the tooltip), `disableTouch`, `disabled`, `dir`. Provider: `openDelay`, `closeDelay`, `skipDelayDuration` (default `300`ms — successive tooltips open instantly within this window).

**Behavior**
- Positioned by the in-house floating engine ([internal/floating.ts](packages/components/src/internal/floating.ts)): offset → flip (if the side clips) → shift (stay in viewport) → arrow.
- Hover trigger covers hover + keyboard focus + **touch long-press (500ms; >10px movement cancels)**.
- `['hover','click']`: hover opens, click **pins** — only a second click or Escape closes.
- A11y: trigger gets `aria-describedby` → content id; no focus trap (informational overlay).
- **Disabled buttons** don't emit events — wrap them with `<Tooltip.Trigger asChild={false}>` so the span receives the events.
- Dismissible tooltips join the shared overlay stack, so Escape peels one layer at a time inside a Sheet.

---

## YearPicker

Single self-contained component (no parts): header label + scrollable `role="listbox"` of years + optional hidden form input.

**Key props:** `value`/`defaultValue` (defaults to the current year)/`onValueChange`, `min` (default `currentYear − 50`), `max` (default `currentYear + 10`), `disabled`, `label` (default `'Year'`), `name`/`form`/`required`.

**Behavior**
- Click-only selection; the list smooth-scrolls so the selected year is centered (on mount and on change).
- Visual hierarchy by distance from selection: selected is largest/bold, fading progressively for farther years.

---

## Theme & tokens

- **Engine:** Tailwind CSS with custom palettes (Brand/emerald, Highlight/blue, Success, Warning, Error, Neutral; shades 50–900).
- **Semantic tokens:** `--color-surface-*`, `--color-content-*`, `--color-stroke-*` — re-aliased under `[data-theme="dark"]` for dark mode.
- **Motion tokens:** easings `--motion-ease-standard/emphasized/snappy`; durations `--motion-duration-fast` (150ms) / `normal` (200ms) / `slow` (320ms).
- **Z-index tokens:** `--z-overlay` 40 · `--z-modal` 50 · `--z-toast` 60 · `--z-tooltip` 70.
- Per-component CSS lives in `packages/components/src/theme/*.css`.

## Internal utilities (shared behavior)

- [Slot.tsx](packages/components/src/internal/Slot.tsx) — powers `asChild`: merges className/style and chains handlers onto your single child.
- [state.ts](packages/components/src/internal/state.ts) — `useControllableState`, the controlled/uncontrolled pattern every stateful component uses.
- [floating.ts](packages/components/src/internal/floating.ts) — dependency-free positioning engine (placement/flip/shift/arrow) used by Tooltip and pickers.
- [overlay.ts](packages/components/src/internal/overlay.ts) — global overlay stack so Escape/outside-click only hits the top-most layer.
- [cx.ts](packages/components/src/internal/cx.ts) — class joiner; [props.ts](packages/components/src/internal/props.ts) — render-prop merging.

> No external runtime dependencies: all primitives (positioning, slots, gestures) are built in-house.
