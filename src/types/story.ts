export type StoryGenre =
  | 'Adventure'
  | 'Mystery'
  | 'Thriller'
  | 'Horror'
  | 'Fantasy'
  | 'Science Fiction'
  | 'Action'
  | 'Romance';

export type StoryTone =
  | 'Cinematic & Gritty'
  | 'Epic & Mythological'
  | 'Dark & Suspenseful'
  | 'Witty & Adventurous'
  | 'Philosophical & Thought-Provoking';

export type StoryDifficulty = 'Normal' | 'Tactical' | 'Perilous';

export type StoryLength = 'Short Novella (3 Chapters)' | 'Standard Odyssey (5 Chapters)' | 'Epic Saga (8 Chapters)';

export interface StoryDialogue {
  character: string;
  text: string;
}

export interface StoryChoice {
  id: string;
  choice_text: string;
  consequence_hint?: string;
  choice_metadata?: {
    risk_level?: 'low' | 'medium' | 'high';
    required_stat?: string;
    target_faction?: string;
  };
}

export interface StoryScene {
  id: string;
  story_id: string;
  chapter_id: string;
  scene_number: number;
  title: string;
  narration: string;
  dialogues: StoryDialogue[];
  scene_description: string;
  visual_prompt?: string;
  image_url?: string;
  choices: StoryChoice[];
  created_at?: string;
}

export interface StoryChapter {
  id: string;
  story_id: string;
  chapter_number: number;
  title: string;
  content?: string;
  scenes?: StoryScene[];
  created_at?: string;
}

export interface Story {
  id: string;
  user_id: string;
  character_id?: string;
  era_id: string;
  title: string;
  tagline?: string;
  genre: StoryGenre | string;
  tone: StoryTone | string;
  status: 'active' | 'completed' | 'archived';
  story_summary: string;
  created_at: string;
  updated_at: string;
}
