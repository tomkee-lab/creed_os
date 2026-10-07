<script lang="ts">
  export interface TabItem {
    id: string;
    label: string;
    count?: number;
  }

  interface Props {
    items: TabItem[];
    activeId?: string;
    variant?: 'pills' | 'underline';
    class?: string;
    onchange?: (id: string) => void;
  }

  let {
    items,
    activeId = $bindable(items[0]?.id ?? ''),
    variant = 'pills',
    class: className = '',
    onchange
  }: Props = $props();

  function selectTab(id: string) {
    activeId = id;
    onchange?.(id);
  }
</script>

{#if variant === 'pills'}
  <div
    class="flex items-center gap-1 p-1 rounded-sm bg-surface border border-border text-xs select-none {className}"
    role="region"
    aria-label="Tabs"
  >
    {#each items as item}
      {@const isActive = activeId === item.id}
      <button
        type="button"
        aria-pressed={isActive}
        onclick={() => selectTab(item.id)}
        class="px-3.5 py-1.5 rounded-sm font-medium transition-all duration-140 cursor-pointer {isActive ? 'bg-surface-raised text-ink shadow-xs' : 'text-ink-secondary hover:text-ink'}"
      >
        <span>{item.label}</span>
        {#if item.count !== undefined}
          <span class="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-sm {isActive ? 'bg-surface-subtle text-ink' : 'bg-surface-raised text-ink-muted'}">
            {item.count}
          </span>
        {/if}
      </button>
    {/each}
  </div>
{:else}
  <div
    class="flex items-center gap-2 border-b border-border pb-1 text-xs sm:text-sm select-none {className}"
    role="region"
    aria-label="Tabs"
  >
    {#each items as item}
      {@const isActive = activeId === item.id}
      <button
        type="button"
        aria-pressed={isActive}
        onclick={() => selectTab(item.id)}
        class="px-4 py-2 font-medium transition-colors cursor-pointer border-b-2 -mb-1 {isActive ? 'border-brand text-brand font-semibold' : 'border-transparent text-ink-secondary hover:text-ink'}"
      >
        <span>{item.label}</span>
        {#if item.count !== undefined}
          <span class="ml-1 text-[11px] text-ink-muted">({item.count})</span>
        {/if}
      </button>
    {/each}
  </div>
{/if}
