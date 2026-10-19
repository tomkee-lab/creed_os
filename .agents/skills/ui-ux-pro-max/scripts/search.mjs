#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = resolve(__dirname, '../data');

// ============ CONFIGURATION ============
const CSV_CONFIG = {
  style: {
    file: 'styles.csv',
    search_cols: ['Style ID', 'Style Category', 'Aliases', 'Keywords', 'Best For', 'Type', 'AI Prompt Keywords'],
    output_cols: ['Style ID', 'Style Category', 'Aliases', 'Status', 'Parent Style ID', 'Preferred Mode', 'Type', 'Keywords', 'Primary Colors', 'Effects & Animation', 'Best For', 'Light Mode ✓', 'Dark Mode ✓', 'Performance', 'Accessibility', 'Framework Compatibility', 'Complexity', 'AI Prompt Keywords', 'CSS/Technical Keywords', 'Implementation Checklist', 'Design System Variables']
  },
  color: {
    file: 'colors.csv',
    search_cols: ['Product Type', 'Notes'],
    output_cols: ['Product Type', 'Primary', 'On Primary', 'Secondary', 'On Secondary', 'Accent', 'On Accent', 'Background', 'Foreground', 'Card', 'Card Foreground', 'Muted', 'Muted Foreground', 'Border', 'Destructive', 'On Destructive', 'Ring', 'Notes']
  },
  chart: {
    file: 'charts.csv',
    search_cols: ['Data Type', 'Keywords', 'Best Chart Type', 'When to Use', 'When NOT to Use', 'Accessibility Notes'],
    output_cols: ['Data Type', 'Keywords', 'Best Chart Type', 'Secondary Options', 'When to Use', 'When NOT to Use', 'Data Volume Threshold', 'Color Guidance', 'Accessibility Grade', 'Accessibility Risk', 'Accessibility Notes', 'A11y Fallback', 'Library Recommendation', 'Interactive Level']
  },
  landing: {
    file: 'landing.csv',
    search_cols: ['Pattern ID', 'Pattern Name', 'Aliases', 'Keywords', 'Conversion Optimization', 'Section Order'],
    output_cols: ['Pattern ID', 'Pattern Name', 'Aliases', 'Keywords', 'Section Order', 'Primary CTA Placement', 'Color Strategy', 'Conversion Optimization']
  },
  product: {
    file: 'products.csv',
    search_cols: ['Product Type', 'Keywords', 'Primary Style Recommendation', 'Key Considerations'],
    output_cols: ['Product Type', 'Keywords', 'Primary Style Recommendation', 'Secondary Styles', 'Landing Page Pattern', 'Dashboard Style (if applicable)', 'Color Palette Focus']
  },
  ux: {
    file: 'ux-guidelines.csv',
    search_cols: ['Category', 'Issue', 'Description', 'Platform'],
    output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
  },
  typography: {
    file: 'typography.csv',
    search_cols: ['Font Pairing Name', 'Category', 'Mood/Style Keywords', 'Best For', 'Heading Font', 'Body Font'],
    output_cols: ['Font Pairing Name', 'Category', 'Heading Font', 'Body Font', 'Mood/Style Keywords', 'Best For', 'Google Fonts URL', 'CSS Import', 'Tailwind Config', 'Notes']
  },
  icons: {
    file: 'icons.csv',
    search_cols: ['Category', 'Icon Name', 'Keywords', 'Best For', 'Library'],
    output_cols: ['Category', 'Icon Name', 'Keywords', 'Library', 'Import Code', 'Usage', 'Best For', 'Style', 'Semantic Role', 'Allowed Contexts']
  },
  gsap: {
    file: 'motion.csv',
    search_cols: ['Category', 'Intensity Tier', 'Keywords', 'Trigger'],
    output_cols: ['Category', 'Intensity Tier', 'Trigger', 'Duration', 'Easing', 'GSAP Snippet', 'Framework Notes', 'Do', "Don't", 'Performance Notes']
  },
  react: {
    file: 'react-performance.csv',
    search_cols: ['Category', 'Issue', 'Keywords', 'Description'],
    output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
  },
  web: {
    file: 'app-interface.csv',
    search_cols: ['Category', 'Issue', 'Keywords', 'Description'],
    output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
  },
  'google-fonts': {
    file: 'google-fonts.csv',
    search_cols: ['Family', 'Category', 'Stroke', 'Classifications', 'Keywords', 'Subsets', 'Designers'],
    output_cols: ['Family', 'Category', 'Stroke', 'Classifications', 'Styles', 'Variable Axes', 'Subsets', 'Designers', 'Popularity Rank', 'Google Fonts URL']
  }
};

