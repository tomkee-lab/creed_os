import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import pg from 'pg';
const { Pool } = pg;

const supabaseUrl = env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '';

const supabaseSecretKey =
  env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

const supabasePublishableKey =
  env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  env.PUBLIC_SUPABASE_ANON_KEY ||
  process.env.PUBLIC_SUPABASE_ANON_KEY ||
  '';

const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL || '';

let cachedAdminClient: SupabaseClient | null = null;
let cachedPublishableClient: SupabaseClient | null = null;
let dbPool: pg.Pool | null = null;

if (databaseUrl) {
  try {
    dbPool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5000,
      max: 10
    });
    dbPool.on('error', (err) => {
      console.warn('[supabase:db] Idle pool client notification:', err.message);
    });
  } catch (err: any) {
    console.warn('[supabase:db] Failed to initialize Postgres connection pool:', err.message);
  }
}

export function isCloudDatabaseEnabled(): boolean {
  return Boolean(
    dbPool !== null ||
    (supabaseUrl && (supabaseSecretKey || supabasePublishableKey) && supabaseUrl.startsWith('http'))
  );
}

export function getDbPool(): pg.Pool | null {
  return dbPool;
}

/**
 * Returns elevated Supabase client with secret / service-role credentials for administrative tasks.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseSecretKey || !supabaseUrl.startsWith('http')) {
    return null;
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return cachedAdminClient;
}

/**
 * Returns scoped Supabase client with publishable credentials.
 */
export function getSupabasePublishableClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabasePublishableKey || !supabaseUrl.startsWith('http')) {
    return null;
  }

  if (!cachedPublishableClient) {
    cachedPublishableClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return cachedPublishableClient;
}

/**
 * Primary server-side accessor: resolves explicit administrative client or scoped client.
 */
export function getSupabaseClient(): SupabaseClient | null {
  return getSupabaseAdminClient() || getSupabasePublishableClient();
}

export async function queryDb<T = any>(sqlText: string, params: any[] = []): Promise<T[]> {
  if (dbPool) {
    try {
      const res = await dbPool.query(sqlText, params);
      return res.rows as T[];
    } catch (err: any) {
      console.warn('[supabase:db] Postgres pool query failed, falling back:', err.message);
    }
  }
  return [];
}
