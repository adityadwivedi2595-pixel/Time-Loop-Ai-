import { describe, it, expect } from 'vitest';
import {
  CharacterProfileSchema,
  StoryPlanningSchema,
  SceneOutputSchema,
  AlternateTimelineSchema,
  MoviePosterPromptSchema,
} from '@/lib/ai/prompts';

describe('AI Structured Prompts & Zod Validation', () => {
  it('validates a correct CharacterProfile object', () => {
    const valid = {
      name: 'Maya Lin',
      role: 'Scientist',
      personality: ['Analytical', 'Tenacious'],
      appearance: 'Sleek silver hair, lab coat lined with quantum sensors.',
      backstory: 'Lead temporal physicist at the Cavorite Array before reality shifted.',
      abilities: ['Quantum Flux Calculation'],
      strengths: ['Spatial memory'],
      weaknesses: ['Obsessive curiosity'],
      motivations: ['Stabilize the anchor'],
      visual_prompt: 'Cybernetic scientist standing before a glowing temporal particle accelerator.',
    };
    expect(() => CharacterProfileSchema.parse(valid)).not.toThrow();
  });

  it('rejects CharacterProfile missing required fields', () => {
    const invalid = { name: 'X' };
    expect(() => CharacterProfileSchema.parse(invalid)).toThrow();
  });

  it('validates a complete SceneOutput object', () => {
    const validScene = {
      scene_title: 'The Obsidian Crypt',
      narration: 'Cold stone walls echo with ancient chants. You step across the threshold.',
      dialogues: [{ character: 'Guardian', text: 'Halt, wanderer.' }],
      scene_description: 'An ancient crypt beneath the pyramid.',
      visual_prompt: 'Dark obsidian crypt lit by blue fire braziers, cinematic lighting',
      choices: [
        { id: 'c1', text: 'Speak the secret cipher', consequence_hint: 'Opens door safely' },
        { id: 'c2', text: 'Draw your blade and strike', consequence_hint: 'Initiates combat' },
      ],
      state_changes: {
        relationships: { Guardian: -10 },
        flags: { entered_crypt: true },
        resources: { temporal_charge: -5 },
      },
      next_chapter: false,
      ending_candidate: null,
    };
    expect(() => SceneOutputSchema.parse(validScene)).not.toThrow();
  });

  it('validates What If Universe alternate timeline schema', () => {
    const validWhatIf = {
      divergence_title: 'The Solar Pharaohs',
      alternate_world: 'Ancient Egyptians discover solar photovoltaic glass in 2500 BCE, revolutionizing irrigation and celestial navigation.',
      timeline_events: [
        '2500 BCE: Solar obelisks powered across the Nile',
        '2300 BCE: First desert electric transit network created',
        '2000 BCE: Heliopolis becomes the global epicenter of clean energy',
      ],
      main_characters: ['Imhotep the Electrician', 'Queen Hatshepsut'],
      major_conflicts: [
        'Priests of Ra oppose solar grid decentralization',
        'Rival empires covet the quartz crystal battery designs',
      ],
      story_chapters: ['Chapter 1: The First Spark', 'Chapter 2: The Solar Revolt', 'Chapter 3: Dawn'],
      consequences: [
        'Desert civilizations flourish with clean solar energy millenia early',
        'Global ecology is preserved with sustainable quartz-based technology',
      ],
      possible_endings: ['The Solar Hegemony', 'The Eclipse of Thebes'],
    };
    expect(() => AlternateTimelineSchema.parse(validWhatIf)).not.toThrow();
  });
});
