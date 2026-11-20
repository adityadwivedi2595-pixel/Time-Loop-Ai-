import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(req);
    const story = await DataStore.getStoryById(params.id, user.id);
    if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    return NextResponse.json({ story });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
