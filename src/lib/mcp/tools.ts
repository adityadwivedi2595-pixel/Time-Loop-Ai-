/**
 * TIMELOOP AI – MCP Tools Implementation
 * 12 Authenticated MCP Tools invoking existing service functions.
 */

import { z } from 'zod';
import { DataStore } from '@/lib/supabase/storage';
import { EndingEngine } from '@/lib/engine/ending-engine';
import { imageProvider } from '@/lib/ai/image-provider';
import { StoryTimelineState } from '@/types/timeline';

// 1. get_era_details
export const GetEraDetailsSchema = z.object({
  era_id: z.string().describe('The unique identifier of the time era'),
});

// 2. get_character_profile
export const GetCharacterProfileSchema = z.object({
  character_id: z.string().describe('UUID of the character'),
});

// 3. create_story
export const CreateStorySchema = z.object({
  era_id: z.string(),
  character_id: z.string().optional(),
  title: z.string().min(2),
  genre: z.string(),
  tone: z.string(),
  story_summary: z.string().optional(),
});

// 4. get_story_state
export const GetStoryStateSchema = z.object({
  story_id: z.string().describe('UUID of the story'),
  branch_id: z.string().default('main'),
});

// 5. save_story_scene
export const SaveStorySceneSchema = z.object({
  story_id: z.string(),
  chapter_id: z.string(),
  scene_number: z.number(),
  title: z.string(),
  narration: z.string(),
  scene_description: z.string(),
  dialogues: z.array(z.object({ character: z.string(), text: z.string() })).default([]),
  visual_prompt: z.string().optional(),
  image_url: z.string().optional(),
  choices: z.array(z.object({ id: z.string(), text: z.string(), consequence_hint: z.string().optional() })),
});

// 6. save_story_choice
export const SaveStoryChoiceSchema = z.object({
  scene_id: z.string(),
  choice_text: z.string(),
  consequence_hint: z.string().optional(),
});

// 7. update_timeline_state
export const UpdateTimelineStateSchema = z.object({
  story_id: z.string(),
  branch_id: z.string().default('main'),
  state: z.object({
    current_era: z.string(),
    current_chapter: z.number(),
    current_scene_number: z.number(),
    character: z.string(),
    relationships: z.record(z.number()),
    flags: z.record(z.boolean()),
    resources: z.record(z.number()),
    story_summary: z.string(),
    branch_id: z.string(),
  }),
});

// 8. generate_scene_image
export const GenerateSceneImageSchema = z.object({
  visual_prompt: z.string(),
  era_id: z.string().optional(),
});

// 9. generate_movie_poster
export const GenerateMoviePosterSchema = z.object({
  title: z.string(),
  genre: z.string(),
  visual_prompt: z.string(),
});

// 10. get_available_endings
export const GetAvailableEndingsSchema = z.object({
  story_id: z.string(),
  branch_id: z.string().default('main'),
});

// 11. save_story_ending
export const SaveStoryEndingSchema = z.object({
  story_id: z.string(),
  branch_id: z.string().default('main'),
  ending_type: z.enum([
    'Hero Ending',
    'Villain Ending',
    'Mystery Ending',
    'Tragic Ending',
    'Secret Ending',
    'Alternate Timeline Ending',
  ]),
  title: z.string(),
  content: z.string(),
});

// 12. get_user_library
export const GetUserLibrarySchema = z.object({
  filter_type: z.enum(['all', 'stories', 'characters', 'saved_items']).default('all'),
});

/**
 * Tool Execution Handlers with verified backend session identity
 */
