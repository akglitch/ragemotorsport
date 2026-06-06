'use client';
import { createClient } from '@/lib/supabase/client';

/**
 * Admin auth — backed by Supabase Auth (email/password).
 *
 * Create the admin user once in the Supabase dashboard
 * (Authentication → Users → Add user). Writes to the `cars` table are enforced
 * server-side by RLS + the session, so this is real access control, not a demo
 * gate.
 */

export interface AuthResult {
  ok: boolean;
  error?: string;
}

/** True if there is a current Supabase session. */
export async function isAuthed(): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

/** The signed-in admin's email, if any. */
export async function currentEmail(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/** Subscribe to sign-in/out; returns an unsubscribe function. */
export function onAuthChange(cb: (authed: boolean) => void): () => void {
  const supabase = createClient();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(!!session);
  });
  return () => data.subscription.unsubscribe();
}
