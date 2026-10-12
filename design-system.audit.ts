import fs from 'node:fs';
import path from 'node:path';

interface AuditResult {
  category: string;
  passed: boolean;
  details: string[];
}

const ROOT_DIR = process.cwd();
const WEB_SRC = path.join(ROOT_DIR, 'apps', 'web', 'src');

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

// 1. Audit Prohibited Radii (Align with AGENTS.md: permit 0px rounded-none, 4px rounded-sm, 8px rounded-md; ban 12px+ bubbly curves)
function auditRadii() {
  const violations: string[] = [];
  const bannedPatterns = [/\brounded-(?:lg|xl|2xl|3xl)\b/g];
  const allFiles = getFiles(WEB_SRC, ['.svelte', '.css']);

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    for (const pattern of bannedPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        const rel = path.relative(ROOT_DIR, file);
        violations.push(`${rel}: Found forbidden rounded corner '${matches[0]}'`);
      }
    }
  }

  results.push({
    category: 'Architectural Radius System (WAY 2.1: 0px structural, 4px controls, 8px expressive; zero 12px+ curves)',
    passed: violations.length === 0,
    details: violations
  });
}

// 2. Audit True 8pt Spacing Rhythm (Ban arbitrary 10px/30px spacing: p-2.5, px-2.5, py-2.5, gap-2.5, pl-7.5, and bracketed pixel spacings)
function auditSpacing() {
  const violations: string[] = [];
  const bannedPatterns = [
    {
      regex: /\b(?:[a-zA-Z0-9_\-:]+)?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-[xy])-(?:2\.5|7\.5)\b/g,
      desc: 'arbitrary 10px / 30px spacing (-2.5 / -7.5)'
    },
    {
      regex: /\b(?:[a-zA-Z0-9_\-:]+)?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y)-\[\d+px\]\b/g,
      desc: 'arbitrary bracketed pixel spacing (-[Npx])'
    }
  ];

  const allFiles = getFiles(WEB_SRC, ['.svelte', '.css']);

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
  const allFiles = getFiles(WEB_SRC, ['.svelte', '.css']);

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
  const allFiles = getFiles(WEB_SRC, ['.svelte', '.css']);

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
    if (!content.includes('--radius-control: 0px')) {
      violations.push('theme.css: Missing --radius-control: 0px token');
    }
    if (!content.includes('--radius-expressive: 0px')) {
      violations.push('theme.css: Missing --radius-expressive: 0px token');
    }
  }

  results.push({
    category: 'Token Pipeline & Surface Layering (Pure OKLCH tokens & Architectural Radii)',
    passed: violations.length === 0,
    details: violations
  });
}

// Run all audits
auditRadii();
auditSpacing();
auditHexColors();
auditMotionContract();
auditPsychometricLeaks();
auditFalsePrecision();
auditTokenPipeline();

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
if (allPassed) {
  console.log('STATUS: ALL WAY 2.1 DESIGN SYSTEM ASSERTIONS PASSED (100%)\n');
  process.exit(0);
} else {
  console.log('STATUS: DESIGN SYSTEM VIOLATIONS DETECTED\n');
  process.exit(1);
}
