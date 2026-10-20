<script lang="ts">
  import {
    Sparkles,
    BookOpen,
    Layers,
    Compass,
    Cpu,
    Plus,
    CheckCircle2,
    Clock,
    Target,
    AlertCircle,
    ChevronRight,
    Save,
    RotateCcw,
    BrainCircuit,
    Lightbulb,
    Edit3,
    Check,
    X,
    Copy,
    ArrowRight
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { DifferentiatedLessonPlan, PedagogicalPlaybook } from '$lib/server/repository';

  let { data }: { data: PageData } = $props();

  type ViewMode = 'cra_studio' | 'playbooks';
  let activeView = $state<ViewMode>('cra_studio');

  // CRA Lesson Studio state
  let createdPlans = $state<DifferentiatedLessonPlan[]>([]);
  const plans = $derived<DifferentiatedLessonPlan[]>([...createdPlans, ...data.lessonPlans]);
  let selectedPlanIdState = $state<string | null>(null);
  const selectedPlanId = $derived<string>(selectedPlanIdState ?? data.lessonPlans[0]?.id ?? '');
  let isCreatingNew = $state(false);
  let isSaving = $state(false);

  // Cohort Misconception & Scaffolding Presets Library
  interface MisconceptionPreset {
    tag: string;
    label: string;
    subject: 'STEM Reasoning' | 'English Literacy' | 'Autonomous Robotics';
    framework: 'CRA (Concrete-Representational-Abstract)' | 'PRIMM' | 'Productive Struggle Scaffolding';
    diagnosis: string;
    tier1: {
      strategy: string;
      tactileActivity: string;
      checkQuestion: string;
      durationMinutes: number;
    };
    tier2: {
      task: string;
      evidenceCheckpoint: string;
      durationMinutes: number;
    };
    tier3: {
      challenge: string;
      evaluationRubric: string;
      durationMinutes: number;
    };
  }

  const MISCONCEPTION_PRESETS: MisconceptionPreset[] = [
    {
      tag: 'volume_neglect',
      label: 'Volume vs Mass Equivalence in Buoyancy',
      subject: 'STEM Reasoning',
      framework: 'CRA (Concrete-Representational-Abstract)',
      diagnosis: 'Cohort diagnostics reveal 42% of students predict sinking based solely on object mass, ignoring displaced fluid volume.',
      tier1: {
        strategy: 'Physical tactile water displacement measurement using calibrated overflow beakers and brass/aluminum cylinders.',
        tactileActivity: 'Submerge equal-mass objects of different volumes; measure and weigh the displaced water to observe buoyant force F_b.',
        checkQuestion: 'Why does the larger brass cylinder experience greater buoyant upthrust despite having identical balance mass?',
        durationMinutes: 15
      },
      tier2: {
        task: 'Construct free-body vector force diagrams balancing buoyant force vector F_b against gravitational weight vector F_g.',
        evidenceCheckpoint: 'Correctly formulate the equilibrium equation rho * V * g = m * g and solve for neutral buoyancy density thresholds.',
        durationMinutes: 20
      },
      tier3: {
        challenge: 'Design a closed-loop variable ballast submarine depth regulator with autonomous pneumatic buoyancy control.',
        evaluationRubric: 'Algorithmic efficiency, PID parameter tuning, and mathematical justification of displaced mass ratios under pressure gradients.',
        durationMinutes: 10
      }
    },
    {
      tag: 'loop_state_confusion',
      label: 'Loop Counter vs Accumulator State in Robotics',
      subject: 'Autonomous Robotics',
      framework: 'PRIMM',
      diagnosis: 'Students conflate loop iteration step counters with mutable sensor accumulator state variables across asynchronous polling ticks.',
      tier1: {
        strategy: 'Physical token-passing simulation where learners physically step along floor tiles holding separate counter and odometer cards.',
        tactileActivity: 'Walk 5 grid steps with two index cards: one increments by 1 each step (counter), one accumulates distance read from ultrasonic sensor.',
        checkQuestion: 'When the loop terminates at index 5, why is total accumulated distance not equal to 5?',
        durationMinutes: 15
      },
      tier2: {
        task: 'Trace state transition tables and predict variable state matrices across 4 sensor polling intervals before executing simulation.',
        evidenceCheckpoint: '100% accuracy predicting variable values at step checkpoints prior to running the Monaco IDE test harness.',
        durationMinutes: 20
      },
      tier3: {
        challenge: 'Refactor non-blocking event loop scheduler handling dual LiDAR interrupts and emergency braking without race conditions.',
        evaluationRubric: 'Zero state corruption, clean lock-free state isolation, and deterministic sensor polling within 20ms deadlines.',
        durationMinutes: 10
      }
    },
    {
      tag: 'vector_bearing_misconception',
      label: 'Scalar Speed vs Vector Heading in Trajectories',
      subject: 'Autonomous Robotics',
      framework: 'CRA (Concrete-Representational-Abstract)',
      diagnosis: 'Students treat robot velocity as a single scalar quantity, failing to decompose steering angles into orthogonal Cartesian dx/dy increments.',
      tier1: {
        strategy: 'Floor grid coordinate walk using magnetic compass and protractor angles to trace 45° vector diagonals.',
        tactileActivity: 'Physically pace out 3 steps North and 4 steps East to observe hypotenuse displacement vs path length.',
        checkQuestion: 'If the rover travels 100cm at heading 045°, why are both delta X and delta Y less than 100cm?',
        durationMinutes: 15
      },
      tier2: {
        task: 'Calculate trigonometric vector velocity components (vx = v * cos theta, vy = v * sin theta) and plot trajectory waypoints.',
        evidenceCheckpoint: 'Correctly compute destination coordinates within +/- 1cm precision for 3 successive bearing changes.',
        durationMinutes: 20
      },
      tier3: {
        challenge: 'Implement a proportional-derivative (PD) heading controller with dead-reckoning odometry drift correction.',
        evaluationRubric: 'Minimal angular overshoot (< 5°), sub-second settling time, and rigorous analytical error modeling.',
        durationMinutes: 10
      }
    },
    {
      tag: 'proportional_scaling_misconception',
      label: 'Square-Cube Law & Structural Scaling in Mechanical Design',
      subject: 'STEM Reasoning',
      framework: 'Productive Struggle Scaffolding',
      diagnosis: 'Students assume structural strength and weight scale proportionally (1:1), failing to anticipate volume scaling at L^3 vs area at L^2.',
      tier1: {
        strategy: 'Modular block beam deflection test comparing 1x1, 2x2, and 4x4 structural cantilever profiles under calibrated load.',
        tactileActivity: 'Assemble square beams using interlocking foam blocks; measure millimeter deflection as hanging weights are applied.',
        checkQuestion: 'When beam length and width double, why does mass increase 8-fold while cross-sectional area only increases 4-fold?',
        durationMinutes: 15
      },
      tier2: {
        task: 'Plot surface area vs volume logarithmic scaling curves (L^2 vs L^3) to predict maximum allowable span length.',
        evidenceCheckpoint: 'Accurately derive the critical bending moment threshold before material yield occurs.',
        durationMinutes: 20
      },
      tier3: {
        challenge: 'Synthesize a lightweight topological truss structure maximizing structural strength-to-weight ratio under FEA stress.',
        evaluationRubric: 'Highest load-to-weight efficiency ratio with rigorous mathematical stress-strain justification.',
        durationMinutes: 10
      }
    }
  ];

  // New plan form state
  let newTitle = $state('');
  let newSubject = $state<'STEM Reasoning' | 'English Literacy' | 'Autonomous Robotics'>('STEM Reasoning');
  let newTargetGrade = $state('Class 8 / Middle Stage');
  let newFramework = $state<'PRIMM' | 'CRA (Concrete-Representational-Abstract)' | 'Productive Struggle Scaffolding'>('CRA (Concrete-Representational-Abstract)');
  let newMisconceptionTag = $state('volume_neglect');
  let newMisconceptionLabel = $state('Volume vs Mass Equivalence in Buoyancy');
  let newMisconceptionDiagnosis = $state('Cohort diagnostics reveal 42% of students predict sinking based solely on object mass, ignoring displaced fluid volume.');
  let newTier1Strategy = $state('Physical tactile water displacement measurement using calibrated overflow beakers and brass/aluminum cylinders.');
  let newTier1Activity = $state('Submerge equal-mass objects of different volumes; measure and weigh the displaced water to observe buoyant force F_b.');
  let newTier1Check = $state('Why does the larger brass cylinder experience greater buoyant upthrust despite having identical balance mass?');
  let newTier2Task = $state('Construct free-body vector force diagrams balancing buoyant force vector F_b against gravitational weight vector F_g.');
  let newTier2Checkpoint = $state('Correctly formulate the equilibrium equation rho * V * g = m * g and solve for neutral buoyancy density thresholds.');
  let newTier3Challenge = $state('Design a closed-loop variable ballast submarine depth regulator with autonomous pneumatic buoyancy control.');
  let newTier3Rubric = $state('Algorithmic efficiency, PID parameter tuning, and mathematical justification of displaced mass ratios under pressure gradients.');

  function applyMisconceptionPreset(preset: MisconceptionPreset) {
    newTitle = `${preset.label.split(' in ')[0]} Scaffolding Studio`;
    newSubject = preset.subject;
    newFramework = preset.framework;
    newMisconceptionTag = preset.tag;
    newMisconceptionLabel = preset.label;
    newMisconceptionDiagnosis = preset.diagnosis;
    newTier1Strategy = preset.tier1.strategy;
    newTier1Activity = preset.tier1.tactileActivity;
    newTier1Check = preset.tier1.checkQuestion;
    newTier2Task = preset.tier2.task;
    newTier2Checkpoint = preset.tier2.evidenceCheckpoint;
    newTier3Challenge = preset.tier3.challenge;
    newTier3Rubric = preset.tier3.evaluationRubric;
  }

  const selectedPlan = $derived<DifferentiatedLessonPlan | undefined>(
    plans.find((p) => p.id === selectedPlanId) || plans[0]
  );

  async function handleSaveNewPlan() {
    if (!newTitle) return;
    isSaving = true;

    try {
      let payload: DifferentiatedLessonPlan = {
        id: `PLAN-${Date.now()}`,
        title: newTitle,
        subject: newSubject,
        targetGrade: newTargetGrade,
        durationMinutes: 45,
        alignedStandards: ['PISA Science Level 5', 'TIMSS Physics', 'NEP 2020 Experiential Learning'],
        targetedMisconception: {
          tag: newMisconceptionTag,
          label: newMisconceptionLabel,
          diagnosis: newMisconceptionDiagnosis || 'Derived from cohort diagnostic benchmark error analysis.'
        },
        pedagogicalFramework: newFramework,
        tier1Remediation: {
          tierTitle: 'Tier 1: Concrete Scaffold & Tactile Lab',
          studentTarget: 'Students requiring experiential tactile grounding',
          scaffoldStrategy: newTier1Strategy,
          tactileActivity: newTier1Activity,
          checkQuestion: newTier1Check
        },
        tier2Core: {
          tierTitle: 'Tier 2: Representational Vector Modeling',
          studentTarget: 'Students on grade-level mathematical representation',
          collaborativeTask: newTier2Task,
          evidenceCheckpoint: newTier2Checkpoint
        },
        tier3Extension: {
          tierTitle: 'Tier 3: Open-Ended Optimization & Synthesis',
          studentTarget: 'Advanced students ready for tournament-level challenges',
          inquiryChallenge: newTier3Challenge,
          evaluationRubric: newTier3Rubric
        },
        teacherFacilitatorNotes: [
          'Which representations triggered immediate comprehension breakthroughs?',
          'Record individual evidence observations for student capability portfolios.'
        ],
        createdAt: new Date().toISOString()
      };

      try {
        const res = await fetch('/api/v1/teachers/lesson-plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.lessonPlan) payload = data.lessonPlan;
        }
      } catch (err) {
        console.warn('Persisting lesson plan to backend failed, using memory state:', err);
      }

      createdPlans = [payload, ...createdPlans];
      selectedPlanIdState = payload.id;
      isCreatingNew = false;
      newTitle = '';
    } finally {
      isSaving = false;
    }
  }

  // In-place Plan Tier Editing State
  let isEditingCurrent = $state(false);
  let editTitle = $state('');
  let editTier1Strategy = $state('');
  let editTier1Activity = $state('');
  let editTier1Check = $state('');
  let editTier2Task = $state('');
  let editTier2Checkpoint = $state('');
  let editTier3Challenge = $state('');
  let editTier3Rubric = $state('');
  let editSuccessMessage = $state<string | null>(null);
  let editErrorMessage = $state<string | null>(null);

  function startEditingSelected() {
    if (!selectedPlan) return;
    editTitle = selectedPlan.title;
    editTier1Strategy = selectedPlan.tier1Remediation.scaffoldStrategy;
    editTier1Activity = selectedPlan.tier1Remediation.tactileActivity;
    editTier1Check = selectedPlan.tier1Remediation.checkQuestion;
    editTier2Task = selectedPlan.tier2Core.collaborativeTask;
    editTier2Checkpoint = selectedPlan.tier2Core.evidenceCheckpoint;
    editTier3Challenge = selectedPlan.tier3Extension.inquiryChallenge;
    editTier3Rubric = selectedPlan.tier3Extension.evaluationRubric;
    isEditingCurrent = true;
  }

  function handleSaveCurrentEdit() {
    if (!selectedPlan) return;
    const updatedPlan: DifferentiatedLessonPlan = {
      ...selectedPlan,
      title: editTitle || selectedPlan.title,
      tier1Remediation: {
        ...selectedPlan.tier1Remediation,
        scaffoldStrategy: editTier1Strategy,
        tactileActivity: editTier1Activity,
        checkQuestion: editTier1Check
      },
      tier2Core: {
        ...selectedPlan.tier2Core,
        collaborativeTask: editTier2Task,
        evidenceCheckpoint: editTier2Checkpoint
      },
      tier3Extension: {
        ...selectedPlan.tier3Extension,
        inquiryChallenge: editTier3Challenge,
        evaluationRubric: editTier3Rubric
      }
    };

    try {
      fetch('/api/v1/teachers/lesson-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPlan)
      }).catch((err) => console.warn('Syncing edited lesson plan to backend failed:', err));
    } catch {}

    const existingIndex = createdPlans.findIndex((p) => p.id === selectedPlan.id);
    if (existingIndex >= 0) {
      createdPlans[existingIndex] = updatedPlan;
    } else {
      createdPlans = [updatedPlan, ...createdPlans];
    }
    selectedPlanIdState = updatedPlan.id;
    isEditingCurrent = false;
    editSuccessMessage = 'Lesson plan tiers updated successfully.';
    setTimeout(() => {
      editSuccessMessage = null;
    }, 3000);
  }

  async function copyPlanBrief() {
    if (!selectedPlan) return;
    const text = `CREED OS Lesson Plan: ${selectedPlan.title}\nFramework: ${selectedPlan.pedagogicalFramework} (${selectedPlan.durationMinutes}m)\nMisconception: ${selectedPlan.targetedMisconception?.label}\n\n${selectedPlan.tier1Remediation.tierTitle}:\n${selectedPlan.tier1Remediation.scaffoldStrategy}\nCheck: ${selectedPlan.tier1Remediation.checkQuestion}\n\n${selectedPlan.tier2Core.tierTitle}:\n${selectedPlan.tier2Core.collaborativeTask}\nEvidence: ${selectedPlan.tier2Core.evidenceCheckpoint}\n\n${selectedPlan.tier3Extension.tierTitle}:\n${selectedPlan.tier3Extension.inquiryChallenge}\nRubric: ${selectedPlan.tier3Extension.evaluationRubric}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      editErrorMessage = null;
      editSuccessMessage = 'Lesson plan brief copied to clipboard.';
      setTimeout(() => {
        editSuccessMessage = null;
      }, 2500);
    } catch (err: any) {
      editSuccessMessage = null;
      editErrorMessage = 'Failed to copy to clipboard: ' + (err.message || 'Permission denied');
      setTimeout(() => {
        editErrorMessage = null;
      }, 3500);
    }
  }

  // Playbooks state
  let selectedPlaybookIdState = $state<string | null>(null);
  const selectedPlaybookId = $derived<string>(selectedPlaybookIdState ?? data.playbooks[0]?.id ?? 'PLAY-PRIMM');
  const selectedPlaybook = $derived<PedagogicalPlaybook | undefined>(
    data.playbooks.find((p: PedagogicalPlaybook) => p.id === selectedPlaybookId) || data.playbooks[0]
  );
</script>

<svelte:head>
  <title>3-Tier CRA Studio & Faculty Guidance · CREED OS</title>
  <meta name="description" content="3-Tier Concrete-Representational-Abstract differentiated lesson studio and faculty remediation playbooks." />
</svelte:head>

<div class="space-y-6 pb-20">
  <!-- Top Navigation & Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-ink-muted font-mono">
          WAY Console • Faculty Pedagogy Engine
        </span>
        <span class="text-xs text-ink-muted">•</span>
        <span class="text-xs text-ink-secondary font-medium">Concrete → Representational → Abstract</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-ink font-heading">
        3-Tier CRA Lesson Studio & Remediation
      </h1>
    </div>

    <!-- Segmented Navigation Pills -->
    <div class="flex items-center gap-2">
      <div class="flex items-center p-1 rounded-sm border border-border bg-surface-subtle">
        <button
          type="button"
          onclick={() => (activeView = 'cra_studio')}
          class="px-3 py-1 text-xs font-mono rounded-sm transition-micro {activeView === 'cra_studio'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          1. 3-Tier CRA Studio
        </button>
        <button
          type="button"
          onclick={() => (activeView = 'playbooks')}
          class="px-3 py-1 text-xs font-mono rounded-sm transition-micro {activeView === 'playbooks'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          2. Faculty Playbooks
        </button>
      </div>

      {#if activeView === 'cra_studio'}
        <button
          type="button"
          onclick={() => (isCreatingNew = !isCreatingNew)}
          class="px-3 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-semibold rounded-sm transition-micro flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus class="size-3.5" />
          <span>{isCreatingNew ? 'Cancel Plan' : 'Compose CRA Plan'}</span>
        </button>
      {/if}
    </div>
  </div>

  {#if activeView === 'cra_studio'}
    <!-- NEW PLAN COMPOSER MODAL / DRAWER -->
    {#if isCreatingNew}
      <div class="p-6 bg-surface border-2 border-brand/40 rounded-sm space-y-5 shadow-sm">
        <div class="flex items-center justify-between pb-3 border-b border-border">
          <div class="flex items-center gap-2">
            <Sparkles class="size-4 text-brand" />
            <h3 class="text-sm font-bold text-ink">Compose 3-Tier Differentiated CRA Lesson Plan</h3>
          </div>
          <span class="text-xs font-mono text-ink-muted">NEP 2020 & PISA Aligned</span>
        </div>

        <!-- Quick Misconception Presets -->
        <div class="space-y-2 p-3 bg-surface-subtle border border-border rounded-sm">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-mono font-bold uppercase text-ink-secondary">
              Scaffold From Diagnostic Error Presets:
            </span>
            <span class="text-[10px] font-mono text-ink-muted">Click to auto-populate all 3 tiers</span>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each MISCONCEPTION_PRESETS as preset}
              <button
                type="button"
                onclick={() => applyMisconceptionPreset(preset)}
                class="px-2 py-1 text-xs font-mono rounded-sm border transition-micro cursor-pointer flex items-center gap-1.5 {newMisconceptionTag === preset.tag
                  ? 'bg-brand text-brand-foreground border-brand font-semibold shadow-2xs'
                  : 'bg-surface hover:bg-surface-raised border-border text-ink-secondary hover:text-ink'}"
              >
                <Target class="size-3" />
                <span>{preset.label.split(' in ')[0]}</span>
                <span class="text-[10px] opacity-75">({preset.framework.split(' ')[0]})</span>
              </button>
            {/each}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div class="space-y-1 md:col-span-2">
            <label for="plan-title" class="font-semibold text-ink">Lesson Title</label>
            <input
              id="plan-title"
              type="text"
              placeholder="e.g. Buoyancy, Hydrostatic Pressure & Vector Equilibrium"
              bind:value={newTitle}
              class="w-full px-3 py-2 bg-surface-subtle border border-border rounded-sm text-xs font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand transition-colors"
            />
          </div>

          <div class="space-y-1">
            <label for="plan-subject" class="font-semibold text-ink">Domain Subject</label>
            <select
              id="plan-subject"
              bind:value={newSubject}
              class="w-full px-3 py-2 bg-surface-subtle border border-border rounded-sm text-xs font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand transition-colors"
            >
              <option value="STEM Reasoning">STEM Reasoning</option>
              <option value="English Literacy">English Literacy</option>
              <option value="Autonomous Robotics">Autonomous Robotics</option>
            </select>
          </div>

          <div class="space-y-1">
            <label for="plan-framework" class="font-semibold text-ink">Pedagogical Framework</label>
            <select
              id="plan-framework"
              bind:value={newFramework}
              class="w-full px-3 py-2 bg-surface-subtle border border-border rounded-sm text-xs font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand transition-colors"
            >
              <option value="CRA (Concrete-Representational-Abstract)">CRA Framework</option>
              <option value="PRIMM">PRIMM Pedagogy</option>
              <option value="Productive Struggle Scaffolding">Productive Struggle</option>
            </select>
          </div>
        </div>

        <!-- Misconception Diagnosis Fields -->
        <div class="p-3 bg-attention-subtle border border-attention/20 rounded-sm space-y-2 text-xs">
          <div class="flex items-center gap-1.5 font-bold text-ink">
            <AlertCircle class="size-3.5 text-attention" />
            <span>Targeted Cohort Misconception & Error Diagnosis</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="space-y-1">
              <label for="misconception-label" class="text-[11px] font-semibold text-ink-secondary">Misconception Identifier</label>
              <input
                id="misconception-label"
                type="text"
                bind:value={newMisconceptionLabel}
                class="w-full px-3 py-1.5 bg-surface border border-border rounded-sm text-xs font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              />
            </div>
            <div class="space-y-1 md:col-span-2">
              <label for="misconception-diag" class="text-[11px] font-semibold text-ink-secondary">Empirical Diagnosis / Error Pattern</label>
              <input
                id="misconception-diag"
                type="text"
                bind:value={newMisconceptionDiagnosis}
                class="w-full px-3 py-1.5 bg-surface border border-border rounded-sm text-xs font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Granular 3-Tier Strategy Fields -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <!-- Tier 1 -->
          <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-3">
            <div class="flex items-center justify-between pb-1 border-b border-border/50">
              <span class="text-[11px] font-mono font-bold uppercase text-brand">Tier 1: Concrete Scaffold</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-brand-subtle text-brand text-[10px] font-mono font-bold">15 min</span>
            </div>
            <div class="space-y-1">
              <label for="compose-tier1-strategy" class="text-[10px] font-semibold uppercase text-ink-muted">Scaffold Strategy</label>
              <textarea
                id="compose-tier1-strategy"
                bind:value={newTier1Strategy}
                rows="2"
                class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-sans text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label for="compose-tier1-activity" class="text-[10px] font-semibold uppercase text-ink-muted">Tactile Lab Prompt (Physical Intuition)</label>
              <textarea
                id="compose-tier1-activity"
                bind:value={newTier1Activity}
                rows="2"
                class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-mono text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label for="compose-tier1-check" class="text-[10px] font-semibold uppercase text-ink-muted">Immediate Checkpoint Question</label>
              <textarea
                id="compose-tier1-check"
                bind:value={newTier1Check}
                rows="2"
                class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-mono text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              ></textarea>
            </div>
          </div>

          <!-- Tier 2 -->
          <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-3">
            <div class="flex items-center justify-between pb-1 border-b border-border/50">
              <span class="text-[11px] font-mono font-bold uppercase text-mint">Tier 2: Representational Vector Modeling</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-mint-subtle text-mint text-[10px] font-mono font-bold">20 min</span>
            </div>
            <div class="space-y-1">
              <label for="compose-tier2-task" class="text-[10px] font-semibold uppercase text-ink-muted">Collaborative Task / Vector Schema</label>
              <textarea
                id="compose-tier2-task"
                bind:value={newTier2Task}
                rows="3"
                class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-sans text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label for="compose-tier2-checkpoint" class="text-[10px] font-semibold uppercase text-ink-muted">Observable Evidence Checkpoint</label>
              <textarea
                id="compose-tier2-checkpoint"
                bind:value={newTier2Checkpoint}
                rows="4"
                class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-mono text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              ></textarea>
            </div>
          </div>

          <!-- Tier 3 -->
          <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-3">
            <div class="flex items-center justify-between pb-1 border-b border-border/50">
              <span class="text-[11px] font-mono font-bold uppercase text-cyan">Tier 3: Abstract Synthesis</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-cyan/10 text-cyan text-[10px] font-mono font-bold">10 min</span>
            </div>
            <div class="space-y-1">
              <label for="compose-tier3-challenge" class="text-[10px] font-semibold uppercase text-ink-muted">Open-Ended Inquiry / Tournament Challenge</label>
              <textarea
                id="compose-tier3-challenge"
                bind:value={newTier3Challenge}
                rows="3"
                class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-sans text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label for="compose-tier3-rubric" class="text-[10px] font-semibold uppercase text-ink-muted">Evaluation Rubric & Exemplar Standards</label>
              <textarea
                id="compose-tier3-rubric"
                bind:value={newTier3Rubric}
                rows="4"
                class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-mono text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <button
            type="button"
            onclick={() => (isCreatingNew = false)}
            class="px-3.5 py-1.5 text-xs text-ink-secondary hover:text-ink cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onclick={handleSaveNewPlan}
            disabled={!newTitle || isSaving}
            class="px-4 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-semibold rounded-sm transition-micro flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save class="size-3.5" />
            <span>{isSaving ? 'Compiling...' : 'Save & Publish Plan'}</span>
          </button>
        </div>
      </div>
    {/if}

    <!-- 2-Column Studio: Selector List (Left) + Detailed 3-Tier Matrix (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-4 space-y-3">
        <span class="text-xs font-bold text-ink font-mono uppercase tracking-wider block">
          Available CRA Plans ({plans.length})
        </span>

        <div class="space-y-2 max-h-160 overflow-y-auto pr-1">
          {#each plans as plan}
            <button
              type="button"
              onclick={() => {
                selectedPlanIdState = plan.id;
                isEditingCurrent = false;
              }}
              class="w-full text-left p-4 rounded-sm border transition-micro cursor-pointer {selectedPlanId === plan.id
                ? 'bg-surface-raised border-brand text-ink ring-1 ring-brand shadow-2xs'
                : 'bg-surface border-border hover:bg-surface-subtle text-ink-secondary'}"
            >
              <div class="flex items-center justify-between text-[10px] font-mono text-ink-muted">
                <span>{plan.subject}</span>
                <span>{plan.durationMinutes}m</span>
              </div>
              <h4 class="text-xs font-bold text-ink mt-1 line-clamp-1">{plan.title}</h4>
              <p class="text-[11px] text-ink-muted mt-0.5 line-clamp-2">
                Targets: {plan.targetedMisconception?.label || 'Core Competency'}
              </p>
            </button>
          {/each}
        </div>
      </div>

      <div class="lg:col-span-8">
        {#if selectedPlan}
          <div class="p-6 bg-surface border border-border rounded-sm space-y-6 shadow-2xs">
            <!-- Level 1 Signal: Plan Title, Action Bar & Timing -->
            <div class="space-y-3 pb-4 border-b border-border">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2 py-0.5 rounded-sm bg-brand-subtle text-brand text-[10px] font-mono font-bold">
                    {selectedPlan.pedagogicalFramework}
                  </span>
                  <span class="text-xs text-ink-muted font-mono">{selectedPlan.targetGrade}</span>
                  <span class="text-xs text-ink-muted">•</span>
                  <span class="text-xs font-mono text-ink-secondary">
                    {selectedPlan.durationMinutes}m total (15m · 20m · 10m)
                  </span>
                </div>

                <!-- Customization Action Buttons -->
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    onclick={copyPlanBrief}
                    class="px-2 py-1 text-xs font-mono rounded-sm border border-border bg-surface-subtle hover:bg-surface-raised text-ink-secondary hover:text-ink transition-micro flex items-center gap-1 cursor-pointer"
                    title="Copy full 3-tier brief to clipboard"
                  >
                    <Copy class="size-3" />
                    <span>Copy Brief</span>
                  </button>

                  {#if !isEditingCurrent}
                    <button
                      type="button"
                      onclick={startEditingSelected}
                      class="px-2 py-1 text-xs font-mono rounded-sm border border-brand/40 bg-brand-subtle hover:bg-brand/20 text-brand font-semibold transition-micro flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 class="size-3" />
                      <span>Edit Tiers</span>
                    </button>
                  {:else}
                    <button
                      type="button"
                      onclick={() => (isEditingCurrent = false)}
                      class="px-2 py-1 text-xs font-mono rounded-sm border border-border bg-surface hover:bg-surface-subtle text-ink-secondary cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onclick={handleSaveCurrentEdit}
                      class="px-3 py-1 text-xs font-mono rounded-sm bg-brand hover:bg-brand/90 text-brand-foreground font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Save class="size-3" />
                      <span>Save Changes</span>
                    </button>
                  {/if}
                </div>
              </div>

              <!-- Success Alert Message -->
              {#if editSuccessMessage}
                <div class="p-3 bg-positive-subtle border border-positive/30 rounded-sm text-xs font-mono text-positive flex items-center gap-2 animate-fadeIn">
                  <Check class="size-3.5 shrink-0" />
                  <span>{editSuccessMessage}</span>
                </div>
              {/if}

              <!-- Error Alert Message -->
              {#if editErrorMessage}
                <div class="p-3 bg-critical-subtle border border-critical/30 rounded-sm text-xs font-mono text-critical flex items-center gap-2 animate-fadeIn">
                  <AlertCircle class="size-3.5 shrink-0" />
                  <span>{editErrorMessage}</span>
                </div>
              {/if}

              {#if !isEditingCurrent}
                <h2 class="text-lg font-bold text-ink font-heading">{selectedPlan.title}</h2>
              {:else}
                <div class="space-y-1 pt-1">
                  <label for="edit-plan-title" class="text-[11px] font-mono uppercase text-ink-muted">Lesson Title</label>
                  <input
                    id="edit-plan-title"
                    type="text"
                    bind:value={editTitle}
                    class="w-full px-3 py-1.5 bg-surface-subtle border border-border rounded-sm text-sm font-bold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
              {/if}

              <!-- Level 2 Context: Diagnosed Misconception -->
              <div class="p-3 bg-attention-subtle border border-attention/20 rounded-sm text-xs text-ink flex items-start gap-2">
                <AlertCircle class="size-4 text-attention shrink-0 mt-0.5" />
                <div>
                  <strong>Diagnosed Misconception:</strong> {selectedPlan.targetedMisconception?.label}
                  <p class="text-[11px] text-ink-secondary mt-0.5">{selectedPlan.targetedMisconception?.diagnosis}</p>
                </div>
              </div>
            </div>

            <!-- Level 3 Evidence: Differentiated 3-Tier Matrix -->
            {#if !isEditingCurrent}
              <div class="space-y-4">
                <!-- Tier 1 -->
                <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold text-brand uppercase">
                      {selectedPlan.tier1Remediation.tierTitle}
                    </span>
                    <span class="text-[10px] font-mono text-brand font-bold bg-brand-subtle px-1.5 py-0.5 rounded-sm">
                      15 min • Experiential Tactile
                    </span>
                  </div>
                  <p class="text-xs text-ink-secondary leading-relaxed font-sans">
                    {selectedPlan.tier1Remediation.scaffoldStrategy}
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div class="p-3 bg-surface border border-border rounded-sm text-xs space-y-1">
                      <span class="text-[10px] text-ink-muted uppercase font-mono font-bold flex items-center gap-1">
                        <Compass class="size-3 text-brand" />
                        Tactile Lab Prompt
                      </span>
                      <span class="font-mono text-ink-secondary leading-snug">{selectedPlan.tier1Remediation.tactileActivity}</span>
                    </div>
                    <div class="p-3 bg-surface border border-border rounded-sm text-xs space-y-1">
                      <span class="text-[10px] text-ink-muted uppercase font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 class="size-3 text-brand" />
                        Checkpoint Question
                      </span>
                      <span class="font-mono text-ink-secondary leading-snug">{selectedPlan.tier1Remediation.checkQuestion}</span>
                    </div>
                  </div>
                </div>

                <!-- Tier 2 -->
                <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold text-mint uppercase">
                      {selectedPlan.tier2Core.tierTitle}
                    </span>
                    <span class="text-[10px] font-mono text-mint font-bold bg-mint-subtle px-1.5 py-0.5 rounded-sm">
                      20 min • Vector Representation
                    </span>
                  </div>
                  <p class="text-xs text-ink-secondary leading-relaxed font-sans">
                    {selectedPlan.tier2Core.collaborativeTask}
                  </p>
                  <div class="p-3 bg-surface border border-border rounded-sm text-xs font-mono text-ink-secondary space-y-1">
                    <span class="text-[10px] text-ink-muted uppercase font-mono font-bold flex items-center gap-1">
                      <Target class="size-3 text-mint" />
                      Observable Evidence Checkpoint
                    </span>
                    <span class="leading-snug">{selectedPlan.tier2Core.evidenceCheckpoint}</span>
                  </div>
                </div>

                <!-- Tier 3 -->
                <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold text-cyan uppercase">
                      {selectedPlan.tier3Extension.tierTitle}
                    </span>
                    <span class="text-[10px] font-mono text-cyan font-bold bg-cyan/10 px-1.5 py-0.5 rounded-sm">
                      10 min • Synthesis & Optimization
                    </span>
                  </div>
                  <p class="text-xs text-ink-secondary leading-relaxed font-sans">
                    {selectedPlan.tier3Extension.inquiryChallenge}
                  </p>
                  <div class="p-3 bg-surface border border-border rounded-sm text-xs font-mono text-ink-secondary space-y-1">
                    <span class="text-[10px] text-ink-muted uppercase font-mono font-bold flex items-center gap-1">
                      <Cpu class="size-3 text-cyan" />
                      Evaluation Rubric & Exemplars
                    </span>
                    <span class="leading-snug">{selectedPlan.tier3Extension.evaluationRubric}</span>
                  </div>
                </div>

                <!-- Teacher Facilitator Notes -->
                {#if selectedPlan.teacherFacilitatorNotes?.length}
                  <div class="p-3 bg-surface-subtle border border-border rounded-sm space-y-1.5 text-xs">
                    <span class="text-[10px] font-mono font-bold uppercase text-ink-muted flex items-center gap-1">
                      <BookOpen class="size-3 text-ink-muted" />
                      Faculty Facilitator Observational Notes
                    </span>
                    <ul class="list-disc list-inside space-y-0.5 text-ink-secondary text-[11px]">
                      {#each selectedPlan.teacherFacilitatorNotes as note}
                        <li>{note}</li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </div>
            {:else}
              <!-- In-Place Editable Mode -->
              <div class="space-y-5">
                <!-- Tier 1 Editor -->
                <div class="p-4 bg-surface-raised border-2 border-brand/30 rounded-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold uppercase text-brand">Edit Tier 1: Concrete Scaffold</span>
                    <span class="text-[10px] font-mono text-brand font-bold bg-brand-subtle px-1.5 py-0.5 rounded-sm">15 min</span>
                  </div>
                  <div class="space-y-1">
                    <label for="edit-tier1-strategy" class="text-[10px] font-semibold uppercase text-ink-muted">Scaffold Strategy</label>
                    <textarea
                      id="edit-tier1-strategy"
                      bind:value={editTier1Strategy}
                      rows="2"
                      class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-sans text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    ></textarea>
                  </div>
                  <div class="space-y-1">
                    <label for="edit-tier1-activity" class="text-[10px] font-semibold uppercase text-ink-muted">Tactile Lab Prompt (Physical Intuition)</label>
                    <textarea
                      id="edit-tier1-activity"
                      bind:value={editTier1Activity}
                      rows="2"
                      class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-mono text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    ></textarea>
                  </div>
                  <div class="space-y-1">
                    <label for="edit-tier1-check" class="text-[10px] font-semibold uppercase text-ink-muted">Immediate Checkpoint Question</label>
                    <textarea
                      id="edit-tier1-check"
                      bind:value={editTier1Check}
                      rows="2"
                      class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-mono text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    ></textarea>
                  </div>
                </div>

                <!-- Tier 2 Editor -->
                <div class="p-4 bg-surface-raised border-2 border-mint/30 rounded-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold uppercase text-mint">Edit Tier 2: Representational Modeling</span>
                    <span class="text-[10px] font-mono text-mint font-bold bg-mint-subtle px-1.5 py-0.5 rounded-sm">20 min</span>
                  </div>
                  <div class="space-y-1">
                    <label for="edit-tier2-task" class="text-[10px] font-semibold uppercase text-ink-muted">Collaborative Task / Vector Schema</label>
                    <textarea
                      id="edit-tier2-task"
                      bind:value={editTier2Task}
                      rows="2"
                      class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-sans text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    ></textarea>
                  </div>
                  <div class="space-y-1">
                    <label for="edit-tier2-checkpoint" class="text-[10px] font-semibold uppercase text-ink-muted">Observable Evidence Checkpoint</label>
                    <textarea
                      id="edit-tier2-checkpoint"
                      bind:value={editTier2Checkpoint}
                      rows="3"
                      class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-mono text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    ></textarea>
                  </div>
                </div>

                <!-- Tier 3 Editor -->
                <div class="p-4 bg-surface-raised border-2 border-cyan/30 rounded-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono font-bold uppercase text-cyan">Edit Tier 3: Abstract Synthesis</span>
                    <span class="text-[10px] font-mono text-cyan font-bold bg-cyan/10 px-1.5 py-0.5 rounded-sm">10 min</span>
                  </div>
                  <div class="space-y-1">
                    <label for="edit-tier3-challenge" class="text-[10px] font-semibold uppercase text-ink-muted">Open-Ended Inquiry / Tournament Challenge</label>
                    <textarea
                      id="edit-tier3-challenge"
                      bind:value={editTier3Challenge}
                      rows="2"
                      class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-sans text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    ></textarea>
                  </div>
                  <div class="space-y-1">
                    <label for="edit-tier3-rubric" class="text-[10px] font-semibold uppercase text-ink-muted">Evaluation Rubric & Exemplars</label>
                    <textarea
                      id="edit-tier3-rubric"
                      bind:value={editTier3Rubric}
                      rows="3"
                      class="w-full p-2 bg-surface border border-border rounded-sm text-xs font-mono text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    ></textarea>
                  </div>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onclick={() => (isEditingCurrent = false)}
                    class="px-4 py-1.5 text-xs font-mono text-ink-secondary hover:text-ink cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onclick={handleSaveCurrentEdit}
                    class="px-4 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-mono font-semibold rounded-sm transition-micro flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Save class="size-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

  {:else if activeView === 'playbooks'}
    <!-- FACULTY PLAYBOOKS VIEW -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-4 space-y-3">
        <span class="text-xs font-bold text-ink font-mono uppercase tracking-wider block">
          Faculty Guidance Playbooks ({data.playbooks.length})
        </span>

        <div class="space-y-2">
          {#each data.playbooks as pb}
            <button
              type="button"
              onclick={() => (selectedPlaybookIdState = pb.id)}
              class="w-full text-left p-4 rounded-sm border transition-micro cursor-pointer {selectedPlaybookId === pb.id
                ? 'bg-surface-raised border-brand text-ink ring-1 ring-brand shadow-2xs'
                : 'bg-surface border-border hover:bg-surface-subtle text-ink-secondary'}"
            >
              <div class="text-[10px] font-mono text-brand font-bold uppercase">{pb.domain}</div>
              <h4 class="text-xs font-bold text-ink mt-0.5">{pb.frameworkName}</h4>
              <p class="text-[11px] text-ink-muted mt-0.5 line-clamp-2">{pb.tagline}</p>
            </button>
          {/each}
        </div>
      </div>

      <div class="lg:col-span-8">
        {#if selectedPlaybook}
          <div class="p-6 bg-surface border border-border rounded-sm space-y-5 shadow-2xs">
            <div class="space-y-1 pb-4 border-b border-border">
              <span class="text-[10px] font-mono text-brand font-bold uppercase">{selectedPlaybook.domain}</span>
              <h2 class="text-lg font-bold text-ink font-heading">{selectedPlaybook.frameworkName}</h2>
              <p class="text-xs text-ink-secondary leading-relaxed">{selectedPlaybook.tagline}</p>
            </div>

            <div class="space-y-4 text-xs">
              <div class="space-y-2">
                <span class="font-bold text-ink font-mono uppercase text-[11px] block">Guiding Principles</span>
                <div class="space-y-2 text-ink-secondary">
                  {#each selectedPlaybook.corePrinciples || [] as cp}
                    <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1">
                      <span class="font-bold text-ink text-xs">{cp.principle}</span>
                      <p class="text-xs text-ink-secondary leading-relaxed">{cp.explanation}</p>
                    </div>
                  {/each}
                </div>
              </div>

              {#if selectedPlaybook.classroomImplementationSteps?.length}
                <div class="pt-3 border-t border-border space-y-2">
                  <span class="font-bold text-ink font-mono uppercase text-[11px] block">Implementation Steps</span>
                  <div class="space-y-2">
                    {#each selectedPlaybook.classroomImplementationSteps as step}
                      <div class="p-3 bg-surface-raised border border-border rounded-sm text-xs space-y-1">
                        <div class="flex items-center gap-2 font-mono font-bold text-ink">
                          <span class="size-4 rounded-none bg-brand text-brand-foreground text-[10px] flex items-center justify-center">{step.step}</span>
                          <span>{step.title}</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div><strong class="text-ink">Teacher:</strong> <span class="text-ink-secondary">{step.teacherAction}</span></div>
                          <div><strong class="text-ink">Student:</strong> <span class="text-ink-secondary">{step.studentAction}</span></div>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
