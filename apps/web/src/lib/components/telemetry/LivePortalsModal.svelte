<!-- apps/web/src/lib/components/telemetry/LivePortalsModal.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { X, Sparkles, Radio } from 'lucide-svelte';
  import ThreeLaunchpad from './ThreeLaunchpad.svelte';

  let { isOpen = $bindable(false) } = $props<{
    isOpen?: boolean;
  }>();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in-0 duration-150 font-sans"
    role="dialog"
    aria-modal="true"
    aria-labelledby="live-mesh-modal-title"
    tabindex="-1"
  >
    <!-- Modal Frame (WAY 2.1: 0/4/8px Radii, Pure Semantic Tokens) -->
    <div
      class="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-surface border border-border rounded-sm shadow-md overflow-hidden text-ink"
      role="document"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-surface-subtle/80">
        <div class="flex items-center gap-3">
          <div class="size-2 rounded-none bg-brand animate-pulse"></div>
          <div>
            <h2 id="live-mesh-modal-title" class="text-sm font-semibold text-ink font-heading leading-tight">
              CREED OS · 3D Live Application Mesh
            </h2>
            <p class="text-[11px] text-ink-secondary font-mono">
              Three.js WebGL spatial navigation across Planetary Studio, Sandbox & Robotics IDE
            </p>
          </div>
        </div>

        <button
          onclick={() => (isOpen = false)}
          class="p-1.5 rounded-sm border border-border bg-surface hover:bg-surface-raised text-ink-muted hover:text-ink transition-micro cursor-pointer"
          title="Close Mesh (Esc)"
          aria-label="Close dialog"
        >
          <X class="size-4" />
        </button>
      </div>

      <!-- Modal Body: Interactive ThreeLaunchpad -->
      <div class="flex-1 overflow-y-auto">
        <ThreeLaunchpad />
      </div>

      <!-- Modal Footer -->
      <div class="px-4 py-2 border-t border-border bg-surface-subtle flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted">
        <div class="flex items-center gap-2 text-[11px]">
          <Radio class="size-3 text-mint" />
          <span>Keplerian SGP4 Telemetry Synchronized</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-ink-secondary">Press Esc to dismiss</span>
          <button
            onclick={() => (isOpen = false)}
            class="px-3 py-1 rounded-sm border border-border bg-surface hover:bg-surface-raised text-xs font-mono text-ink transition-micro"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
