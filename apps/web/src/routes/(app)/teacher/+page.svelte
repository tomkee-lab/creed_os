<script lang="ts">
  import {
    Users,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Plus,
    Search,
    ChevronRight,
    Clock,
    FileText,
    Send
  } from 'lucide-svelte';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();
  let cohort = $derived(data.cohort as any);

  let searchQuery = $state('');
  let activeAssignmentToast = $state<{ title: string; count: number } | null>(null);

  // Sheet / Drawer state for "Log Observation"
  let logObservationOpen = $state(false);
  let observationStudentId = $state('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  let observationCompetency = $state('spatial_reasoning');
  let observationText = $state('');
  let observationSuccess = $state(false);

  // Sheet / Drawer state for learner inspector
  let learnerInspectorOpen = $state(false);
  let selectedStudent = $state<any>(null);

  const interventions = [
    {
      id: 'int-1',
      title: 'Proportional equations',
      learnerCount: 7,
      status: 'Developing',
      suggestedActivity: '15-minute scaffold',
      diagnosticDetails: 'Transposition errors during rate ratios. Interactive scale balance solves this foundation.'
    },
    {
      id: 'int-2',
      title: '3D spatial representation',
      learnerCount: 5,
      status: 'Emerging',
      suggestedActivity: 'Isometric block assembly',
      diagnosticDetails: 'Learners struggle distinguishing orthographic top-down views from side elevations during 3D rotations.'
    },
    {
      id: 'int-3',
      title: 'Algorithmic decomposition',
      learnerCount: 3,
      status: 'Strong Foundation',
      suggestedActivity: 'Divide-and-conquer challenge',
      diagnosticDetails: 'Students demonstrate fluency with linear iteration and are ready for binary search extension tasks.'
    }
  ];

  function handleAssign(item: typeof interventions[0]) {
    activeAssignmentToast = { title: item.suggestedActivity, count: item.learnerCount };
    setTimeout(() => {
      activeAssignmentToast = null;
    }, 4000);
  }

  function handleSaveObservation(e: Event) {
    e.preventDefault();
    if (!observationText.trim()) return;

    observationSuccess = true;
    setTimeout(() => {
      observationSuccess = false;
      observationText = '';
      logObservationOpen = false;
    }, 1200);
  }

  function openLearner(student: any) {
    selectedStudent = student;
    learnerInspectorOpen = true;
  }

  const filteredStudents = $derived(
    (cohort?.students || []).filter((s: any) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.strongestCompetency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.weakestCompetency.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<svelte:head>
  <title>Teacher Workspace — CREED OS</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-10 py-2">
  <!-- 1. ORIENT: Single Purpose Workspace Header -->
  <header id="classes" class="space-y-1">
    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        Today
      </h1>
      <span class="text-xs font-medium text-ink-muted">
        {cohort?.name || 'Class 8-A'} • Delhi Public International School
      </span>
    </div>
    <p class="text-sm text-ink-secondary">
      24 learners • 3 groups need attention
    </p>
  </header>

  <!-- Feedback Banner -->
  {#if activeAssignmentToast}
    <div class="p-3.5 rounded-sm bg-positive-subtle text-positive text-xs flex items-center justify-between border border-border">
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>Assigned <strong>{activeAssignmentToast.title}</strong> to {activeAssignmentToast.count} learners' practice queue.</span>
      </div>
    </div>
  {/if}

  <!-- 2. DECIDE: Priority Actions Layout (Queue + Quick Tools) -->
  <section id="interventions" class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Priority Actions
      </h2>
      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={() => (logObservationOpen = true)}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand hover:bg-brand/90 text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Log observation</span>
        </button>
      </div>
    </div>

    <!-- Intervention Queue Cards (Quiet, 4px radius, clear actions) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each interventions as item}
        <div class="p-5 rounded-sm bg-surface border border-border flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-ink">{item.learnerCount} learners</span>
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-surface-subtle text-ink-secondary">
                {item.status}
              </span>
            </div>

            <h3 class="text-base font-semibold text-ink">
              {item.title}
            </h3>

            <p class="text-xs text-ink-secondary">
              <span class="text-ink-muted">Suggested:</span> {item.suggestedActivity}
            </p>
          </div>

          <div class="pt-3 border-t border-border">
            <button
              type="button"
              onclick={() => handleAssign(item)}
              class="w-full py-2 px-3 rounded-sm bg-surface-subtle hover:bg-surface-raised border border-border text-xs font-medium text-ink transition-colors cursor-pointer"
            >
              Assign
            </button>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 3. ACT / PROVE: Class Overview Roster (Clean Workspace Table) -->
  <section id="roster" class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-ink">
          Class Overview
        </h2>
        <p class="text-xs text-ink-muted">
          Longitudinal capability status across Class 8-A
        </p>
      </div>

      <!-- Quick Roster Search -->
      <div class="relative w-full sm:w-64">
        <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Filter learners..."
          class="w-full pl-8 pr-3 py-1.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder-ink-muted focus:outline-hidden focus:border-brand"
        />
      </div>
    </div>

    <div class="rounded-none border border-border overflow-hidden bg-surface">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-border bg-surface-subtle text-ink-muted font-medium">
              <th class="p-3.5">Learner</th>
              <th class="p-3.5">Strength</th>
              <th class="p-3.5">Growth Focus</th>
              <th class="p-3.5">Foundation</th>
              <th class="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each filteredStudents as student}
              <tr class="hover:bg-surface-subtle transition-colors">
                <td class="p-3.5 font-medium text-ink">
                  {student.name}
                </td>
                <td class="p-3.5 text-positive font-medium">
                  {student.strongestCompetency.replace('_', ' ')}
                </td>
                <td class="p-3.5 text-attention font-medium">
                  {student.weakestCompetency.replace('_', ' ')}
                </td>
                <td class="p-3.5">
                  <span class="px-2 py-0.5 rounded-sm text-[11px] font-medium bg-positive-subtle text-positive">
                    {student.overallReadiness}
                  </span>
                </td>
                <td class="p-3.5 text-right">
                  <button
                    type="button"
                    onclick={() => openLearner(student)}
                    class="text-xs font-medium text-brand hover:underline cursor-pointer"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- 4. MISSIONS QUEUE: Hands-on learning missions -->
  <section id="missions" class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Active Missions
      </h2>
      <span class="text-xs text-ink-muted">Applied project work</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
        <div class="flex justify-between items-center text-xs">
          <span class="font-medium text-ink">Mechanical Linkage & Gear Ratios</span>
          <span class="px-2 py-0.5 rounded-sm bg-positive-subtle text-positive text-[11px] font-medium">18 Submitted</span>
        </div>
        <p class="text-xs text-ink-secondary">Hands-on spatial mechanism lab building physical linkages.</p>
      </div>
      <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
        <div class="flex justify-between items-center text-xs">
          <span class="font-medium text-ink">Algorithmic Maze Traversal</span>
          <span class="px-2 py-0.5 rounded-sm bg-brand-subtle text-brand text-[11px] font-medium">In Progress</span>
        </div>
        <p class="text-xs text-ink-secondary">Decomposition and state exploration sprint.</p>
      </div>
    </div>
  </section>

  <!-- 5. EVIDENCE TRAIL: Teacher observations & verified artefacts -->
  <section id="evidence" class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Class Evidence Log
      </h2>
      <button
        type="button"
        onclick={() => (logObservationOpen = true)}
        class="text-xs font-medium text-brand hover:underline cursor-pointer"
      >
        + Add Evidence
      </button>
    </div>
    <div class="p-4 rounded-sm bg-surface border border-border text-xs space-y-2">
      <div class="flex justify-between text-ink-muted">
        <span>Verified Observations (Last 7 Days)</span>
        <span>14 Recorded</span>
      </div>
      <p class="text-ink-secondary">All observational data cryptographically anchors to individual learner developmental records with teacher timestamp provenance.</p>
    </div>
  </section>
</div>

<!-- Right-side Drawer / Inspector: Log Observation -->
<InspectorPanel
  bind:open={logObservationOpen}
  title="Log Classroom Observation"
  subtitle="Anchor a direct demonstration to learner longitudinal record"
>
  <form onsubmit={handleSaveObservation} class="space-y-4 text-xs">
    {#if observationSuccess}
      <div class="p-3 rounded-sm bg-positive-subtle text-positive flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>Observation recorded successfully into verified profile.</span>
      </div>
    {/if}

    <div class="space-y-1">
      <label for="obs-learner" class="block font-medium text-ink">Learner</label>
      <select
        id="obs-learner"
        bind:value={observationStudentId}
        class="w-full p-2.5 rounded-sm bg-surface border border-border text-xs text-ink"
      >
        {#each (cohort?.students || []) as s}
          <option value={s.id}>{s.name}</option>
        {/each}
      </select>
    </div>

    <div class="space-y-1">
      <label for="obs-comp" class="block font-medium text-ink">Competency Area</label>
      <select
        id="obs-comp"
        bind:value={observationCompetency}
        class="w-full p-2.5 rounded-sm bg-surface border border-border text-xs text-ink"
      >
        <option value="spatial_reasoning">Spatial Reasoning</option>
        <option value="computational_thinking">Computational Thinking</option>
        <option value="quantitative_reasoning">Quantitative Reasoning</option>
        <option value="scientific_inquiry">Scientific Inquiry</option>
      </select>
    </div>

    <div class="space-y-1">
      <label for="obs-text" class="block font-medium text-ink">Observation Context & Rubric</label>
      <textarea
        id="obs-text"
        bind:value={observationText}
        rows={4}
        placeholder="Student demonstrated inverse rate calculation during gear linkage trial..."
        class="w-full p-2.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder-ink-muted"
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={!observationText.trim()}
      class="w-full py-2.5 px-4 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-xs transition-colors disabled:opacity-40 cursor-pointer"
    >
      Save Observation
    </button>
  </form>
</InspectorPanel>

<!-- Right-side Drawer / Inspector: Learner Quick Inspector -->
<InspectorPanel
  bind:open={learnerInspectorOpen}
  title={selectedStudent?.name || 'Learner Profile'}
  subtitle="Class 8-A • Delhi Public International School"
>
  {#if selectedStudent}
    <div class="space-y-6 text-xs">
      <div class="space-y-2">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Demonstrated Profile</span>
        <div class="p-3 rounded-sm bg-surface-subtle border border-border space-y-2">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Strongest Competency:</span>
            <span class="font-medium text-positive">{selectedStudent.strongestCompetency.replace('_', ' ')}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Active Growth Focus:</span>
            <span class="font-medium text-attention">{selectedStudent.weakestCompetency.replace('_', ' ')}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Overall Readiness:</span>
            <span class="font-medium text-ink">{selectedStudent.overallReadiness}</span>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Recommended Next Step</span>
        <p class="text-ink leading-relaxed">
          Assign 15-minute proportional reasoning scaffold before the upcoming kinematics unit.
        </p>
      </div>

      <div class="pt-4 border-t border-border flex gap-2">
        <a
          href="/student"
          class="flex-1 text-center py-2 px-3 rounded-sm bg-surface-subtle hover:bg-surface-raised border border-border font-medium text-ink"
        >
          View Full Profile
        </a>
      </div>
    </div>
  {/if}
</InspectorPanel>
