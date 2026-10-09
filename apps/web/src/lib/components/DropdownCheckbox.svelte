<script lang="ts">
  import { ChevronDown, Check } from 'lucide-svelte';

  export interface DropdownCheckboxItem {
    id: string;
    label: string;
    description?: string;
    checked?: boolean;
  }

  interface Props {
    items: DropdownCheckboxItem[];
    title?: string;
    class?: string;
    onChange?: (selectedIds: string[]) => void;
  }

  let {
    items = $bindable([]),
    title = 'Select options',
    class: className = '',
    onChange
  }: Props = $props();

  let isOpen = $state(false);

  const selectedCount = $derived(items.filter((item) => item.checked).length);

  function toggleItem(id: string) {
    items = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    const selected = items.filter((item) => item.checked).map((item) => item.id);
    onChange?.(selected);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative inline-block text-left {className}">
  <!-- Trigger Button -->
  <button
    type="button"
    aria-haspopup="true"
    aria-expanded={isOpen}
    onclick={() => (isOpen = !isOpen)}
    class="inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-none bg-surface border border-border hover:bg-surface-subtle text-xs font-medium text-ink transition-micro focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-mint cursor-pointer shadow-xs"
  >
    <span>{title}</span>
    {#if selectedCount > 0}
      <span class="px-1.5 py-0.2 rounded-none bg-mint/15 text-mint font-mono text-[10px]">
        {selectedCount}
      </span>
    {/if}
    <ChevronDown class="size-3.5 text-ink-muted transition-transform duration-140 {isOpen ? 'rotate-180' : ''}" />
  </button>

  <!-- Dropdown Panel (Strict 0px Sharp) -->
  {#if isOpen}
    <!-- Backdrop to close -->
    <div
      role="presentation"
      tabindex="-1"
      class="fixed inset-0 z-40"
      onclick={() => (isOpen = false)}
      onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
    ></div>

    <div
      role="menu"
      tabindex="-1"
      class="absolute left-0 z-50 mt-1 w-64 rounded-none bg-surface-overlay border border-border p-1.5 shadow-lg space-y-1 font-mono text-xs"
    >
      {#each items as item}
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={item.checked}
          onclick={() => toggleItem(item.id)}
          class="w-full flex items-start gap-2.5 p-2 rounded-none text-left transition-micro cursor-pointer {item.checked
            ? 'bg-surface-raised text-ink'
            : 'text-ink-secondary hover:bg-surface-subtle hover:text-ink'}"
        >
          <!-- Checkbox Indicator (Square) -->
          <div
            class="flex items-center justify-center size-4 mt-0.5 rounded-none border transition-micro shrink-0 {item.checked
              ? 'bg-mint text-mint-foreground border-mint'
              : 'bg-surface border-border'}"
          >
            {#if item.checked}
              <Check class="size-3 stroke-3" />
            {/if}
          </div>

          <!-- Label and Description -->
          <div class="flex flex-col">
            <span class="font-sans font-medium text-xs text-ink">
              {item.label}
            </span>
            {#if item.description}
              <span class="font-sans text-[11px] text-ink-muted leading-tight mt-0.5">
                {item.description}
              </span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