const STACKS = [
  'react', 'nextjs', 'vue', 'svelte', 'astro', 'swiftui', 'react-native',
  'flutter', 'nuxtjs', 'nuxt-ui', 'html-tailwind', 'shadcn', 'jetpack-compose',
  'threejs', 'angular', 'laravel', 'javafx', 'wpf', 'winui', 'avalonia', 'uno', 'uwp'
];

const UNTRUNCATED_COLS = new Set([
  'Code Example Good', 'Code Example Bad', 'Code Good', 'Code Bad',
  'Implementation Checklist', 'Design System Variables', 'CSS Import',
  'Tailwind Config', 'GSAP Snippet'
]);

const STOPWORDS = new Set([
  'to', 'in', 'on', 'at', 'is', 'of', 'by', 'or', 'an', 'if', 'no', 'so',
  'do', 'be', 'we', 'it', 'as', 'the', 'and', 'for', 'are', 'was'
]);

const SYNONYMS = {
  'q&a': 'question answer',
  'e-commerce': 'ecommerce',
  'dark-mode': 'dark',
  'darkmode': 'dark',
  'light-mode': 'light',
  'lightmode': 'light',
  'a11y': 'accessibility',
  'nav': 'navigation',
  'sign-up': 'signup',
  'log-in': 'login',
  'colour': 'color',
  'colours': 'colors',
  'customisation': 'customization',
  'organisation': 'organization',
  'behaviour': 'behavior',
  'ux/ui': 'ux ui'
};

function normalize(text) {
  let str = String(text || '');
  for (const [v, c] of Object.entries(SYNONYMS)) {
    const reg = new RegExp(`(?<!\\w)${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\w)`, 'gi');
    str = str.replace(reg, c);
  }
  return str;
}

function tokenize(text) {
  const norm = normalize(String(text || '').toLowerCase()).replace(/[^\w\s]/g, ' ');
  return norm.split(/\s+/).filter(w => w.length >= 2 && !STOPWORDS.has(w));
}

// RFC 4180 compliant CSV parser
function parseCSV(content) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentToken = '';

  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    const next = content[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(currentToken.trim());
      currentToken = '';
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
        lines.push(row);
      }
      row = [];
    } else {
      currentToken += c;
    }
  }
  if (currentToken.length > 0 || row.length > 0) {
    row.push(currentToken.trim());
    lines.push(row);
  }

  if (lines.length === 0) return [];
  const headers = lines[0];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = line[j] || '';
    }
    rows.push(obj);
  }
  return rows;
}

// BM25 implementation
class BM25 {
  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.corpus = [];
    this.docLengths = [];
    this.avgdl = 1.0;
    this.idf = new Map();
    this.termFreqs = [];
  }

  fit(documents) {
    this.corpus = documents.map(d => tokenize(d));
    const N = this.corpus.length;
    if (N === 0) return;

    this.docLengths = this.corpus.map(d => d.length);
    this.avgdl = this.docLengths.reduce((a, b) => a + b, 0) / N || 1.0;

    const docFreqs = new Map();
    this.termFreqs = [];

    for (const doc of this.corpus) {
      const tf = new Map();
      for (const w of doc) {
        tf.set(w, (tf.get(w) || 0) + 1);
      }
      this.termFreqs.push(tf);
      for (const w of tf.keys()) {
        docFreqs.set(w, (docFreqs.get(w) || 0) + 1);
      }
    }

    for (const [w, freq] of docFreqs.entries()) {
      const idf = Math.log((N - freq + 0.5) / (freq + 0.5) + 1);
      this.idf.set(w, idf);
    }
  }

  score(query) {
    const qTokens = tokenize(query);
    const scores = [];
    const N = this.corpus.length;

    for (let idx = 0; idx < N; idx++) {
      let s = 0;
      const docLen = this.docLengths[idx];
      const tfMap = this.termFreqs[idx];

      for (const t of qTokens) {
        if (this.idf.has(t)) {
          const tf = tfMap.get(t) || 0;
          const idf = this.idf.get(t);
          const num = tf * (this.k1 + 1);
          const den = tf + this.k1 * (1 - this.b + (this.b * docLen) / this.avgdl);
          s += (idf * num) / den;
        }
      }
      scores.push({ idx, score: s });
    }

    return scores.sort((a, b) => b.score - a.score);
  }
}

function loadCSV(filePath) {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf-8');
  return parseCSV(content);
}

