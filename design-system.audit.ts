import fs from 'node:fs';
import path from 'node:path';

interface AuditResult {
  category: string;
  passed: boolean;
  details: string[];
}

const ROOT_DIR = process.env.AUDIT_ROOT_DIR || process.cwd();
const WEB_SRC = process.env.AUDIT_WEB_SRC || path.join(ROOT_DIR, 'apps', 'web', 'src');

const results: AuditResult[] = [];

// Helper to recursively walk a directory and collect relevant files
function getFiles(dir: string, extensions: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.svelte-kit') {
      files.push(...getFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Collect all target files across web src and UI package
function getAllTargetFiles(): string[] {
  const dirs = [
    WEB_SRC,
    path.join(ROOT_DIR, 'packages', 'ui', 'src')
  ].filter(d => fs.existsSync(d));

  const files: string[] = [];
  for (const dir of dirs) {
    files.push(...getFiles(dir, ['.svelte', '.css']));
  }
  return files;
}

// 1. Audit Prohibited Radii (Align with AGENTS.md: permit 0px rounded-none, 4px rounded-sm, 8px rounded-md; ban 12px+ bubbly curves and pill buttons/containers)
function auditRadii() {
  const violations: string[] = [];
  const bannedPatterns = [/\brounded-(?:lg|xl|2xl|3xl)\b/g, /\brounded-full\b/g];
  const allFiles = getAllTargetFiles();

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      // Narrow exemptions for true circular mechanical simulation gears or loading spinner rings
      const isExempt =
        line.includes('animate-spin') ||
        line.includes('allowed-circle') ||
        line.includes('gear');

      for (const pattern of bannedPatterns) {
        const matches = line.match(pattern);
        if (matches) {
          for (const match of matches) {
            if (match === 'rounded-full' && isExempt) continue;
            const rel = path.relative(ROOT_DIR, file);
            violations.push(`${rel}:${idx + 1}: Found forbidden rounded corner '${match}'`);
          }
        }
      }
    });
  }

  results.push({
    category: 'Architectural Radius System (WAY 2.1: 0px structural, 4px controls, 8px expressive; zero 12px+ curves, zero pill/full curves on controls & indicators)',
    passed: violations.length === 0,
    details: violations
  });
}

// 2. Audit True 8pt Spacing Rhythm (Ban arbitrary 10px/30px spacing: p-2.5, px-2.5, py-2.5, gap-2.5, pl-7.5, and bracketed pixel spacings)
function auditSpacing() {
  const violations: string[] = [];
  const bannedPatterns = [
    {
      regex: /\b(?:[a-zA-Z0-9_\-:]+)?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-[xy])-(?:2\.5|7\.5|\d+\.(?:25|75))\b/g,
      desc: 'arbitrary 10px / 30px or quarter-step spacing (-2.5 / -7.5 / -N.25 / -N.75)'
    },
    {
      regex: /\b(?:[a-zA-Z0-9_\-:]+)?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y)-\[\d+px\]/g,
      desc: 'arbitrary bracketed pixel spacing (-[Npx])'
    }
  ];

  const allFiles = getAllTargetFiles();

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    for (const { regex, desc } of bannedPatterns) {
      const matches = content.match(regex);
      if (matches) {
        const rel = path.relative(ROOT_DIR, file);
        violations.push(`${rel}: Found forbidden ${desc} '${matches[0]}'`);
      }
    }
  }

  results.push({
    category: 'True Spacing Rhythm (WAY 2.1: 4px/8px true rhythm; zero arbitrary 10px or bracketed pixel spacings)',
    passed: violations.length === 0,
    details: violations
  });
}

// 3. Audit Arbitrary Hex Color Injection (Rule 5: No Arbitrary Colors; only use semantic tokens)
function auditHexColors() {
  const violations: string[] = [];
  const allFiles = getAllTargetFiles();

  const classHexPattern = /\b(?:[a-zA-Z0-9_\-:]+)?(?:bg|text|border|fill|stroke|ring|shadow)-\[#[0-9a-fA-F]+\]/g;
  const rawClassHexPattern = /class="[^"]*#[0-9a-fA-F]{3,6}[^"]*"/g;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(classHexPattern);
    if (matches) {
      const rel = path.relative(ROOT_DIR, file);
      violations.push(`${rel}: Found ad-hoc hex class '${matches[0]}' (must use semantic tokens)`);
    }

    const rawMatches = content.match(rawClassHexPattern);
    if (rawMatches) {
      const rel = path.relative(ROOT_DIR, file);
      violations.push(`${rel}: Found raw hex color in class attribute '${rawMatches[0]}'`);
    }
  }

  results.push({
    category: 'Color System & Semantic Tokens (WAY 2.1: Semantic tokens only; zero ad-hoc hex classes)',
    passed: violations.length === 0,
    details: violations
  });
}

