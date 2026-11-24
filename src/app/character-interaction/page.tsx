'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Sparkles, 
  Users, 
  Compass, 
  ArrowLeft, 
  Play, 
  Pause,
  Box,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'character';
  text: string;
  timestamp: string;
}

const PRESET_CHARACTERS = [
  {
    name: 'Vanguard Commander Vikram',
    role: 'Imperial Warrior',
    era: 'Ancient India',
    backstory: 'Guardian of the sacred ghats and defender against invading dynastic armies, bound by sacred honor.',
    avatar: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=400&q=80',
    greeting: 'Halt your footsteps, stranger! That brass sphere has been oscillating since the vermillion dawn. Are you an imperial scholar or a foreign spy?'
  },
  {
    name: 'Kaelen Voss (Zero-Nine)',
    role: 'Cyber Netrunner',
    era: 'Cyberpunk 2099',
    backstory: 'A rogue neural hacker hunted by the megacorps for stealing a classified chronal drive from the orbital grid.',
    avatar: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=80',
    greeting: 'Keep your visor down. Security gunships are sweeping the highway. The chronal core is redlining — talk fast before the ping traces back.'
  },
  {
    name: 'Commander Lyra Vance',
    role: 'Deep Space Navigator',
    era: 'Space Civilization 3420',
    backstory: 'Chief astrophysicist aboard Kepler Singularity Station, studying tachyon anomalies across uncharted nebulae.',
    avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    greeting: 'Tachyon sensors detected your entry vector across the singularity horizon. Welcome aboard Kepler Station. State your timeline coordinates.'
  },
  {
    name: 'Sir Galahad the Ironclad',
    role: 'Knight Protector',
    era: 'Medieval Kingdom',
    backstory: 'A sworn sentinel of the royal keep holding the fortress against treacherous siege engines.',
    avatar: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80',
    greeting: 'Draw no steel within these royal walls! The siege horns sound beyond the river. By whose decree do you cross the castle gates?'
  }
];

