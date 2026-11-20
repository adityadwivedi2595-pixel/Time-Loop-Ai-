'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { GitBranch, Sparkles, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { AlternateTimelineOutput } from '@/lib/ai/prompts';
import Link from 'next/link';

const WHAT_IF_SUGGESTIONS = [
  'What if the Indus Valley Civilization discovered steam-power in 1800 BCE?',
  'What if the Roman Empire never collapsed and colonized the Moon by 1400 AD?',
  'What if dinosaurs survived and evolved high-order sentience alongside humans?',
  'What if humans colonized Mars during the Napoleonic Wars?',
  'What if the Library of Alexandria was never destroyed?',
];

export default function WhatIfUniversePage() {
  const [prompt, setPrompt] = useState(WHAT_IF_SUGGESTIONS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<AlternateTimelineOutput | null>(null);

  const handleSimulate = async () => {
    if (!prompt.trim()) return;
    setIsSimulating(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/generate-alternate-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatIfPrompt: prompt }),
      });
      if (res.ok) {
        const json = await res.json();
        setResult(json.universe);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to simulate');
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <Badge variant="cyan">Counterfactual Causality Engine</Badge>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-pink-400" />
          The What If Universe
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Hypothesize any radical historical divergence. NVIDIA NIM calculates the cascading geopolitical and cultural ripple effects.
        </p>
      </div>

      {/* Input Matrix */}
      <GlassCard glow="purple" className="space-y-4">
        <label className="font-display text-xs font-bold uppercase tracking-wider text-white">
          Enter Your Counterfactual Divergence Hypothesis
        </label>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What if..."
          className="w-full rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-white focus:border-cyan-400 focus:outline-none"
        />

        <div className="space-y-2">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Suggested Paradox Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            {WHAT_IF_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => setPrompt(sug)}
                className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-gray-300 hover:border-cyan-400 hover:text-white transition"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 py-3.5 text-xs font-bold text-white shadow-glow-purple hover:scale-[1.01] transition"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Calculating Causal Divergence via NVIDIA NIM...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Simulate Alternate Timeline</span>
            </>
          )}
        </button>
      </GlassCard>

      {/* Simulation Results Display */}
      {result && (
        <div className="space-y-6">
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span>Clearly identified as fictional counterfactual entertainment; not verified historical fact.</span>
          </div>

          <GlassCard glow="cyan" className="space-y-4">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-pink-400">Divergence Result</span>
              <h2 className="font-display text-2xl font-black text-white">{result.divergence_title}</h2>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">{result.alternate_world}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Timeline Cascades & Milestones
                </h4>
                <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
                  {result.timeline_events.map((evt, idx) => (
                    <li key={idx}><span className="text-gray-200">{evt}</span></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-purple-300">
                  Global Repercussions & Conflicts
                </h4>
                <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
                  {result.consequences.map((c, idx) => (
                    <li key={idx}><span className="text-gray-200">{c}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-gray-400">Chapters Generated: {result.story_chapters?.length || 3}</span>
              <Link
                href={`/story-config?eraId=cyberpunk-future`}
                className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition"
              >
                Launch Story in this Universe
              </Link>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
