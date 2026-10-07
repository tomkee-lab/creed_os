<script lang="ts">
  import {
    Calendar,
    CheckCircle2,
    Clock,
    Search,
    ChevronRight,
    ArrowRight,
    UserCheck,
    MessageSquare
  } from 'lucide-svelte';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();

  const cases = [
    {
      id: 'case-001',
      studentName: 'Anaya Verma',
      studentClass: 'Class 8-A',
      caseType: 'Pathway alignment',
      priority: 'Priority 2',
      reviewDate: 'Oct 15, 2026',
      context: 'Parent aspiration (IIT-JEE) vs Quantitative Reasoning foundation gap (2.8). High Spatial (4.5).',
      evidenceBase: 'Diagnostic #EVD-3904 + Linkage Project Trial',
      recommendation: 'Schedule 3-way dialogue to explore Mechatronics & Robotics bridge sprint.',
      conversationStatus: 'Awaiting parent confirmation'
    },
    {
      id: 'case-002',
      studentName: 'Zoya Khan',
      studentClass: 'Class 8-A',
      caseType: 'Acceleration',
      priority: 'Priority 1',
      reviewDate: 'Oct 12, 2026',
      context: 'Logical Deduction 4.6 exceeds Class 8 ceiling. Under-challenged; disengagement risk.',
      evidenceBase: 'CAT Session #EVD-3891 (SEM: 0.18)',
      recommendation: 'Fast-track to Class 9 Computational Thinking modular curriculum.',
      conversationStatus: 'Faculty sign-off received'
    },
    {
      id: 'case-003',
      studentName: 'Rohan Sharma',
      studentClass: 'Class 8-A',
      caseType: 'Spatial growth',
      priority: 'Priority 3',
      reviewDate: 'Oct 22, 2026',
      context: 'Spatial Reasoning plateaued over 3 assessments. Needs physical 3D manipulative labs.',
      evidenceBase: 'Teacher Observation (Ms. Nair)',
      recommendation: 'Enroll in weekend hands-on robotics hardware workshop.',
      conversationStatus: 'Initial draft pending'
    }
  ];

  // Right-side Inspector state
  let inspectorOpen = $state(false);
  let activeCase = $state<typeof cases[0] | null>(null);
  let scheduleSuccess = $state(false);

  function openCase(c: typeof cases[0]) {
    activeCase = c;
    scheduleSuccess = false;
    inspectorOpen = true;
  }

  function handleSchedule() {
    scheduleSuccess = true;
    setTimeout(() => {
      scheduleSuccess = false;
    }, 4000);
  }
</script>

<svelte:head>
  <title>Counselor Caseload — CREED OS</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-10 py-2">
  <!-- 1. ORIENT: Case Management Header -->
  <header class="space-y-1">
    <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
      Caseload
    </h1>
    <p class="text-sm text-ink-secondary">
      24 active learners • 3 priority cases • 1 accelerated case
    </p>
  </header>

  <!-- 2. DECIDE / ACT: Priority Cases List -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Priority Cases
      </h2>
      <span class="text-xs text-ink-muted">
        Review Queue
      </span>
    </div>

    <div class="divide-y divide-border border-y border-border bg-surface">
      {#each cases as item}
        <div
          role="button"
          tabindex="0"
          onclick={() => openCase(item)}
          onkeydown={(e) => { if (e.key === 'Enter') openCase(item); }}
          class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          <div class="space-y-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-ink">
                {item.studentName}
              </span>
              <span class="text-xs text-ink-muted">
                {item.studentClass}
              </span>
              <span class="text-xs font-medium px-2 py-0.5 rounded-sm bg-surface-subtle text-brand">
                {item.caseType}
              </span>
            </div>
            <p class="text-xs text-ink-secondary truncate">
              {item.context}
            </p>
          </div>

          <div class="flex items-center gap-4 shrink-0 text-xs">
            <span class="text-ink-muted flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              <span>Review {item.reviewDate}</span>
            </span>
            <span class="font-medium text-brand inline-flex items-center gap-1">
              <span>Inspect</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<!-- Right Slide-out Inspector Panel for Case Management -->
<InspectorPanel
  bind:open={inspectorOpen}
  title={activeCase?.studentName || 'Case File'}
  subtitle={activeCase ? `${activeCase.studentClass} • ${activeCase.caseType}` : ''}
>
  {#if activeCase}
    <div class="space-y-6 text-xs">
      {#if scheduleSuccess}
        <div class="p-3 rounded-sm bg-positive-subtle text-positive flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 shrink-0" />
          <span>Consultation check-in scheduled for {activeCase.reviewDate}.</span>
        </div>
      {/if}

      <div class="space-y-1.5">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Context & Dilemma</span>
        <p class="text-sm text-ink leading-relaxed">
          {activeCase.context}
        </p>
      </div>

      <div class="space-y-2">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Grounding Evidence Base</span>
        <div class="p-3 rounded-sm bg-surface-subtle border border-border text-xs space-y-1">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Source Trail:</span>
            <span class="font-medium text-ink">{activeCase.evidenceBase}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Scheduled Review:</span>
            <span class="font-medium text-ink">{activeCase.reviewDate}</span>
          </div>
        </div>
      </div>

      <div class="space-y-1.5">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Recommended Next Step</span>
        <p class="text-ink leading-relaxed p-3 rounded-sm bg-surface-subtle border border-border">
          {activeCase.recommendation}
        </p>
      </div>

      <div class="space-y-1.5">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Conversation Status</span>
        <div class="flex items-center gap-2 text-ink-secondary">
          <MessageSquare class="w-3.5 h-3.5 text-brand" />
          <span>{activeCase.conversationStatus}</span>
        </div>
      </div>

      <div class="pt-4 border-t border-border">
        <button
          type="button"
          onclick={handleSchedule}
          class="w-full py-2.5 px-4 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-xs transition-colors cursor-pointer"
        >
          Schedule Check-in
        </button>
      </div>
    </div>
  {/if}
</InspectorPanel>
