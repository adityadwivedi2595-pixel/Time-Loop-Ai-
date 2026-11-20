export type EndingType =
  | 'Hero Ending'
  | 'Villain Ending'
  | 'Mystery Ending'
  | 'Tragic Ending'
  | 'Secret Ending'
  | 'Alternate Timeline Ending';

export interface EndingDefinition {
  type: EndingType;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Secret';
  required_conditions: {
    min_chapter: number;
    required_flags?: string[];
    forbidden_flags?: string[];
    min_relationships?: Record<string, number>;
    min_resources?: Record<string, number>;
  };
}

export interface StoryEndingRecord {
  id: string;
  story_id: string;
  branch_id: string;
  ending_type: EndingType;
  title: string;
  content: string;
  created_at: string;
}
