import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const body = await req.json();

    const saved = await DataStore.saveItem(user.id, {
      item_type: body.item_type || 'story',
      item_id: body.item_id,
      title: body.title,
      metadata: body.metadata || {},
    });

    return NextResponse.json({ savedItem: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
