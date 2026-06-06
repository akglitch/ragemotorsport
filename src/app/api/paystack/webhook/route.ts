import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.warn('Webhook received but PAYSTACK_SECRET_KEY is not set');
      return NextResponse.json({ ok: true });
    }

    // Verify Paystack signature
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const userId = event.data.metadata?.user_id;

      if (userId) {
        // Use service role to bypass RLS and update the profile
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Needs to be added to .env.local
        
        if (supabaseServiceKey) {
          const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
          
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({ is_premium: true })
            .eq('id', userId);
            
          if (error) {
            console.error('Failed to update user premium status:', error);
          }
        } else {
          console.error('SUPABASE_SERVICE_ROLE_KEY is missing. Cannot update premium status.');
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Paystack webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
