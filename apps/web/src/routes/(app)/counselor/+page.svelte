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
    ShieldCheck,
    Users,
    Sparkles,
    FileText,
    Send
  } from 'lucide-svelte';
  import { DropdownCheckbox, EvidenceRating, Kbd } from '$lib/components';
  import type { DropdownCheckboxItem } from '$lib/components/DropdownCheckbox.svelte';

  let { data } = $props();

  const cases = [
    {
      id: 'case-001',
      studentName: 'Learner S-0801',
      studentClass: 'Class 8-A',
      caseType: 'Pathway alignment',
      priority: 'Priority 2',
      reviewDate: 'Oct 15, 2026',
      context: 'Parent aspiration (IIT-JEE) vs Quantitative Reasoning foundation gap. Strong spatial visualization demonstrated across hands-on builds.',
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
      context: 'Logical Deduction exceeds Class 8 curriculum ceiling. Demonstrates high readiness; disengagement risk if kept at standard pace.',
      evidenceBase: 'Adaptive Session #EVD-3891 (High Confidence)',
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
      context: 'Spatial Reasoning plateaued across three recent checks. Benefits from tactile 3D physical modeling and physical lab assemblies.',
      evidenceBase: 'Teacher Observation (Department Head)',
      recommendation: 'Enroll in weekend hands-on robotics hardware workshop.',
      conversationStatus: 'Initial draft pending',
      consistencyRating: 3
    }
  ];

  const caseloadProfiles = [
    { id: 'S-0801', name: 'Learner S-0801', class: 'Class 8-A', track: 'Applied Robotics', status: 'Active Support', tier: 'Strong Foundation', lastTouch: 'Oct 15, 2026', caseRef: cases[0] },
    { id: 'S-0802', name: 'Learner S-0802', class: 'Class 8-A', track: 'Spatial & Mechanical', status: 'Monitoring', tier: 'Developing', lastTouch: 'Oct 22, 2026', caseRef: cases[2] },
    { id: 'S-0803', name: 'Learner S-0803', class: 'Class 8-A', track: 'Computational Logic', status: 'Accelerated', tier: 'Advanced Foundation', lastTouch: 'Oct 12, 2026', caseRef: cases[1] },
    { id: 'S-0804', name: 'Learner S-0804', class: 'Class 8-A', track: 'Data & Sensing', status: 'Balanced', tier: 'Strong Foundation', lastTouch: 'Oct 04, 2026', caseRef: cases[0] },
    { id: 'S-0805', name: 'Learner S-0805', class: 'Class 8-A', track: 'Biomimicry & Physics', status: 'Balanced', tier: 'Developing', lastTouch: 'Sep 28, 2026', caseRef: cases[2] }
  ];

  const dialogueLogs = [
    {
      id: 'dlg-101',
      title: 'Tripartite Pathway Alignment: Engineering vs Pure Mathematics',
      participants: 'Parent (R. Sharma) · Learner S-0801 · Counselor (Dr. V. Menon)',
      date: 'Oct 15, 2026',
      consensus: 'Agreement reached to anchor preparation in hands-on mechatronics rather than high-stakes exam drills.',
      status: 'Consensus Reached'
    },
    {
      id: 'dlg-102',
      title: 'Acceleration Consultation: Modular Advanced Algorithms',
      participants: 'Parent (A. Desai) · Learner S-0803 · Faculty (Ms. Nair)',
      date: 'Oct 12, 2026',
      consensus: 'Approved parallel enrollment in Class 9 algorithmic decomposition sprint to prevent disengagement.',
      status: 'Plan Approved'
    }
  ];

  // View Mode: 'priority' | 'all'
  let viewMode = $state<'priority' | 'all'>('priority');

  // Multi-facet filtering
  let priorityItems = $state<DropdownCheckboxItem[]>([
    { id: 'Priority 1', label: 'Priority 1 (Urgent)', checked: false },
    { id: 'Priority 2', label: 'Priority 2 (Active)', checked: false },
    { id: 'Priority 3', label: 'Priority 3 (Monitoring)', checked: false }
  ]);

  let typeItems = $state<DropdownCheckboxItem[]>([
    { id: 'Pathway alignment', label: 'Pathway Alignment', checked: false },
    { id: 'Acceleration', label: 'Acceleration', checked: false },
    { id: 'Spatial growth', label: 'Foundation Growth', checked: false }
  ]);

  let selectedPriorities = $derived(priorityItems.filter((i) => i.checked).map((i) => i.id));
  let selectedTypes = $derived(typeItems.filter((i) => i.checked).map((i) => i.id));

  const filteredCases = $derived(
    cases.filter((c) => {
      const matchPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(c.priority);
      const matchType =
        selectedTypes.length === 0 || selectedTypes.includes(c.caseType);
      return matchPriority && matchType;
    })
  );

  // Active Selected Case in Master-Detail Pane (Default to first priority item)
  let activeCase = $state<typeof cases[0]>(cases[0]);
  let scheduleSuccess = $state(false);

  function selectCase(c: typeof cases[0]) {
    activeCase = c;
    scheduleSuccess = false;
  }

  function handleSchedule() {
    scheduleSuccess = true;
    setTimeout(() => {
      scheduleSuccess = false;
    }, 4000);
  }
