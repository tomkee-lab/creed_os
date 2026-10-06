<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Activity,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Sparkles,
    AlertCircle,
    RefreshCw,
    Award,
    BrainCircuit
  } from 'lucide-svelte';
  import type { ClientAssessmentItem } from '@core-os/domain';

  // Svelte 5 state runes
  let sessionId = $state<string | null>(null);
  let status = $state<'loading' | 'active' | 'evaluating' | 'completed' | 'error'>('loading');
  let currentItem = $state<ClientAssessmentItem | null>(null);
  let selectedOptionId = $state<string | null>(null);
  let itemsAnswered = $state(0);
  let currentTheta = $state(0.0);
  let standardError = $state(1.0);
  let errorMessage = $state<string | null>(null);

  // Result state for current question
  let lastEvaluation = $state<{
    isCorrect: boolean;
    explanation: string;
    misconceptionCode?: string;
  } | null>(null);

  // Completion summary
  let completionSummary = $state<{
    finalTheta: number;
    finalStandardError: number;
    itemsCount: number;
    evidenceGeneratedId?: string;
  } | null>(null);

  async function startSession() {
    status = 'loading';
    errorMessage = null;
    lastEvaluation = null;
    selectedOptionId = null;
    completionSummary = null;

    try {
      const res = await fetch('/api/v1/assessments/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', domain: 'stem_reasoning' })
      });

      if (!res.ok) throw new Error('Could not initialize session');

      const data = await res.json();
      sessionId = data.sessionId;
      currentItem = data.firstItem;
      currentTheta = data.currentTheta;
      standardError = data.standardError;
      itemsAnswered = 0;
      status = 'active';
    } catch (err: any) {
      status = 'error';
      errorMessage = err.message || 'Failed to start adaptive session';
    }
  }

  async function submitResponse() {
    if (!selectedOptionId || !sessionId || !currentItem || status === 'evaluating') return;

    status = 'evaluating';

    try {
      const res = await fetch(`/api/v1/assessments/sessions/${sessionId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: currentItem.id,
          selectedOptionId,
          timeSpentSeconds: 18
        })
      });

      if (!res.ok) throw new Error('Failed to evaluate response');

      const data = await res.json();

      lastEvaluation = {
        isCorrect: data.isCorrect,
        explanation: data.explanation,
        misconceptionCode: data.misconceptionCode
      };

      currentTheta = data.currentTheta;
      standardError = data.standardError;
      itemsAnswered = data.itemsAnswered;

      if (data.isTestComplete) {
        completionSummary = data.completionSummary || {
          finalTheta: data.currentTheta,
          finalStandardError: data.standardError,
          itemsCount: data.itemsAnswered
        };
        status = 'completed';
      } else {
        // Wait briefly for learner to read feedback, then load next question
        setTimeout(() => {
          currentItem = data.nextItem;
          selectedOptionId = null;
          lastEvaluation = null;
          status = 'active';
        }, 3200);
      }
    } catch (err: any) {
      status = 'error';
      errorMessage = err.message || 'Error scoring response';
    }
  }

  onMount(() => {
    startSession();
  });
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  <!-- Telemetry Header (Clean Nordic Lagom Chrome) -->
  <div class="flex items-center justify-between p-4 rounded-xl glass-panel">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
        <Activity class="w-4 h-4" />
      </div>
      <div>
        <h1 class="text-base font-bold text-white leading-tight">Adaptive Diagnostic CAT</h1>
        <p class="text-[11px] text-slate-400 font-mono">3-Parameter Logistic (3PL) IRT Engine</p>
      </div>
    </div>

    <!-- Live Psychometric Estimator Datums -->
    <div class="flex items-center gap-4 text-xs font-mono">
      <div class="text-right">
        <span class="text-[10px] text-slate-500 uppercase block">Latent Ability</span>
        <span class="font-bold text-cyan-300">θ = {currentTheta > 0 ? '+' : ''}{currentTheta.toFixed(2)}</span>
      </div>
      <div class="h-6 w-px bg-white/10"></div>
      <div class="text-right">
        <span class="text-[10px] text-slate-500 uppercase block">Certainty (SE)</span>
        <span class="text-slate-300">±{standardError.toFixed(2)}</span>
      </div>
      <div class="h-6 w-px bg-white/10"></div>
      <div class="text-right">
        <span class="text-[10px] text-slate-500 uppercase block">Items</span>
        <span class="font-bold text-white">{itemsAnswered}</span>
      </div>
    </div>
  </div>

  {#if status === 'loading'}
    <div class="p-16 rounded-xl glass-panel text-center space-y-4">
      <div class="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-sm text-slate-300 font-mono">Initializing psychometric blueprint & item bank...</p>
    </div>
  {:else if status === 'error'}
    <div class="p-8 rounded-xl border border-red-500/30 bg-red-500/10 text-center space-y-4">
      <AlertCircle class="w-8 h-8 text-red-400 mx-auto" />
      <p class="text-sm text-white font-medium">{errorMessage}</p>
      <button
        onclick={startSession}
        class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-slate-950 font-semibold text-xs"
      >
        Retry Diagnostic
      </button>
    </div>
  {:else if status === 'completed'}
    <!-- Completion & Psychometric Convergence Card -->
    <div class="p-8 rounded-xl glass-panel-elevated text-center space-y-6">
      <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
        <Award class="w-8 h-8" />
      </div>

      <div class="space-y-2">
        <span class="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">Diagnostic Converged</span>
        <h2 class="text-2xl font-bold text-white">Adaptive Assessment Complete</h2>
        <p class="text-sm text-slate-300 max-w-lg mx-auto">
          The 3PL CAT algorithm has reached statistical measurement precision ($SE \le 0.38$). Your longitudinal learner graph has been updated with verified Level 3 diagnostic evidence.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto py-4">
        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-1">
          <span class="text-[10px] text-slate-400 font-mono uppercase">Estimated θ</span>
          <p class="text-2xl font-bold font-mono text-cyan-400">
            {completionSummary?.finalTheta && completionSummary.finalTheta > 0 ? '+' : ''}{completionSummary?.finalTheta?.toFixed(2)}
          </p>
        </div>
        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-1">
          <span class="text-[10px] text-slate-400 font-mono uppercase">Std Error (SE)</span>
          <p class="text-2xl font-bold font-mono text-emerald-400">
            ±{completionSummary?.finalStandardError?.toFixed(2)}
          </p>
        </div>
        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-1">
          <span class="text-[10px] text-slate-400 font-mono uppercase">Items Administered</span>
          <p class="text-2xl font-bold font-mono text-white">
            {completionSummary?.itemsCount}
          </p>
        </div>
      </div>

      <div class="pt-4 flex items-center justify-center gap-4">
        <a
          href="/student"
          class="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-cyan-500/20"
        >
          View Updated Future Map
        </a>
        <button
          onclick={startSession}
          class="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm flex items-center gap-2 transition-all"
        >
          <RefreshCw class="w-4 h-4 text-cyan-400" />
          <span>Take New Diagnostic</span>
        </button>
      </div>
    </div>
  {:else if currentItem}
    <!-- Active Question Shell (Clean Desk Ethos) -->
    <div class="p-8 rounded-xl glass-panel space-y-8">
      <!-- Item Meta Badge -->
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
          Item #{itemsAnswered + 1} • {currentItem.code} • {currentItem.competency.replace('_', ' ').toUpperCase()}
        </span>
        <span class="text-xs text-slate-400 font-mono">Select single best option</span>
      </div>

      <!-- Question Stem -->
      <div class="space-y-4">
        <p class="text-lg sm:text-xl font-medium text-white leading-relaxed whitespace-pre-line">
          {currentItem.prompt}
        </p>
      </div>

      <!-- Multiple Choice Options -->
      <div class="space-y-3 pt-2">
        {#each currentItem.options as opt}
          <button
            type="button"
            disabled={status === 'evaluating'}
            onclick={() => (selectedOptionId = opt.id)}
            class="w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between {selectedOptionId === opt.id ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10' : 'bg-white/5 border-white/8 text-slate-300 hover:border-white/20 hover:bg-white/10'}"
          >
            <span class="text-sm sm:text-base font-normal">{opt.text}</span>
            <div class="w-5 h-5 rounded-full border flex items-center justify-center {selectedOptionId === opt.id ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-white/20'}">
              {#if selectedOptionId === opt.id}
                <div class="w-2 h-2 rounded-full bg-slate-950"></div>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <!-- Immediate Misconception / Mastery Feedback Box -->
      {#if lastEvaluation}
        <div class="p-4 rounded-lg border transition-all {lastEvaluation.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'} space-y-2">
          <div class="flex items-center gap-2 text-sm font-bold">
            {#if lastEvaluation.isCorrect}
              <CheckCircle2 class="w-4 h-4 text-emerald-400" />
              <span>Correct Reasoning</span>
            {:else}
              <XCircle class="w-4 h-4 text-amber-400" />
              <span>Misconception Diagnosed: [{lastEvaluation.misconceptionCode}]</span>
            {/if}
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">{lastEvaluation.explanation}</p>
          <p class="text-[11px] text-cyan-400 font-mono">Loading next adaptive item based on updated ability θ...</p>
        </div>
      {/if}

      <!-- Submit Action Button -->
      {#if !lastEvaluation}
        <div class="pt-4 flex items-center justify-end">
          <button
            onclick={submitResponse}
            disabled={!selectedOptionId || status === 'evaluating'}
            class="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-semibold text-sm transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
          >
            <span>Confirm & Update θ</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
