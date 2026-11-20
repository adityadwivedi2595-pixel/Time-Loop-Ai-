import { describe, it, expect } from 'vitest';
import { EndingEngine, ENDING_DEFINITIONS } from '@/lib/engine/ending-engine';
import { StoryTimelineState } from '@/types/timeline';

describe('Ending Engine Eligibility Rules', () => {
  it('correctly evaluates Hero Ending when chapter >= 3 and hero flags exist', () => {
    const state: StoryTimelineState = {
      current_era: 'ancient-india',
      current_chapter: 3,
      current_scene_number: 6,
      character: 'Arjun Thorne',
      relationships: { 'Mauryan Emperor': 80 },
      flags: { prime_timeline_defended: true },
      resources: { reputation: 70, influence: 50 },
      story_summary: 'Defended the prime timeline with honor.',
      branch_id: 'main',
      history: [],
    };

    const endings = EndingEngine.evaluateEligibleEndings(state);
    expect(endings).toContain('Hero Ending');
    expect(endings).toContain('Mystery Ending');
  });

  it('correctly evaluates Villain Ending when influence >= 65 and villain flags exist', () => {
    const state: StoryTimelineState = {
      current_era: 'mughal-era',
      current_chapter: 3,
      current_scene_number: 7,
      character: 'Zephyr',
      relationships: { King: 10 },
      flags: { usurped_throne: true },
      resources: { influence: 85, reputation: 20 },
      story_summary: 'Overthrew the sovereign.',
      branch_id: 'main',
      history: [],
    };

    const endings = EndingEngine.evaluateEligibleEndings(state);
    expect(endings).toContain('Villain Ending');
  });

  it('correctly evaluates Alternate Timeline Ending when on a divergent branch', () => {
    const state: StoryTimelineState = {
      current_era: 'cyberpunk-future',
      current_chapter: 2,
      current_scene_number: 4,
      character: 'Vance',
      relationships: {},
      flags: { timeline_diverged: true },
      resources: {},
      story_summary: 'Branched into alternate timeline.',
      branch_id: 'branch-alternate-01',
      history: [],
    };

    const endings = EndingEngine.evaluateEligibleEndings(state);
    expect(endings).toContain('Alternate Timeline Ending');
  });

  it('prevents premature endings in Chapter 1', () => {
    const state: StoryTimelineState = {
      current_era: 'ancient-india',
      current_chapter: 1,
      current_scene_number: 1,
      character: 'Arjun',
      relationships: {},
      flags: {},
      resources: {},
      story_summary: 'Just arrived.',
      branch_id: 'main',
      history: [],
    };

    const endings = EndingEngine.evaluateEligibleEndings(state);
    expect(endings).toEqual([]);
  });
});
