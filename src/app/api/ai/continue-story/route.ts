import { NextRequest, NextResponse } from 'next/server';
import { TimelineEngine } from '@/lib/engine/timeline-engine';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { checkRateLimit } from '@/lib/utils/security';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const rate = checkRateLimit(`continue-story:${user.id}`, 30);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Rate limit reached. Please wait.' }, { status: 429 });
    }

    const body = await req.json();
    const { storyId, sceneId, choiceId, branchId } = body;

    if (!storyId || !sceneId || !choiceId) {
      return NextResponse.json({ error: 'storyId, sceneId, and choiceId are required' }, { status: 400 });
    }

    const result = await TimelineEngine.processDecision({
      userId: user.id,
      storyId,
      sceneId,
      choiceId,
      branchId,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('continue-story error:', err);
    return NextResponse.json({ error: err.message || 'Failed to continue story' }, { status: 500 });
  }
}
