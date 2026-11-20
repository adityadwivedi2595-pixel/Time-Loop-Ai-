export interface TimelineDecision {
  scene_id: string;
  choice_id: string;
  choice_text: string;
  timestamp: string;
  branch_id: string;
}

export interface StoryTimelineState {
  current_era: string;
  current_chapter: number;
  current_scene_number: number;
  character: string;
  relationships: Record<string, number>; // e.g. king: 70, rival: 30
  flags: Record<string, boolean>;         // e.g. accepted_mission: true
  resources: Record<string, number>;     // e.g. influence: 20, reputation: 50
  story_summary: string;
  branch_id: string;
  history: TimelineDecision[];
  ending_eligibility?: string[];
}

export interface TimelineStateRecord {
  id: string;
  story_id: string;
  branch_id: string;
  version: number;
  state_json: StoryTimelineState;
  created_at: string;
}

export interface TimelineNode {
  id: string;
  scene_id: string;
  title: string;
  chapter: number;
  branch_id: string;
  is_current: boolean;
  is_checkpoint: boolean;
  choice_taken?: string;
  state_snapshot?: {
    relationships: Record<string, number>;
    flags: Record<string, boolean>;
    resources: Record<string, number>;
  };
}
