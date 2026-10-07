<script lang="ts">
  import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    CheckCircle2
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>CREED OS — Understand How a Learner Grows</title>
  <meta name="description" content="AI-native learner intelligence, adaptive diagnostics, longitudinal evidence, and pathway navigation." />
</svelte:head>

<div class="space-y-24 py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. EDITORIAL HERO (Section 44) -->
  <section class="text-center space-y-8 max-w-3xl mx-auto">
    <div class="space-y-4">
      <h1 class="text-4xl sm:text-6xl font-medium tracking-tight text-ink leading-[1.1]">
        Understand how<br />a learner grows.
      </h1>
      <p class="text-lg sm:text-xl text-ink-secondary font-normal">
        Assess deeply. Learn personally. Explore freely.
      </p>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
      <a
        href="/student"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-sm transition-colors duration-140 shadow-xs cursor-pointer"
      >
        <span>Explore CREED</span>
        <ArrowRight class="w-4 h-4" />
      </a>
      <a
        href="#moments"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-surface hover:bg-surface-subtle text-ink border border-border font-medium text-sm transition-colors duration-140 cursor-pointer"
      >
        <span>See how it works</span>
      </a>
    </div>

    <!-- One Strong Restrained Hero Visual (Section 44) -->
    <div class="pt-8">
      <div class="rounded-md overflow-hidden border border-border bg-surface shadow-xs">
        <img
          src="/images/illustrations/student_workshop.jpg"
          alt="Learner in engineering studio calibrating robotic mechanism with blueprints"
          class="w-full aspect-video object-cover"
        />
        <div class="p-4 bg-surface border-t border-border flex items-center justify-between text-xs text-ink-secondary">
          <span class="font-medium text-ink">The Learner Observatory</span>
          <span>Verified Demonstration #EVD-3904</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. ONE INTELLIGENCE. DIFFERENT MOMENTS. (Section 45) -->
  <section id="moments" class="space-y-12 pt-8 border-t border-border">
    <div class="space-y-2 text-center max-w-xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        One intelligence. Different moments.
      </h2>
      <p class="text-sm text-ink-secondary">
        Longitudinal evidence, deterministic scoring, and calm spaces designed for each human role.
      </p>
    </div>

    <!-- Primary Moments (Student, Family, Teacher) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-sm bg-surface border border-border space-y-4">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-brand">
            Student
          </span>
          <h3 class="text-lg font-semibold text-ink">
            Discover → Practice → Explore
          </h3>
        </div>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Action-first daily learning map, hands-on maker missions, and quiet Socratic mentorship without pressure or labeling.
        </p>
        <div class="pt-2">
          <a href="/student" class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1">
            <span>Enter student space</span>
            <ArrowRight class="w-3 h-3" />
          </a>
        </div>
      </div>

      <div class="p-6 rounded-sm bg-surface border border-border space-y-4">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-positive">
            Family
          </span>
          <h3 class="text-lg font-semibold text-ink">
            Understand → Support → Align
          </h3>
        </div>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Clear developmental summaries, shared horizon conversations, and practical at-home experiments free of diagnostic jargon.
        </p>
        <div class="pt-2">
          <a href="/parent" class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1">
            <span>Enter family space</span>
            <ArrowRight class="w-3 h-3" />
          </a>
        </div>
      </div>

      <div class="p-6 rounded-sm bg-surface border border-border space-y-4">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-attention">
            Teacher
          </span>
          <h3 class="text-lg font-semibold text-ink">
            Notice → Intervene → Verify
          </h3>
        </div>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Classroom misconception clusters, quick 1-click scaffolding assignments, and direct observation capture in seconds.
        </p>
        <div class="pt-2">
          <a href="/teacher" class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1">
            <span>Enter teacher space</span>
            <ArrowRight class="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>

    <!-- Secondary Experiences (Counselor, Institution, Studio) -->
    <div class="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-ink-secondary">
      <div class="space-y-1">
        <a href="/counselor" class="font-semibold text-ink hover:text-brand inline-flex items-center gap-1">
          <span>Counselor</span>
          <ArrowRight class="w-3 h-3" />
        </a>
        <p>Aspiration-capability bridge dialogues & caseload management.</p>
      </div>

      <div class="space-y-1">
        <a href="/admin" class="font-semibold text-ink hover:text-brand inline-flex items-center gap-1">
          <span>Institution Admin</span>
          <ArrowRight class="w-3 h-3" />
        </a>
        <p>DPDP Act statutory parental consent ledger & multi-cohort operations.</p>
      </div>

      <div class="space-y-1">
        <a href="/author" class="font-semibold text-ink hover:text-brand inline-flex items-center gap-1">
          <span>Item Studio</span>
          <ArrowRight class="w-3 h-3" />
        </a>
        <p>Deterministic 3PL Item Response Theory item bank & calibration.</p>
      </div>
    </div>
  </section>

  <!-- 3. FOOTER -->
  <footer class="pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
    <div class="flex items-center gap-2">
      <span class="font-medium text-ink">CREED OS</span>
      <span>•</span>
      <span>AI-Native Learner Intelligence & Navigation Platform</span>
    </div>

    <div class="flex items-center gap-4">
      <a href="/login" class="hover:text-ink">Sign in</a>
      <a href="/consent" class="hover:text-ink">Consent Policy</a>
      <a href="/signup" class="hover:text-ink">Join</a>
    </div>
  </footer>
</div>
