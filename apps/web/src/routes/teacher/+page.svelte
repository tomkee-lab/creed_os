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
    Send
  } from 'lucide-svelte';

  let { data } = $props();
  let cohort = $derived(data.cohort);

  let newObservationStudentId = $state('3fa85f64-5717-4562-b3fc-2c963f66afa6');
  let newObservationCompetency = $state('spatial_reasoning');
  let newObservationText = $state('');
  let observationLoggedSuccess = $state(false);

  function handleLogObservation(e: Event) {
    e.preventDefault();
    if (!newObservationText.trim()) return;

    // Simulate saving observation
    observationLoggedSuccess = true;
    setTimeout(() => {
      newObservationText = '';
      observationLoggedSuccess = false;
    }, 3000);
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Teacher Copilot Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl glass-panel-elevated">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Users class="w-6 h-6 text-emerald-400" />
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Teacher Copilot Portal</h1>
      </div>
      <p class="text-sm text-slate-300">
        Classroom analytics, automated misconception clusters, and differentiated intervention recommendations for <strong class="text-white">{cohort.name}</strong>.
      </p>
    </div>

    <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
      <span>{cohort.totalStudents} Active Students</span>
    </div>
  </div>

  <!-- Differentiated Grouping Clusters (Action over Vanity Analytics) -->
  <div class="p-6 rounded-xl glass-panel space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-white">Automated Misconception Clusters</h2>
        <p class="text-xs text-slate-400">Core_OS groups students dynamically by shared conceptual gap rather than arbitrary grades</p>
      </div>
      <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">3 Active Clusters</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each cohort.misconceptionClusters as cluster}
        <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-mono text-amber-400 font-bold">{cluster.studentCount} Students</span>
              <span class="font-mono text-[10px] text-slate-400 uppercase">{cluster.affectedCompetency.replace('_', ' ')}</span>
            </div>
            <h3 class="text-sm font-bold text-white">{cluster.clusterName}</h3>
            <p class="text-xs text-slate-300">
              <strong class="text-slate-200">Recommended Activity:</strong> {cluster.recommendedDifferentiatedActivity}
            </p>
          </div>

          <button
            type="button"
            class="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Assign Differentiated Task</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Student Roster Table (2 cols) -->
    <div class="lg:col-span-2 p-6 rounded-xl glass-panel space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-white">Student Competency Roster</h2>
        <span class="text-xs font-mono text-slate-400">3PL IRT Latent Mastery</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-white/8 text-slate-400 font-mono">
              <th class="pb-3 font-medium">Student Name</th>
              <th class="pb-3 font-medium">Top Strength</th>
              <th class="pb-3 font-medium">Primary Foundation Gap</th>
              <th class="pb-3 font-medium">Active Intervention</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            {#each cohort.students as s}
              <tr class="hover:bg-white/5 transition-colors">
                <td class="py-3 font-bold text-white">{s.name}</td>
                <td class="py-3 text-cyan-300 capitalize">{s.strongestCompetency.replace('_', ' ')}</td>
                <td class="py-3">
                  <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    {s.weakestCompetency.replace('_', ' ')} ({s.weakestScore})
                  </span>
                </td>
                <td class="py-3 text-slate-300">{s.activeGapRemediation}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick Classroom Observation Studio (1 col) -->
    <div class="p-6 rounded-xl glass-panel space-y-4">
      <div class="flex items-center gap-2">
        <BookOpen class="w-5 h-5 text-emerald-400" />
        <h2 class="text-lg font-bold text-white">Record Observation</h2>
      </div>
      <p class="text-xs text-slate-400">
        Logged teacher observations immediately generate verified Level 4 evidence atoms in the student's profile.
      </p>

      <form onsubmit={handleLogObservation} class="space-y-4">
        <div class="space-y-1">
          <label for="student-select" class="text-xs text-slate-300">Select Student</label>
          <select
            id="student-select"
            bind:value={newObservationStudentId}
            class="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
          >
            {#each cohort.students as s}
              <option value={s.id}>{s.name}</option>
            {/each}
          </select>
        </div>

        <div class="space-y-1">
          <label for="competency-select" class="text-xs text-slate-300">Target Competency</label>
          <select
            id="competency-select"
            bind:value={newObservationCompetency}
            class="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white"
          >
            <option value="spatial_reasoning">Spatial Reasoning</option>
            <option value="quantitative_reasoning">Quantitative Reasoning</option>
            <option value="computational_thinking">Computational Thinking</option>
            <option value="logical_deduction">Logical Deduction</option>
            <option value="scientific_inquiry">Scientific Inquiry</option>
          </select>
        </div>

        <div class="space-y-1">
          <label for="notes-text" class="text-xs text-slate-300">Observation Notes</label>
          <textarea
            id="notes-text"
            bind:value={newObservationText}
            rows="3"
            placeholder="e.g. Independently reasoned through gear rotation ratio challenge in laboratory session."
            class="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          ></textarea>
        </div>

        {#if observationLoggedSuccess}
          <div class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-400" />
            <span>Observation logged as Level 4 evidence!</span>
          </div>
        {/if}

        <button
          type="submit"
          disabled={!newObservationText.trim()}
          class="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <Send class="w-3.5 h-3.5" />
          <span>Commit Evidence to Learner Graph</span>
        </button>
      </form>
    </div>
  </div>
</div>
