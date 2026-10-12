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
  // Enforce staff/admin authorization to prevent API quota drainage
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  const role = (locals.user as any).role || (locals.user as any).metadata?.role;
  if (!['admin', 'teacher', 'counselor'].includes(role)) {
    return json({ error: 'Forbidden: Ingestion scraping requires educator or admin authorization.' }, { status: 403 });
  }

  if (!env.FIRECRAWL_API_KEY) {
    return json({ error: 'Firecrawl service is not configured on this instance' }, { status: 503 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as BatchScrapePayload;
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return json({ error: 'At least one URL is required in "urls" array.' }, { status: 400 });
    }

    // Limit batch size to 5 URLs to respect rate limits
    const targetUrls = urls.slice(0, 5);
    const results = [];

    for (const url of targetUrls) {
      try {
        if (!url || typeof url !== 'string') {
          results.push({ url, success: false, error: 'Invalid URL string' });
          continue;
        }

        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          results.push({ url, success: false, error: 'Only HTTP and HTTPS protocols allowed' });
          continue;
        }

        const doc = await firecrawl.scrape(url, { formats: ['markdown'] });
        results.push({
          url,
          success: true,
          markdown: doc.markdown || '',
          metadata: doc.metadata || {}
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
