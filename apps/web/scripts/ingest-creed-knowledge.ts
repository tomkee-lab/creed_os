import { loadEnv } from 'vite';
import FirecrawlApp from '@mendable/firecrawl-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from repo root
const env = loadEnv('development', path.resolve(process.cwd(), '../../'), '');
const FIRECRAWL_API_KEY = env.FIRECRAWL_API_KEY;

if (!FIRECRAWL_API_KEY) {
  console.error('Error: FIRECRAWL_API_KEY is missing from environment variables.');
  process.exit(1);
}

const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

const TARGET_KNOWLEDGE_URLS = [
  {
    category: 'pedagogy-belonging',
    slug: 'howson-kingsbury-2024-stem-belonging',
    url: 'https://discovery.ucl.ac.uk/id/eprint/10188981/'
  },
  {
    category: 'singapore-full-sbb',
    slug: 'singapore-moe-full-sbb-framework',
    url: 'https://www.moe.gov.sg/microsites/psle-fsbb/full-subject-based-banding/secondary-school-experience.html'
  },
  {
    category: 'robotics-rubric',
    slug: 'vex-engineering-notebook-rubric',
    url: 'https://kb.vex.com/hc/en-us/articles/7667500350740-Engineering-Notebook-Rubric'
  }
];

const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/raw-knowledge');

async function ensureDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch {
    // Ignore error if exists
  }
}

async function ingestKnowledge() {
  await ensureDir();
  console.log('🚀 Starting Firecrawl Ingestion of CREED OS Open-Source Knowledge...');
  console.log(`Targeting ${TARGET_KNOWLEDGE_URLS.length} authoritative open-source sources...`);

  for (const target of TARGET_KNOWLEDGE_URLS) {
    try {
      console.log(`\n📡 Scraping [${target.category}]: ${target.url}...`);
      const scrapeResult = (await firecrawl.scrape(target.url, {
        formats: ['markdown'],
      })) as any;

      const markdown = scrapeResult.markdown || scrapeResult.data?.markdown;
      if (markdown && markdown.length > 50) {
        const filename = `${target.category}_${target.slug}.md`;
        const filePath = path.join(OUTPUT_DIR, filename);
        await fs.writeFile(filePath, markdown, 'utf-8');
        console.log(`✅ Saved ${markdown.length} bytes to ${filename}`);
      } else {
        console.warn(`⚠️ Warning: No markdown content returned for ${target.url}`);
      }
    } catch (err: any) {
      console.error(`❌ Failed to scrape ${target.url}:`, err.message);
    }
  }

  console.log('\n🎉 Firecrawl Knowledge Ingestion Completed!');
}

ingestKnowledge();
