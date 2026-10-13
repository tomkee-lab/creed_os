<script lang="ts">
  import {
    Sparkles,
    BookOpen,
    Layers,
    Compass,
    Cpu,
    Plus,
    CheckCircle2,
    Clock,
    Target,
    AlertCircle,
    ChevronRight,
    Save,
    RotateCcw
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { DifferentiatedLessonPlan } from '$lib/server/repository';

  let { data } = $props<{ data: PageData }>();

  // State runes
  let createdPlans = $state<DifferentiatedLessonPlan[]>([]);
  const plans = $derived<DifferentiatedLessonPlan[]>([...createdPlans, ...data.lessonPlans]);
  let selectedPlanIdState = $state<string | null>(null);
  const selectedPlanId = $derived<string>(selectedPlanIdState ?? data.lessonPlans[0]?.id ?? '');
  let isCreatingNew = $state(false);
  let isSaving = $state(false);

  // New plan form state
  let newTitle = $state('');
  let newSubject = $state<'STEM Reasoning' | 'English Literacy' | 'Autonomous Robotics'>('STEM Reasoning');
  let newTargetGrade = $state('Class 8 / Middle Stage');
  let newFramework = $state<'PRIMM' | 'CRA (Concrete-Representational-Abstract)' | 'Productive Struggle Scaffolding'>('CRA (Concrete-Representational-Abstract)');
  let newMisconceptionTag = $state('volume_neglect');
  let newMisconceptionLabel = $state('Volume vs Mass Equivalence');
  let newTier1Strategy = $state('Physical tactile water displacement measurement');
  let newTier2Task = $state('Construct free-body vector force balance equations');
  let newTier3Challenge = $state('Design variable ballast closed-loop submarine simulation');

  const selectedPlan = $derived<DifferentiatedLessonPlan | undefined>(
    plans.find((p) => p.id === selectedPlanId) || plans[0]
  );

  async function handleSaveNewPlan() {
    if (!newTitle) return;
    isSaving = true;

    try {
      const payload: Partial<DifferentiatedLessonPlan> = {
        title: newTitle,
        subject: newSubject,
        targetGrade: newTargetGrade,
        durationMinutes: 45,
        alignedStandards: ['PISA Science Level 5', 'TIMSS Physics', 'NEP 2020 Experiential Learning'],
        targetedMisconception: {
          tag: newMisconceptionTag,
          label: newMisconceptionLabel,
          diagnosis: 'Derived from cohort diagnostic benchmark error analysis.'
        },
        pedagogicalFramework: newFramework,
        tier1Remediation: {
          tierTitle: 'Tier 1: Concrete Scaffold & Tactile Lab',
          studentTarget: 'Students requiring experiential grounding',
          scaffoldStrategy: newTier1Strategy,
          tactileActivity: 'Hands-on guided laboratory experiment using physical apparatus',
          checkQuestion: 'What physical pattern do you observe before writing the formula?'
        },
        tier2Core: {
          tierTitle: 'Tier 2: Representational Vector Modeling',
          studentTarget: 'Students on grade-level mathematical representation',
          collaborativeTask: newTier2Task,
          evidenceCheckpoint: 'Accurately solve 2 core checkpoint problems'
        },
        tier3Extension: {
          tierTitle: 'Tier 3: Open-Ended Optimization & Synthesis',
          studentTarget: 'Advanced students ready for tournament-level challenges',
          inquiryChallenge: newTier3Challenge,
          evaluationRubric: 'Algorithmic efficiency and rigorous mathematical justification'
        },
        teacherFacilitatorNotes: [
          'Enforce the 140-second silence rule before offering cues.',
          'Never give the final formula in the first 15 minutes of the lesson.'
        ]
      };

      const res = await fetch('/api/v1/teachers/lesson-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save lesson plan');

      const resData = await res.json();
      createdPlans = [resData.lessonPlan, ...createdPlans];
      selectedPlanIdState = resData.lessonPlan.id;
      isCreatingNew = false;
      newTitle = '';
    } catch (err: any) {
      alert(err.message || 'Error saving lesson plan');
    } finally {
      isSaving = false;
    }
  }
</script>

<svelte:head>
  <title>Differentiated Lesson Plan Studio — CREED OS</title>
</svelte:head>

<div class="space-y-6 pb-20">
  <!-- Top Navigation Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-muted font-mono">
          WAY Console • Faculty Instruction Studio
        </span>
        <span class="text-xs text-muted">•</span>
        <span class="text-xs text-muted">Tiered Pedagogy</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-foreground">
        Adaptive 3-Tier Differentiated Lesson Plan Studio
      </h1>
    </div>

    <div class="flex items-center gap-2">
      <button
        onclick={() => (isCreatingNew = !isCreatingNew)}
        class="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-none transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>{isCreatingNew ? 'View Existing Plans' : 'Author New Lesson Plan'}</span>
      </button>
      <a
        href="/teacher/guidance"
        class="px-4 py-2 border border-border hover:bg-surface-raised text-xs font-medium text-foreground rounded-none transition-colors cursor-pointer"
      >
        Pedagogy Playbooks
      </a>
    </div>
  </div>

  {#if isCreatingNew}
    <!-- AUTHORING STUDIO FORM -->
    <div class="p-6 bg-surface border border-border rounded-none space-y-6">
      <div class="border-b border-border pb-4">
        <h2 class="text-base font-bold text-foreground flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-ai" />
          <span>Author Adaptive 3-Tier Lesson Plan</span>
        </h2>
        <p class="text-xs text-muted">
          Synthesize a targeted lesson plan directly addressing cohort misconception clusters with Tier 1 Remediation, Tier 2 Core, and Tier 3 Extension.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="lesson-title" class="text-xs font-semibold text-foreground">Lesson Title</label>
          <input
            id="lesson-title"
            type="text"
            bind:value={newTitle}
            placeholder="e.g. Archimedes Buoyancy & Displaced Fluid Mechanics"
            class="w-full px-3 py-2 bg-surface-raised border border-border text-xs rounded-none text-foreground focus:border-ai focus:outline-hidden"
          />
        </div>

        <div class="space-y-1.5">
          <label for="lesson-subject" class="text-xs font-semibold text-foreground">Subject Track</label>
          <select
            id="lesson-subject"
            bind:value={newSubject}
            class="w-full px-3 py-2 bg-surface-raised border border-border text-xs rounded-none text-foreground focus:border-ai focus:outline-hidden"
          >
            <option value="STEM Reasoning">STEM Reasoning</option>
            <option value="English Literacy">English Literacy</option>
            <option value="Autonomous Robotics">Autonomous Robotics</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label for="lesson-framework" class="text-xs font-semibold text-foreground">Pedagogical Framework</label>
          <select
            id="lesson-framework"
            bind:value={newFramework}
            class="w-full px-3 py-2 bg-surface-raised border border-border text-xs rounded-none text-foreground focus:border-ai focus:outline-hidden"
          >
            <option value="CRA (Concrete-Representational-Abstract)">CRA (Concrete-Representational-Abstract)</option>
            <option value="PRIMM">PRIMM (Predict, Run, Investigate, Modify, Make)</option>
            <option value="Productive Struggle Scaffolding">Productive Struggle Scaffolding</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label for="lesson-misconception" class="text-xs font-semibold text-foreground">Targeted Misconception</label>
          <input
            id="lesson-misconception"
            type="text"
            bind:value={newMisconceptionLabel}
            placeholder="e.g. Mass-Weight vs Displaced Volume Confusion"
            class="w-full px-3 py-2 bg-surface-raised border border-border text-xs rounded-none text-foreground focus:border-ai focus:outline-hidden"
          />
        </div>
      </div>

      <!-- Tier Customization -->
      <div class="space-y-4 pt-2 border-t border-border">
        <h3 class="text-xs font-bold uppercase tracking-wider text-muted">Tiered Scaffolding Specification</h3>

        <div class="space-y-3">
          <div class="p-4 bg-surface-raised border border-border rounded-none space-y-1.5">
            <span class="text-[10px] font-bold uppercase text-attention">Tier 1 Remediation Strategy (Concrete / Tactile)</span>
            <input
              type="text"
              bind:value={newTier1Strategy}
              class="w-full px-3 py-1.5 bg-surface border border-border text-xs text-foreground focus:outline-hidden"
            />
          </div>

          <div class="p-4 bg-surface-raised border border-border rounded-none space-y-1.5">
            <span class="text-[10px] font-bold uppercase text-ai">Tier 2 Core Task (Representational / Modeling)</span>
            <input
              type="text"
              bind:value={newTier2Task}
              class="w-full px-3 py-1.5 bg-surface border border-border text-xs text-foreground focus:outline-hidden"
            />
          </div>

          <div class="p-4 bg-surface-raised border border-border rounded-none space-y-1.5">
            <span class="text-[10px] font-bold uppercase text-positive">Tier 3 Extension Challenge (Synthesis / Competition)</span>
            <input
              type="text"
              bind:value={newTier3Challenge}
              class="w-full px-3 py-1.5 bg-surface border border-border text-xs text-foreground focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-4 border-t border-border">
        <button
          onclick={() => (isCreatingNew = false)}
          class="px-4 py-2 border border-border hover:bg-surface-raised text-xs text-muted rounded-none transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onclick={handleSaveNewPlan}
          disabled={!newTitle || isSaving}
          class="px-5 py-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 text-xs font-medium rounded-none transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Save class="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Publish Lesson Plan'}</span>
        </button>
      </div>
    </div>
  {:else}
    <!-- DUAL PANE: PLAN GALLERY & ACTIVE PLAN DETAIL -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Plan Selector List (4 cols) -->
      <div class="lg:col-span-4 space-y-3">
        <div class="flex items-center justify-between pb-1">
          <span class="text-xs font-bold uppercase tracking-wider text-muted font-mono">
            Available Lesson Plans ({plans.length})
          </span>
        </div>

        <div class="space-y-2">
          {#each plans as plan}
            {@const isSelected = selectedPlanId === plan.id}
            <button
              onclick={() => (selectedPlanIdState = plan.id)}
              class="w-full p-4 text-left border rounded-none transition-all cursor-pointer {isSelected ? 'bg-surface-raised border-ai ring-1 ring-ai' : 'bg-surface border-border hover:border-border-strong'}"
            >
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.5 bg-surface border border-border text-muted">
                    {plan.subject}
                  </span>
                  <span class="text-[10px] text-muted flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    <span>{plan.durationMinutes}m</span>
                  </span>
                </div>

                <h3 class="text-xs font-bold text-foreground leading-snug">
                  {plan.title}
                </h3>

                <p class="text-[11px] text-muted line-clamp-1">
                  Remediation: {plan.targetedMisconception.label}
                </p>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Right: Detailed Differentiated Plan Inspection (8 cols) -->
      <div class="lg:col-span-8">
        {#if selectedPlan}
          <div class="p-6 bg-surface border border-border rounded-none space-y-6">
            <!-- Header -->
            <div class="border-b border-border pb-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold px-2 py-0.5 bg-surface-raised border border-border text-ai font-mono">
                  {selectedPlan.pedagogicalFramework}
                </span>
                <span class="text-xs text-muted font-mono">{selectedPlan.alignedStandards.join(' • ')}</span>
              </div>

              <h2 class="text-lg font-bold text-foreground">
                {selectedPlan.title}
              </h2>

              <p class="text-xs text-muted">
                Target Cohort: {selectedPlan.targetGrade} • Duration: {selectedPlan.durationMinutes} Minutes
              </p>
            </div>

            <!-- Targeted Misconception Box -->
            <div class="p-4 bg-attention-subtle border border-attention/30 rounded-none space-y-1">
              <div class="flex items-center gap-1.5 text-attention text-xs font-semibold">
                <AlertCircle class="w-4 h-4" />
                <span>Targeted Misconception Diagnosis</span>
              </div>
              <p class="text-xs text-foreground/90 font-medium">
                {selectedPlan.targetedMisconception.label}
              </p>
              <p class="text-[11px] text-muted leading-relaxed">
                {selectedPlan.targetedMisconception.diagnosis}
              </p>
            </div>

            <!-- 3-TIER SCAFFOLDING ARCHITECTURE -->
            <div class="space-y-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                3-Tier Differentiated Classroom Scaffolding
              </h3>

              <!-- Tier 1: Remediation -->
              <div class="p-4 bg-surface-raised border-l-4 border-l-attention border border-border rounded-none space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-foreground">{selectedPlan.tier1Remediation.tierTitle}</span>
                  <span class="text-[10px] text-attention font-semibold uppercase tracking-wider">Concrete / Tactile</span>
                </div>
                <p class="text-xs text-muted">Target: {selectedPlan.tier1Remediation.studentTarget}</p>
                <div class="text-xs text-foreground space-y-1 pt-1 border-t border-border">
                  <div><strong>Tactile Lab:</strong> {selectedPlan.tier1Remediation.tactileActivity}</div>
                  <div><strong>Check Question:</strong> <span class="italic text-muted">"{selectedPlan.tier1Remediation.checkQuestion}"</span></div>
                </div>
              </div>

              <!-- Tier 2: Core -->
              <div class="p-4 bg-surface-raised border-l-4 border-l-ai border border-border rounded-none space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-foreground">{selectedPlan.tier2Core.tierTitle}</span>
                  <span class="text-[10px] text-ai font-semibold uppercase tracking-wider">Representational / Core</span>
                </div>
                <p class="text-xs text-muted">Target: {selectedPlan.tier2Core.studentTarget}</p>
                <div class="text-xs text-foreground space-y-1 pt-1 border-t border-border">
                  <div><strong>Collaborative Task:</strong> {selectedPlan.tier2Core.collaborativeTask}</div>
                  <div><strong>Evidence Checkpoint:</strong> {selectedPlan.tier2Core.evidenceCheckpoint}</div>
                </div>
              </div>

              <!-- Tier 3: Extension -->
              <div class="p-4 bg-surface-raised border-l-4 border-l-positive border border-border rounded-none space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-foreground">{selectedPlan.tier3Extension.tierTitle}</span>
                  <span class="text-[10px] text-positive font-semibold uppercase tracking-wider">Synthesis / Advanced</span>
                </div>
                <p class="text-xs text-muted">Target: {selectedPlan.tier3Extension.studentTarget}</p>
                <div class="text-xs text-foreground space-y-1 pt-1 border-t border-border">
                  <div><strong>Inquiry Challenge:</strong> {selectedPlan.tier3Extension.inquiryChallenge}</div>
                  <div><strong>Evaluation Rubric:</strong> {selectedPlan.tier3Extension.evaluationRubric}</div>
                </div>
              </div>
            </div>

            <!-- Teacher Facilitator Notes (Lagom Protocol) -->
            <div class="p-4 bg-surface-raised border border-border rounded-none space-y-2">
              <span class="text-xs font-bold text-foreground block">
                Teacher Facilitator Notes (Lagom Protocol):
              </span>
              <ul class="space-y-1 text-xs text-muted">
                {#each selectedPlan.teacherFacilitatorNotes as note}
                  <li class="flex items-start gap-2">
                    <CheckCircle2 class="w-3.5 h-3.5 text-ai shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
