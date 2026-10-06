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

  let { data } = $props();
  let cohort = $derived(data.cohort);
  let pathways = $derived(data.pathways);

  const referrals = [
    {
      id: 'ref-001',
      studentName: 'Anaya Verma',
      studentClass: 'Class 8-A',
      referralType: 'Pathway Alignment',
      urgency: 'Medium Priority',
      badgeClass: 'badge-focus',
      shortSummary: 'Parent aspiration: Engineering • Current quantitative foundation: Developing • Spatial: Advanced',
      issue: 'Parent aspirations (IIT-JEE Engineering) conflict with current Quantitative Reasoning foundation gap (score 2.8). Student demonstrates exceptional spatial (4.5) and computational (4.1) scores. Needs counselor-guided expectation alignment and bridge sprint.',
      recommendedAction: 'Schedule 3-way parent-student-counselor dialogue to explore Robotics Mechatronics pathway with a 4-week math bridge sprint.',
      competenciesInvolved: ['Quantitative Reasoning', 'Spatial Reasoning'],
      raisedBy: 'Pathway Mismatch Engine',
      raisedAt: 'Oct 2, 2026',
      status: 'Open'
    },
    {
      id: 'ref-002',
      studentName: 'Zoya Khan',
      studentClass: 'Class 8-A',
      referralType: 'Curriculum Acceleration',
      urgency: 'High Priority',
      badgeClass: 'badge-primary',
      shortSummary: 'Deduction 4.6 exceeds Class 8 ceiling • Disengagement risk due to low challenge ceiling',
      issue: 'Logical Deduction score 4.6 exceeds Class 8 ceiling. Student is under-challenged and showing signs of boredom. Ready for advanced discrete logic modules.',
      recommendedAction: 'Fast-track to Class 9 Logic and Computational Thinking curriculum. Offer Olympiad preparation challenge.',
      competenciesInvolved: ['Logical Deduction', 'Metacognition'],
      raisedBy: 'Adaptive Diagnostic Engine',
      raisedAt: 'Sep 30, 2026',
      status: 'Action Required'
    },
    {
      id: 'ref-003',
      studentName: 'Rohan Sharma',
      studentClass: 'Class 8-A',
      referralType: 'Modality Scaffolding',
      urgency: 'Routine',
      badgeClass: 'badge-growth',
      shortSummary: 'Spatial visualization flat at 2.6 • Needs physical 3D manipulative labs over screen testing',
      issue: 'Spatial Reasoning score plateaued over 3 assessments. May benefit from tactile manipulation labs rather than screen-only tests.',
      recommendedAction: 'Enroll in weekend hands-on robotics hardware lab. Monitor growth across 4 weeks.',
      competenciesInvolved: ['Spatial Reasoning'],
      raisedBy: 'Teacher Copilot (Ms. Priya Nair)',
      raisedAt: 'Oct 1, 2026',
      status: 'Open'
    }
  ];

  let activeReferral = $state<(typeof referrals)[0] | null>(referrals[0]);
  let sidePanelOpen = $state(false);

  function openReferral(ref: (typeof referrals)[0]) {
    activeReferral = ref;
    sidePanelOpen = true;
  }
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <BookOpen class="w-6 h-6 text-(--accent-indigo)" />
        <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
          Counselor Guidance & Caseload Center
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Holistic learner guidance, priority triage, and evidence-backed parent alignment dialogues.
      </p>
    </div>

    <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--surface-sunken) border border-(--border-subtle) text-xs text-(--text-secondary) font-medium">
      <span>Delhi Public International School</span>
    </div>
  </div>

  <!-- Top Metrics Bar -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="surface-card p-4 space-y-1">
      <span class="text-xs text-(--text-muted) font-medium">Active Caseload</span>
      <p class="text-2xl font-bold text-(--text-primary)">24</p>
      <span class="text-[11px] text-(--text-secondary)">Middle School Cohort</span>
    </div>
    <div class="surface-card p-4 space-y-1">
      <span class="text-xs text-(--text-muted) font-medium">Open Referrals</span>
      <p class="text-2xl font-bold text-(--accent-warning)">3</p>
      <span class="text-[11px] text-(--text-secondary)">2 need 3-way dialogue</span>
    </div>
    <div class="surface-card p-4 space-y-1">
      <span class="text-xs text-(--text-muted) font-medium">On Track</span>
      <p class="text-2xl font-bold text-(--accent-success)">17</p>
      <span class="text-[11px] text-(--text-secondary)">Steady longitudinal progress</span>
    </div>
    <div class="surface-card p-4 space-y-1">
      <span class="text-xs text-(--text-muted) font-medium">Curriculum Acceleration</span>
      <p class="text-2xl font-bold text-(--accent-indigo)">1</p>
      <span class="text-[11px] text-(--text-secondary)">Exceeding Grade ceiling</span>
    </div>
  </div>

  <!-- Priority Referral Queue (Carbon-disciplined scannable table) -->
  <section class="surface-card p-6 space-y-4">
    <div class="flex items-center justify-between border-b border-(--border-subtle) pb-3">
      <div>
        <h2 class="text-lg font-bold text-(--text-primary)">
          Priority Guidance Queue
        </h2>
        <p class="text-xs text-(--text-muted)">
          Triage referrals automatically generated by engine diagnostics or educator observations.
        </p>
      </div>
      <span class="text-xs font-semibold px-2 py-0.5 rounded-full badge-focus">
        3 Active Cases
      </span>
    </div>

    <div class="space-y-3">
      {#each referrals as ref}
        <div class="p-4 rounded-xl surface-card border border-(--border-subtle) flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-(--accent-primary) transition-all">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-(--text-primary)">{ref.studentName}</span>
              <span class="text-xs text-(--text-muted)">({ref.studentClass})</span>
              <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full {ref.badgeClass}">
                {ref.urgency}
              </span>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-(--surface-sunken) border border-(--border-subtle) text-(--text-secondary)">
                {ref.referralType}
              </span>
            </div>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              {ref.shortSummary}
            </p>
            <div class="text-[11px] text-(--text-muted) pt-0.5">
              Raised by {ref.raisedBy} • {ref.raisedAt}
            </div>
          </div>

          <button
            type="button"
            onclick={() => openReferral(ref)}
            class="px-4 py-2 rounded-lg bg-(--surface-sunken) hover:bg-(--accent-primary) hover:text-white text-xs font-medium text-(--text-primary) transition-colors shrink-0 flex items-center gap-1.5 self-start md:self-center cursor-pointer"
          >
            <span>Review Case & Evidence</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      {/each}
    </div>
  </section>

  <!-- Side Panel / Drawer for Case Details (Progressive Disclosure) -->
  {#if sidePanelOpen && activeReferral}
    <div class="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]">
      <div class="w-full max-w-lg surface-elevated h-full p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
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
              onclick={() => (sidePanelOpen = false)}
              class="w-8 h-8 rounded-lg flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-sunken) transition-colors cursor-pointer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="p-3.5 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
              <span class="font-bold text-(--text-primary) block">Referral Context</span>
              <p class="text-(--text-secondary) leading-relaxed">{activeReferral.issue}</p>
            </div>

            <div class="p-3.5 rounded-xl border border-(--accent-indigo)/30 bg-(--accent-indigo-subtle) space-y-1">
              <span class="font-bold text-(--text-primary) block">Recommended Counselor Action</span>
              <p class="text-(--text-secondary) leading-relaxed">{activeReferral.recommendedAction}</p>
            </div>

            <div class="space-y-1.5">
              <span class="font-bold text-(--text-primary) block">Competencies Involved:</span>
              <div class="flex flex-wrap gap-2">
                {#each activeReferral.competenciesInvolved as comp}
                  <span class="px-2.5 py-1 rounded-full bg-(--surface-sunken) border border-(--border-subtle) text-[11px] font-medium text-(--text-secondary)">
                    {comp}
                  </span>
                {/each}
              </div>
            </div>

            <div class="pt-2 border-t border-(--border-subtle) flex items-center justify-between text-[11px] text-(--text-muted)">
              <span>Source: {activeReferral.raisedBy}</span>
              <span>Logged: {activeReferral.raisedAt}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 pt-4 border-t border-(--border-subtle)">
          <button
            type="button"
            class="w-full py-2.5 rounded-lg bg-(--accent-primary) text-white font-medium text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar class="w-4 h-4" />
            <span>Schedule 3-Way Dialogue Session</span>
          </button>
          <a
            href="/student"
            class="w-full py-2.5 rounded-lg surface-card text-center block text-xs font-medium text-(--text-primary) hover:bg-(--surface-sunken) transition-colors"
          >
            View Longitudinal Learner Graph
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>
