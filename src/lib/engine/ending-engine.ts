/**
 * TIMELOOP AI – Ending Engine
 * Evaluates deterministic ending eligibility rules based on timeline state,
 * relationships, flags, resources, and chapter progression.
 */

import { StoryTimelineState } from '@/types/timeline';
import { EndingType, EndingDefinition } from '@/types/ending';

export const ENDING_DEFINITIONS: Record<EndingType, EndingDefinition> = {
  'Hero Ending': {
    type: 'Hero Ending',
    title: 'The Champion of Chronos',
    description: 'You risked everything to safeguard the prime timeline and placed duty above self.',
    icon: 'Shield',
    rarity: 'Common',
    required_conditions: {
      min_chapter: 3,
      min_resources: { reputation: 60 },
      required_flags: ['prime_timeline_defended'],
    },
  },
  'Villain Ending': {
    type: 'Villain Ending',
    title: 'Sovereign of the Severed Strand',
    description: 'You seized temporal power for your own dominion, shattering the ancient balance.',
    icon: 'Crown',
    rarity: 'Rare',
    required_conditions: {
      min_chapter: 3,
      min_resources: { influence: 70 },
      required_flags: ['usurped_throne'],
    },
  },
  'Mystery Ending': {
    type: 'Mystery Ending',
    title: 'The Unsolved Paradox',
    description: 'The anomaly deepened. Some cosmic enigmas defy comprehension across eternity.',
    icon: 'Eye',
    rarity: 'Common',
    required_conditions: {
      min_chapter: 2,
      min_resources: { reputation: 30 },
    },
  },
  'Tragic Ending': {
    type: 'Tragic Ending',
    title: 'Echo in the Void',
    description: 'A sacrificial descent into the timestream to prevent catastrophic reality collapse.',
    icon: 'HeartCrack',
    rarity: 'Rare',
    required_conditions: {
      min_chapter: 3,
      required_flags: ['sacrificed_anchor'],
    },
  },
  'Secret Ending': {
    type: 'Secret Ending',
    title: 'Architect of the Ouroboros',
    description: 'You uncovered the hidden progenitor archives and transcended linear causality.',
    icon: 'Sparkles',
    rarity: 'Secret',
    required_conditions: {
      min_chapter: 3,
      min_resources: { influence: 80, reputation: 80 },
      required_flags: ['discovered_archive', 'mastered_chronos'],
    },
  },
  'Alternate Timeline Ending': {
    type: 'Alternate Timeline Ending',
    title: 'The Sovereign Divergence',
    description: 'A completely new history blossoms from the seeds of your rebellion.',
    icon: 'GitFork',
    rarity: 'Legendary',
    required_conditions: {
      min_chapter: 2,
      required_flags: ['timeline_diverged'],
    },
  },
};

export class EndingEngine {
  /**
   * Deterministically evaluates which endings are unlocked given the current timeline state
   */
  public static evaluateEligibleEndings(state: StoryTimelineState): EndingType[] {
    const eligible: EndingType[] = [];

    // Mystery Ending is always a baseline possibility once past chapter 1
    if (state.current_chapter >= 2) {
      eligible.push('Mystery Ending');
    }

    // Hero Ending
    const hasHeroFlags = state.flags['prime_timeline_defended'] || state.flags['defended_realm'] || state.flags['saved_innocents'];
    const hasHeroReputation = (state.resources['reputation'] ?? 50) >= 60;
    if (state.current_chapter >= 3 && (hasHeroFlags || hasHeroReputation)) {
      eligible.push('Hero Ending');
    }

    // Villain Ending
    const hasVillainFlags = state.flags['usurped_throne'] || state.flags['betrayed_king'] || state.flags['embraced_power'];
    const hasHighInfluence = (state.resources['influence'] ?? 20) >= 65;
    if (state.current_chapter >= 3 && (hasVillainFlags || hasHighInfluence)) {
      eligible.push('Villain Ending');
    }

    // Tragic Ending
    const hasTragicFlags = state.flags['sacrificed_anchor'] || state.flags['grievous_wound'] || (state.resources['temporal_charge'] ?? 100) <= 15;
    if (state.current_chapter >= 3 && hasTragicFlags) {
      eligible.push('Tragic Ending');
    }

    // Secret Ending
    const hasSecretFlags = state.flags['discovered_archive'] || (state.flags['mastered_chronos'] && state.flags['artifact_detected']);
    const hasExceptionalStats = (state.resources['influence'] ?? 0) >= 75 && (state.resources['reputation'] ?? 0) >= 75;
    if (state.current_chapter >= 3 && (hasSecretFlags || hasExceptionalStats)) {
      eligible.push('Secret Ending');
    }

    // Alternate Timeline Ending
    if (state.branch_id !== 'main' || state.flags['timeline_diverged']) {
      eligible.push('Alternate Timeline Ending');
    }

    return Array.from(new Set(eligible));
  }
}
