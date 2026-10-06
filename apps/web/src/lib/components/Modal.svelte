<script lang="ts">
  import type { Snippet } from 'svelte';
  import { X } from 'lucide-svelte';

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
    onclose?: () => void;
    children?: Snippet;
    footer?: Snippet;
  }

  let {
    open = $bindable(false),
    title,
    description,
    maxWidth = 'md',
    onclose,
    children,
    footer
  }: Props = $props();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  function handleClose() {
    open = false;
    onclose?.();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Backdrop click dismissal -->
    <div
      class="fixed inset-0"
      onclick={handleClose}
      role="button"
      tabindex="-1"
      onkeydown={() => {}}
      aria-label="Close modal overlay"
    ></div>

    <!-- Modal Content -->
    <div
      class="relative w-full {maxWidthClasses[maxWidth]} surface-elevated rounded-2xl border border-(--border-subtle) shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
    >
      {#if title}
        <div class="px-6 py-4.5 border-b border-(--border-subtle) flex items-center justify-between gap-4">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-(--text-primary)">
              {title}
            </h3>
            {#if description}
              <p class="text-xs text-(--text-secondary) mt-0.5">
                {description}
              </p>
            {/if}
          </div>

          <button
            type="button"
            onclick={handleClose}
            class="p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-sunken) transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      {/if}

      <div class="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-(--text-secondary)">
        {#if children}
          {@render children()}
        {/if}
      </div>

      {#if footer}
        <div class="px-6 py-4 bg-(--surface-sunken)/40 border-t border-(--border-subtle) flex items-center justify-end gap-3">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
