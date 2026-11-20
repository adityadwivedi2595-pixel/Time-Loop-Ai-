'use client';

import React, { useState } from 'react';
import { StoryScene, StoryChoice } from '@/types/story';
import { StoryTimelineState } from '@/types/timeline';
import { Volume2, VolumeX, Shield, Sparkles, AlertCircle, Compass, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface StoryPlayerProps {
  scene: StoryScene;
  timelineState: StoryTimelineState;
  onSelectChoice: (choiceId: string) => Promise<void>;
  isLoading: boolean;
}

export function StoryPlayer({ scene, timelineState, onSelectChoice, isLoading }: StoryPlayerProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narrationText = `${scene.title}. ${scene.narration}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleChoice = async (choiceId: string) => {
    if (isLoading) return;
    if (isSpeaking && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setSelectedChoiceId(choiceId);
    await onSelectChoice(choiceId);
    setSelectedChoiceId(null);
  };

  return (
    <div className="relative mx-auto max-w-5xl space-y-6">
      {/* Cinematic Scene Banner / Visualizer */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface-100 shadow-glow-card aspect-[21/9] max-h-[460px] min-h-[300px]">
        {scene.image_url ? (
          <img
            src={scene.image_url}
            alt={scene.title}
            className="h-full w-full object-cover object-center filter brightness-75 transition-all duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-950/40 via-surface-100 to-cyan-950/30 text-gray-500">
            <Compass className="h-16 w-16 text-white/20 animate-pulse-slow" />
          </div>
        )}

        <div className="absolute inset-0 bg-cinema-gradient" />

        {/* Top Badges / HUD Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple">Chapter {timelineState.current_chapter}</Badge>
            <Badge variant="cyan">Scene {timelineState.current_scene_number}</Badge>
            <Badge variant="outline">Branch: {timelineState.branch_id}</Badge>
          </div>

          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md hover:bg-purple-600/30 transition shadow-sm"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-rose-400" />
                <span>Mute Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Play Narration</span>
              </>
            )}
          </button>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">Current Scene</p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
            {scene.title}
          </h2>
        </div>
      </div>

      {/* Main Narrative & Dialogue Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Narrative & Dialogue Text */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-white/10 bg-[#070b18]/80 p-6 sm:p-8 backdrop-blur-xl shadow-glow-card">
          <div className="prose prose-invert max-w-none text-gray-200 text-sm sm:text-base leading-relaxed space-y-4">
            {scene.narration.split('\n\n').map((para, idx) => (
              <p key={idx} className="first-letter:text-2xl first-letter:font-bold first-letter:text-cyan-400">
                {para}
              </p>
            ))}
          </div>

          {/* Dialogue exchange if present */}
          {scene.dialogues && scene.dialogues.length > 0 && (
            <div className="mt-6 space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-widest text-purple-400">Exchanges & Dialogue</h4>
              {scene.dialogues.map((d, idx) => (
                <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                  <span className="font-display text-xs font-bold text-cyan-300">{d.character}:</span>
                  <p className="mt-1 text-sm italic text-gray-300">"{d.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Living Timeline HUD (Relationships & Resources) */}
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#070b18]/80 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Shield className="h-4 w-4 text-purple-400" />
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">Timeline Vitals</h3>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Resources</span>
            {Object.entries(timelineState.resources || {}).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize text-gray-300">{key.replace('_', ' ')}</span>
                  <span className="font-mono text-cyan-400">{val}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Character Relationships */}
          {Object.keys(timelineState.relationships || {}).length > 0 && (
            <div className="space-y-2 pt-3 border-t border-white/10">
              <span className="text-[11px] font-mono text-gray-400 uppercase">Faction Affiliation</span>
              {Object.entries(timelineState.relationships).map(([char, score]) => (
                <div key={char} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 truncate max-w-[140px]">{char}</span>
                    <span className={`font-mono ${score >= 60 ? 'text-emerald-400' : score <= 35 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 60 ? 'bg-emerald-400' : score <= 35 ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Story Summary Context */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-[11px] font-mono text-gray-400 uppercase">Chronos Anchor</span>
            <p className="mt-1 text-xs text-gray-400 line-clamp-4 leading-relaxed">
              {timelineState.story_summary}
            </p>
          </div>
        </div>
      </div>

      {/* Choice Decision Matrix */}
      <div className="space-y-3 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Choose Your Timeline Branch
          </h3>
        </div>
        <p className="text-xs text-gray-400">
          Every decision reshapes character loyalties, triggers unseen world flags, and influences your ending eligibility.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {scene.choices.map((choice: StoryChoice, idx: number) => {
            const isChosen = selectedChoiceId === choice.id;
            return (
              <button
                key={choice.id || idx}
                disabled={isLoading}
                onClick={() => handleChoice(choice.id)}
                className={`group flex flex-col justify-between text-left rounded-xl border p-4 transition-all duration-300 ${
                  isChosen
                    ? 'border-cyan-400 bg-cyan-950/50 shadow-glow-cyan'
                    : 'border-white/10 bg-white/[0.03] hover:border-purple-500/50 hover:bg-purple-900/20 hover:-translate-y-1'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest">
                      Path {idx + 1}
                    </span>
                    {isChosen && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" />}
                  </div>
                  <p className="mt-2 text-xs sm:text-sm font-medium text-white group-hover:text-cyan-200 transition">
                    {choice.choice_text}
                  </p>
                </div>

                {choice.consequence_hint && (
                  <p className="mt-3 text-[11px] text-gray-400 italic border-t border-white/5 pt-2">
                    💡 {choice.consequence_hint}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {isLoading && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-cyan-300 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            NVIDIA NIM is weaving your new timeline strand...
          </div>
        )}
      </div>
    </div>
  );
}