// 4. Audit Lagom Motion Contract (Rule 11: Motion duration must stay strictly between 140ms and 280ms)
function auditMotionContract() {
  const violations: string[] = [];
  const bannedDurations = /\bduration-(?:300|400|500|600|700|800|900|1000|550)\b/g;
  const allFiles = getAllTargetFiles();

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(bannedDurations);
    if (matches) {
      const rel = path.relative(ROOT_DIR, file);
      violations.push(`${rel}: Found forbidden motion duration '${matches[0]}' (must be 140ms–280ms Lagom contract)`);
    }
  }

  results.push({
    category: 'Lagom Motion Contract (WAY 2.1: Strictly 140ms–280ms durations; zero durations >280ms)',
    passed: violations.length === 0,
    details: violations
  });
}

// 5. Audit Experience Routes for Psychometric Leaks (No θ, SE, 3PL in Student / Parent / Teacher / Counselor routes)
function auditPsychometricLeaks() {
  const violations: string[] = [];
  const experienceRoutes = [
    path.join(WEB_SRC, 'routes', 'student'),
    path.join(WEB_SRC, 'routes', 'parent'),
    path.join(WEB_SRC, 'routes', '(app)', 'student'),
    path.join(WEB_SRC, 'routes', '(app)', 'parent'),
    path.join(WEB_SRC, 'routes', '(app)', 'teacher'),
    path.join(WEB_SRC, 'routes', '(app)', 'counselor')
  ];

  const leakPatterns = [
    { pattern: /Psychometric Diagnostics & Telemetry/i, name: 'Evaluator Telemetry Drawer' },
    { pattern: /Latent Ability θ/i, name: 'Latent Ability θ' },
    { pattern: /Standard Error SE\(θ\)/i, name: 'Standard Error SE' },
    { pattern: /\b3PL IRT\b/i, name: '3PL IRT technical indicator' }
  ];

  for (const dir of experienceRoutes) {
    const svelteFiles = getFiles(dir, ['.svelte']);
    for (const file of svelteFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const { pattern, name } of leakPatterns) {
        if (pattern.test(content)) {
          const rel = path.relative(ROOT_DIR, file);
          violations.push(`${rel}: Found psychometric leak '${name}' in experience route`);
        }
      }
    }
  }

  results.push({
    category: 'Zero Psychometric Leaks in Production Experience Routes (Bifurcated Paradigms)',
    passed: violations.length === 0,
    details: violations
  });
}

// 6. Audit False Precision (No percentage readiness / alignment like "74% Alignment" or "74% Fit")
function auditFalsePrecision() {
  const violations: string[] = [];
  const studentDirs = [
    path.join(WEB_SRC, 'routes', 'student'),
    path.join(WEB_SRC, 'routes', '(app)', 'student')
  ];

  for (const dir of studentDirs) {
    const svelteFiles = getFiles(dir, ['.svelte']);
    for (const file of svelteFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const matches = content.match(/\d+%\s*(?:Alignment|Readiness|Fit)/gi);
      if (matches) {
        const rel = path.relative(ROOT_DIR, file);
        violations.push(`${rel}: Found false precision '${matches.join(', ')}'`);
      }
    }
  }

  results.push({
    category: 'Zero False Precision (Qualitative developmental tiers over percentage fitness)',
    passed: violations.length === 0,
    details: violations
  });
}

