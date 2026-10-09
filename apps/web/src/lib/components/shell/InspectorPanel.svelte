<script lang="ts">
  import { X, ShieldCheck, ExternalLink } from 'lucide-svelte';
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(false),
    title = 'Record Inspector',
    category = 'Evidence',
    subtitle,
    verified = false,
    verificationLabel,
    children,
    footerAction
  }: {
    open?: boolean;
    title?: string;
    category?: string;
    subtitle?: string;
    verified?: boolean;
    verificationLabel?: string;
    children?: Snippet;
    footerAction?: Snippet;
  } = $props();

  function close() {
    open = false;
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-40 bg-ink/20 backdrop-blur-2xs transition-opacity duration-200"
    onclick={close}
    role="presentation"
  ></div>

  <!-- Right Inspector Drawer -->
  <aside
    class="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-105 bg-surface-raised border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
    aria-label="Details Inspector"
  >
    <!-- Header -->
    <div class="h-14 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-none bg-surface-subtle border border-border text-ink-muted">
          {category}
        </span>
        <h2 class="text-xs font-semibold text-ink truncate">
          {title}
        </h2>
      </div>

      <button
        onclick={close}
        class="p-1 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
        aria-label="Close inspector"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    {#if subtitle}
      <div class="px-4 py-2 border-b border-border bg-surface-subtle text-[11px] text-ink-secondary">
        {subtitle}
      </div>
    {/if}

    <!-- Content Body -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      {@render children?.()}
    </div>

    <!-- Footer -->
    <div class="p-3 border-t border-border bg-surface flex items-center justify-between shrink-0">
      <div class="flex items-center gap-1.5 text-[10px] font-mono">
        {#if verified}
          <ShieldCheck class="w-3.5 h-3.5 text-positive" />
          <span class="text-positive">{verificationLabel || 'Cryptographically Verified'}</span>
        {:else if verificationLabel}
          <span class="text-ink-muted">{verificationLabel}</span>
        {:else}
          <span class="text-ink-muted">Record Audit Entry</span>
        {/if}
      </div>

      <div class="flex items-center gap-2">
        <button
          onclick={close}
          class="px-2.5 py-1 text-xs rounded-none border border-border text-ink-secondary hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          Close
        </button>
        {#if footerAction}
          {@render footerAction()}
        {/if}
      </div>
    </div>
  </aside>
{/if}
