import fs from 'node:fs';
import path from 'node:path';

const metaPath = 'c:/learning/.agents/skills/impeccable/scripts/command-metadata.json';
const skillsDir = 'c:/learning/.agents/skills';

if (!fs.existsSync(metaPath)) {
  console.error('Cannot find metadata at', metaPath);
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

const commands = [
  'shape', 'audit', 'critique', 'animate', 'bolder', 'colorize', 'delight',
  'layout', 'overdrive', 'quieter', 'typeset', 'adapt', 'clarify', 'distill',
  'harden', 'onboard', 'optimize', 'polish', 'document', 'extract', 'generate',
  'init', 'live'
];

for (const cmd of commands) {
  const item = meta[cmd];
  if (!item) {
    console.warn(`No metadata found for ${cmd}`);
    continue;
  }

  const targetDir = path.join(skillsDir, cmd);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const refPath = path.join(skillsDir, 'impeccable', 'reference', `${cmd}.md`);
  let refContent = '';
  if (fs.existsSync(refPath)) {
    refContent = fs.readFileSync(refPath, 'utf8');
  }

  const escapedDesc = item.description.replace(/"/g, '\\"');
  const argumentHint = item.argumentHint || '';

  const skillMdContent = `---
name: ${cmd}
description: "${escapedDesc}"
metadata:
  argument-hint: "${argumentHint}"
user-invocable: true
---

<!-- impeccable-pinned-skill -->

# Impeccable: /${cmd}

> **Command Shortcut:** \`/${cmd}\` or \`/impeccable ${cmd}\`  
> **Source:** [Impeccable Reference](file:///c:/learning/.agents/skills/impeccable/reference/${cmd}.md)  
> **Governance:** WAY 2.1 Calm Intelligence & 0/4/8 Architectural Radius System

## Description
${item.description}

---

## Instructions & Playbook

${refContent}

---

## CREED OS & WAY 2.1 Mandatory Alignment Contract
When applying \`/${cmd}\` within CREED OS, you MUST ALWAYS follow the **WAY 2.1 Master Design System**:
1. **0/4/8px Architectural Radius System:**
   - **0px (\`rounded-none\`):** Structural & technical frames (data tables, assessment question frames, item studio panes, console grids, metadata readouts).
   - **4px (\`rounded-sm\`):** Interactive controls & content surfaces (buttons, inputs, tiles, cards, dialogs, navigation items).
   - **8px (\`rounded-md\`):** Expressive media & immersive hero frames only.
   - **Forbidden:** 12px+ bubbly curves (\`rounded-lg\`, \`rounded-xl\`, \`rounded-2xl\`) and pill buttons.
2. **True Spacing Rhythm:** \`p-1\`, \`p-2\`, \`p-4\`, \`p-6\`, \`p-8\`. No arbitrary bracketed pixel classes (\`p-[13px]\`).
3. **OKLCH Semantic Design Tokens:** Use semantic tokens (\`--surface-canvas\`, \`--surface-content\`, \`--surface-raised\`, \`--text-primary\`, \`--brand\`, \`--mint\`, \`--warning\`, \`--negative\`). Never inject ad-hoc hex values.
4. **Lagom Motion:** Strictly 140ms–280ms durations (\`--duration-micro: 140ms\`, \`--duration-standard: 200ms\`, \`--duration-emphasis: 280ms\`). Silenced during active assessments.
5. **DPDP Child Data Safety:** Strict verifiable parental consent gating for minors under 18; zero psychometric leaks on learner or parent routes.
6. **Package Manager:** \`pnpm\` exclusively.
`;

  fs.writeFileSync(path.join(targetDir, 'SKILL.md'), skillMdContent, 'utf8');
  console.log(`Generated skill: ${cmd}`);
}

console.log('All 23 Impeccable skills generated successfully!');
