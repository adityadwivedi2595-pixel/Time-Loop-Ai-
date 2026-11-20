/**
 * TIMELOOP AI – Dedicated Prompt Engineering & Zod Schemas
 * Strictly formatted for NVIDIA NIM with Zod runtime validation.
 */

import { z } from 'zod';

// 1. CHARACTER SCHEMA
export const CharacterProfileSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  personality: z.array(z.string()).min(2),
  appearance: z.string().min(10),
  backstory: z.string().min(20),
  abilities: z.array(z.string()).min(1),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  motivations: z.array(z.string()).min(1),
  visual_prompt: z.string().min(10),
});
export type CharacterProfileOutput = z.infer<typeof CharacterProfileSchema>;

// 2. STORY PLANNING SCHEMA
export const StoryPlanningSchema = z.object({
  title: z.string().min(3),
  tagline: z.string().min(5),
  story_description: z.string().min(20),
  world_setting: z.string().min(20),
  opening_scene: z.string().min(20),
  main_conflict: z.string().min(20),
  supporting_characters: z.array(z.string()).min(2),
  important_locations: z.array(z.string()).min(2),
  main_objectives: z.array(z.string()).min(2),
  chapter_outline: z.array(z.string()).min(3),
  character_dialogues: z.array(
    z.object({
      character: z.string(),
      text: z.string(),
    })
  ).min(1),
  story_summary: z.string().min(15),
  initial_timeline_state: z.object({
    relationships: z.record(z.number()),
    flags: z.record(z.boolean()),
    resources: z.record(z.number()),
  }),
});
export type StoryPlanningOutput = z.infer<typeof StoryPlanningSchema>;

// 3. SCENE GENERATION SCHEMA
export const SceneOutputSchema = z.object({
  scene_title: z.string().min(2),
  narration: z.string().min(20),
  dialogues: z.array(
    z.object({
      character: z.string(),
      text: z.string(),
    })
  ).default([]),
  scene_description: z.string().min(15),
  visual_prompt: z.string().min(10),
  choices: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(5),
      consequence_hint: z.string().min(5),
    })
  ).min(2).max(4),
  state_changes: z.object({
    relationships: z.record(z.number()).default({}),
    flags: z.record(z.boolean()).default({}),
    resources: z.record(z.number()).default({}),
  }),
  next_chapter: z.boolean().default(false),
  ending_candidate: z.string().nullable().default(null),
});
export type SceneOutput = z.infer<typeof SceneOutputSchema>;

// 4. CHOICES SCHEMA
export const ChoicesOutputSchema = z.object({
  choices: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(5),
      consequence_hint: z.string().min(5),
      risk_level: z.enum(['low', 'medium', 'high']).default('medium'),
    })
  ).min(3),
});
export type ChoicesOutput = z.infer<typeof ChoicesOutputSchema>;

// 5. TIMELINE STATE UPDATE SCHEMA
export const TimelineStateUpdateSchema = z.object({
  story_summary_update: z.string().min(10),
  relationship_deltas: z.record(z.number()),
  flag_updates: z.record(z.boolean()),
  resource_deltas: z.record(z.number()),
  branch_name: z.string().optional(),
});
export type TimelineStateUpdate = z.infer<typeof TimelineStateUpdateSchema>;

// 6. WHAT IF / ALTERNATE TIMELINE SCHEMA
export const AlternateTimelineSchema = z.object({
  divergence_title: z.string().min(3),
  alternate_world: z.string().min(30),
  timeline_events: z.array(z.string()).min(3),
  main_characters: z.array(z.string()).min(2),
  major_conflicts: z.array(z.string()).min(2),
  story_chapters: z.array(z.string()).min(3),
  consequences: z.array(z.string()).min(2),
  possible_endings: z.array(z.string()).min(2),
});
export type AlternateTimelineOutput = z.infer<typeof AlternateTimelineSchema>;

