import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { carToRow } from '@/lib/supabase/carMapper';
import { Car } from '@/lib/types';

export const runtime = 'nodejs';

/** Create or update an admin car. Requires an authenticated Supabase session. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  let car: Car;
  try {
    car = (await request.json()) as Car;
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }
  if (!car?.id || !car.make || !car.model) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('cars')
    .upsert(carToRow(car))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ row: data });
}
