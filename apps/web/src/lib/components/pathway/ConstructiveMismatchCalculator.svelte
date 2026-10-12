<script lang="ts">
  import {
    ArrowRight,
    Calculator,
    AlertCircle,
    TrendingUp,
    Compass,
    GraduationCap,
    Sliders,
    Layers,
    CheckCircle2,
    BookOpen,
    Sparkles,
    Calendar,
    Award
  } from 'lucide-svelte';

  // Mode: SBB Mismatch vs Subject Bands vs Post-Secondary Aggregates
  let activeTab = $state<'mismatch' | 'bands' | 'aggregates'>('mismatch');

  // Mismatch & SBB State
  let psychometricTheta = $state(0.5);
  let psleScore = $state(14);
  let targetTheta = $state(0.9);

  let delta = $derived(Math.round((targetTheta - psychometricTheta) * 100) / 100);
  let isOptimal = $derived(delta > 0.05 && delta <= 0.6);

  let postingGroup = $derived.by(() => {
    if (psleScore <= 20)
      return {
        group: 'Posting Group 3 (PG3)',
        tier: 'G3 (Express Standard)',
        desc: 'Most academic subjects initiated at the highly demanding G3 level.'
      };
    if (psleScore <= 22)
      return {
        group: 'Option Band (PG2 / PG3)',
        tier: 'G2 / G3 Option',
        desc: 'Family exercises agency to select G2 or G3 band based on subject strengths.'
      };
    if (psleScore <= 24)
      return {
        group: 'Posting Group 2 (PG2)',
        tier: 'G2 (Normal Academic)',
        desc: 'Most academic subjects initiated at intermediate G2 level.'
      };
    if (psleScore <= 25)
      return {
        group: 'Option Band (PG1 / PG2)',
        tier: 'G1 / G2 Option',
        desc: 'Family exercises agency to select G1 or G2 band.'
      };
    return {
      group: 'Posting Group 1 (PG1)',
      tier: 'G1 (Foundational / Normal Technical)',
      desc: 'Most subjects initiated at foundational G1 level (requires AL7+ in English/Math).'
    };
  });

  let mismatchStatus = $derived.by(() => {
    if (delta <= 0)
      return {
        label: 'Strongly Aligned / Mastered',
        desc: 'Current capability exceeds prerequisite foundation. Candidate for advanced G3+ honors acceleration.',
        color: 'text-mint',
        bg: 'bg-mint-subtle',
        badge: 'Accelerated Challenge'
      };
    if (isOptimal)
      return {
        label: 'Optimal Constructive Mismatch (ZPD)',
        desc: 'Zone of Proximal Development (+0.05 to +0.60 logits). Cognitive friction fosters rapid skill acquisition.',
        color: 'text-brand',
        bg: 'bg-brand/10',
        badge: 'Optimal Growth Zone'
      };
    return {
      label: 'High Cognitive Load (Unready)',
      desc: 'Gap exceeds 0.60 logits. Recommending targeted 8-week foundation sprint before elective enrollment.',
      color: 'text-red',
      bg: 'bg-red-subtle',
      badge: 'Scaffolding Required'
    };
  });

  // Individual Subject Bands (Full SBB Fluid Movement)
  let subjects = $state([
    { name: 'Mathematics', band: 'G3', alScore: 2, icon: '📐' },
    { name: 'Science', band: 'G3', alScore: 3, icon: '🔬' },
    { name: 'English Language', band: 'G3', alScore: 3, icon: '📖' },
    { name: 'Mother Tongue', band: 'G2', alScore: 5, icon: '🗣️' },
    { name: 'Humanities', band: 'G2', alScore: 4, icon: '🌍' }
  ]);

  // Post-Secondary Aggregate Simulation State (SEC / L1R5 / ELR2B2 / ELMAB3)
  let englishGrade = $state(2); // Grade 1 to 6
  let mathGrade = $state(2);
  let relevant1Grade = $state(2);
  let relevant2Grade = $state(3);
  let bestSubjectGrade = $state(2);
  let sixthSubjectGrade = $state(3);
  let takesG3Math = $state(true);

  // SEC Downward Grade Mapping: G3 grade 1-4 maps to G2 grade 1
  let effectiveMathGrade = $derived.by(() => {
    if (takesG3Math) return mathGrade;
    return Math.max(1, mathGrade - 1);
  });

  // 1. Junior College Aggregate: L1R5 = Language 1 + 5 Relevant subjects (must be <= 20 net)
  let l1r5Gross = $derived(
    englishGrade + effectiveMathGrade + relevant1Grade + relevant2Grade + bestSubjectGrade + sixthSubjectGrade
  );
  let ccaBonus = $state(2); // Max 2 bonus points for CCA / leadership
  let l1r5Net = $derived(Math.max(2, l1r5Gross - ccaBonus));
  let jcEligible = $derived(l1r5Net <= 20);

  // 2. Polytechnic Aggregate: ELR2B2 = English + 2 Relevant + 2 Best (must be <= 22 net)
  let elr2b2Gross = $derived(
    englishGrade + effectiveMathGrade + relevant1Grade + relevant2Grade + bestSubjectGrade
  );
  let elr2b2Net = $derived(Math.max(2, elr2b2Gross - ccaBonus));
  let polyEligible = $derived(elr2b2Net <= 22);

  // 3. ITE Higher Nitec Aggregate: ELMAB3 = English + Math + 3 Best (must be <= 19 gross)
  let elmab3Score = $derived(
    englishGrade + effectiveMathGrade + relevant1Grade + relevant2Grade + bestSubjectGrade
  );
  let iteEligible = $derived(elmab3Score <= 19);

  // 8-Week Foundation Sprint Plan
  const sprintWeeks = [
    { week: 'Weeks 1–2', focus: 'Concrete Kinematics & Gear Trains', task: 'Build physical gear reduction models to internalize torque vs angular speed.' },
    { week: 'Weeks 3–4', focus: 'Cartesian Navigation & Odometry', task: 'Translate coordinate geometry (x, y) into wheel encoder pulse calculations.' },
    { week: 'Weeks 5–6', focus: 'Sensor Thresholds & Hysteresis', task: 'Implement noise filters for ultrasonic ranging to prevent rover oscillation.' },
    { week: 'Weeks 7–8', focus: 'Autonomous FLL Capstone Challenge', task: 'Execute timed obstacle avoidance mission with zero manual tele-op intervention.' }
  ];