// 7. ENDING GENERATION SCHEMA
export const EndingGenerationSchema = z.object({
  title: z.string().min(3),
  ending_type: z.enum([
    'Hero Ending',
    'Villain Ending',
    'Mystery Ending',
    'Tragic Ending',
    'Secret Ending',
    'Alternate Timeline Ending',
  ]),
  epilogue: z.string().min(50),
  character_fate: z.string().min(20),
  timeline_resonance: z.string().min(20),
  unlocked_achievements: z.array(z.string()).default([]),
});
export type EndingGenerationOutput = z.infer<typeof EndingGenerationSchema>;

// 8. IMAGE PROMPT GENERATION SCHEMA
export const ImagePromptSchema = z.object({
  positive_prompt: z.string().min(20),
  negative_prompt: z.string().default('low quality, blurry, distorted, watermark, signature'),
  art_style: z.string(),
  aspect_ratio: z.string().default('16:9'),
  lighting_mood: z.string(),
});
export type ImagePromptOutput = z.infer<typeof ImagePromptSchema>;

// 9. MOVIE POSTER PROMPT SCHEMA
export const MoviePosterPromptSchema = z.object({
  artwork_prompt: z.string().min(20),
  typography: z.object({
    suggested_title: z.string(),
    tagline: z.string(),
    billing_cast: z.array(z.string()),
    director_credit: z.string().default('A TIMELOOP AI ORIGINAL PRODUCTION'),
    font_vibe: z.string(),
  }),
  color_palette: z.array(z.string()),
});
export type MoviePosterPromptOutput = z.infer<typeof MoviePosterPromptSchema>;

// ==============================================================================
// PROMPT BUILDERS
// ==============================================================================

