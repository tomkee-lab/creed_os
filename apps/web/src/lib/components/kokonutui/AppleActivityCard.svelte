<script lang="ts">
  /**
   * @description: Apple Activity Card (Svelte 5 port)
   * @adaptation: Ported from Kokonut UI (React/Motion) to pure Svelte 5 Runes.
   * Features: SVG concentric rings, multi-lap overflow with shadowed end-caps,
   * count-up telemetry, goal pulse animations, and bidirectional focus dimming.
   */
  import { onMount, onDestroy } from 'svelte';
  import { cn } from '$lib/utils';

  export interface ActivityData {
    label: string;
    color: string;
    colorEnd: string;
    size: number;
    /** Can go past `target`: the ring keeps going for another lap. */
    current: number;
    target: number;
    unit: string;
  }

  export interface AppleActivityCardProps {
    title?: string;
    badge?: string;
    description?: string;
    activities?: ActivityData[];
    class?: string;
    compact?: boolean;
  }

  const STROKE = 16;
  const STAGGER = 0.18; // Seconds between rings
  const DRAW_S = 1.2;
  const OVER_S = 0.6;
  const MAX_LAPS = 3;

  // Cubic-bezier solver for Apple/Kokonut ease-out: [0.23, 1, 0.32, 1]
  function solveCubicBezier(x1: number, y1: number, x2: number, y2: number) {
    return function (t: number): number {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      let u = t;
      for (let i = 0; i < 8; i++) {
        const currentX = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
        const currentSlope = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
        if (Math.abs(currentX - t) < 1e-5) break;
        if (Math.abs(currentSlope) < 1e-6) break;
        u -= (currentX - t) / currentSlope;
      }
      return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
    };
  }
  const easeOut = solveCubicBezier(0.23, 1, 0.32, 1);

  // CREED OS default family growth metrics
  const DEFAULT_ACTIVITIES: ActivityData[] = [
    {
      label: 'FOUNDATION',
      color: 'var(--brand)',
      colorEnd: 'var(--brand-hover)',
      size: 184,
      current: 18,
      target: 24,
      unit: 'COMPETENCIES',
    },
    {
      label: 'INQUIRY',
      color: 'var(--cyan)',
      colorEnd: 'var(--cyan)',
      size: 144,
      current: 42,
      target: 30,
      unit: 'MIN',
    },
    {
      label: 'PROJECTS',
      color: 'var(--orange)',
      colorEnd: 'var(--yellow)',
      size: 104,
      current: 5,
      target: 6,
      unit: 'ARTIFACTS',
    },
  ];

  const ratioOf = (data: ActivityData) =>
    data.target > 0 ? Math.min(Math.max(data.current / data.target, 0), MAX_LAPS) : 0;

  const drawSeconds = (ratio: number) =>
    DRAW_S + OVER_S * Math.min(Math.max(ratio - 1, 0), 1);

  let {
    title,
    badge,
    description,
    activities = DEFAULT_ACTIVITIES,
    class: className = '',
    compact = false,
  }: AppleActivityCardProps = $props();

  const strokeWidth = $derived(compact ? 12 : 16);
  const uid = Math.random().toString(36).slice(2, 8);
  const boxSize = $derived(activities.length ? Math.max(...activities.map((a) => a.size)) : 200);

  let containerEl = $state<HTMLDivElement | null>(null);
  let inView = $state(false);
  let active = $state<number | null>(null);

  // DOM node references for imperative SVG manipulation
  interface RingRefs {
    base: SVGCircleElement | null;
    lap: SVGCircleElement | null;
    cap: SVGGElement | null;
    pulse: SVGCircleElement | null;
    count: HTMLSpanElement | null;
  }

  let ringRefs: RingRefs[] = [];
  function ensureRingRef(i: number) {
    if (!ringRefs[i]) {
      ringRefs[i] = { base: null, lap: null, cap: null, pulse: null, count: null };
    }
  }

  function registerBase(node: SVGCircleElement, index: number) {
    ensureRingRef(index);
    ringRefs[index].base = node;
  }
  function registerLap(node: SVGCircleElement, index: number) {
    ensureRingRef(index);
    ringRefs[index].lap = node;
  }
  function registerCap(node: SVGGElement, index: number) {
    ensureRingRef(index);
    ringRefs[index].cap = node;
  }
  function registerPulse(node: SVGCircleElement, index: number) {
    ensureRingRef(index);
    ringRefs[index].pulse = node;
  }
  function registerCount(node: HTMLSpanElement, index: number) {
    ensureRingRef(index);
    ringRefs[index].count = node;
  }

  let rafIds: number[] = [];

  function paintRing(
    nodes: RingRefs,
    data: Pick<ActivityData, 'size' | 'current'>,
    p: number,
    ratio: number
  ) {
    const curStroke = compact ? 12 : 16;
    const radius = (data.size - curStroke) / 2;
    const circumference = radius * 2 * Math.PI;
    if (nodes.base) {
      nodes.base.style.strokeDashoffset = `${(1 - Math.min(p, 1)) * circumference}`;
    }
    const over = p > 1;
    const rest = over ? p - Math.floor(p) || 1 : 0;
    if (nodes.lap) {
      nodes.lap.style.strokeDashoffset = `${(1 - rest) * circumference}`;
      nodes.lap.style.opacity = over ? '1' : '0';
    }
    if (nodes.cap) {
      nodes.cap.style.transform = `rotate(${rest * 360}deg)`;
      nodes.cap.style.opacity = over ? '1' : '0';
    }
    if (nodes.count) {
      nodes.count.textContent =
        p >= ratio ? `${data.current}` : `${Math.round((p / ratio) * data.current)}`;
    }
  }

  function startAnimations() {
    // Check reduced motion preference
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    activities.forEach((activity, index) => {
      const nodes = ringRefs[index];
      if (!nodes) return;
      const ratio = ratioOf(activity);

      if (prefersReduced || ratio === 0) {
        paintRing(nodes, activity, ratio, ratio);
        return;
      }

      // First draw: initialize to zero
      paintRing(nodes, activity, 0, ratio);

      const duration = drawSeconds(ratio) * 1000;
      const delay = index * STAGGER * 1000;
      let startTime: number | null = null;
      let pulsed = false;

      function step(now: number) {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;

        if (elapsed < delay) {
          rafIds[index] = requestAnimationFrame(step);
          return;
        }

        const progress = Math.min((elapsed - delay) / duration, 1);
        const eased = easeOut(progress);
        const currentP = eased * ratio;

        paintRing(nodes, activity, currentP, ratio);

        // Pulse goal cap when crossing 100%
        if (!pulsed && currentP >= 1) {
          pulsed = true;
          nodes.pulse?.animate(
            [
              { transform: 'scale(1)', opacity: 0.6 },
              { transform: 'scale(2.4)', opacity: 0 },
            ],
            { duration: 560, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
          );
        }

        if (progress < 1) {
          rafIds[index] = requestAnimationFrame(step);
        } else {
          paintRing(nodes, activity, ratio, ratio);
        }
      }

      rafIds[index] = requestAnimationFrame(step);
    });
  }

  onMount(() => {
    if (!containerEl) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !inView) {
          inView = true;
          startAnimations();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(containerEl);

    return () => {
      observer.disconnect();
      rafIds.forEach((id) => cancelAnimationFrame(id));
    };
  });

  onDestroy(() => {
    rafIds.forEach((id) => cancelAnimationFrame(id));
  });
</script>

<div
  bind:this={containerEl}
  class={cn(
    'relative flex w-full flex-col justify-between select-none text-ink',
    className
  )}
>
  <!-- Card Header -->
  {#if badge || title}
    <div class="flex items-center justify-between gap-4 border-b border-border pb-3">
      <div class="flex items-center gap-2">
        {#if badge}
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-brand/30 bg-brand-subtle px-2 py-0.5 font-mono text-[11px] font-medium tracking-tight text-brand">
            <span class="size-1.5 rounded-none bg-brand"></span>
            {badge}
          </span>
        {/if}
        {#if title}
          <h3 class="truncate text-sm font-semibold tracking-tight text-ink">
            {title}
          </h3>
        {/if}
      </div>
      <span class="font-mono text-[11px] text-ink-muted">
        Weekly Rhythm
      </span>
    </div>
  {/if}

  {#if description}
    <p class="mt-2 text-xs leading-relaxed text-ink-secondary">
      {description}
    </p>
  {/if}

  <!-- Rings Visual Zone & Detailed Legend -->
  <div class="mt-3 flex flex-col items-center justify-around gap-4 sm:flex-row">
    <!-- SVG Activity Rings -->
    <div
      class="relative shrink-0"
      style="width: {boxSize}px; height: {boxSize}px;"
    >
      {#each activities as activity, index (activity.label)}
        {@const curStroke = compact ? 12 : 16}
        {@const radius = (activity.size - curStroke) / 2}
        {@const circumference = radius * 2 * Math.PI}
        {@const center = activity.size / 2}
        {@const ratio = ratioOf(activity)}
        {@const progressLabel = `${activity.label}: ${activity.current} of ${activity.target} ${activity.unit}`}
        {@const gradId = `${uid}-grad-${index}`}
        {@const shadowId = `${uid}-shadow-${index}`}

        <div
          class={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200',
            inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <svg
            aria-label={progressLabel}
            tabindex="0"
            role="img"
            width={activity.size}
            height={activity.size}
            viewBox="0 0 {activity.size} {activity.size}"
            onblur={() => (active = null)}
            onfocus={() => (active = index)}
            class={cn(
              '-rotate-90 overflow-visible rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand transition-opacity duration-200 ease-out',
              active !== null && active !== index && 'opacity-25'
            )}
            style="--ring: {activity.color}; --ring-end: {activity.colorEnd};"
          >
            <title>{progressLabel}</title>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="var(--ring)" />
                <stop offset="100%" stop-color="var(--ring-end)" />
              </linearGradient>
              <filter id={shadowId} width="300%" height="300%" x="-100%" y="-100%">
                <feDropShadow
                  dx="0"
                  dy="-2.5"
                  flood-color="#000"
                  flood-opacity="0.45"
                  stdDeviation="2"
                />
              </filter>
            </defs>

            <!-- Background Track -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              stroke-width={curStroke}
              pointer-events="stroke"
              class="text-neutral-200/50 dark:text-neutral-800/60 transition-colors"
              onpointerenter={(e) => {
                if (e.pointerType === 'mouse') active = index;
              }}
              onpointerleave={() => (active = null)}
            />

            <!-- Base Ring -->
            <circle
              use:registerBase={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#{gradId})"
              stroke-width={curStroke}
              stroke-linecap="round"
              stroke-dasharray={circumference}
              stroke-dashoffset={circumference}
              pointer-events="none"
            />

            <!-- Multi-Lap Overflow Ring -->
            <circle
              use:registerLap={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--ring-end)"
              stroke-width={curStroke}
              stroke-linecap="round"
              stroke-dasharray={circumference}
              stroke-dashoffset={circumference}
              pointer-events="none"
              style="opacity: 0;"
            />

            <!-- End Cap with Drop Shadow -->
            <g
              use:registerCap={index}
              pointer-events="none"
              style="opacity: 0; transform-box: view-box; transform-origin: center;"
            >
              <circle
                cx={center + radius}
                cy={center}
                r={curStroke / 2}
                fill="var(--ring-end)"
                filter="url(#{shadowId})"
              />
            </g>

            <!-- Goal Pulse Indicator -->
            <circle
              use:registerPulse={index}
              cx={center + radius}
              cy={center}
              r={curStroke / 2}
              fill="none"
              stroke="var(--ring-end)"
              stroke-width={2}
              pointer-events="none"
              style="opacity: 0; transform-box: fill-box; transform-origin: center;"
            />
          </svg>
        </div>
      {/each}
    </div>

    <!-- Telemetry Legend & Count-Up Readouts -->
    <ul class="flex flex-col gap-4">
      {#each activities as activity, index (activity.label)}
        <li
          class={cn(
            'flex flex-col transition-opacity duration-200 cursor-pointer',
            active !== null && active !== index && 'opacity-40'
          )}
          onpointerenter={(e) => {
            if (e.pointerType === 'mouse') active = index;
          }}
          onpointerleave={() => (active = null)}
        >
          <div class="flex items-center gap-1.5">
            <span
              class="size-2 rounded-xs shrink-0"
              style="background-color: {activity.color};"
            ></span>
            <span class="font-mono text-xs font-medium text-ink-secondary">
              {activity.label}
            </span>
          </div>

          <div class="mt-0.5 flex items-baseline gap-1 font-semibold text-lg tabular-nums tracking-tight">
            <span
              use:registerCount={index}
              style="color: {activity.color};"
            >
              {activity.current}
            </span>
            <span class="text-xs font-normal text-ink-muted">
              /{activity.target}
            </span>
            <span class="text-[11px] font-mono font-medium text-ink-muted">
              {activity.unit}
            </span>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>
