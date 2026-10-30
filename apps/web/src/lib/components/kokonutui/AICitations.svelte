<script lang="ts">
  /**
   * AI Inline Citations (Pure Svelte 5 Runes port of @kokonutui/ai-citations)
   * Adapted to CREED OS WAY 2.1: 4px controls/popovers, semantic OKLCH tokens,
   * 140ms-200ms Lagom motion contract, and Evidence-Before-Inference provenance.
   */
  import { onMount } from 'svelte';
  import { ArrowUpRight, ChevronDown, ShieldCheck } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  export interface CitationSource {
    id: string;
    title: string;
    url: string;
    site?: string;
    snippet?: string;
  }

  export interface AnswerPart {
    text: string;
    cite?: string[];
  }

  export interface AICitationsProps {
    parts?: AnswerPart[];
    sources?: CitationSource[];
    class?: string;
  }

  const CARD_WIDTH = 304;
  const OPEN_DELAY_MS = 100;
  const CLOSE_DELAY_MS = 90;
  const WARM_MS = 360;
  const WWW = /^www\./;

  const DEMO_SOURCES: CitationSource[] = [
    {
      id: 'hydraulic-arm',
      title: 'Hydraulic Arm Load & Ratio Rubric',
      url: '/platform#evidence',
      site: 'Maker Lab',
      snippet:
        'Verified proportional force transfer across three syringe bore ratios and documented joint stability before final assembly.'
    },
    {
      id: 'ratio-check',
      title: 'Proportional Reasoning Concept Check',
      url: '/platform#cat',
      site: 'Concept Check',
      snippet:
        'Consistent multi-step rate and cross-sectional area reasoning demonstrated across six adaptive calibration items.'
    },
    {
      id: 'socratic-log',
      title: 'Guided Socratic Reflection Transcript',
      url: '/about#mentorship',
      site: 'Voice Mentor',
      snippet:
        'Articulated independently why doubling cylinder diameter quadruples piston area after two open-ended Socratic prompts.'
    }
  ];

  const DEMO_PARTS: AnswerPart[] = [
    { text: 'Aarav demonstrates a ' },
    {
      text: 'strong foundation in proportional systems and mechanical force transfer, translating physical syringe-ratio experiments into accurate mathematical predictions.',
      cite: ['hydraulic-arm', 'ratio-check']
    },
    { text: ' During guided voice reflection, he ' },
    {
      text: 'connected cylinder diameter changes to quadratic area scaling in his own words without receiving direct hints.',
      cite: ['socratic-log']
    },
    { text: ' Recommended next step: ' },
    {
      text: '20-minute Buoyancy & Fluid Pressure studio mission to extend ratio reasoning into 3D volume constraints.',
      cite: ['hydraulic-arm']
    }
  ];

  const hostOf = (url: string) => {
    if (url.startsWith('/')) return 'CREED Provenance';
    try {
      return new URL(url).hostname.replace(WWW, '');
    } catch {
      return url;
    }
  };

  const siteOf = (source: CitationSource) => source.site ?? hostOf(source.url);

  interface Preview {
    part: number;
    x: number;
    y: number;
  }

  let {
    parts = DEMO_PARTS,
    sources = DEMO_SOURCES,
    class: className = ''
  }: AICitationsProps = $props();

  let rootEl = $state<HTMLDivElement | null>(null);
  let preview = $state<Preview | null>(null);
  let warm = $state(false);
  let hoveredSource = $state<string | null>(null);
  let listOpen = $state(false);

  let openTimer: ReturnType<typeof setTimeout> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let lastClosed = 0;

  const uid = `cite-${Math.random().toString(36).slice(2, 8)}`;
  const previewId = `${uid}-preview`;
  const listId = `${uid}-list`;

  const byId = $derived(new Map(sources.map((s) => [s.id, s])));

  const order = $derived.by(() => {
    const acc: string[] = [];
    for (const part of parts) {
      for (const id of part.cite ?? []) {
        if (!acc.includes(id) && byId.has(id)) {
          acc.push(id);
        }
      }
    }
    return acc;
  });

  const cited = $derived(
    order
      .map((id) => byId.get(id))
      .filter((s): s is CitationSource => Boolean(s))
  );

  const active = $derived(preview ? parts[preview.part] : null);
  const activeSources = $derived(
    (active?.cite ?? [])
      .map((id) => byId.get(id))
      .filter((s): s is CitationSource => Boolean(s))
  );

  function clearTimers() {
    if (openTimer) clearTimeout(openTimer);
    if (closeTimer) clearTimeout(closeTimer);
    openTimer = null;
    closeTimer = null;
  }

  function show(next: Preview, immediate = false) {
    clearTimers();
    const isWarm = preview !== null || Date.now() - lastClosed < WARM_MS;
    if (immediate || isWarm) {
      warm = preview !== null;
      preview = next;
      return;
    }
    openTimer = setTimeout(() => {
      warm = false;
      preview = next;
    }, OPEN_DELAY_MS);
  }

  function hide(immediate = false) {
    clearTimers();
    const close = () => {
      lastClosed = Date.now();
      preview = null;
    };
    if (immediate) {
      close();
      return;
    }
    closeTimer = setTimeout(close, CLOSE_DELAY_MS);
  }

  function place(index: number, chip: HTMLElement): Preview {
    const root = rootEl?.getBoundingClientRect();
    const rect = chip.getBoundingClientRect();
    const width = Math.min(CARD_WIDTH, root?.width ?? CARD_WIDTH);
    const left = rect.left - (root?.left ?? 0) + rect.width / 2 - width / 2;
    const max = (root?.width ?? width) - width;
    return {
      part: index,
      x: Math.min(Math.max(0, left), Math.max(0, max)),
      y: rect.top - (root?.top ?? 0) - 8
    };
  }

  $effect(() => {
    if (!preview) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Element && event.target.closest('[data-citation-chip]'))) {
        hide(true);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  });

  onMount(() => {
    return () => clearTimers();
  });
