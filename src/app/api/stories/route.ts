import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const stories = await DataStore.getStories(user.id);
    return NextResponse.json({ stories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const body = await req.json();
    const created = await DataStore.createStory({
      ...body,
      user_id: user.id,
    });
    return NextResponse.json({ story: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
