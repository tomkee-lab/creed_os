import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import FirecrawlApp from '@mendable/firecrawl-js';
import { env } from '$env/dynamic/private';

// Initialize the Firecrawl app with the API key from environment variables
const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY });

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { url, options = { formats: ['markdown'] } } = await request.json();

    if (!url) {
      return json({ error: 'URL is required' }, { status: 400 });
    }

    // Scrape the specified URL using Firecrawl
    const scrapeResult = await firecrawl.scrapeUrl(url, options) as any;

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
