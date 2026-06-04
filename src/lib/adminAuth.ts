/**
 * Admin auth seam — a simple password gate for the demo.
 *
 * The password comes from NEXT_PUBLIC_ADMIN_PASSWORD (falls back to a dev
 * default). Access is remembered for the tab via sessionStorage.
 *
 * NOTE: this is NOT real security — NEXT_PUBLIC_* values ship to the browser.
 * TODO(supabase-auth): replace with Supabase Auth (email/password or magic link)
 * and protect the /admin routes with a server check / middleware.
 */

const SESSION_KEY = 'rage-admin-session';
const DEV_FALLBACK = 'rage-admin';

export function adminPassword(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || DEV_FALLBACK;
}

export function isAuthed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'ok';
  } catch {
    return false;
  }
}

/** Returns true on success. */
export function login(password: string): boolean {
  const ok = password === adminPassword();
  if (ok) {
    try {
      sessionStorage.setItem(SESSION_KEY, 'ok');
    } catch {}
  }
  return ok;
}

export function logout(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}
