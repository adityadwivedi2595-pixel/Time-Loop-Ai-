'use client';

import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, Volume2, FastForward } from 'lucide-react';

interface VoiceControlsProps {
  textToSpeak: string;
}

export function VoicePlayerControls({ textToSpeak }: VoiceControlsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
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
    setIsPlaying(false);
    setIsPaused(false);
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
        <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
          SpeechSynthesis v2
        </span>
      </div>

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

        {/* Speed / Rate Slider */}
        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Playback Speed</span>
            <span className="font-mono text-cyan-400">{rate}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.75"
            step="0.25"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        {/* Pitch Slider */}
        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>Vocal Pitch</span>
            <span className="font-mono text-purple-400">{pitch}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-purple-400"
          />
        </div>
      </div>

      {/* Playback Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:bg-purple-500 transition"
        >
          <Play className="h-4 w-4" />
          <span>{isPaused ? 'Resume Narration' : isPlaying ? 'Restart' : 'Play Narration'}</span>
        </button>

        <button
          onClick={handlePause}
          disabled={!isPlaying}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white disabled:opacity-40 transition"
        >
          <Pause className="h-4 w-4" />
          <span>Pause</span>
        </button>

        <button
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white disabled:opacity-40 transition"
        >
          <Square className="h-4 w-4" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
}
