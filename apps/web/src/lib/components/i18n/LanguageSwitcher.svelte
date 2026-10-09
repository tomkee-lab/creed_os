<script lang="ts">
  import { onMount } from 'svelte';
  import { Globe, Check } from 'lucide-svelte';
  import { getLocale, setLocale, locales, type Locale } from '$lib/paraglide/runtime.js';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  const localeLabels: Record<string, { label: string; nativeName: string }> = {
    en: { label: 'EN', nativeName: 'English' },
    hi: { label: 'HI', nativeName: 'हिन्दी' },
    mr: { label: 'MR', nativeName: 'मराठी' }
  };

  let currentLocale = $state<string>('en');
  let open = $state(false);
  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
    try {
      currentLocale = getLocale();
    } catch {
      currentLocale = 'en';
    }
  });

  function changeLocale(loc: string) {
    currentLocale = loc;
    try {
      setLocale(loc as any);
    } catch {
      // fallback
    }
    open = false;
  }

  function toggleOpen() {
    open = !open;
  }
</script>

<div class="relative inline-block font-mono text-xs {className}">
  <button
    type="button"
    data-testid="language-switcher"
    data-hydrated={hydrated}
    onclick={toggleOpen}
    class="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-surface hover:bg-surface-raised border border-border hover:border-border-strong text-ink text-xs transition-colors cursor-pointer"
    aria-expanded={open}
    aria-haspopup="listbox"
    title="Switch Language"
  >
    <Globe class="w-3.5 h-3.5 text-ink-muted" />
    <span class="font-semibold uppercase tracking-wider">{localeLabels[currentLocale]?.label || currentLocale}</span>
  </button>

  {#if open}
    <!-- Backdrop to close dropdown on click outside -->
    <button
      type="button"
      class="fixed inset-0 z-40 bg-transparent cursor-default border-none p-0 m-0"
      onclick={() => (open = false)}
      aria-label="Close language selector"
    ></button>

    <div
      class="absolute right-0 mt-1 w-32 py-1 rounded-none bg-surface border border-border shadow-md z-50 flex flex-col font-mono text-xs"
      role="listbox"
    >
      {#each locales as loc}
        <button
          type="button"
          onclick={() => changeLocale(loc)}
          class="flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors cursor-pointer hover:bg-surface-subtle {currentLocale === loc ? 'text-brand font-semibold' : 'text-ink'}"
          role="option"
          aria-selected={currentLocale === loc}
        >
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-ink-muted uppercase">{loc}</span>
            <span>{localeLabels[loc]?.nativeName || loc}</span>
          </div>
          {#if currentLocale === loc}
            <Check class="w-3 h-3 text-brand shrink-0" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