export default function CharacterInteractionPage() {
  const [characters, setCharacters] = useState(PRESET_CHARACTERS);
  const [selectedCharIndex, setSelectedCharIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [speechRate, setSpeechRate] = useState(1.2);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  const activeChar = characters[selectedCharIndex];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

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

    // Load any user-created characters from library
    fetch('/api/characters')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.characters && data.characters.length > 0) {
          const userChars = data.characters.map((c: any) => ({
            name: c.name,
            role: c.role || 'Protagonist',
            era: c.era_name || 'Alternate History',
            backstory: c.backstory || 'A hero forged across the temporal streams.',
            avatar: c.image_url || 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=400&q=80',
            greeting: `Greetings, traveller. I am ${c.name}. How can we shape this era together?`
          }));
          setCharacters([...PRESET_CHARACTERS, ...userChars]);
        }
      })
      .catch(() => {});

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Initialize chat when character changes
  useEffect(() => {
    setMessages([
      {
        id: 'initial',
        sender: 'character',
        text: activeChar.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    speakDialogue(activeChar.greeting);
  }, [selectedCharIndex]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak dialogue with sentence chunking + keepalive heartbeat
  const speakDialogue = useCallback((fullText: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    // Split into sentences so Chrome never stops prematurely
    const sentenceChunks = fullText
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (sentenceChunks.length === 0) return;

    setIsSpeaking(true);
    let currentIndex = 0;

    // Heartbeat to prevent Chrome SpeechSynthesis garbage-collection bug
    heartbeatRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 6000);

    const speakNextSentence = () => {
      if (currentIndex >= sentenceChunks.length) {
        setIsSpeaking(false);
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        return;
      }

      const sentence = sentenceChunks[currentIndex];
      currentIndex++;

      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.volume = speechVolume;
      utterance.rate = speechRate;

      if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
      }

      utterance.onend = () => speakNextSentence();
      utterance.onerror = () => speakNextSentence();

      (window as any).__chatUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNextSentence();
  }, [speechVolume, speechRate, voices, selectedVoiceIndex]);

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      setIsSpeaking(false);
    }
  };

  // Web Speech API Voice Recognition (Microphone)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your message below.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        sendMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Send message to NVIDIA NIM character chat endpoint
  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    handleStopSpeech();

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map(m => ({
        sender: m.sender === 'user' ? 'User' : activeChar.name,
        text: m.text
      }));

      const res = await fetch('/api/ai/character-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterName: activeChar.name,
          characterRole: activeChar.role,
          eraName: activeChar.era,
          backstory: activeChar.backstory,
          userMessage: text,
          history
        })
      });

      const data = await res.json();
      const charReply = data.reply || 'The temporal rift vibrates with static, but I hear your call!';

      const replyMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: 'character',
        text: charReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, replyMsg]);
      speakDialogue(charReply);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `c-err-${Date.now()}`,
        sender: 'character',
        text: 'The chronal connection fluctuates, but I remain bound to this timeline with you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      speakDialogue(fallbackMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/character-studio" className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-purple-300" />
                Live 2-Way Voice Conversation
              </Badge>
              <span className="text-[11px] font-mono text-cyan-400 hidden sm:inline">NVIDIA NIM In-Character Dialogue</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
              Character Interaction Studio
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/virtual-world"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-bold text-cyan-300 shadow-glow-cyan hover:bg-cyan-900/60 transition"
          >
            <Box className="h-3.5 w-3.5 text-cyan-400" />
            <span>3D World</span>
          </Link>

          <Link
            href="/character-studio"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition"
          >
            <Users className="h-3.5 w-3.5 text-purple-400" />
            <span>Character Studio</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Character Selector & Acoustic Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Character Profile Card */}
          <GlassCard glow="purple" className="space-y-4 text-center p-6">
            <div className="relative mx-auto h-28 w-28 rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-glow-purple">
              <img
                src={activeChar.avatar}
                alt={activeChar.name}
                className="h-full w-full object-cover"
              />
              {isSpeaking && (
                <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    <span className="h-5 w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="h-8 w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="h-6 w-1 bg-pink-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-white">{activeChar.name}</h2>
              <p className="text-xs text-cyan-300 font-medium">{activeChar.role} • {activeChar.era}</p>
              <p className="mt-2 text-xs text-gray-400 line-clamp-3 leading-relaxed">{activeChar.backstory}</p>
            </div>

            {/* Speaking State Indicator */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2">
              {isSpeaking ? (
                <button
                  onClick={handleStopSpeech}
                  className="flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-mono text-rose-300 hover:bg-rose-500/30 transition"
                >
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>Stop Speaking</span>
                </button>
              ) : (
                <button
                  onClick={() => speakDialogue(messages[messages.length - 1]?.text || activeChar.greeting)}
                  className="flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-1 text-xs font-mono text-cyan-300 hover:bg-cyan-500/30 transition"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Replay Voice</span>
                </button>
              )}
            </div>
          </GlassCard>

          {/* Voice & Acoustic Engine Settings */}
          <GlassCard className="space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-purple-400" />
              Chrono-Voice Acoustic Controls
            </h3>

            {/* Voice Dropdown */}
            {voices.length > 0 && (
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Voice Profile</label>
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-2 py-1.5 text-xs text-gray-200 focus:border-purple-400 focus:outline-none"
                >
                  {voices.map((v, i) => (
                    <option key={i} value={i}>
                      {v.name.slice(0, 30)} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Volume</span>
                  <span className="font-mono text-cyan-300">{Math.round(speechVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span>Pacing</span>
                  <span className="font-mono text-purple-300">{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.6"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="w-full accent-purple-400 h-1 bg-white/10 rounded cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* Select Character List */}
          <GlassCard className="space-y-2">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Switch Character ({characters.length})
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {characters.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCharIndex(i)}
                  className={`w-full flex items-center gap-2.5 rounded-lg p-2 text-left transition ${
                    selectedCharIndex === i
                      ? 'border border-purple-500/50 bg-purple-950/40 text-white'
                      : 'border border-white/5 bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <img src={c.avatar} alt={c.name} className="h-7 w-7 rounded-full object-cover border border-white/10" />
                  <div className="truncate">
                    <p className="text-xs font-semibold leading-tight truncate">{c.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{c.role} • {c.era}</p>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right: Live Dialogue & Voice Interaction Box */}
        <div className="lg:col-span-8 flex flex-col h-[650px] rounded-2xl border border-white/10 bg-[#050812]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Top Chat Bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-3.5 bg-black/40">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="font-display text-xs font-bold text-white tracking-wider uppercase">
                {activeChar.name} (Online)
              </span>
            </div>
            <span className="text-[11px] font-mono text-purple-300">
              {activeChar.era} Timeline
            </span>
          </div>

          {/* Chat Transcript */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-gray-400 font-mono">
                  <span>{m.sender === 'user' ? 'You' : activeChar.name}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-lg ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none border border-purple-400/30'
                      : 'bg-[#0f172a] text-gray-100 rounded-bl-none border border-white/10 shadow-glow-cyan/10'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.sender === 'character' && (
                    <button
                      onClick={() => speakDialogue(m.text)}
                      className="mt-2 flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition"
                      title="Speak aloud"
                    >
                      <Volume2 className="h-3 w-3" />
                      <span>Speak Aloud</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-purple-300 font-mono p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl w-fit">
                <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                <span>{activeChar.name} is deliberating in NVIDIA NIM...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Input & Text Control Bar */}
          <div className="border-t border-white/10 bg-black/60 p-4 space-y-3">
            <div className="flex items-center gap-2">
              {/* Microphone / Speech Recognition Button */}
              <button
                onClick={toggleSpeechRecognition}
                className={`flex items-center justify-center h-12 w-12 rounded-xl transition shadow-lg ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-glow-purple'
                    : 'bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30'
                }`}
                title={isListening ? 'Listening... Click to stop' : 'Click to Speak via Microphone'}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isListening ? 'Listening to your voice...' : `Ask or say something to ${activeChar.name}...`}
                className="flex-1 rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
              />

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold hover:opacity-95 disabled:opacity-40 transition shadow-glow-purple"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
              <span>Press [Enter] or tap Mic to speak</span>
              <span>Full-volume sentence engine enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
