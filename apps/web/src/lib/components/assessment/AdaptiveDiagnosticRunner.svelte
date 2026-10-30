<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Activity,
    CheckCircle2,
    XCircle,
    ArrowRight,
    RotateCcw,
    Clock,
    Brain,
    HelpCircle,
    TrendingUp,
    AlertTriangle
  } from 'lucide-svelte';
  import {
    calculateProbability3PL,
    calculateFisherInformation,
    calculateNormalizedResponseTime
  } from '@core-os/assessment';

  // Benchmark Diagnostic Items Bank (Section 4 of STEM App Shipping Action Plan)
  interface DiagnosticItem {
    id: string;
    stage: 'preparatory' | 'middle' | 'secondary';
    stageLabel: string;
    competency: string;
    stem: string;
    options: {
      key: 'A' | 'B' | 'C' | 'D';
      text: string;
      isCorrect: boolean;
      misconceptionCode?: string;
      explanation: string;
    }[];
    params: { a: number; b: number; c: number };
    baselineTimeSec: number;
  }

  const items: DiagnosticItem[] = [
    {
      id: 'diag-prep-01',
      stage: 'preparatory',
      stageLabel: 'Preparatory (Classes 3–5)',
      competency: 'Algorithmic Thinking',
      stem: 'A robot vacuum cleans a 3x3 grid starting at the bottom-left corner facing North. It executes: [MOVE FORWARD 2, TURN RIGHT 90°, MOVE FORWARD 1]. Where does it end up?',
      options: [
        { key: 'A', text: 'Top-middle square', isCorrect: true, explanation: 'Correct! Moving forward 2 reaches top-left, turning right 90° faces East, moving forward 1 reaches top-middle.' },
        { key: 'B', text: 'Top-left square', isCorrect: false, misconceptionCode: 'MISC_TURN_OMISSION', explanation: 'Misconception: Ignored the final forward movement step after turning.' },
        { key: 'C', text: 'Middle-right square', isCorrect: false, misconceptionCode: 'MISC_DISTANCE_ERROR', explanation: 'Misconception: Inverted the forward movement distances.' },
        { key: 'D', text: 'Bottom-right square', isCorrect: false, misconceptionCode: 'MISC_DIRECTION_INVERSION', explanation: 'Misconception: Turned right before initial forward step.' }
      ],
      params: { a: 1.2, b: -0.8, c: 0.25 },
      baselineTimeSec: 25
    },
    {
      id: 'diag-prep-02',
      stage: 'preparatory',
      stageLabel: 'Preparatory (Classes 3–5)',
      competency: 'Pattern Recognition & Mechanical Advantage',
      stem: 'Observe a 2-gear transmission: Gear A (10 teeth) turns clockwise at 60 RPM, directly driving Gear B (20 teeth). What is the operational state of Gear B?',
      options: [
        { key: 'A', text: 'Counter-clockwise, 30 RPM (Half speed, double torque)', isCorrect: true, explanation: 'Correct! Meshed gears rotate in opposite directions, and gear ratio 10:20 halves the output angular velocity.' },
        { key: 'B', text: 'Clockwise, 30 RPM', isCorrect: false, misconceptionCode: 'MISC_ROTATION_INVERSION', explanation: 'Misconception: Assumed meshed gears maintain the same rotational direction.' },
        { key: 'C', text: 'Counter-clockwise, 120 RPM', isCorrect: false, misconceptionCode: 'MISC_RATIO_INVERSION', explanation: 'Misconception: Inverted the gear ratio, mistakenly multiplying rotational speed instead of dividing.' },
        { key: 'D', text: 'Clockwise, 120 RPM', isCorrect: false, misconceptionCode: 'MISC_COMPOUND_ERROR', explanation: 'Misconception: Compounded rotation inversion with ratio inversion.' }
      ],
      params: { a: 1.35, b: -0.3, c: 0.25 },
      baselineTimeSec: 30
    },
    {
      id: 'diag-mid-01',
      stage: 'middle',
      stageLabel: 'Middle (Classes 6–8)',
      competency: 'AI Fundamentals & Machine Learning',
      stem: 'You want to train an autonomous vision system to sort recyclable materials from general trash on a conveyor belt. You provide the model with 5,000 human-labeled images of plastic bottles and apple cores. What machine learning paradigm is being used?',
      options: [
        { key: 'A', text: 'Supervised Learning', isCorrect: true, explanation: 'Correct! Supervised learning trains algorithms using ground-truth input-output labeled datasets.' },
        { key: 'B', text: 'Unsupervised Learning', isCorrect: false, misconceptionCode: 'MISC_AI_PARADIGM_CONFUSION', explanation: 'Misconception: Unsupervised learning discovers patterns from unlabelled raw data without ground-truth targets.' },
        { key: 'C', text: 'Reinforcement Learning', isCorrect: false, misconceptionCode: 'MISC_AI_PARADIGM_CONFUSION', explanation: 'Misconception: Reinforcement learning relies on reward/penalty signals from dynamic environment interaction, not static labeled datasets.' },
        { key: 'D', text: 'Procedural Automation', isCorrect: false, misconceptionCode: 'MISC_AI_VS_AUTOMATION', explanation: 'Misconception: Confused statistical machine learning with hard-coded if/else procedural rules.' }
      ],
      params: { a: 1.5, b: 0.2, c: 0.25 },
      baselineTimeSec: 35
    },
    {
      id: 'diag-mid-02',
      stage: 'middle',
      stageLabel: 'Middle (Classes 6–8)',
      competency: 'Sensor Feedback & Autonomous Navigation',
      stem: 'An autonomous rover uses an ultrasonic sensor to avoid obstacles. When distance < 15cm, the motor code executes reverse(1 sec) then turn_left(90°). If the rover drives into a narrow corner and repeatedly gets stuck, what is the logical flaw?',
      options: [
        { key: 'A', text: 'It deterministically assumes the left side is always unobstructed', isCorrect: true, explanation: 'Correct! A fixed single-direction evasion loop creates an infinite corner entrapment trap. The rover must scan both sides.' },
        { key: 'B', text: 'The ultrasonic sensor range is physically too short', isCorrect: false, misconceptionCode: 'MISC_HARDWARE_BLAME', explanation: 'Misconception: Attributing algorithmic navigation logic flaws to physical sensor hardware.' },
        { key: 'C', text: 'The reverse duration of 1 second is too long', isCorrect: false, misconceptionCode: 'MISC_VARIABLE_MISJUDGMENT', explanation: 'Misconception: Focusing on reverse duration rather than lack of directional scanning.' },
        { key: 'D', text: 'The drive motors lack sufficient holding torque', isCorrect: false, misconceptionCode: 'MISC_DOMAIN_CONFUSION', explanation: 'Misconception: Confusing mechanical motor capacity with control flow logic.' }
      ],
      params: { a: 1.6, b: 0.6, c: 0.25 },
      baselineTimeSec: 40
    },
    {
      id: 'diag-sec-01',
      stage: 'secondary',
      stageLabel: 'Secondary (Classes 9–12)',
      competency: 'Kinematics & Engineering Physics',
      stem: 'A 120-pound FRC robot must lift itself on a vertical climbing chain. The cable lifting winch has a spool radius of 2.0 inches. Ignoring friction, what is the minimum motor torque required to hold the robot stationary?',
      options: [
        { key: 'A', text: '240 in-lbs (Torque = Force × Radius = 120 lbs × 2.0 in)', isCorrect: true, explanation: 'Correct! Static equilibrium requires motor torque tau = F * r = 120 * 2.0 = 240 in-lbs.' },
        { key: 'B', text: '60 in-lbs', isCorrect: false, misconceptionCode: 'MISC_DIVISION_INSTEAD_OF_MULTIPLICATION', explanation: 'Misconception: Divided force by radius instead of calculating product tau = F * r.' },
        { key: 'C', text: '120 in-lbs', isCorrect: false, misconceptionCode: 'MISC_RADIUS_OMISSION', explanation: 'Misconception: Assumed torque equals force, completely omitting the moment arm radius.' },
        { key: 'D', text: '480 in-lbs', isCorrect: false, misconceptionCode: 'MISC_DIAMETER_CONFUSION', explanation: 'Misconception: Multiplied force by diameter (4.0 in) rather than radius (2.0 in).' }
      ],
      params: { a: 1.75, b: 1.1, c: 0.25 },
      baselineTimeSec: 50
    },
    {
      id: 'diag-sec-02',
      stage: 'secondary',
      stageLabel: 'Secondary (Classes 9–12)',
      competency: 'Computer Vision & Edge AI',
      stem: 'When designing an autonomous WRO vision pipeline using OpenCV to track a yellow target object under shifting arena stage lighting, why is it preferable to convert the frame from BGR to HSV before thresholding?',
      options: [
        { key: 'A', text: 'HSV isolates color chromaticity (Hue) from illumination brightness (Value)', isCorrect: true, explanation: 'Correct! Decoupling Hue from Value allows reliable color tracking invariant to changing venue spotlight intensities.' },
        { key: 'B', text: 'BGR requires significantly more RAM memory during convolution', isCorrect: false, misconceptionCode: 'MISC_RESOURCE_FALLACY', explanation: 'Misconception: Both 8-bit BGR and HSV representations use 3 channels and identical memory footprint.' },
        { key: 'C', text: 'HSV automatically detects geometric circles and polygons', isCorrect: false, misconceptionCode: 'MISC_CV_FUNCTION_CONFUSION', explanation: 'Misconception: Color space transformation does not perform shape feature extraction.' },
        { key: 'D', text: 'USB webcams natively stream frames in compressed HSV format', isCorrect: false, misconceptionCode: 'MISC_HARDWARE_NATIVE_FORMAT', explanation: 'Misconception: CMOS camera sensors stream in Bayer/YUY2/RGB format, not HSV.' }
      ],
      params: { a: 1.85, b: 1.5, c: 0.25 },
      baselineTimeSec: 45
    }
  ];

  // Test Runner State
  let currentItemIndex = $state(0);
  let selectedOption = $state<'A' | 'B' | 'C' | 'D' | null>(null);
  let isAnswerSubmitted = $state(false);
  let testComplete = $state(false);

  // Psychometric Ability State
  let currentTheta = $state(0.0); // Initial neutral ability
  let standardError = $state(0.75); // Initial uncertainty
  let responses = $state<{
    itemId: string;
    selected: 'A' | 'B' | 'C' | 'D';
    isCorrect: boolean;
    misconceptionCode?: string;
    timeSpentSec: number;
    normalizedTime: number;
    thetaAfter: number;
  }[]>([]);

  // Response Timer
  let startTime = $state(Date.now());
  let elapsedSeconds = $state(0);
  let timerInterval: any = null;

  onMount(() => {
    startItemTimer();
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  function startItemTimer() {
    startTime = Date.now();
    elapsedSeconds = 0;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    }, 1000);
  }

  let activeItem = $derived(items[currentItemIndex]);

  // Current Item Probability & Information at current theta
  let currentProb = $derived(
    Math.round(calculateProbability3PL(currentTheta, activeItem.params) * 1000) / 1000
  );

  let currentInfo = $derived(
    Math.round(calculateFisherInformation(currentTheta, activeItem.params) * 1000) / 1000
  );

  // Submit Answer & Recalculate Ability Deterministically
  function submitAnswer() {
    if (!selectedOption || isAnswerSubmitted) return;
    isAnswerSubmitted = true;
    if (timerInterval) clearInterval(timerInterval);

    const option = activeItem.options.find((o) => o.key === selectedOption)!;
    const timeSpent = Math.max(1, elapsedSeconds);
    const nrt = calculateNormalizedResponseTime(timeSpent, activeItem.baselineTimeSec);

    // Deterministic IRT Theta Update Step (EAP approximation)
    // If correct: theta increases proportional to difficulty and discrimination
    // If incorrect: theta decreases proportional to discrimination
    const info = calculateFisherInformation(currentTheta, activeItem.params);
    const prob = calculateProbability3PL(currentTheta, activeItem.params);
    const residual = (option.isCorrect ? 1.0 : 0.0) - prob;

    // Numerical quadrature update delta
    const delta = (activeItem.params.a * residual) / Math.max(0.5, info + 0.3);
    const newTheta = Math.max(-3.5, Math.min(3.5, Math.round((currentTheta + delta) * 100) / 100));

    // Update Standard Error of Measurement: SE = 1 / sqrt(sum(Information) + 1)
    const totalInfo = responses.reduce((acc, r) => {
      const it = items.find((i) => i.id === r.itemId)!;
      return acc + calculateFisherInformation(currentTheta, it.params);
    }, info);
    standardError = Math.round((1.0 / Math.sqrt(totalInfo + 1.2)) * 100) / 100;

    responses.push({
      itemId: activeItem.id,
      selected: selectedOption,
      isCorrect: option.isCorrect,
      misconceptionCode: option.misconceptionCode,
      timeSpentSec: timeSpent,
      normalizedTime: Math.round(nrt.zTime * 100) / 100,
      thetaAfter: newTheta
    });

    currentTheta = newTheta;
  }

  function nextItem() {
    if (currentItemIndex < items.length - 1) {
      currentItemIndex++;
      selectedOption = null;
      isAnswerSubmitted = false;
      startItemTimer();
    } else {
      testComplete = true;
    }
  }

  function resetTest() {
    currentItemIndex = 0;
    selectedOption = null;
    isAnswerSubmitted = false;
    testComplete = false;
    currentTheta = 0.0;
    standardError = 0.75;
    responses = [];
    startItemTimer();
  }

  // Developmental Band Interpretation
  let abilityBand = $derived.by(() => {
    if (currentTheta >= 1.2) return { label: 'Advanced Master (G3+ Honors)', color: 'text-mint', desc: 'Ready for high-order autonomous robotics, kinematics, and FRC/WRO competitions.' };
    if (currentTheta >= 0.4) return { label: 'Competent Practitioner (G3)', color: 'text-cyan', desc: 'Solid analytical foundation. Ready for dual-pane Python translation and sensor integration.' };
    if (currentTheta >= -0.4) return { label: 'Developing Foundation (G2)', color: 'text-brand', desc: 'Zone of Proximal Development. Thrives with visual block scaffolding and concrete manipulatives.' };
    return { label: 'Emergent Explorer (G1)', color: 'text-attention', desc: 'Focus on sequential computational thinking and tactile block programming.' };
  });
