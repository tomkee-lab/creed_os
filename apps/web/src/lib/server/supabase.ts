import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import pg from 'pg';
const { Pool } = pg;

const supabaseUrl = env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  env.PUBLIC_SUPABASE_ANON_KEY ||
  process.env.PUBLIC_SUPABASE_ANON_KEY ||
  '';

const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL || '';

let cachedClient: SupabaseClient | null = null;
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
  return Boolean((dbPool !== null) || (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')));
}

export function getDbPool(): pg.Pool | null {
  return dbPool;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
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

