'use client';

import React from 'react';
import { TimelineDecision } from '@/types/timeline';
import { GitBranch, Clock, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface TimelineCanvasProps {
  history: TimelineDecision[];
  currentSceneTitle: string;
  activeBranch: string;
  onRewind?: (sceneId: string, branchId: string) => void;
}

export function TimelineCanvas({ history, currentSceneTitle, activeBranch, onRewind }: TimelineCanvasProps) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#060a17]/90 p-6 backdrop-blur-2xl shadow-glow-card space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-cyan-400" />
          <h3 className="font-display text-lg font-bold text-white">Living Timeline Branch Map</h3>
        </div>
        <Badge variant="cyan">Active Strand: {activeBranch}</Badge>
      </div>

      <p className="text-xs text-gray-400">
        Review your chronological decision nodes. You can inspect decision checkpoints and fork into alternate timelines.
      </p>

      {/* Visual Timeline Path */}
      <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-cyan-400 before:to-emerald-400">
        {/* Origin Node */}
        <div className="relative flex items-start gap-4">
          <div className="absolute -left-[19px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white shadow-glow-purple">
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 w-full">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Temporal Origin</span>
            <h4 className="text-sm font-semibold text-white">Convergence & Initiation</h4>
            <p className="mt-1 text-xs text-gray-400">Arrival in the prime era coordinate.</p>
          </div>
        </div>

        {/* Decision Nodes */}
        {history.map((dec, idx) => (
          <div key={idx} className="relative flex items-start gap-4">
            <div className="absolute -left-[19px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-600 text-white shadow-glow-cyan">
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 w-full hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  Checkpoint #{idx + 1} • {dec.branch_id}
                </span>
                <span className="text-[10px] text-gray-500">{new Date(dec.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="mt-1 text-xs text-gray-200 font-medium">"{dec.choice_text}"</p>
              {onRewind && (
                <button
                  onClick={() => onRewind(dec.scene_id, dec.branch_id)}
                  className="mt-2 text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Fork alternate timeline from here <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Current Active Node */}
        <div className="relative flex items-start gap-4">
          <div className="absolute -left-[19px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white animate-pulse">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 w-full">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Present Scene</span>
            <h4 className="text-sm font-bold text-white">{currentSceneTitle}</h4>
            <p className="mt-1 text-xs text-emerald-200/70">Awaiting your subsequent choice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
