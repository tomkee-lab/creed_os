<script lang="ts">
  import {
    Users,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Plus,
    Search,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Zap
  } from 'lucide-svelte';
  import { WaySection } from '$lib/components';

  let { data } = $props();
  let cohort = $derived(data.cohort);

  let newObservationStudentId = $state('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  let newObservationCompetency = $state('spatial_reasoning');
  let newObservationText = $state('');
  let observationLoggedSuccess = $state(false);
  let searchQuery = $state('');

  // Active intervention group disclosure
  let expandedInterventionId = $state<string | null>(null);

  const interventions = [
    {
      id: 'int-1',
      title: 'Proportional Equations & Rates',
      learnerCount: 7,
      status: 'Developing',
      suggestedActivity: '15-Minute Scaffolding Sprint',
      diagnosticDetails: 'Diagnostic evidence shows variable transposition errors during inverse balance scale operations. Short visual balance models resolve this gap.',
      priority: 'Priority 1',
      variant: 'alert' as const
    },
    {
      id: 'int-2',
      title: '3D Isometric Projections',
      learnerCount: 5,
      status: 'Emerging',
      suggestedActivity: 'Isometric Block Assembly Lab',
      diagnosticDetails: 'Learners struggle distinguishing orthographic top-down views from side elevations during 3D rotations.',
      priority: 'Priority 2',
      variant: 'primary' as const
    },
    {
      id: 'int-3',
      title: 'Algorithmic Decomposition',
      learnerCount: 3,
      status: 'Strong Foundation',
      suggestedActivity: 'Binary Search Extension Task',
      diagnosticDetails: 'Students demonstrate fluency with linear iteration and are ready for divide-and-conquer algorithm challenges.',
      priority: 'Priority 3',
      variant: 'growth' as const
    }
  ];

  function handleLogObservation(e: Event) {
    e.preventDefault();
    if (!newObservationText.trim()) return;

    observationLoggedSuccess = true;
    setTimeout(() => {
      newObservationText = '';
      observationLoggedSuccess = false;
    }, 3000);
  }

  const filteredStudents = $derived(
    cohort.students.filter((s: any) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.weakestCompetency.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- 1. TEACHER HEADER: Actionable classroom context -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Users class="w-5 h-5 text-(--accent-primary)" />
        <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
          Teacher Action Workspace
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Prioritized interventions and classroom evidence for <strong class="text-(--text-primary)">{cohort.name}</strong> • 24 Active Learners
      </p>
    </div>

    <span class="px-3 py-1 rounded-sm text-xs font-semibold bg-(--surface-sunken) text-(--text-secondary) border border-(--border-subtle) self-start sm:self-auto">
      Grade 8 • Section A
    </span>
  </header>

  <!-- 2. NEEDS ATTENTION TODAY: Action-First Priority Queue -->
  <WaySection
    eyebrow="Action Queue"
    title="Needs Attention Today"
    subtitle="Identify intervention priorities and assign differentiated scaffolds in seconds."
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each interventions as item}
        <div class="surface-card rounded-sm p-5 border border-(--border-subtle) flex flex-col justify-between space-y-4 hover:border-(--border-strong) transition-colors">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-(--text-primary)">{item.learnerCount} Learners</span>
              <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm {item.variant === 'alert' ? 'bg-(--accent-warning-subtle) text-(--accent-warning)' : (item.variant === 'primary' ? 'bg-(--accent-indigo-subtle) text-(--accent-indigo)' : 'bg-(--accent-success-subtle) text-(--accent-success)')} border border-(--border-subtle)">
                {item.status}
              </span>
            </div>

            <h3 class="text-base font-bold text-(--text-primary)">
              {item.title}
            </h3>

            <div class="text-xs text-(--text-secondary)">
              <span class="text-(--text-muted)">Suggested:</span> <strong class="text-(--text-primary)">{item.suggestedActivity}</strong>
            </div>
          </div>

          <div class="space-y-3 pt-3 border-t border-(--border-subtle)">
            <button
              type="button"
              onclick={() => alert(`Assigned: ${item.suggestedActivity} to ${item.learnerCount} learners`)}
              class="w-full px-4 py-2 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Assign Scaffold</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>

            <!-- Progressive Disclosure for Diagnostic Evidence -->
            <div>
              <button
                type="button"
                onclick={() => (expandedInterventionId = expandedInterventionId === item.id ? null : item.id)}
                class="text-[11px] text-(--text-muted) hover:text-(--text-primary) flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{expandedInterventionId === item.id ? 'Hide diagnostic evidence' : 'Diagnostic evidence'}</span>
                {#if expandedInterventionId === item.id}
                  <ChevronUp class="w-3 h-3" />
                {:else}
                  <ChevronDown class="w-3 h-3" />
                {/if}
              </button>

              {#if expandedInterventionId === item.id}
                <p class="text-xs text-(--text-secondary) mt-2 p-2.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) leading-relaxed animate-in fade-in duration-150">
                  {item.diagnosticDetails}
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </WaySection>

  <!-- 3. CLASSROOM ROSTER & OBSERVATION LOGGING -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <!-- Class Roster (8 cols) -->
    <div class="lg:col-span-8 space-y-4">
      <WaySection
        eyebrow="Roster Intelligence"
        title="Classroom Competency Overview"
        subtitle="Verified demonstrations across core STEM dimensions."
      >
        <div class="surface-card rounded-sm border border-(--border-subtle) overflow-hidden">
          <div class="p-4 border-b border-(--border-subtle) flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-(--surface-sunken)">
            <span class="text-xs font-semibold text-(--text-primary)">
              {filteredStudents.length} Students Listed
            </span>
            <div class="w-full sm:w-64">
              <input
                type="search"
                bind:value={searchQuery}
                placeholder="Filter by student or domain..."
                class="w-full px-3 py-1.5 rounded-sm bg-(--surface-canvas) border border-(--border-subtle) text-xs text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-(--accent-primary)"
              />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-(--border-subtle) bg-(--surface-canvas) text-(--text-muted) font-medium">
                  <th class="p-3">Learner</th>
                  <th class="p-3">Demonstrated Strength</th>
                  <th class="p-3">Active Growth Focus</th>
                  <th class="p-3">Foundation</th>
                  <th class="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-(--border-subtle)">
                {#each filteredStudents as student}
                  <tr class="hover:bg-(--surface-sunken) transition-colors">
                    <td class="p-3 font-bold text-(--text-primary)">
                      {student.name}
                    </td>
                    <td class="p-3 text-(--accent-success) font-medium">
                      {student.strongestCompetency.replace('_', ' ')}
                    </td>
                    <td class="p-3 text-(--accent-warning) font-medium">
                      {student.weakestCompetency.replace('_', ' ')}
                    </td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-(--accent-success-subtle) text-(--accent-success) border border-(--border-subtle)">
                        {student.overallReadiness}
                      </span>
                    </td>
                    <td class="p-3 text-right">
                      <a
                        href="/student"
                        class="text-(--accent-primary) font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ChevronRight class="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </WaySection>
    </div>

    <!-- Log Observation (4 cols) -->
    <div class="lg:col-span-4 space-y-4">
      <WaySection
        eyebrow="Evidence Capture"
        title="Log Observation"
        subtitle="Anchor a direct classroom demonstration to the learner's longitudinal profile."
      >
        <div class="surface-card rounded-sm p-5 border border-(--border-subtle) space-y-4">
          {#if observationLoggedSuccess}
            <div class="p-3 rounded-sm bg-(--accent-success-subtle) text-(--accent-success) text-xs space-y-1 border border-(--border-subtle)">
              <div class="flex items-center gap-1.5 font-bold">
                <CheckCircle2 class="w-4 h-4" />
                <span>Observation Logged</span>
              </div>
              <p>Anchored into verified longitudinal profile.</p>
            </div>
          {/if}

          <form onsubmit={handleLogObservation} class="space-y-3 text-xs">
            <div class="space-y-1">
              <label for="learner-select" class="block font-medium text-(--text-secondary)">Learner</label>
              <select
                id="learner-select"
                bind:value={newObservationStudentId}
                class="w-full px-3 py-2 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) text-(--text-primary) focus:outline-none focus:border-(--accent-primary)"
              >
                {#each cohort.students as s}
                  <option value={s.id}>{s.name}</option>
                {/each}
              </select>
            </div>

            <div class="space-y-1">
              <label for="competency-select" class="block font-medium text-(--text-secondary)">Competency</label>
              <select
                id="competency-select"
                bind:value={newObservationCompetency}
                class="w-full px-3 py-2 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) text-(--text-primary) focus:outline-none focus:border-(--accent-primary)"
              >
                <option value="spatial_reasoning">Spatial Reasoning</option>
                <option value="computational_thinking">Computational Thinking</option>
                <option value="quantitative_reasoning">Quantitative Reasoning</option>
                <option value="scientific_inquiry">Scientific Inquiry</option>
              </select>
            </div>

            <div class="space-y-1">
              <label for="observation-notes" class="block font-medium text-(--text-secondary)">Notes</label>
              <textarea
                id="observation-notes"
                bind:value={newObservationText}
                rows={3}
                placeholder="Observed student solving proportional gear balance..."
                class="w-full px-3 py-2 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-(--accent-primary)"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={!newObservationText.trim()}
              class="w-full px-4 py-2 rounded-sm bg-(--accent-primary) hover:opacity-90 disabled:opacity-40 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus class="w-4 h-4" />
              <span>Save Observation Atom</span>
            </button>
          </form>
        </div>
      </WaySection>
    </div>
  </div>
</div>