function searchDomain(domain, query, maxResults = 3) {
  const config = CSV_CONFIG[domain];
  if (!config) throw new Error(`Unknown domain: ${domain}`);

  const filePath = join(DATA_DIR, config.file);
  const rows = loadCSV(filePath);
  if (!rows || rows.length === 0) {
    return { domain, file: config.file, query, count: 0, results: [] };
  }

  const docs = rows.map(r => config.search_cols.map(c => r[c] || '').join(' '));
  const bm25 = new BM25();
  bm25.fit(docs);

  const ranked = bm25.score(query);
  const top = ranked.slice(0, maxResults).filter(item => item.score > 0);

  const results = top.map(item => {
    const raw = rows[item.idx];
    const res = {};
    for (const c of config.output_cols) {
      if (raw[c] !== undefined) res[c] = raw[c];
    }
    return res;
  });

  return {
    domain,
    file: config.file,
    query,
    count: results.length,
    results
  };
}

function searchStack(stack, query, maxResults = 3) {
  if (!STACKS.includes(stack)) throw new Error(`Unknown stack: ${stack}. Available: ${STACKS.join(', ')}`);
  const filePath = join(DATA_DIR, 'stacks', `${stack}.csv`);
  const rows = loadCSV(filePath);
  if (!rows || rows.length === 0) {
    return { stack, file: `stacks/${stack}.csv`, query, count: 0, results: [] };
  }

  const searchCols = ['Category', 'Guideline', 'Description', 'Do', "Don't", 'Code Good', 'Code Bad'];
  const outputCols = ['Category', 'Guideline', 'Description', 'Do', "Don't", 'Code Good', 'Code Bad', 'Severity', 'Docs URL', 'Applies To'];

  const docs = rows.map(r => searchCols.map(c => r[c] || '').join(' '));
  const bm25 = new BM25();
  bm25.fit(docs);

  const ranked = bm25.score(query);
  const top = ranked.slice(0, maxResults).filter(item => item.score > 0);

  const results = top.map(item => {
    const raw = rows[item.idx];
    const res = {};
    for (const c of outputCols) {
      if (raw[c] !== undefined) res[c] = raw[c];
    }
    return res;
  });

  return {
    stack,
    file: `stacks/${stack}.csv`,
    query,
    count: results.length,
    results
  };
}

function autoDetectDomain(query) {
  const q = query.toLowerCase();
  if (/color|palette|hex|rgb|theme/.test(q)) return 'color';
  if (/chart|graph|plot|viz|visualization|trend/.test(q)) return 'chart';
  if (/landing|hero|cta|conversion|pricing/.test(q)) return 'landing';
  if (/font|typography|heading|serif|sans/.test(q)) return 'typography';
  if (/icon|svg|glyph|symbol/.test(q)) return 'icons';
  if (/animation|motion|gsap|stagger|transition/.test(q)) return 'gsap';
  if (/ux|usability|accessibility|wcag|a11y|touch|keyboard/.test(q)) return 'ux';
  if (/product|saas|fintech|ecommerce|app/.test(q)) return 'product';
  return 'style';
}

function formatOutput(res, full = false) {
  const out = [];
  if (res.stack) {
    out.push('## UI Pro Max Stack Guidelines');
    out.push(`**Stack:** ${res.stack} | **Query:** ${res.query}`);
  } else {
    out.push('## UI Pro Max Search Results');
    out.push(`**Domain:** ${res.domain} | **Query:** ${res.query}`);
  }
  out.push(`**Source:** ${res.file} | **Found:** ${res.count} results\n`);

  if (res.count === 0) {
    out.push('No matches found. Try broader keywords or an explicit --domain / --stack.');
    return out.join('\n');
  }

  res.results.forEach((row, i) => {
    out.push(`### Result ${i + 1}`);
    for (const [k, v] of Object.entries(row)) {
      let val = String(v);
      if (!full && !UNTRUNCATED_COLS.has(k) && val.length > 300) {
        val = val.slice(0, 300) + '...';
      }
      out.push(`- **${k}:** ${val}`);
    }
    out.push('');
  });

  return out.join('\n');
}

