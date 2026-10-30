<!--
  @component MorphicNavbar (Split Nav)
  Kokonut UI Port for CREED OS (Svelte 5 Runes)
  Original Author: @dorianbaffier (https://kokonutui.com/docs/navigation/morphic-navbar)
  Svelte 5 Adaptation: CREED OS Engineering
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { cn } from '$lib/utils';
  import { isReducedMotion } from '$lib/motion/scroll.js';

  export interface NavItem {
    name: string;
    icon?: any;
    [key: string]: any;
  }

  interface Props {
    /** Links keyed by their href, in display order. */
    items?: Record<string, NavItem>;
    /**
     * Initially active path. Defaults to the first item's path. When an item's
     * path matches the current route, that item is active instead.
     */
    defaultPath?: string;
    /**
     * After 80px of page scroll, fold the bar down to the active link plus a
     * chevron that opens it again.
     */
    compact?: boolean;
    class?: string;
    indicatorClass?: string;
    onselect?: (path: string, item: NavItem) => void;
  }

  let {
    items = {
      '#home': { name: 'Home' },
      '#work': { name: 'Work' },
      '#notes': { name: 'Notes' },
      '#blog': { name: 'Blog' },
      '#about': { name: 'About' }
    },
    defaultPath,
    compact = false,
    class: className = '',
    indicatorClass = 'bg-brand',
    onselect
  }: Props = $props();

  // Mechanical Constants
  const SPLIT = 8;
  const HOVER_SPLIT = 2;
  const DRAG_SLOP = 4;
  const PROJECTION = 0.16;
  const VELOCITY_WINDOW = 90;
  const COMPACT_AFTER = 80;
  const CHEVRON_SIZE = 36;
  const CHEVRON_GAP = 4;

  const round2 = (v: number) => Math.round(v * 100) / 100;
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const matchesPath = (path: string, current: string) =>
    path === current || (path !== '/' && current.startsWith(`${path}/`));

  const findItemPath = (paths: string[], current: string | null) => {
    let match: string | undefined;
    for (const path of paths) {
      if (current && matchesPath(path, current) && (!match || path.length > match.length)) {
        match = path;
      }
    }
    return match;
  };

  const bump = (focus: number, k: number) => Math.max(0, 1 - Math.abs(focus - k));

  const splitOffsets = (count: number, focus: number, hover: number | null) => {
    const cumulative = [0];
    let total = 0;
    for (let joint = 0; joint < count - 1; joint++) {
      let gap = SPLIT * Math.max(bump(focus, joint), bump(focus, joint + 1));
      const hoverJoint =
        hover !== null &&
        hover !== Math.round(focus) &&
        (joint === hover - 1 || joint === hover);
      if (hoverJoint) {
        gap = Math.max(gap, HOVER_SPLIT);
      }
      total += gap;
      cumulative.push(total);
    }
    return cumulative.map((x) => round2(x - total / 2));
  };

  interface BarLayout {
    centers: number[];
    widths: number[];
    rowWidth: number;
  }

  const foldedOffsets = (layout: BarLayout, active: number) => {
    const { centers, widths, rowWidth } = layout;
    const activeWidth = widths[active] ?? 0;
    const groupWidth = activeWidth + CHEVRON_GAP + CHEVRON_SIZE;
    const activeCenter = rowWidth / 2 - groupWidth / 2 + activeWidth / 2;
    const xs = centers.map((center) => round2(activeCenter - center));
    const chevron = round2(activeCenter + activeWidth / 2 + CHEVRON_GAP + CHEVRON_SIZE / 2);
    return { xs, chevron };
  };

  const indexAt = (centers: number[], x: number) => {
    const last = centers.length - 1;
    if (last <= 0 || x <= (centers[0] ?? 0)) {
      return 0;
    }
    for (let k = 0; k < last; k++) {
      const a = centers[k] ?? 0;
      const b = centers[k + 1] ?? a;
      if (x < b) {
        return k + (x - a) / Math.max(1, b - a);
      }
    }
    return last;
  };

  interface DragState {
    pointerId: number;
    startX: number;
    rowLeft: number;
    scrubbing: boolean;
    focus: number;
    samples: { x: number; t: number }[];
  }

  const releaseVelocity = (samples: DragState['samples'], now: number) => {
    const recent = samples.filter((s) => now - s.t <= VELOCITY_WINDOW);
    const first = recent[0];
    const last = recent.at(-1);
    if (!(first && last) || last.t === first.t) {
      return 0;
    }
    return ((last.x - first.x) / (last.t - first.t)) * 1000;
  };

  const capScale = (gap: number, foldVal: number) =>
    round2(clamp(1 - gap / 1.5, 0, 1) * (1 - clamp(foldVal * 4, 0, 1)));

  const KEY_MOVES: Record<string, (i: number, n: number) => number> = {
    ArrowLeft: (i) => i - 1,
    ArrowRight: (i) => i + 1,
    Home: () => 0,
    End: (_, n) => n - 1
  };

  const SURFACE = 'bg-surface-raised border border-border';
  const FOCUS_RING = 'outline-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset';

  // State derivations
  const entries = $derived(Object.entries(items));
  const paths = $derived(entries.map(([path]) => path));
  const count = $derived(entries.length);

  let activePath = $state<string>('');
  let previewIndex = $state<number | null>(null);
  let hoverIndex = $state<number | null>(null);
  let keyboardInside = $state(false);
  let scrubbing = $state(false);
  let scrolledPast = $state(false);
  let userOpenedAt = $state<number | null>(null);

  // Initialize active path
  $effect(() => {
    const currentRoute = page?.url?.pathname || null;
    if (!activePath) {
      activePath = findItemPath(paths, currentRoute) ?? defaultPath ?? paths[0] ?? '/';
    } else {
      const match = findItemPath(paths, currentRoute);
      if (match && match !== activePath) {
        activePath = match;
      }
    }
  });

  const activeIndex = $derived(paths.indexOf(findItemPath(paths, activePath) ?? activePath));
  const highlightIndex = $derived(previewIndex ?? activeIndex);

  const userOpen = $derived(userOpenedAt !== null);
  const folded = $derived(
    compact &&
    scrolledPast &&
    !userOpen &&
    !keyboardInside &&
    !scrubbing &&
    activeIndex >= 0
  );

  // DOM References
  let rowEl = $state<HTMLDivElement | null>(null);
  let linkEls = $state<(HTMLAnchorElement | null)[]>([]);
  let layout = $state<BarLayout | null>(null);
  let drag = $state<DragState | null>(null);
  let suppressClick = $state(false);

  // Animated values (Spring Physics Simulation)
  let currentXs = $state<number[]>([]);
  let targetXs = $state<number[]>([]);
  let velocityXs: number[] = [];

  let currentChevronX = $state<number>(0);
  let targetChevronX = $state<number>(0);
  let velocityChevronX = 0;

  let currentFold = $state<number>(0);
  let targetFold = $state<number>(0);
  let velocityFold = 0;

  let rafId: number | null = null;
  let lastTime = 0;

  // Spring coefficients: visualDuration ~0.32s, bounce ~0.15
  const STIFFNESS = 280;
  const DAMPING = 26;

  function measureLayout() {
    if (!rowEl) return;
    const boxes = linkEls.slice(0, count).map((el) => el?.parentElement);
    layout = {
      centers: boxes.map((box) => (box ? box.offsetLeft + box.offsetWidth / 2 : 0)),
      widths: boxes.map((box) => box?.offsetWidth ?? 0),
      rowWidth: rowEl.offsetWidth
    };
  }

  function runSpringLoop(now: number) {
    if (!lastTime) lastTime = now;
    const dt = Math.min(0.04, (now - lastTime) / 1000);
    lastTime = now;

    let stillMoving = false;

    // 1. Link offsets
    for (let i = 0; i < count; i++) {
      const curr = currentXs[i] ?? 0;
      const targ = targetXs[i] ?? 0;
      const vel = velocityXs[i] ?? 0;
      const dist = targ - curr;
      const force = STIFFNESS * dist - DAMPING * vel;
      const nextVel = vel + force * dt;
      const nextPos = curr + nextVel * dt;

      if (Math.abs(dist) > 0.05 || Math.abs(nextVel) > 0.5) {
        currentXs[i] = round2(nextPos);
        velocityXs[i] = nextVel;
        stillMoving = true;
      } else {
        currentXs[i] = targ;
        velocityXs[i] = 0;
      }
    }

    // 2. Chevron offset
    const distChev = targetChevronX - currentChevronX;
    const forceChev = STIFFNESS * distChev - DAMPING * velocityChevronX;
    const nextVelChev = velocityChevronX + forceChev * dt;
    const nextPosChev = currentChevronX + nextVelChev * dt;
    if (Math.abs(distChev) > 0.05 || Math.abs(nextVelChev) > 0.5) {
      currentChevronX = round2(nextPosChev);
      velocityChevronX = nextVelChev;
      stillMoving = true;
    } else {
      currentChevronX = targetChevronX;
      velocityChevronX = 0;
    }

    // 3. Fold progress
    const distFold = targetFold - currentFold;
    const forceFold = STIFFNESS * distFold - DAMPING * velocityFold;
    const nextVelFold = velocityFold + forceFold * dt;
    const nextPosFold = currentFold + nextVelFold * dt;
    if (Math.abs(distFold) > 0.005 || Math.abs(nextVelFold) > 0.05) {
      currentFold = round2(clamp(nextPosFold, 0, 1));
      velocityFold = nextVelFold;
      stillMoving = true;
    } else {
      currentFold = targetFold;
      velocityFold = 0;
    }

    if (stillMoving) {
      rafId = requestAnimationFrame(runSpringLoop);
    } else {
      rafId = null;
    }
  }

  function retarget(instant = false) {
    const reduced = isReducedMotion();
    const jump = instant || reduced;

    let nextTargets: number[] = [];
    let nextChevron = 0;

    if (folded && layout) {
      const result = foldedOffsets(layout, activeIndex);
      nextTargets = result.xs;
      nextChevron = result.chevron;
    } else {
      const focus = drag?.scrubbing ? drag.focus : highlightIndex;
      nextTargets = splitOffsets(count, focus, drag?.scrubbing ? null : hoverIndex);
      const anchor = Math.max(0, activeIndex);
      nextChevron = (layout?.centers[anchor] ?? 0) + (nextTargets[anchor] ?? 0);
    }

    targetXs = nextTargets;
    targetChevronX = round2(nextChevron - CHEVRON_SIZE / 2);
    targetFold = folded ? 1 : 0;

    if (jump) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      currentXs = [...targetXs];
      currentChevronX = targetChevronX;
      currentFold = targetFold;
      velocityXs = new Array(count).fill(0);
      velocityChevronX = 0;
      velocityFold = 0;
      return;
    }

    if (!rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(runSpringLoop);
    }
  }

  // React to count changes
  $effect(() => {
    if (currentXs.length !== count) {
      currentXs = splitOffsets(count, activeIndex >= 0 ? activeIndex : 0, null);
      targetXs = [...currentXs];
      velocityXs = new Array(count).fill(0);
    }
  });

  // Retarget on relevant state changes
  $effect(() => {
    // Read reactive dependencies
    const _ = [activeIndex, highlightIndex, hoverIndex, folded, count, layout];
    retarget(false);
  });

  function selectIndex(index: number) {
    const path = paths[index];
    if (path !== undefined) {
      activePath = path;
      const item = items[path];
      if (item) {
        onselect?.(path, item);
      }
    }
  }

  function toFocus(clientX: number, d: DragState) {
    if (!layout?.centers) return 0;
    return clamp(indexAt(layout.centers, clientX - d.rowLeft), 0, count - 1);
  }

  function handlePointerDown(e: PointerEvent) {
    const target = e.target as HTMLElement;
    if (e.button !== 0 || folded || target.closest('[data-chevron]')) return;

    drag = {
      pointerId: e.pointerId,
      startX: e.clientX,
      rowLeft: (e.currentTarget as HTMLElement).getBoundingClientRect().left,
      scrubbing: false,
      focus: highlightIndex,
      samples: [{ x: e.clientX, t: e.timeStamp }]
    };
  }

  function handlePointerMove(e: PointerEvent) {
    if (!drag || drag.pointerId !== e.pointerId) return;

    if (!drag.scrubbing) {
      if (Math.abs(e.clientX - drag.startX) < DRAG_SLOP) return;
      drag.scrubbing = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      scrubbing = true;
      hoverIndex = null;
    }

    drag.samples.push({ x: e.clientX, t: e.timeStamp });
    if (drag.samples.length > 12) drag.samples.shift();

    drag.focus = toFocus(e.clientX, drag);
    previewIndex = Math.round(drag.focus);
    retarget(false);
  }

  function handlePointerEnd(e: PointerEvent, commit: boolean) {
    if (!drag || drag.pointerId !== e.pointerId) return;
    const currentDrag = drag;
    drag = null;

    if (!currentDrag.scrubbing) return;

    scrubbing = false;
    previewIndex = null;

    if (!commit) {
      retarget(false);
      return;
    }

    const velocity = releaseVelocity(currentDrag.samples, e.timeStamp);
    const index = Math.round(toFocus(e.clientX + velocity * PROJECTION, currentDrag));

    suppressClick = true;
    setTimeout(() => {
      suppressClick = false;
    }, 0);

    selectIndex(index);
    linkEls[index]?.click();
  }

  function handleClickCapture(e: MouseEvent) {
    if (suppressClick && e.isTrusted) {
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    const move = KEY_MOVES[e.key];
    const from = linkEls.indexOf(document.activeElement as HTMLAnchorElement);
    if (!move || from < 0) return;

    e.preventDefault();
    const next = clamp(move(from, count), 0, count - 1);
    previewIndex = next;
    retarget(true);
    linkEls[next]?.focus();
  }

  function handleLinkFocus(index: number, e: FocusEvent) {
    const target = e.currentTarget as HTMLElement;
    if (target.matches(':focus-visible')) {
      keyboardInside = true;
      previewIndex = index;
      retarget(true);
    }
  }

  function handleRowBlur(e: FocusEvent) {
    const currentTarget = e.currentTarget as HTMLElement;
    if (!currentTarget.contains(e.relatedTarget as Node | null)) {
      keyboardInside = false;
      previewIndex = null;
      retarget(true);
    }
  }

  function handleHover(index: number, e: PointerEvent, entering: boolean) {
    if (e.pointerType !== 'mouse' || drag?.scrubbing) return;
    if (entering) {
      hoverIndex = index;
    } else if (hoverIndex === index) {
      hoverIndex = null;
    }
  }

  function followHash(e: MouseEvent, href: string) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.location.hash !== href) {
      window.history.pushState(null, '', href);
    }
  }

  function openFolded() {
    userOpenedAt = window.scrollY;
    linkEls[activeIndex]?.focus({ preventScroll: true });
  }

  onMount(() => {
    measureLayout();
    const observer = new ResizeObserver(() => measureLayout());
    if (rowEl) observer.observe(rowEl);

    // Initial positioning
    retarget(true);

    // Scroll listener for compact mode
    let frame = 0;
    const handleScroll = () => {
      if (!compact) return;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          const sy = window.scrollY;
          scrolledPast = sy > COMPACT_AFTER;
          if (userOpenedAt !== null && Math.abs(sy - userOpenedAt) > COMPACT_AFTER) {
            userOpenedAt = null;
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver scroll spy for in-page hashes
    const hashEntries = entries.filter(([path]) => path.startsWith('#'));
    let sectionObserver: IntersectionObserver | null = null;
    if (hashEntries.length > 0 && typeof IntersectionObserver !== 'undefined') {
      sectionObserver = new IntersectionObserver(
        (observedEntries) => {
          if (scrubbing) return;
          for (const ent of observedEntries) {
            if (ent.isIntersecting && ent.target.id) {
              const matchingHash = '#' + ent.target.id;
              if (activePath !== matchingHash) {
                activePath = matchingHash;
              }
              break;
            }
          }
        },
        { rootMargin: '-15% 0px -70% 0px' }
      );

      for (const [path] of hashEntries) {
        const id = path.slice(1);
        const targetSection = document.getElementById(id);
        if (targetSection) sectionObserver.observe(targetSection);
      }
    }

    return () => {
      observer.disconnect();
      if (sectionObserver) sectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (frame) cancelAnimationFrame(frame);
    };
  });
</script>

<nav
  aria-label="Main"
  class={cn('flex justify-center px-4 py-2', className)}
>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    bind:this={rowEl}
    role="menubar"
    tabindex="-1"
    class="relative flex touch-pan-y select-none items-center"
    onblur={handleRowBlur}
    onclickcapture={handleClickCapture}
    onkeydown={handleKeyDown}
    onpointercancel={(e) => handlePointerEnd(e, false)}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={(e) => handlePointerEnd(e, true)}
  >
    {#each entries as [path, item], index (path)}
      {@const isCurrent = index === activeIndex}
      {@const isHighlighted = index === highlightIndex}
      {@const isHidden = folded && !isCurrent}
      {@const isPinned = isCurrent}
      {@const segX = currentXs[index] ?? 0}
      {@const prevX = index > 0 ? currentXs[index - 1] : undefined}
      {@const nextX = index < count - 1 ? currentXs[index + 1] : undefined}
      {@const leftCap = prevX !== undefined ? `scaleX(${capScale(segX - prevX, currentFold)})` : 'scaleX(0)'}
      {@const rightCap = nextX !== undefined ? `scaleX(${capScale(nextX - segX, currentFold)})` : 'scaleX(0)'}
      {@const segOpacity = isPinned ? 1 : round2(clamp(1 - currentFold * 1.8, 0, 1))}
      {@const isHash = path.startsWith('#')}

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class={cn(
          'relative',
          isPinned ? 'z-20' : 'z-10',
          isHidden && 'pointer-events-none'
        )}
        style="transform: translate3d({segX}px, 0, 0); opacity: {segOpacity};"
        onpointerenter={(e) => handleHover(index, e, true)}
        onpointerleave={(e) => handleHover(index, e, false)}
      >
        <a
          bind:this={linkEls[index]}
          href={path}
          draggable="false"
          tabindex={isHidden ? -1 : 0}
          aria-current={isCurrent ? 'page' : undefined}
          class={cn(
            'relative flex min-h-10 items-center rounded-sm px-4 font-medium text-xs transition-colors duration-150',
            SURFACE,
            FOCUS_RING,
            isHighlighted
              ? 'text-ink font-semibold'
              : 'text-ink-secondary hover:text-ink'
          )}
          onclick={(e) => {
            selectIndex(index);
            if (isHash) {
              followHash(e, path);
            }
          }}
          ondragstart={(e) => e.preventDefault()}
          onfocus={(e) => handleLinkFocus(index, e)}
        >
          <!-- Left morphic corner concealment cap -->
          {#if prevX !== undefined}
            <span
              aria-hidden="true"
              class={cn('absolute inset-y-0 -left-px w-3 origin-left pointer-events-none', SURFACE)}
              style="transform: {leftCap};"
            ></span>
          {/if}

          <!-- Right morphic corner concealment cap -->
          {#if nextX !== undefined}
            <span
              aria-hidden="true"
              class={cn('absolute inset-y-0 -right-px w-3 origin-right pointer-events-none', SURFACE)}
              style="transform: {rightCap};"
            ></span>
          {/if}

          <!-- Label text -->
          <span class="relative z-10">{item.name}</span>

          <!-- Active bottom indicator pip -->
          <span
            aria-hidden="true"
            class={cn(
              'absolute bottom-1.5 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-none transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
              indicatorClass,
              isHighlighted ? 'scale-x-100' : 'scale-x-0'
            )}
          ></span>
        </a>
      </div>
    {/each}

    <!-- Compact mode chevron button -->
    {#if compact}
      <button
        type="button"
        data-chevron=""
        aria-expanded={!folded}
        aria-hidden={!folded}
        aria-label="Show all links"
        tabindex={folded ? 0 : -1}
        class={cn(
          'absolute top-0 left-0 flex size-10 items-center justify-center rounded-sm text-ink-secondary transition-colors duration-150 hover:text-ink',
          SURFACE,
          FOCUS_RING,
          folded ? 'z-30' : 'pointer-events-none z-0'
        )}
        style="transform: translate3d({currentChevronX}px, 0, 0); opacity: {currentFold};"
        onclick={openFolded}
      >
        <svg
          aria-hidden="true"
          class="size-4 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    {/if}
  </div>
</nav>
