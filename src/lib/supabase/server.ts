import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_KEY } from './client';

/**
 * Supabase client for Server Components / Route Handlers. Bridges Supabase's
 * session to Next's cookie store so auth is read on the server.
 *
 * Note: in this Next version `cookies()` is async — hence `await` here.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component without a writable cookie store —
            // safe to ignore when session refresh happens elsewhere (route handler).
          }
        },
      },
    },
  );
}