function generateDesignSystem(query, projectName = 'Design System') {
  const productRes = searchDomain('product', query, 1);
  const styleRes = searchDomain('style', query, 2);
  const colorRes = searchDomain('color', query, 1);
  const typoRes = searchDomain('typography', query, 1);
  const uxRes = searchDomain('ux', query, 2);

  const product = productRes.results[0] || {};
  const style = styleRes.results[0] || {};
  const color = colorRes.results[0] || {};
  const typo = typoRes.results[0] || {};

  const lines = [
    `# Design System: ${projectName}`,
    `**Query:** ${query}`,
    '',
    '## 1. Product & Architecture',
    `- **Product Type:** ${product['Product Type'] || 'General Web Application'}`,
    `- **Primary Style:** ${style['Style ID'] || product['Primary Style Recommendation'] || 'Modern Minimalist'}`,
    `- **Landing Pattern:** ${product['Landing Page Pattern'] || 'Hero + Features + Social Proof + CTA'}`,
    '',
    '## 2. Color Palette & Semantic Tokens',
    `- **Primary:** \`${color['Primary'] || '#2563eb'}\``,
    `- **Secondary:** \`${color['Secondary'] || '#475569'}\``,
    `- **Accent:** \`${color['Accent'] || '#3b82f6'}\``,
    `- **Background:** \`${color['Background'] || '#ffffff'}\``,
    `- **Foreground:** \`${color['Foreground'] || '#0f172a'}\``,
    `- **Border:** \`${color['Border'] || '#e2e8f0'}\``,
    color['Notes'] ? `- **Notes:** ${color['Notes']}` : '',
    '',
    '## 3. Typography',
    `- **Pairing:** ${typo['Font Pairing Name'] || 'Inter + Inter'}`,
    `- **Heading Font:** ${typo['Heading Font'] || 'Inter'}`,
    `- **Body Font:** ${typo['Body Font'] || 'Inter'}`,
    typo['Google Fonts URL'] ? `- **Google Fonts URL:** ${typo['Google Fonts URL']}` : '',
    '',
    '## 4. UI Style & Technical Guidelines',
    `- **Style Category:** ${style['Style Category'] || 'Clean Functional'}`,
    `- **Effects & Animation:** ${style['Effects & Animation'] || 'Subtle transitions (140ms-200ms), no bouncy physics'}`,
    `- **Accessibility Notes:** ${style['Accessibility'] || 'Ensure WCAG 2.1 AA contrast ratios'}`,
    style['Implementation Checklist'] ? `- **Checklist:**\n  ${style['Implementation Checklist']}` : '',
    '',
    '## 5. Critical UX & Interaction Rules',
    ...(uxRes.results.map(u => `- **${u['Issue'] || 'Rule'}:** ${u['Description'] || u['Do'] || ''}`)),
    ''
  ];

  return lines.filter(Boolean).join('\n');
}

// ============ CLI ARGUMENT PARSER ============
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    query: '',
    domain: null,
    stack: null,
    maxResults: 3,
    json: false,
    full: false,
    designSystem: false,
    projectName: 'Design System'
  };

  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-d' || a === '--domain') {
      options.domain = args[++i];
    } else if (a === '-s' || a === '--stack') {
      options.stack = args[++i];
    } else if (a === '-n' || a === '--max-results') {
      options.maxResults = parseInt(args[++i], 10) || 3;
    } else if (a === '--json') {
      options.json = true;
    } else if (a === '--full') {
      options.full = true;
    } else if (a === '-ds' || a === '--design-system') {
      options.designSystem = true;
    } else if (a === '-p' || a === '--project-name') {
      options.projectName = args[++i];
    } else if (a === '-h' || a === '--help') {
      console.log(`UI/UX Pro Max Search (Node Engine)
Usage:
  node search.mjs "<query>" [--domain <domain>] [--stack <stack>] [-n <max>]
  node search.mjs "<query>" --design-system [-p "Project Name"]

Domains: style, color, chart, landing, product, ux, typography, google-fonts, icons, gsap, react, web
Stacks: ${STACKS.join(', ')}`);
      process.exit(0);
    } else if (!a.startsWith('-')) {
      positional.push(a);
    }
  }

  options.query = positional.join(' ');
  return options;
}

// Main execution
function main() {
  const opts = parseArgs();
  if (!opts.query) {
    console.error('Error: Please provide a search query.');
    process.exit(1);
  }

  if (opts.designSystem) {
    const ds = generateDesignSystem(opts.query, opts.projectName);
    console.log(ds);
    return;
  }

  let result;
  if (opts.stack) {
    result = searchStack(opts.stack, opts.query, opts.maxResults);
  } else {
    const domain = opts.domain || autoDetectDomain(opts.query);
    result = searchDomain(domain, opts.query, opts.maxResults);
  }

  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatOutput(result, opts.full));
  }
}

main();
