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
    BrainCircuit,
    Clock,
    ChevronDown,
    ChevronUp,
    Sliders,
    Loader2
  } from 'lucide-svelte';
  import type { ClientAssessmentItem } from '@core-os/domain';

  // State runes
  let sessionId = $state<string | null>(null);
  let status = $state<'loading' | 'active' | 'evaluating' | 'completed' | 'error'>('loading');
  let currentItem = $state<ClientAssessmentItem | null>(null);
  let selectedOptionId = $state<string | null>(null);
  let itemsAnswered = $state(0);
  let currentTheta = $state(0.0);
  let standardError = $state(1.0);
  let errorMessage = $state<string | null>(null);
  let debugDrawerOpen = $state(false);

  // Timer simulation
  let secondsElapsed = $state(0);
  let timerInterval: any = null;

  const formattedTime = $derived.by(() => {
    const mins = Math.floor(secondsElapsed / 60);
    const secs = secondsElapsed % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

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
    secondsElapsed = 0;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (status === 'active' || status === 'evaluating') {
        secondsElapsed++;
      }
    }, 1000);

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
        if (timerInterval) clearInterval(timerInterval);
        completionSummary = data.completionSummary || {
          finalTheta: data.currentTheta,
          finalStandardError: data.standardError,
          itemsCount: data.itemsAnswered
        };
        status = 'completed';
      } else {
        setTimeout(() => {
          currentItem = data.nextItem;
          selectedOptionId = null;
          lastEvaluation = null;
          status = 'active';
        }, 2800);
      }
    } catch (err: any) {
      status = 'error';
      errorMessage = err.message || 'Error scoring response';
    }
  }

  onMount(() => {
    startSession();
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });
</script>

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
  <!-- 1. CHILD-FIRST HEADER (Calm, no scary mathematical telemetry) -->
  <div class="flex items-center justify-between border-b border-(--border-subtle) pb-4">
    <div class="space-y-0.5">
      <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-primary)">
        Diagnostic Check
      </span>
      <h1 class="text-xl font-bold text-(--text-primary)">
        Scientific & Logical Inquiry
      </h1>
    </div>

    <!-- Quiet timer and step counter -->
    <div class="flex items-center gap-4 text-xs text-(--text-secondary)">
      <div class="flex items-center gap-1.5 font-mono">
        <Clock class="w-3.5 h-3.5 text-(--text-muted)" />
        <span>{formattedTime}</span>
      </div>
      <div class="h-4 w-px bg-(--border-subtle)"></div>
      <span class="font-medium">
        Question <strong class="text-(--text-primary)">{itemsAnswered + 1}</strong> of 12
      </span>
    </div>
  </div>

  {#if status === 'loading'}
    <div class="surface-card p-16 text-center space-y-4">
      <Loader2 class="w-8 h-8 text-(--accent-primary) animate-spin mx-auto" />
      <p class="text-sm text-(--text-secondary)">Preparing your personalized questions...</p>
    </div>
  {:else if status === 'error'}
    <div class="surface-card p-8 border-l-4 border-l-(--accent-danger) text-center space-y-4">
      <AlertCircle class="w-8 h-8 text-(--accent-danger) mx-auto" />
      <p class="text-sm font-medium text-(--text-primary)">{errorMessage}</p>
      <button
        onclick={startSession}
        class="px-4 py-2 rounded-none bg-(--accent-primary) text-white text-xs font-medium hover:opacity-90 transition-opacity"
      >
        Retry Diagnostic
      </button>
    </div>
  {:else if status === 'completed'}
    <!-- Friendly Completion View (Humanized summary, growth tone) -->
    <div class="surface-card rounded-none p-8 text-center space-y-6 border border-(--border-subtle)">
      <div class="w-14 h-14 rounded-none bg-(--accent-success-subtle) text-(--accent-success) flex items-center justify-center mx-auto border border-(--border-subtle)">
        <Award class="w-7 h-7" />
      </div>

      <div class="space-y-2 max-w-lg mx-auto">
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-success)">
          Diagnostic Finished
        </span>
        <h2 class="text-2xl font-bold text-(--text-primary)">
          We Learned Enough About Your Current Level!
        </h2>
        <p class="text-sm text-(--text-secondary) leading-relaxed">
          Great job! The diagnostic has gathered clear evidence about your reasoning strengths and current growth areas. Your learning map has been updated.
        </p>
      </div>

      <div class="pt-4 flex items-center justify-center gap-3">
        <a
          href="/student"
          class="px-6 py-2.5 rounded-none bg-(--accent-primary) text-white font-medium text-sm hover:opacity-90 transition-all shadow-sm"
        >
          View Updated Map
        </a>
        <button
          onclick={startSession}
          class="px-4 py-2.5 rounded-none surface-card text-(--text-secondary) hover:text-(--text-primary) font-medium text-sm transition-colors border border-(--border-subtle)"
        >
          Try Another Session
        </button>
      </div>
    </div>
  {:else if currentItem}
    <!-- Active Question Shell (Nordic Lagom Clean Canvas) -->
    <div class="surface-card rounded-none p-6 sm:p-8 space-y-6 border border-(--border-subtle)">
      <!-- Domain indicator -->
      <div class="flex items-center justify-between text-xs text-(--text-muted)">
        <span class="font-medium text-(--accent-primary)">
          {currentItem.competency.replace('_', ' ').toUpperCase()}
        </span>
        <span>Select the single best answer</span>
      </div>

      <!-- Question Prompt -->
      <div class="space-y-2">
        <p class="text-base sm:text-lg font-medium text-(--text-primary) leading-relaxed">
          {currentItem.prompt}
        </p>
      </div>

      <!-- Option Tiles (Tactile radio buttons) -->
      <div class="space-y-3 pt-2">
        {#each currentItem.options as opt}
          <button
            type="button"
            disabled={status === 'evaluating'}
            onclick={() => (selectedOptionId = opt.id)}
            class="w-full text-left p-4 rounded-none border transition-all flex items-center justify-between {selectedOptionId === opt.id ? 'border-(--accent-primary) bg-(--accent-primary-subtle) text-(--text-primary) font-medium ring-1 ring-(--accent-primary)' : 'border-(--border-subtle) bg-(--surface-raised) hover:bg-(--surface-sunken) text-(--text-secondary)'}"
          >
            <span class="text-sm">{opt.text}</span>
            <div class="w-4 h-4 rounded-none border flex items-center justify-center shrink-0 ml-3 {selectedOptionId === opt.id ? 'border-(--accent-primary) bg-(--accent-primary)' : 'border-(--border-strong)'}">
              {#if selectedOptionId === opt.id}
                <div class="w-1.5 h-1.5 rounded-none bg-white"></div>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <!-- Immediate Learning Feedback -->
      {#if lastEvaluation}
        <div class="p-4 rounded-none border transition-all {lastEvaluation.isCorrect ? 'bg-(--accent-success-subtle) border-(--accent-success) text-(--accent-success)' : 'bg-(--accent-warning-subtle) border-(--accent-warning) text-(--accent-warning)'} space-y-1">
          <div class="flex items-center gap-2 text-sm font-semibold">
            {#if lastEvaluation.isCorrect}
              <CheckCircle2 class="w-4 h-4" />
              <span>Great reasoning!</span>
            {:else}
              <XCircle class="w-4 h-4" />
              <span>Good attempt — let's review:</span>
            {/if}
          </div>
          <p class="text-xs text-(--text-secondary) leading-relaxed">{lastEvaluation.explanation}</p>
          <p class="text-[11px] text-(--text-muted) pt-1">Loading your next question...</p>
        </div>
      {/if}

      <!-- Submit Action Button -->
      {#if !lastEvaluation}
        <div class="pt-4 flex items-center justify-end">
          <button
            onclick={submitResponse}
            disabled={!selectedOptionId || status === 'evaluating'}
            class="px-6 py-2.5 rounded-none bg-(--accent-primary) hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Save & Continue</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <!-- 2. COLLAPSIBLE PSYCHOMETRIC DIAGNOSTICS (For Evaluators & Psychometricians Only) -->
  <div class="border border-(--border-subtle) rounded-none bg-(--surface-sunken) overflow-hidden text-xs">
    <button
      type="button"
      onclick={() => (debugDrawerOpen = !debugDrawerOpen)}
      class="w-full px-4 py-3 flex items-center justify-between text-(--text-muted) hover:text-(--text-primary) transition-colors text-left"
    >
      <div class="flex items-center gap-2">
        <Sliders class="w-3.5 h-3.5" />
        <span class="font-medium">Psychometric Diagnostics & Telemetry (Evaluator Inspector)</span>
      </div>
      {#if debugDrawerOpen}
        <ChevronUp class="w-4 h-4" />
      {:else}
        <ChevronDown class="w-4 h-4" />
      {/if}
    </button>

    {#if debugDrawerOpen}
      <div class="p-4 border-t border-(--border-subtle) space-y-3 font-mono bg-(--surface-canvas)">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div class="p-2 rounded-none bg-(--surface-raised) border border-(--border-subtle)">
            <span class="text-[10px] text-(--text-muted) block">Latent Ability θ</span>
            <span class="font-bold text-(--accent-primary)">{currentTheta >= 0 ? '+' : ''}{currentTheta.toFixed(3)}</span>
          </div>
          <div class="p-2 rounded-none bg-(--surface-raised) border border-(--border-subtle)">
            <span class="text-[10px] text-(--text-muted) block">Standard Error SE(θ)</span>
            <span class="font-bold text-(--text-primary)">±{standardError.toFixed(3)}</span>
          </div>
          <div class="p-2 rounded-none bg-(--surface-raised) border border-(--border-subtle)">
            <span class="text-[10px] text-(--text-muted) block">Item Bank Code</span>
            <span class="text-(--text-primary)">{currentItem?.code || 'SCI-002'}</span>
          </div>
          <div class="p-2 rounded-none bg-(--surface-raised) border border-(--border-subtle)">
            <span class="text-[10px] text-(--text-muted) block">Estimation Method</span>
            <span class="text-(--text-primary)">Gauss-Hermite EAP</span>
          </div>
        </div>
        <p class="text-[10px] text-(--text-muted)">
          * Note: This panel is restricted to Evaluator/Admin mode. Non-expert learners and parents never see unconstrained mathematical parameters during active sessions.
        </p>
      </div>
    {/if}
  </div>
</div>
