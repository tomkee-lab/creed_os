<script lang="ts">
  import {
    ArrowRight,
    ShieldCheck,
    Heart,
    CheckCircle2,
    Lock,
    Compass,
    Home,
    Activity,
    Sparkles,
    Lightbulb
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>For Families · CREED OS</title>
  <meta
    name="description"
    content="Warm, quiet developmental growth reports, home exploratory experiments, and shared horizons for parents and guardians."
  />
</svelte:head>

<div class="space-y-16 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Family Master Header -->
  <header class="space-y-4 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-surface border border-border text-[11px] font-mono text-ink-secondary">
      <span>FAMILY LEARNER OBSERVATORY</span>
      <span class="text-border">·</span>
      <span class="text-brand font-semibold">CALM INSIGHTS</span>
    </div>
    <h1 class="font-heading font-medium text-3xl sm:text-4xl lg:text-[42px] text-ink tracking-tight leading-[1.15]">
      Understand growth<br />
      <span class="text-brand">without the anxiety of ranks.</span>
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-xl mx-auto">
      A calm family space designed around observable strengths, active practice, and shared aspirations, free of competitive percentiles or deterministic exclusions.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
      <a
        href="/login?next=%2Fparent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Open Parent Portal</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/consent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>Parental Consent Hub</span>
      </a>
    </div>
  </header>

  <!-- 2. REALISTIC PARENT SNAPSHOT CARD (The Reassurance Job in <= 10s) -->
  <section class="space-y-4">
    <div class="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
      <div>
        <span class="text-[11px] font-mono uppercase tracking-wider text-brand font-semibold">Cognitive Job: Family Reassurance</span>
        <h2 class="font-heading font-medium text-xl text-ink tracking-tight">Today's Learner Snapshot Preview</h2>
      </div>
      <span class="text-xs text-ink-muted font-mono">Orient in &le; 10 seconds</span>
    </div>

    <!-- Snapshot Surface (L2 Raised, 4px controls, 8px expressive media frame) -->
    <div class="p-6 sm:p-8 rounded-sm bg-surface-raised border border-border space-y-6 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-sm bg-brand/10 border border-brand/20 text-brand flex items-center justify-center font-heading font-semibold text-sm">
            A
          </div>
          <div>
            <div class="font-heading font-semibold text-ink text-base">Aarav Patel · Class 8</div>
            <div class="text-xs text-ink-muted font-mono">Physical Sciences & Mechanical Modeling</div>
          </div>
        </div>
        <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-positive/10 border border-positive/20 text-positive text-xs font-medium">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Active Practice Completed Today</span>
        </div>
      </div>

      <!-- The 3 Essential Questions for Parents -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <!-- 1. What they enjoyed -->
        <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
          <div class="flex items-center gap-1.5 text-positive font-semibold font-mono text-[11px] uppercase tracking-wider">
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>What They Enjoyed</span>
          </div>
          <h3 class="font-heading font-semibold text-ink text-sm">Gear Ratio Kinematics</h3>
          <p class="text-ink-secondary leading-relaxed">
            Assembled an 8-gear mechanical torque train with 1:4 speed reduction during today's Maker Studio mission.
          </p>
          <div class="pt-1 text-[11px] text-ink-muted font-mono">Tier 2 Telemetry Verified</div>
        </div>

        <!-- 2. What they are practicing -->
        <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
          <div class="flex items-center gap-1.5 text-attention font-semibold font-mono text-[11px] uppercase tracking-wider">
            <Activity class="w-3.5 h-3.5" />
            <span>What They Are Practicing</span>
          </div>
          <h3 class="font-heading font-semibold text-ink text-sm">Off-Center Lever Balance</h3>
          <p class="text-ink-secondary leading-relaxed">
            Exploring how effort distance shifts when the fulcrum is moved away from the center of mass.
          </p>
          <div class="pt-1 text-[11px] text-ink-muted font-mono">Next Developmental Milestone</div>
        </div>

        <!-- 3. One thing to try at home -->
        <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
          <div class="flex items-center gap-1.5 text-brand font-semibold font-mono text-[11px] uppercase tracking-wider">
            <Lightbulb class="w-3.5 h-3.5" />
            <span>Try This At Home Tonight</span>
          </div>
          <h3 class="font-heading font-semibold text-ink text-sm">Kitchen Lever Exploration</h3>
          <p class="text-ink-secondary leading-relaxed">
            Pick up a pair of scissors or a bottle opener: ask where the fulcrum, effort, and resistance load sit together.
          </p>
          <div class="pt-1 text-[11px] text-ink-muted font-mono">5-Minute Family Conversation</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. DECIDE: The Three Tenets for Families -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-positive font-mono">Strengths First</span>
        <CheckCircle2 class="w-4 h-4 text-positive" />
      </div>
      <h2 class="text-base font-semibold text-ink">What They Love Doing</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Concrete evidence of spatial reasoning, computational curiosity, and scientific thinking demonstrated in real projects, not multiple-choice trivia.
      </p>
    </div>

    <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-attention font-mono">Continuous Growth</span>
        <Activity class="w-4 h-4 text-attention" />
      </div>
      <h2 class="text-base font-semibold text-ink">What They're Practicing</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Targeted milestones without deficit framing. Just the next logical step in their personal growth with zero false-precision percentage rankings.
      </p>
    </div>

    <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-brand font-mono">Shared Horizon</span>
        <Home class="w-4 h-4 text-brand" />
      </div>
      <h2 class="text-base font-semibold text-ink">Conversational Explorations</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Non-academic, conversational prompts like kitchen balance trials and gear ratios to support learning naturally around the family dinner table.
      </p>
    </div>
  </section>

  <!-- 4. TRUST: DPDP Child Data Sovereignty Guarantee -->
  <section class="p-6 sm:p-8 rounded-sm bg-surface-raised border border-border space-y-4">
    <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
      <Lock class="w-3.5 h-3.5" />
      <span>Child Privacy Sovereignty</span>
    </div>
    <h3 class="text-lg font-heading font-medium text-ink">Your Family's Data Belongs Exclusively to You</h3>
    <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
      Under India's DPDP Act 2023, children are not commercial products. Your child's assessments are protected by relationship-scoped Row Level Security: only you and their verified teacher can access their records. Zero ads, zero commercial tracking, and 1-click consent revocation.
    </p>
  </section>

  <!-- 5. ACT: Experience Call to Action -->
  <section class="p-8 rounded-sm bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-heading font-medium text-ink">See What Calm Family Growth Looks Like</h3>
      <p class="text-xs text-ink-secondary">Explore the live Parent Portal experience for an active Class 8 learner.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a
        href="/login?next=%2Fparent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Open Parent Portal</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/consent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>Inspect Consent Hub</span>
      </a>
    </div>
  </section>
</div>
