<script lang="ts">
  import {
    Calendar,
    CheckCircle2,
    Clock,
    Search,
    ChevronRight,
    ArrowRight,
    UserCheck,
    MessageSquare,
    Filter,
    ShieldCheck
  } from 'lucide-svelte';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';
  import { DropdownCheckbox, EvidenceRating, Kbd, ButtonGroup } from '$lib/components';

  let { data } = $props();

  const cases = [
    {
      id: 'case-001',
      studentName: 'Learner S-0801',
      studentClass: 'Class 8-A',
      caseType: 'Pathway alignment',
      priority: 'Priority 2',
      reviewDate: 'Oct 15, 2026',
      context: 'Parent aspiration (IIT-JEE) vs Quantitative Reasoning foundation gap (2.8). High Spatial (4.5).',
      evidenceBase: 'Diagnostic #EVD-3904 + Linkage Project Trial',
      recommendation: 'Schedule 3-way dialogue to explore Mechatronics & Robotics bridge sprint.',
      conversationStatus: 'Awaiting parent confirmation',
      consistencyRating: 4
    },
    {
      id: 'case-002',
      studentName: 'Learner S-0803',
      studentClass: 'Class 8-A',
      caseType: 'Acceleration',
      priority: 'Priority 1',
      reviewDate: 'Oct 12, 2026',
      context: 'Logical Deduction 4.6 exceeds Class 8 ceiling. Under-challenged; disengagement risk.',
      evidenceBase: 'CAT Session #EVD-3891 (SEM: 0.18)',
      recommendation: 'Fast-track to Class 9 Computational Thinking modular curriculum.',
      conversationStatus: 'Faculty sign-off received',
      consistencyRating: 5
    },
    {
      id: 'case-003',
      studentName: 'Learner S-0802',
      studentClass: 'Class 8-A',
      caseType: 'Spatial growth',
      priority: 'Priority 3',
      reviewDate: 'Oct 22, 2026',
      context: 'Spatial Reasoning plateaued over 3 assessments. Needs physical 3D manipulative labs.',
      evidenceBase: 'Teacher Observation (Department Head)',
      recommendation: 'Enroll in weekend hands-on robotics hardware workshop.',
      conversationStatus: 'Initial draft pending',
      consistencyRating: 3
    }
  ];

  import type { DropdownCheckboxItem } from '$lib/components/DropdownCheckbox.svelte';

  // Multi-facet filtering
  let priorityItems = $state<DropdownCheckboxItem[]>([
    { id: 'Priority 1', label: 'Priority 1 (Urgent)', checked: false },
    { id: 'Priority 2', label: 'Priority 2 (Active)', checked: false },
    { id: 'Priority 3', label: 'Priority 3 (Monitoring)', checked: false }
  ]);

  let typeItems = $state<DropdownCheckboxItem[]>([
    { id: 'Pathway alignment', label: 'Pathway Alignment', checked: false },
    { id: 'Acceleration', label: 'Acceleration / Gifted', checked: false },
    { id: 'Spatial growth', label: 'Foundation Growth', checked: false }
  ]);

  let selectedPriorities = $derived(priorityItems.filter(i => i.checked).map(i => i.id));
  let selectedTypes = $derived(typeItems.filter(i => i.checked).map(i => i.id));

  const filteredCases = $derived(
    cases.filter((c) => {
      const matchPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(c.priority);
      const matchType =
        selectedTypes.length === 0 || selectedTypes.includes(c.caseType);
      return matchPriority && matchType;
    })
  );

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
  <header class="space-y-1 pb-3 border-b border-border">
    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        Caseload
      </h1>
      <span class="text-xs font-medium text-ink-muted">
        Affiliated Educational Institution • Academic Advisory
      </span>
    </div>
    <p class="text-sm text-ink-secondary">
      24 active learners • 3 priority cases • 1 accelerated case
    </p>
  </header>

  <!-- 2. DECIDE / ACT: Priority Cases List -->
  <section id="priority" class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-ink">
          Priority Cases
        </h2>
        <span class="text-xs text-ink-muted">
          Review Queue ({filteredCases.length} displayed)
        </span>
      </div>

      <!-- Filter Controls with DropdownCheckbox -->
      <div class="flex flex-wrap items-center gap-2">
        <DropdownCheckbox
          title="Priority"
          bind:items={priorityItems}
        />
        <DropdownCheckbox
          title="Case Type"
          bind:items={typeItems}
        />
      </div>
    </div>

    <div class="divide-y divide-border border-y border-border bg-surface">
      {#each filteredCases as item}
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
              <span class="text-xs font-medium px-2 py-0.5 rounded-none bg-surface-subtle text-brand">
                {item.caseType}
              </span>
              <span class="text-[11px] font-medium px-1.5 py-0.2 rounded-none border border-border text-ink-muted">
                {item.priority}
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

  <!-- 3. LEARNERS CASELOAD ROSTER -->
  <section id="learners" class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Active Caseload Directory
      </h2>
      <span class="text-xs text-ink-muted">24 Tracked Profiles</span>
    </div>
    <div class="p-4 rounded-none bg-surface border border-border text-xs space-y-2">
      <p class="text-ink-secondary">Developmental profiles monitored for asynchronous growth jumps, ceiling effects, or cross-domain dissonance.</p>
    </div>
  </section>

  <!-- 4. CONVERSATIONS & EVIDENCE -->
  <section id="conversations" class="space-y-4">
    <div id="evidence" class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Tripartite Dialogue Logs & Evidence
      </h2>
      <span class="text-xs text-ink-muted">Parent • Learner • Faculty</span>
    </div>
    <div class="p-4 rounded-none bg-surface border border-border text-xs space-y-2">
      <p class="text-ink-secondary">Synchronized conference notes and empirical psychometric assessments anchoring guidance recommendations.</p>
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
        <div class="p-3 rounded-none bg-positive-subtle text-positive flex items-center gap-2 border border-border">
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
        <div class="p-3 rounded-none bg-surface-subtle border border-border text-xs space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-ink-secondary">Source Trail:</span>
            <span class="font-medium text-ink">{activeCase.evidenceBase}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-ink-secondary">Demonstration Consistency:</span>
            <EvidenceRating rating={activeCase.consistencyRating} max={5} label="Corroborated" />
          </div>
          <div class="flex justify-between items-center pt-1 border-t border-border">
            <span class="text-ink-secondary">Scheduled Review:</span>
            <span class="font-medium text-ink">{activeCase.reviewDate}</span>
          </div>
        </div>
      </div>

      <div class="space-y-1.5">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Recommended Next Step</span>
        <p class="text-ink leading-relaxed p-3 rounded-none bg-surface-subtle border border-border">
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
          class="w-full py-2.5 px-4 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-xs transition-colors cursor-pointer"
        >
          Schedule Check-in
        </button>
      </div>
    </div>
  {/if}
</InspectorPanel>
