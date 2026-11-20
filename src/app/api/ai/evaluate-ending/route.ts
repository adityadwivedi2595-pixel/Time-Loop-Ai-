import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';
import { EndingEngine, ENDING_DEFINITIONS } from '@/lib/engine/ending-engine';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const { storyId, branchId = 'main' } = await req.json();

    const story = await DataStore.getStoryById(storyId, user.id);
    if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 });

    const state = await DataStore.getTimelineState(storyId, branchId);
    if (!state) return NextResponse.json({ error: 'Timeline state not found' }, { status: 404 });

    const eligibleTypes = EndingEngine.evaluateEligibleEndings(state);
    const eligibleDetails = eligibleTypes.map((type) => ENDING_DEFINITIONS[type]);

    return NextResponse.json({
      eligibleTypes,
      endings: eligibleDetails,
      timelineState: state,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