export const PromptTemplates = {
  characterGeneration(params: {
    eraName: string;
    role: string;
    customSeed?: string;
  }) {
    return [
      {
        role: 'system' as const,
        content: `You are the Master AI Character Studio Architect for TIMELOOP AI.
Generate a deeply rich, cinematic, multidimensional character tailored for the era "${params.eraName}".
Respond ONLY with valid JSON matching the exact schema. No markdown formatting outside the JSON object.
Ensure the visual_prompt is extremely vivid and suitable for photorealistic or cinematic concept art.`,
      },
      {
        role: 'user' as const,
        content: `Create a character profile for role "${params.role}".
Context instructions: ${params.customSeed || 'Create a captivating, high-stakes protagonist with distinct flaws and striking visual presence.'}
SCHEMA:
{
  "name": "string",
  "role": "${params.role}",
  "personality": ["string"],
  "appearance": "string",
  "backstory": "string",
  "abilities": ["string"],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "motivations": ["string"],
  "visual_prompt": "string"
}`,
      },
    ];
  },

  storyPlanning(params: {
    eraName: string;
    eraContext: string;
    character: Record<string, any>;
    genre: string;
    tone: string;
    customInstructions?: string;
  }) {
    return [
      {
        role: 'system' as const,
        content: `You are the Lead Narrative Architect for TIMELOOP AI – Entertainment Edition.
Design an original, cinematic interactive story masterplan.
Respond ONLY with valid JSON. Never hallucinate facts as historical truth; mark artistic dramatization clearly.
Ensure the story has high tension, distinct factions, and branching potential.`,
      },
      {
        role: 'user' as const,
        content: `Plan an interactive story in era "${params.eraName}".
Era lore: ${params.eraContext}
Protagonist: ${params.character.name} (${params.character.role}), Appearance: ${params.character.appearance}.
Genre: ${params.genre}
Tone: ${params.tone}
Custom notes: ${params.customInstructions || 'Create an gripping opening hook with meaningful moral stakes.'}

Required JSON schema:
{
  "title": "string",
  "tagline": "string",
  "story_description": "string",
  "world_setting": "string",
  "opening_scene": "string",
  "main_conflict": "string",
  "supporting_characters": ["string"],
  "important_locations": ["string"],
  "main_objectives": ["string"],
  "chapter_outline": ["string", "string", "string"],
  "character_dialogues": [{"character": "string", "text": "string"}],
  "story_summary": "string",
  "initial_timeline_state": {
    "relationships": {"CharacterName": 50},
    "flags": {"flag_key": false},
    "resources": {"influence": 20, "reputation": 50}
  }
}`,
      },
    ];
  },

  sceneGeneration(params: {
    eraName: string;
    characterName: string;
    currentChapter: number;
    sceneNumber: number;
    storySummary: string;
    currentState: Record<string, any>;
    previousDecision?: string;
  }) {
    return [
      {
        role: 'system' as const,
        content: `You are the Living Timeline Scene Director for TIMELOOP AI.
Generate the next interactive scene based on the user's latest decision and current timeline state.
Crucial:
1. Provide exactly 3 meaningful, non-trivial choices with consequence hints.
2. Provide state changes that mathematically reflect the consequences (relationships, flags, resources).
3. If this scene warrants a climax or ending, identify the ending candidate.
Respond ONLY with valid JSON.`,
      },
      {
        role: 'user' as const,
        content: `Era: ${params.eraName}
Protagonist: ${params.characterName}
Current Chapter: ${params.currentChapter}, Scene: ${params.sceneNumber}
Summary So Far: ${params.storySummary}
Current State: ${JSON.stringify(params.currentState)}
Previous Choice Taken: ${params.previousDecision || 'Initial arrival'}

Generate the next scene adhering strictly to this JSON format:
{
  "scene_title": "string",
  "narration": "string (vivid 2-3 paragraphs)",
  "dialogues": [{"character": "string", "text": "string"}],
  "scene_description": "string",
  "visual_prompt": "string (vivid description for artwork)",
  "choices": [
    {"id": "c1", "text": "string", "consequence_hint": "string"},
    {"id": "c2", "text": "string", "consequence_hint": "string"},
    {"id": "c3", "text": "string", "consequence_hint": "string"}
  ],
  "state_changes": {
    "relationships": {},
    "flags": {},
    "resources": {}
  },
  "next_chapter": false,
  "ending_candidate": null
}`,
      },
    ];
  },

  alternateTimeline(whatIfPrompt: string) {
    return [
      {
        role: 'system' as const,
        content: `You are the Chronos Alternate Timeline Engine.
Take the user's "What If" premise and calculate the divergent timeline consequences, ripple effects, key figures, and playable chapters.
Respond ONLY with valid JSON. Clearly treat alternate history as fictional speculation.`,
      },
      {
        role: 'user' as const,
        content: `What If Premise: "${whatIfPrompt}"
JSON Schema:
{
  "divergence_title": "string",
  "alternate_world": "string",
  "timeline_events": ["string"],
  "main_characters": ["string"],
  "major_conflicts": ["string"],
  "story_chapters": ["string"],
  "consequences": ["string"],
  "possible_endings": ["string"]
}`,
      },
    ];
  },

  posterPrompt(storyTitle: string, genre: string, eraName: string, character: string, tagline: string) {
    return [
      {
        role: 'system' as const,
        content: `You are an Award-Winning Hollywood Film Art Director designing a cinematic teaser poster prompt for TIMELOOP AI.
Generate the image artwork prompt (without embedded text, so typography can be cleanly overlaid) and typography guidelines.
Respond ONLY with valid JSON.`,
      },
      {
        role: 'user' as const,
        content: `Film Title: "${storyTitle}"
Genre: ${genre}
Era: ${eraName}
Lead Character: ${character}
Tagline: "${tagline}"

JSON Schema:
{
  "artwork_prompt": "string",
  "typography": {
    "suggested_title": "${storyTitle}",
    "tagline": "${tagline}",
    "billing_cast": ["string", "string"],
    "director_credit": "A TIMELOOP AI ORIGINAL PRODUCTION",
    "font_vibe": "string"
  },
  "color_palette": ["#hex", "#hex", "#hex"]
}`,
      },
    ];
  },
};
