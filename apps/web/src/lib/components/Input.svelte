<script lang="ts">
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
      class="block text-xs font-semibold text-ink"
    >
      {label}
      {#if required}
        <span class="text-critical">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative flex items-center">
    {#if IconComponent}
      <div class="absolute left-3 pointer-events-none text-ink-muted flex items-center">
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
      class="w-full py-2 {IconComponent ? 'pl-10 pr-4' : 'px-4'} rounded-sm bg-surface-subtle border {error ? 'border-critical' : 'border-border'} text-xs sm:text-sm text-ink placeholder:text-ink-muted transition-all duration-140 focus:outline-none focus:ring-2 {error ? 'focus:ring-critical' : 'focus:ring-brand'} focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed {className}"
    />
  </div>

  {#if error}
    <p class="text-[11px] text-critical font-medium mt-1">
      {error}
    </p>
  {:else if helperText}
    <p class="text-[11px] text-ink-muted mt-1">
      {helperText}
    </p>
  {/if}
</div>
