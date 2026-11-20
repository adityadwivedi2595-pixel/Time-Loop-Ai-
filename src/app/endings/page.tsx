'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ENDING_DEFINITIONS } from '@/lib/engine/ending-engine';
import { Shield, Crown, Eye, HeartCrack, Sparkles, GitFork, Lock } from 'lucide-react';

export default function EndingsGalleryPage() {
  const endingIcons: Record<string, any> = {
    'Hero Ending': Shield,
    'Villain Ending': Crown,
    'Mystery Ending': Eye,
    'Tragic Ending': HeartCrack,
    'Secret Ending': Sparkles,
    'Alternate Timeline Ending': GitFork,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <Badge variant="cyan">Destiny Archive</Badge>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
          The Ending Vault
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Review ending archetypes and the deterministic conditions required to achieve them in the Living Timeline Engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(ENDING_DEFINITIONS).map((def) => {
          const Icon = endingIcons[def.type] || Sparkles;
          return (
            <GlassCard key={def.type} glow="purple" className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={def.rarity === 'Secret' ? 'red' : def.rarity === 'Legendary' ? 'amber' : 'purple'}>
                    {def.rarity}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-white">{def.title}</h3>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">{def.type}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{def.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">
                  Eligibility Criteria
                </span>
                <div className="text-[11px] text-gray-400 space-y-1">
                  <p>• Minimum Chapter: <span className="text-white font-mono">{def.required_conditions.min_chapter}</span></p>
                  {def.required_conditions.min_resources && (
                    <p>• Resources: <span className="text-cyan-300 font-mono">{JSON.stringify(def.required_conditions.min_resources)}</span></p>
                  )}
                  {def.required_conditions.required_flags && (
                    <p>• Required Flags: <span className="text-purple-300 font-mono">{def.required_conditions.required_flags.join(', ')}</span></p>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
