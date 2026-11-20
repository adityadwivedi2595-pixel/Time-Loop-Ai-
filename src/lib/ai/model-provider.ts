/**
 * TIMELOOP AI – Model Provider Abstraction
 * Unified server-side AI interface delegating to NVIDIA NIM (Mistral Large 4 / Nemotron / Llama).
 */

import { nvidiaClient } from './nvidia-client';
import {
  PromptTemplates,
  CharacterProfileSchema,
  CharacterProfileOutput,
  StoryPlanningSchema,
  StoryPlanningOutput,
  SceneOutputSchema,
  SceneOutput,
  AlternateTimelineSchema,
  AlternateTimelineOutput,
  EndingGenerationSchema,
  EndingGenerationOutput,
  MoviePosterPromptSchema,
  MoviePosterPromptOutput,
} from './prompts';

export interface IModelProvider {
  generateCharacter(params: { eraName: string; role: string; customSeed?: string }): Promise<CharacterProfileOutput>;
  generateStory(params: {
    eraName: string;
    eraContext: string;
    character: Record<string, any>;
    genre: string;
    tone: string;
    customInstructions?: string;
  }): Promise<StoryPlanningOutput>;
  generateSceneNarrative(params: {
    eraName: string;
    characterName: string;
    currentChapter: number;
    sceneNumber: number;
    storySummary: string;
    currentState: Record<string, any>;
    previousDecision?: string;
  }): Promise<SceneOutput>;
  continueStory(params: {
    eraName: string;
    characterName: string;
    currentChapter: number;
    sceneNumber: number;
    storySummary: string;
    currentState: Record<string, any>;
    decisionText: string;
  }): Promise<SceneOutput>;
  generateAlternateTimeline(whatIfPrompt: string): Promise<AlternateTimelineOutput>;
  generateEnding(params: {
    storyTitle: string;
    endingType: string;
    summary: string;
    characterState: Record<string, any>;
  }): Promise<EndingGenerationOutput>;
  generatePosterPrompt(params: {
    storyTitle: string;
    genre: string;
    eraName: string;
    character: string;
    tagline: string;
  }): Promise<MoviePosterPromptOutput>;
}

export class NvidiaModelProvider implements IModelProvider {
  async generateCharacter(params: { eraName: string; role: string; customSeed?: string }): Promise<CharacterProfileOutput> {
    const messages = PromptTemplates.characterGeneration(params);
    return nvidiaClient.generateStructuredJson(messages, (raw) => CharacterProfileSchema.parse(raw));
  }

  async generateStory(params: {
    eraName: string;
    eraContext: string;
    character: Record<string, any>;
    genre: string;
    tone: string;
    customInstructions?: string;
  }): Promise<StoryPlanningOutput> {
    const messages = PromptTemplates.storyPlanning(params);
    return nvidiaClient.generateStructuredJson(messages, (raw) => StoryPlanningSchema.parse(raw));
  }

  async generateSceneNarrative(params: {
    eraName: string;
    characterName: string;
    currentChapter: number;
    sceneNumber: number;
    storySummary: string;
    currentState: Record<string, any>;
    previousDecision?: string;
  }): Promise<SceneOutput> {
    const messages = PromptTemplates.sceneGeneration(params);
    return nvidiaClient.generateStructuredJson(messages, (raw) => SceneOutputSchema.parse(raw));
  }

  async continueStory(params: {
    eraName: string;
    characterName: string;
    currentChapter: number;
    sceneNumber: number;
    storySummary: string;
    currentState: Record<string, any>;
    decisionText: string;
  }): Promise<SceneOutput> {
    return this.generateSceneNarrative({
      ...params,
      previousDecision: params.decisionText,
    });
  }

  async generateAlternateTimeline(whatIfPrompt: string): Promise<AlternateTimelineOutput> {
    const messages = PromptTemplates.alternateTimeline(whatIfPrompt);
    return nvidiaClient.generateStructuredJson(messages, (raw) => AlternateTimelineSchema.parse(raw));
  }

  async generateEnding(params: {
    storyTitle: string;
    endingType: string;
    summary: string;
    characterState: Record<string, any>;
  }): Promise<EndingGenerationOutput> {
    const messages = [
      {
        role: 'system' as const,
        content: `You are the Master Ending Author for TIMELOOP AI.
Generate the cinematic ending and epilogue for the story "${params.storyTitle}".
Ending Type: "${params.endingType}".
Respond ONLY with valid JSON matching the schema.`,
      },
      {
        role: 'user' as const,
        content: `Story Summary: ${params.summary}
Character State: ${JSON.stringify(params.characterState)}

JSON Schema:
{
  "title": "string",
  "ending_type": "${params.endingType}",
  "epilogue": "string (3 immersive paragraphs)",
  "character_fate": "string",
  "timeline_resonance": "string",
  "unlocked_achievements": ["string", "string"]
}`,
      },
    ];
    return nvidiaClient.generateStructuredJson(messages, (raw) => EndingGenerationSchema.parse(raw));
  }

  async generatePosterPrompt(params: {
    storyTitle: string;
    genre: string;
    eraName: string;
    character: string;
    tagline: string;
  }): Promise<MoviePosterPromptOutput> {
    const messages = PromptTemplates.posterPrompt(
      params.storyTitle,
      params.genre,
      params.eraName,
      params.character,
      params.tagline
    );
    return nvidiaClient.generateStructuredJson(messages, (raw) => MoviePosterPromptSchema.parse(raw));
  }
}

// Global Model Provider
export const aiModelProvider: IModelProvider = new NvidiaModelProvider();
