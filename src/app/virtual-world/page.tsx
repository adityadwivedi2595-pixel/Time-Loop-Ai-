'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  VirtualWorldCanvas, 
  WorldEra, 
  GraphicsQuality 
} from '@/components/virtual/VirtualWorldCanvas';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Shield, 
  Sparkles, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare,
  Activity,
  Layers,
  MapPin,
  FastForward,
  RotateCcw,
  Users
} from 'lucide-react';

interface EraMetadata {
  id: WorldEra;
  name: string;
  tagline: string;
  objective: string;
  dialogueSpeaker: string;
  dialogueText: string;
  initialNarration: string;
}

const WORLD_ERAS: EraMetadata[] = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    tagline: 'Crown of the Palaces & Makrana Marble Sanctum',
    objective: 'Examine the sacred reflection pool of Al Hawd al-Kawthar and inspect the 4 minarets.',
    dialogueSpeaker: 'Royal Architect Ustad Ahmad',
    dialogueText: 'Bismillah! Every stone of Makrana marble was selected by royal decree. Notice how the minarets lean outward to protect the queen\'s resting place.',
    initialNarration: 'You step onto the red sandstone gates of the Taj Mahal in 1648 AD. The Yamuna river breeze cools the grand marble plinth as the central dome reflects brilliantly in the water canal.'
  },
  {
    id: 'delhi-fort',
    name: 'Red Fort Delhi',
    tagline: 'Lal Qila of Shahjahanabad & Lahore Gate',
    objective: 'Walk through the Chhatta Chowk covered bazaar and inspect the Diwan-i-Khas marble hall.',
    dialogueSpeaker: 'Imperial Guard Commander Qasim',
    dialogueText: 'Halt traveler! The Emperor holds court at the Diwan-i-Aam. Present your royal seal.',
    initialNarration: 'You stand before the 33-meter high red sandstone ramparts of Delhi Red Fort in 1648 AD. The sounds of old Delhi marketplace echo as royal flags flutter atop Lahore Gate.'
  },
  {
    id: 'agra-fort',
    name: 'Agra Fort',
    tagline: 'Imperial Sandstone Citadel & Musamman Burj',
    objective: 'Climb the Musamman Burj marble pavilion and gaze at the distant Taj Mahal.',
    dialogueSpeaker: 'Courtyard Historian Badauni',
    dialogueText: 'Welcome to Emperor Akbar’s invincible fortress. 70 feet of Dholpur red sandstone protect the crown.',
    initialNarration: 'The formidable red sandstone gates of Agra Fort loom above the Yamuna River bluff in 1573 AD. Cannons line the double curtain walls as imperial couriers arrive.'
  },
  {
    id: 'sun-temple',
    name: 'Konark Sun Temple',
    tagline: 'Surya Cosmic Chariot & 24 Carved Wheels',
    objective: 'Examine the 24 astronomical stone wheels and calculate solar time using the axle shadow.',
    dialogueSpeaker: 'Royal Sculptor Bishu Moharana',
    dialogueText: 'Look upon the cosmic chariot of Surya! Each stone spoke measures the praharas of the sun with divine precision.',
    initialNarration: 'Ocean spray from the Bay of Bengal sweeps across the 100-foot stone chariot of Konark Sun Temple in 1250 AD. Seven sculpted stone horses strain against their harnesses.'
  },
  {
    id: 'ancient-india',
    name: 'Ancient India',
    tagline: 'The Sunken Sun Temple & River Steps',
    objective: 'Investigate the radiating brass tachyon relic at the central sanctuary altar.',
    dialogueSpeaker: 'Vanguard Commander Vikram',
    dialogueText: 'Halt your footsteps, stranger! That brass sphere has been oscillating since the vermillion dawn. Are you an imperial scholar or a foreign spy?',
    initialNarration: 'You have materialized upon the ancient stone ghats of Ancient India. Incense drifts across the bamboo grove as the sunken bronze mechanism hums with dangerous tachyon radiation.'
  },
  {
    id: 'cyberpunk-future',
    name: 'Cyberpunk 2099',
    tagline: 'Neo-Tokyo Sector 7 Under-grid',
    objective: 'Infiltrate the Megacorp data spire and extract the encrypted chronal drive.',
    dialogueSpeaker: 'Cyber Broker Kael',
    dialogueText: 'Keep your visor down. Security gunships are sweeping the upper highway. The data core is unstable — we have three minutes before lockdown.',
    initialNarration: 'Acid rain glistens against the monolithic carbon spires of Cyberpunk 2099. Holographic advertisements flicker through the smog as your cybernetic core syncs with the city grid.'
  },
  {
    id: 'space-civilization',
    name: 'Deep Space',
    tagline: 'Kepler Orbital Station & Singularity Gate',
    objective: 'Stabilize the warp gate tachyon flux before gravitational collapse occurs.',
    dialogueSpeaker: 'Station AI Lyra',
    dialogueText: 'Warning: tachyon flux exceeds safe thresholds by 400%. Spacetime collapse imminent unless the central gyro rings are aligned.',
    initialNarration: 'Beyond the crystalline dome of Kepler Station, distant nebulae swirl in iridescent violet. The artificial gravity hums as an uncharted temporal wave warps the sector warp gate.'
  },
  {
    id: 'medieval-kingdom',
    name: 'Medieval Keep',
    tagline: 'Ironclad Fortress Under Siege',
    objective: 'Break through the castle ramparts and consult the King before the battle begins.',
    dialogueSpeaker: 'Captain of the Guard',
    dialogueText: 'Lower your weapons! The trebuchets are loaded and the enemy is at the moat. Who sent you through that sorcerous light?',
    initialNarration: 'Smoke and torchlight fill the stone courtyard of the medieval fortress. The war horns echo through the misty valley as the fate of the realm hangs upon a single decision.'
  },
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    tagline: 'The Golden Chamber of Amun-Ra',
    objective: 'Decipher the solar hieroglyphs and align the golden pyramid capstone.',
    dialogueSpeaker: 'High Priest Ankh-ef',
    dialogueText: 'The stars have reversed their course across the heavens! The sacred disc is spinning backward. Has the eternal traveller returned?',
    initialNarration: 'Golden sand drifts between towering sandstone pillars. Deep beneath the pyramid floor, an otherworldly solar mechanism begins turning against the cosmic wheel of time.'
  },
  {
    id: 'roman-empire',
    name: 'Roman Colosseum',
    tagline: 'Flavian Amphitheatre & Imperial Forum',
    objective: 'Survey the gladiatorial arena floor and consult the imperial tribune at the Pulvinar.',
    dialogueSpeaker: 'Centurion Marcus',
    dialogueText: 'Hail citizen! The games of Emperor Titus have commenced. Ensure your tessera token is ready for the imperial tribune.',
    initialNarration: 'You step into the grand travertine colosseum of Imperial Rome in 80 AD. Fifty thousand citizens cheer as bronze war trumpets echo through the sunlit arena.'
  },
  {
    id: 'feudal-japan',
    name: 'Feudal Japan',
    tagline: 'Kyoto Ginkaku-ji & Samurai Shogunate',
    objective: 'Walk across the Taiko-bashi moon bridge and inspect the sacred Zen sand garden.',
    dialogueSpeaker: 'Hatamoto Swordsman Kenji',
    dialogueText: 'Sheathe your steel, traveler. This sanctuary belongs to the Shogun. What brings you to the Higashiyama mountain retreat?',
    initialNarration: 'Morning mist curls around the curved wooden pagoda eaves of Kyoto in 1482 AD. Delicate pink cherry blossoms drift gently upon the reflective koi pond.'
  }
];

