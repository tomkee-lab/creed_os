<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Activity,
    CheckCircle2,
    ArrowRight,
    AlertCircle,
    Award,
    Clock,
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
        setTimeout(() => {
          currentItem = data.nextItem;
          selectedOptionId = null;
          lastEvaluation = null;
          status = 'active';
        }, 2200);
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

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
  <!-- 1. STUDENT-FACING HEADER (Calm, focused, zero psychometric jargon) -->
  <header class="flex items-center justify-between border-b border-(--border-subtle) pb-4">
    <div class="space-y-0.5">
      <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-primary)">
        Diagnostic Inquiry
      </span>
      <h1 class="text-xl font-bold text-(--text-primary)">
        Scientific & Logical Inquiry
      </h1>
    </div>

    <!-- Calm pacing indicator without pressure-inducing countdown timer -->
    <div class="flex items-center gap-4 text-xs text-(--text-secondary)">
      <div class="flex items-center gap-1.5 text-(--text-muted)">
        <Clock class="w-3.5 h-3.5" />
        <span>~15 min estimated</span>
      </div>
      <div class="h-4 w-px bg-(--border-subtle)"></div>
      <span class="font-medium">
        Question <strong class="text-(--text-primary)">{itemsAnswered + 1}</strong> of 12
      </span>
    </div>
  </header>

  {#if status === 'loading'}
    <div class="surface-card rounded-sm p-16 text-center space-y-4 border border-(--border-subtle)">
      <Loader2 class="w-8 h-8 text-(--accent-primary) animate-spin mx-auto" />
      <p class="text-sm text-(--text-secondary)">Preparing your personalized diagnostic question...</p>
    </div>
  {:else if status === 'error'}
    <div class="surface-card rounded-sm p-8 border-l-4 border-l-(--accent-danger) text-center space-y-4 border border-(--border-subtle)">
      <AlertCircle class="w-8 h-8 text-(--accent-danger) mx-auto" />
      <p class="text-sm font-medium text-(--text-primary)">{errorMessage}</p>
      <button
        onclick={startSession}
        class="px-4 py-2 rounded-sm bg-(--accent-primary) text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
      >
        Retry Diagnostic
      </button>
    </div>
  {:else if status === 'completed'}
    <!-- Calm Humanized Completion View: Developmental Progression -->
    <div class="surface-card rounded-sm p-8 sm:p-10 space-y-8 border border-(--border-subtle)">
      <div class="text-center space-y-3">
        <div class="w-14 h-14 rounded-sm bg-(--accent-success-subtle) text-(--accent-success) flex items-center justify-center mx-auto border border-(--border-subtle)">
          <Award class="w-7 h-7" />
        </div>
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-success) block">
          Assessment Complete
        </span>
        <h2 class="text-2xl font-bold text-(--text-primary)">
          We have a clearer picture.
        </h2>
        <p class="text-sm text-(--text-secondary) max-w-md mx-auto leading-relaxed">
          Your responses provided clear evidence of your analytical strengths and targeted growth opportunities.
        </p>
      </div>

      <!-- Developmental Progress Narrative Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-(--text-muted) block">
            Observed Trajectory
          </span>
          <p class="text-sm font-bold text-(--text-primary)">
            Scientific Reasoning
          </p>
          <div class="flex items-center gap-1.5 text-xs font-semibold text-(--accent-success) pt-1">
            <span>Developing</span>
            <ArrowRight class="w-3.5 h-3.5" />
            <span>Strong Foundation</span>
          </div>
        </div>

        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-(--text-muted) block">
            What Helped
          </span>
          <p class="text-sm font-bold text-(--text-primary)">
            Evidence Comparison
          </p>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            You did especially well when isolating variables and contrasting hypotheses.
          </p>
        </div>

        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-(--accent-primary) block">
            Recommended Next Step
          </span>
          <p class="text-sm font-bold text-(--text-primary)">
            Hands-on Investigation
          </p>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Try a short 20-minute kinematics investigation mission to apply your reasoning.
          </p>
        </div>
      </div>

      <!-- Action Primary CTA -->
      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/student"
          class="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-(--accent-primary) text-white font-medium text-sm hover:opacity-90 transition-all shadow-sm text-center cursor-pointer"
        >
          View Updated Learning Map
        </a>
        <a
          href="/student/pathways"
          class="w-full sm:w-auto px-5 py-2.5 rounded-sm surface-card text-(--text-secondary) hover:text-(--text-primary) font-medium text-sm transition-colors border border-(--border-subtle) text-center cursor-pointer"
        >
          Explore Matching Pathways
        </a>
      </div>
    </div>
  {:else if currentItem}
    <!-- Active Question Shell (Architectural 0px frame for assessment item, 4px controls) -->
    <div class="surface-card rounded-none p-6 sm:p-8 space-y-6 border border-(--border-subtle)">
      <!-- Domain indicator -->
      <div class="flex items-center justify-between text-xs text-(--text-muted)">
        <span class="font-semibold text-(--accent-primary) tracking-wide">
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

      <!-- Option Tiles (4px Tactile radio surfaces) -->
      <div class="space-y-3 pt-2">
        {#each currentItem.options as opt}
          <button
            type="button"
            disabled={status === 'evaluating'}
            onclick={() => (selectedOptionId = opt.id)}
            class="w-full text-left p-4 rounded-sm border transition-all flex items-center justify-between cursor-pointer {selectedOptionId === opt.id ? 'border-(--accent-primary) bg-(--accent-primary-subtle) text-(--text-primary) font-medium ring-1 ring-(--accent-primary)' : 'border-(--border-subtle) bg-(--surface-raised) hover:bg-(--surface-sunken) text-(--text-secondary)'}"
          >
            <span class="text-sm leading-relaxed">{opt.text}</span>
            <div class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 {selectedOptionId === opt.id ? 'border-(--accent-primary) bg-(--accent-primary)' : 'border-(--border-strong)'}">
              {#if selectedOptionId === opt.id}
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <!-- Immediate Learning Feedback -->
      {#if lastEvaluation}
        <div class="p-4 rounded-sm border transition-all {lastEvaluation.isCorrect ? 'bg-(--accent-success-subtle) border-(--accent-success) text-(--accent-success)' : 'bg-(--accent-warning-subtle) border-(--accent-warning) text-(--accent-warning)'} space-y-1">
          <div class="flex items-center gap-2 text-sm font-semibold">
            {#if lastEvaluation.isCorrect}
              <CheckCircle2 class="w-4 h-4" />
              <span>Great reasoning!</span>
            {:else}
              <AlertCircle class="w-4 h-4" />
              <span>Good attempt — let's review:</span>
            {/if}
          </div>
          <p class="text-xs text-(--text-secondary) leading-relaxed">{lastEvaluation.explanation}</p>
          <p class="text-[11px] text-(--text-muted) pt-1">Loading next inquiry challenge...</p>
        </div>
      {/if}

      <!-- Submit Action Button -->
      {#if !lastEvaluation}
        <div class="pt-4 flex items-center justify-end">
          <button
            onclick={submitResponse}
            disabled={!selectedOptionId || status === 'evaluating'}
            class="px-6 py-2.5 rounded-sm bg-(--accent-primary) hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
