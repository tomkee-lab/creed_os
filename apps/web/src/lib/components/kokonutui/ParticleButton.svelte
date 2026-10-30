<script lang="ts">
  import { type Snippet, onMount } from 'svelte';
  import { Check, AlertCircle, LoaderCircle } from 'lucide-svelte';
  import { buttonVariants, type ButtonVariant, type ButtonSize } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';

  export type ParticleButtonStatus = 'idle' | 'pending' | 'success' | 'error';

  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    class?: string;
    wrapperClass?: string;
    status?: ParticleButtonStatus;
    successDuration?: number;
    errorDuration?: number;
    pendingLabel?: string;
    successLabel?: string;
    errorLabel?: string;
    particles?: boolean;
    disabled?: boolean;
    onclick?: (event: MouseEvent) => unknown;
    onsuccess?: () => void;
    onerror?: (err: unknown) => void;
    children?: Snippet;
    icon?: Snippet;
    [key: string]: any;
  }

  let {
    variant = 'default',
    size = 'default',
    class: className = '',
    wrapperClass = '',
    status: controlledStatus = undefined,
    successDuration = 1600,
    errorDuration = 2800,
    pendingLabel = 'Saving...',
    successLabel = 'Completed',
    errorLabel = 'Action failed',
    particles = true,
    disabled = false,
    onclick,
    onsuccess,
    onerror,
    children,
    icon,
    ...restProps
  }: Props = $props();

  let internalStatus = $state<ParticleButtonStatus>('idle');
  const status = $derived(controlledStatus ?? internalStatus);

  let buttonEl = $state<HTMLButtonElement | null>(null);
  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let pressX = $state<number | null>(null);
  let isShaking = $state(false);
  let isBursting = $state(false);
  let burstColor = $state('currentColor');

  let resetTimer: ReturnType<typeof setTimeout> | null = null;
  let rafId: number | null = null;
  let prevStatus = $state<ParticleButtonStatus>('idle');

  const BLEED = 48;
  const PARTICLE_COUNT = 18;
  const GRAVITY = 0.0016;
  const DRAG = 0.0022;
  const LIFETIME = 650;

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number;
    spin: number;
    w: number;
    h: number;
  }

  function getButtonColor(el: HTMLElement): string {
    const style = getComputedStyle(el);
    const bg = style.backgroundColor;
    const isTransparent = bg === 'transparent' || bg.includes('rgba(0, 0, 0, 0)') || bg.includes('/ 0)');
    return isTransparent ? (style.color || '#0a1628') : bg;
  }

  function triggerBurst(originX: number) {
    if (!buttonEl || !canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const btnW = buttonEl.offsetWidth;
    const btnH = buttonEl.offsetHeight;
    const cssW = btnW + BLEED * 2;
    const cssH = btnH + BLEED * 2;

    canvasEl.width = cssW * dpr;
    canvasEl.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    const particlesList: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const spread = (Math.random() - 0.5) * Math.min(btnW, 100);
      const x = Math.min(Math.max(originX + spread, 4), btnW - 4);
      const side = x < btnW / 2 ? -1 : 1;
      const speed = 0.18 + Math.random() * 0.22;
      const angle = -Math.PI / 2 + side * Math.random() * 0.85;
      const isChip = i % 3 === 0;
      return {
        x,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.02,
        w: isChip ? 5 : 3,
        h: isChip ? 2 : 3
      };
    });

    isBursting = true;
    const start = performance.now();
    let last = start;

    if (rafId) cancelAnimationFrame(rafId);

    const tick = (now: number) => {
      const dt = Math.min(now - last, 32);
      last = now;
      const t = (now - start) / LIFETIME;

      ctx.clearRect(0, 0, cssW, cssH);

      if (t >= 1) {
        isBursting = false;
        ctx.clearRect(0, 0, cssW, cssH);
        return;
      }

      ctx.fillStyle = burstColor;
      ctx.globalAlpha = Math.max(0, 1 - t * t);

      for (const p of particlesList) {
        p.vx *= 1 - DRAG * dt;
        p.vy = p.vy * (1 - DRAG * dt) + GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.angle += p.spin * dt;

        ctx.save();
        ctx.translate(p.x + BLEED, p.y + BLEED);
        ctx.rotate(p.angle);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
  }

  $effect(() => {
    const current = status;
    if (prevStatus !== current) {
      if (current === 'success') {
        const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (particles && buttonEl && !reduced) {
          burstColor = getButtonColor(buttonEl);
          const x = pressX ?? (buttonEl.offsetWidth / 2);
          triggerBurst(x);
        }
      } else if (current === 'error') {
        isShaking = true;
        setTimeout(() => {
          isShaking = false;
        }, 320);
      }
      prevStatus = current;
    }
  });

  function settle(next: 'success' | 'error') {
    internalStatus = next;
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      internalStatus = 'idle';
      resetTimer = null;
    }, next === 'success' ? successDuration : errorDuration);
  }

  async function handleClick(e: MouseEvent) {
    if (status === 'pending' || disabled) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    pressX = (e.clientX === 0 && e.clientY === 0) ? null : (e.clientX - rect.left);

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }

    if (onclick) {
      try {
        const result = onclick(e);
        if (e.defaultPrevented || controlledStatus !== undefined) return;

        if (result && typeof (result as any).then === 'function') {
          internalStatus = 'pending';
          try {
            await result;
            settle('success');
            onsuccess?.();
          } catch (err) {
            settle('error');
            onerror?.(err);
          }
        } else {
          settle('success');
          onsuccess?.();
        }
      } catch (err) {
        settle('error');
        onerror?.(err);
      }
    } else {
      settle('success');
      onsuccess?.();
    }
  }

  onMount(() => {
    return () => {
      if (resetTimer) clearTimeout(resetTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
</script>

<div class={cn('relative inline-flex items-center overflow-visible', className?.includes('w-full') && 'w-full flex', wrapperClass)}>
  <!-- Particle Burst Canvas overlay (hidden when idle so bleed never causes horizontal overflow) -->
  <canvas
    bind:this={canvasEl}
    aria-hidden="true"
    class="pointer-events-none absolute select-none {isBursting ? 'visible' : 'hidden'}"
    style="top: -{BLEED}px; left: -{BLEED}px; width: calc(100% + {BLEED * 2}px); height: calc(100% + {BLEED * 2}px); z-index: 50;"
  ></canvas>

  <button
    bind:this={buttonEl}
    type="button"
    aria-busy={status === 'pending' ? 'true' : undefined}
    aria-disabled={status === 'pending' || disabled ? 'true' : undefined}
    data-status={status}
    disabled={disabled || status === 'pending'}
    onclick={handleClick}
    class={cn(
      buttonVariants({ variant, size }),
      'relative overflow-hidden transition-all duration-200 select-none cursor-pointer',
      'rounded-sm',
      isShaking && 'animate-[kokonut-shake_320ms_ease-in-out]',
      status === 'error' && 'border-rose-500/50 text-rose-500 dark:border-rose-400/50',
      className
    )}
    {...restProps}
  >
    <!-- Accessible announcement for screen readers -->
    <span class="sr-only" aria-live="polite">
      {#if status === 'pending'}
        {pendingLabel}
      {:else if status === 'success'}
        {successLabel}
      {:else if status === 'error'}
        {errorLabel}
      {/if}
    </span>

    <span class="inline-flex items-center gap-1.5 transition-transform duration-140">
      {#if status === 'pending'}
        <LoaderCircle class="size-3.5 animate-spin" />
        <span>{pendingLabel}</span>
      {:else if status === 'success'}
        <Check class="size-3.5 text-emerald-500 animate-[kokonut-pop_240ms_ease-out]" />
        <span class="text-emerald-500">{successLabel}</span>
      {:else if status === 'error'}
        <AlertCircle class="size-3.5 text-rose-500" />
        <span class="text-rose-500">{errorLabel}</span>
      {:else}
        {#if children}
          {@render children()}
        {:else}
          Confirm Action
        {/if}
        {#if icon}
          {@render icon()}
        {/if}
      {/if}
    </span>
  </button>
</div>

<style>
  @keyframes kokonut-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-4px);
    }
    40%,
    80% {
      transform: translateX(4px);
    }
  }

  @keyframes kokonut-pop {
    0% {
      transform: scale(0.6);
      opacity: 0;
    }
    70% {
      transform: scale(1.15);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
