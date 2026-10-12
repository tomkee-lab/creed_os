import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import FirecrawlApp from '@mendable/firecrawl-js';
import { env } from '$env/dynamic/private';

// Initialize the Firecrawl app with the API key from environment variables
const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });

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
    const body = await request.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return json({ error: 'A valid URL string is required' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return json({ error: 'Only HTTP and HTTPS protocols are permitted' }, { status: 400 });
    }

    // Scrape the specified URL using Firecrawl with sanitized options
    const safeOptions = { formats: ['markdown'] as const };
    const scrapeResult = (await firecrawl.scrapeUrl(url, safeOptions as any)) as any;

    if (scrapeResult.success === false) {
      return json({ error: 'Failed to scrape the URL', details: scrapeResult.error }, { status: 500 });
    }

    return json({
      success: true,
      data: scrapeResult,
    });
  } catch (error: any) {
    console.error('Firecrawl scrape error:', error);
    return json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
};
