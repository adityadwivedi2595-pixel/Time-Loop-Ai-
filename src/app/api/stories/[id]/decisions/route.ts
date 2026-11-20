import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { TimelineEngine } from '@/lib/engine/timeline-engine';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedUser(req);
    const { sceneId, choiceId, branchId } = await req.json();

    const result = await TimelineEngine.processDecision({
      userId: user.id,
      storyId: params.id,
      sceneId,
      choiceId,
      branchId,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
