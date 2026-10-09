import { auth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

const ALLOWED_ORIGINS = [
  'https://dash.better-auth.com',
  'http://localhost:5173',
  'http://localhost:4173',
  'https://fibre-paid-manga-pills.trycloudflare.com',
  'https://decorating-forests-accommodation-seeker.trycloudflare.com',
  'https://locally-departmental-marathon-gbp.trycloudflare.com',
  'https://real-taxes-try.loca.lt'
];

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');
  const allowedOrigin = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith('.better-auth.com') ||
    origin.endsWith('.trycloudflare.com')
  )
    ? origin
    : 'https://dash.better-auth.com';

  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Better-Auth-Client, x-better-auth-api-key, *',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Private-Network': 'true'
  };

  return headers;
}

export const OPTIONS: RequestHandler = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request)
  });
};

export const fallback: RequestHandler = async (event) => {
  let req = event.request;
  if (event.url.pathname.includes('/api/auth/api/auth/')) {
    const cleanUrl = event.request.url.replace('/api/auth/api/auth/', '/api/auth/');
    req = new Request(cleanUrl, event.request);
  }

  const response = await auth.handler(req);
  const corsHeaders = getCorsHeaders(event.request);

  const newHeaders = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    newHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
};

export const GET: RequestHandler = fallback;
export const POST: RequestHandler = fallback;
