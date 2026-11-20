'use client';

import React from 'react';
import { Compass, Sparkles, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function StoryGenerationLoaderPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassCard glow="purple" className="w-full max-w-lg p-8 text-center space-y-6">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-glow-purple">
          <Compass className="h-10 w-10 text-white animate-spin" />
          <div className="absolute -inset-1 rounded-3xl bg-cyan-400/20 blur animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl font-black text-white">
            Weaving Prime Reality Strand
          </h2>
          <p className="text-xs text-cyan-300 font-mono">
            NVIDIA NIM • Mistral Large 4 Inference Active
          </p>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Calculating causal vectors, establishing faction relationships, and synthesizing opening scene parameters across the chosen timeline coordinates...
        </p>

        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-cyan-400 animate-pulse" />
        </div>
      </GlassCard>
    </div>
  );
}
