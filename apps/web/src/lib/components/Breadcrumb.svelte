<script lang="ts">
  export interface BreadcrumbItem {
    label: string;
    href?: string;
  }

  interface Props {
    items: BreadcrumbItem[];
    class?: string;
  }

  let { items, class: className = '' }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="flex items-center text-xs font-mono text-ink-muted {className}">
  <ol class="flex items-center gap-1.5 flex-wrap">
    {#each items as item, i}
      {@const isLast = i === items.length - 1}
      <li class="flex items-center gap-1.5">
        {#if isLast || !item.href}
          <span class="text-ink font-medium" aria-current="page">
            {item.label}
          </span>
        {:else}
          <a
            href={item.href}
            class="text-ink-secondary hover:text-ink transition-micro hover:underline"
          >
            {item.label}
          </a>
          <span class="text-border" aria-hidden="true">/</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
