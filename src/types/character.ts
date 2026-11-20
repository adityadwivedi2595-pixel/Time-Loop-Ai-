export type CharacterRole =
  | 'Warrior'
  | 'King'
  | 'Queen'
  | 'Detective'
  | 'Scientist'
  | 'Explorer'
  | 'Villain'
  | 'Hero'
  | 'Time Traveller';

export interface CharacterProfile {
  id?: string;
  user_id?: string;
  name: string;
  role: CharacterRole | string;
  personality: string[];
  appearance: string;
  backstory: string;
  abilities: string[];
  strengths: string[];
  weaknesses: string[];
  motivations: string[];
  visual_prompt?: string;
  image_url?: string;
  created_at?: string;
}
