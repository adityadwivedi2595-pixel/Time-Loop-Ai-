'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AudioChapter } from '@/data/indian-monuments';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Square, 
  FastForward, 
  ChevronLeft, 
  ChevronRight,
  Headphones,
  Sparkles,
  Subtitles,
  Gauge,
  Sliders,
  Check
} from 'lucide-react';

interface AudioHistoryPlayerProps {
  chapters: AudioChapter[];
  monumentName: string;
  hindiName: string;
  language: 'hi' | 'en';
  onLanguageChange: (lang: 'hi' | 'en') => void;
}

export function AudioHistoryPlayer({
  chapters,
  monumentName,
  hindiName,
  language,
  onLanguageChange
}: AudioHistoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [showFullTranscript, setShowFullTranscript] = useState<boolean>(false);

  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeChapter = chapters[currentChapterIdx] || chapters[0];
  const chapterText = language === 'hi' ? activeChapter.textHi : activeChapter.textEn;
  const sentences = chapterText.split(/(?<=[.!?।])\s+/).filter((s) => s.trim().length > 0);

  // Stop current utterance cleanly
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSubtitle('');
    setCurrentSentenceIdx(0);
  }, []);

  // Cleanup on unmount or monument change
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [monumentName, stopAudio]);

  // Main speech player loop fallback
  const playSentence = useCallback(
    (sentenceIdx: number) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      if (sentenceIdx >= sentences.length) {
        // Move to next chapter if available
        if (currentChapterIdx + 1 < chapters.length) {
          setCurrentChapterIdx((prev) => prev + 1);
          setCurrentSentenceIdx(0);
          return;
        } else {
          stopAudio();
          return;
        }
      }

      window.speechSynthesis.cancel();
      const sentence = sentences[sentenceIdx];
      setActiveSubtitle(sentence);
      setCurrentSentenceIdx(sentenceIdx);

      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = playbackSpeed;
      utterance.volume = volume;

      const voices = window.speechSynthesis.getVoices();
      if (language === 'hi') {
        const hindiVoice = voices.find(
          (v) => v.lang.startsWith('hi') || v.name.includes('Hindi') || v.name.includes('India')
        );
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const enVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Guy'))
        );
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onend = () => {
        playSentence(sentenceIdx + 1);
      };

      utterance.onerror = () => {
        playSentence(sentenceIdx + 1);
      };

      utteranceRef.current = utterance;
      (window as any).__currentTourUtterance = utterance;

      // Chrome speech heartbeat prevent timeout
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      heartbeatRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 4000);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    },
    [sentences, currentChapterIdx, chapters.length, playbackSpeed, volume, language, stopAudio]
  );

  const startPlayback = async () => {
    if (isPaused && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    if (isPaused && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Try edge-tts high-fidelity neural audio
    stopAudio();
    setActiveSubtitle(chapterText);

    try {
      const res = await fetch('/api/heritage-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: chapterText,
          voice: language === 'hi' ? 'hi-IN-MadhurNeural' : 'en-IN-PrabhatNeural',
          lang: language
        })
      });

      if (!res.ok) throw new Error('TTS fetch error');
      const data = await res.json();
      if (!data.audioUrl) throw new Error('No audio URL');

      const audio = new Audio(data.audioUrl);
      audio.playbackRate = playbackSpeed;
      audio.volume = volume;
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      audio.onended = () => {
        if (currentChapterIdx + 1 < chapters.length) {
          setCurrentChapterIdx((prev) => prev + 1);
          setCurrentSentenceIdx(0);
        } else {
          stopAudio();
        }
      };

      audio.onerror = () => {
        playSentence(0);
      };

      await audio.play();
    } catch {
      playSentence(0);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const restartAudio = () => {
    stopAudio();
    setTimeout(() => {
      startPlayback();
    }, 150);
  };

  const switchChapter = (idx: number) => {
    stopAudio();
    setCurrentChapterIdx(idx);
    setCurrentSentenceIdx(0);
  };

  return (
    <div className="w-full rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#060c1d] via-[#040815] to-black p-4 sm:p-6 space-y-4 shadow-2xl">
      {/* Top Banner & Language Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-cyan-500 to-emerald-400 flex items-center justify-center text-white shadow-glow-cyan">
            <Headphones className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm sm:text-base font-black text-white">
                AI Voice History Guide
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300">
                BROWSER NEURAL SPEECH
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Complete spoken narration of historical background, architecture, and legends
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black border border-white/15">
          <button
            onClick={() => {
              stopAudio();
              onLanguageChange('hi');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              language === 'hi' ? 'bg-amber-500 text-black shadow-glow-amber' : 'text-gray-400 hover:text-white'
            }`}
          >
            🇮🇳 Hindi (हिंदी)
          </button>
          <button
            onClick={() => {
              stopAudio();
              onLanguageChange('en');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              language === 'en' ? 'bg-cyan-500 text-black shadow-glow-cyan' : 'text-gray-400 hover:text-white'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* PRIMARY CTA: LISTEN TO COMPLETE HISTORY BUTTON */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-black to-cyan-950/60 border border-white/10">
        <div className="flex-1 min-w-[240px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
            Chapter {currentChapterIdx + 1} of {chapters.length}
          </span>
          <h4 className="font-display text-sm sm:text-base font-extrabold text-white">
            {language === 'hi' ? activeChapter.titleHi : activeChapter.title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={startPlayback}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm shadow-glow-cyan cursor-pointer transition transform hover:scale-102 active:scale-98"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{isPaused ? 'Resume History' : language === 'hi' ? 'सूनिये पूरा इतिहास (Hindi)' : 'LISTEN TO COMPLETE HISTORY'}</span>
            </button>
          ) : (
            <button
              onClick={pauseAudio}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-extrabold text-xs sm:text-sm shadow-glow-amber cursor-pointer transition"
            >
              <Pause className="h-4 w-4 fill-black" />
              <span>Pause Audio</span>
            </button>
          )}

          <button
            onClick={stopAudio}
            disabled={!isPlaying && !isPaused}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-rose-400 disabled:opacity-40 transition cursor-pointer"
            title="Stop Audio"
          >
            <Square className="h-4 w-4" />
          </button>

          <button
            onClick={restartAudio}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition cursor-pointer"
            title="Restart Chapter"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chapter Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {chapters.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => switchChapter(idx)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex-shrink-0 cursor-pointer ${
              currentChapterIdx === idx
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-glow-cyan'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <span>{idx + 1}.</span>
            <span>{language === 'hi' ? ch.titleHi : ch.title}</span>
          </button>
        ))}
      </div>

      {/* KARAOKE SYNCHRONIZED SUBTITLES */}
      <div className="relative p-4 rounded-2xl border border-cyan-400/30 bg-black/85 backdrop-blur-md shadow-inner min-h-[90px] flex items-center justify-center text-center">
        {activeSubtitle ? (
          <div className="space-y-1 animate-in fade-in">
            <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase block">
              ● Live Synchronized Narration
            </span>
            <p className="font-display text-sm sm:text-base font-bold text-cyan-100 leading-relaxed px-2">
              "{activeSubtitle}"
            </p>
          </div>
        ) : (
          <p className="text-xs font-mono text-gray-500 italic">
            Click "LISTEN TO COMPLETE HISTORY" to start live audio narration with synchronized subtitles.
          </p>
        )}
      </div>

      {/* Player Fine-Tuning Bar: Speed, Volume, Transcript Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-mono text-gray-400 border-t border-white/10">
        {/* Playback Speed Switcher */}
        <div className="flex items-center gap-1.5">
          <Gauge className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-gray-400">SPEED:</span>
          {[0.75, 1.0, 1.25, 1.5].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                playbackSpeed === spd ? 'bg-cyan-500 text-black' : 'hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          {volume === 0 ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-cyan-400" />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-gray-700"
          />
        </div>

        {/* Full Transcript Toggle */}
        <button
          onClick={() => setShowFullTranscript(!showFullTranscript)}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold transition cursor-pointer"
        >
          <Subtitles className="h-3.5 w-3.5" />
          <span>{showFullTranscript ? 'Hide Full Transcript' : 'View Full Transcript'}</span>
        </button>
      </div>

      {/* Collapsible Full Transcript with Sentence Highlighting */}
      {showFullTranscript && (
        <div className="p-4 rounded-2xl border border-white/10 bg-black/90 max-h-56 overflow-y-auto space-y-2 text-xs leading-relaxed text-gray-300 font-sans animate-in slide-in-from-top-2">
          <h5 className="font-mono text-xs font-bold text-cyan-400 border-b border-white/10 pb-1">
            Complete Chapter Transcript
          </h5>
          <div className="space-y-1.5">
            {sentences.map((sent, idx) => {
              const isCurrent = isPlaying && currentSentenceIdx === idx;
              return (
                <span
                  key={idx}
                  onClick={() => playSentence(idx)}
                  className={`inline cursor-pointer rounded px-1 transition-colors ${
                    isCurrent
                      ? 'bg-cyan-500/30 text-cyan-200 font-bold underline'
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {sent}{' '}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
