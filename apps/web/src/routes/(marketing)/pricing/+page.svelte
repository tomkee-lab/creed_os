<script lang="ts">
  import { ArrowRight, Check } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Pricing & Plans — CREED OS</title>
  <meta name="description" content="Transparent institutional and family plans for CREED OS learner intelligence." />
</svelte:head>

<div class="space-y-16 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
  <header class="space-y-4 text-center max-w-xl mx-auto">
    <h1 class="text-3xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
      Transparent, ethical intelligence.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      No hidden ad tiers. No data monetization. Just pure, child-safe learner intelligence.
    </p>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
    <!-- Family Plan -->
    <div class="p-8 rounded-none bg-surface border border-border flex flex-col justify-between space-y-6">
      <div class="space-y-4">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-brand">Family Tier</span>
          <h2 class="text-2xl font-bold text-ink">Free & Portable</h2>
          <p class="text-xs text-ink-secondary">Lifelong learner record owned by the student & guardian.</p>
        </div>

        <ul class="space-y-2.5 text-xs text-ink-secondary">
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Complete Learner Observatory profile</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Socratic Guided Thinking Studio (Gemini powered)</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Hands-on maker missions & pathways</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Verified parental consent encryption</span>
          </li>
        </ul>
      </div>

      <a
        href="/signup"
        class="w-full text-center py-2.5 px-4 rounded-none bg-surface-subtle hover:bg-surface-raised border border-border text-xs font-medium text-ink transition-colors cursor-pointer"
      >
        Get Started
      </a>
    </div>

    <!-- School / Institutional Plan -->
    <div class="p-8 rounded-none bg-surface border border-border flex flex-col justify-between space-y-6 relative">
      <div class="space-y-4">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-brand">Institutions</span>
          <h2 class="text-2xl font-bold text-ink">School Pilot</h2>
          <p class="text-xs text-ink-secondary">For classrooms, counselors, and administrative leaders.</p>
        </div>

        <ul class="space-y-2.5 text-xs text-ink-secondary">
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>High-density Teacher Action Workspace</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>1-click intervention queues & scaffolds</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Counselor caseload & case tracking inspector</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Multi-tenant RLS, DPDP compliance, & audit logs</span>
          </li>
        </ul>
      </div>

      <a
        href="/schools"
        class="w-full text-center py-2.5 px-4 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-medium transition-colors shadow-xs cursor-pointer"
      >
        Inquire for Your School
      </a>
    </div>
  </div>
</div>
