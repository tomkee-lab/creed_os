/**
 * beUI Registry & MCP CLI Helper for CREED OS
 * 
 * Provides CLI commands for developers and agents to:
 * - Search beUI components via keyword (`pnpm beui:search <query>`)
 * - List all available components (`pnpm beui:list [category]`)
 * - Fetch component JSON or raw source (`pnpm beui:fetch <slug> [--raw]`)
 * 
 * Usage:
 *   pnpm beui:search marquee
 *   pnpm beui:fetch marquee
 *   pnpm beui:fetch marquee --raw
 *   pnpm beui:list motion
 */

import https from 'node:https';

const BASE_URL = 'https://beui.dev';

function get(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CREED-OS-beUI-Agent/1.0' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode && res.statusCode >= 400) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

async function listComponents(category?: string) {
  try {
    const raw = await get(`${BASE_URL}/registry.json`);
    const reg = JSON.parse(raw);
    const items = reg.items || [];
    console.log(`\n📦 beUI Registry (${items.length} components available)\n`);
    for (const it of items) {
      if (category && it.type && !it.type.includes(category)) continue;
      console.log(`• \x1b[36m${it.name.padEnd(26)}\x1b[0m ${it.title} — ${it.description?.slice(0, 75)}...`);
    }
  } catch (err: any) {
    console.error('Failed to list beUI components:', err.message);
  }
}

async function searchComponents(query: string) {
  if (!query) {
    console.log('Usage: pnpm beui:search <query>');
    return;
  }
  try {
    const raw = await get(`${BASE_URL}/registry.json`);
    const reg = JSON.parse(raw);
    const items: any[] = reg.items || [];
    const q = query.toLowerCase();
    const matches = items.filter(
      (it) =>
        it.name?.toLowerCase().includes(q) ||
        it.title?.toLowerCase().includes(q) ||
        it.description?.toLowerCase().includes(q)
    );

    console.log(`\n🔍 Found ${matches.length} beUI matches for "${query}":\n`);
    for (const it of matches) {
      console.log(`• \x1b[32m${it.name}\x1b[0m (\x1b[33m${it.type}\x1b[0m)`);
      console.log(`  Title:       ${it.title}`);
      console.log(`  Description: ${it.description}`);
      console.log(`  Docs:        ${BASE_URL}/components/motion/${it.name}`);
      console.log(`  Raw URL:     ${BASE_URL}/r/${it.name}/raw\n`);
    }
  } catch (err: any) {
    console.error('Failed to search beUI components:', err.message);
  }
}

async function fetchComponent(slug: string, rawMode: boolean) {
  if (!slug) {
    console.log('Usage: pnpm beui:fetch <slug> [--raw]');
    return;
  }
  try {
    if (rawMode) {
      const raw = await get(`${BASE_URL}/r/${slug}/raw`);
      console.log(raw);
    } else {
      const jsonStr = await get(`${BASE_URL}/r/${slug}.json`);
      const data = JSON.parse(jsonStr);
      console.log(`\n📦 beUI Component: \x1b[32m${data.name}\x1b[0m`);
      console.log(`Title:        ${data.title}`);
      console.log(`Description:  ${data.description}`);
      console.log(`Dependencies: ${(data.dependencies || []).join(', ') || 'none'}`);
      console.log(`Files (${data.files?.length || 0}):`);
      for (const f of data.files || []) {
        console.log(`  - ${f.path} (${f.type || 'file'})`);
      }
      console.log(`\n💡 To view raw code, run: pnpm beui:fetch ${slug} --raw`);
    }
  } catch (err: any) {
    console.error(`Failed to fetch beUI component "${slug}":`, err.message);
  }
}

async function main() {
  const [,, cmd, arg1, arg2] = process.argv;
  if (cmd === 'search') {
    await searchComponents(arg1);
  } else if (cmd === 'fetch') {
    await fetchComponent(arg1, arg2 === '--raw' || process.argv.includes('--raw'));
  } else if (cmd === 'list') {
    await listComponents(arg1);
  } else {
    console.log(`
beUI CLI Registry Interface for CREED OS

Commands:
  pnpm beui:search <query>          Search components by keyword
  pnpm beui:fetch <slug> [--raw]    Fetch component metadata or raw source
  pnpm beui:list [category]         List available components
`);
  }
}

main().catch(console.error);