export default function VirtualWorldPage() {
  const [selectedEra, setSelectedEra] = useState<WorldEra>('ancient-india');
  const [quality, setQuality] = useState<GraphicsQuality>('high');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeLore, setActiveLore] = useState<{ title: string; text: string } | null>(null);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.2);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const currentEraData = WORLD_ERAS.find(e => e.id === selectedEra) || WORLD_ERAS[0];

  // Load available voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      setVoices(avail);
      const natural = avail.findIndex(
        v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Guy'))
      );
      if (natural !== -1) setSelectedVoiceIndex(natural);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Sentence-by-sentence voice narration queue with keep-alive heartbeat
  const speakText = useCallback((textToSpeak: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      setIsSpeaking(false);
      setActiveSubtitle('');
      return;
    }

    window.speechSynthesis.cancel();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    const sentences = textToSpeak
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (sentences.length === 0) return;

    setIsSpeaking(true);
    let index = 0;

    // Heartbeat to prevent Chrome SpeechSynthesis auto-pause bug
    heartbeatRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 6000);

    const speakNext = () => {
      if (index >= sentences.length) {
        setIsSpeaking(false);
        setActiveSubtitle('');
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        return;
      }

      const sentence = sentences[index];
      index++;
      setActiveSubtitle(sentence);

      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = playbackSpeed;
      utterance.volume = 1.0; // 100% full volume

      if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
      }

      utterance.onend = () => speakNext();
      utterance.onerror = () => speakNext();

      (window as any).__vWorldUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }, [isSpeaking, playbackSpeed, voices, selectedVoiceIndex]);

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      setIsSpeaking(false);
      setActiveSubtitle('');
    }
  };

  const handleInteractObject = (objectName: string, lore: string) => {
    setActiveLore({ title: objectName, text: lore });
    if (!completedObjectives.includes(objectName)) {
      setCompletedObjectives(prev => [...prev, objectName]);
    }
    // Speak lore
    speakText(`${objectName}. ${lore}`);
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 ${isFullScreen ? 'p-0 max-w-none' : ''}`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-300" />
                WebGL 3D Engine Active
              </Badge>
              <span className="text-[11px] font-mono text-purple-400 hidden sm:inline">60 FPS Hardware Render</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-white">
              3D Immersive Reality Matrix
            </h1>
          </div>
        </div>

        {/* Quality Selector, Era & Fullscreen */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Era Dropdown / Fast Selector */}
          <div className="flex items-center rounded-xl border border-white/15 bg-black/60 p-1">
            {WORLD_ERAS.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  handleStopSpeech();
                  setSelectedEra(e.id);
                  setActiveLore(null);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono transition ${
                  selectedEra === e.id
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {e.name}
              </button>
            ))}
          </div>

          {/* Graphics Quality */}
          <div className="flex items-center rounded-xl border border-white/15 bg-black/60 p-1">
            {(['low', 'medium', 'high', 'ultra'] as GraphicsQuality[]).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`rounded-lg px-2 py-0.5 text-[11px] font-mono uppercase transition ${
                  quality === q
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Link to Story Odyssey */}
          <Link
            href="/story-config"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-400 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 px-3.5 py-1.5 text-xs font-black text-white shadow-glow-cyan hover:scale-105 transition"
          >
            <span>📜 Launch Story Odyssey</span>
          </Link>

          {/* Link to Character Interaction */}
          <Link
            href="/character-interaction"
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 transition"
          >
            <Users className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">Talk to NPC</span>
          </Link>

          <button
            onClick={toggleFullScreen}
            className="rounded-xl border border-white/15 bg-black/60 p-2 text-gray-300 hover:text-white hover:border-cyan-400 transition"
            title="Toggle Fullscreen 3D View"
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main 3D Experience Viewport */}
      <div className="relative w-full aspect-[16/9] min-h-[580px] max-h-[780px]">
        <VirtualWorldCanvas
          era={selectedEra}
          quality={quality}
          onInteractObject={handleInteractObject}
          isAudioSpeaking={isSpeaking}
        />

        {/* Live Karaoki Subtitles Ticker Overlay */}
        {activeSubtitle && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-full px-4 text-center pointer-events-none animate-in fade-in duration-300">
            <div className="inline-block rounded-xl border border-cyan-400/40 bg-black/80 px-6 py-2.5 backdrop-blur-xl shadow-glow-cyan">
              <p className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                "{activeSubtitle}"
              </p>
            </div>
          </div>
        )}

        {/* In-World Active Dialogue & Lore Inspection Overlay */}
        {activeLore && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-4">
            <GlassCard glow="cyan" className="p-4 sm:p-5 border-cyan-400/50 shadow-glow-card backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <h4 className="font-display text-sm font-bold text-white uppercase">{activeLore.title}</h4>
                </div>
                <button
                  onClick={() => setActiveLore(null)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {activeLore.text}
              </p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Lore Anomaly Logged to Timeline Archive
                </span>
                <button
                  onClick={() => speakText(`${activeLore.title}. ${activeLore.text}`)}
                  className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-900/40"
                >
                  <Volume2 className="h-3 w-3" />
                  <span>Re-read Voice</span>
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Story Objective & Character Audio Console Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Story Objective Panel */}
        <GlassCard glow="purple" className="space-y-3">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Compass className="h-4 w-4 text-purple-400" />
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">Active Timeline Mission</h3>
          </div>
          <p className="text-xs sm:text-sm font-medium text-cyan-200">
            {currentEraData.objective}
          </p>
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-mono uppercase text-gray-400">Discoverable Artifacts in World:</span>
            {[
              'Sunken Tachyon Relic (Center Sanctum)',
              'Sector Vanguard Sentry (Colonnade Post)',
              'Temporal Inscription Beacon (East Terrace)'
            ].map((obj, i) => {
              const isDone = completedObjectives.some(c => obj.includes(c));
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={`h-2 w-2 rounded-full ${isDone ? 'bg-emerald-400' : 'bg-white/20'}`} />
                  <span className={isDone ? 'text-gray-300 line-through' : 'text-gray-400'}>{obj}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Character Dialogue & Narration Panel */}
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#070b18]/90 p-5 backdrop-blur-xl shadow-glow-card space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-400" />
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                Interactive World Voice & Dialogue
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Selector */}
              {voices.length > 0 && (
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                  className="rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[11px] text-gray-300 focus:outline-none"
                >
                  {voices.map((v, i) => (
                    <option key={i} value={i}>
                      {v.name.slice(0, 24)} ({v.lang})
                    </option>
                  ))}
                </select>
              )}

              {/* Play/Mute Narration Button */}
              <button
                onClick={() => speakText(`${currentEraData.initialNarration}. ... ${currentEraData.dialogueSpeaker} says: ${currentEraData.dialogueText}`)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition shadow-md ${
                  isSpeaking
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-glow-purple'
                    : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 shadow-glow-cyan'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span>Mute Narration</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Play Loud Scene Narration</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {currentEraData.initialNarration}
            </p>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center font-display font-bold text-cyan-300 flex-shrink-0">
                {currentEraData.dialogueSpeaker[0]}
              </div>
              <div>
                <span className="font-display text-xs font-bold text-cyan-300 block">
                  {currentEraData.dialogueSpeaker}:
                </span>
                <p className="text-xs italic text-gray-200 mt-0.5">
                  "{currentEraData.dialogueText}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
