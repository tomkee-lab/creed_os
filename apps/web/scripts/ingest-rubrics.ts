import { loadEnv } from 'vite';
import FirecrawlApp from '@mendable/firecrawl-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables (Vite-style)
const env = loadEnv('development', path.resolve(process.cwd(), '../../'), '');
const FIRECRAWL_API_KEY = env.FIRECRAWL_API_KEY;

if (!FIRECRAWL_API_KEY) {
  console.error('Error: FIRECRAWL_API_KEY is missing from environment variables.');
  process.exit(1);
}

const firecrawl = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });

const TARGET_URLS = [
  'https://wro-association.org/wro-2024/robo-mission/',
  'https://wro-association.org/wro-2024/future-innovators/',
  'https://techradiance.in/robotics-championship/'
];

const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/raw-rubrics');

async function ensureDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (err) {
    // Ignore error if directory exists
  }
}

async function ingestRubrics() {
  await ensureDir();
  console.log('🚀 Starting Firecrawl Batch Ingestion...');
  console.log(`Targeting ${TARGET_URLS.length} URLs for open-source rubrics...`);

  try {
    const batchScrapeResult = await firecrawl.batchScrapeUrls(TARGET_URLS, {
      formats: ['markdown'],
    }) as any;

    if (batchScrapeResult.success === false) {
      console.error('Failed to initiate batch scrape:', batchScrapeResult.error);
      return;
    }

    const jobId = batchScrapeResult.id;
    console.log(`✅ Batch job created with ID: ${jobId}. Polling for completion...`);

    let isCompleted = false;
    let finalData = null;

    while (!isCompleted) {
      const status = await firecrawl.checkBatchScrapeStatus(jobId);
      console.log(`Current Status: ${status.status} (${status.completed} / ${status.total} completed)`);
      
      if (status.status === 'completed' || status.status === 'failed') {
        isCompleted = true;
        finalData = status;
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log(`🎉 Batch scrape finished with status: ${finalData.status}`);
    
    if (finalData.data) {
      for (let i = 0; i < finalData.data.length; i++) {
        const item = finalData.data[i];
        if (item.markdown) {
          const filename = `scraped_rubric_${i + 1}_${Date.now()}.md`;
          const filePath = path.join(OUTPUT_DIR, filename);
          await fs.writeFile(filePath, item.markdown, 'utf-8');
          console.log(`💾 Saved: ${filename}`);
        }
      }
    }

  } catch (error) {
    console.error('An error occurred during ingestion:', error);
  }
}

ingestRubrics();
