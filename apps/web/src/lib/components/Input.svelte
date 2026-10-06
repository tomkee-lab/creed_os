<script lang="ts">
  import type { Component } from 'svelte';

  interface Props {
    value?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'search';
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    helperText?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    icon?: any;
    class?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
  }

  let {
    value = $bindable(''),
    type = 'text',
    id,
    name,
    label,
    placeholder = '',
    helperText,
    error,
    disabled = false,
    required = false,
    icon: IconComponent,
    class: className = '',
    oninput,
    onchange
  }: Props = $props();

  const generatedId = $derived(id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined));
</script>

<div class="space-y-1.5 w-full">
  {#if label}
    <label
      for={generatedId}
      class="block text-xs font-semibold text-(--text-primary)"
    >
      {label}
      {#if required}
        <span class="text-(--accent-danger)">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative flex items-center">
    {#if IconComponent}
      <div class="absolute left-3 pointer-events-none text-(--text-muted) flex items-center">
        <IconComponent class="w-4 h-4" />
      </div>
    {/if}

    <input
      {type}
      id={generatedId}
      {name}
      bind:value
      {placeholder}
      {disabled}
      {required}
      {oninput}
      {onchange}
      class="w-full py-2 {IconComponent ? 'pl-9.5 pr-3.5' : 'px-3.5'} rounded-xl bg-(--surface-sunken) border {error ? 'border-(--accent-danger)' : 'border-(--border-subtle)'} text-xs sm:text-sm text-(--text-primary) placeholder-(--text-muted) transition-all duration-150 focus:outline-none focus:ring-2 {error ? 'focus:ring-(--accent-danger)' : 'focus:ring-(--accent-primary)'} focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed {className}"
    />
  </div>

  {#if error}
    <p class="text-[11px] text-(--accent-danger) font-medium mt-1">
      {error}
    </p>
  {:else if helperText}
    <p class="text-[11px] text-(--text-muted) mt-1">
      {helperText}
    </p>
  {/if}
</div>
