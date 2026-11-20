/**
 * TIMELOOP AI – Living Timeline Engine
 * The central narrative state machine. Manages state transitions, branch forks,
 * choices, relationship mutations, and ensures backend authority.
 */

import { StoryTimelineState, TimelineDecision } from '@/types/timeline';
import { StoryScene, StoryChoice } from '@/types/story';
import { DataStore } from '@/lib/supabase/storage';
import { aiModelProvider } from '@/lib/ai/model-provider';
import { EndingEngine } from './ending-engine';

export class TimelineEngine {
  /**
   * Process a choice selection, evaluate state transitions, and generate the next scene
   */
  public static async processDecision(params: {
    userId: string;
    storyId: string;
    sceneId: string;
    choiceId: string;
    branchId?: string;
  }): Promise<{
    nextScene: StoryScene;
    updatedState: StoryTimelineState;
    eligibleEndings: string[];
    isBranchForked: boolean;
  }> {
    const { userId, storyId, sceneId, choiceId } = params;
    const branchId = params.branchId || 'main';

    // 1. Verify Story Ownership
    const story = await DataStore.getStoryById(storyId, userId);
    if (!story) {
      throw new Error(`Unauthorized or non-existent story: ${storyId}`);
    }

    // 2. Validate current scene
    const currentScene = await DataStore.getSceneById(sceneId);
    if (!currentScene) {
      throw new Error(`Scene not found: ${sceneId}`);
    }

    // 3. Validate choice belongs to scene
    const selectedChoice = currentScene.choices.find((c) => c.id === choiceId);
    if (!selectedChoice) {
      throw new Error(`Choice ${choiceId} does not exist in scene ${sceneId}`);
    }

    // 4. Load Current Timeline State
    let currentState = await DataStore.getTimelineState(storyId, branchId);
    if (!currentState) {
      // Initialize if missing
      currentState = {
        current_era: story.era_id,
        current_chapter: 1,
        current_scene_number: 1,
        character: 'The Protagonist',
        relationships: {},
        flags: {},
        resources: { influence: 20, reputation: 50, temporal_charge: 100 },
        story_summary: story.story_summary,
        branch_id: branchId,
        history: [],
      };
    }

    // Check if this decision is branching from a previous checkpoint
    let activeBranchId = branchId;
    let isBranchForked = false;
    const isPastDecisionPoint = currentState.history.some(
      (h) => h.scene_id === sceneId && h.choice_id !== choiceId
    );

    if (isPastDecisionPoint) {
      // Fork into a new alternate branch!
      activeBranchId = `branch-${Date.now().toString(36)}`;
      isBranchForked = true;
      currentState = {
        ...currentState,
        branch_id: activeBranchId,
        flags: { ...currentState.flags, timeline_diverged: true },
      };
    }

    // 5. Query Model Provider for Next Scene Narrative & Proposed State Changes
    const era = await DataStore.getEraById(story.era_id);
    const eraName = era ? era.name : story.era_id;

    const nextSceneNumber = currentState.current_scene_number + 1;
    const shouldAdvanceChapter = nextSceneNumber > 3;
    const nextChapterNumber = shouldAdvanceChapter ? currentState.current_chapter + 1 : currentState.current_chapter;

    const generatedSceneOutput = await aiModelProvider.continueStory({
      eraName,
      characterName: currentState.character,
      currentChapter: nextChapterNumber,
      sceneNumber: nextSceneNumber,
      storySummary: currentState.story_summary,
      currentState: {
        relationships: currentState.relationships,
        flags: currentState.flags,
        resources: currentState.resources,
      },
      decisionText: selectedChoice.choice_text,
    });

    // 6. Backend Authority: Apply and clamp state changes
    const updatedRelationships = { ...currentState.relationships };
    if (generatedSceneOutput.state_changes?.relationships) {
      for (const [char, delta] of Object.entries(generatedSceneOutput.state_changes.relationships)) {
        const currentVal = updatedRelationships[char] ?? 50;
        updatedRelationships[char] = Math.max(0, Math.min(100, currentVal + delta));
      }
    }

    const updatedFlags = { ...currentState.flags };
    if (generatedSceneOutput.state_changes?.flags) {
      for (const [key, val] of Object.entries(generatedSceneOutput.state_changes.flags)) {
        // Enforce safe keys
        if (/^[a-zA-Z0-9_-]{2,50}$/.test(key)) {
          updatedFlags[key] = Boolean(val);
        }
      }
    }

    const updatedResources = { ...currentState.resources };
    if (generatedSceneOutput.state_changes?.resources) {
      for (const [res, delta] of Object.entries(generatedSceneOutput.state_changes.resources)) {
        const currentVal = updatedResources[res] ?? 50;
        updatedResources[res] = Math.max(0, Math.min(100, currentVal + delta));
      }
    }

    // Record decision in history
    const decisionRecord: TimelineDecision = {
      scene_id: sceneId,
      choice_id: choiceId,
      choice_text: selectedChoice.choice_text,
      timestamp: new Date().toISOString(),
      branch_id: activeBranchId,
    };

    const newHistory = [...currentState.history, decisionRecord];

    // Build updated timeline state
    const updatedState: StoryTimelineState = {
      current_era: story.era_id,
      current_chapter: nextChapterNumber,
      current_scene_number: nextSceneNumber,
      character: currentState.character,
      relationships: updatedRelationships,
      flags: updatedFlags,
      resources: updatedResources,
      story_summary: `${currentState.story_summary} Decided: "${selectedChoice.choice_text}". ${generatedSceneOutput.narration.slice(0, 150)}...`,
      branch_id: activeBranchId,
      history: newHistory,
      ending_eligibility: [],
    };

    // Evaluate Ending Eligibility
    const eligibleEndings = EndingEngine.evaluateEligibleEndings(updatedState);
    updatedState.ending_eligibility = eligibleEndings;

    // 7. Persist New Scene and Updated State
    const newSceneId = `scene-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newScene: StoryScene = {
      id: newSceneId,
      story_id: storyId,
      chapter_id: `chap-${nextChapterNumber}`,
      scene_number: nextSceneNumber,
      title: generatedSceneOutput.scene_title,
      narration: generatedSceneOutput.narration,
      dialogues: generatedSceneOutput.dialogues || [],
      scene_description: generatedSceneOutput.scene_description,
      visual_prompt: generatedSceneOutput.visual_prompt,
      image_url: currentScene.image_url || era?.cover_image,
      choices: (generatedSceneOutput.choices || []).map((c, idx) => ({
        id: c.id || `c-${idx + 1}`,
        choice_text: c.text,
        consequence_hint: c.consequence_hint,
      })),
      created_at: new Date().toISOString(),
    };

    await DataStore.saveScene(newScene);
    await DataStore.saveTimelineState(storyId, activeBranchId, updatedState);

    return {
      nextScene: newScene,
      updatedState,
      eligibleEndings,
      isBranchForked,
    };
  }

  /**
   * Rewind to a previous decision checkpoint or branch
   */
  public static async rewindToCheckpoint(params: {
    userId: string;
    storyId: string;
    sceneId: string;
    branchId: string;
  }): Promise<{ scene: StoryScene; state: StoryTimelineState }> {
    const { userId, storyId, sceneId, branchId } = params;

    const story = await DataStore.getStoryById(storyId, userId);
    if (!story) throw new Error('Unauthorized or non-existent story');

    const targetScene = await DataStore.getSceneById(sceneId);
    if (!targetScene) throw new Error(`Checkpoint scene not found: ${sceneId}`);

    const state = await DataStore.getTimelineState(storyId, branchId);
    if (!state) throw new Error(`Timeline state for branch ${branchId} not found`);

    return { scene: targetScene, state };
  }
}
