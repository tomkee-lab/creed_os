<script lang="ts">
  import {
    Users,
    Activity,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Layers,
    Plus,
    BookOpen,
    Send,
    Sparkles,
    Search,
    ChevronRight,
    Zap
  } from 'lucide-svelte';

  let { data } = $props();
  let cohort = $derived(data.cohort);

  let newObservationStudentId = $state('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  let newObservationCompetency = $state('spatial_reasoning');
  let newObservationText = $state('');
  let observationLoggedSuccess = $state(false);
  let searchQuery = $state('');

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
  <!-- Teacher Copilot Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Users class="w-6 h-6 text-(--accent-success)" />
        <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
          Teacher Action & Intervention Workspace
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Action-oriented decision interface for <strong class="text-(--text-primary)">{cohort.name}</strong> • 24 Active Learners
      </p>
    </div>

    <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--surface-sunken) border border-(--border-subtle) text-xs text-(--text-secondary) font-medium">
      <span>Grade 8 • Section A</span>
    </div>
  </div>

  <!-- 1. TEACHER ACTION QUEUE (Needs Attention Today - Priority Decision Interface) -->
  <section class="surface-card p-6 border-l-4 border-l-(--accent-warning) space-y-4">
    <div class="flex items-center justify-between border-b border-(--border-subtle) pb-3">
      <div class="flex items-center gap-2">
        <Zap class="w-5 h-5 text-(--accent-warning)" />
        <h2 class="text-lg font-bold text-(--text-primary)">
          Needs Attention Today (Prioritized Decision Queue)
        </h2>
      </div>
      <span class="text-xs font-semibold px-2 py-0.5 rounded-full badge-focus">
        3 Active Intervention Groups
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
      <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-2 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-(--accent-warning)">7 Learners</span>
            <span class="text-[10px] text-(--text-muted) font-medium">Priority 1</span>
          </div>
          <h3 class="text-sm font-bold text-(--text-primary) mt-1">Proportional Equations & Rates</h3>
          <p class="text-xs text-(--text-secondary) mt-1 leading-relaxed">
            Diagnosed variable transposition errors during inverse operations on balance scales.
          </p>
        </div>
        <button
          type="button"
          class="w-full py-2 rounded-lg bg-(--accent-primary) text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Launch 15-Min Scaffolding</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-2 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-(--accent-indigo)">5 Learners</span>
            <span class="text-[10px] text-(--text-muted) font-medium">Priority 2</span>
          </div>
          <h3 class="text-sm font-bold text-(--text-primary) mt-1">Spatial 3D Isometric Projection</h3>
          <p class="text-xs text-(--text-secondary) mt-1 leading-relaxed">
            Need tactile reinforcement distinguishing orthographic top-down views from side elevations.
          </p>
        </div>
        <button
          type="button"
          class="w-full py-2 rounded-lg surface-card text-(--text-primary) hover:bg-(--surface-sunken) text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Assign Isometric Lab</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-2 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-(--accent-success)">3 Learners</span>
            <span class="text-[10px] text-(--text-muted) font-medium">Priority 3</span>
          </div>
          <h3 class="text-sm font-bold text-(--text-primary) mt-1">Algorithmic Decomposition</h3>
          <p class="text-xs text-(--text-secondary) mt-1 leading-relaxed">
            Ready for advanced divide-and-conquer logic challenges and binary search simulations.
          </p>
        </div>
        <button
          type="button"
          class="w-full py-2 rounded-lg surface-card text-(--text-primary) hover:bg-(--surface-sunken) text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Assign Extension Task</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </section>

  <!-- 2. AUTOMATED MISCONCEPTION CLUSTERS -->
  <section class="space-y-4">
    <div class="flex items-baseline justify-between border-b border-(--border-subtle) pb-3">
      <div>
        <h2 class="text-xl font-bold text-(--text-primary) tracking-tight">
          Misconception Clusters
        </h2>
        <p class="text-xs text-(--text-muted) mt-0.5">
          Dynamic grouping by shared conceptual gap rather than arbitrary percentage grades.
        </p>
      </div>
      <span class="text-xs text-(--text-secondary) font-medium">
        Updated from latest diagnostic checks
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each cohort.misconceptionClusters as cluster}
        <div class="surface-card p-5 space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-(--accent-warning)">{cluster.studentCount} Students</span>
              <span class="text-[11px] text-(--text-muted) font-medium uppercase">
                {cluster.affectedCompetency.replace('_', ' ')}
              </span>
            </div>
            <h3 class="text-base font-bold text-(--text-primary)">{cluster.clusterName}</h3>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              <strong>Differentiated Activity:</strong> {cluster.recommendedDifferentiatedActivity}
            </p>
          </div>

          <button
            type="button"
            class="w-full py-2 rounded-lg surface-card hover:border-(--accent-primary) text-xs font-medium text-(--text-primary) flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Assign Differentiated Task</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      {/each}
    </div>
  </section>

  <!-- 3. STUDENT ROSTER & OBSERVATION LOGGER -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Student Roster (2 cols) -->
    <div class="lg:col-span-2 surface-card p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--border-subtle) pb-3">
        <div>
          <h2 class="text-lg font-bold text-(--text-primary)">Classroom Competency Roster</h2>
          <p class="text-xs text-(--text-muted)">Verified capabilities across core STEM dimensions.</p>
        </div>
        <div class="relative w-full sm:w-64">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search learners or topics..."
            class="w-full pl-9 pr-3 py-1.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) text-xs text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-(--accent-primary)"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-(--border-subtle) text-(--text-muted) font-medium">
              <th class="pb-2.5">Learner</th>
              <th class="pb-2.5">Demonstrated Strength</th>
              <th class="pb-2.5">Active Growth Area</th>
              <th class="pb-2.5">Readiness</th>
              <th class="pb-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-(--border-subtle)">
            {#each filteredStudents as student}
              <tr class="hover:bg-(--surface-sunken) transition-colors">
                <td class="py-3 font-semibold text-(--text-primary)">
                  {student.name}
                </td>
                <td class="py-3 text-(--accent-success) font-medium">
                  {student.strongestCompetency.replace('_', ' ')}
                </td>
                <td class="py-3 text-(--accent-warning) font-medium">
                  {student.weakestCompetency.replace('_', ' ')} ({student.weakestScore}/5.0)
                </td>
                <td class="py-3">
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-medium badge-growth">
                    {student.overallReadiness}
                  </span>
                </td>
                <td class="py-3 text-right">
                  <a
                    href="/student"
                    class="text-(--accent-primary) font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ChevronRight class="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Right Col: Log Teacher Observation (Anchored to Evidence Stream) -->
    <div class="surface-card p-6 space-y-4">
      <div class="border-b border-(--border-subtle) pb-3">
        <h3 class="text-base font-bold text-(--text-primary)">Log Classroom Observation</h3>
        <p class="text-xs text-(--text-muted)">Anchors directly as Level 4 teacher evidence atom.</p>
      </div>

      {#if observationLoggedSuccess}
        <div class="p-3.5 rounded-xl badge-growth text-xs space-y-1">
          <div class="flex items-center gap-1.5 font-bold">
            <CheckCircle2 class="w-4 h-4" />
            <span>Observation Logged to Evidence Stream!</span>
          </div>
          <p>The learner's longitudinal graph has incorporated this classroom observation.</p>
        </div>
      {/if}

      <form onsubmit={handleLogObservation} class="space-y-4 text-xs">
        <div class="space-y-1.5">
          <label for="learner-select" class="block font-medium text-(--text-secondary)">Learner</label>
          <select
            id="learner-select"
            bind:value={newObservationStudentId}
            class="w-full p-2.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) text-(--text-primary) focus:outline-none"
          >
            {#each cohort.students as s}
              <option value={s.id}>{s.name}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-1.5">
          <label for="competency-select" class="block font-medium text-(--text-secondary)">Competency Dimension</label>
          <select
            id="competency-select"
            bind:value={newObservationCompetency}
            class="w-full p-2.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) text-(--text-primary) focus:outline-none"
          >
            <option value="spatial_reasoning">Spatial Reasoning</option>
            <option value="computational_thinking">Computational Thinking</option>
            <option value="quantitative_reasoning">Quantitative Reasoning</option>
            <option value="scientific_inquiry">Scientific Inquiry</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label for="observation-notes" class="block font-medium text-(--text-secondary)">Observation Notes</label>
          <textarea
            id="observation-notes"
            bind:value={newObservationText}
            rows={3}
            placeholder="e.g. Observed student independently solving binary search logic..."
            class="w-full p-2.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) text-(--text-primary) placeholder-(--text-muted) focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={!newObservationText.trim()}
          class="w-full py-2.5 rounded-lg bg-(--accent-primary) hover:opacity-90 disabled:opacity-40 text-white font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Save Evidence Atom</span>
        </button>
      </form>
    </div>
  </div>
</div>