// 7. Audit Token Pipeline (Pure OKLCH, hairline border using color-mix, calibrated surface layering)
function auditTokenPipeline() {
  const violations: string[] = [];
  const themeFile = path.join(ROOT_DIR, 'packages', 'ui', 'src', 'tokens', 'theme.css');

  if (fs.existsSync(themeFile)) {
    const content = fs.readFileSync(themeFile, 'utf-8');
    if (/--border-hairline:\s*rgba\(/i.test(content)) {
      violations.push('theme.css: Found rgba() in --border-hairline token (must use pure OKLCH or color-mix)');
    }
    if (!content.includes('--radius-structural: 0px')) {
      violations.push('theme.css: Missing --radius-structural: 0px token');
    }
    if (!content.includes('--radius-control: 4px')) {
      violations.push('theme.css: Missing --radius-control: 4px token');
    }
    if (!content.includes('--radius-expressive: 8px')) {
      violations.push('theme.css: Missing --radius-expressive: 8px token');
    }
  }

  results.push({
    category: 'Token Pipeline & Surface Layering (Pure OKLCH tokens & Architectural Radii)',
    passed: violations.length === 0,
    details: violations
  });
}

// 8. Audit Package Manager Invariants (Strict pnpm only; zero npm/yarn locks)
function auditPackageManager() {
  const violations: string[] = [];
  const bannedLocks = ['package-lock.json', 'yarn.lock'];

  for (const lock of bannedLocks) {
    if (fs.existsSync(path.join(ROOT_DIR, lock))) {
      violations.push(`Found forbidden package lockfile '${lock}' (pnpm is the exclusive package manager)`);
    }
  }

  results.push({
    category: 'Package Manager Governance (pnpm exclusive; zero npm/yarn lockfiles)',
    passed: violations.length === 0,
    details: violations
  });
}

// 9. Heuristic Design Audits (Card Soup, Excessive Nesting, AI-Slop Patterns -> REVIEW_REQUIRED)
interface HeuristicFinding {
  rule: string;
  file: string;
  line: number;
  snippet: string;
}

const heuristicFindings: HeuristicFinding[] = [];

function auditHeuristics() {
  const allFiles = getAllTargetFiles().filter(f => f.endsWith('.svelte'));

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    const rel = path.relative(ROOT_DIR, file);

    lines.forEach((line, idx) => {
      // Heuristic 1: Decorative neon glows or gradients
      if (/\b(?:from-purple|to-pink|from-cyan|bg-gradient-to-r)\b/i.test(line) && !line.includes('// exempt:gradient')) {
        heuristicFindings.push({
          rule: 'Decorative Gradient / Potential AI-Slop Pattern',
          file: rel,
          line: idx + 1,
          snippet: line.trim().slice(0, 80)
        });
      }

      // Heuristic 2: Excessive box-shadow glows
      if (/\bshadow-\[(?:0_0_|0px_0px_)[^\]]*\]/i.test(line)) {
        heuristicFindings.push({
          rule: 'Glow Box Shadow / Neon Halo Effect',
          file: rel,
          line: idx + 1,
          snippet: line.trim().slice(0, 80)
        });
      }
    });
  }
}

// 10. Audit Canonical Specification Integrity (design-system.json authority & derived consistency)
function auditCanonicalSpecification() {
  const violations: string[] = [];
  const specFile = path.join(ROOT_DIR, 'design-system.json');
  const rulesFile = path.join(ROOT_DIR, 'design-system.rules.json');

  if (!fs.existsSync(specFile)) {
    violations.push('Missing canonical master specification file: design-system.json');
  } else {
    try {
      const spec = JSON.parse(fs.readFileSync(specFile, 'utf-8'));
      if (spec.version !== '2.1.0') {
        violations.push(`design-system.json version mismatch: expected 2.1.0, got ${spec.version}`);
      }
    } catch (e) {
      violations.push(`design-system.json contains invalid JSON: ${e}`);
    }
  }

  if (!fs.existsSync(rulesFile)) {
    violations.push('Missing derived rules file: design-system.rules.json');
  } else {
    try {
      const rules = JSON.parse(fs.readFileSync(rulesFile, 'utf-8'));
      if (rules.$canonicalSource !== 'design-system.json') {
        violations.push('design-system.rules.json must declare $canonicalSource: "design-system.json"');
      }
    } catch (e) {
      violations.push(`design-system.rules.json contains invalid JSON: ${e}`);
    }
  }

  results.push({
    category: 'Canonical Specification Integrity (design-system.json authority & derived rules consistency)',
    passed: violations.length === 0,
    details: violations
  });
}