</script>

<div bind:this={rootEl} class={cn('relative w-full', className)}>
  <div class="mb-3 flex items-center justify-between gap-2 border-b border-border pb-2">
    <div class="flex items-center gap-2">
      <span class="inline-flex items-center gap-1 rounded-sm border border-ai/30 bg-ai-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-ai">
        <ShieldCheck class="size-3" />
        Evidence-Backed Narrative
      </span>
      <span class="font-mono text-xs text-ink-muted">Hover or focus any chip</span>
    </div>
    <span class="hidden font-mono text-[11px] text-ink-muted sm:inline">Zero Hallucinated Claims</span>
  </div>

  <p class="text-sm leading-7 text-ink sm:text-[15px]">
    {#each parts as part, index}
      {@const partSources = (part.cite ?? [])
        .map((id) => byId.get(id))
        .filter((s): s is CitationSource => Boolean(s))}
      {#if partSources.length === 0}
        <span>{part.text}</span>
      {:else}
        {@const first = partSources[0]}
        {@const isActive = preview?.part === index}
        {@const isLinked = partSources.some((s) => s.id === hoveredSource)}
        <span>
          <span
            class={cn(
              'rounded-xs decoration-1 underline-offset-4 transition-colors duration-150 motion-reduce:transition-none',
              isActive || isLinked
                ? 'bg-brand-subtle text-ink underline decoration-brand'
                : 'bg-transparent underline decoration-transparent'
            )}
          >{part.text}</span>{' '}
          <button
            type="button"
            data-citation-chip=""
            aria-describedby={isActive ? previewId : undefined}
            aria-label={`Evidence sources: ${partSources.map(siteOf).join(', ')}`}
            onclick={(e) => show(place(index, e.currentTarget), true)}
            onfocus={(e) => show(place(index, e.currentTarget), true)}
            onblur={() => hide(true)}
            onpointerenter={(e) => {
              if (e.pointerType === 'mouse') show(place(index, e.currentTarget));
            }}
            onpointerleave={(e) => {
              if (e.pointerType === 'mouse') hide();
            }}
            class={cn(
              'inline-flex min-h-6 -translate-y-px items-center gap-1 rounded-sm border px-1.5 py-0.5 align-middle font-mono text-[11px] font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand cursor-pointer motion-reduce:transition-none',
              isActive || isLinked
                ? 'border-brand bg-brand text-brand-foreground'
                : 'border-border bg-surface-subtle text-ink-secondary hover:border-brand/50 hover:text-ink'
            )}
          >
            <span
              aria-hidden="true"
              class={cn(
                'flex size-3.5 shrink-0 items-center justify-center rounded-xs font-mono text-[9px] font-semibold uppercase',
                isActive || isLinked
                  ? 'bg-brand-foreground/20 text-brand-foreground'
                  : 'bg-surface-raised text-brand'
              )}
            >
              {order.indexOf(first.id) + 1}
            </span>
            <span>{siteOf(first)}</span>
            {#if partSources.length > 1}
              <span class="opacity-75">+{partSources.length - 1}</span>
            {/if}
          </button>
        </span>
      {/if}
    {/each}
  </p>

  {#if preview && activeSources.length > 0}
    <div
      id={previewId}
      role="tooltip"
      class={cn(
        'pointer-events-none absolute top-0 left-0 z-30 motion-reduce:transition-none',
        warm ? 'transition-[transform,opacity] duration-200 ease-out' : 'transition-opacity duration-150 ease-out'
      )}
      style="transform: translate3d({preview.x}px, {preview.y}px, 0); width: {Math.min(CARD_WIDTH, rootEl?.offsetWidth ?? CARD_WIDTH)}px;"
    >
      <div class="origin-bottom -translate-y-full rounded-sm border border-border bg-surface-overlay p-1 shadow-md">
        {#each activeSources as source (source.id)}
          <div class="rounded-xs p-3">
            <div class="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
              <span class="flex size-4 shrink-0 items-center justify-center rounded-xs bg-brand-subtle font-semibold text-[10px] text-brand">
                {order.indexOf(source.id) + 1}
              </span>
              <span class="truncate">{siteOf(source)} · {hostOf(source.url)}</span>
            </div>
            <p class="mt-1 font-semibold text-xs text-ink leading-snug">
              {source.title}
            </p>
            {#if source.snippet}
              <p class="mt-1 line-clamp-3 text-xs text-ink-secondary leading-relaxed">
                {source.snippet}
              </p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if cited.length > 0}
    <div class="mt-4 border-t border-border pt-3">
      <button
        type="button"
        aria-controls={listId}
        aria-expanded={listOpen}
        onclick={() => (listOpen = !listOpen)}
        class="inline-flex min-h-9 items-center gap-2 rounded-sm border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-ink-secondary outline-none transition-colors duration-150 hover:border-brand/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
      >
        <span class="flex items-center gap-1">
          {#each cited.slice(0, 4) as source (source.id)}
            <span class="flex size-4 items-center justify-center rounded-xs bg-brand-subtle font-mono text-[10px] font-semibold text-brand">
              {siteOf(source).charAt(0)}
            </span>
          {/each}
        </span>
        <span>{cited.length} verified evidence artifacts</span>
        <ChevronDown
          aria-hidden="true"
          class={cn(
            'size-3.5 text-ink-muted transition-transform duration-200 motion-reduce:transition-none',
            listOpen && 'rotate-180'
          )}
        />
      </button>

      {#if listOpen}
        <ol id={listId} class="mt-2 space-y-1">
          {#each cited as source, index (source.id)}
            <li>
              <a
                href={source.url}
                onblur={() => (hoveredSource = null)}
                onfocus={() => (hoveredSource = source.id)}
                onpointerenter={() => (hoveredSource = source.id)}
                onpointerleave={() => (hoveredSource = null)}
                class="group/source flex min-h-10 items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none transition-colors duration-150 hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span class="w-4 shrink-0 font-mono text-xs text-brand tabular-nums font-semibold">
                  [{index + 1}]
                </span>
                <span class="min-w-0 flex-1 truncate font-medium text-ink">
                  {source.title}
                </span>
                <span class="hidden shrink-0 font-mono text-[11px] text-ink-muted sm:inline">
                  {siteOf(source)}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  class="size-3.5 shrink-0 text-ink-muted transition-colors duration-150 group-hover/source:text-brand"
                />
              </a>
            </li>
          {/each}
        </ol>
      {/if}
    </div>
  {/if}
</div>
