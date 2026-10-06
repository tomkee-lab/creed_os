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

<div class="rounded-none border border-white/10 bg-white/5 p-4 space-y-3">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="p-1.5 rounded-none bg-cyan-500/10 text-cyan-400">
        <Activity class="w-4 h-4" />
      </div>
      <div>
        <h4 class="text-xs font-semibold text-white uppercase tracking-wider">
          CAT Calibration Engine
        </h4>
        <p class="text-[11px] text-slate-400">
          Real-time 3PL EAP Ability Estimate
        </p>
      </div>
    </div>
    <div class="text-right">
      <span class="text-xs font-mono font-medium text-cyan-300">
        θ = {theta >= 0 ? '+' : ''}{theta.toFixed(2)}
      </span>
      <span class="text-[10px] text-slate-400 font-mono block">
        ±{standardError.toFixed(2)} SEM
      </span>
    </div>
  </div>

  <!-- Ability scale visualizer with confidence band -->
  <div class="space-y-1">
    <div class="flex justify-between text-[10px] text-slate-400 font-mono">
      <span>Foundational (-3.0)</span>
      <span>Grade Baseline (0.0)</span>
      <span>Advanced (+3.0)</span>
    </div>
    <div class="relative h-3 bg-black/40 rounded-none overflow-hidden border border-white/10">
      <!-- 95% Confidence Interval band -->
      <div
        class="absolute top-0 bottom-0 bg-cyan-500/30 rounded-none transition-all duration-300"
        style="left: {marginLower}%; width: {Math.max(4, marginUpper - marginLower)}%;"
      ></div>
      <!-- Center Theta point -->
      <div
        class="absolute top-0 bottom-0 w-1.5 bg-cyan-400 rounded-none shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300 -translate-x-1/2"
        style="left: {normalizedTheta}%;"
      ></div>
    </div>
  </div>

  {#if showDetails}
    <div class="pt-2 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
      <div>
        <span class="text-slate-400 text-[11px]">Items Administered</span>
        <div class="flex items-center gap-2 mt-0.5">
          <div class="flex-1 h-1.5 bg-black/40 rounded-none overflow-hidden">
            <div
              class="h-full bg-cyan-400 transition-all duration-300"
              style="width: {(itemsAnswered / maxItems) * 100}%;"
            ></div>
          </div>
          <span class="font-mono text-slate-300 text-[11px]">{itemsAnswered}/{maxItems}</span>
        </div>
      </div>
      <div>
        <span class="text-slate-400 text-[11px]">Convergence Stability</span>
        <div class="flex items-center gap-1.5 mt-0.5">
          {#if isConverged}
            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span class="text-emerald-300 text-[11px] font-medium">Standard Error Met</span>
          {:else}
            <div class="flex-1 h-1.5 bg-black/40 rounded-none overflow-hidden">
              <div
                class="h-full bg-amber-400 transition-all duration-300"
                style="width: {convergenceRatio * 100}%;"
              ></div>
            </div>
            <span class="text-amber-300 text-[11px] font-mono">
              {Math.round(convergenceRatio * 100)}%
            </span>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
