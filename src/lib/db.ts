import { neon } from '@neondatabase/serverless';

// Lazy initialization — neon() throws at import time if DATABASE_URL is missing,
// which breaks Next.js build-time static analysis on Cloudflare Pages.
let _db: ReturnType<typeof neon> | null = null;
function getDb() {
  if (!_db) _db = neon(process.env.DATABASE_URL!, { fetchOptions: { cache: 'no-store' } });
  return _db;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sql: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, any>[]> =
  (strings, ...values) => getDb()(strings, ...values) as Promise<Record<string, any>[]>;
