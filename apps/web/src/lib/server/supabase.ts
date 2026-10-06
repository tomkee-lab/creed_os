/**
 * Supabase Cloud PostgreSQL Client & Dual-Mode Connection Adapter
 *
 * Implements seamless dual-mode execution:
 * 1. Cloud Mode: Connects to Supabase PostgreSQL when credentials exist.
 * 2. Local Resilient Mode: Falls back gracefully to `coreRepository`
 *    for zero-config offline or evaluation environments.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.PUBLIC_SUPABASE_ANON_KEY ||
  '';

let cachedClient: SupabaseClient | null = null;

export function isCloudDatabaseEnabled(): boolean {
  return Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith('http'));
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isCloudDatabaseEnabled()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return cachedClient;
}
