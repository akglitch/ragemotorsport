import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client key.
 * Prefer the traditional anon key (eyJ…) for maximum RLS compatibility.
 * Fall back to the newer publishable key if only that is set.
 */
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

/**
 * Supabase client for use in the browser (Client Components). Reads the public
 * URL + anon/publishable key. Writes are still gated by RLS (authenticated
 * only) and the user's session cookie.
 */
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, SUPABASE_KEY);
}