</script>

<svelte:head>
  <title>Counselor Caseload · CREED OS</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6 py-4 px-4 sm:px-6">
  <!-- 1. ORIENT: Case Management Header -->
  <header class="space-y-1 pb-3 border-b border-border flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
    <div>
      <h1 class="font-heading font-medium text-2xl sm:text-3xl text-ink tracking-tight">
        Caseload Triage
      </h1>
      <p class="text-xs text-ink-secondary">
        24 active learners · 3 priority reviews · 1 accelerated track
      </p>
    </div>
    <span class="text-xs font-mono text-ink-muted">
      Academic Advisory & Pathway Guidance
    </span>
  </header>

  <!-- 2. MASTER-DETAIL SPLIT WORKSPACE -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- LEFT PANE: Master Caseload Queue (5 cols) -->
    <div class="lg:col-span-5 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-ink-muted font-mono">Priority Cases</h2>
        <span class="text-[11px] text-ink-muted font-mono">{filteredCases.length} active</span>
      </div>
      <!-- Mode Segmented Control & Filters -->
      <div class="flex items-center justify-between gap-2">
        <div class="inline-flex p-1 rounded-sm bg-surface border border-border text-xs">
          <button
            type="button"
            onclick={() => viewMode = 'priority'}
            class="px-3 py-1 rounded-sm font-medium transition-colors cursor-pointer {viewMode === 'priority' ? 'bg-surface-raised text-ink shadow-2xs font-semibold' : 'text-ink-secondary hover:text-ink'}"
          >
            Priority Queue ({filteredCases.length})
          </button>
          <button
            type="button"
            onclick={() => viewMode = 'all'}
            class="px-3 py-1 rounded-sm font-medium transition-colors cursor-pointer {viewMode === 'all' ? 'bg-surface-raised text-ink shadow-2xs font-semibold' : 'text-ink-secondary hover:text-ink'}"
          >
            All Cohort ({caseloadProfiles.length})
          </button>
        </div>

        {#if viewMode === 'priority'}
          <div class="flex items-center gap-1.5">
            <DropdownCheckbox title="Priority" bind:items={priorityItems} />
            <DropdownCheckbox title="Type" bind:items={typeItems} />
          </div>
        {/if}
      </div>

      <!-- Queue List -->
      {#if viewMode === 'priority'}
        <div class="border border-border rounded-none bg-surface divide-y divide-border overflow-hidden">
          {#each filteredCases as item}
            <div
              role="button"
              tabindex="0"
              onclick={() => selectCase(item)}
              onkeydown={(e) => { if (e.key === 'Enter') selectCase(item); }}
              class="p-3.5 flex flex-col gap-1.5 transition-colors cursor-pointer text-left {activeCase.id === item.id ? 'bg-surface-raised border-l-2 border-brand shadow-2xs' : 'hover:bg-surface-subtle'}"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-ink">{item.studentName}</span>
                  <span class="text-xs text-ink-muted">{item.studentClass}</span>
                </div>
                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded-sm {item.priority === 'Priority 1' ? 'bg-attention/15 text-attention font-semibold' : 'bg-surface-subtle text-ink-secondary border border-border'}">
                  {item.priority}
                </span>
              </div>
              <p class="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                {item.context}
              </p>
              <div class="flex items-center justify-between pt-1 text-[11px] text-ink-muted font-mono">
                <span>{item.caseType}</span>
                <span>Review {item.reviewDate}</span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- Full Directory Table View -->
        <div class="border border-border rounded-none overflow-x-auto bg-surface">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-subtle border-b border-border text-[11px] text-ink-muted uppercase font-mono">
              <tr>
                <th class="py-2 px-3 font-medium">Learner</th>
                <th class="py-2 px-3 font-medium">Track</th>
                <th class="py-2 px-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              {#each caseloadProfiles as profile}
                <tr
                  role="button"
                  tabindex="0"
                  onclick={() => selectCase(profile.caseRef || cases[0])}
                  onkeydown={(e) => { if (e.key === 'Enter') selectCase(profile.caseRef || cases[0]); }}
                  class="hover:bg-surface-subtle/80 transition-colors cursor-pointer {activeCase.studentName === profile.name ? 'bg-surface-raised font-semibold' : ''}"
                >
                  <td class="py-2 px-3 text-ink">{profile.name}</td>
                  <td class="py-2 px-3 text-ink-secondary">{profile.track}</td>
                  <td class="py-2 px-3 text-right">
                    <span class="px-1.5 py-0.5 rounded-sm text-[10px] font-medium {profile.status === 'Accelerated' ? 'bg-mint-subtle text-mint' : 'bg-surface-subtle text-ink-muted'}">
                      {profile.tier}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <!-- RIGHT PANE: Detail Dossier & Evidence Review (7 cols) -->
    <div class="lg:col-span-7 space-y-4 lg:sticky lg:top-4">
      <div class="border border-border rounded-none bg-surface-raised p-6 space-y-6 shadow-xs">
        <!-- Learner Dossier Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-heading font-medium text-xl text-ink">{activeCase.studentName}</h2>
              <span class="text-xs text-ink-muted">({activeCase.studentClass})</span>
            </div>
            <div class="text-xs text-ink-secondary pt-0.5">{activeCase.caseType} · {activeCase.priority}</div>
          </div>
          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-surface border border-border text-xs font-mono text-ink-secondary">
            <Calendar class="w-3.5 h-3.5 text-brand" />
            <span>Target Review: {activeCase.reviewDate}</span>
          </span>
        </div>

        {#if scheduleSuccess}
          <div class="p-3 rounded-sm bg-positive/10 text-positive flex items-center gap-2 border border-positive/20 text-xs">
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span>Tripartite consultation check-in scheduled for {activeCase.reviewDate}.</span>
          </div>
        {/if}

        <!-- 1. Context & Dilemma -->
        <div class="space-y-1.5 text-xs">
          <span class="text-[11px] font-mono uppercase tracking-wider text-ink-muted font-semibold">Context & Observations</span>
          <p class="text-ink leading-relaxed p-3.5 rounded-sm bg-surface border border-border text-xs">
            {activeCase.context}
          </p>
        </div>

        <!-- 2. Evidence Grounding -->
        <div class="space-y-2 text-xs">
          <span class="text-[11px] font-mono uppercase tracking-wider text-ink-muted font-semibold">Grounding Evidence Base</span>
          <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-ink-secondary">Source Trail:</span>
              <span class="font-medium text-ink font-mono">{activeCase.evidenceBase}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-ink-secondary">Demonstration Consistency:</span>
              <EvidenceRating rating={activeCase.consistencyRating} max={5} label="Corroborated" />
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-border">
              <span class="text-ink-secondary">Status:</span>
              <span class="font-medium text-brand">{activeCase.conversationStatus}</span>
            </div>
          </div>
        </div>

        <!-- 3. Recommended Next Step -->
        <div class="space-y-1.5 text-xs">
          <span class="text-[11px] font-mono uppercase tracking-wider text-ink-muted font-semibold">Recommended Next Step</span>
          <p class="text-ink leading-relaxed p-3.5 rounded-sm bg-surface border border-border text-xs">
            {activeCase.recommendation}
          </p>
        </div>

        <!-- 4. Action Bar -->
        <div class="pt-2 border-t border-border flex items-center justify-between gap-3">
          <span class="text-[11px] text-ink-muted font-mono">1-Click Tripartite Dispatch</span>
          <button
            type="button"
            onclick={handleSchedule}
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand hover:bg-brand/90 text-brand-foreground font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Send class="w-3.5 h-3.5" />
            <span>Schedule Tripartite Check-in</span>
          </button>
        </div>
      </div>

      <!-- Dialogue History for This Caseload -->
      <div class="border border-border rounded-none bg-surface p-4 space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-ink">Recent Tripartite Dialogue Sessions</span>
          <span class="text-[11px] text-ink-muted font-mono">Recorded Notes</span>
        </div>
        <div class="space-y-2">
          {#each dialogueLogs as log}
            <div class="p-3 rounded-sm bg-surface-raised border border-border space-y-1.5 text-xs">
              <div class="flex items-center justify-between gap-2 pb-1 border-b border-border">
                <span class="font-medium text-ink truncate">{log.title}</span>
                <span class="text-[10px] font-mono text-positive bg-positive/10 px-1.5 py-0.5 rounded-sm shrink-0">{log.status}</span>
              </div>
              <p class="text-ink-secondary text-[11px] leading-relaxed">{log.consensus}</p>
              <div class="text-[10px] text-ink-muted font-mono pt-0.5">{log.participants} · {log.date}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
