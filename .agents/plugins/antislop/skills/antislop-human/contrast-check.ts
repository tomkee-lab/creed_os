#!/usr/bin/env node
/**
 * WCAG 2.x contrast checker in TypeScript/Node.
 * 
 * Usage:
 *   node --experimental-strip-types contrast-check.ts "#FFFFFF" "#777777"
 *   node --experimental-strip-types contrast-check.ts FFFFFF 777777
 *   node --experimental-strip-types contrast-check.ts --selftest
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REFERENCE_HEADER = "| Pairing (text on background) | Ratio | Normal text (4.5) | Large text (3.0) |";
const NAMED_COLORS: Record<string, [number, number, number]> = {
  black: [0, 0, 0],
  white: [255, 255, 255]
};

export function parseHex(value: string): [number, number, number] {
  let clean = value.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((ch) => ch + ch).join('');
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) {
    throw new Error(`expected a hex color like #FFFFFF, got '${value}'`);
  }
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16)
  ];
}

export function parsePairing(pairing: string): [[number, number, number], [number, number, number]] {
  const tokens = pairing.split(/\s+on\s+/i);
  const colors: [number, number, number][] = [];

  for (const raw of tokens) {
    const token = raw.trim();
    const hexMatch = token.match(/#[0-9A-Fa-f]{3,6}/);
    if (hexMatch) {
      colors.push(parseHex(hexMatch[0]));
    } else if (NAMED_COLORS[token.toLowerCase()]) {
      colors.push(NAMED_COLORS[token.toLowerCase()]);
    } else {
      throw new Error(`cannot parse '${token}' from pairing '${pairing}'`);
    }
  }

  if (colors.length !== 2) {
    throw new Error(`expected two colors in pairing '${pairing}'`);
  }

  return [colors[0], colors[1]];
}

export function linearize(channel: number): number {
  const c = channel / 255.0;
  if (c <= 0.03928) {
    return c / 12.92;
  }
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

export function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(colorA: [number, number, number], colorB: [number, number, number]): number {
  const lumA = luminance(colorA);
  const lumB = luminance(colorB);
  const [lighter, darker] = lumA >= lumB ? [lumA, lumB] : [lumB, lumA];
  return (lighter + 0.05) / (darker + 0.05);
}

interface ReferenceRow {
  pairing: string;
  ratio: number;
  normal: string;
  large: string;
}

function parseReferenceRows(filePath: string): ReferenceRow[] {
  const rows: ReferenceRow[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith(REFERENCE_HEADER)) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!trimmed.startsWith('|')) break;
    if (trimmed.startsWith('|---')) continue;

    const cells = trimmed
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

    if (cells.length !== 4) continue;
    const [pairing, ratioStr, normal, large] = cells;
    rows.push({
      pairing,
      ratio: parseFloat(ratioStr),
      normal,
      large
    });
  }

  return rows;
}

function selftest(): number {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const doc = path.join(__dirname, 'SKILL.md');
  if (!fs.existsSync(doc)) {
    console.error('selftest: SKILL.md not found next to the script; cannot check the table');
    return 2;
  }

  let rows: ReferenceRow[];
  try {
    rows = parseReferenceRows(doc);
  } catch (err) {
    console.error(`selftest: could not read the table from SKILL.md: ${err}`);
    return 1;
  }

  if (rows.length === 0) {
    console.error('selftest: no reference rows found in SKILL.md');
    return 1;
  }

  let failures = 0;
  for (const row of rows) {
    const [colorA, colorB] = parsePairing(row.pairing);
    const raw = contrastRatio(colorA, colorB);
    const computed = Math.round(raw * 100) / 100;
    const expectedNormal = raw >= 4.5 ? 'Pass' : 'Fail';
    const expectedLarge = raw >= 3.0 ? 'Pass' : 'Fail';

    if (computed.toFixed(2) !== row.ratio.toFixed(2)) {
      failures++;
      console.error(`selftest: ${row.pairing}: table says ${row.ratio}, formula says ${computed.toFixed(2)}`);
    }
    if (row.normal !== expectedNormal) {
      failures++;
      console.error(`selftest: ${row.pairing}: normal text marked ${row.normal}, should be ${expectedNormal}`);
    }
    if (row.large !== expectedLarge) {
      failures++;
      console.error(`selftest: ${row.pairing}: large text marked ${row.large}, should be ${expectedLarge}`);
    }
  }

  if (failures > 0) {
    return 1;
  }
  console.log(`selftest: ${rows.length} reference pairs OK`);
  return 0;
}

function main(argv: string[]): number {
  if (argv.length === 1 && argv[0] === '--selftest') {
    return selftest();
  }
  if (argv.length !== 2) {
    console.log('usage: node --experimental-strip-types contrast-check.ts <hex1> <hex2> | --selftest');
    return 2;
  }

  try {
    const ratio = contrastRatio(parseHex(argv[0]), parseHex(argv[1]));
    const normal = ratio >= 4.5;
    const large = ratio >= 3.0;
    console.log(`ratio: ${ratio.toFixed(2)}:1`);
    console.log(`normal text (4.5:1): ${normal ? 'PASS' : 'FAIL'}`);
    console.log(`large text  (3.0:1): ${large ? 'PASS' : 'FAIL'}`);
    return normal && large ? 0 : 1;
  } catch (err: any) {
    console.error(`error: ${err.message}`);
    return 2;
  }
}

// Only run main when executed as script
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.exit(main(process.argv.slice(2)));
}