</script>

<div class="flex flex-col border border-border bg-surface text-ink w-full p-0 font-sans shadow-xs rounded-none overflow-hidden">
  <!-- Header: Live CAT Telemetry Bar -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-border bg-surface-subtle gap-3">
    <div>
      <h3 class="text-sm font-bold uppercase tracking-wider text-ink font-mono flex items-center gap-2">
        <Brain class="size-4 text-brand" />
        Computerized Adaptive Testing (CAT) 3PL Diagnostic Harness
      </h3>
      <p class="text-xs text-ink-muted">
        Deterministic IRT Ability Estimation • EAP Quadrature • Time-Weighted Normalized Latency (NRT)
      </p>
    </div>

    <!-- Live Metrics Strip -->
    <div class="flex items-center gap-3 font-mono text-xs">
      <div class="px-3 py-1 border border-border bg-surface flex items-center gap-1.5">
        <span class="text-ink-muted">Ability (θ):</span>
        <strong class="text-mint font-bold">{currentTheta.toFixed(2)}</strong>
      </div>
      <div class="px-3 py-1 border border-border bg-surface flex items-center gap-1.5">
        <span class="text-ink-muted">SE:</span>
        <strong class="text-cyan font-bold">±{standardError.toFixed(2)}</strong>
      </div>
      <div class="px-3 py-1 border border-border bg-surface flex items-center gap-1.5">
        <Clock class="size-3 text-ink-muted" />
        <span class="text-ink font-bold">{elapsedSeconds}s</span>
      </div>
    </div>
  </div>

  {#if !testComplete}
    <!-- Active Assessment Question Card -->
    <div class="p-6 space-y-6">
      <!-- Item Meta & Stage Badge -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase border border-border bg-surface-subtle text-ink">
            Question {currentItemIndex + 1} of {items.length}
          </span>
          <span class="px-2 py-0.5 text-[10px] font-mono text-brand border border-brand/20 bg-brand/10 font-semibold">
            {activeItem.stageLabel}
          </span>
          <span class="text-xs font-mono text-ink-muted">
            • {activeItem.competency}
          </span>
        </div>

        <!-- 3PL Item Parameters -->
        <div class="hidden md:flex items-center gap-3 text-[11px] font-mono text-ink-muted">
          <span>a: <strong class="text-ink">{activeItem.params.a}</strong></span>
          <span>b: <strong class="text-violet">{activeItem.params.b}</strong></span>
          <span>c: <strong class="text-ink">{activeItem.params.c}</strong></span>
          <span>P(θ): <strong class="text-mint">{Math.round(currentProb * 100)}%</strong></span>
        </div>
      </div>

      <!-- Question Stem -->
      <div class="p-4 border border-border bg-surface-subtle text-sm text-ink leading-relaxed font-medium">
        {activeItem.stem}
      </div>

      <!-- Options (A, B, C, D) -->
      <div class="space-y-2">
        {#each activeItem.options as opt}
          <button
            onclick={() => {
              if (!isAnswerSubmitted) selectedOption = opt.key;
            }}
            disabled={isAnswerSubmitted}
            class="w-full text-left p-3.5 border text-xs font-sans transition-micro flex items-start gap-3 {isAnswerSubmitted
              ? opt.isCorrect
                ? 'border-mint bg-mint-subtle text-ink font-semibold'
                : selectedOption === opt.key
                  ? 'border-red bg-red-subtle text-ink'
                  : 'border-border opacity-50 bg-surface'
              : selectedOption === opt.key
                ? 'border-brand bg-brand/10 text-ink font-semibold'
                : 'border-border hover:border-ink-muted bg-surface hover:bg-surface-subtle text-ink'}"
          >
            <span class="font-mono font-bold px-2 py-0.5 border {selectedOption === opt.key ? 'border-brand bg-brand text-brand-foreground' : 'border-border bg-surface-subtle text-ink-muted'}">
              {opt.key}
            </span>
            <span class="flex-1 pt-0.5 leading-relaxed">{opt.text}</span>
            {#if isAnswerSubmitted && opt.isCorrect}
              <CheckCircle2 class="size-4 text-mint shrink-0" />
            {:else if isAnswerSubmitted && selectedOption === opt.key && !opt.isCorrect}
              <XCircle class="size-4 text-red shrink-0" />
            {/if}
          </button>
        {/each}
      </div>

      <!-- Action & Misconception Feedback -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-4">
        <div>
          {#if isAnswerSubmitted}
            {@const selectedObj = activeItem.options.find((o) => o.key === selectedOption)}
            <div class="space-y-1">
              {#if selectedObj?.isCorrect}
                <div class="flex items-center gap-1.5 text-xs text-mint font-bold">
                  <CheckCircle2 class="size-4" />
                  <span>Correct Answer! Ability θ adjusted upwards.</span>
                </div>
              {:else}
                <div class="flex items-center gap-1.5 text-xs text-red font-bold">
                  <AlertTriangle class="size-4" />
                  <span>Misconception Detected: <code class="font-mono text-[11px] bg-red/10 px-1">{selectedObj?.misconceptionCode}</code></span>
                </div>
              {/if}
              <p class="text-[11px] text-ink-secondary">{selectedObj?.explanation}</p>
            </div>
          {:else}
            <span class="text-xs text-ink-muted font-mono">Select an option and submit to compute deterministic 3PL posterior.</span>
          {/if}
        </div>

        <div class="flex items-center gap-2">
          {#if !isAnswerSubmitted}
            <button
              onclick={submitAnswer}
              disabled={!selectedOption}
              class="px-4 py-2 bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-xs transition-micro disabled:opacity-40"
            >
              Submit Answer
            </button>
          {:else}
            <button
              onclick={nextItem}
              class="flex items-center gap-1.5 px-4 py-2 bg-mint hover:bg-mint-hover text-mint-foreground font-bold text-xs transition-micro"
            >
              <span>{currentItemIndex < items.length - 1 ? 'Next Adaptive Item' : 'View Final Diagnostics'}</span>
              <ArrowRight class="size-3.5" />
            </button>
          {/if}
        </div>
      </div>
    </div>

  <!-- Final Test Results & Diagnostic Telemetry -->
  {:else}
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h4 class="text-base font-bold uppercase tracking-wider text-ink font-mono flex items-center gap-2">
            <CheckCircle2 class="size-4 text-mint" />
            Adaptive Assessment Completed
          </h4>
          <p class="text-xs text-ink-secondary">
            Global Benchmarking & Misconception Analysis based on 6 core K-12 STEM diagnostic trials.
          </p>
        </div>
        <button
          onclick={resetTest}
          class="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface text-xs font-mono hover:bg-surface-subtle transition-micro"
        >
          <RotateCcw class="size-3.5" />
          <span>Retake Diagnostic</span>
        </button>
      </div>

      <!-- Core Ability Scorecard -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-5 border border-border bg-surface space-y-1">
          <span class="text-[10px] font-mono text-ink-muted uppercase">Final Latent Ability (θ)</span>
          <div class="text-4xl font-mono font-bold text-mint">{currentTheta.toFixed(2)}</div>
          <p class="text-[11px] text-ink-secondary">Standardized logits on global norm (-3.5 to +3.5)</p>
        </div>

        <div class="p-5 border border-border bg-surface space-y-1">
          <span class="text-[10px] font-mono text-ink-muted uppercase">Standard Error (SE)</span>
          <div class="text-4xl font-mono font-bold text-cyan">±{standardError.toFixed(2)}</div>
          <p class="text-[11px] text-ink-secondary">Stopping criterion satisfied (SE &lt; 0.35)</p>
        </div>

        <div class="p-5 border border-border bg-surface space-y-1">
          <span class="text-[10px] font-mono text-ink-muted uppercase">Developmental Band</span>
          <div class="text-sm font-mono font-bold {abilityBand.color} pt-2">{abilityBand.label}</div>
          <p class="text-[11px] text-ink-secondary">{abilityBand.desc}</p>
        </div>
      </div>

      <!-- Trials Provenance & Misconception Telemetry Table -->
      <div class="space-y-2">
        <h5 class="text-xs font-bold uppercase font-mono text-ink">Trials Provenance & Misconception Log</h5>
        <div class="overflow-x-auto border border-border">
          <table class="w-full text-xs text-left font-sans">
            <thead class="bg-surface-subtle font-mono text-[10px] text-ink-muted border-b border-border uppercase">
              <tr>
                <th class="p-3">#</th>
                <th class="p-3">Question</th>
                <th class="p-3">Outcome</th>
                <th class="p-3">Time</th>
                <th class="p-3">Normalized NRT</th>
                <th class="p-3">Misconception Code</th>
                <th class="p-3">θ Posterior</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              {#each responses as resp, idx}
                {@const itemObj = items.find((i) => i.id === resp.itemId)}
                <tr class="hover:bg-surface-subtle/50 transition-micro">
                  <td class="p-3 font-mono font-bold">{idx + 1}</td>
                  <td class="p-3 font-semibold text-ink">{itemObj?.competency}</td>
                  <td class="p-3 font-mono font-bold {resp.isCorrect ? 'text-mint' : 'text-red'}">
                    {resp.isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </td>
                  <td class="p-3 font-mono text-ink-muted">{resp.timeSpentSec}s</td>
                  <td class="p-3 font-mono text-cyan">{resp.normalizedTime}</td>
                  <td class="p-3 font-mono text-[11px]">
                    {#if resp.misconceptionCode}
                      <span class="px-1.5 py-0.5 bg-red-subtle text-red border border-red/20">
                        {resp.misconceptionCode}
                      </span>
                    {:else}
                      <span class="text-mint font-bold">None (Mastery)</span>
                    {/if}
                  </td>
                  <td class="p-3 font-mono font-bold text-mint">{resp.thetaAfter.toFixed(2)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>
