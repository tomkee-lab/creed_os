<script lang="ts">
  import {
    BarChart3,
    Users,
    AlertTriangle,
    Layers,
    Compass,
    BookOpen,
    Cpu,
    ArrowRight,
    Search,
    Filter,
    Plus,
    Sparkles,
    CheckCircle2
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  // Filter state
  let domainFilter = $state<'all' | 'stem' | 'english' | 'robotics'>('all');
  let searchQuery = $state('');

  const filteredStudents = $derived(
    data.cohort.students.filter((s: any) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.overallReadiness.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const cohortStats = $derived([
    {
      title: 'Class Cohort Size',
      value: `${data.cohort.totalStudents} Learners`,
      sub: `${data.cohort.name} (Grade ${data.cohort.grade})`,
      icon: Users
    },
    {
      title: 'Mean STEM Benchmark',
      value: '542 PISA Pts',
      sub: 'Top 32% Globally (TIMSS Level 5)',
      icon: Compass
    },
    {
      title: 'Mean English Reading',
      value: '920L Lexile',
      sub: 'CEFR B1+ Intermediate / Vantage',
      icon: BookOpen
    },
    {
      title: 'Mean Robotics Index',
      value: '560 RoboScale',
      sub: 'CSTA Level 2 / Regional Ready',
      icon: Cpu
    }
  ]);

  const misconceptionClustersExtended = [
    {
      clusterName: 'Cluster Alpha: Proportional Balancing & Volume Neglect',
      affectedCompetency: 'quantitative_reasoning',
      domain: 'STEM',
      studentCount: 7,
      severity: 'High',
      diagnosticItem: 'STEM-004 (Archimedes Fluid Displaced vs Lead Mass)',
      recommendedDifferentiatedActivity: 'CRA physical Eureka overflow beaker lab before algebraic F_b formula.'
    },
    {
      clusterName: 'Cluster Beta: Proximity Concord & Intervening Clauses',
      affectedCompetency: 'verbal_reasoning',
      domain: 'English',
      studentCount: 9,
      severity: 'Moderate',
      diagnosticItem: 'ENG-002 (Martian Lakebed Modifier Distancing)',
      recommendedDifferentiatedActivity: 'Modifier-bracketing scratch-out drills on academic journal excerpts.'
    },
    {
      clusterName: 'Cluster Gamma: Bang-Bang Hunting vs Linear Feedback',
      affectedCompetency: 'computational_thinking',
      domain: 'Robotics',
      studentCount: 12,
      severity: 'High',
      diagnosticItem: 'ROB-005 (Line Follower Hard Left/Right Flutter)',
      recommendedDifferentiatedActivity: 'PRIMM Predict & Run on live oscilloscope telemetry before Kp gain tuning.'
    },
    {
      clusterName: 'Cluster Delta: 3D Coordinate Plane Mental Rotation',
      affectedCompetency: 'spatial_reasoning',
      domain: 'STEM',
      studentCount: 5,
      severity: 'Low',
      diagnosticItem: 'STEM-001 (Isometric Projection Cross-Sections)',
      recommendedDifferentiatedActivity: 'Physical isometric block assembly and perspective camera matching.'
    }
  ];
</script>

<svelte:head>
  <title>Classroom Benchmarks & Misconception Heatmap — CREED OS</title>
</svelte:head>

<div class="space-y-6 pb-20">
  <!-- Top Navigation & Action Controls -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary font-mono">
          WAY Console • Faculty Cockpit
        </span>
        <span class="text-xs text-ink-muted">•</span>
        <span class="text-xs text-ink-secondary font-medium">{data.cohort.name}</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-ink">
        Classroom Global Benchmarks & Misconception Heatmap
      </h1>
    </div>

    <div class="flex items-center gap-2">
      <a
        href="/teacher/lesson-plans"
        class="px-4 py-2 bg-ink text-surface hover:bg-ink/90 text-xs font-semibold rounded-none transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>Lesson Plan Studio</span>
      </a>
      <a
        href="/teacher/guidance"
        class="px-4 py-2 border border-border bg-surface hover:bg-surface-subtle text-xs font-medium text-ink rounded-none transition-colors cursor-pointer"
      >
        Pedagogy Guidance
      </a>
    </div>
  </div>

  <!-- LEVEL 1 — SIGNAL: COHORT NORMATIVE METRICS -->
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each cohortStats as stat}
      {@const Icon = stat.icon}
      <div class="p-5 bg-surface border border-border rounded-none space-y-2">
        <div class="flex items-center justify-between text-ink-secondary">
          <span class="text-[10px] uppercase font-semibold tracking-wider">{stat.title}</span>
          <Icon class="w-4 h-4 text-ink-muted" />
        </div>
        <p class="text-2xl font-extrabold text-ink tracking-tight">{stat.value}</p>
        <p class="text-xs text-ink-secondary leading-relaxed">{stat.sub}</p>
      </div>
    {/each}
  </section>

  <!-- LEVEL 2 — MISCONCEPTION CLUSTER HEATMAP & ONE-CLICK REMEDIATION -->
  <section class="p-6 bg-surface border border-border rounded-none space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
      <div>
        <h2 class="text-sm font-bold text-ink flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 text-attention" />
          <span>Active Misconception Clusters (Cohort Gaps)</span>
        </h2>
        <p class="text-xs text-ink-secondary">
          Aggregated common error patterns across recent STEM, English, and Robotics assessments
        </p>
      </div>
      <span class="text-xs text-ink-secondary font-mono font-medium">{misconceptionClustersExtended.length} Clusters Identified</span>
    </div>

    <!-- Cluster Heatmap Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each misconceptionClustersExtended as cluster}
        <div class="p-4 bg-surface-raised border border-border rounded-none space-y-3 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-ink">{cluster.clusterName}</span>
              <span
                class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-none border {cluster.severity === 'High' ? 'bg-critical-subtle border-critical/30 text-critical' : cluster.severity === 'Moderate' ? 'bg-attention-subtle border-attention/30 text-attention font-bold' : 'bg-surface-subtle border-border text-ink-secondary'}"
              >
                {cluster.studentCount} Students ({cluster.severity})
              </span>
            </div>

            <div class="text-[11px] text-ink-secondary space-y-1">
              <div>Domain: <strong class="text-ink">{cluster.domain}</strong></div>
              <div>Diagnostic Anchor: <span class="font-mono text-ink/80">{cluster.diagnosticItem}</span></div>
            </div>

            <div class="p-2 bg-surface border border-border rounded-none text-xs text-ink-secondary leading-relaxed">
              <strong class="text-ai block text-[10px] uppercase font-semibold tracking-wider">
                Targeted Remediation Strategy:
              </strong>
              {cluster.recommendedDifferentiatedActivity}
            </div>
          </div>

          <div class="pt-2 border-t border-border flex items-center justify-end">
            <a
              href="/teacher/lesson-plans?target={encodeURIComponent(cluster.clusterName)}"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-surface hover:bg-ink/90 text-xs font-semibold rounded-none transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles class="w-3.5 h-3.5" />
              <span>Generate Differentiated Lesson Plan</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- LEVEL 3 — EVIDENCE: STUDENT ROSTER BENCHMARK TABLE -->
  <section class="p-6 bg-surface border border-border rounded-none space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
      <div>
        <h3 class="text-sm font-bold text-ink">
          Learner Roster & International Percentiles
        </h3>
        <p class="text-xs text-ink-secondary">Individual standing and assigned remediation sprints</p>
      </div>

      <!-- Search Input -->
      <div class="relative w-full sm:w-64">
        <Search class="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search learner name or ID..."
          class="w-full pl-9 pr-3 py-1.5 bg-surface-raised border border-border text-xs rounded-none text-ink placeholder:text-ink-muted focus:outline-hidden focus:border-border-focus"
        />
      </div>
    </div>

    <!-- Data Table (Zero-radius 0px) -->
    <div class="border border-border overflow-x-auto rounded-none">
      <table class="w-full text-left text-xs border-collapse">
        <thead class="bg-surface-raised border-b border-border text-ink-secondary font-mono uppercase text-[10px]">
          <tr>
            <th class="p-3">Learner ID</th>
            <th class="p-3">Name</th>
            <th class="p-3">Readiness Profile</th>
            <th class="p-3">Strength Domain</th>
            <th class="p-3">Focus Domain</th>
            <th class="p-3">Active Remediation</th>
            <th class="p-3 text-right">Diagnostic Report</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#each filteredStudents as student}
            <tr class="hover:bg-surface-raised transition-colors">
              <td class="p-3 font-mono text-ink-secondary">{student.id}</td>
              <td class="p-3 font-semibold text-ink">{student.name}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 bg-surface-raised border border-border rounded-none text-[11px] font-medium text-ink">
                  {student.overallReadiness}
                </span>
              </td>
              <td class="p-3 text-positive font-semibold">
                {student.strongestCompetency.replace(/_/g, ' ')}
              </td>
              <td class="p-3 text-attention font-semibold">
                {student.weakestCompetency.replace(/_/g, ' ')}
              </td>
              <td class="p-3 text-ink-secondary">
                {student.activeGapRemediation}
              </td>
              <td class="p-3 text-right">
                <a
                  href="/student/report?domain=stem"
                  class="text-ai hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect</span>
                  <ArrowRight class="w-3 h-3" />
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
