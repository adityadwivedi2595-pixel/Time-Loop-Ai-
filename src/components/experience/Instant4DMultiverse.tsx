'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  VirtualWorldCanvas, 
  WorldEra, 
  CameraViewMode 
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
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  MessageSquare, 
  Activity, 
  MapPin, 
  RotateCcw, 
  Users, 
  Eye, 
  Zap, 
  Mic, 
  MicOff, 
  Sword, 
  Target, 
  ArrowRight,
  Flame,
  Radio
} from 'lucide-react';

interface MultiverseHero {
  id: string;
  era: WorldEra;
  title: string;
  name: string;
  role: string;
  period: string;
  image: string;
  gear: string;
  initialMonologue: string;
  npcName: string;
  npcDialogue: string;
  weather: 'rain' | 'sun' | 'mist' | 'sparks' | 'space';
  choices: {
    text: string;
    reaction: string;
    consequence: string;
  }[];
}

const HEROES: MultiverseHero[] = [
  {
    id: 'vikram-ancient-india',
    era: 'ancient-india',
    title: 'The Hydaspes Riverfront Battleline',
    name: 'Commander Vikram',
    role: 'Vanguard Kshatriya Commander',
    period: 'Ancient India (326 BCE)',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
    gear: 'Golden Trishul Spear & Sun-Forged Armor',
    initialMonologue: 'The monsoon clouds hang heavy over the river. The royal war-elephants trumpet along the riverbank as Alexander\'s phalanx prepares to cross.',
    npcName: 'Subedar Senapati Dev',
    npcDialogue: 'Commander Vikram! The Macedonian vanguard is attempting a crossing at the northern bend! What are your orders?',
    weather: 'mist',
    choices: [
      {
        text: 'Advance the War-Elephant Division to hold the crossing!',
        reaction: 'Deploy the royal elephants! Let the thunder of our tusks break their Macedonian phalanx!',
        consequence: 'Enemy river crossing repelled. Northern flank secured.'
      },
      {
        text: 'Form a crescent archer wall along the temple steps!',
        reaction: 'Archers, notch flaming arrows! Light up the river mist and shatter their cavalry!',
        consequence: 'Macedonian cavalry routed under heavy projectile fire.'
      },
      {
        text: 'Lead the vanguard chariot charge in person!',
        reaction: 'Warriors of Bharat, with me! For honor and the sacred land—charge!',
        consequence: 'Heroic direct engagement inspires the imperial army.'
      }
    ]
  },
  {
    id: 'kael-cyberpunk-future',
    era: 'cyberpunk-future',
    title: 'Neo-Varanasi Sector 7 Data-Spire',
    name: 'Kael "Zero"',
    role: 'Ghost-Class Cyber Netrunner',
    period: 'Cyberpunk 2099',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    gear: 'Plasma Data-Blade & Neural Cybernetic Deck',
    initialMonologue: 'Acid rain streaks across my tactical visor. The Megacorp security drones are sweeping the neon rooftops above.',
    npcName: 'Broker Veda (Radio Link)',
    npcDialogue: 'Kael, you are inside the mainframe perimeter! The Black Ice firewall is decrypting your neural signature. You have sixty seconds!',
    weather: 'rain',
    choices: [
      {
        text: 'Inject polymorphic counter-virus into the sub-grid!',
        reaction: 'Overriding ICE nodes! Megacorp defense grids shutting down across Sector Seven!',
        consequence: 'Spire mainframe breached; encrypted chronal files downloaded.'
      },
      {
        text: 'Overload the city power conduits to cause a blackout!',
        reaction: 'Grid transformer overloaded! Neon lights across the district collapse into darkness!',
        consequence: 'Covert extraction enabled in the citywide blackout.'
      },
      {
        text: 'Hack the airborne hunter-drones to turn on their handlers!',
        reaction: 'Hunter-drones hijacked! Weapon systems recalibrated against corporate enforcers!',
        consequence: 'Air superiority achieved. Escape route opened.'
      }
    ]
  },
  {
    id: 'lyra-space-civilization',
    era: 'space-civilization',
    title: 'Kepler Orbital Warp Station',
    name: 'Pilot Lyra Vance',
    role: 'Singularity Gate Navigation Officer',
    period: 'Deep Space (2340 AD)',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    gear: 'Quantum Scanner & Tachyon Flight Helmet',
    initialMonologue: 'Iridescent violet nebulae fill the panoramic viewport. The artificial gravity oscillates as a supernova shockwave strikes our warp rings.',
    npcName: 'Station AI Prometheus',
    npcDialogue: 'Warning: Singularity Gate containment at forty-two percent. Tachyon leakage will trigger spacetime rupture in forty seconds!',
    weather: 'space',
    choices: [
      {
        text: 'Manually calibrate the magnetic containment rings!',
        reaction: 'Rerouting plasma flux to containment coils! Magnetic seal holding at ninety-eight percent!',
        consequence: 'Orbital station saved from singularity collapse.'
      },
      {
        text: 'Fire antimatter divergence thrusters to alter trajectory!',
        reaction: 'Antimatter thrusters firing! Gravity fluctuations subsiding across sectors three and four!',
        consequence: 'Station pushed back safely from the event horizon.'
      },
      {
        text: 'Broadcast quantum distress beacon across the multiverse!',
        reaction: 'Quantum subspace beacon transmitted across all timeline frequencies!',
        consequence: 'Temporal rescue fleet acknowledges signal.'
      }
    ]
  },
  {
    id: 'galahad-medieval-kingdom',
    era: 'medieval-kingdom',
    title: 'High Citadel Ramparts under Siege',
    name: 'Sir Galahad the Ironclad',
    role: 'Royal Knight Champion',
    period: 'Medieval Keep (1190 AD)',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    gear: 'Damascus Steel Sword & Royal Kite Shield',
    initialMonologue: 'My steel armor clanks heavily on the castle stones. Smoke and sulfur choke the night air as flaming catapult pitch sails overhead.',
    npcName: 'Captain of the Guard',
    npcDialogue: 'Sir Galahad! Thank the heavens you have arrived! The siege trebuchets have breached the outer wall! Lead us into the breach!',
    weather: 'sparks',
    choices: [
      {
        text: 'Draw your sword and lead the courtyard counter-charge!',
        reaction: 'For the King and the realm! Draw your steel, men—push them back into the moat!',
        consequence: 'Courtyard breach repelled. Knights rally to your royal banner.'
      },
      {
        text: 'Command the rampart archers to release flaming volleys!',
        reaction: 'Archers, release! Burn their siege towers to cinders before they reach our stone!',
        consequence: 'Enemy siege towers engulfed in flames.'
      },
      {
        text: 'Barricade the inner portcullis to protect the royal lineage!',
        reaction: 'Drop the iron portcullis! We hold this gate until dawn, or die in honor!',
        consequence: 'Royal sanctuary secured behind heavy iron bars.'
      }
    ]
  },
  {
    id: 'ankhef-ancient-egypt',
    era: 'ancient-egypt',
    title: 'Great Pyramid Solar Chamber',
    name: 'High Priest Ankh-ef',
    role: 'Solar Chronomancer of Amun-Ra',
    period: 'Ancient Egypt (1340 BCE)',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    gear: 'Golden Solar Ankh Staff & Lapis Bracers',
    initialMonologue: 'Golden sand drifts across the sacred granite floor. The hieroglyphs carved into the obelisks glow with otherworldly azure tachyon light.',
    npcName: 'Astronomer Senmut',
    npcDialogue: 'High Priest Ankh-ef! The stars of Orion have halted in their course! The sacred golden capstone is spinning backward!',
    weather: 'sun',
    choices: [
      {
        text: 'Strike your Solar Ankh staff into the altar conduits!',
        reaction: 'By the eternal power of Amun-Ra, let the cosmic disc resume its celestial path!',
        consequence: 'Azure hieroglyphs flare. Solar alignment restored.'
      },
      {
        text: 'Rotate the golden pyramid capstone toward Sirius!',
        reaction: 'The capstone aligns! The tachyon energy flows upward into the heavens!',
        consequence: 'Pyramid apex beams gold light into the night sky.'
      },
      {
        text: 'Chant the sacred verses from the Papyrus of Chronos!',
        reaction: 'The prophecy unfolds: time is not a straight line, but an eternal sacred loop!',
        consequence: 'Ancient wisdom logged to the timeline archive.'
      }
    ]
  }
];

