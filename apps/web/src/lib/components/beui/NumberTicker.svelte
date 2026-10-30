<script lang="ts">
  interface Props {
    value: number;
    initial?: number;
    duration?: number; // ms
    decimals?: number;
    prefix?: string;
    suffix?: string;
    class?: string;
  }

  let {
    value,
    initial = 0,
    duration = 600,
    decimals = 0,
    prefix = '',
    suffix = '',
    class: className = ''
  }: Props = $props();

  let currentValue = $state<number | null>(null);
  const displayValue = $derived(currentValue ?? initial);

  $effect(() => {
    const target = value;
    const start = currentValue ?? initial;
    const diff = target - start;

    if (typeof window === 'undefined' || diff === 0) {
      currentValue = target;
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      currentValue = target;
      return;
    }

    const startTime = performance.now();
    let animId: number;

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out (Lagom power3)
      const ease = 1 - Math.pow(1 - progress, 3);
      currentValue = start + diff * ease;

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        currentValue = target;
      }
    }

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  });

  const formatted = $derived(
    prefix + displayValue.toFixed(decimals) + suffix
  );
</script>

<span class="inline-block font-mono tabular-nums {className}" aria-label="{prefix}{value.toFixed(decimals)}{suffix}">
  <span aria-hidden="true">{formatted}</span>
</span>
