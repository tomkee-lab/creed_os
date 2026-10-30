<script lang="ts">
  import Check from 'lucide-svelte/icons/check';
  import ShieldCheck from 'lucide-svelte/icons/shield-check';
  import Loader from 'lucide-svelte/icons/loader-circle';
  import Sparkles from 'lucide-svelte/icons/sparkles';

  export interface ActivityStep {
    id: string;
    label: string;
    detail?: string;
    timestamp?: string;
    status: 'pending' | 'running' | 'completed' | 'verified';
    metric?: string;
  }

  interface Props {
    title?: string;
    subtitle?: string;
    steps: ActivityStep[];
    class?: string;
  }

  let {
    title = 'Inference & Evidence Stream',
    subtitle = 'Deterministic scoring with contextual explainability',
    steps = [],
    class: className = ''
  }: Props = $props();
</script>

<div class="rounded-none border border-border bg-surface-raised p-4 sm:p-5 {className}">
  <!-- Stream Header -->
  <div class="flex items-center justify-between border-b border-border pb-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-none bg-brand"></span>
        <h4 class="font-mono text-xs font-semibold uppercase tracking-wider text-ink truncate">
          {title}
        </h4>
      </div>
      {#if subtitle}
        <p class="mt-0.5 text-[11px] text-ink-secondary truncate">{subtitle}</p>
      {/if}
    </div>

    <div class="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-ink-muted">
      <ShieldCheck class="size-3 text-brand" />
      <span>DPDP 2023 Verified</span>
    </div>
  </div>

  <!-- Activity Stream List -->
  <div class="mt-4 space-y-3 font-mono text-xs">
    {#each steps as step (step.id)}
      {@const isRunning = step.status === 'running'}
      {@const isCompleted = step.status === 'completed'}
      {@const isVerified = step.status === 'verified'}
      {@const isPending = step.status === 'pending'}

      <div
        class="flex items-start gap-3 rounded-sm border p-3 transition-colors duration-150 {isRunning
          ? 'border-brand/40 bg-surface'
          : isVerified
            ? 'border-border/80 bg-surface/80'
            : isCompleted
              ? 'border-border/60 bg-surface/50'
              : 'border-transparent bg-transparent opacity-50'}"
      >
        <!-- Status Icon Marker -->
        <div class="mt-0.5 shrink-0">
          {#if isRunning}
            <Loader class="size-3.5 animate-spin text-brand" />
          {:else if isVerified}
            <div class="flex size-3.5 items-center justify-center rounded-none bg-brand text-brand-foreground">
              <Check class="size-2.5 stroke-[3]" />
            </div>
          {:else if isCompleted}
            <Check class="size-3.5 text-positive" />
          {:else}
            <span class="block size-2 rounded-none bg-border mt-1 ml-0.5"></span>
          {/if}
        </div>

        <!-- Details -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <span class="font-medium {isRunning ? 'text-brand' : 'text-ink'} truncate">
              {step.label}
            </span>
            {#if step.metric}
              <span class="shrink-0 text-[10px] text-ink-muted">{step.metric}</span>
            {:else if step.timestamp}
              <span class="shrink-0 text-[10px] text-ink-muted">{step.timestamp}</span>
            {/if}
          </div>

          {#if step.detail}
            <p class="mt-0.5 font-sans text-[11px] leading-relaxed text-ink-secondary">
              {step.detail}
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
