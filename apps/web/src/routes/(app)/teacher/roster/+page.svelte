<script lang="ts">
  import {
    Users,
    Search,
    GraduationCap,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Compass,
    BookOpen,
    Cpu,
    Filter
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let searchQuery = $state('');
  let bandFilter = $state<string>('all');

  const students = $derived(data.cohort.students || []);

  const filteredStudents = $derived(
    students.filter((s: any) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBand = bandFilter === 'all' || s.overallReadiness.toLowerCase().includes(bandFilter.toLowerCase());
      return matchesSearch && matchesBand;
    })
  );
</script>

<svelte:head>
  <title>NCERT PARAKH HPC Roster — CREED OS</title>
  <meta name="description" content="NCERT PARAKH Holistic Progress Card (HPC) classroom cohort roster and developmental trajectories." />
</svelte:head>

<div class="space-y-6 pb-20">
  <!-- Top Navigation & Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-ink-muted font-mono">
          WAY Console • PARAKH HPC Matrix
        </span>
        <span class="text-xs text-ink-muted">•</span>
        <span class="text-xs text-ink-secondary font-medium">Holistic Progress Cards</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-ink font-heading">
        {data.cohort.name} Cohort Roster (Grade {data.cohort.grade})
      </h1>
      <p class="text-xs text-ink-secondary leading-relaxed max-w-2xl">
        Continuous, comprehensive 360-degree learner profiling aligned with NCERT PARAKH national standards and DPDP child data safeguards.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <a
        href="/teacher/lessons"
        class="px-3.5 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-semibold rounded-sm transition-micro flex items-center gap-1.5 shadow-xs"
      >
        <span>Open CRA Studio</span>
        <ArrowRight class="size-3.5" />
      </a>
    </div>
  </div>

  <!-- Summary Metric Strip -->
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
    <div class="p-4 bg-surface border border-border rounded-sm space-y-1 shadow-2xs">
      <span class="text-[10px] font-mono text-ink-muted uppercase">Cohort Roster</span>
      <div class="text-xl font-bold font-mono text-ink">{students.length} Learners</div>
      <span class="text-[11px] text-ink-muted">{data.cohort.consentRate}% Statutory Consent Active</span>
    </div>

    <div class="p-4 bg-surface border border-border rounded-sm space-y-1 shadow-2xs">
      <span class="text-[10px] font-mono text-ink-muted uppercase">Mean STEM Foundation</span>
      <div class="text-xl font-bold font-mono text-mint">Mountain Band</div>
      <span class="text-[11px] text-ink-muted">Emerging Independence</span>
    </div>

    <div class="p-4 bg-surface border border-border rounded-sm space-y-1 shadow-2xs">
      <span class="text-[10px] font-mono text-ink-muted uppercase">Active Interventions</span>
      <div class="text-xl font-bold font-mono text-attention">3 Priority</div>
      <span class="text-[11px] text-ink-muted">Volume & Ratio Misconceptions</span>
    </div>

    <div class="p-4 bg-surface border border-border rounded-sm space-y-1 shadow-2xs">
      <span class="text-[10px] font-mono text-ink-muted uppercase">Evidence Provenance</span>
      <div class="text-xl font-bold font-mono text-cyan">SHA-256</div>
      <span class="text-[11px] text-ink-muted">Immutable Ledger Chaining</span>
    </div>
  </div>

  <!-- Search & Filter Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-surface border border-border rounded-sm">
    <div class="relative w-full sm:w-72">
      <label for="roster-search" class="sr-only">Search student by name or ID</label>
      <Search class="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
      <input
        id="roster-search"
        type="text"
        placeholder="Search student by name or ID..."
        aria-label="Search student roster by name or identifier"
        bind:value={searchQuery}
        class="w-full pl-8 pr-3 py-1.5 bg-surface-subtle border border-border rounded-sm text-xs text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand font-medium transition-colors"
      />
    </div>

    <div class="flex items-center gap-1 text-xs font-mono">
      <span class="text-[11px] text-ink-muted mr-2">HPC Band:</span>
      {#each [
        { id: 'all', label: 'All' },
        { id: 'sky', label: 'Sky (Autonomous)' },
        { id: 'mountain', label: 'Mountain (Emerging)' },
        { id: 'stream', label: 'Stream (Guided)' }
      ] as opt}
        <button
          type="button"
          onclick={() => (bandFilter = opt.id)}
          class="px-3 py-1 text-[11px] rounded-sm transition-micro border {bandFilter === opt.id
            ? 'bg-surface-raised border-brand text-brand font-bold shadow-2xs'
            : 'bg-transparent border-border text-ink-secondary hover:text-ink'}"
        >
          {opt.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- Student Roster Table -->
  <div class="border border-border rounded-sm overflow-hidden bg-surface shadow-2xs">
    <table class="w-full text-left border-collapse text-xs">
      <thead class="bg-surface-subtle border-b border-border text-ink-muted text-[10px] font-mono uppercase tracking-wider">
        <tr>
          <th class="p-3 font-bold">Learner Identity</th>
          <th class="p-3 font-bold">PARAKH HPC Band</th>
          <th class="p-3 font-bold">STEM Foundation</th>
          <th class="p-3 font-bold">English Vantage</th>
          <th class="p-3 font-bold">Robotics Systems</th>
          <th class="p-3 font-bold text-right">Consent Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        {#if filteredStudents.length === 0}
          <tr>
            <td colspan="6" class="p-8 text-center text-xs text-ink-muted">
              No students found matching current search and filter parameters.
            </td>
          </tr>
        {:else}
          {#each filteredStudents as student}
            <tr class="hover:bg-surface-subtle/50 transition-micro">
              <td class="p-3">
                <div class="font-bold text-ink">{student.name}</div>
                <div class="text-[10px] font-mono text-ink-muted">{student.id}</div>
              </td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded-sm text-[10px] font-mono font-semibold {student.overallReadiness.includes('Sky') || student.overallReadiness.includes('Ready')
                  ? 'bg-mint/10 text-mint border border-mint/20'
                  : 'bg-brand/10 text-brand border border-brand/20'}">
                  {student.overallReadiness}
                </span>
              </td>
              <td class="p-3 text-ink font-mono">{student.stemScore || '540 (Mountain)'}</td>
              <td class="p-3 text-ink font-mono">{student.englishScore || '910L (B1+)'}</td>
              <td class="p-3 text-ink font-mono">{student.roboticsScore || '550 (Regional)'}</td>
              <td class="p-3 text-right">
                {#if student.hasConsent}
                  <span class="inline-flex items-center gap-1 text-[10px] font-mono text-mint font-semibold">
                    <ShieldCheck class="size-3" />
                    <span>DPDP_VERIFIED</span>
                  </span>
                {:else}
                  <span class="inline-flex items-center gap-1 text-[10px] font-mono text-attention font-semibold">
                    <AlertCircle class="size-3" />
                    <span>CONSENT_PENDING</span>
                  </span>
                {/if}
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
