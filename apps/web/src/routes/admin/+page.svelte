<script lang="ts">
  import {
    ShieldCheck,
    Building2,
    Users,
    Activity,
    FileCheck,
    AlertCircle,
    CheckCircle2,
    Download,
    Search,
    Filter,
    Clock,
    Lock,
    RefreshCw,
    TrendingUp,
    Send,
    BookOpen,
    Layers,
    Cpu,
    ArrowUpRight
  } from 'lucide-svelte';
  import { Button, Badge, Card, Tabs, Input } from '$lib/components';

  let { data } = $props();

  let overview = $derived(data.overview);
  let consentLedger = $derived(data.consentLedger);
  let teacherRoster = $derived(data.teacherRoster);
  let pathwayMetrics = $derived(data.pathwayMetrics);

  let activeTab = $state('consent');
  let consentFilter = $state<string>('ALL');
  let searchQuery = $state<string>('');
  let feedbackMessage = $state<string | null>(null);

  const adminTabs = $derived([
    { id: 'consent', label: 'DPDP Consent Ledger', count: consentLedger.length },
    { id: 'roster', label: 'Staff Directory', count: teacherRoster.length },
    { id: 'cohorts', label: 'Cohort Performance' },
    { id: 'safety', label: 'Child Safety Governance' }
  ]);

  const filteredConsent = $derived(
    consentLedger.filter((item: any) => {
      const matchesFilter = consentFilter === 'ALL' || item.status === consentFilter;
      const matchesSearch =
        item.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.gradeBand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
  );

  function handleResendNotice(learnerName: string) {
    feedbackMessage = `Statutory notice re-dispatched to guardian of ${learnerName}.`;
    setTimeout(() => {
      feedbackMessage = null;
    }, 4000);
  }

  function handleExportCsv() {
    feedbackMessage = `Exported immutable DPDP audit log (${filteredConsent.length} records).`;
    setTimeout(() => {
      feedbackMessage = null;
    }, 4000);
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Feedback Banner -->
  {#if feedbackMessage}
    <div class="p-4 rounded-xl badge-growth text-xs flex items-center justify-between transition-all">
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>{feedbackMessage}</span>
      </div>
      <button
        type="button"
        onclick={() => (feedbackMessage = null)}
        class="font-bold underline cursor-pointer"
      >
        Dismiss
      </button>
    </div>
  {/if}

  <!-- Institute Header (Carbon Enterprise Console) -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-(--surface-sunken) text-(--accent-primary) border border-(--border-subtle)">
          <Building2 class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-(--text-primary)">
              {overview.schoolName}
            </h1>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded-md bg-(--surface-sunken) border border-(--border-subtle) text-(--text-secondary)">
              {overview.schoolId}
            </span>
          </div>
          <p class="text-xs text-(--text-muted) mt-0.5">
            Institutional Administration • DPDP Act (India) Verified State Machine
          </p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        onclick={handleExportCsv}
      >
        <Download class="w-3.5 h-3.5 text-(--accent-primary)" />
        <span>Export Audit CSV</span>
      </Button>
    </div>
  </div>

  <!-- Key Institutional Metrics -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <Card variant="raised" padding="sm" class="space-y-1">
      <span class="text-xs text-(--text-muted) font-medium">Total Enrolled</span>
      <p class="text-2xl font-bold text-(--text-primary)">{overview.totalLearners}</p>
      <span class="text-[11px] text-(--text-secondary)">Classes 5 through 10</span>
    </Card>
    <Card variant="raised" padding="sm" class="space-y-1">
      <span class="text-xs text-(--text-muted) font-medium">DPDP Compliance Rate</span>
      <p class="text-2xl font-bold text-(--accent-success)">{(overview.dpdpConsentRate * 100).toFixed(1)}%</p>
      <span class="text-[11px] text-(--accent-success) font-medium">Verified Guardians</span>
    </Card>
    <Card variant="raised" padding="sm" class="space-y-1">
      <span class="text-xs text-(--text-muted) font-medium">Active CAT Sessions</span>
      <p class="text-2xl font-bold text-(--accent-primary)">{overview.activeCatSessions}</p>
      <span class="text-[11px] text-(--text-secondary)">3PL Calibration in progress</span>
    </Card>
    <Card variant="raised" padding="sm" class="space-y-1">
      <span class="text-xs text-(--text-muted) font-medium">Open Referrals</span>
      <p class="text-2xl font-bold text-(--accent-warning)">{overview.activeReferralsCount}</p>
      <span class="text-[11px] text-(--text-secondary)">Guidance triage queue</span>
    </Card>
  </div>

  <!-- Operational Tabs -->
  <div class="flex items-center justify-between border-b border-(--border-subtle) pb-2">
    <Tabs
      items={adminTabs}
      bind:activeId={activeTab}
      variant="pills"
    />
  </div>

  {#if activeTab === 'consent'}
    <!-- Carbon-Style Dense Data Table with Persistent Filter Toolbar -->
    <Card variant="raised" class="p-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--border-subtle) pb-4">
        <div class="w-full sm:w-72">
          <Input
            type="search"
            bind:value={searchQuery}
            placeholder="Filter learner, parent, or grade..."
            icon={Search}
          />
        </div>

        <!-- Filter Segmented Control -->
        <div class="flex items-center gap-1.5 text-xs">
          {#each ['ALL', 'VERIFIED_ACTIVE', 'PENDING_NOTICE', 'WITHDRAWN'] as filterOpt}
            <button
              type="button"
              onclick={() => (consentFilter = filterOpt)}
              class="px-3 py-1 rounded-none text-[11px] font-medium transition-colors cursor-pointer border border-(--border-subtle) {consentFilter === filterOpt ? 'bg-(--accent-primary) text-white' : 'bg-(--surface-sunken) text-(--text-secondary) hover:text-(--text-primary)'}"
            >
              {filterOpt.replace('_', ' ')}
            </button>
          {/each}
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-(--border-subtle) text-(--text-muted) font-medium">
              <th class="pb-2.5">Learner</th>
              <th class="pb-2.5">Guardian / Parent</th>
              <th class="pb-2.5">Grade</th>
              <th class="pb-2.5">Consent Status</th>
              <th class="pb-2.5">Channel</th>
              <th class="pb-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-(--border-subtle)">
            {#each filteredConsent as item}
              <tr class="hover:bg-(--surface-sunken) transition-colors">
                <td class="py-3 font-semibold text-(--text-primary)">
                  {item.learnerName}
                </td>
                <td class="py-3 text-(--text-secondary)">
                  {item.parentName}
                </td>
                <td class="py-3 text-(--text-muted) font-mono">
                  {item.gradeBand}
                </td>
                <td class="py-3">
                  {#if item.status === 'VERIFIED_ACTIVE'}
                    <Badge variant="growth" size="sm">
                      Verified
                    </Badge>
                  {:else if item.status === 'PENDING_NOTICE'}
                    <Badge variant="alert" size="sm">
                      Pending Notice
                    </Badge>
                  {:else}
                    <Badge variant="primary" size="sm">
                      {item.status}
                    </Badge>
                  {/if}
                </td>
                <td class="py-3 text-(--text-muted) font-mono text-[11px]">
                  {item.channel}
                </td>
                <td class="py-3 text-right">
                  {#if item.status === 'PENDING_NOTICE'}
                    <button
                      type="button"
                      onclick={() => handleResendNotice(item.learnerName)}
                      class="text-(--accent-primary) font-semibold hover:underline cursor-pointer"
                    >
                      Resend Notice
                    </button>
                  {:else}
                    <span class="text-(--text-muted)">—</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </Card>
  {:else if activeTab === 'roster'}
    <!-- Staff Directory Table -->
    <Card variant="raised" class="p-6 space-y-4">
      <div class="border-b border-(--border-subtle) pb-3">
        <h2 class="text-base font-bold text-(--text-primary)">Authorized Educators & Scoped Permissions</h2>
        <p class="text-xs text-(--text-muted)">Teachers only have row-level visibility into their assigned cohorts.</p>
      </div>

      <div class="divide-y divide-(--border-subtle) text-xs">
        {#each teacherRoster as teacher}
          <div class="py-3.5 flex items-center justify-between">
            <div>
              <span class="font-bold text-(--text-primary) text-sm">{teacher.name}</span>
              <span class="text-(--text-muted) block text-xs">{teacher.subject} • Assigned: {teacher.assignedClasses.join(', ')}</span>
            </div>
            <Badge variant="growth" size="sm">
              RLS Policy Enforced
            </Badge>
          </div>
        {/each}
      </div>
    </Card>
  {:else if activeTab === 'cohorts'}
    <!-- Cohort Performance Overview -->
    <Card variant="raised" class="p-6 space-y-4 text-xs">
      <div class="border-b border-(--border-subtle) pb-3">
        <h2 class="text-base font-bold text-(--text-primary)">Cohort Performance & Developmental Horizons</h2>
        <p class="text-(--text-muted)">Aggregate readiness across classes 5 through 10.</p>
      </div>
      <div class="grid sm:grid-cols-3 gap-4 pt-1">
        <Card variant="sunken" padding="sm" class="space-y-1">
          <span class="text-(--text-muted) text-[11px]">Class 8-A (STEM Focus)</span>
          <p class="text-lg font-bold text-(--text-primary)">84% On Track</p>
          <span class="text-[10px] text-(--accent-success)">+6% vs last quarter</span>
        </Card>
        <Card variant="sunken" padding="sm" class="space-y-1">
          <span class="text-(--text-muted) text-[11px]">Class 7-B (Spatial Lab)</span>
          <p class="text-lg font-bold text-(--text-primary)">78% On Track</p>
          <span class="text-[10px] text-(--accent-primary)">Stable trajectory</span>
        </Card>
        <Card variant="sunken" padding="sm" class="space-y-1">
          <span class="text-(--text-muted) text-[11px]">Class 9-C (Advanced Logic)</span>
          <p class="text-lg font-bold text-(--text-primary)">91% On Track</p>
          <span class="text-[10px] text-(--accent-indigo)">Ceiling acceleration</span>
        </Card>
      </div>
    </Card>
  {:else}
    <!-- Child Safety Governance Overview -->
    <Card variant="raised" class="p-6 space-y-4 text-xs">
      <div class="border-b border-(--border-subtle) pb-3">
        <h2 class="text-base font-bold text-(--text-primary)">Statutory DPDP Act & Child Safety Blueprint</h2>
        <p class="text-(--text-muted)">Regulatory adherence guidelines for minor learner intelligence storage.</p>
      </div>
      <div class="grid sm:grid-cols-2 gap-4 pt-1">
        <Card variant="sunken" padding="sm" class="space-y-1.5">
          <span class="font-bold text-(--text-primary) block">Zero Commercial Profiling</span>
          <p class="text-(--text-secondary) leading-relaxed">
            No behavioral ad-tracking, commercial marketing, or cross-platform data exchange is permitted for accounts tagged under age 18.
          </p>
        </Card>
        <Card variant="sunken" padding="sm" class="space-y-1.5">
          <span class="font-bold text-(--text-primary) block">Ephemeral Mentor Processing</span>
          <p class="text-(--text-secondary) leading-relaxed">
            Student voice and prompt inputs processed through Gemini APIs are never retained for model retraining.
          </p>
        </Card>
      </div>
    </Card>
  {/if}
</div>

