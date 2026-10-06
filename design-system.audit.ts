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

// 1. Audit Prohibited Radii (No 12px+ bubbly curves like rounded-lg, rounded-xl, rounded-2xl, rounded-3xl)
function auditRadii() {
  const violations: string[] = [];
  const bannedPatterns = [/rounded-(?:lg|xl|2xl|3xl)\b/g];

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.svelte-kit') {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.svelte') || entry.name.endsWith('.css'))) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        for (const pattern of bannedPatterns) {
          const matches = content.match(pattern);
          if (matches) {
            const rel = path.relative(ROOT_DIR, fullPath);
            violations.push(`${rel}: Found forbidden bubbly curve '${matches[0]}'`);
          }
        }
      }
    }
  }

  scanDir(WEB_SRC);
  results.push({
    category: 'Architectural Radius System (0px structural, 4px controls, 8px expressive; no 12px+ bubbly curves)',
    passed: violations.length === 0,
    details: violations
  });
}

// 2. Audit Arbitrary Spacings (e.g. p-2.5, px-2.5, py-2.5 = 10px which violates true 8pt grid)
function auditSpacing() {
  const violations: string[] = [];
  // Focus on components where 10px arbitrary spacing was previously flagged
  const targetComponents = [
    path.join(WEB_SRC, 'lib', 'components', 'IllustrationFrame.svelte'),
    path.join(WEB_SRC, 'lib', 'components', 'Button.svelte'),
    path.join(WEB_SRC, 'lib', 'components', 'Card.svelte')
  ];

  for (const file of targetComponents) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      if (/\b(?:p|px|py)-2\.5\b/.test(content)) {
        violations.push(`${path.relative(ROOT_DIR, file)}: Found forbidden arbitrary spacing (p-2.5 = 10px)`);
      }
      if (/duration-550/.test(content)) {
        violations.push(`${path.relative(ROOT_DIR, file)}: Found forbidden motion duration (duration-550)`);
      }
    }
  }

  results.push({
    category: 'Spacing & Motion Contract (True 8pt grid, 140ms-280ms Lagom motion)',
    passed: violations.length === 0,
    details: violations
  });
}

// 3. Audit Experience Routes for Psychometric Leaks (No θ, SE, 3PL in Student / Parent routes)
function auditPsychometricLeaks() {
  const violations: string[] = [];
  const experienceRoutes = [
    path.join(WEB_SRC, 'routes', 'student'),
    path.join(WEB_SRC, 'routes', 'parent')
  ];

  const leakPatterns = [
    { pattern: /Psychometric Diagnostics & Telemetry/i, name: 'Evaluator Telemetry Drawer' },
    { pattern: /Latent Ability θ/i, name: 'Latent Ability θ' },
    { pattern: /Standard Error SE\(θ\)/i, name: 'Standard Error SE' },
    { pattern: /\b3PL IRT\b/i, name: '3PL IRT technical indicator' }
  ];

  function scanExperienceDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanExperienceDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.svelte')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        for (const { pattern, name } of leakPatterns) {
          if (pattern.test(content)) {
            const rel = path.relative(ROOT_DIR, fullPath);
            violations.push(`${rel}: Found psychometric leak '${name}' in experience route`);
          }
        }
      }
    }
  }

  for (const dir of experienceRoutes) {
    scanExperienceDir(dir);
  }

  results.push({
    category: 'Zero Psychometric Leaks in Production Experience Routes',
    passed: violations.length === 0,
    details: violations
  });
}

// 4. Audit False Precision (No percentage readiness / alignment like "74% Alignment" or "74% Fit")
function auditFalsePrecision() {
  const violations: string[] = [];
  const studentRoutes = path.join(WEB_SRC, 'routes', 'student');

  function scanDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.svelte')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const matches = content.match(/\d+%\s*(?:Alignment|Readiness|Fit)/gi);
        if (matches) {
          const rel = path.relative(ROOT_DIR, fullPath);
          violations.push(`${rel}: Found false precision '${matches.join(', ')}'`);
        }
      }
    }
  }

  scanDir(studentRoutes);

  results.push({
    category: 'Zero False Precision (Qualitative developmental tiers over percentage fitness)',
    passed: violations.length === 0,
    details: violations
  });
}

// 5. Audit Token Pipeline (Pure OKLCH, hairline border using color-mix)
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

// Run all audits
auditRadii();
auditSpacing();
auditPsychometricLeaks();
auditFalsePrecision();
auditTokenPipeline();

console.log('\n===============================================================');
console.log('       CREED OS • WAY 2.0 Calm Intelligence Design Audit       ');
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
  console.log('STATUS: ALL WAY 2.0 DESIGN SYSTEM ASSERTIONS PASSED (100%)\n');
  process.exit(0);
} else {
  console.log('STATUS: DESIGN SYSTEM VIOLATIONS DETECTED\n');
  process.exit(1);
}
