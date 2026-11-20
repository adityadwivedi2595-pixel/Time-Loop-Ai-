'use client';

import React, { useState } from 'react';
import { VoicePlayerControls } from '@/components/voice/VoicePlayerControls';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Mic, Volume2, Sparkles, MessageSquare } from 'lucide-react';

export default function VoiceStudioPage() {
  const [sampleText, setSampleText] = useState(
    'The bronze sphere hums with tachyon resonance. Shadows lengthen across the imperial parapets as the emperor awaits your answer.'
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <Badge variant="purple">Acoustic Immersion Engine</Badge>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
          <Mic className="h-8 w-8 text-purple-400" />
          Chrono-Voice Studio
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          High-fidelity narration and character dialogue powered by browser SpeechSynthesis and optional external TTS adapters.
        </p>
      </div>

      <div className="space-y-6">
        {/* Interactive Text Box */}
        <GlassCard glow="cyan" className="space-y-3">
          <label className="font-display text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-cyan-400" />
            Script to Synthesize
          </label>
          <textarea
            rows={4}
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-white focus:border-cyan-400 focus:outline-none leading-relaxed"
          />
        </GlassCard>

        {/* Synthesizer Controls */}
        <VoicePlayerControls textToSpeak={sampleText} />

        {/* Technical Architecture Info */}
        <GlassCard className="space-y-3">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
            Architecture Distinction: Browser vs External Audio
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            By default, TIMELOOP AI utilizes the native Web SpeechSynthesis API to deliver instant, zero-latency local voice playback without requiring third-party API tokens. An optional external TTS adapter interface is provided for studio-grade voice cloning (ElevenLabs / Azure Speech) when configured in server environment variables.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
