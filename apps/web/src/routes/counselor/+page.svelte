<script lang="ts">
  import {
    BookOpen,
    Users,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    BarChart3,
    Search,
    Filter,
    FileText,
    Compass,
    ChevronRight,
    Star,
    Clock,
    Zap,
    Target,
    X,
    Calendar,
    HeartHandshake
  } from 'lucide-svelte';
  import { Button, Badge, Card, Tabs } from '$lib/components';

  let { data } = $props();
  let cohort = $derived(data.cohort);
  let pathways = $derived(data.pathways);

  const referrals = [
    {
      id: 'ref-001',
      priorityRank: 2,
      studentName: 'Anaya Verma',
      studentClass: 'Class 8-A',
      referralType: 'Pathway Alignment',
      urgency: 'Medium',
      badgeVariant: 'alert' as const,
      issue: 'Parent aspiration (IIT-JEE) vs Quantitative Reasoning foundation gap (score 2.8). High Spatial (4.5).',
      evidenceBase: 'Diagnostic #EVD-3904 + Project',
      recommendedAction: 'Schedule 3-way parent-student-counselor dialogue to explore Mechatronics bridge sprint.',
      lastContact: 'Oct 2, 2026',
      nextReview: 'Oct 15, 2026',
      competenciesInvolved: ['Quantitative Reasoning', 'Spatial Reasoning'],
      raisedBy: 'Pathway Mismatch Engine',
      status: 'Open'
    },
    {
      id: 'ref-002',
      priorityRank: 1,
      studentName: 'Zoya Khan',
      studentClass: 'Class 8-A',
      referralType: 'Curriculum Acceleration',
      urgency: 'High',
      badgeVariant: 'primary' as const,
      issue: 'Logical Deduction 4.6 exceeds Class 8 ceiling. Under-challenged; disengagement risk.',
      evidenceBase: 'CAT Session #EVD-3891',
      recommendedAction: 'Fast-track to Class 9 Logic and Computational Thinking curriculum + Olympiad challenge.',
      lastContact: 'Sep 30, 2026',
      nextReview: 'Oct 12, 2026',
      competenciesInvolved: ['Logical Deduction', 'Metacognition'],
      raisedBy: 'Adaptive Diagnostic Engine',
      status: 'Action Required'
    },
    {
      id: 'ref-003',
      priorityRank: 3,
      studentName: 'Rohan Sharma',
      studentClass: 'Class 8-A',
      referralType: 'Modality Scaffolding',
      urgency: 'Routine',
      badgeVariant: 'growth' as const,
      issue: 'Spatial Reasoning plateaued over 3 assessments. Needs physical 3D manipulative labs.',
      evidenceBase: 'Teacher Observation (Ms. Nair)',
      recommendedAction: 'Enroll in weekend hands-on robotics hardware lab. Monitor growth across 4 weeks.',
      lastContact: 'Oct 1, 2026',
      nextReview: 'Oct 22, 2026',
      competenciesInvolved: ['Spatial Reasoning'],
      raisedBy: 'Teacher Copilot',
      status: 'Open'
    }
  ];

  let activeReferral = $state<(typeof referrals)[0] | null>(referrals[0]);
  let sidePanelOpen = $state(false);
  let filterCategory = $state('ALL');
  let scheduleSuccess = $state(false);

  const filterTabs = [
    { id: 'ALL', label: 'All Cases', count: referrals.length },
    { id: 'Pathway Alignment', label: 'Pathway Alignment', count: 1 },
    { id: 'Curriculum Acceleration', label: 'Acceleration', count: 1 },
    { id: 'Modality Scaffolding', label: 'Scaffolding', count: 1 }
  ];

  const filteredReferrals = $derived(
    filterCategory === 'ALL'
      ? referrals
      : referrals.filter((r) => r.referralType === filterCategory)
  );

  function openReferral(ref: (typeof referrals)[0]) {
    activeReferral = ref;
    sidePanelOpen = true;
    scheduleSuccess = false;
  }

  function handleScheduleSession() {
    scheduleSuccess = true;
    setTimeout(() => {
      scheduleSuccess = false;
    }, 4000);
  }
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Header -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <BookOpen class="w-6 h-6 text-(--accent-indigo)" />
        <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
          Counselor Guidance & Caseload Center
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Structured case management, priority triage, and evidence-backed parent alignment dialogues.
      </p>
    </div>

    <div class="flex items-center gap-2">
      <Badge variant="neutral" size="md">
        <span>Delhi Public International School</span>
      </Badge>
    </div>
  </header>

  <!-- Top Metrics Bar (4px radius) -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <Card variant="raised" padding="sm" class="space-y-1 rounded-sm">
      <span class="text-xs text-(--text-muted) font-medium">Active Caseload</span>
      <p class="text-2xl font-bold text-(--text-primary)">24</p>
      <span class="text-[11px] text-(--text-secondary)">Middle School Cohort</span>
    </Card>
    <Card variant="raised" padding="sm" class="space-y-1 rounded-sm">
      <span class="text-xs text-(--text-muted) font-medium">Open Referrals</span>
      <p class="text-2xl font-bold text-(--accent-warning)">3</p>
      <span class="text-[11px] text-(--text-secondary)">2 need 3-way dialogue</span>
    </Card>
    <Card variant="raised" padding="sm" class="space-y-1 rounded-sm">
      <span class="text-xs text-(--text-muted) font-medium">On Track</span>
      <p class="text-2xl font-bold text-(--accent-success)">17</p>
      <span class="text-[11px] text-(--text-secondary)">Steady longitudinal progress</span>
    </Card>
    <Card variant="raised" padding="sm" class="space-y-1 rounded-sm">
      <span class="text-xs text-(--text-muted) font-medium">Curriculum Acceleration</span>
      <p class="text-2xl font-bold text-(--accent-indigo)">1</p>
      <span class="text-[11px] text-(--text-secondary)">Exceeding Grade ceiling</span>
    </Card>
  </div>

  <!-- Priority Case-Management Table (Carbon Structural Discipline: 0px Frame, 4px Controls) -->
  <Card variant="raised" class="p-6 space-y-4 rounded-sm border border-(--border-subtle)">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--border-subtle) pb-3">
      <div>
        <h2 class="text-lg font-bold text-(--text-primary)">
          Priority Guidance Queue & Case Roster
        </h2>
        <p class="text-xs text-(--text-muted)">
          Triage referrals automatically generated by engine diagnostics or educator observations.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Tabs
          items={filterTabs}
          bind:activeId={filterCategory}
          variant="pills"
        />
      </div>
    </div>

    <!-- Structured List / Case Table -->
    <div class="overflow-x-auto rounded-none border border-(--border-subtle)">
      <table class="w-full text-left text-xs border-collapse">
        <thead class="bg-(--surface-sunken) text-(--text-muted) border-b border-(--border-subtle)">
          <tr>
            <th class="py-3 px-3.5 font-semibold">Priority</th>
            <th class="py-3 px-3.5 font-semibold">Student</th>
            <th class="py-3 px-3.5 font-semibold">Focus Issue</th>
            <th class="py-3 px-3.5 font-semibold">Evidence Base</th>
            <th class="py-3 px-3.5 font-semibold">Recommended Action</th>
            <th class="py-3 px-3.5 font-semibold">Last Contact</th>
            <th class="py-3 px-3.5 font-semibold">Next Review</th>
            <th class="py-3 px-3.5 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-(--border-subtle) bg-(--surface-canvas)">
          {#each filteredReferrals as ref}
            <tr class="hover:bg-(--surface-sunken) transition-colors cursor-pointer" onclick={() => openReferral(ref)}>
              <td class="py-3.5 px-3.5">
                <Badge variant={ref.badgeVariant} size="sm">
                  <span>{ref.urgency}</span>
                </Badge>
              </td>
              <td class="py-3.5 px-3.5">
                <span class="font-bold text-(--text-primary) block">{ref.studentName}</span>
                <span class="text-[10px] text-(--text-muted)">{ref.studentClass}</span>
              </td>
              <td class="py-3.5 px-3.5 max-w-xs text-(--text-secondary) leading-snug">
                {ref.issue}
              </td>
              <td class="py-3.5 px-3.5 text-(--text-secondary) whitespace-nowrap">
                {ref.evidenceBase}
              </td>
              <td class="py-3.5 px-3.5 max-w-xs text-(--text-primary) font-medium leading-snug">
                {ref.recommendedAction}
              </td>
              <td class="py-3.5 px-3.5 text-(--text-muted) whitespace-nowrap">
                {ref.lastContact}
              </td>
              <td class="py-3.5 px-3.5 font-semibold text-(--accent-warning) whitespace-nowrap">
                {ref.nextReview}
              </td>
              <td class="py-3.5 px-3.5 text-right whitespace-nowrap">
                <Button
                  variant="secondary"
                  size="sm"
                  onclick={() => openReferral(ref)}
                >
                  <span>Review</span>
                  <ChevronRight class="w-3.5 h-3.5" />
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>

  <!-- Side Drawer for Case Details (Progressive Disclosure) -->
  {#if sidePanelOpen && activeReferral}
    <div class="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div
        class="fixed inset-0"
        onclick={() => (sidePanelOpen = false)}
        role="button"
        tabindex="-1"
        onkeydown={() => {}}
        aria-label="Close case drawer"
      ></div>

      <div class="relative w-full max-w-lg surface-elevated h-full p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-(--border-subtle) pb-4">
            <div>
              <span class="text-xs font-semibold uppercase text-(--accent-indigo)">
                Case File: {activeReferral.referralType}
              </span>
              <h3 class="text-xl font-bold text-(--text-primary) mt-0.5">
                {activeReferral.studentName} ({activeReferral.studentClass})
              </h3>
            </div>
            <button
              type="button"
              onclick={() => (sidePanelOpen = false)}
              class="w-8 h-8 rounded-sm flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-sunken) transition-colors cursor-pointer border border-(--border-subtle)"
              aria-label="Close drawer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          {#if scheduleSuccess}
            <div class="p-3.5 rounded-sm badge-growth text-xs flex items-center gap-2 border border-(--border-subtle)">
              <CheckCircle2 class="w-4 h-4 shrink-0" />
              <span>3-Way Dialogue Invitation dispatched to student and guardian!</span>
            </div>
          {/if}

          <div class="space-y-4 text-xs">
            <Card variant="sunken" padding="sm" class="space-y-1 rounded-sm">
              <span class="font-bold text-(--text-primary) block">Referral Context</span>
              <p class="text-(--text-secondary) leading-relaxed">{activeReferral.issue}</p>
            </Card>

            <div class="p-3.5 rounded-sm border border-(--accent-indigo)/30 bg-(--accent-indigo-subtle) space-y-1">
              <span class="font-bold text-(--text-primary) block">Recommended Counselor Action</span>
              <p class="text-(--text-secondary) leading-relaxed">{activeReferral.recommendedAction}</p>
            </div>

            <div class="space-y-1.5">
              <span class="font-bold text-(--text-primary) block">Competencies Involved:</span>
              <div class="flex flex-wrap gap-2">
                {#each activeReferral.competenciesInvolved as comp}
                  <Badge variant="neutral" size="sm">
                    {comp}
                  </Badge>
                {/each}
              </div>
            </div>

            <div class="pt-2 border-t border-(--border-subtle) flex items-center justify-between text-[11px] text-(--text-muted)">
              <span>Source: {activeReferral.raisedBy}</span>
              <span>Logged: {activeReferral.lastContact}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 pt-4 border-t border-(--border-subtle)">
          <Button
            variant="primary"
            size="md"
            class="w-full"
            onclick={handleScheduleSession}
          >
            <Calendar class="w-4 h-4" />
            <span>Schedule 3-Way Dialogue Session</span>
          </Button>
          <Button
            variant="outline"
            size="md"
            href="/student"
            class="w-full"
          >
            <span>View Longitudinal Learner Graph</span>
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>
