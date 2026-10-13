import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const FIXTURE_DIR = path.join(ROOT_DIR, '.tmp_audit_validation_fixture');
const FIXTURE_WEB_SRC = path.join(FIXTURE_DIR, 'apps', 'web', 'src');
const FIXTURE_STUDENT_DIR = path.join(FIXTURE_WEB_SRC, 'routes', '(app)', 'student');
const FIXTURE_THEME_DIR = path.join(FIXTURE_DIR, 'packages', 'ui', 'src', 'tokens');

console.log('===============================================================');
console.log('       CREED OS • VALIDATING THE VALIDATOR (Audit Test)       ');
console.log('===============================================================\n');

try {
  // Step 1: Set up temporary fixture directory with deliberate violations
  if (fs.existsSync(FIXTURE_DIR)) {
    fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
  }

  fs.mkdirSync(FIXTURE_STUDENT_DIR, { recursive: true });
  fs.mkdirSync(FIXTURE_THEME_DIR, { recursive: true });

  // 1a. Invalid design-system.json (stale version)
  fs.writeFileSync(
    path.join(FIXTURE_DIR, 'design-system.json'),
    JSON.stringify({ version: '1.0.0-stale' }, null, 2)
  );

  // 1b. Missing $canonicalSource in design-system.rules.json
  fs.writeFileSync(
    path.join(FIXTURE_DIR, 'design-system.rules.json'),
    JSON.stringify({ rules: {} }, null, 2)
  );

  // 1c. Forbidden npm lockfile
  fs.writeFileSync(path.join(FIXTURE_DIR, 'package-lock.json'), '');

  // 1d. Component with prohibited radius, arbitrary spacing, ad-hoc hex, and forbidden duration
  const bannedBracketSpacing = 'p-' + '[13px]';
  const violatingComponent = `<script lang="ts">
  let count = $state(0);
</script>

<div class="rounded-2xl ${bannedBracketSpacing} gap-2.5 bg-[#03080E] duration-500">
  <button class="rounded-xl px-2.5">Violating Button</button>
</div>
`;
  fs.writeFileSync(path.join(FIXTURE_WEB_SRC, 'ViolatingComponent.svelte'), violatingComponent);

  // 1e. Student route with psychometric leak and false precision
  const studentLeakComponent = `<script lang="ts">
</script>

<div>
  <h2>Latent Ability θ: 1.45</h2>
  <span>Standard Error SE(θ) = 0.22</span>
  <span>74% Alignment with career stream</span>
</div>
`;
  fs.writeFileSync(path.join(FIXTURE_STUDENT_DIR, 'StudentLeak.svelte'), studentLeakComponent);

  // 1f. Invalid theme tokens
  const violatingTheme = `:root {
  --border-hairline: rgba(0, 0, 0, 0.1);
}
`;
  fs.writeFileSync(path.join(FIXTURE_THEME_DIR, 'theme.css'), violatingTheme);

  console.log('[1/3] Temporary isolated fixture directory populated with deliberate violations:');
  console.log('      • Canonical version mismatch: version 1.0.0-stale');
  console.log('      • Prohibited radius: rounded-2xl, rounded-xl');
  console.log('      • Prohibited spacing: p-[13px], gap-2.5, px-2.5');
  console.log('      • Prohibited ad-hoc hex: bg-[#03080E]');
  console.log('      • Prohibited motion duration: duration-500');
  console.log('      • Student psychometric leaks: Latent Ability θ, Standard Error SE(θ)');
  console.log('      • False precision: 74% Alignment');
  console.log('      • Banned lockfile: package-lock.json');
  console.log('      • Banned rgba() border hairline token');

  // Step 2: Execute design-system.audit.ts against the fixture
  console.log('\n[2/3] Executing design-system.audit.ts against fixture...');
  const testRun = spawnSync('node', ['--experimental-strip-types', 'design-system.audit.ts'], {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      AUDIT_ROOT_DIR: FIXTURE_DIR,
      AUDIT_WEB_SRC: FIXTURE_WEB_SRC
    },
    encoding: 'utf-8'
  });

  console.log(`      Audit process exited with code: ${testRun.status}`);

  if (testRun.status !== 1) {
    throw new Error(`CRITICAL FAILURE: Expected audit to exit with code 1, but got ${testRun.status}!`);
  }

  // Verify all expected failures were detected
  const output = testRun.stdout + (testRun.stderr || '');
  const requiredDetections = [
    { name: 'Canonical version mismatch', pattern: /design-system\.json version mismatch/ },
    { name: 'Prohibited radius (rounded-2xl)', pattern: /Found forbidden rounded corner 'rounded-2xl'/ },
    { name: 'Prohibited spacing (p-[13px])', pattern: /arbitrary bracketed pixel spacing/ },
    { name: 'Prohibited hex (bg-[#03080E])', pattern: /Found ad-hoc hex class 'bg-\[#03080E\]'/ },
    { name: 'Prohibited duration (duration-500)', pattern: /Found forbidden motion duration 'duration-500'/ },
    { name: 'Psychometric leak (Latent Ability θ)', pattern: /Found psychometric leak 'Latent Ability θ'/ },
    { name: 'False precision (74% Alignment)', pattern: /Found false precision '74% Alignment'/ },
    { name: 'Banned lockfile (package-lock.json)', pattern: /Found forbidden package lockfile 'package-lock.json'/ },
    { name: 'Invalid theme token (rgba hairline)', pattern: /Found rgba\(\) in --border-hairline token/ }
  ];

  let missingDetections = 0;
  for (const check of requiredDetections) {
    if (check.pattern.test(output)) {
      console.log(`      ✓ DETECTED: ${check.name}`);
    } else {
      console.error(`      ✗ MISSED: ${check.name}`);
      missingDetections++;
    }
  }

  if (missingDetections > 0) {
    throw new Error(`CRITICAL FAILURE: Audit missed ${missingDetections} deliberate violation(s)!`);
  }

  console.log('\n      Result: ALL 9 DELIBERATE VIOLATIONS WERE CORRECTLY DETECTED.');
  console.log('      Result: AUDIT SAFELY EXITED NON-ZERO (CODE 1) AS REQUIRED.');

} finally {
  // Step 3: Tear down fixture
  if (fs.existsSync(FIXTURE_DIR)) {
    fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
    console.log('\n[3/3] Temporary fixture directory cleanly purged.');
  }
}

// Step 4: Verify real baseline still passes
console.log('\nVerifying clean workspace baseline...');
const cleanRun = spawnSync('node', ['--experimental-strip-types', 'design-system.audit.ts'], {
  cwd: ROOT_DIR,
  encoding: 'utf-8'
});

if (cleanRun.status !== 0) {
  console.error(cleanRun.stdout);
  throw new Error(`CRITICAL FAILURE: Clean baseline failed with exit code ${cleanRun.status}!`);
}

console.log('✓ Clean baseline verified: 100% PASS with exit code 0.');
console.log('\n===============================================================');
console.log('       STATUS: VALIDATOR PROVEN RELIABLE & AUDIT COMPLIANT      ');
console.log('===============================================================\n');