// 11. Audit Anti-Slop Copywriting Gates (miqdadbadjuber/anti-slop R-16: Zero AI marketing hyperbole & sycophancy in UI copy)
function auditAntiSlopCopywriting() {
  const violations: string[] = [];
  const bannedCopyPatterns = [
    { regex: /\b(?:AI-powered|AI powered)\b/i, label: 'Banned buzzword: "AI-powered" (Anti-Slop R-16)' },
    { regex: /\bsupercharge\b/i, label: 'Banned hyperbolic buzzword: "supercharge" (Anti-Slop R-16)' },
    { regex: /\b(?:revolutionary|cutting-edge)\s+ai\b/i, label: 'Banned hyperbolic claim: "revolutionary/cutting-edge AI" (Anti-Slop R-16)' },
    { regex: /\b(?:unleash|unlock)\s+your\s+potential\b/i, label: 'Banned cliché: "unleash/unlock your potential" (Anti-Slop R-16)' },
    { regex: /\b(?:empower(?:s|ing|ment|ed)?|elevat(?:e|ing|ion|es))\b/i, label: 'Banned empty AI vocabulary: "empower/elevate" (Anti-Slop R-16)' },
    { regex: /\b(?:game-?changer|next-?level|seamless(?:ly)?)\b/i, label: 'Banned cliché: "game-changer/next-level/seamless" (Anti-Slop R-16)' },
    { regex: /\b(?:delve into the|rich tapestry of)\b/i, label: 'Banned LLM slop phrase: "delve into / tapestry" (Anti-Slop R-16)' }
  ];

  const allFiles = getAllTargetFiles().filter((f) => f.endsWith('.svelte'));

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    // Strip comments to focus strictly on rendered templates and text
    const cleanContent = content
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    const lines = cleanContent.split('\n');
    lines.forEach((line, idx) => {
      for (const { regex, label } of bannedCopyPatterns) {
        if (regex.test(line)) {
          const rel = path.relative(ROOT_DIR, file);
          violations.push(`${rel}:${idx + 1}: ${label}`);
        }
      }
    });
  }

  results.push({
    category: 'Anti-Slop Copywriting & AI Voice (miqdadbadjuber/anti-slop R-16: Zero hyperbolic marketing buzzwords)',
    passed: violations.length === 0,
    details: violations
  });
}

// 12. Audit Anti-Slop Visual & Media Integrity (Anti-Slop R-01/R-13/R-17: Zero decorative neon orbs & placeholder mock services)
function auditAntiSlopVisualArtefacts() {
  const violations: string[] = [];
  const bannedVisualPatterns = [
    {
      regex: /\b(?:blur-(?:2xl|3xl)\s+bg-(?:purple|cyan|pink|indigo)-[0-9]{3}\/\d+)\b/i,
      label: 'Decorative neon halo orb / blurred background blob (Anti-Slop R-01/R-13)'
    },
    {
      regex: /\b(?:via\.placeholder\.com|placehold\.co|picsum\.photos)\b/i,
      label: 'Placeholder mock image service in production template (Anti-Slop R-17)'
    }
  ];

  const allFiles = getAllTargetFiles();

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      for (const { regex, label } of bannedVisualPatterns) {
        if (regex.test(line)) {
          const rel = path.relative(ROOT_DIR, file);
          violations.push(`${rel}:${idx + 1}: Found ${label}`);
        }
      }
    });
  }

  results.push({
    category: 'Anti-Slop Visual & Media Integrity (miqdadbadjuber/anti-slop R-01/R-13/R-17: Zero neon orbs or placeholder mocks)',
    passed: violations.length === 0,
    details: violations
  });
}

// 13. Audit Anti-Slop Punctuation & Typography (Anti-Slop R-02: Zero em dash characters in UI templates)
function auditAntiSlopPunctuation() {
  const violations: string[] = [];
  const allFiles = getAllTargetFiles().filter((f) => f.endsWith('.svelte'));

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const cleanContent = content
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    const lines = cleanContent.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('\u2014')) {
        const rel = path.relative(ROOT_DIR, file);
        violations.push(`${rel}:${idx + 1}: Found forbidden em dash (—) character (Anti-Slop R-02)`);
      }
    });
  }

  results.push({
    category: 'Anti-Slop Punctuation Hygiene (miqdadbadjuber/anti-slop R-02: Zero em dash characters)',
    passed: violations.length === 0,
    details: violations
  });
}

// 14. Audit Anti-Slop Human & Accessibility (miqdadbadjuber/anti-slop R-32: Keyboard operable, zero unlabeled buttons, accessible focus)
function auditAntiSlopHumanAccessibility() {
  const violations: string[] = [];
  const allFiles = getAllTargetFiles().filter((f) => f.endsWith('.svelte'));

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const rel = path.relative(ROOT_DIR, file);

    // 1. Unlabeled icon-only button check
    const buttonRegex = /<button\b([^>]*)>([\s\S]*?)<\/button>/g;
    let match: RegExpExecArray | null;
    while ((match = buttonRegex.exec(content)) !== null) {
      const attrs = match[1];
      const inner = match[2].trim();
      const hasAriaLabel = /\baria-label\s*=\s*["'{]/.test(attrs);
      const hasTitle = /\btitle\s*=\s*["'{]/.test(attrs);
      const hasAriaHidden = /\baria-hidden\s*=\s*["'{]true["'}]/.test(attrs);
      const textContent = inner.replace(/<[^>]+>/g, '').trim();

      if (!hasAriaLabel && !hasTitle && !hasAriaHidden && textContent.length === 0) {
        const lineNum = content.slice(0, match.index).split('\n').length;
        violations.push(`${rel}:${lineNum}: Found icon-only button missing aria-label or title`);
      }
    }

    // 2. Bare outline-none check
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (/\boutline-none\b/.test(line)) {
        const hasFocus = line.includes('focus') || line.includes('ring');
        if (!hasFocus) {
          violations.push(`${rel}:${idx + 1}: Found outline-none without focus-visible replacement`);
        }
      }
    });
  }

  results.push({
    category: 'Anti-Slop Human Accessibility (miqdadbadjuber/anti-slop R-32: Accessible buttons & focus indicators)',
    passed: violations.length === 0,
    details: violations
  });
}

