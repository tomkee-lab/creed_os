<script lang="ts">
  import { Activity, ShieldCheck, CheckCircle2 } from 'lucide-svelte';

  interface Props {
    theta: number; // Latent ability estimate typically [-3.0, +3.0]
    standardError: number; // SEM typically [0.2, 1.0]
    itemsAnswered: number;
    maxItems?: number;
    targetSe?: number;
    showDetails?: boolean;
  }

  let {
    theta,
    standardError,
    itemsAnswered,
    maxItems = 12,
    targetSe = 0.35,
    showDetails = true
  }: Props = $props();

  // Normalized theta to percentage 0-100% for progress visualization (scale -3.0 to +3.0)
  const normalizedTheta = $derived(
    Math.max(0, Math.min(100, Math.round(((theta + 3.0) / 6.0) * 100)))
  );

  // Confidence error margin (+/- 1.96 * SE)
  const marginLower = $derived(
    Math.max(0, Math.min(100, Math.round(((theta - 1.96 * standardError + 3.0) / 6.0) * 100)))
  );
  const marginUpper = $derived(
    Math.max(0, Math.min(100, Math.round(((theta + 1.96 * standardError + 3.0) / 6.0) * 100)))
  );

  // Stopping criterion convergence index: 1.0 = fully converged (SE <= targetSe)
  const convergenceRatio = $derived(
    Math.min(1.0, Math.max(0, (1.0 - standardError) / (1.0 - targetSe)))
  );
  const isConverged = $derived(standardError <= targetSe || itemsAnswered >= maxItems);
</script>

<div class="rounded-none border border-border bg-surface-raised p-4 space-y-3">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="p-1.5 rounded-none bg-brand-subtle text-brand">
        <Activity class="w-4 h-4" />
      </div>
      <div>
        <h4 class="text-xs font-semibold text-ink uppercase tracking-wider">
          CAT Calibration Engine
        </h4>
        <p class="text-[11px] text-ink-muted">
          Real-time 3PL EAP Ability Estimate
        </p>
      </div>
    </div>
    <div class="text-right">
      <span class="text-xs font-mono font-medium text-brand">
        θ = {theta >= 0 ? '+' : ''}{theta.toFixed(2)}
      </span>
      <span class="text-[10px] text-ink-muted font-mono block">
        ±{standardError.toFixed(2)} SEM
      </span>
    </div>
  </div>

  <!-- Ability scale visualizer with confidence band -->
  <div class="space-y-1">
    <div class="flex justify-between text-[10px] text-ink-muted font-mono">
      <span>Foundational (-3.0)</span>
      <span>Grade Baseline (0.0)</span>
      <span>Advanced (+3.0)</span>
    </div>
    <div class="relative h-3 bg-surface-subtle rounded-none overflow-hidden border border-border">
      <!-- 95% Confidence Interval band -->
      <div
        class="absolute top-0 bottom-0 bg-brand/20 rounded-none transition-all duration-300"
        style="left: {marginLower}%; width: {Math.max(4, marginUpper - marginLower)}%;"
      ></div>
      <!-- Center Theta point -->
      <div
        class="absolute top-0 bottom-0 w-1.5 bg-brand rounded-none transition-all duration-300 -translate-x-1/2"
        style="left: {normalizedTheta}%;"
      ></div>
    </div>
  </div>

  {#if showDetails}
    <div class="pt-2 border-t border-border grid grid-cols-2 gap-3 text-xs">
      <div>
        <span class="text-ink-muted text-[11px]">Items Administered</span>
        <div class="flex items-center gap-2 mt-0.5">
          <div class="flex-1 h-1.5 bg-surface-subtle rounded-none overflow-hidden">
            <div
              class="h-full bg-brand transition-all duration-300"
              style="width: {(itemsAnswered / maxItems) * 100}%;"
            ></div>
          </div>
          <span class="font-mono text-ink-secondary text-[11px]">{itemsAnswered}/{maxItems}</span>
        </div>
      </div>
      <div>
        <span class="text-ink-muted text-[11px]">Convergence Stability</span>
        <div class="flex items-center gap-1.5 mt-0.5">
          {#if isConverged}
            <CheckCircle2 class="w-3.5 h-3.5 text-positive shrink-0" />
            <span class="text-positive text-[11px] font-medium">Standard Error Met</span>
          {:else}
            <div class="flex-1 h-1.5 bg-surface-subtle rounded-none overflow-hidden">
              <div
                class="h-full bg-attention transition-all duration-300"
                style="width: {convergenceRatio * 100}%;"
              ></div>
            </div>
            <span class="text-attention text-[11px] font-mono">
              {Math.round(convergenceRatio * 100)}%
            </span>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
