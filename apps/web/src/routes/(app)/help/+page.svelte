<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import {
    Search,
    Sun,
    Moon,
    ExternalLink,
    ChevronRight,
    ChevronLeft,
    Copy,
    Check,
    ArrowRight,
    ArrowLeft,
    Menu,
    X,
    BookOpen,
    BrainCircuit,
    Shield,
    Activity,
    Layers,
    Lock,
    Compass,
    GraduationCap,
    HeartPulse,
    Users,
    FileCode,
    Cpu,
    Sparkles,
    FileCheck,
    CheckCircle2,
    Sigma
  } from 'lucide-svelte';
  import CreedLogo from '$lib/components/brand/CreedLogo.svelte';
  import { toggleTheme as toggleGlobalTheme } from '$lib/theme.js';

  let { data } = $props();

  // Documentation Schema & Taxonomy
  interface DocSection {
    id: string;
    title: string;
    category: string;
    badge?: string;
    lead: string;
    toc: { id: string; label: string }[];
    markdown: string;
  }

  const DOCS: DocSection[] = [
    {
      id: 'introduction',
      title: 'Documentation & Guidance · Introduction',
      category: 'Sections',
      lead: 'CREED OS is an AI-native learner intelligence, psychometric assessment, and developmental pathway navigation platform. Open architecture, deterministic psychometrics, and calm human-first design.',
      toc: [
        { id: 'foundational-mission', label: 'Foundational Mission' },
        { id: 'four-pillars', label: 'Four Architectural Pillars' },
        { id: 'deterministic-scoring', label: 'Deterministic Scoring' },
        { id: 'calm-intelligence', label: 'Calm Intelligence Philosophy' }
      ],
      markdown: `# Introduction · Documentation

CREED OS replaces probabilistic black-box grading with verified longitudinal psychometrics, adaptive standard-error stopping bounds, and cryptographic evidence provenance.

## Foundational Mission
Traditional EdTech platforms treat learners as captive advertising audiences, forcing high-stakes anxiety-inducing exams, probabilistic AI grading, and gamified dopamine loops. CREED OS establishes a calm, mathematically sound, and DPDP-compliant learning operating system.

## Four Architectural Pillars
1. **Deterministic Scoring Isolation**: Scores and ability estimates are computed strictly by deterministic IRT/CAT/BKT models. Generative LLMs explain; deterministic algorithms score; humans decide.
2. **Growth Before Labeling**: We never assign fixed IQ classifications, deterministic ability ceilings, or permanent career exclusions. Capabilities are qualitative horizons.
3. **Evidence Before Inference**: Every claim in the learner profile is anchored to tangible assessment artifacts, physics simulation telemetry, or teacher demonstration rubrics.
4. **Statutory Minor Safety**: Built from the ground up for India's DPDP Act 2023 (Chapter II, Section 9), requiring verified parental consent before diagnostic processing commences.

## Deterministic Scoring Isolation
Scoring integrity requires separating generative reasoning from psychometric evaluation. While Google ADK and Gemini API generate conversational Socratic questions and explanations of student misconceptions, they are mathematically barred from altering latent ability estimates. Ability theta (θ) is derived strictly through 3PL Item Response Theory with 41-node Gauss-Hermite numerical quadrature.`
    },
    {
      id: 'quickstart',
      title: 'Quickstart Guide',
      category: 'Sections',
      lead: 'Get started with CREED OS in under 5 minutes. Learn how to launch daily missions, switch between persona workspaces, and inspect evidence.',
      toc: [
        { id: 'daily-ritual', label: 'The 20-Minute Daily Ritual' },
        { id: 'role-switching', label: 'Development Persona Switcher' },
        { id: 'launching-diagnostics', label: 'Running Active Diagnostics' }
      ],
      markdown: `# Quickstart Guide

## The 20-Minute Daily Ritual
Learners navigate a structured, distraction-free developmental sprint every morning:
1. **Diagnostic Challenge (10 min)**: Adaptive 3PL CAT items calibrating current frontier concepts.
2. **Kinematic Physics Lab (5 min)**: Interactive mechanics simulation (e.g. 3-gear kinematic torque lab).
3. **Socratic Synthesis (5 min)**: Guided voice or text reflection unpacking conceptual reasoning moves.

## Development Persona Switcher
In local development environments, activate any role session instantaneously via the Spotlight Command Menu (\`⌘K\`) or through the dev switch API endpoint:
\`\`\`bash
# Switch to Teacher Copilot
curl -X POST http://localhost:5173/api/auth/dev-switch -H "Content-Type: application/json" -d '{"role":"teacher"}'
\`\`\``
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Workspace Keyboard Shortcuts',
      category: 'Sections',
      lead: 'Navigate fluently across all workspaces without lifting your hands from the keyboard.',
      toc: [
        { id: 'global-keys', label: 'Global Navigation' },
        { id: 'assessment-keys', label: 'Assessment & Lab Keys' },
        { id: 'inspector-keys', label: 'Inspector & Drawers' }
      ],
      markdown: `# Workspace Keyboard Shortcuts

## Global Navigation
| Shortcut | Action | Description |
| :--- | :--- | :--- |
| \`⌘K\` / \`Ctrl+K\` | Spotlight Command Palette | Search documents, jump to portals, or execute actions |
| \`⌘B\` / \`Ctrl+B\` | Toggle Sidebar | Collapse or expand the workspace sidebar |
| \`Escape\` | Dismiss Drawer / Modal | Close any active inspector or dialog |

## Assessment & Lab Keys
| Shortcut | Action | Description |
| :--- | :--- | :--- |
| \`Enter\` | Confirm & Advance | Submit selected item interaction |
| \`1\` – \`4\` | Select Option | Quick-select multiple choice option |
| \`Space\` | Run Simulation | Trigger physics kinematic gear run |`
    },
    {
      id: 'changelog',
      title: 'Changelog · WAY 3.0 Release',
      category: 'Sections',
      badge: 'v2.1',
      lead: 'Release history and architectural milestones for CREED OS.',
      toc: [
        { id: 'release-notes', label: 'v2.1.0 Highlights' },
        { id: 'security-upgrades', label: 'Security & Consent' },
        { id: 'psychometrics', label: 'CAT Engine Updates' }
      ],
      markdown: `# Changelog · WAY 3.0 Release

## v2.1.0 Highlights
- **Full shadcn Docs UI Engine**: Multi-category navigation tree, copy page markdown, and table of contents.
- **DPDP Act 2023 Portal**: 4-tab Governance Hub with live consent withdrawal simulation.
- **Bifurcated Security Zero Leaks**: Strict elimination of theta and SE symbols from student and parent views.`
    },
    {
      id: 'workspace-student',
      title: 'Student Space Guide',
      category: 'Workspaces',
      lead: 'Supportive, low-anxiety workspace orienting learners in under 5 seconds toward their highest-leverage developmental task.',
      toc: [
        { id: 'mission-stepper', label: 'Daily Mission Stepper' },
        { id: 'low-anxiety', label: 'Low-Anxiety Principles' },
        { id: 'maker-missions', label: 'Applied Maker Missions' }
      ],
      markdown: `# Student Space Guide

The Student Space is built around calm clarity:
- **No Competitive Percentiles**: Students are never told "You are in the 54th percentile". Capabilities are framed qualitatively: *Developing*, *Emerging*, or *Strong Foundation*.
- **No Panic Timers**: Diagnostics run without ticking clocks, letting learners engage in deep problem decomposition.
- **RoboBridge Simulation**: Level 4 applied engineering tasks where learners optimize bridge trusses against live load forces.`
    },
    {
      id: 'workspace-parent',
      title: 'Parent Portal Guide',
      category: 'Workspaces',
      lead: 'Reassurance, tangible evidence, and plain-language milestones for families. Grasp growth trajectory in under 10 seconds.',
      toc: [
        { id: 'growth-milestones', label: 'Developmental Milestones' },
        { id: 'at-home-science', label: 'At-Home Science Trials' },
        { id: 'consent-receipt', label: 'Parental Consent Receipts' }
      ],
      markdown: `# Parent Portal Guide

## Developmental Milestones
Parents see three essential dimensions:
1. **What They Love Doing**: Real demonstrated strengths in spatial visualization and computational logic.
2. **What They Are Practicing**: Next foundational milestones without deficit labels.
3. **At-Home Learning**: Conversational dinner-table science challenges (e.g. kitchen lever balance).`
    },
    {
      id: 'workspace-teacher',
      title: 'Teacher Copilot Guide',
      category: 'Workspaces',
      lead: 'High-density educator workspace for classroom triage, 1-click targeted scaffolding, and direct observation logging.',
      toc: [
        { id: 'intervention-queues', label: 'Classroom Intervention Queues' },
        { id: 'observation-sheets', label: 'Live Observation Sheet Drawer' },
        { id: 'multi-facet-filtering', label: 'Multi-Facet Filtering' }
      ],
      markdown: `# Teacher Copilot Guide

## Classroom Intervention Queues
Instead of grading hundreds of multiple-choice sheets, educators see instant clusters needing support on proportional reasoning or spatial rotations, with 1-click scaffold assignments ready to push to student queues.

## Live Observation Sheet Drawer
During hands-on labs, teachers open the right-side observation drawer to log Level 3 qualitative demonstration rubrics directly into the student longitudinal portfolio.`
    },
    {
      id: 'workspace-counselor',
      title: 'Counselor Advisory Guide',
      category: 'Workspaces',
      lead: 'Caseload management and longitudinal evidence review to resolve pathway dilemmas without deterministic career pigeonholing.',
      toc: [
        { id: 'caseload-triage', label: 'Caseload Priority Triage' },
        { id: 'evidence-consistency', label: 'Evidence Consistency Review' },
        { id: 'exploratory-pathways', label: 'Exploratory Pathway Alignment' }
      ],
      markdown: `# Counselor Advisory Guide

Counselors triage students navigating complex educational transitions using verified multi-tier evidence rather than one-time standardized test spikes.`
    },
    {
      id: 'workspace-admin',
      title: 'Admin Console Guide',
      category: 'Workspaces',
      lead: 'Operational oversight, statutory DPDP Act compliance monitoring, and exportable immutable audit logs.',
      toc: [
        { id: 'consent-oversight', label: 'Parental Consent Monitoring' },
        { id: 'institution-settings', label: 'Institutional Multi-Tenancy' },
        { id: 'audit-exports', label: 'Immutable Audit Log Exports' }
      ],
      markdown: `# Admin Console Guide

Administrators oversee institutional adherence to India's DPDP Act 2023, tracking consent state transitions (\`DRAFT\` → \`ACTIVE\`) and verifying relationship-scoped RLS policies.`
    },
    {
      id: 'workspace-studio',
      title: 'Item Studio Guide',
      category: 'Workspaces',
      lead: 'Psychometric workbench for 3PL parameter calibration, Item Characteristic Curve inspection, and QTI 3.0 XML packaging.',
      toc: [
        { id: 'calibration-workbench', label: '3PL Parameter Calibration' },
        { id: 'icc-visualizer', label: 'Item Characteristic Curves' },
        { id: 'qti-export', label: 'QTI 3.0 XML Packaging' }
      ],
      markdown: `# Item Studio Guide

Author and calibrate psychometric items:
- **Discrimination (a)**: Bound between [0.20, 2.50].
- **Difficulty (b)**: Bound between [-3.00, +3.00].
- **Pseudo-Guessing (c)**: Bound between [0.00, 0.35].
- **QTI 3.0 Export**: One-click XML bundle generation conforming to IMS Global standards.`
    },
    {
      id: 'science-irt',
      title: 'Deterministic 3PL Item Response Theory',
      category: 'Science & Psychometrics',
      badge: '3PL',
      lead: 'Mathematical formulation of the 3-Parameter Logistic Model air-gapped from generative LLM scoring.',
      toc: [
        { id: 'formula-spec', label: '3PL Probability Formulation' },
        { id: 'item-parameters', label: 'Item Parameter Triad' },
        { id: 'numerical-quadrature', label: 'Gauss-Hermite Quadrature' }
      ],
      markdown: `# Deterministic 3PL Item Response Theory

## 3PL Probability Formulation
The probability of a correct response is modeled as:
\`\`\`
P(θ) = c + (1 − c) / [ 1 + exp(−1.702 · a · (θ − b)) ]
\`\`\`
Where:
- \`θ\`: Latent developmental ability parameter
- \`a\`: Item discrimination (slope at inflection)
- \`b\`: Item difficulty threshold
- \`c\`: Pseudo-guessing lower asymptote
- \`D = 1.702\`: Scaling factor aligning logistic and normal ogive curves.

## Gauss-Hermite Quadrature
Posterior integration is executed via 41-node Gauss-Hermite quadrature across \`[-4.0, +4.0]\` standard deviations using Bayesian Expected A Posteriori (EAP). Generative LLMs never touch or alter these scores.`
    },
    {
      id: 'science-cat',
      title: 'Adaptive CAT Bounds & Stopping Criteria',
      category: 'Science & Psychometrics',
      badge: 'CAT',
      lead: 'Real-time Fisher Information maximization and standard error convergence stopping bounds.',
      toc: [
        { id: 'fisher-information', label: 'Fisher Information Function' },
        { id: 'stopping-bounds', label: 'Standard Error Stopping Bounds' },
        { id: 'test-length-ceilings', label: 'Cognitive Length Ceilings' }
      ],
      markdown: `# Adaptive CAT Bounds & Stopping Criteria

## Fisher Information Function
Candidate items are chosen by maximizing Fisher Information at the current estimated ability:
\`\`\`
I(θ) = [ D² · a² · (1 − c) ] / [ (c + e^(D·a·(θ−b))) · (1 + e^(−D·a·(θ−b)))² ]
\`\`\`

## Standard Error Stopping Bounds
The diagnostic engine terminates automatically when:
\`\`\`
SE(θ) = 1 / sqrt( Σ I_i(θ) ) ≤ 0.30
\`\`\`
With strict hard ceilings: minimum 5 items, maximum 15 items.`
    },
    {
      id: 'science-evidence',
      title: 'Four-Tier Multimodal Evidence Pyramid',
      category: 'Science & Psychometrics',
      lead: 'Longitudinal evidence hierarchy anchoring every profile claim to verifiable artifacts.',
      toc: [
        { id: 'evidence-tiers', label: 'The Four Evidence Tiers' },
        { id: 'sha256-provenance', label: 'SHA-256 Provenance Sealing' },
        { id: 'w3c-credentials', label: 'W3C Verifiable Credentials' }
      ],
      markdown: `# Four-Tier Multimodal Evidence Pyramid

1. **Level 1 · Formative Diagnostics**: Micro-CAT interactions with parameter discrimination.
2. **Level 2 · Simulation Telemetry**: Physics and robotics lab step metrics.
3. **Level 3 · Teacher Demonstration Rubric**: Qualitative classroom demonstration.
4. **Level 4 · Applied Capstone Maker Artifact**: End-to-end verified student projects.

Every entry is sealed with HMAC-SHA256 containing timestamps, rubric identifiers, and evaluator signatures.`
    },
    {
      id: 'governance-dpdp',
      title: 'India DPDP Act 2023 Statutory Compliance',
      category: 'Governance & Compliance',
      badge: 'DPDP',
      lead: 'Statutory child data protection under Chapter II, Section 9 of the Digital Personal Data Protection Act 2023.',
      toc: [
        { id: 'section-9-mandates', label: 'Section 9 Child Protection' },
        { id: 'tracking-ban', label: 'Prohibition of Behavioral Profiling' },
        { id: 'dpo-redressal', label: 'DPO Grievance Redressal' }
      ],
      markdown: `# India DPDP Act 2023 Statutory Compliance

- **Section 9(1)**: Verifiable parental consent required for all minors under 18 years.
- **Section 9(2)**: Ban on processing harmful to the well-being of a child.
- **Section 9(3)**: Absolute prohibition of behavioral tracking and targeted advertising.
- **Grievance Redressal**: Designated DPO contact (\`dpo@creed-os.app\`) with statutory 7-day resolution window.`
    },
    {
      id: 'design-system',
      title: 'WAY 2.1 Design Governance',
      category: 'WAY 2.1 Design System',
      lead: 'Ergonomic laws governing visual density, architectural radii, semantic tokens, and Lagom motion.',
      toc: [
        { id: 'three-information-levels', label: 'Three Information Levels Law' },
        { id: 'radius-system', label: '0 / 4 / 8px Architectural Radii' },
        { id: 'lagom-motion', label: 'Lagom Motion Contract' }
      ],
      markdown: `# WAY 2.1 Quiet Editorial Intelligence

## Three Information Levels Law
- **Level 1 · Signal**: What the user must notice immediately.
- **Level 2 · Context**: Why it matters (1 concise sentence maximum).
- **Level 3 · Evidence**: Proof and rubrics (disclosed only on interaction).

## 0 / 4 / 8px Architectural Radii
- **0px (\`rounded-none\`)**: Structural frames, data tables, code boxes.
- **4px (\`rounded-sm\`)**: Buttons, controls, chips, active nav items.
- **8px (\`rounded-md\`)**: Expressive hero artwork.
- *Strictly forbidden*: 12px+ bubbly curves or pill action buttons.`
    },
    {
      id: 'api-reference',
      title: 'API & Developer Reference',
      category: 'API Reference',
      lead: 'RESTful API contracts for assessments, consent challenge, and observation logging.',
      toc: [
        { id: 'assessment-endpoints', label: 'Assessment Session Endpoints' },
        { id: 'consent-endpoints', label: 'Consent Verification Endpoints' },
        { id: 'teacher-endpoints', label: 'Teacher Telemetry Endpoints' }
      ],
      markdown: `# API & Developer Reference

## Assessment Session Endpoints
\`\`\`http
POST /api/v1/assessments/sessions
Content-Type: application/json

{
  "domain": "spatial_reasoning",
  "gradeBand": "Middle Stage (Classes 6–8)"
}
\`\`\`

## Consent Verification Endpoints
\`\`\`http
POST /api/v1/consent/challenge
Content-Type: application/json

{
  "learnerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "parentName": "Priya Sharma",
  "parentContact": "+91 98765 43210",
  "channel": "SMS_OTP"
}
\`\`\``
    }
  ];

  // Active Doc State
  let activeDocId = $state<string>('introduction');
  let searchQuery = $state<string>('');
  let copied = $state<boolean>(false);
  let mobileSidebarOpen = $state<boolean>(false);
  let isDarkMode = $state<boolean>(true);

  const activeDoc = $derived(
    DOCS.find((d) => d.id === activeDocId) || DOCS[0]
  );

  const currentIndex = $derived(
    DOCS.findIndex((d) => d.id === activeDoc.id)
  );

  const prevDoc = $derived(
    currentIndex > 0 ? DOCS[currentIndex - 1] : null
  );

  const nextDoc = $derived(
    currentIndex < DOCS.length - 1 ? DOCS[currentIndex + 1] : null
  );

  // Grouped Docs for Sidebar Navigation
  const groupedCategories = $derived.by(() => {
    const map = new Map<string, DocSection[]>();
    for (const doc of DOCS) {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          doc.title.toLowerCase().includes(q) ||
          doc.lead.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q) ||
          doc.markdown.toLowerCase().includes(q);
        if (!matches) continue;
      }
      if (!map.has(doc.category)) {
        map.set(doc.category, []);
      }
      map.get(doc.category)!.push(doc);
    }
    return Array.from(map.entries());
  });

  onMount(() => {
    // Theme sync
    const saved = localStorage.getItem('way_theme');
    isDarkMode = saved !== 'light';

    // Hash deep linking
    function syncDocFromHash() {
      if (!browser) return;
      const hash = window.location.hash.replace('#', '');
      const found = DOCS.find((d) => d.id === hash);
      if (found) {
        activeDocId = found.id;
      }
    }

    syncDocFromHash();
    window.addEventListener('hashchange', syncDocFromHash);
    return () => window.removeEventListener('hashchange', syncDocFromHash);
  });

  function selectDoc(docId: string) {
    activeDocId = docId;
    mobileSidebarOpen = false;
    if (browser) {
      window.location.hash = docId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function toggleTheme() {
    const next = toggleGlobalTheme();
    isDarkMode = next === 'dark';
  }

  async function copyPageMarkdown() {
    if (!browser) return;
    try {
      await navigator.clipboard.writeText(activeDoc.markdown);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error('Failed to copy document content:', err);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const input = document.getElementById('docs-search-input') as HTMLInputElement | null;
      input?.focus();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>{activeDoc.title} · CREED OS</title>
  <meta name="description" content={activeDoc.lead} />
</svelte:head>

<!-- ============================================================
     SHADCN-INSPIRED DOCUMENTATION SHELL
     Top Navbar (56px) + Left Sidebar (256px) + Main Article + Right TOC (220px)
     ============================================================ -->
<div class="min-h-screen flex flex-col bg-canvas text-ink selection:bg-brand/20">
  <!-- 1. TOP DOCUMENTATION NAVBAR (Sticky 56px) -->
  <header class="sticky top-0 z-40 w-full border-b border-border bg-canvas/95 backdrop-blur-md">
    <div class="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
      <!-- Left Brand & Breadcrumb -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onclick={() => (mobileSidebarOpen = !mobileSidebarOpen)}
          class="md:hidden p-1.5 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-subtle border border-transparent hover:border-border cursor-pointer"
          aria-label="Toggle Documentation Navigation"
        >
          {#if mobileSidebarOpen}
            <X class="w-4 h-4" />
          {:else}
            <Menu class="w-4 h-4" />
          {/if}
        </button>

        <a href="/" class="flex items-center gap-2 group">
          <div class="w-7 h-7 rounded-none bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-brand group-hover:text-brand-foreground transition-all">
            <CreedLogo size={16} />
          </div>
          <span class="font-heading font-semibold text-xs tracking-tight text-ink group-hover:text-brand transition-colors">
            CREED OS
          </span>
        </a>

        <span class="text-border">/</span>
        <span class="text-xs font-mono text-ink-muted font-medium">Docs</span>
      </div>

      <!-- Center Top Categories (Desktop) -->
      <nav class="hidden lg:flex items-center gap-5 text-xs text-ink-secondary" aria-label="Documentation Navigation">
        <button
          type="button"
          onclick={() => selectDoc('introduction')}
          class="hover:text-ink transition-colors cursor-pointer {activeDoc.category === 'Sections' ? 'text-ink font-semibold' : ''}"
        >
          Overview
        </button>
        <button
          type="button"
          onclick={() => selectDoc('workspace-student')}
          class="hover:text-ink transition-colors cursor-pointer {activeDoc.category === 'Workspaces' ? 'text-ink font-semibold' : ''}"
        >
          Workspaces
        </button>
        <button
          type="button"
          onclick={() => selectDoc('science-irt')}
          class="hover:text-ink transition-colors cursor-pointer {activeDoc.category === 'Science & Psychometrics' ? 'text-ink font-semibold' : ''}"
        >
          Science
        </button>
        <button
          type="button"
          onclick={() => selectDoc('pedagogy-safety')}
          class="hover:text-ink transition-colors cursor-pointer {activeDoc.category === 'Pedagogical Framework' ? 'text-ink font-semibold' : ''}"
        >
          Pedagogy
        </button>
        <button
          type="button"
          onclick={() => selectDoc('governance-dpdp')}
          class="hover:text-ink transition-colors cursor-pointer {activeDoc.category === 'Governance & Compliance' ? 'text-ink font-semibold' : ''}"
        >
          Governance
        </button>
        <button
          type="button"
          onclick={() => selectDoc('design-system')}
          class="hover:text-ink transition-colors cursor-pointer {activeDoc.category === 'WAY 2.1 Design System' ? 'text-ink font-semibold' : ''}"
        >
          Design System
        </button>
      </nav>

      <!-- Right Actions: Search + GitHub 126k + Theme + Access Workspace -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Search Trigger Input -->
        <div class="relative w-36 sm:w-56">
          <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            id="docs-search-input"
            type="search"
            bind:value={searchQuery}
            placeholder="Search docs..."
            class="w-full h-8 pl-8 pr-8 text-xs rounded-sm bg-surface-subtle border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand transition-colors"
          />
          <kbd class="hidden sm:inline-block absolute right-2 top-1/2 -translate-y-1/2 px-1 rounded-none bg-surface border border-border text-[10px] font-mono text-ink-muted">
            ⌘K
          </kbd>
        </div>

        <!-- GitHub with star counter badge (Matching Screenshot 2) -->
        <a
          href="https://github.com/tomkee-lab/creed_os"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border bg-surface-subtle hover:bg-surface text-ink text-xs transition-colors"
          title="GitHub Repository"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span class="font-mono text-[11px] text-ink-muted">126k</span>
        </a>

        <!-- Theme Switcher -->
        <button
          type="button"
          onclick={toggleTheme}
          class="p-1.5 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-subtle border border-transparent hover:border-border transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {#if isDarkMode}
            <Sun class="w-4 h-4 text-attention" />
          {:else}
            <Moon class="w-4 h-4" />
          {/if}
        </button>

        <!-- Access Workspace CTA -->
        <a
          href="/student"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
        >
          <span>Open Workspace</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </header>

  <!-- 2. MAIN DOCUMENTATION WRAPPER -->
  <div class="flex-1 max-w-7xl mx-auto w-full flex">
    <!-- LEFT DOCUMENTATION SIDEBAR (Matching Screenshot 2) -->
    <aside
      class="docs-sidebar-scroll fixed inset-y-14 left-0 z-30 w-64 lg:w-72 bg-canvas border-r border-border p-4 overflow-y-auto space-y-6 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:shrink-0 {mobileSidebarOpen ? 'block' : 'hidden md:block'}"
    >
      <div class="space-y-6 text-xs">
        {#each groupedCategories as [category, docs]}
          <div class="space-y-1">
            <h3 class="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-ink-muted font-semibold">
              {category}
            </h3>
            <div class="space-y-0.5">
              {#each docs as doc}
                <button
                  type="button"
                  onclick={() => selectDoc(doc.id)}
                  class="w-full text-left px-3 py-1.5 rounded-sm transition-colors cursor-pointer flex items-center justify-between text-xs {activeDocId === doc.id
                    ? 'bg-surface-raised text-ink font-semibold border border-border shadow-2xs'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
                >
                  <span class="truncate">{doc.title.replace(' · Documentation', '')}</span>
                  {#if doc.badge}
                    <span class="px-1 py-0.5 rounded-none bg-surface border border-border font-mono text-[9px] text-ink-muted shrink-0">
                      {doc.badge}
                    </span>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </aside>

    <!-- CENTER DOCUMENTATION ARTICLE -->
    <main class="flex-1 min-w-0 max-w-3xl xl:max-w-4xl py-8 px-4 sm:px-8 space-y-8">
      <!-- Breadcrumb & Top Actions Row (Matching Screenshot 2) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 text-xs text-ink-muted font-mono" aria-label="Breadcrumb">
          <a href="/help" class="hover:text-ink">Docs</a>
          <span>/</span>
          <span>{activeDoc.category}</span>
          <span>/</span>
          <span class="text-ink font-semibold">{activeDoc.title.replace(' · Documentation', '')}</span>
        </nav>

        <!-- Top Right Action Controls: Copy Page + Prev/Next (Matching Screenshot 2) -->
        <div class="flex items-center gap-1.5 shrink-0">
          <!-- Copy Page Button -->
          <button
            type="button"
            onclick={copyPageMarkdown}
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-surface-subtle hover:bg-surface border border-border text-xs text-ink transition-colors cursor-pointer shadow-2xs"
            title="Copy entire documentation page markdown"
          >
            {#if copied}
              <Check class="w-3.5 h-3.5 text-mint" />
              <span class="text-mint font-medium">Copied!</span>
            {:else}
              <Copy class="w-3.5 h-3.5 text-ink-muted" />
              <span>Copy Page</span>
            {/if}
          </button>

          <!-- Prev Page Button -->
          <button
            type="button"
            onclick={() => prevDoc && selectDoc(prevDoc.id)}
            disabled={!prevDoc}
            class="p-1 rounded-sm bg-surface-subtle hover:bg-surface border border-border text-ink-secondary hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title={prevDoc ? `Previous: ${prevDoc.title}` : 'No previous document'}
            aria-label="Previous page"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <!-- Next Page Button -->
          <button
            type="button"
            onclick={() => nextDoc && selectDoc(nextDoc.id)}
            disabled={!nextDoc}
            class="p-1 rounded-sm bg-surface-subtle hover:bg-surface border border-border text-ink-secondary hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title={nextDoc ? `Next: ${nextDoc.title}` : 'No next document'}
            aria-label="Next page"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Article Header -->
      <div class="space-y-3">
        <h1 class="text-3xl sm:text-4xl font-heading font-bold text-ink tracking-tight">
          {activeDoc.title}
        </h1>
        <p class="text-base sm:text-lg text-ink-secondary leading-relaxed">
          {activeDoc.lead}
        </p>
      </div>

      <!-- Dynamic Documentation Body Content -->
      {#if activeDoc.id === 'introduction'}
        <div class="space-y-8 text-sm text-ink-secondary leading-relaxed">
          <div class="p-4 rounded-none bg-surface-raised border border-border space-y-2">
            <h3 class="text-xs font-mono font-semibold uppercase text-brand tracking-wider">Governing Law</h3>
            <p class="text-xs text-ink leading-relaxed">
              <strong>Quiet Editorial Intelligence & Calm Systems: complexity is hidden until it becomes useful.</strong><br />
              Signal → Context → Action → Evidence → Disclosure
            </p>
          </div>

          <div class="space-y-3">
            <h2 id="four-pillars" class="text-xl font-heading font-semibold text-ink border-b border-border pb-2">
              Four Architectural Pillars
            </h2>
            <ul class="space-y-3 text-xs">
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 bg-brand rounded-none shrink-0 mt-1.5"></span>
                <div>
                  <strong class="text-ink">Deterministic Scoring Isolation:</strong> Ability estimates are computed exclusively via mathematical item response theory (3PL CAT IRT) and Bayesian Knowledge Tracing (BKT). Generative LLMs are never permitted to score learners or assign ability classifications.
                </div>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 bg-mint rounded-none shrink-0 mt-1.5"></span>
                <div>
                  <strong class="text-ink">Growth Before Labeling:</strong> Never assign fixed IQ classifications, deterministic career exclusions, or false precision percentages (e.g. "74% fit"). All capabilities are modeled as open developmental horizons.
                </div>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 bg-ai rounded-none shrink-0 mt-1.5"></span>
                <div>
                  <strong class="text-ink">Evidence Before Inference:</strong> Every assertion in a learner profile maps to tangible assessment artifacts, physics simulation telemetry, or verified project evidence.
                </div>
              </li>
              <li class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 bg-positive rounded-none shrink-0 mt-1.5"></span>
                <div>
                  <strong class="text-ink">Statutory Minor Safety:</strong> Full DPDP Act 2023 alignment with verified parental consent state machine gating all diagnostic processing for minors under 18 years.
                </div>
              </li>
            </ul>
          </div>

          <div class="space-y-3">
            <h2 id="calm-intelligence" class="text-xl font-heading font-semibold text-ink border-b border-border pb-2">
              The Three Information Levels Law
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div class="p-3 bg-surface border border-border space-y-1">
                <span class="text-brand font-semibold block">Level 1: Signal</span>
                <p>What the user must notice immediately. Primary action primacy.</p>
              </div>
              <div class="p-3 bg-surface border border-border space-y-1">
                <span class="text-ai font-semibold block">Level 2: Context</span>
                <p>Why it matters. 1 concise sentence maximum explaining relevance.</p>
              </div>
              <div class="p-3 bg-surface border border-border space-y-1">
                <span class="text-positive font-semibold block">Level 3: Evidence</span>
                <p>Proof, rubrics, and provenance disclosed only upon interaction.</p>
              </div>
            </div>
          </div>
        </div>
      {:else if activeDoc.id === 'science-irt'}
        <div class="space-y-8 text-sm text-ink-secondary leading-relaxed">
          <div class="p-4 rounded-none bg-canvas border border-border font-mono text-center sm:text-lg text-ink space-y-2">
            <div>P(θ) = c + (1 − c) / [ 1 + exp(−1.702 · a · (θ − b)) ]</div>
            <div class="text-xs text-ink-muted font-sans">
              Three-Parameter Logistic Function (3PL) with Scaling Factor D = 1.702
            </div>
          </div>

          <div class="space-y-3">
            <h2 id="item-parameters" class="text-xl font-heading font-semibold text-ink border-b border-border pb-2">
              Item Parameter Triad
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div class="p-3 bg-surface border border-border space-y-1">
                <strong class="text-brand font-mono block">Discrimination (a)</strong>
                <p>Bounds: [0.20, 2.50]. Slope at inflection point indicating item sensitivity.</p>
              </div>
              <div class="p-3 bg-surface border border-border space-y-1">
                <strong class="text-brand font-mono block">Difficulty (b)</strong>
                <p>Bounds: [-3.00, +3.00]. Developmental ability threshold along the standard scale.</p>
              </div>
              <div class="p-3 bg-surface border border-border space-y-1">
                <strong class="text-brand font-mono block">Pseudo-Guessing (c)</strong>
                <p>Bounds: [0.00, 0.35]. Lower asymptote controlling random guess contamination.</p>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h2 id="numerical-quadrature" class="text-xl font-heading font-semibold text-ink border-b border-border pb-2">
              Bayesian Expected A Posteriori (EAP)
            </h2>
            <p class="text-xs">
              Posterior ability distributions are integrated numerically via a 41-node Gauss-Hermite quadrature across \`[-4.0, +4.0]\` standard deviations. Prior distribution \`N(0, 1)\` updates adaptively upon every response vector.
            </p>
          </div>
        </div>
      {:else if activeDoc.id === 'science-cat'}
        <div class="space-y-8 text-sm text-ink-secondary leading-relaxed">
          <div class="p-4 rounded-none bg-canvas border border-border font-mono text-center sm:text-sm text-ink space-y-1">
            <div>I(θ) = [ D² · a² · (1 − c) ] / [ (c + e^(D·a·(θ−b))) · (1 + e^(−D·a·(θ−b)))² ]</div>
            <div class="text-xs text-ink-muted font-sans">Fisher Information Function</div>
          </div>

          <div class="space-y-3">
            <h2 id="stopping-bounds" class="text-xl font-heading font-semibold text-ink border-b border-border pb-2">
              Standard Error Stopping Bounds
            </h2>
            <ul class="space-y-2 text-xs">
              <li class="flex items-start gap-2">
                <CheckCircle2 class="w-4 h-4 text-mint shrink-0 mt-0.5" />
                <div><strong>Standard Error Threshold:</strong> Diagnostic session terminates when \`SE(θ) ≤ 0.30\`.</div>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircle2 class="w-4 h-4 text-mint shrink-0 mt-0.5" />
                <div><strong>Length Ceilings:</strong> Minimum 5 questions, maximum 15 questions. Never exhausts children with marathon testing.</div>
              </li>
              <li class="flex items-start gap-2">
                <CheckCircle2 class="w-4 h-4 text-mint shrink-0 mt-0.5" />
                <div><strong>Exposure Control:</strong> Items are rotated across stratified banks to prevent item wear and answer memorization.</div>
              </li>
            </ul>
          </div>
        </div>
      {:else}
        <!-- Markdown Generic Article Display -->
        <div class="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-ink-secondary leading-relaxed space-y-4">
          <div class="p-6 rounded-none bg-surface-raised border border-border whitespace-pre-line font-sans text-xs leading-relaxed space-y-3">
            {activeDoc.markdown}
          </div>
        </div>
      {/if}

      <!-- Bottom Article Pagination (Previous & Next Page Cards) -->
      <div class="pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#if prevDoc}
          <button
            type="button"
            onclick={() => selectDoc(prevDoc.id)}
            class="p-4 rounded-sm bg-surface-raised border border-border hover:border-brand text-left space-y-1 transition-colors cursor-pointer group"
          >
            <span class="text-[10px] font-mono uppercase text-ink-muted flex items-center gap-1 group-hover:text-brand">
              <ArrowLeft class="w-3 h-3" />
              <span>Previous</span>
            </span>
            <div class="text-xs font-semibold text-ink group-hover:text-brand">
              {prevDoc.title.replace(' · Documentation', '')}
            </div>
          </button>
        {:else}
          <div></div>
        {/if}

        {#if nextDoc}
          <button
            type="button"
            onclick={() => selectDoc(nextDoc.id)}
            class="p-4 rounded-sm bg-surface-raised border border-border hover:border-brand text-right space-y-1 transition-colors cursor-pointer group"
          >
            <span class="text-[10px] font-mono uppercase text-ink-muted flex items-center justify-end gap-1 group-hover:text-brand">
              <span>Next</span>
              <ArrowRight class="w-3 h-3" />
            </span>
            <div class="text-xs font-semibold text-ink group-hover:text-brand">
              {nextDoc.title.replace(' · Documentation', '')}
            </div>
          </button>
        {/if}
      </div>
    </main>

    <!-- RIGHT TABLE OF CONTENTS ("On this page" - Matching shadcn Docs) -->
    <aside class="docs-sidebar-scroll hidden xl:block w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4 space-y-4 border-l border-border/50 text-xs">
      <div class="space-y-3">
        <h4 class="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
          On this page
        </h4>
        <nav class="space-y-1.5" aria-label="Table of Contents">
          {#each activeDoc.toc as item}
            <a
              href="#{item.id}"
              class="block text-ink-muted hover:text-brand transition-colors truncate text-[11px]"
            >
              {item.label}
            </a>
          {/each}
        </nav>
      </div>

      <div class="pt-4 border-t border-border space-y-2 text-[11px] text-ink-muted">
        <button
          type="button"
          onclick={() => browser && window.scrollTo({ top: 0, behavior: 'smooth' })}
          class="hover:text-ink transition-colors cursor-pointer block"
        >
          Back to top ↑
        </button>
        <a
          href="https://github.com/tomkee-lab/creed_os"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-ink transition-colors flex items-center gap-1"
        >
          <span>Edit this page on GitHub</span>
          <ExternalLink class="w-3 h-3" />
        </a>
      </div>
    </aside>
  </div>
</div>

<style>
  /* Suppress visible scrollbars to match shadcn/ui documentation design */
  .docs-sidebar-scroll {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }
  .docs-sidebar-scroll::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
</style>

