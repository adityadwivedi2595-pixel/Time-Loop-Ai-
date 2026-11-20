import { NextRequest, NextResponse } from 'next/server';
import { aiModelProvider } from '@/lib/ai/model-provider';
import { getAuthenticatedUser } from '@/lib/supabase/auth-helper';
import { checkRateLimit, sanitizePromptInput } from '@/lib/utils/security';
import { DataStore } from '@/lib/supabase/storage';
import { StoryScene, StoryChapter } from '@/types/story';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const rate = checkRateLimit(`gen-story:${user.id}`, 15);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await req.json();
    const eraId = sanitizePromptInput(body.eraId || 'ancient-india');
    const characterId = body.characterId;
    const genre = sanitizePromptInput(body.genre || 'Adventure');
    const tone = sanitizePromptInput(body.tone || 'Cinematic & Gritty');
    const customInstructions = sanitizePromptInput(body.customInstructions || '');

    const era = await DataStore.getEraById(eraId);
    if (!era) return NextResponse.json({ error: 'Era not found' }, { status: 404 });

    let character = characterId ? await DataStore.getCharacterById(characterId, user.id) : null;
    if (!character) {
      // Default protagonist if none passed
      character = {
        name: 'Arjun Thorne',
        role: 'Time Traveller',
        personality: ['Resilient', 'Strategic'],
        appearance: 'Sharp eyes, weathered longcoat with chronal fiber.',
        backstory: 'A displaced temporal explorer.',
        abilities: ['Temporal Flux Perception'],
        strengths: ['Tactical calm'],
        weaknesses: ['Chrono-instability'],
        motivations: ['Safeguard the prime timeline'],
      };
    }

    // 1. Generate Story Plan via NVIDIA NIM
    const plan = await aiModelProvider.generateStory({
      eraName: era.name,
      eraContext: era.world_building,
      character,
      genre,
      tone,
      customInstructions,
    });

    // 2. Persist Story Record
    const story = await DataStore.createStory({
      user_id: user.id,
      character_id: character.id,
      era_id: eraId,
      title: plan.title,
      tagline: plan.tagline,
      genre,
      tone,
      story_summary: plan.story_summary,
    });

    // 3. Persist Chapter 1
    const chapterId = `chap-${Date.now()}`;
    const chapter: StoryChapter = {
      id: chapterId,
      story_id: story.id,
      chapter_number: 1,
      title: plan.chapter_outline[0] || 'Chapter 1: The Awakening',
      content: plan.opening_scene,
      created_at: new Date().toISOString(),
    };

    // 4. Generate Opening Scene
    const sceneId = `scene-${Date.now()}`;
    const openingScene: StoryScene = {
      id: sceneId,
      story_id: story.id,
      chapter_id: chapterId,
      scene_number: 1,
      title: `${plan.title} – Prologue`,
      narration: plan.opening_scene,
      dialogues: plan.character_dialogues || [],
      scene_description: plan.world_setting,
      visual_prompt: `Cinematic concept art of ${plan.world_setting}, dramatic lighting, 8k resolution`,
      image_url: era.cover_image,
      choices: [
        {
          id: 'c1',
          choice_text: `Confront the immediate danger head-on and make your presence known.`,
          consequence_hint: 'High risk, immediate respect, draws enemy attention.',
        },
        {
          id: 'c2',
          choice_text: `Seek out the local authorities and offer strategic counsel.`,
          consequence_hint: 'Builds influence, entangles in political alliances.',
        },
        {
          id: 'c3',
          choice_text: `Mantle into the shadows to gather clandestine intel first.`,
          consequence_hint: 'High stealth, reveals secrets, delays direct action.',
        },
      ],
      created_at: new Date().toISOString(),
    };

    await DataStore.saveScene(openingScene);

    // 5. Initialize Timeline State
    await DataStore.saveTimelineState(story.id, 'main', {
      current_era: eraId,
      current_chapter: 1,
      current_scene_number: 1,
      character: character.name,
      relationships: plan.initial_timeline_state?.relationships || { 'Local Commander': 50 },
      flags: plan.initial_timeline_state?.flags || { story_started: true },
      resources: plan.initial_timeline_state?.resources || { influence: 20, reputation: 50 },
      story_summary: plan.story_summary,
      branch_id: 'main',
      history: [],
      ending_eligibility: ['Mystery Ending'],
    });

    return NextResponse.json({
      story,
      chapter,
      scene: openingScene,
      plan,
    });
  } catch (err: any) {
    console.error('generate-story error:', err);
    return NextResponse.json({ error: err.message || 'Failed to plan story' }, { status: 500 });
  }
}
