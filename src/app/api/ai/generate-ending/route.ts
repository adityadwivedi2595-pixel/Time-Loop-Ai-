import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { DataStore } from '@/lib/supabase/storage';
import { aiModelProvider } from '@/lib/ai/model-provider';
import { EndingEngine } from '@/lib/engine/ending-engine';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const { storyId, branchId = 'main', endingType } = await req.json();

    const story = await DataStore.getStoryById(storyId, user.id);
    if (!story) return NextResponse.json({ error: 'Story not found' }, { status: 404 });

    const state = await DataStore.getTimelineState(storyId, branchId);
    if (!state) return NextResponse.json({ error: 'Timeline state not found' }, { status: 404 });

    // Validate ending eligibility in backend
    const eligible = EndingEngine.evaluateEligibleEndings(state);
    if (!eligible.includes(endingType)) {
      return NextResponse.json({
        error: `Ending '${endingType}' is not yet unlocked based on current timeline state.`,
        eligibleEndings: eligible,
      }, { status: 403 });
    }

    // Generate Ending Epilogue via NVIDIA NIM
    const generated = await aiModelProvider.generateEnding({
      storyTitle: story.title,
      endingType,
      summary: state.story_summary,
      characterState: {
        character: state.character,
        relationships: state.relationships,
        flags: state.flags,
        resources: state.resources,
      },
    });

    // Persist Ending
    const saved = await DataStore.saveEnding({
      id: `ending-${Date.now()}`,
      story_id: storyId,
      branch_id: branchId,
      ending_type: endingType,
      title: generated.title,
      content: generated.epilogue,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      ending: saved,
      details: generated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
