import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export const runtime = 'nodejs';

/** Temporary debug route — DELETE after fixing. Visit /api/debug-cars to test. */
export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('cars').select('id, make, model, year').limit(10);

  return NextResponse.json({
    ok: !error,
    count: data?.length ?? 0,
    rows: data ?? [],
    error: error ? { message: error.message, code: error.code, details: error.details } : null,
    env: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'MISSING',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'MISSING',
      publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? 'set' : 'MISSING',
    },
  });
}
