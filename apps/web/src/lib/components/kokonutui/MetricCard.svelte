<script lang="ts">
  import { cn } from '$lib/utils';

  const W = 400;
  const H = 120;
  const PAD_Y = 10;
  const SAMPLES = 90;
  const MORPH_MS = 240;
  const DAY = 86_400_000;
  const SNAP_PX = 6;
  const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const DIGIT_RE = /\d/;

  const SWATCHES = [
    'bg-brand',
    'bg-cyan',
    'bg-orange',
    'bg-ink-muted',
  ] as const;

  export interface MetricPoint {
    date: string;
    parts: number[];
  }

  export interface MetricEvent {
    date: string;
    label: string;
  }

  export interface MetricCardProps {
    badge?: string;
    telemetry?: string;
    title?: string;
    description?: string;
    label?: string;
    segments?: string[];
    data?: MetricPoint[];
    events?: MetricEvent[];
    periods?: number[];
    defaultPeriod?: number;
    format?: 'currency' | 'number';
    currency?: string;
    class?: string;
  }

  interface Span { lo: number; hi: number }
  interface Shape { current: number[]; previous: number[] }
  interface Paths { current: string; previous: string }

  // Deterministic PRNG producing authentic developmental evidence counts acrossSSR and client
  function mkDemoData(days: number, end: string): MetricPoint[] {
    let seed = 42;
    const rand = () => { seed = (seed * 16_807) % 2_147_483_647; return seed / 2_147_483_647; };
    const last = Date.parse(`${end}T00:00:00Z`);
    const out: MetricPoint[] = [];
    let projects = 4, checks = 6;
    for (let i = 0; i < days; i++) {
      const t = last - (days - 1 - i) * DAY;
      const wd = new Date(t).getUTCDay();
      const wknd = wd === 0 || wd === 6;
      projects = Math.max(2, Math.min(9, projects + (rand() - 0.48) * 1.4));
      if (i === days - 12) projects += 1.5;
      checks = Math.max(3, Math.min(12, checks + (rand() - 0.47) * 1.8));
      const studioWeek = i >= days - 24 && i <= days - 19;
      const reflections = (studioWeek ? 5 : 3) * (0.75 + rand() * 0.5);
      out.push({
        date: new Date(t).toISOString().slice(0, 10),
        parts: [
          Math.max(1, Math.round(projects * (wknd ? 0.65 : 1))),
          Math.max(1, Math.round(checks * (wknd ? 0.7 : 1))),
          Math.max(1, Math.round(reflections * (wknd ? 0.6 : 1))),
        ],
      });
    }
    return out;
  }

  const DEFAULT_DATA = mkDemoData(180, '2026-10-14');
  const DEFAULT_EVENTS: MetricEvent[] = [
    { date: DEFAULT_DATA[180 - 22].date, label: 'Hydraulic Arm Lab' },
    { date: DEFAULT_DATA[180 - 12].date, label: 'Socratic Concept Check' },
  ];

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
  const easeInOut = (t: number) => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

  function resample(vals: number[], count: number): number[] {
    if (!vals.length) return new Array(count).fill(0);
    const out = new Array<number>(count);
    for (let i = 0; i < count; i++) {
      const at = (i / (count - 1)) * (vals.length - 1);
      const lo = Math.floor(at);
      const hi = Math.min(vals.length - 1, lo + 1);
      out[i] = vals[lo] + (vals[hi] - vals[lo]) * (at - lo);
    }
    return out;
  }

  const yOf = (h: number) => PAD_Y + (1 - h) * (H - PAD_Y * 2);

  function toPath(heights: number[]): string {
    if (!heights.length) return '';
    const pts = heights.map((h, i) => [(i / Math.max(1, heights.length - 1)) * W, yOf(h)] as [number, number]);
    let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      d += `L${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
    }
    return d;
  }

  const toArea = (line: string) => `${line}L${W} ${H}L0 ${H}Z`;

  function buildPeriod(data: MetricPoint[], days: number, focus: number | null) {
    const current = data.slice(-days);
    const previous = data.slice(-days * 2, -days);
    const pick = (p: MetricPoint) => focus === null ? sum(p.parts) : (p.parts[focus] ?? 0);
    const now = current.map(pick);
    const before = previous.map(pick);
    const all = [...now, ...before];
    const lo = Math.min(...all) * 0.85;
    const hi = Math.max(...all) * 1.04;
    const norm = (v: number) => (v - lo) / (hi - lo || 1);
    return {
      current, previous, now, before,
      shape: {
        current: resample(now.map(norm), SAMPLES),
        previous: resample(before.map(norm), SAMPLES),
      } as Shape,
      paths: {
        current: toPath(now.map(norm)),
        previous: toPath(before.map(norm)),
      } as Paths,
      norm,
    };
  }

  const spanTotal = (vals: number[], span: Span | null) =>
    sum(span ? vals.slice(span.lo, span.hi + 1) : vals);

  function breakdown(points: MetricPoint[], span: Span | null, count: number) {
    const parts = new Array<number>(count).fill(0);
    const days = span ? points.slice(span.lo, span.hi + 1) : points;
    for (const p of days) for (let i = 0; i < count; i++) parts[i] += p.parts[i] ?? 0;
    return parts;
  }

  const fmtDay = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  const fmtShort = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

  function spanOf(range: { a: number; b: number } | null, cursor: number | null, last: number) {
    if (range && range.a !== range.b)
      return { span: { lo: Math.min(range.a, range.b), hi: Math.max(range.a, range.b) } as Span, ranged: true };
    if (cursor !== null && cursor <= last) return { span: { lo: cursor, hi: cursor } as Span, ranged: false };
    return { span: null as Span | null, ranged: false };
  }

  function readOf(
    info: ReturnType<typeof buildPeriod>,
    span: Span | null,
    ranged: boolean,
    period: number,
    events: MetricEvent[]
  ) {
    const day = span && !ranged ? info.current[span.lo] : undefined;
    const twin = span && !ranged ? info.previous[span.lo] : undefined;
    const value = spanTotal(info.now, span);
    const compare = spanTotal(info.before, span);
    const event = day ? events.find(e => e.date === day.date) : undefined;
    let caption = `verified artifacts (${period}d window)`;
    if (ranged && span) {
      const days = span.hi - span.lo + 1;
      caption = `${fmtShort(info.current[span.lo].date)} to ${fmtShort(info.current[span.hi].date)} (${days}d)`;
    } else if (day) {
      caption = `${fmtDay(day.date)} vs ${fmtShort(twin?.date ?? day.date)}`;
    }
    return { day, twin, value, delta: compare ? (value - compare) / compare : 0, event, caption };
  }

  const KEY_MOVES: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, Home: -9999, End: 9999 };

  let {
    badge,
    telemetry,
    title,
    description,
    label = 'Verified Evidence Signals',
    segments = ['Projects', 'Concept Checks', 'Reflections'],
    data = DEFAULT_DATA,
    events = DEFAULT_EVENTS,
    periods = [7, 30, 90],
    defaultPeriod = 30,
    format = 'number',
    currency = 'USD',
    class: className = '',
  }: MetricCardProps = $props();

  let period = $state(30);
  $effect.pre(() => { period = defaultPeriod; });

  let focus = $state<number | null>(null);
  let cursor = $state<number | null>(null);
  let range = $state<{ a: number; b: number } | null>(null);

  let currentPathEl: SVGPathElement | null = null;
  let currentDimEl: SVGPathElement | null = null;
  let areaEl: SVGPathElement | null = null;
  let previousPathEl: SVGPathElement | null = null;
  let chartEl: HTMLDivElement | null = null;

  let shownShape: Shape = { current: [], previous: [] };
  let morphRaf = 0;
  let dragAnchor: number | null = null;

  const clipId = `mc-${Math.random().toString(36).slice(2, 7)}`;

  const info = $derived(buildPeriod(data, period, focus));
  const last = $derived(info.current.length - 1);

  const pinned = $derived(
    events
      .map(e => ({ ...e, at: info.current.findIndex(p => p.date === e.date) }))
      .filter(e => e.at >= 0)
  );

  const derived_span = $derived(spanOf(range, cursor, last));
  const span = $derived(derived_span.span);
  const ranged = $derived(derived_span.ranged);
  const read = $derived(readOf(info, span, ranged, period, events));
  const up = $derived(read.delta >= 0);
  const parts = $derived(breakdown(info.current, span, segments.length));

  const formatter = $derived(new Intl.NumberFormat('en-US', {
    style: format === 'currency' ? 'currency' : 'decimal',
    currency,
    maximumFractionDigits: 0,
  }));

  const formatted = $derived(formatter.format(read.value));
  const periodIndex = $derived(Math.max(0, periods.indexOf(period)));

  function xOf(i: number) { return last ? (i / last) * W : W; }
  function pct(i: number) { return (xOf(i) / W) * 100; }

  const litFrom = $derived(ranged && span ? xOf(span.lo) : 0);
  const litTo = $derived(span ? xOf(span.hi) : W);
  const endY = $derived(info.now.length ? yOf(info.norm(info.now[last])) : 0);

  const valueText = $derived(
    ranged ? `${read.caption}: ${formatted}`
    : read.day ? `${fmtDay(read.day.date)}: ${formatted}${read.event ? `, ${read.event.label}` : ''}`
    : `${formatted} verified evidence points`
  );

  $effect(() => {
    const to = info.shape;
    const from = shownShape;
    cancelAnimationFrame(morphRaf);

    const paint = (paths: Paths) => {
      currentPathEl?.setAttribute('d', paths.current);
      currentDimEl?.setAttribute('d', paths.current);
      areaEl?.setAttribute('d', toArea(paths.current));
      previousPathEl?.setAttribute('d', paths.previous);
    };

    const land = () => { shownShape = to; paint(info.paths); };

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!from.current.length || reducedMotion) { land(); return; }

    const start = performance.now();
    const frame = (now: number) => {
      const t = easeInOut(Math.min(1, (now - start) / MORPH_MS));
      const mix = (a: number[], b: number[]) => a.map((v, i) => v + ((b[i] ?? v) - v) * t);
      shownShape = {
        current: mix(from.current, to.current),
        previous: mix(from.previous, to.previous),
      };
      if (t < 1) {
        paint({ current: toPath(shownShape.current), previous: toPath(shownShape.previous) });
        morphRaf = requestAnimationFrame(frame);
      } else {
        land();
      }
    };
    morphRaf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(morphRaf);
  });

  function indexAt(clientX: number): number {
    if (!chartEl) return 0;
    const rect = chartEl.getBoundingClientRect();
    const t = clamp((clientX - rect.left) / rect.width, 0, 1);
    const near = pinned.find(e => Math.abs((e.at / (last || 1) - t) * rect.width) < SNAP_PX);
    return near ? near.at : Math.round(t * last);
  }

  function onPointerDown(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const at = indexAt(e.clientX);
    dragAnchor = at;
    range = null;
    cursor = at;
  }

  function onPointerMove(e: PointerEvent) {
    const at = indexAt(e.clientX);
    if (dragAnchor !== null) {
      const anchor = dragAnchor;
      range = (range || at !== anchor) ? { a: anchor, b: at } : null;
      cursor = at;
    } else if (e.pointerType === 'mouse' && !range) {
      cursor = at;
    }
  }

  function onRelease(e: PointerEvent) {
    dragAnchor = null;
    if (e.pointerType !== 'mouse') cursor = null;
  }

  function clearRead() { range = null; cursor = null; }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') { clearRead(); return; }
    const move = KEY_MOVES[e.key];
    if (move === undefined) return;
    e.preventDefault();
    const from = range ? range.b : (cursor ?? last);
    const to = clamp(from + move, 0, last);
    if (e.shiftKey) { range = { a: range ? range.a : from, b: to }; }
    else { range = null; }
    cursor = to;
  }

  function choosePeriod(days: number) { clearRead(); period = days; }
  function chooseSegment(i: number) { focus = focus === i ? null : i; }

  function digitChars(value: string) {
    const chars = value.split('');
    return chars.map((ch, i) => ({ ch, isDigit: DIGIT_RE.test(ch), key: `${chars.length - i}` }));
  }
</script>

<div class={cn(
  'w-full select-none rounded-none border border-border bg-surface-raised p-5 text-ink',
  className
)}>
  {#if badge || telemetry || title}
    <div class="flex items-center justify-between gap-4 border-b border-border pb-3">
      <div class="flex min-w-0 items-center gap-2">
        {#if badge}
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-brand/30 bg-brand-subtle px-2 py-0.5 font-mono text-[11px] font-medium tracking-tight text-brand">
            <span class="size-1.5 rounded-none bg-brand"></span>
            {badge}
          </span>
        {/if}
        {#if telemetry}
          <span class="hidden truncate font-mono text-[11px] text-ink-muted sm:inline">
            {telemetry}
          </span>
        {/if}
      </div>

      <div class="relative flex shrink-0 rounded-sm bg-surface-subtle p-0.5 text-xs">
        <span
          aria-hidden="true"
          class="absolute top-0.5 bottom-0.5 left-0.5 w-10 rounded-xs bg-surface-raised shadow-2xs transition-transform duration-200 motion-reduce:transition-none"
          style="transform: translateX({periodIndex * 100}%);"
        ></span>
        {#each periods as days}
          <button
            type="button"
            aria-pressed={days === period}
            onclick={() => choosePeriod(days)}
            class={cn(
              'relative min-h-8 w-10 rounded-xs py-1 font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors duration-200 cursor-pointer',
              days === period
                ? 'text-ink font-semibold'
                : 'text-ink-muted hover:text-ink'
            )}
          >{days}D</button>
        {/each}
      </div>
    </div>

    {#if title}
      <div class="mt-3">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-base font-semibold tracking-tight text-ink">
            {title}
          </h3>
          {#if focus !== null}
            <span class="rounded-sm bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-ink-secondary">
              {segments[focus]}
            </span>
          {/if}
        </div>
        {#if description}
          <p class="mt-1 text-xs leading-relaxed text-ink-secondary">
            {description}
          </p>
        {/if}
      </div>
    {:else if label}
      <p class="mt-3 truncate text-sm text-ink-secondary">
        {label}
        {#if focus !== null}
          <span class="text-ink"> · {segments[focus]}</span>
        {/if}
      </p>
    {/if}
  {:else}
    <div class="flex items-center justify-between gap-4">
      <p class="truncate text-sm text-ink-secondary">
        {label}
        {#if focus !== null}
          <span class="text-ink"> · {segments[focus]}</span>
        {/if}
      </p>

      <div class="relative flex shrink-0 rounded-sm bg-surface-subtle p-0.5 text-xs">
        <span
          aria-hidden="true"
          class="absolute top-0.5 bottom-0.5 left-0.5 w-10 rounded-xs bg-surface-raised shadow-2xs transition-transform duration-200 motion-reduce:transition-none"
          style="transform: translateX({periodIndex * 100}%);"
        ></span>
        {#each periods as days}
          <button
            type="button"
            aria-pressed={days === period}
            onclick={() => choosePeriod(days)}
            class={cn(
              'relative min-h-8 w-10 rounded-xs py-1 font-medium tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors duration-200 cursor-pointer',
              days === period
                ? 'text-ink font-semibold'
                : 'text-ink-muted hover:text-ink'
            )}
          >{days}D</button>
        {/each}
      </div>
    </div>
  {/if}

  <p class="mt-3 font-semibold text-3xl tracking-tight text-ink sm:text-4xl">
    <span class="sr-only">{formatted}</span>
    <span aria-hidden="true" class="inline-flex tabular-nums">
      {#each digitChars(formatted) as { ch, isDigit, key } (key)}
        {#if isDigit}
          <span class="relative inline-block h-[1em] overflow-hidden leading-none">
            <span class="invisible">0</span>
            <span
              class="absolute inset-x-0 top-0 flex flex-col transition-transform duration-200 ease-out motion-reduce:transition-none"
              style="transform: translateY(-{Number(ch) * 10}%);"
            >
              {#each DIGITS as d (d)}<span class="block h-[1em] leading-none">{d}</span>{/each}
            </span>
          </span>
        {:else}
          <span>{ch}</span>
        {/if}
      {/each}
    </span>
  </p>

  <div class="mt-2 flex min-h-5 items-center gap-2 text-xs tabular-nums">
    <span class={cn('shrink-0 font-mono font-medium', up ? 'text-brand' : 'text-critical')}>
      {up ? 'Consistent growth' : 'Consolidating'}
    </span>
    <span aria-live="polite" class="truncate text-ink-secondary">
      · {read.caption}{#if read.event}<span class="text-brand font-medium"> · {read.event.label}</span>{/if}
    </span>
    {#if ranged}
      <button
        type="button"
        onclick={clearRead}
        class="ml-auto shrink-0 rounded-sm px-2 py-1 text-xs text-ink-secondary outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors duration-150 hover:bg-surface-subtle hover:text-ink cursor-pointer"
      >Clear</button>
    {/if}
  </div>

  <div
    bind:this={chartEl}
    role="slider"
    tabindex="0"
    aria-label="{label} over the last {period} days. Arrow keys read each day; hold Shift to select a range."
    aria-valuemin={1}
    aria-valuemax={info.current.length}
    aria-valuenow={span ? span.hi + 1 : info.current.length}
    aria-valuetext={valueText}
    class="relative mt-4 h-32 cursor-crosshair touch-pan-y rounded-none outline-none focus-visible:ring-2 focus-visible:ring-brand"
    onblur={() => (cursor = null)}
    onkeydown={onKeyDown}
    onlostpointercapture={onRelease}
    onpointercancel={onRelease}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerleave={() => { if (dragAnchor === null && !range) cursor = null; }}
    onpointerup={onRelease}
  >
    <svg
      aria-hidden="true"
      class="absolute inset-0 h-full w-full overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 {W} {H}"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={litFrom} y={-10} width={Math.max(0, litTo - litFrom)} height={H + 20} />
        </clipPath>
      </defs>

      <line class="stroke-border" vector-effect="non-scaling-stroke"
        x1={0} x2={W} y1={H - 0.5} y2={H - 0.5} />

      <path bind:this={previousPathEl}
        class="fill-none stroke-ink-muted/40"
        d={info.paths.previous}
        stroke-dasharray="3 4" stroke-width={1.25} vector-effect="non-scaling-stroke" />

      <path bind:this={areaEl}
        class="fill-brand/10"
        clip-path="url(#{clipId})"
        d={toArea(info.paths.current)} />

      <path bind:this={currentDimEl}
        class="fill-none stroke-brand/30"
        d={info.paths.current}
        stroke-linecap="square" stroke-width={2} vector-effect="non-scaling-stroke" />

      <path bind:this={currentPathEl}
        class="fill-none stroke-brand"
        clip-path="url(#{clipId})"
        d={info.paths.current}
        stroke-linecap="square" stroke-width={2} vector-effect="non-scaling-stroke" />
    </svg>

    {#each pinned as e (e.date)}
      <div aria-hidden="true" class="pointer-events-none absolute top-0 bottom-0 w-px -translate-x-1/2" style="left: {pct(e.at)}%;">
        <div class="absolute inset-y-0 left-0 border-l border-dashed border-attention/50"></div>
        <div class="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-none bg-attention ring-2 ring-surface-raised"></div>
      </div>
    {/each}

    {#if ranged && span}
      {#each [span.lo, span.hi] as i (i)}
        <div aria-hidden="true" class="pointer-events-none absolute top-0 bottom-0 w-px bg-border-strong" style="left: {pct(i)}%;"></div>
      {/each}
    {/if}

    {#if read.day && span}
      <div aria-hidden="true" class="pointer-events-none absolute top-0 bottom-0 w-px bg-border" style="left: {pct(span.lo)}%;"></div>
      {#if read.twin}
        <div aria-hidden="true"
          class="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-none border border-border-strong bg-surface-raised"
          style="left: {pct(span.lo)}%; top: {(yOf(info.norm(info.before[span.lo])) / H) * 100}%;"></div>
      {/if}
      <div aria-hidden="true"
        class="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-none bg-brand ring-4 ring-surface-raised"
        style="left: {pct(span.lo)}%; top: {(yOf(info.norm(info.now[span.lo])) / H) * 100}%;"></div>
    {/if}

    <div aria-hidden="true"
      class={cn(
        'pointer-events-none absolute right-0 size-2 translate-x-1/2 -translate-y-1/2 rounded-none bg-brand ring-4 ring-surface-raised transition-[top,opacity] duration-200 motion-reduce:transition-none',
        span ? 'opacity-0' : 'opacity-100'
      )}
      style="top: {(endY / H) * 100}%;"></div>
  </div>

  <div class="mt-2 flex justify-between text-xs text-ink-muted tabular-nums">
    <span>{info.current[0] ? fmtShort(info.current[0].date) : ''}</span>
    <span class="flex items-center gap-2">
      <span class="h-px w-3 border-t border-dashed border-ink-muted/50"></span>
      Prior window
    </span>
    <span>{info.current.at(-1) ? fmtShort(info.current.at(-1)!.date) : ''}</span>
  </div>

  <div class="mt-4 border-t border-border pt-4">
    <div aria-hidden="true" class="flex h-1.5 gap-0.5">
      {#each segments as name, i (name)}
        {@const sw = SWATCHES[focus === i ? 0 : i % SWATCHES.length]}
        <span
          class={cn('min-w-0 rounded-none transition-[flex-grow,opacity] duration-200 motion-reduce:transition-none', sw, focus !== null && focus !== i && 'opacity-25')}
          style="flex-grow: {parts[i] ?? 0};"
        ></span>
      {/each}
    </div>

    <ul class="-mx-2 mt-3">
      {#each segments as name, i (name)}
        {@const sw = SWATCHES[focus === i ? 0 : i % SWATCHES.length]}
        <li>
          <button
            type="button"
            aria-label={focus === i ? `Show all of ${label}` : `Filter by ${name}`}
            aria-pressed={focus === i}
            onclick={() => chooseSegment(i)}
            class={cn(
              'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors duration-150 hover:bg-surface-subtle cursor-pointer',
              focus === i && 'bg-surface-subtle font-semibold',
              focus !== null && focus !== i && 'opacity-50'
            )}
          >
            <span class={cn('size-2 shrink-0 rounded-none', sw)}></span>
            <span class="flex-1 truncate text-ink-secondary">{name}</span>
            <span class="font-mono font-medium text-ink tabular-nums">{formatter.format(parts[i] ?? 0)}</span>
          </button>
        </li>
      {/each}
    </ul>
  </div>
</div>
