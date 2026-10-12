import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import FirecrawlApp from '@mendable/firecrawl-js';
import { env } from '$env/dynamic/private';

// Initialize the Firecrawl app with the API key from environment variables
const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });

export interface BatchScrapePayload {
  urls: string[];
  options?: {
    formats?: ('markdown' | 'html' | 'rawHtml')[];
  };
}

export const POST: RequestHandler = async ({ request, locals }) => {
  // Enforce session or admin / teacher authorization if available
  try {
    const body = (await request.json()) as BatchScrapePayload;
    const { urls, options = { formats: ['markdown'] } } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return json({ error: 'At least one URL is required in "urls" array.' }, { status: 400 });
    }

    // Limit batch size to 5 URLs to respect rate limits
    const targetUrls = urls.slice(0, 5);
    const results = [];

    for (const url of targetUrls) {
      try {
        const scrapeResult = (await firecrawl.scrapeUrl(url, options as any)) as any;
        results.push({
          url,
          success: scrapeResult.success !== false,
          markdown: scrapeResult.markdown || scrapeResult.data?.markdown || '',
          metadata: scrapeResult.metadata || scrapeResult.data?.metadata || {}
        });
      } catch (err: any) {
        results.push({
          url,
          success: false,
          error: err.message || 'Scrape failed'
        });
      }
    }

    return json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    console.error('[batchScrape] Firecrawl batch scrape error:', error);
    return json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
};
