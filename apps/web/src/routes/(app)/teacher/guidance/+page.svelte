<script lang="ts">
  import {
    Compass,
    Cpu,
    BookOpen,
    HelpCircle,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Sparkles,
    Layers,
    Clock,
    ShieldAlert,
    BrainCircuit,
    Lightbulb
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { PedagogicalPlaybook } from '$lib/server/repository';

  let { data } = $props<{ data: PageData }>();

  // State runes
  let selectedPlaybookIdState = $state<string | null>(null);
  const selectedPlaybookId = $derived<string>(selectedPlaybookIdState ?? data.playbooks[0]?.id ?? 'PLAY-PRIMM');

  const selectedPlaybook = $derived<PedagogicalPlaybook | undefined>(
    data.playbooks.find((p: PedagogicalPlaybook) => p.id === selectedPlaybookId) || data.playbooks[0]
  );
</script>

<svelte:head>
  <title>Teacher Pedagogical Guidance & Playbooks — CREED OS</title>
</svelte:head>

<div class="space-y-6 pb-20">
  <!-- Top Header Navigation -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted font-mono">
          WAY Console • Faculty Pedagogy Engine
        </span>
        <span class="text-xs text-muted">•</span>
        <span class="text-xs text-muted">Teaching the Right Way</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-foreground">
        Teacher Pedagogical Guidance & Remediation Playbooks
      </h1>
    </div>

    <div class="flex items-center gap-2">
      <a
        href="/teacher/lesson-plans"
        class="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-none transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>Lesson Plan Studio</span>
      </a>
      <a
        href="/teacher/benchmarks"
        class="px-4 py-2 border border-border hover:bg-surface-raised text-xs font-medium text-foreground rounded-none transition-colors cursor-pointer"
      >
        Cohort Benchmarks
      </a>
    </div>
  </div>

  <!-- Framework Selection Tabs (Zero-radius 0px) -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {#each data.playbooks as pb}
      {@const isSelected = selectedPlaybookId === pb.id}
      <button
        onclick={() => (selectedPlaybookIdState = pb.id)}
        class="p-4 text-left border rounded-none transition-all cursor-pointer {isSelected ? 'bg-surface-raised border-ai ring-1 ring-ai' : 'bg-surface border-border hover:border-border-strong'}"
      >
        <div class="space-y-1.5">
          <span class="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.5 bg-surface border border-border text-muted">
            {pb.domain}
          </span>
          <h3 class="text-xs font-bold text-foreground leading-snug">
            {pb.frameworkName}
          </h3>
          <p class="text-[11px] text-muted line-clamp-2">
            {pb.tagline}
          </p>
        </div>
      </button>
    {/each}
  </div>

  {#if selectedPlaybook}
    <!-- ACTIVE PLAYBOOK DEEP DIVE -->
    <div class="p-6 bg-surface border border-border rounded-none space-y-6">
      <!-- Header -->
      <div class="border-b border-border pb-4 space-y-1">
        <div class="flex items-center gap-2">
          <BrainCircuit class="w-4 h-4 text-ai" />
          <h2 class="text-base font-bold text-foreground">
            {selectedPlaybook.frameworkName}
          </h2>
        </div>
        <p class="text-xs text-muted leading-relaxed">
          {selectedPlaybook.tagline}
        </p>
      </div>

      <!-- Core Principles Grid -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold uppercase tracking-wider text-muted font-mono">
          Core Principles & Cognitive Rationale
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          {#each selectedPlaybook.corePrinciples as cp}
            <div class="p-3.5 bg-surface-raised border border-border rounded-none space-y-1.5">
              <span class="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lightbulb class="w-3.5 h-3.5 text-ai" />
                <span>{cp.principle}</span>
              </span>
              <p class="text-[11px] text-muted leading-relaxed">
                {cp.explanation}
              </p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Classroom Implementation Steps -->
      <div class="space-y-3 pt-2 border-t border-border">
        <h3 class="text-xs font-bold uppercase tracking-wider text-muted font-mono">
          Chronological Classroom Implementation Steps
        </h3>

        <div class="space-y-2">
          {#each selectedPlaybook.classroomImplementationSteps as step}
            <div class="p-4 bg-surface-raised border border-border rounded-none space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-foreground">
                <span class="w-5 h-5 rounded-none bg-foreground text-background flex items-center justify-center font-mono text-[10px]">
                  {step.step}
                </span>
                <span>{step.title}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-border">
                <div class="space-y-0.5">
                  <span class="text-[10px] uppercase font-bold text-ai tracking-wider">Teacher Action</span>
                  <p class="text-muted leading-relaxed">{step.teacherAction}</p>
                </div>
                <div class="space-y-0.5">
                  <span class="text-[10px] uppercase font-bold text-positive tracking-wider">Student Action</span>
                  <p class="text-muted leading-relaxed">{step.studentAction}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- What NOT To Do vs Recommended Intervention -->
      <div class="space-y-3 pt-2 border-t border-border">
        <h3 class="text-xs font-bold uppercase tracking-wider text-muted font-mono">
          Diagnostic Misconception Interventions: What to Avoid vs What to Do
        </h3>

        <div class="space-y-3">
          {#each selectedPlaybook.misconceptionInterventions as item}
            <div class="p-4 bg-surface-raised border border-border rounded-none space-y-2">
              <span class="text-xs font-bold text-foreground block">
                Observed Symptom: {item.misconception}
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-border">
                <div class="p-2 bg-critical-subtle border border-critical/30 rounded-none space-y-1">
                  <span class="text-[10px] font-bold uppercase text-critical flex items-center gap-1">
                    <ShieldAlert class="w-3.5 h-3.5" />
                    <span>What NOT To Do (Ineffective)</span>
                  </span>
                  <p class="text-critical/90 leading-relaxed text-[11px]">{item.whatNotToDo}</p>
                </div>

                <div class="p-2 bg-positive-subtle border border-positive/30 rounded-none space-y-1">
                  <span class="text-[10px] font-bold uppercase text-positive flex items-center gap-1">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>Recommended Pedagogical Intervention</span>
                  </span>
                  <p class="text-positive/90 leading-relaxed text-[11px]">{item.recommendedIntervention}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
