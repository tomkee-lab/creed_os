<script lang="ts">
  import {
    BookOpen,
    CheckCircle2,
    Search,
    ChevronRight,
    X,
    Calendar,
    ArrowRight
  } from 'lucide-svelte';
  import { WaySection } from '$lib/components';

  let { data } = $props();

  const referrals = [
    {
      id: 'ref-001',
      studentName: 'Anaya Verma',
      studentClass: 'Class 8-A',
      referralType: 'Pathway Alignment',
      priority: 'Priority 2',
      variant: 'alert' as const,
      issue: 'Parent aspiration (IIT-JEE) vs Quantitative Reasoning foundation gap (2.8). High Spatial (4.5).',
      evidenceBase: 'Diagnostic #EVD-3904 + Linkage Project',
      recommendedAction: 'Schedule 3-way dialogue to explore Mechatronics bridge sprint.',
      nextReview: 'Oct 15, 2026',
      competencies: ['Quantitative Reasoning', 'Spatial Reasoning'],
      source: 'Pathway Alignment Engine'
    },
    {
      id: 'ref-002',
      studentName: 'Zoya Khan',
      studentClass: 'Class 8-A',
      referralType: 'Curriculum Acceleration',
      priority: 'Priority 1',
      variant: 'primary' as const,
      issue: 'Logical Deduction 4.6 exceeds Class 8 ceiling. Under-challenged; disengagement risk.',
      evidenceBase: 'CAT Session #EVD-3891',
      recommendedAction: 'Fast-track to Class 9 Computational Thinking curriculum.',
      nextReview: 'Oct 12, 2026',
      competencies: ['Logical Deduction', 'Metacognition'],
      source: 'Adaptive Diagnostic Engine'
    },
    {
      id: 'ref-003',
      studentName: 'Rohan Sharma',
      studentClass: 'Class 8-A',
      referralType: 'Modality Scaffolding',
      priority: 'Priority 3',
      variant: 'growth' as const,
      issue: 'Spatial Reasoning plateaued over 3 assessments. Needs physical 3D manipulative labs.',
      evidenceBase: 'Teacher Observation (Ms. Nair)',
      recommendedAction: 'Enroll in weekend hands-on robotics hardware lab.',
      nextReview: 'Oct 22, 2026',
      competencies: ['Spatial Reasoning'],
      source: 'Teacher Copilot'
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
  <!-- 1. COUNSELOR HEADER -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <BookOpen class="w-5 h-5 text-(--accent-primary)" />
        <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
          Counselor Guidance & Caseload
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Structured case management, priority triage, and evidence-backed parent alignment dialogues.
      </p>
    </div>

    <span class="px-3 py-1 rounded-sm text-xs font-semibold bg-(--surface-sunken) text-(--text-secondary) border border-(--border-subtle) self-start sm:self-auto">
      Delhi Public International School
    </span>
  </header>

  <!-- 2. METRICS AT A GLANCE (Semantic tiles) -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
      <span class="text-[10px] uppercase font-semibold text-(--text-muted) block">Active Caseload</span>
      <p class="text-2xl font-bold text-(--text-primary)">24</p>
      <span class="text-[11px] text-(--text-secondary)">Middle School Cohort</span>
    </div>

    <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
      <span class="text-[10px] uppercase font-semibold text-(--accent-warning) block">Open Referrals</span>
      <p class="text-2xl font-bold text-(--accent-warning)">3</p>
      <span class="text-[11px] text-(--text-secondary)">2 need 3-way dialogue</span>
    </div>

    <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
      <span class="text-[10px] uppercase font-semibold text-(--accent-success) block">On Track</span>
      <p class="text-2xl font-bold text-(--accent-success)">17</p>
      <span class="text-[11px] text-(--text-secondary)">Steady growth demonstrated</span>
    </div>

    <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
      <span class="text-[10px] uppercase font-semibold text-(--accent-indigo) block">Acceleration</span>
      <p class="text-2xl font-bold text-(--accent-indigo)">1</p>
      <span class="text-[11px] text-(--text-secondary)">Exceeding grade ceiling</span>
    </div>
  </div>

  <!-- 3. CASE ROSTER TABLE (0px structural table frame, 4px controls) -->
  <WaySection
    eyebrow="Case Management"
    title="Priority Caseload Roster"
    subtitle="Referrals prioritized by alignment friction and developmental indicators."
  >
    <div class="surface-card rounded-none border border-(--border-subtle) overflow-hidden">
      <!-- Filter bar -->
      <div class="p-3 bg-(--surface-sunken) border-b border-(--border-subtle) flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-1.5">
          {#each filterTabs as tab}
            <button
              type="button"
              onclick={() => (filterCategory = tab.id)}
              class="px-2.5 py-1 rounded-sm transition-colors cursor-pointer {filterCategory === tab.id ? 'bg-(--accent-primary) text-white font-medium' : 'surface-card text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle)'}"
            >
              {tab.label} ({tab.count})
            </button>
          {/each}
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-(--border-subtle) bg-(--surface-canvas) text-(--text-muted) font-medium">
              <th class="p-3">Priority</th>
              <th class="p-3">Student</th>
              <th class="p-3">Issue</th>
              <th class="p-3">Evidence Base</th>
              <th class="p-3">Next Step</th>
              <th class="p-3">Review Date</th>
              <th class="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-(--border-subtle)">
            {#each filteredReferrals as ref}
              <tr class="hover:bg-(--surface-sunken) transition-colors cursor-pointer" onclick={() => openReferral(ref)}>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase {ref.variant === 'alert' ? 'bg-(--accent-warning-subtle) text-(--accent-warning)' : (ref.variant === 'primary' ? 'bg-(--accent-indigo-subtle) text-(--accent-indigo)' : 'bg-(--accent-success-subtle) text-(--accent-success)')} border border-(--border-subtle)">
                    {ref.priority}
                  </span>
                </td>
                <td class="p-3">
                  <span class="font-bold text-(--text-primary) block">{ref.studentName}</span>
                  <span class="text-[10px] text-(--text-muted)">{ref.studentClass}</span>
                </td>
                <td class="p-3 max-w-xs text-(--text-secondary) leading-snug">
                  {ref.issue}
                </td>
                <td class="p-3 text-(--text-secondary) whitespace-nowrap">
                  {ref.evidenceBase}
                </td>
                <td class="p-3 max-w-xs text-(--text-primary) font-medium leading-snug">
                  {ref.recommendedAction}
                </td>
                <td class="p-3 font-semibold text-(--accent-warning) whitespace-nowrap">
                  {ref.nextReview}
                </td>
                <td class="p-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onclick={(e) => {
                      e.stopPropagation();
                      openReferral(ref);
                    }}
                    class="px-2.5 py-1 rounded-sm surface-card hover:bg-(--surface-raised) text-xs font-medium text-(--text-primary) border border-(--border-subtle) transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ChevronRight class="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </WaySection>

  <!-- 4. SIDE DRAWER FOR CASE DETAILS & 3-WAY DIALOGUE -->
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

      <div class="relative w-full max-w-lg surface-card h-full p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl overflow-y-auto z-10 animate-in slide-in-from-right duration-200 border-l border-(--border-subtle)">
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-(--border-subtle) pb-4">
            <div>
              <span class="text-[11px] font-semibold uppercase text-(--accent-indigo) block">
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
              <X class="w-4 h-4" />
            </button>
          </div>

          {#if scheduleSuccess}
            <div class="p-3.5 rounded-sm bg-(--accent-success-subtle) text-(--accent-success) text-xs flex items-center gap-2 border border-(--border-subtle)">
              <CheckCircle2 class="w-4 h-4 shrink-0" />
              <span>3-Way Dialogue Invitation dispatched to student and guardian.</span>
            </div>
          {/if}

          <div class="space-y-4 text-xs">
            <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
              <span class="font-bold text-(--text-primary) block">Referral Context</span>
              <p class="text-(--text-secondary) leading-relaxed">{activeReferral.issue}</p>
            </div>

            <div class="p-4 rounded-sm bg-(--accent-indigo-subtle) border border-(--border-subtle) space-y-1">
              <span class="font-bold text-(--accent-indigo) block">Recommended Counselor Action</span>
              <p class="text-(--text-primary) leading-relaxed">{activeReferral.recommendedAction}</p>
            </div>

            <div class="space-y-1.5">
              <span class="font-bold text-(--text-primary) block">Competencies Involved</span>
              <div class="flex flex-wrap gap-1.5">
                {#each activeReferral.competencies as comp}
                  <span class="px-2 py-0.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) text-[11px] text-(--text-secondary)">
                    {comp}
                  </span>
                {/each}
              </div>
            </div>

            <div class="pt-2 border-t border-(--border-subtle) flex items-center justify-between text-[11px] text-(--text-muted)">
              <span>Source: {activeReferral.source}</span>
              <span>Review: {activeReferral.nextReview}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 pt-4 border-t border-(--border-subtle)">
          <button
            type="button"
            onclick={handleScheduleSession}
            class="w-full px-4 py-2.5 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Calendar class="w-4 h-4" />
            <span>Schedule 3-Way Dialogue</span>
          </button>
          <a
            href="/student"
            class="w-full px-4 py-2.5 rounded-sm surface-card hover:bg-(--surface-sunken) text-(--text-primary) font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-(--border-subtle) cursor-pointer"
          >
            <span>View Student Longitudinal Profile</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>