</script>

<div class="flex flex-col border border-border bg-surface text-ink w-full p-0 font-sans shadow-xs rounded-none overflow-hidden">
  <!-- Header & Mode Tabs -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-border bg-surface-subtle gap-4">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-brand-subtle border border-brand/20">
        <Calculator class="size-5 text-brand" />
      </div>
      <div>
        <h3 class="text-base font-bold uppercase tracking-wider text-ink font-mono">
          Singapore Full SBB & Constructive Mismatch Engine
        </h3>
        <p class="text-xs text-ink-muted">
          Dynamic PSLE AL Mapping • Zone of Proximal Development (ZPD) • Post-Secondary Aggregates (L1R5 / ELR2B2 / ELMAB3)
        </p>
      </div>
    </div>

    <!-- Mode Selector -->
    <div class="inline-flex border border-border bg-surface p-0.5">
      <button
        onclick={() => (activeTab = 'mismatch')}
        class="px-3 py-1.5 text-xs font-mono transition-micro {activeTab === 'mismatch'
          ? 'bg-brand text-brand-foreground font-bold'
          : 'text-ink-secondary hover:text-ink'}"
      >
        1. ZPD Mismatch
      </button>
      <button
        onclick={() => (activeTab = 'bands')}
        class="px-3 py-1.5 text-xs font-mono transition-micro {activeTab === 'bands'
          ? 'bg-brand text-brand-foreground font-bold'
          : 'text-ink-secondary hover:text-ink'}"
      >
        2. Full SBB Bands
      </button>
      <button
        onclick={() => (activeTab = 'aggregates')}
        class="px-3 py-1.5 text-xs font-mono transition-micro {activeTab === 'aggregates'
          ? 'bg-brand text-brand-foreground font-bold'
          : 'text-ink-secondary hover:text-ink'}"
      >
        3. Post-Secondary Aggregates
      </button>
    </div>
  </div>

  <!-- TAB 1: ZPD Mismatch & 8-Week Foundation Sprint Plan -->
  {#if activeTab === 'mismatch'}
    <div class="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
      <!-- Left: Interactive Inputs -->
      <div class="p-6 space-y-6">
        <h4 class="text-xs font-bold uppercase tracking-widest text-ink-secondary flex items-center gap-2 font-mono">
          <Compass class="size-4 text-brand" />
          Learner Inputs & Prerequisite Thresholds
        </h4>

        <!-- Psychometric Theta -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <label for="theta" class="font-mono text-ink-secondary">Current Latent Ability (θ)</label>
            <span class="font-mono font-bold text-mint text-sm">{psychometricTheta.toFixed(2)} logits</span>
          </div>
          <input
            id="theta"
            type="range"
            min="-3.5"
            max="3.5"
            step="0.05"
            bind:value={psychometricTheta}
            class="w-full accent-mint h-1.5 bg-surface-overlay"
          />
          <p class="text-[11px] text-ink-muted">Estimated from 3PL IRT Computerized Adaptive Testing trials.</p>
        </div>

        <!-- Target Pathway Prerequisite Theta -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <label for="targetTheta" class="font-mono text-ink-secondary">Target Pathway Prerequisite (θ_req)</label>
            <span class="font-mono font-bold text-violet text-sm">{targetTheta.toFixed(2)} logits</span>
          </div>
          <input
            id="targetTheta"
            type="range"
            min="-3.5"
            max="3.5"
            step="0.05"
            bind:value={targetTheta}
            class="w-full accent-violet h-1.5 bg-surface-overlay"
          />
          <p class="text-[11px] text-ink-muted">Prerequisite competency for Autonomous Robotics & Mechanical Kinematics.</p>
        </div>

        <!-- PSLE Achievement Level Sum -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <label for="psle" class="font-mono text-ink-secondary">PSLE Score (Sum of 4 ALs)</label>
            <span class="font-mono font-bold text-cyan text-sm">AL {psleScore}</span>
          </div>
          <input
            id="psle"
            type="range"
            min="4"
            max="32"
            step="1"
            bind:value={psleScore}
            class="w-full accent-cyan h-1.5 bg-surface-overlay"
          />
          <div class="flex justify-between text-[10px] text-ink-muted font-mono">
            <span>AL 4 (Highest)</span>
            <span>AL 20 (PG3 Cutoff)</span>
            <span>AL 32 (Foundational)</span>
          </div>
        </div>

        <!-- Simulated Posting Group Badge -->
        <div class="p-4 border border-border bg-surface-subtle space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono uppercase text-ink-muted">Secondary Posting Group:</span>
            <span class="text-xs font-mono font-bold text-cyan">{postingGroup.tier}</span>
          </div>
          <p class="text-sm font-bold text-ink">{postingGroup.group}</p>
          <p class="text-xs text-ink-secondary">{postingGroup.desc}</p>
        </div>
      </div>

      <!-- Right: Diagnosis & 8-Week Actionable Sprint -->
      <div class="p-6 space-y-6 bg-surface-subtle/50">
        <h4 class="text-xs font-bold uppercase tracking-widest text-ink-secondary flex items-center gap-2 font-mono">
          <TrendingUp class="size-4 text-mint" />
          Constructive Mismatch Diagnosis
        </h4>

        <!-- Delta Diagnostic Readout -->
        <div class="p-5 border border-border bg-surface space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-mono text-ink-muted uppercase">ZPD Ability Delta (Δ = θ_req - θ)</span>
            <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase {mismatchStatus.bg} {mismatchStatus.color}">
              {mismatchStatus.badge}
            </span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-mono font-bold {mismatchStatus.color}">
              {delta > 0 ? `+${delta}` : delta} logits
            </span>
          </div>
          <p class="text-xs text-ink-secondary leading-relaxed">
            {mismatchStatus.desc}
          </p>
        </div>

        <!-- Targeted 8-Week Foundation Sprint Plan -->
        <div class="space-y-3">
          <h5 class="text-xs font-bold uppercase tracking-wider text-ink font-mono flex items-center gap-1.5">
            <Calendar class="size-3.5 text-brand" />
            Targeted 8-Week Scaffolding Curriculum
          </h5>
          <div class="space-y-2">
            {#each sprintWeeks as sprint}
              <div class="p-3 border border-border bg-surface flex flex-col gap-1 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-brand">{sprint.week}</span>
                  <span class="text-[10px] font-mono text-ink-muted uppercase">Core Focus</span>
                </div>
                <strong class="text-ink">{sprint.focus}</strong>
                <p class="text-[11px] text-ink-secondary">{sprint.task}</p>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

  <!-- TAB 2: Full SBB Subject-Level Banding -->
  {:else if activeTab === 'bands'}
    <div class="p-6 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-ink font-mono flex items-center gap-2">
            <Layers class="size-4 text-brand" />
            Subject-Based Banding (Fluid Movement)
          </h4>
          <p class="text-xs text-ink-secondary">
            Students take subjects at G1, G2, or G3 levels based on individual competency, completely eliminating rigid academic streaming.
          </p>
        </div>
        <span class="text-xs font-mono px-3 py-1 bg-mint-subtle border border-mint/20 text-mint font-bold">
          Singapore MOE 2024+ Standard
        </span>
      </div>

      <!-- Subject Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left border border-border font-sans">
          <thead class="bg-surface-subtle font-mono text-[11px] text-ink-muted border-b border-border uppercase">
            <tr>
              <th class="p-3">Subject</th>
              <th class="p-3">PSLE AL</th>
              <th class="p-3">Active SBB Tier</th>
              <th class="p-3">Fluid Tier Selector</th>
              <th class="p-3">Curriculum Focus</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each subjects as sub}
              <tr class="hover:bg-surface-subtle/50 transition-micro">
                <td class="p-3 font-semibold text-ink flex items-center gap-2">
                  <span>{sub.icon}</span>
                  <span>{sub.name}</span>
                </td>
                <td class="p-3 font-mono font-bold text-cyan">AL {sub.alScore}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 font-mono text-[11px] font-bold border {sub.band === 'G3'
                    ? 'border-mint text-mint bg-mint-subtle'
                    : sub.band === 'G2'
                      ? 'border-brand text-brand bg-brand/10'
                      : 'border-yellow text-yellow bg-yellow-subtle'}">
                    Level {sub.band}
                  </span>
                </td>
                <td class="p-3">
                  <div class="inline-flex border border-border bg-surface p-0.5">
                    {#each ['G1', 'G2', 'G3'] as tier}
                      <button
                        onclick={() => (sub.band = tier)}
                        class="px-2 py-0.5 text-[10px] font-mono transition-micro {sub.band === tier
                          ? 'bg-brand text-brand-foreground font-bold'
                          : 'text-ink-muted hover:text-ink'}"
                      >
                        {tier}
                      </button>
                    {/each}
                  </div>
                </td>
                <td class="p-3 text-ink-secondary text-[11px]">
                  {sub.band === 'G3'
                    ? 'Advanced analytical rigor, proof-based problem solving.'
                    : sub.band === 'G2'
                      ? 'Applied problem solving with structured scaffolding.'
                      : 'Practical hands-on foundational computational skills.'}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

  <!-- TAB 3: Post-Secondary Aggregates (L1R5 / ELR2B2 / ELMAB3) -->
  {:else}
    <div class="p-6 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-ink font-mono flex items-center gap-2">
            <GraduationCap class="size-4 text-brand" />
            Singapore Secondary Education Certificate (SEC) Aggregate Calculator
          </h4>
          <p class="text-xs text-ink-secondary">
            Simulate admission aggregate scores and downward grade conversions across Junior Colleges, Polytechnics, and ITE.
          </p>
        </div>
      </div>

      <!-- 3 Aggregate Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- L1R5 Card -->
        <div class="p-5 border border-border bg-surface space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold uppercase text-ink">Junior College (L1R5)</span>
            <span class="text-[10px] font-mono px-2 py-0.5 border {jcEligible ? 'border-mint text-mint bg-mint-subtle' : 'border-red text-red bg-red-subtle'}">
              {jcEligible ? 'Eligible (≤ 20)' : 'Above Cutoff'}
            </span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-mono font-bold {jcEligible ? 'text-mint' : 'text-red'}">
              {l1r5Net}
            </span>
            <span class="text-xs text-ink-muted font-mono">net points (Gross: {l1r5Gross})</span>
          </div>
          <p class="text-[11px] text-ink-secondary">
            Language 1 + 5 Relevant subjects minus CCA bonus points (2 pts).
          </p>
        </div>

        <!-- ELR2B2 Card -->
        <div class="p-5 border border-border bg-surface space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold uppercase text-ink">Polytechnic (ELR2B2)</span>
            <span class="text-[10px] font-mono px-2 py-0.5 border {polyEligible ? 'border-mint text-mint bg-mint-subtle' : 'border-red text-red bg-red-subtle'}">
              {polyEligible ? 'Eligible (≤ 22)' : 'Above Cutoff'}
            </span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-mono font-bold {polyEligible ? 'text-mint' : 'text-red'}">
              {elr2b2Net}
            </span>
            <span class="text-xs text-ink-muted font-mono">net points (Gross: {elr2b2Gross})</span>
          </div>
          <p class="text-[11px] text-ink-secondary">
            English + 2 Relevant STEM subjects + 2 Best subjects.
          </p>
        </div>

        <!-- ELMAB3 Card -->
        <div class="p-5 border border-border bg-surface space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold uppercase text-ink">ITE Higher Nitec (ELMAB3)</span>
            <span class="text-[10px] font-mono px-2 py-0.5 border {iteEligible ? 'border-mint text-mint bg-mint-subtle' : 'border-red text-red bg-red-subtle'}">
              {iteEligible ? 'Eligible (≤ 19)' : 'Above Cutoff'}
            </span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-mono font-bold {iteEligible ? 'text-mint' : 'text-red'}">
              {elmab3Score}
            </span>
            <span class="text-xs text-ink-muted font-mono">gross points</span>
          </div>
          <p class="text-[11px] text-ink-secondary">
            English + Mathematics + 3 Best subjects for technical engineering diplomas.
          </p>
        </div>
      </div>

      <!-- Subject Grade Sliders & Downward Conversion -->
      <div class="p-5 border border-border bg-surface-subtle space-y-4">
        <div class="flex items-center justify-between">
          <h5 class="text-xs font-bold uppercase font-mono text-ink">Subject Grade Adjustments</h5>
          <label class="flex items-center gap-2 text-xs font-mono cursor-pointer">
            <input type="checkbox" bind:checked={takesG3Math} class="accent-brand" />
            <span>Math at G3 Tier (Uncheck to simulate downward conversion to G2)</span>
          </label>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div class="p-3 border border-border bg-surface text-center space-y-1">
            <span class="text-[10px] font-mono text-ink-muted uppercase">English</span>
            <div class="text-lg font-mono font-bold text-ink">Grade {englishGrade}</div>
            <input type="range" min="1" max="6" bind:value={englishGrade} class="w-full accent-brand h-1" />
          </div>

          <div class="p-3 border border-border bg-surface text-center space-y-1">
            <span class="text-[10px] font-mono text-ink-muted uppercase">Math ({takesG3Math ? 'G3' : 'G2 conv.'})</span>
            <div class="text-lg font-mono font-bold text-mint">Grade {effectiveMathGrade}</div>
            <input type="range" min="1" max="6" bind:value={mathGrade} class="w-full accent-mint h-1" />
          </div>

          <div class="p-3 border border-border bg-surface text-center space-y-1">
            <span class="text-[10px] font-mono text-ink-muted uppercase">Science</span>
            <div class="text-lg font-mono font-bold text-cyan">Grade {relevant1Grade}</div>
            <input type="range" min="1" max="6" bind:value={relevant1Grade} class="w-full accent-cyan h-1" />
          </div>

          <div class="p-3 border border-border bg-surface text-center space-y-1">
            <span class="text-[10px] font-mono text-ink-muted uppercase">Relevant 2</span>
            <div class="text-lg font-mono font-bold text-ink">Grade {relevant2Grade}</div>
            <input type="range" min="1" max="6" bind:value={relevant2Grade} class="w-full accent-brand h-1" />
          </div>

          <div class="p-3 border border-border bg-surface text-center space-y-1">
            <span class="text-[10px] font-mono text-ink-muted uppercase">Best 1</span>
            <div class="text-lg font-mono font-bold text-ink">Grade {bestSubjectGrade}</div>
            <input type="range" min="1" max="6" bind:value={bestSubjectGrade} class="w-full accent-brand h-1" />
          </div>

          <div class="p-3 border border-border bg-surface text-center space-y-1">
            <span class="text-[10px] font-mono text-ink-muted uppercase">Best 2 (JC)</span>
            <div class="text-lg font-mono font-bold text-ink">Grade {sixthSubjectGrade}</div>
            <input type="range" min="1" max="6" bind:value={sixthSubjectGrade} class="w-full accent-brand h-1" />
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
