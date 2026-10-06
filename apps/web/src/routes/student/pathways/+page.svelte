<script lang="ts">
  import {
    Compass,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Award,
    Target,
    Layers,
    BookOpen,
    Play,
    Zap,
    FlaskConical,
    Sparkles
  } from 'lucide-svelte';
  import { getCompetencyDescriptor } from '@core-os/ui';

  let { data } = $props();
  let pathways = $derived(data.pathways);
  let learner = $derived(data.learner);

  // Active selected pathway
  let selectedPathwayId = $state<string>('PATH-ROBOTICS');
  let selectedPathway = $derived(
    pathways.find((p) => p.id === selectedPathwayId) || pathways[0]
  );

  function calculateComparison(pathway: typeof selectedPathway) {
    let metCount = 0;
    const requirements = pathway.requirements.map((req) => {
      const demonstrated = learner.competencies[req.competency]?.score || 2.5;
      const delta = Math.round((demonstrated - req.minimumLevel) * 10) / 10;
      if (delta >= 0) metCount++;
      return {
        ...req,
        demonstrated,
        delta,
        descriptor: getCompetencyDescriptor(demonstrated, 'student').label,
        domainName: req.competency.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      };
    });

    const readinessPct = Math.round((metCount / pathway.requirements.length) * 100);
    const hasGap = requirements.some((r) => r.delta < 0);

    return {
      readinessPct,
      hasGap,
      requirements
    };
  }

  let comparison = $derived(calculateComparison(selectedPathway));
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- Header -->
  <div class="space-y-1.5 pb-2 border-b border-(--border-subtle)">
    <div class="flex items-center gap-2">
      <Compass class="w-6 h-6 text-(--accent-primary)" />
      <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
        Pathway Exploration & Real-World Projects
      </h1>
    </div>
    <p class="text-xs sm:text-sm text-(--text-secondary) max-w-3xl">
      We do not assign fixed career labels or close doors. We measure foundational alignment, highlight growth areas, and provide hands-on project trials before you choose your educational stream.
    </p>
  </div>

  <!-- Pathway Selector Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {#each pathways as p}
      {@const isSelected = selectedPathwayId === p.id}
      <button
        type="button"
        onclick={() => (selectedPathwayId = p.id)}
        class="text-left p-5 rounded-xl border transition-all cursor-pointer {isSelected ? 'surface-elevated border-(--accent-primary) ring-1 ring-(--accent-primary)' : 'surface-card hover:bg-(--surface-sunken)'}"
      >
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-indigo)">
          {p.field.replace('_', ' ')}
        </span>
        <h3 class="text-base font-bold text-(--text-primary) mt-1">{p.title}</h3>
        <p class="text-xs text-(--text-secondary) mt-2 line-clamp-2 leading-relaxed">{p.tagline}</p>

        <div class="mt-4 pt-3 border-t border-(--border-subtle) flex items-center justify-between text-xs">
          <span class="text-(--text-muted) font-medium">Foundation Alignment</span>
          <span class="font-semibold {p.id === 'PATH-ROBOTICS' ? 'text-(--accent-warning)' : 'text-(--accent-success)'}">
            {p.id === 'PATH-ROBOTICS' ? '74% (Growth Plan)' : '82% (Strong Fit)'}
          </span>
        </div>
      </button>
    {/each}
  </div>

  <!-- Selected Pathway Detail View -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left 2 Cols: Skill Comparison & Growth Plan -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Pathway Title & Context -->
      <div class="surface-card p-6 space-y-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-indigo)">
            Featured Field
          </span>
          <h2 class="text-xl sm:text-2xl font-bold text-(--text-primary) mt-1">
            {selectedPathway.title}
          </h2>
          <p class="text-xs sm:text-sm text-(--text-secondary) mt-2 leading-relaxed">
            {selectedPathway.overview}
          </p>
        </div>

        <div class="p-3.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) text-xs text-(--text-secondary) flex items-center justify-between">
          <span class="font-medium">Industry & Future Outlook:</span>
          <span class="font-semibold text-(--accent-success)">
            High Growth (+28% projected 10-year demand in autonomous systems)
          </span>
        </div>
      </div>

      <!-- Capability Comparison Table (Human-first, no jargon) -->
      <div class="surface-card p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-(--border-subtle) pb-3">
          <div>
            <h3 class="text-base font-bold text-(--text-primary)">
              How Your Current Skills Compare
            </h3>
            <p class="text-xs text-(--text-muted) mt-0.5">
              Comparison between your verified demonstrations and typical foundational requirements.
            </p>
          </div>
          <span class="text-xs font-medium px-2.5 py-1 rounded-full {comparison.hasGap ? 'badge-focus' : 'badge-growth'}">
            {comparison.hasGap ? 'Active Growth Sprint' : 'Ready to Advance'}
          </span>
        </div>

        <div class="space-y-3">
          {#each comparison.requirements as req}
            <div class="p-3.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div class="space-y-0.5">
                <span class="font-semibold text-(--text-primary) text-sm">{req.domainName}</span>
                <span class="text-[11px] text-(--text-muted) block">Importance: {req.importance}</span>
              </div>

              <div class="flex items-center gap-6">
                <div class="text-right">
                  <span class="text-[10px] text-(--text-muted) uppercase block">Your Level</span>
                  <span class="font-semibold text-(--text-primary)">{req.descriptor} ({req.demonstrated.toFixed(1)}/5)</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-(--text-muted) uppercase block">Typical Baseline</span>
                  <span class="font-medium text-(--text-secondary)">{req.minimumLevel.toFixed(1)}/5</span>
                </div>
                <div class="w-16 text-right">
                  {#if req.delta >= 0}
                    <span class="text-[11px] font-semibold text-(--accent-success)">+{req.delta} Met</span>
                  {:else}
                    <span class="text-[11px] font-semibold text-(--accent-warning)">{req.delta} Focus</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Constructive Growth Guidance (Never close the door!) -->
        <div class="p-4 rounded-xl border border-(--accent-warning)/40 bg-(--accent-warning-subtle) space-y-2 mt-4">
          <div class="flex items-center gap-2 text-sm font-bold text-(--text-primary)">
            <Zap class="w-4 h-4 text-(--accent-warning)" />
            <span>Constructive Growth Plan (Do Not Close the Door!)</span>
          </div>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Your spatial and computational reasoning are well above the requirements for this engineering field. Foundational quantitative balancing shows an area for growth.
          </p>
          <div class="pt-1 text-xs font-semibold text-(--text-primary)">
            Recommended Action: Complete our 4-week Proportional Scaling sprint and test your passion on the miniature project missions.
          </div>
        </div>
      </div>

      <!-- Multi-Route Educational Paths -->
      <div class="surface-card p-6 space-y-4">
        <div>
          <h3 class="text-base font-bold text-(--text-primary)">
            Multiple Pathways to Mastery
          </h3>
          <p class="text-xs text-(--text-muted) mt-0.5">
            CREED OS recognizes that real-world mastery has multiple viable routes, not just single competitive exams.
          </p>
        </div>

        <div class="grid sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
            <span class="text-[10px] font-semibold text-(--accent-indigo) uppercase">University Track</span>
            <h4 class="font-bold text-(--text-primary)">B.Tech Mechatronics</h4>
            <p class="text-[11px] text-(--text-secondary)">Undergraduate degree with kinematic lab work.</p>
          </div>
          <div class="p-3.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
            <span class="text-[10px] font-semibold text-(--accent-primary) uppercase">Applied Diploma</span>
            <h4 class="font-bold text-(--text-primary)">Robotics Automation</h4>
            <p class="text-[11px] text-(--text-secondary)">Industrial PLC programming & direct equipment training.</p>
          </div>
          <div class="p-3.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
            <span class="text-[10px] font-semibold text-(--accent-success) uppercase">Project Portfolio</span>
            <h4 class="font-bold text-(--text-primary)">Open-Source Robotics</h4>
            <p class="text-[11px] text-(--text-secondary)">Demonstrated ROS contributions and physical build logs.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Col: Try-Before-You-Choose Project Missions -->
    <div class="space-y-6">
      <div class="surface-card p-6 space-y-5">
        <div>
          <div class="flex items-center gap-2">
            <FlaskConical class="w-5 h-5 text-(--accent-indigo)" />
            <h3 class="text-lg font-bold text-(--text-primary)">
              Try Before You Choose
            </h3>
          </div>
          <p class="text-xs text-(--text-secondary) mt-1.5 leading-relaxed">
            Experience miniature tasks to test your grit, curiosity, and authentic interest before committing to years of coaching.
          </p>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-xl border border-(--border-subtle) bg-(--surface-sunken) space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-(--text-primary)">
                RoboBridge Structural Optimization
              </span>
              <span class="text-[11px] font-medium text-(--text-muted)">45 mins</span>
            </div>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              Design a lightweight bridge truss carrying 5x its own weight across a canyon for a supply rover.
            </p>
            <div class="pt-1">
              <a
                href="/student/mentor"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-(--accent-primary) text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Sparkles class="w-3.5 h-3.5" />
                <span>Launch Mission with AI Guide</span>
              </a>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-(--border-subtle) bg-(--surface-sunken) space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-(--text-primary)">
                Autonomous Maze Wall-Follower
              </span>
              <span class="text-[11px] font-medium text-(--text-muted)">30 mins</span>
            </div>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              Tune ultrasonic proximity sensor thresholds for collision-free rover navigation in subterranean caves.
            </p>
            <div class="pt-1">
              <a
                href="/student/mentor"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg surface-card text-(--text-primary) hover:bg-(--surface-sunken) text-xs font-medium transition-colors"
              >
                <Sparkles class="w-3.5 h-3.5 text-(--accent-primary)" />
                <span>Launch Mission with AI Guide</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
