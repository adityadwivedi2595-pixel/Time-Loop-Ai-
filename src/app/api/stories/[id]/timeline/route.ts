import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(req);
    const story = await DataStore.getStoryById(params.id, user.id);
    if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 });

    const url = new URL(req.url);
    const branchId = url.searchParams.get('branchId') || 'main';

    const state = await DataStore.getTimelineState(params.id, branchId);
    return NextResponse.json({
      story,
      branchId,
      timelineState: state,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