export function Instant4DMultiverse() {
  const [selectedHeroIndex, setSelectedHeroIndex] = useState(0);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('first');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [customVoiceInput, setCustomVoiceInput] = useState('');
  const [isAiDeliberating, setIsAiDeliberating] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  const hero = HEROES[selectedHeroIndex];
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Speech Voices
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

  // Web Audio Synthesizer: 4D Bass Warp & Shockwaves
  const triggerAudioSfx = (type: 'warp' | 'boom') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'warp') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 1.0);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.9);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {}
  };

  // Full-Volume Non-Stop Speech Narration with Keep-Alive Heartbeat
  const speakDialogue = useCallback((fullText: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    const sentences = fullText
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (sentences.length === 0) return;

    setIsSpeaking(true);
    let index = 0;

    // Chrome keep-alive heartbeat every 5 seconds
    heartbeatRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);

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
      utterance.volume = 1.0;
      utterance.rate = 1.2;

      if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
      }

      utterance.onend = () => speakNext();
      utterance.onerror = () => speakNext();

      (window as any).__4dHeroUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }, [voices, selectedVoiceIndex]);

  // When changing character, trigger audio warp and speak monologue immediately
  const handleSelectHero = (index: number) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSelectedHeroIndex(index);
    triggerAudioSfx('warp');
    const selected = HEROES[index];
    setTimeout(() => {
      speakDialogue(`Materializing as ${selected.name} in ${selected.period}. ${selected.initialMonologue} ... ${selected.npcName} shouts: ${selected.npcDialogue}`);
    }, 400);
  };

  // Execute Tactical Choice
  const handleSelectChoice = (choice: typeof hero.choices[0]) => {
    triggerAudioSfx('boom');
    setShockwaveActive(true);
    setTimeout(() => setShockwaveActive(false), 1000);
    speakDialogue(`${choice.reaction} ... Consequence: ${choice.consequence}`);
  };

  // Microphone Recognition
  const toggleMicrophone = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message below.');
      return;
    }

    if (micActive) {
      setMicActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.onstart = () => setMicActive(true);
      recognition.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        setCustomVoiceInput(spoken);
        handleSendVoiceCommand(spoken);
        setMicActive(false);
      };
      recognition.onerror = () => setMicActive(false);
      recognition.onend = () => setMicActive(false);
      recognition.start();
    } catch {
      setMicActive(false);
    }
  };

  // Send Command to Companion NPC via NVIDIA NIM
  const handleSendVoiceCommand = async (textToSend?: string) => {
    const text = (textToSend || customVoiceInput).trim();
    if (!text || isAiDeliberating) return;

    setCustomVoiceInput('');
    setIsAiDeliberating(true);

    try {
      const res = await fetch('/api/ai/character-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: hero.npcName,
          characterRole: 'Companion Sentry',
          eraName: hero.period,
          backstory: `Comrade standing beside ${hero.name} in ${hero.period}.`,
          userMessage: `I am ${hero.name}. ${text}`
        })
      });

      const data = await res.json();
      const reply = data.reply || `Orders understood, ${hero.name}! Proceeding at once!`;
      speakDialogue(`${hero.npcName}: ${reply}`);
    } catch {
      speakDialogue(`${hero.npcName}: Commander ${hero.name}, orders confirmed! We stand with you!`);
    } finally {
      setIsAiDeliberating(false);
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 ${shockwaveActive ? 'animate-rumble' : ''}`}>
      {/* SECTION HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-950/40 px-4 py-1.5 text-xs font-mono text-cyan-300 shadow-glow-cyan">
          <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>INSTANT 4D IN-PERSON MULTIVERSE SIMULATOR</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Step Inside the Story. <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">Live History in First-Person.</span>
        </h2>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-300">
          Click any character below. The living 3D world instantly adapts to their era with First-Person hands, real-time voice, weapon strikes, and live choices.
        </p>
      </div>

      {/* 5-CHARACTER QUICK SELECTOR CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {HEROES.map((h, i) => {
          const isSelected = selectedHeroIndex === i;
          return (
            <button
              key={h.id}
              onClick={() => handleSelectHero(i)}
              className={`text-left rounded-2xl border p-3.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/60 shadow-glow-cyan text-white scale-[1.03] ring-2 ring-cyan-400/40'
                  : 'border-white/10 bg-black/50 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                <img src={h.image} alt={h.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 font-bold">
                  {h.period.split('(')[0]}
                </span>
                {isSelected && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>

              <div>
                <h4 className="font-display text-xs sm:text-sm font-bold text-white line-clamp-1">{h.name}</h4>
                <p className="text-[11px] text-purple-300 line-clamp-1">{h.role}</p>
              </div>

              <div className="text-[10px] font-mono font-bold flex items-center gap-1 text-cyan-400">
                <span>{isSelected ? '✓ IN PERSON' : 'BECOME THIS'}</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* LIVING 3D 4D VIEWPORT (ALWAYS VISIBLE & INTERACTIVE!) */}
      <div className="rounded-3xl border-2 border-cyan-500/40 bg-[#040714] p-4 sm:p-6 shadow-2xl space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 animate-pulse shadow-glow-cyan" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm sm:text-base font-black text-white">
                  {hero.name}
                </span>
                <Badge variant="cyan">{hero.period}</Badge>
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                Equipped: <span className="text-cyan-300">{hero.gear}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Replay Narration Audio */}
            <button
              onClick={() => speakDialogue(`${hero.name} speaking: ${hero.initialMonologue} ... ${hero.npcName} says: ${hero.npcDialogue}`)}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-900/60 transition"
              title="Speak scene out loud"
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>Voice Narration</span>
            </button>

            {/* 4D Shockwave Rumble */}
            <button
              onClick={() => {
                triggerAudioSfx('boom');
                setShockwaveActive(true);
                setTimeout(() => setShockwaveActive(false), 1000);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/40 px-3 py-1.5 text-xs font-mono text-amber-300 hover:bg-amber-900/60 transition"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
              <span>4D Shockwave</span>
            </button>
          </div>
        </div>

        {/* 3D WebGL Living Canvas Viewport */}
        <div className="relative w-full aspect-[21/9] min-h-[480px] max-h-[720px] rounded-2xl overflow-hidden border border-cyan-500/40 bg-black">
          <VirtualWorldCanvas
            era={hero.era}
            quality="high"
            cameraMode={cameraMode}
            onCameraModeChange={setCameraMode}
            isAudioSpeaking={isSpeaking}
          />

          {/* Subtitles Ticker */}
          {activeSubtitle && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-full px-4 text-center pointer-events-none animate-in fade-in">
              <div className="inline-block rounded-2xl border border-cyan-400/50 bg-black/90 px-6 py-2.5 backdrop-blur-xl shadow-glow-cyan">
                <p className="font-display text-xs sm:text-sm font-bold text-white tracking-wide">
                  "{activeSubtitle}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* IN-PERSON TACTICAL CHOICES & COMPANION NPC INTERACTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
          {/* 3 Big Action Choices */}
          <div className="md:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-2">
                <Sword className="h-4 w-4 text-cyan-400" />
                <span>What will you do, {hero.name}? (Click to Act):</span>
              </span>
            </div>

            {hero.choices.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectChoice(c)}
                className="w-full text-left rounded-xl border border-white/10 bg-white/[0.04] p-3.5 hover:border-cyan-400 hover:bg-cyan-950/40 transition group space-y-1 cursor-pointer"
              >
                <div className="font-display text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-2">
                  <span className="h-5 w-5 rounded-md bg-purple-600/40 border border-purple-500/50 flex items-center justify-center text-[11px] font-mono text-purple-300 font-bold">
                    {idx + 1}
                  </span>
                  <span>{c.text}</span>
                </div>
                <p className="text-[11px] text-gray-400 pl-7">{c.consequence}</p>
              </button>
            ))}
          </div>

          {/* Companion NPC Chat & Orders */}
          <div className="md:col-span-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="font-display text-xs font-bold text-white">
                    Companion: {hero.npcName}
                  </span>
                </div>
                <button
                  onClick={() => speakDialogue(`${hero.npcName}: ${hero.npcDialogue}`)}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <Volume2 className="h-3 w-3" />
                  <span>Replay</span>
                </button>
              </div>
              <p className="text-xs text-gray-200 italic mt-2 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                "{hero.npcDialogue}"
              </p>
            </div>

            {/* Voice Command or Typing Input */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMicrophone}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
                    micActive 
                      ? 'bg-rose-600 text-white animate-pulse' 
                      : 'bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600/50'
                  }`}
                  title={micActive ? 'Listening... click to stop' : 'Speak voice command to NPC'}
                >
                  {micActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                <input
                  type="text"
                  value={customVoiceInput}
                  onChange={(e) => setCustomVoiceInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendVoiceCommand()}
                  placeholder={`Command ${hero.npcName}...`}
                  className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                />

                <button
                  onClick={() => handleSendVoiceCommand()}
                  disabled={isAiDeliberating || !customVoiceInput.trim()}
                  className="rounded-xl bg-purple-600 hover:bg-purple-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-40 transition cursor-pointer"
                >
                  {isAiDeliberating ? 'Thinking...' : 'Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
