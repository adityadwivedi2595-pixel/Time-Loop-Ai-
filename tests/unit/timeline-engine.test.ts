import { describe, it, expect, beforeEach } from 'vitest';
import { TimelineEngine } from '@/lib/engine/timeline-engine';
import { DataStore } from '@/lib/supabase/storage';

describe('Living Timeline Engine', () => {
  const testUserId = '00000000-0000-0000-0000-000000000001';
  let testStoryId: string;
  let testSceneId: string;

  beforeEach(async () => {
    const story = await DataStore.createStory({
      user_id: testUserId,
      era_id: 'ancient-india',
      title: 'The Sindhu Paradox',
      genre: 'Adventure',
      tone: 'Cinematic & Gritty',
      story_summary: 'Anomalous brass sphere found near the imperial fort.',
    });
    testStoryId = story.id;

    const scene = await DataStore.saveScene({
      id: `scene-test-${Date.now()}`,
      story_id: testStoryId,
      chapter_id: 'chap-1',
      scene_number: 1,
      title: 'Riverside Dawn',
      narration: 'The river ripples with blue light.',
      dialogues: [],
      scene_description: 'An ancient river bank.',
      choices: [
        { id: 'c1', choice_text: 'Inspect the glowing artifact.' },
        { id: 'c2', choice_text: 'Alert the imperial sentries.' },
      ],
      created_at: new Date().toISOString(),
    });
    testSceneId = scene.id;

    await DataStore.saveTimelineState(testStoryId, 'main', {
      current_era: 'ancient-india',
      current_chapter: 1,
      current_scene_number: 1,
      character: 'Arjun Thorne',
      relationships: { 'Royal Guard': 50 },
      flags: { artifact_found: true },
      resources: { influence: 20, reputation: 50 },
      story_summary: 'Initiation by the river.',
      branch_id: 'main',
      history: [],
      ending_eligibility: [],
    });
  });

  it('processes choice decision and transitions timeline state', async () => {
    const result = await TimelineEngine.processDecision({
      userId: testUserId,
      storyId: testStoryId,
      sceneId: testSceneId,
      choiceId: 'c1',
      branchId: 'main',
    });

    expect(result.nextScene).toBeDefined();
    expect(result.nextScene.title).toBeDefined();
    expect(result.updatedState.current_scene_number).toBe(2);
    expect(result.updatedState.history.length).toBe(1);
    expect(result.updatedState.history[0].choice_id).toBe('c1');
    expect(result.isBranchForked).toBe(false);
  });

  it('rejects decisions for unauthorized stories', async () => {
    await expect(
      TimelineEngine.processDecision({
        userId: 'unauthorized-user-999',
        storyId: testStoryId,
        sceneId: testSceneId,
        choiceId: 'c1',
      })
    ).rejects.toThrow(/Unauthorized or non-existent story/);
  });

  it('rejects choices that do not belong to the scene', async () => {
    await expect(
      TimelineEngine.processDecision({
        userId: testUserId,
        storyId: testStoryId,
        sceneId: testSceneId,
        choiceId: 'non-existent-choice',
      })
    ).rejects.toThrow(/does not exist in scene/);
  });
});
