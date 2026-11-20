export type EraClassification = 'historical' | 'fictional';

export interface TimeEra {
  id: string;
  name: string;
  description: string;
  classification: EraClassification;
  cover_image: string;
  suggested_genres: string[];
  suggested_roles: string[];
  world_building: string;
  prompt_context: string;
  created_at?: string;
}
