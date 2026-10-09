<script lang="ts">
  import { Check } from 'lucide-svelte';

  export interface Step {
    id: number | string;
    label: string;
    description?: string;
  }

  interface Props {
    steps: Step[];
    current?: number;
    completed?: boolean;
    clickable?: boolean;
    onStepClick?: (stepIndex: number, step: Step) => void;
    class?: string;
  }

  let {
    steps,
    current = $bindable(1),
    completed = false,
    clickable = true,
    onStepClick,
    class: className = ''
  }: Props = $props();

  function handleClick(index: number, step: Step) {
    if (!clickable) return;
    current = index + 1;
    onStepClick?.(index + 1, step);
  }
</script>

<div class="w-full space-y-4 {className}">
  <!-- Stepper Track -->
  <ol class="flex items-center w-full text-xs font-mono">
    {#each steps as step, i}
      {@const stepNum = i + 1}
      {@const isCompleted = completed || stepNum < current}
      {@const isCurrent = !completed && stepNum === current}
      {@const isLast = i === steps.length - 1}

      <li class="flex items-center {isLast ? '' : 'flex-1'}">
        <button
          type="button"
          disabled={!clickable}
          onclick={() => handleClick(i, step)}
          class="flex items-center gap-2 group text-left {clickable ? 'cursor-pointer' : 'cursor-default'} focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-mint"
        >
          <!-- Step Box Marker (Strict 0px Sharp) -->
          <div
            class="flex items-center justify-center size-7 rounded-none border text-xs font-semibold transition-all duration-200 {isCompleted
              ? 'bg-mint text-mint-foreground border-mint shadow-xs'
              : isCurrent
                ? 'bg-surface-raised text-mint border-mint ring-2 ring-mint/20'
                : 'bg-surface-subtle text-ink-muted border-border group-hover:border-border-strong group-hover:text-ink'}"
          >
            {#if isCompleted}
              <Check class="size-3.5 stroke-[2.5]" />
            {:else}
              <span>{stepNum}</span>
            {/if}
          </div>

          <!-- Step Text Labels -->
          <div class="flex flex-col">
            <span
              class="font-medium text-xs transition-micro {isCurrent
                ? 'text-ink font-semibold'
                : isCompleted
                  ? 'text-ink'
                  : 'text-ink-muted group-hover:text-ink-secondary'}"
            >
              {step.label}
            </span>
            {#if step.description}
              <span class="text-[10px] text-ink-muted leading-tight">
                {step.description}
              </span>
            {/if}
          </div>
        </button>

        <!-- Connecting Line -->
        {#if !isLast}
          <div
            class="flex-1 h-px mx-3 transition-colors duration-300 {completed || stepNum < current
              ? 'bg-mint'
              : 'bg-border'}"
          ></div>
        {/if}
      </li>
    {/each}
  </ol>
</div>
