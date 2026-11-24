'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Play, Pause, Square, Volume2, FastForward, Activity } from 'lucide-react';

interface VoiceControlsProps {
  textToSpeak: string;
}

export function VoicePlayerControls({ textToSpeak }: VoiceControlsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1.25); // Default to fast & punchy
  const [pitch, setPitch] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentence, setCurrentSentence] = useState<string>('');

  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const sentenceIndexRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      // Auto-select a high quality natural English voice if present
      const preferred = available.findIndex(
        v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Guy'))
      );
      if (preferred !== -1) {
        setSelectedVoiceIndex(preferred);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakSentence = useCallback((index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const list = sentencesRef.current;
    if (index >= list.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentence('');
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      return;
    }

    const text = list[index];
    sentenceIndexRef.current = index;
    setCurrentSentence(text);

    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    utterance.rate = rate;
    utterance.volume = 1.0; // 100% full volume
    utterance.pitch = pitch;

    utterance.onend = () => {
      speakSentence(index + 1);
    };

    utterance.onerror = () => {
      speakSentence(index + 1);
    };

    (window as any).__voicePlayerUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voices, selectedVoiceIndex, rate, pitch]);

  const handlePlay = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    const chunks = textToSpeak
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    sentencesRef.current = chunks.length > 0 ? chunks : [textToSpeak];
    sentenceIndexRef.current = 0;

    setIsPlaying(true);
    setIsPaused(false);

    // Chrome keep-alive pulse heartbeat every 6 seconds
    heartbeatRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 6000);

    speakSentence(0);
  };

  const handlePause = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentence('');
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#060a17]/80 p-6 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-purple-400" />
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
            Chrono-Acoustic Voice Synthesizer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3.5 mr-2">
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 bg-cyan-300 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:450ms]" />
            </div>
          )}
          <span className="rounded bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
            Volume: 100% | Speed: {rate}x
          </span>
        </div>
      </div>

      {/* Real-time Subtitle Ticker */}
      {currentSentence && (
        <div className="rounded-xl border border-cyan-500/30 bg-black/60 p-3 text-center">
          <p className="text-xs sm:text-sm font-semibold text-cyan-200">
            "{currentSentence}"
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Voice Selector */}
        <div>
          <label className="text-gray-400 block mb-1">Select Narrator Voice</label>
          <select
            value={selectedVoiceIndex}
            onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-white focus:border-purple-400 focus:outline-none"
          >
            {voices.length === 0 && <option value={0}>System Default Narrator</option>}
            {voices.map((v, i) => (
              <option key={i} value={i}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Speed / Rate */}
        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Narration Pacing</span>
            <span className="font-mono text-purple-300">{rate}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.75"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-purple-400 h-1.5 bg-white/10 rounded cursor-pointer"
          />
        </div>

        {/* Pitch */}
        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Voice Resonance / Pitch</span>
            <span className="font-mono text-cyan-300">{pitch}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:opacity-95 transition"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>{isPaused ? 'Resume Voice' : isPlaying ? 'Restart Sentence' : 'Play Narration'}</span>
        </button>

        <button
          onClick={handlePause}
          disabled={!isPlaying}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white disabled:opacity-30 transition"
        >
          <Pause className="h-4 w-4" />
          <span>Pause</span>
        </button>

        <button
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white disabled:opacity-30 transition"
        >
          <Square className="h-4 w-4" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
}
