'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  GitBranch, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Play, 
  RotateCcw,
  Layers,
  Sliders,
  ExternalLink,
  Box
} from 'lucide-react';

interface TimelineBranch {
  id: string;
  name: string;
  era: string;
  divergencePoint: string;
  causalAnomaly: number; // 0 to 100%
  status: 'STABLE' | 'DIVERGENT' | 'PARADOX' | 'COLLAPSED';
  description: string;
  nodes: {
    title: string;
    decision: string;
    consequence: string;
    unlockedEnding?: string;
  }[];
}

const DEFAULT_TIMELINES: TimelineBranch[] = [
  {
    id: 'timeline-alpha-ancient-india',
    name: 'Strand 01: The Sunken Relic Accord',
    era: 'Ancient India (Vedic & Mauryan)',
    divergencePoint: 'Sanctuary Altar Awakening',
    causalAnomaly: 18,
    status: 'STABLE',
    description: 'The protagonist allied with Vanguard Commander Vikram, safeguarding the tachyon sphere inside the subterranean sanctum.',
    nodes: [
      {
        title: 'Dawn on the Sacred Ghats',
        decision: 'Present imperial credentials and open peaceful discourse.',
        consequence: 'Court influence raised to +85%. Imperial guards escort you to the high astronomer.',
        unlockedEnding: 'The Eternal Emperor Ending'
      },
      {
        title: 'Astronomical Conclave',
        decision: 'Calibrate the celestial brass astrolabe to stellar coordinates.',
        consequence: 'Tachyon resonance stabilized without temporal paradox.',
        unlockedEnding: 'Scholar of the Timestream'
      }
    ]
  },
  {
    id: 'timeline-beta-cyberpunk',
    name: 'Strand 02: Neo-Tokyo Core Protocol',
    era: 'Cyberpunk 2099',
    divergencePoint: 'Megacorp Spire Heist',
    causalAnomaly: 64,
    status: 'DIVERGENT',
    description: 'A rogue netrunner stole the chronal processor, causing ripple anomalies throughout the orbital communications grid.',
    nodes: [
      {
        title: 'Sector 7 Data Breach',
        decision: 'Deploy neural EMP to disable megacorp pursuit gunships.',
        consequence: 'City power grid dropped for 4 minutes. Netrunner Kael escaped into the deep underground.',
        unlockedEnding: 'Ghost in the Machine'
      },
      {
        title: 'Orbital Uplink Hijack',
        decision: 'Broadcast confidential chronal research to all citizens.',
        consequence: 'Spacetime law collapsed as millions attempted chronal micro-hops.',
        unlockedEnding: 'Cyber Anarchy Ending'
      }
    ]
  },
  {
    id: 'timeline-gamma-deep-space',
    name: 'Strand 03: Kepler Singularity Gate',
    era: 'Space Civilization 3420',
    divergencePoint: 'Warp Gate Event Horizon',
    causalAnomaly: 92,
    status: 'PARADOX',
    description: 'Tachyon flux exceeded nominal limits by 400%, creating an echo loop where the station meets its future self.',
    nodes: [
      {
        title: 'Singularity Threshold',
        decision: 'Ignite antimatter emergency thrusters toward the event horizon.',
        consequence: 'Gravitational dilation trapped the crew in a self-reinforcing 7-minute loop.',
        unlockedEnding: 'Paradox Loop Ending'
      }
    ]
  }
];

export default function TimelineExplorerPage() {
  const [timelines, setTimelines] = useState<TimelineBranch[]>(DEFAULT_TIMELINES);
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(DEFAULT_TIMELINES[0].id);
  const [userStories, setUserStories] = useState<any[]>([]);

  useEffect(() => {
    // Load any active stories from database / local storage
    fetch('/api/stories')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.stories && data.stories.length > 0) {
          setUserStories(data.stories);
        }
      })
      .catch(() => {});
  }, []);

  const activeTimeline = timelines.find(t => t.id === selectedTimelineId) || timelines[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="flex items-center gap-1">
              <GitBranch className="h-3 w-3 text-cyan-300" />
              Causal Graph Engine
            </Badge>
            <span className="text-[11px] font-mono text-purple-400">Multi-Strand Spacetime Topology</span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
            Timeline Explorer
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Inspect non-linear branching realities, causality metrics, paradox accumulation, and historical divergence points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/virtual-world"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-300 shadow-glow-cyan hover:bg-cyan-900/60 transition"
          >
            <Box className="h-3.5 w-3.5 text-cyan-400" />
            <span>3D World</span>
          </Link>
          <Link
            href="/what-if"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-gray-200 hover:text-white hover:bg-white/10 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Simulate What-If</span>
          </Link>
        </div>
      </div>

      {/* User Stories Quick Switcher */}
      {userStories.length > 0 && (
        <GlassCard glow="cyan" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Active Player Story Timelines
            </h3>
            <span className="text-[11px] font-mono text-cyan-300">{userStories.length} active odyssey strands</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userStories.map((story) => (
              <Link
                key={story.id}
                href={`/story-player/${story.id}`}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-gray-300 hover:border-cyan-400 hover:text-white transition"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold">{story.title}</span>
                <span className="text-[10px] text-gray-500">({story.genre})</span>
              </Link>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Main Timeline Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Strand Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            Historical Reality Strands
          </h3>
          {timelines.map((t) => {
            const isSelected = t.id === selectedTimelineId;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTimelineId(t.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-purple-500/60 bg-purple-950/40 shadow-glow-purple text-white'
                    : 'border-white/10 bg-white/[0.02] text-gray-300 hover:bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Badge
                    variant={
                      t.status === 'STABLE'
                        ? 'emerald'
                        : t.status === 'DIVERGENT'
                        ? 'cyan'
                        : 'red'
                    }
                  >
                    {t.status}
                  </Badge>
                  <span className="text-[10px] font-mono text-gray-400">
                    Anomaly: {t.causalAnomaly}%
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-white line-clamp-1">{t.name}</h4>
                <p className="text-xs text-purple-300 mt-0.5">{t.era}</p>
                <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">{t.description}</p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Interactive Causal Graph Visualization */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard glow="purple" className="space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">{activeTimeline.name}</h2>
                <p className="text-xs text-cyan-300 font-medium">Era: {activeTimeline.era}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Causality Stress</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          activeTimeline.causalAnomaly > 70
                            ? 'bg-rose-500'
                            : activeTimeline.causalAnomaly > 40
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${activeTimeline.causalAnomaly}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      {activeTimeline.causalAnomaly}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Causal Node Chain */}
            <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-cyan-500 before:to-pink-500">
              {activeTimeline.nodes.map((node, i) => (
                <div key={i} className="relative pl-10 space-y-2">
                  <div className="absolute left-2.5 top-1.5 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-purple-400 bg-black shadow-glow-purple" />
                  
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-white flex items-center gap-2">
                        <span>Checkpoint {i + 1}: {node.title}</span>
                      </h4>
                      {node.unlockedEnding && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {node.unlockedEnding}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-300">
                      <span className="text-cyan-400 font-semibold">User Decision: </span>
                      <span>"{node.decision}"</span>
                    </div>

                    <div className="text-xs text-gray-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <span className="text-emerald-400 font-medium">Timeline Consequence: </span>
                      <span>{node.consequence}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/story-config"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:scale-105 transition"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Launch Story in this Era</span>
              </Link>

              <Link
                href="/endings"
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                <span>View Ending Vault</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