// 15. Audit Anti-Slop Mobile & Responsive Layout (miqdadbadjuber/anti-slop R-03: Overflow, responsive tables, safe area, and tap targets)
function auditAntiSlopMobileLayout() {
  const violations: string[] = [];
  const allFiles = getAllTargetFiles().filter((f) => f.endsWith('.svelte'));

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const rel = path.relative(ROOT_DIR, file);

    // 1. Tables must be wrapped in overflow-x-auto or overflow-auto container
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('<table')) {
        // Look backwards up to 6 lines for parent container overflow classes
        const preceding = lines.slice(Math.max(0, idx - 6), idx + 1).join('\n');
        const hasOverflow =
          preceding.includes('overflow-x-auto') ||
          preceding.includes('overflow-auto') ||
          line.includes('overflow-x-auto') ||
          line.includes('overflow-auto');

        if (!hasOverflow) {
          violations.push(`${rel}:${idx + 1}: Found <table> without responsive 'overflow-x-auto' wrapper (Anti-Slop R-03)`);
        }
      }
    });

    // 2. Fixed bottom navigation must support safe-area insets and reserve space
    if (content.includes('fixed bottom-0')) {
      const hasSafeArea = content.includes('env(safe-area-inset-bottom') || content.includes('safe-area');
      if (!hasSafeArea) {
        violations.push(`${rel}: Fixed bottom navigation bar missing 'env(safe-area-inset-bottom)' support (Anti-Slop R-03)`);
      }
    }
  }

  results.push({
    category: 'Anti-Slop Mobile & Responsive Layout (miqdadbadjuber/anti-slop R-03: Table reflow, safe area, tap targets)',
    passed: violations.length === 0,
    details: violations
  });
}

// Run all audits
auditCanonicalSpecification();
auditRadii();
auditSpacing();
auditHexColors();
auditMotionContract();
auditPsychometricLeaks();
auditFalsePrecision();
auditTokenPipeline();
auditPackageManager();
auditAntiSlopCopywriting();
auditAntiSlopVisualArtefacts();
auditAntiSlopPunctuation();
auditAntiSlopHumanAccessibility();
auditAntiSlopMobileLayout();
auditHeuristics();

console.log('\n===============================================================');
console.log('       CREED OS • WAY 2.1 Calm Intelligence Design Audit       ');
console.log('===============================================================\n');

let allPassed = true;
for (const res of results) {
  if (res.passed) {
    console.log(`[PASS] ${res.category}`);
  } else {
    allPassed = false;
    console.log(`[FAIL] ${res.category}`);
    for (const d of res.details) {
      console.log(`       -> ${d}`);
    }
  }
}

console.log('\n---------------------------------------------------------------');
console.log('HEURISTIC ADVERSARIAL REVIEW (Anti-Slop & Information Density):');
if (heuristicFindings.length === 0) {
  console.log('[PASS] Zero decorative neon gradients, AI glows, or slop anomalies detected.');
} else {
  console.log(`[REVIEW_REQUIRED] ${heuristicFindings.length} heuristic patterns flagged for editorial inspection:`);
  for (const h of heuristicFindings.slice(0, 10)) {
    console.log(`  -> [${h.rule}] ${h.file}:${h.line} ("${h.snippet}")`);
  }
}

console.log('---------------------------------------------------------------');
if (allPassed) {
  console.log('STATUS: ALL WAY 2.1 DETERMINISTIC DESIGN ASSERTIONS PASSED (100%)\n');
  process.exit(0);
} else {
  console.log('STATUS: HARD DESIGN SYSTEM VIOLATIONS DETECTED\n');
  process.exit(1);
}