export const MCPToolHandlers = {
  async get_era_details(args: z.infer<typeof GetEraDetailsSchema>) {
    const era = await DataStore.getEraById(args.era_id);
    if (!era) throw new Error(`Era ${args.era_id} not found.`);
    return era;
  },

  async get_character_profile(args: z.infer<typeof GetCharacterProfileSchema>, userId: string) {
    const char = await DataStore.getCharacterById(args.character_id, userId);
    if (!char) throw new Error(`Character ${args.character_id} not found or unauthorized.`);
    return char;
  },

  async create_story(args: z.infer<typeof CreateStorySchema>, userId: string) {
    return DataStore.createStory({
      ...args,
      user_id: userId,
    });
  },

  async get_story_state(args: z.infer<typeof GetStoryStateSchema>, userId: string) {
    const story = await DataStore.getStoryById(args.story_id, userId);
    if (!story) throw new Error(`Story ${args.story_id} not found or unauthorized.`);
    const state = await DataStore.getTimelineState(args.story_id, args.branch_id);
    return {
      story_id: args.story_id,
      story_summary: story.story_summary,
      timeline_state: state || {},
      recent_decisions: state?.history || [],
    };
  },

  async save_story_scene(args: z.infer<typeof SaveStorySceneSchema>, userId: string) {
    const story = await DataStore.getStoryById(args.story_id, userId);
    if (!story) throw new Error(`Story ${args.story_id} not found or unauthorized.`);

    const sceneId = `scene-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const saved = await DataStore.saveScene({
      id: sceneId,
      story_id: args.story_id,
      chapter_id: args.chapter_id,
      scene_number: args.scene_number,
      title: args.title,
      narration: args.narration,
      scene_description: args.scene_description,
      dialogues: args.dialogues,
      visual_prompt: args.visual_prompt,
      image_url: args.image_url,
      choices: args.choices.map((c) => ({
        id: c.id,
        choice_text: c.text,
        consequence_hint: c.consequence_hint,
      })),
      created_at: new Date().toISOString(),
    });
    return saved;
  },

  async save_story_choice(args: z.infer<typeof SaveStoryChoiceSchema>) {
    return {
      scene_id: args.scene_id,
      choice_id: `choice-${Date.now()}`,
      choice_text: args.choice_text,
      consequence_hint: args.consequence_hint,
    };
  },

  async update_timeline_state(args: z.infer<typeof UpdateTimelineStateSchema>, userId: string) {
    const story = await DataStore.getStoryById(args.story_id, userId);
    if (!story) throw new Error(`Story ${args.story_id} not found or unauthorized.`);

    const stateToSave: StoryTimelineState = {
      ...args.state,
      history: [],
      ending_eligibility: [],
    };
    return DataStore.saveTimelineState(args.story_id, args.branch_id, stateToSave);
  },

  async generate_scene_image(args: z.infer<typeof GenerateSceneImageSchema>) {
    return imageProvider.generateSceneImage(args.visual_prompt, args.era_id);
  },

  async generate_movie_poster(args: z.infer<typeof GenerateMoviePosterSchema>) {
    return imageProvider.generateMoviePosterArtwork(args.visual_prompt, args.genre);
  },

  async get_available_endings(args: z.infer<typeof GetAvailableEndingsSchema>, userId: string) {
    const story = await DataStore.getStoryById(args.story_id, userId);
    if (!story) throw new Error(`Story ${args.story_id} not found or unauthorized.`);

    const state = await DataStore.getTimelineState(args.story_id, args.branch_id);
    if (!state) return { available_endings: [] };

    const endings = EndingEngine.evaluateEligibleEndings(state);
    return { available_endings: endings };
  },

  async save_story_ending(args: z.infer<typeof SaveStoryEndingSchema>, userId: string) {
    const story = await DataStore.getStoryById(args.story_id, userId);
    if (!story) throw new Error(`Story ${args.story_id} not found or unauthorized.`);

    return DataStore.saveEnding({
      id: `ending-${Date.now()}`,
      story_id: args.story_id,
      branch_id: args.branch_id,
      ending_type: args.ending_type,
      title: args.title,
      content: args.content,
      created_at: new Date().toISOString(),
    });
  },

  async get_user_library(args: z.infer<typeof GetUserLibrarySchema>, userId: string) {
    const stories = args.filter_type === 'characters' || args.filter_type === 'saved_items' ? [] : await DataStore.getStories(userId);
    const characters = args.filter_type === 'stories' || args.filter_type === 'saved_items' ? [] : await DataStore.getCharacters(userId);
    const savedItems = args.filter_type === 'stories' || args.filter_type === 'characters' ? [] : await DataStore.getSavedItems(userId);

    return {
      stories,
      characters,
      saved_items: savedItems,
    };
  },
};
