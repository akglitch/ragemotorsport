import { createBrowserClient } from '@supabase/ssr';

/** Supabase client key — supports the newer publishable key or the legacy anon key. */
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

/**
 * Supabase client for use in the browser (Client Components). Reads the public
 * URL + publishable/anon key. Writes are still gated by RLS (authenticated
 * only) and the user's session cookie.
 */
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, SUPABASE_KEY);
}
