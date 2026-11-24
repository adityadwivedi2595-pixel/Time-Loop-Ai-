'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { StoryScene, StoryChoice } from '@/types/story';
import { StoryTimelineState } from '@/types/timeline';
import { 
  Volume2, 
  VolumeX, 
  Shield, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Play, 
  Pause, 
  Square,
  FastForward, 
  Layers, 
  Radio, 
  Video, 
  Camera, 
  Maximize2, 
  ZoomIn, 
  MoveLeft, 
  MoveRight, 
  RotateCcw, 
  Eye, 
  Sliders, 
  MapPin, 
  ChevronRight,
  Box
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { VirtualWorldCanvas, WorldEra } from '@/components/virtual/VirtualWorldCanvas';

interface StoryPlayerProps {
  scene: StoryScene;
  timelineState: StoryTimelineState;
  onSelectChoice: (choiceId: string) => Promise<void>;
  isLoading: boolean;
}

// Preset Era Locations for instant teleportation if user wants to change setting
const ERA_PRESETS = [
  {
    id: 'ancient-india',
    name: 'Ancient India (Sacred Shrine)',
    title: 'The Brass Anomaly by the Sacred River',
    narration: 'Incense and river mist cling to the morning air along the sacred ghats. Beyond the bamboo grove, ancient timber bastions rise against the vermillion dawn. A convoy of royal guards halts in shock as an ethereal cyan humming sound reverberates from a sunken bronze mechanism.',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    character: 'Royal Commander',
    dialogue: 'Hold your spears! That radiance is no earthly torchlight. Who approaches through the mist?'
  },
  {
    id: 'cyberpunk-future',
    name: 'Cyberpunk 2099 (Neo-Tokyo)',
    title: 'Neon Shadows of Sector 7',
    narration: 'Acid rain cascades down monolithic corporate spires draped in flickering neon holoboards. Flying patrol gunships weave through the synthetic smog. In the labyrinth of the lower alleys, a clandestine data courier clutches an encrypted chronal drive humming with forbidden temporal coordinates.',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    character: 'Cyber Broker',
    dialogue: 'You are late, time-walker. The Megacorp security drones have already locked down the transit grid.'
  },
  {
    id: 'space-civilization',
    name: 'Deep Space (Orbital Citadel)',
    title: 'The Singularity Gate of Kepler Station',
    narration: 'Silent stellar auroras ripple across the crystalline hull of Kepler Orbital Citadel. Below, the sapphire curve of the colony world glows in perpetual twilight. Inside the observation dome, the station AI sounds a yellow alert: an uncharted gravity wave is warping the sector warp gate.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    character: 'Station AI Lyra',
    dialogue: 'Warning: tachyon flux exceeds safe thresholds by 400%. Spacetime collapse imminent unless stabilized.'
  },
  {
    id: 'medieval-kingdom',
    name: 'Medieval Kingdom (Stone Keep)',
    title: 'The Siege of Ironclad Fortress',
    narration: 'War horns echo across the mist-shrouded valley as trebuchets launch fiery boulders into the stone ramparts. In the royal council chamber, the king paces before his captains. A cloaked figure emerges from a shimmering rift behind the throne, carrying knowledge of tomorrow\'s battle.',
    image: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=1200&q=80',
    character: 'King Eldred',
    dialogue: 'You step from the shadows unannounced! Do you bring sorcery, or the salvation of our kingdom?'
  },
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt (Pharaoh\'s Tomb)',
    title: 'The Golden Chamber of Amun-Ra',
    narration: 'Golden dust dances in beams of desert sunlight filtering through the megalithic pillars of Karnak. High priests chant ancient hymns in the shadows of towering hieroglyphs. Deep beneath the pyramid floor, a subterranean solar disc begins spinning backwards against the stars.',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    character: 'High Priest Ankh-ef',
    dialogue: 'The stars have reversed their course! The prophecy of the eternal traveller has awakened.'
  }
];

export function StoryPlayer({ scene: initialScene, timelineState, onSelectChoice, isLoading }: StoryPlayerProps) {
  // Current active scene (allows user to preview alternate eras or live scene)
  const [activeScene, setActiveScene] = useState<StoryScene>(initialScene);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  // Voice Narration State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.25);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [speechSentences, setSpeechSentences] = useState<string[]>([]);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  // 2.5D Virtual Camera & Motion State
  const [viewportMode, setViewportMode] = useState<'cinema' | '3d'>('3d');
  const [cameraMode, setCameraMode] = useState<'drone' | 'portal' | 'particles' | 'static'>('drone');
  const [cameraPanX, setCameraPanX] = useState<number>(0);
  const [cameraZoom, setCameraZoom] = useState<number>(1.12);
  const [mouseParallax, setMouseParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [timecodeSeconds, setTimecodeSeconds] = useState<number>(12);

  const get3DEraFromState = (): WorldEra => {
    const eraStr = `${timelineState?.current_era || ''} ${activeScene.title || ''} ${activeScene.narration || ''} ${activeScene.story_id || ''}`.toLowerCase();
    if (eraStr.includes('cyber') || eraStr.includes('tokyo') || eraStr.includes('spire') || eraStr.includes('2099') || eraStr.includes('kael')) return 'cyberpunk-future';
    if (eraStr.includes('space') || eraStr.includes('star') || eraStr.includes('kepler') || eraStr.includes('singularity') || eraStr.includes('2340') || eraStr.includes('lyra')) return 'space-civilization';
    if (eraStr.includes('medieval') || eraStr.includes('keep') || eraStr.includes('knight') || eraStr.includes('fortress') || eraStr.includes('galahad') || eraStr.includes('1190')) return 'medieval-kingdom';
    if (eraStr.includes('egypt') || eraStr.includes('pharaoh') || eraStr.includes('pyramid') || eraStr.includes('ankh') || eraStr.includes('amun') || eraStr.includes('1340')) return 'ancient-egypt';
    return 'ancient-india';
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const sentenceIndexRef = useRef<number>(0);
  const sentencesRef = useRef<string[]>([]);
  // Ambient Cinematic Synth Drone using Web Audio API
  const ambientOscillatorRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const [isAmbienceEnabled, setIsAmbienceEnabled] = useState<boolean>(true);

  const startAmbientSynth = () => {
    if (!isAmbienceEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      if (ambientOscillatorRef.current) {
        try { ambientOscillatorRef.current.stop(); } catch {}
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65.41, ctx.currentTime); // C2 warm sci-fi drone

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      ambientOscillatorRef.current = osc;
      ambientGainRef.current = gain;
    } catch {
      // Audio context might be restricted, safely ignore
    }
  };

  const stopAmbientSynth = () => {
    try {
      if (ambientGainRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime;
        ambientGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          try {
            ambientOscillatorRef.current?.stop();
            ambientOscillatorRef.current = null;
          } catch {}
        }, 900);
      }
    } catch {}
  };

  // Keep ref synchronized
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    setActiveScene(initialScene);
  }, [initialScene]);

  // Break narration into distinct sentences so browser GC never cuts off audio
  useEffect(() => {
    const raw = `${activeScene.title}. ... ${activeScene.narration}`;
    const parsed = raw
      .replace(/([.?!])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    setSpeechSentences(parsed);
    sentencesRef.current = parsed;
    setCurrentSentenceIndex(0);
    sentenceIndexRef.current = 0;
  }, [activeScene]);

  // Load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoiceList(voices);
      if (voices.length > 0 && !selectedVoice) {
        const naturalVoice = voices.find(
          v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Mark'))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (naturalVoice) setSelectedVoice(naturalVoice.name);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    };
  }, []);

  // Timecode timer for cinematic camera HUD
  useEffect(() => {
    const timer = setInterval(() => {
      setTimecodeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Timecode: 00:01:24
  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  // High-performance Canvas Animation (Particles, Spacetime Vortex, Live Audio Waveform)
  useEffect(() => {
    if (cameraMode === 'static') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle field
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      hue: Math.random() > 0.5 ? 190 : 275 // Cyan or Purple
    }));

    let vortexAngle = 0;
    let wavePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Spacetime Portal Rings (if portal mode)
      if (cameraMode === 'portal') {
        vortexAngle += 0.015;
        const cx = width / 2;
        const cy = height / 2;
        for (let r = 40; r < Math.min(width, height) * 0.7; r += 45) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, r + Math.sin(vortexAngle * 2 + r) * 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.18 + Math.sin(vortexAngle + r) * 0.1})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([15, 20]);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 2. Floating Cyber Particles
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.hue === 190 ? '#06b6d4' : '#a855f7';
        ctx.fill();
      });

      // 3. Audio Frequency Waveform (Only renders when voice is active!)
      if (isSpeakingRef.current) {
        wavePhase += 0.12;
        ctx.beginPath();
        ctx.moveTo(0, height - 20);
        for (let x = 0; x < width; x += 8) {
          const y = height - 25 + Math.sin(x * 0.03 + wavePhase) * 14 * Math.cos(x * 0.01);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#06b6d4';
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [cameraMode]);

  /**
   * ROBUST SENTENCE-BY-SENTENCE NARRATION ENGINE
   * Bypasses the 15-second Chromium SpeechSynthesis cut-off bug completely!
   */
  const speakSentence = useCallback((index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const sentences = sentencesRef.current;
    if (index >= sentences.length) {
      // Completed all sentences
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentenceIndex(0);
      sentenceIndexRef.current = 0;
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      return;
    }

    // Cancel any hanging utterance
    window.speechSynthesis.cancel();

    const text = sentences[index];
    const utterance = new SpeechSynthesisUtterance(text);
    activeUtteranceRef.current = utterance;
    // Bind to window to prevent V8 Garbage Collector from killing it mid-speech!
    (window as any).__timeloopUtterance = utterance;

    utterance.rate = playbackSpeed;
    utterance.volume = 1.0; // 100% full volume
    utterance.pitch = 1.0;

    if (selectedVoice && voiceList.length > 0) {
      const v = voiceList.find(voice => voice.name === selectedVoice);
      if (v) utterance.voice = v;
    }

    utterance.onend = () => {
      if (isSpeakingRef.current) {
        const nextIdx = index + 1;
        sentenceIndexRef.current = nextIdx;
        setCurrentSentenceIndex(nextIdx);
        // Instant seamless handover to next sentence
        speakSentence(nextIdx);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (isSpeakingRef.current) {
        const nextIdx = index + 1;
        sentenceIndexRef.current = nextIdx;
        setCurrentSentenceIndex(nextIdx);
        speakSentence(nextIdx);
      }
    };

    window.speechSynthesis.speak(utterance);
    setCurrentSentenceIndex(index);
    sentenceIndexRef.current = index;
    setIsSpeaking(true);
    setIsPaused(false);

    // Chromium Keep-Alive Heartbeat: pulses pause/resume every 7 seconds
    if (!heartbeatTimerRef.current) {
      heartbeatTimerRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 7000);
    }
  }, [playbackSpeed, selectedVoice, voiceList]);

  // Start Narration from beginning or resume
  const handleStartNarration = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      startAmbientSynth();
      return;
    }

    startAmbientSynth();
    sentenceIndexRef.current = 0;
    setCurrentSentenceIndex(0);
    speakSentence(0);
  };

  const handlePauseNarration = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsSpeaking(false);
    stopAmbientSynth();
  };

  const handleStopNarration = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    stopAmbientSynth();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
    sentenceIndexRef.current = 0;
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      // Restart current sentence with new speed
      speakSentence(sentenceIndexRef.current);
    }
  };

  // 3D Mouse Parallax calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cameraMode === 'static') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseParallax({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setMouseParallax({ x: 0, y: 0 });
  };

  // Teleport to an alternate era preset
  const handleSelectEraPreset = (preset: typeof ERA_PRESETS[0]) => {
    handleStopNarration();
    setActiveScene({
      id: `scene-${preset.id}`,
      story_id: activeScene.story_id,
      chapter_id: 'chap-1',
      scene_number: 1,
      title: preset.title,
      narration: preset.narration,
      dialogues: [
        { character: preset.character, text: preset.dialogue }
      ],
      scene_description: preset.narration,
      visual_prompt: preset.title,
      image_url: preset.image,
      choices: [
        { id: 'p1', choice_text: `Confront the ${preset.character} and demand an explanation.`, consequence_hint: 'Direct action (+10 Influence)' },
        { id: 'p2', choice_text: 'Scan the perimeter with your chrono-anchor.', consequence_hint: 'Gathers technical anomaly data' },
        { id: 'p3', choice_text: 'Slip into the shadows and observe unseen.', consequence_hint: 'Maintains stealth infiltration' },
      ],
      created_at: new Date().toISOString(),
    });
  };

  const handleChoice = async (choiceId: string) => {
    if (isLoading) return;
    handleStopNarration();
    setSelectedChoiceId(choiceId);
    await onSelectChoice(choiceId);
    setSelectedChoiceId(null);
  };

  return (
    <div className="relative mx-auto max-w-5xl space-y-6">
      {/* Teleport Location / Era Switcher Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#070b18]/90 p-3.5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 mb-2 px-1 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Timeline Sector & Era Teleport:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/heritage"
              className="flex items-center gap-1.5 rounded-lg border border-amber-400/60 bg-gradient-to-r from-amber-600 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow-glow-cyan hover:brightness-110 transition"
              title="Explore India Heritage Monuments"
            >
              <span>🇮🇳 Heritage Explorer</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ERA_PRESETS.map((preset) => {
            const isCurrent = activeScene.title === preset.title;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectEraPreset(preset)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-glow-cyan'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{preset.name}</span>
                {isCurrent && <ChevronRight className="h-3 w-3 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2.5D Virtual Holo-Viewer Frame vs 3D World Canvas */}
      {viewportMode === '3d' ? (
        <div className="relative w-full aspect-[21/9] max-h-[600px] min-h-[460px] rounded-3xl overflow-hidden border border-cyan-500/50 shadow-glow-card">
          <VirtualWorldCanvas
            era={get3DEraFromState()}
            quality="high"
            cameraMode="first"
            isAudioSpeaking={isSpeaking}
          />
        </div>
      ) : (
      <div 
        className="group relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-surface-100 shadow-glow-card aspect-[21/9] max-h-[490px] min-h-[350px] cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic 2.5D Camera Layer */}
        <div 
          className="absolute inset-0 h-full w-full transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mouseParallax.y}deg) rotateY(${mouseParallax.x}deg) scale(${cameraZoom}) translateX(${cameraPanX}px)`
          }}
        >
          {activeScene.image_url ? (
            <img
              src={activeScene.image_url}
              alt={activeScene.title}
              className={`h-full w-full object-cover object-center filter brightness-95 transition-all duration-700 ${
                cameraMode === 'drone' ? 'animate-cinema-drone' : ''
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-950/60 via-surface-100 to-cyan-950/50 text-gray-400">
              <Compass className="h-20 w-20 text-cyan-400/30 animate-pulse-slow" />
            </div>
          )}
        </div>

        {/* Floating Cyber Particle & Waveform Canvas Layer */}
        {cameraMode !== 'static' && (
          <canvas 
            ref={canvasRef} 
            className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen opacity-85 z-10"
          />
        )}

        {/* Holographic Laser Scanline Sweep */}
        {cameraMode !== 'static' && (
          <div className="pointer-events-none absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 shadow-[0_0_20px_#06b6d4] animate-scanline z-20" />
        )}

        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-cinema-gradient z-20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(3,7,18,0.75)_100%)] z-20" />

        {/* Sci-Fi HUD Reticle Corners */}
        <div className="pointer-events-none absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400/80 z-30" />
        <div className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400/80 z-30" />
        <div className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-purple-400/80 z-30" />
        <div className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-purple-400/80 z-30" />

        {/* Top HUD: Timecode, Camera Mode Switcher & Status */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md bg-black/70 border border-white/10 px-2.5 py-1 text-[11px] font-mono text-cyan-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              REC ● {formatTimecode(timecodeSeconds)} [60 FPS]
            </span>

            <Badge variant="purple" className="hidden sm:flex">
              Chapter {timelineState.current_chapter}
            </Badge>
            <Badge variant="cyan">
              Scene {timelineState.current_scene_number}
            </Badge>
          </div>

          {/* Virtual Camera Mode Switcher */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/75 p-1 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setCameraMode('drone')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-mono font-medium transition ${
                cameraMode === 'drone' ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' : 'text-gray-300 hover:text-white'
              }`}
              title="Cinematic Continuous Drone Flythrough Motion"
            >
              🎥 Drone Cam
            </button>
            <button
              onClick={() => setCameraMode('portal')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-mono font-medium transition ${
                cameraMode === 'portal' ? 'bg-purple-600 text-white font-bold shadow-glow-purple' : 'text-gray-300 hover:text-white'
              }`}
              title="Temporal Spacetime Vortex Rings"
            >
              ⚡ Portal
            </button>
            <button
              onClick={() => setCameraMode('particles')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-mono font-medium transition ${
                cameraMode === 'particles' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-300 hover:text-white'
              }`}
              title="Glowing Cyber Dust Particles"
            >
              ✨ Embers
            </button>
            <button
              onClick={() => setCameraMode(cameraMode === 'static' ? 'drone' : 'static')}
              className={`rounded-full px-2 py-1 text-[10px] font-mono transition ${
                cameraMode === 'static' ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Pause Camera Motion"
            >
              {cameraMode === 'static' ? 'OFF' : 'PAUSE'}
            </button>
          </div>
        </div>

        {/* Interactive Camera Pan & Zoom Quick Bar (Floating Bottom-Right) */}
        <div className="absolute top-16 right-4 z-30 flex flex-col gap-1.5 opacity-90 hover:opacity-100 transition">
          <div className="flex items-center gap-1 rounded-lg border border-white/15 bg-black/70 p-1 backdrop-blur-md">
            <button
              onClick={() => setCameraPanX(p => p - 25)}
              className="p-1 rounded text-gray-300 hover:text-cyan-400 hover:bg-white/10"
              title="Pan Camera Left"
            >
              <MoveLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCameraZoom(z => Math.min(1.4, z + 0.08))}
              className="p-1 rounded text-gray-300 hover:text-cyan-400 hover:bg-white/10"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCameraPanX(p => p + 25)}
              className="p-1 rounded text-gray-300 hover:text-cyan-400 hover:bg-white/10"
              title="Pan Camera Right"
            >
              <MoveRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => { setCameraPanX(0); setCameraZoom(1.12); }}
              className="p-1 rounded text-gray-300 hover:text-rose-400 hover:bg-white/10"
              title="Reset Camera Center"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Chronos Coordinates at Bottom */}
        <div className="absolute bottom-5 left-6 right-6 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <p className="text-[11px] font-mono uppercase tracking-widest text-cyan-300">
                ACTIVE CINEMA HOLO-STREAM // MODE: {cameraMode.toUpperCase()}
              </p>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">
              {activeScene.title}
            </h2>
          </div>

          {/* Voice Progress indicator if speaking */}
          {isSpeaking && (
            <div className="flex items-center gap-2 rounded-xl bg-black/80 border border-cyan-400/50 px-3 py-1.5 backdrop-blur-md shadow-glow-cyan">
              <span className="text-[11px] font-mono text-cyan-300 animate-pulse">
                Speaking sentence {currentSentenceIndex + 1} of {speechSentences.length}
              </span>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 bg-cyan-400 rounded-full animate-soundwave-1" />
                <span className="w-1 bg-purple-400 rounded-full animate-soundwave-2" />
                <span className="w-1 bg-cyan-300 rounded-full animate-soundwave-3" />
                <span className="w-1 bg-emerald-400 rounded-full animate-soundwave-4" />
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Advanced Narration & Non-Stop Voice Console */}
      <div className="rounded-2xl border border-white/10 bg-[#070b18]/90 p-4 sm:p-5 backdrop-blur-xl shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Play / Pause / Stop Audio Controls */}
          <div className="flex items-center gap-2">
            {!isSpeaking ? (
              <button
                onClick={handleStartNarration}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-glow-cyan hover:brightness-110 transition"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>{isPaused ? 'Resume Non-Stop Narration' : 'Play Loud Non-Stop Narration'}</span>
              </button>
            ) : (
              <button
                onClick={handlePauseNarration}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-amber-500 transition"
              >
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={handleStopNarration}
              disabled={!isSpeaking && !isPaused}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white disabled:opacity-40 transition"
              title="Stop Narration"
            >
              <Square className="h-3.5 w-3.5" />
              <span>Stop</span>
            </button>

            {isSpeaking && (
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 px-2 py-1 rounded bg-cyan-950/50 border border-cyan-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                Anti-Stop Protection Active
              </span>
            )}
          </div>

          {/* Speed & Audio Options */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Ambient Synth Drone Toggle */}
            <button
              onClick={() => {
                const next = !isAmbienceEnabled;
                setIsAmbienceEnabled(next);
                if (!next) stopAmbientSynth();
                else if (isSpeaking) startAmbientSynth();
              }}
              className={`rounded-lg border px-2.5 py-1 text-xs font-mono transition flex items-center gap-1 ${
                isAmbienceEnabled ? 'border-purple-500/50 bg-purple-950/60 text-purple-300' : 'border-white/10 text-gray-500 hover:text-white'
              }`}
              title="Toggle Cinematic Background Ambient Music"
            >
              <span>🎵 Cinema Ambience:</span>
              <span className="font-bold">{isAmbienceEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Voice Dropdown */}
            {voiceList.length > 0 && (
              <select
                value={selectedVoice}
                onChange={(e) => {
                  setSelectedVoice(e.target.value);
                  if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    speakSentence(sentenceIndexRef.current);
                  }
                }}
                className="rounded-lg border border-white/15 bg-black/60 px-2 py-1 text-xs text-cyan-200 focus:outline-none"
                title="Select Narrator Voice"
              >
                {voiceList.map((v, i) => (
                  <option key={i} value={v.name} className="bg-gray-900 text-white">
                    {v.name.slice(0, 24)} ({v.lang})
                  </option>
                ))}
              </select>
            )}

            {/* Speed Presets */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                <FastForward className="h-3 w-3 text-cyan-400" />
                Speed:
              </span>
              <div className="flex items-center rounded-lg border border-white/15 bg-black/40 p-0.5">
                {[1.0, 1.25, 1.5, 1.75].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`rounded-md px-2 py-0.5 text-xs font-mono transition font-medium ${
                      playbackSpeed === speed
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Narration Karaoke Subtitles Ticker */}
        {speechSentences.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-xs sm:text-sm leading-relaxed">
            <span className="font-mono text-[10px] uppercase text-cyan-400 block mb-1">
              Live Sentence Audio Ticker:
            </span>
            <div className="flex flex-wrap gap-1 text-gray-400">
              {speechSentences.map((sent, idx) => {
                const isActive = isSpeaking && currentSentenceIndex === idx;
                return (
                  <span
                    key={idx}
                    className={`transition-all duration-300 px-1 py-0.5 rounded ${
                      isActive
                        ? 'bg-cyan-500/30 text-cyan-200 font-bold border-b-2 border-cyan-400 shadow-glow-cyan'
                        : 'text-gray-300 hover:text-white'
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

      {/* Main Narrative & Dialogue Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Narrative & Dialogue Text */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-white/10 bg-[#070b18]/80 p-6 sm:p-8 backdrop-blur-xl shadow-glow-card">
          <div className="prose prose-invert max-w-none text-gray-200 text-sm sm:text-base leading-relaxed space-y-4">
            {activeScene.narration.split('\n\n').map((para, idx) => (
              <p key={idx} className="first-letter:text-2xl first-letter:font-bold first-letter:text-cyan-400">
                {para}
              </p>
            ))}
          </div>

          {/* Dialogue exchange if present */}
          {activeScene.dialogues && activeScene.dialogues.length > 0 && (
            <div className="mt-6 space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-widest text-purple-400">Exchanges & Dialogue</h4>
              {activeScene.dialogues.map((d, idx) => (
                <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 hover:border-cyan-500/30 transition">
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
          {activeScene.choices.map((choice: StoryChoice, idx: number) => {
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
