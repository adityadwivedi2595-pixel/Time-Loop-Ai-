'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  IndianMonument, 
  getMonumentThenAndNow 
} from '@/data/indian-monuments';
import { 
  getMonumentBespokeOrGeneratedTour, 
  BespokeTourStepData 
} from '@/data/heritage-tour-data';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Languages, 
  Gauge, 
  Mic,
  BookOpen,
  History,
  Layers,
  Compass
} from 'lucide-react';

interface CinematicStructureTourProps {
  monument: IndianMonument;
  language?: 'hi' | 'en';
  onLanguageChange?: (lang: 'hi' | 'en') => void;
}

interface TourStep extends BespokeTourStepData {
  id: string;
  image: string;
  modernImage?: string;
}

export function CinematicStructureTour({
  monument,
  language = 'hi',
  onLanguageChange
}: CinematicStructureTourProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'hi' | 'en'>(language);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.85); // 0.85x: Warm, natural human guide pace
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [showCompletionBanner, setShowCompletionBanner] = useState<boolean>(false);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<'male' | 'female'>('male');
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSpeechSynthesisActiveRef = useRef<boolean>(false);
  const isSpeechPausedRef = useRef<boolean>(false);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const monumentIdRef = useRef<string>(monument.id);

  const activeStepIndexRef = useRef<number>(activeStepIndex);
  const currentLanguageRef = useRef<'hi' | 'en'>(currentLanguage);
  const selectedVoiceGenderRef = useRef<'male' | 'female'>(selectedVoiceGender);
  const isPlayingRef = useRef<boolean>(isPlaying);

  useEffect(() => { monumentIdRef.current = monument.id; }, [monument.id]);
  useEffect(() => { activeStepIndexRef.current = activeStepIndex; }, [activeStepIndex]);
  useEffect(() => { currentLanguageRef.current = currentLanguage; }, [currentLanguage]);
  useEffect(() => { selectedVoiceGenderRef.current = selectedVoiceGender; }, [selectedVoiceGender]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Sync external language if provided
  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  // Load saved voice gender preference (male/female)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('timeloop_voice_gender');
      if (saved === 'female' || saved === 'male') {
        setSelectedVoiceGender(saved);
      }
    } catch {}
  }, []);

  const handleLanguageToggle = (lang: 'hi' | 'en') => {
    setCurrentLanguage(lang);
    if (onLanguageChange) onLanguageChange(lang);
    if (isTourActive) {
      advanceToStep(activeStepIndexRef.current, lang, selectedVoiceGenderRef.current);
    }
  };

  // Build the 4 distinct, verified tour steps for this monument
  const tourSteps: TourStep[] = useMemo(() => {
    const rawSteps = getMonumentBespokeOrGeneratedTour(monument);
    const thenAndNow = getMonumentThenAndNow(monument);
    const primaryPhotoUrl = monument.photos[0]?.url || `/images/monuments/${monument.id}.jpg`;
    const featurePhotoUrl = monument.photos[1]?.url || primaryPhotoUrl;
    const secretPhotoUrl = monument.photos[2]?.url || featurePhotoUrl;

    return rawSteps.map((s, idx) => {
      let img = primaryPhotoUrl;
      let modernImg: string | undefined = undefined;

      if (s.tag === 'TIME_TRAVEL') {
        img = thenAndNow.thenUrl || primaryPhotoUrl;
        modernImg = thenAndNow.nowUrl || primaryPhotoUrl;
      } else if (s.tag === 'ARCHITECTURE') {
        img = featurePhotoUrl;
      } else if (s.tag === 'SECRET') {
        img = secretPhotoUrl;
      }

      return {
        ...s,
        id: `step-${idx + 1}-${s.tag.toLowerCase()}`,
        image: img,
        modernImage: modernImg
      };
    });
  }, [monument]);

  // Proactively pre-fetch and cache audio for all steps of this monument
  useEffect(() => {
    let isCancelled = false;
    const preloadAllSteps = async () => {
      for (let i = 0; i < tourSteps.length; i++) {
        if (isCancelled) break;
        const step = tourSteps[i];
        const lang = currentLanguage;
        const gender = selectedVoiceGender;
        const cacheKey = `${monument.id}:${lang}:${gender}:${i}`;
        if (audioCacheRef.current.has(cacheKey)) continue;

        const textToSpeak = lang === 'hi' ? step.spokenHi : step.spokenEn;
        const voiceName = lang === 'hi'
          ? (gender === 'female' ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural')
          : (gender === 'female' ? 'en-IN-NeerjaNeural' : 'en-IN-PrabhatNeural');

        try {
          const res = await fetch('/api/heritage-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToSpeak, voice: voiceName, lang })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.audioUrl && !isCancelled) {
              audioCacheRef.current.set(cacheKey, data.audioUrl);
              const preloader = new Audio();
              preloader.src = data.audioUrl;
            }
          }
        } catch {}
      }
    };
    preloadAllSteps();
    return () => { isCancelled = true; };
  }, [monument.id, currentLanguage, selectedVoiceGender, tourSteps]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
  }, []);

  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
    if (typeof window !== 'undefined') {
      (window as any).__activeUtterance = null;
    }
    isSpeechSynthesisActiveRef.current = false;
    isSpeechPausedRef.current = false;
    clearTimers();
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsAudioLoading(false);
  }, [clearTimers]);

  // Clean up and reset tour state on monument change or unmount
  useEffect(() => {
    stopAllAudio();
    audioCacheRef.current.clear(); // Purge cache to prevent cross-monument audio leakage
    setIsTourActive(false);
    setActiveStepIndex(0);
    activeStepIndexRef.current = 0;
    setShowCompletionBanner(false);
    setProgressPercent(0);
    setCurrentTimeSec(0);
    return () => {
      stopAllAudio();
    };
  }, [monument.id, stopAllAudio]);

  // Reliable speech synthesis fallback when Edge TTS or audio playback is blocked
  const playSpeechFallback = useCallback(
    (stepIdx: number, lang: 'hi' | 'en' = currentLanguageRef.current, gender: 'male' | 'female' = selectedVoiceGenderRef.current) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const step = tourSteps[stepIdx];
      if (!step) return;

      const text = lang === 'hi' ? step.spokenHi : step.spokenEn;

      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      activeUtteranceRef.current = utterance;
      (window as any).__activeUtterance = utterance; // Prevent Chrome garbage collector cutoff bug
      isSpeechSynthesisActiveRef.current = true;
      isSpeechPausedRef.current = false;

      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = speechSpeed;

      const voices = window.speechSynthesis.getVoices();
      const langVoices = voices.filter(v => v.lang.startsWith(lang));
      const targetVoice = langVoices.find(v => {
        const n = v.name.toLowerCase();
        if (gender === 'female') {
          return n.includes('female') || n.includes('swara') || n.includes('kalpana') || n.includes('neerja') || n.includes('zira') || n.includes('google');
        } else {
          return n.includes('male') || n.includes('madhur') || n.includes('prabhat') || n.includes('hemant') || n.includes('david');
        }
      }) || langVoices[0] || voices[0];

      if (targetVoice) utterance.voice = targetVoice;

      utterance.onstart = () => {
        setIsPlaying(true);
        isPlayingRef.current = true;
        setIsAudioLoading(false);

        // Anti-freeze heartbeat pulse for Chrome/Edge 14-second cutoff
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        heartbeatRef.current = setInterval(() => {
          if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
          }
        }, 5000);
      };

      utterance.onend = () => {
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        activeUtteranceRef.current = null;
        (window as any).__activeUtterance = null;
        isSpeechSynthesisActiveRef.current = false;
        isSpeechPausedRef.current = false;
        setIsPlaying(false);
        isPlayingRef.current = false;
        setProgressPercent(100);

        const nextIdx = activeStepIndexRef.current + 1;
        if (nextIdx < tourSteps.length) {
          timerRef.current = setTimeout(() => {
            advanceToStep(nextIdx, lang, gender);
          }, 1200);
        } else {
          handleTourComplete();
        }
      };

      utterance.onerror = (e) => {
        console.warn('[SpeechSynthesis error]:', e);
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        activeUtteranceRef.current = null;
        (window as any).__activeUtterance = null;
        isSpeechSynthesisActiveRef.current = false;
        isSpeechPausedRef.current = false;
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsAudioLoading(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [tourSteps, speechSpeed]
  );

  // Load and play the audio stream for the current step
  const loadAudioForStep = useCallback(
    async (
      stepIdx: number,
      lang: 'hi' | 'en' = currentLanguageRef.current,
      autoPlay = true,
      overrideGender?: 'male' | 'female'
    ) => {
      stopAllAudio();
      activeStepIndexRef.current = stepIdx;
      setActiveStepIndex(stepIdx);
      setProgressPercent(0);
      setCurrentTimeSec(0);
      setDurationSec(0);

      const step = tourSteps[stepIdx];
      if (!step) return;

      const effectiveGender = overrideGender ?? selectedVoiceGenderRef.current;
      const cacheKey = `${monument.id}:${lang}:${effectiveGender}:${stepIdx}`;
      const cachedUrl = audioCacheRef.current.get(cacheKey);

      // Fast-path: already in client memory
      if (cachedUrl && audioRef.current) {
        if (monumentIdRef.current !== monument.id) return;
        setAudioUrl(cachedUrl);
        audioRef.current.src = cachedUrl;
        audioRef.current.playbackRate = speechSpeed;
        audioRef.current.volume = 1.0;
        audioRef.current.muted = isMuted;

        if (autoPlay && !isMuted) {
          audioRef.current.play().then(() => {
            if (monumentIdRef.current !== monument.id) return;
            setIsPlaying(true);
            isPlayingRef.current = true;
            setIsAudioLoading(false);
          }).catch((err) => {
            console.warn('[Cached audio autoplay blocked, fallback to SpeechSynthesis]:', err);
            setIsAudioLoading(false);
            playSpeechFallback(stepIdx, lang, effectiveGender);
          });
        }
        return;
      }

      setIsAudioLoading(true);
      const textToSpeak = lang === 'hi' ? step.spokenHi : step.spokenEn;
      let voiceName = lang === 'hi'
        ? (effectiveGender === 'female' ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural')
        : (effectiveGender === 'female' ? 'en-IN-NeerjaNeural' : 'en-IN-PrabhatNeural');

      try {
        const response = await fetch('/api/heritage-tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textToSpeak,
            voice: voiceName,
            lang
          })
        });

        if (!response.ok) {
          throw new Error(`TTS server responded with ${response.status}`);
        }

        const data = await response.json();
        if (!data.audioUrl) {
          throw new Error('No audioUrl in response');
        }

        if (monumentIdRef.current !== monument.id) {
          // Monument changed while fetching, ignore stale audio
          return;
        }

        audioCacheRef.current.set(cacheKey, data.audioUrl);
        setAudioUrl(data.audioUrl);

        if (audioRef.current && activeStepIndexRef.current === stepIdx) {
          audioRef.current.src = data.audioUrl;
          audioRef.current.playbackRate = speechSpeed;
          audioRef.current.volume = 1.0;
          audioRef.current.muted = isMuted;

          if (autoPlay && !isMuted) {
            audioRef.current.play().then(() => {
              if (monumentIdRef.current !== monument.id) return;
              setIsPlaying(true);
              isPlayingRef.current = true;
              setIsAudioLoading(false);
            }).catch((err) => {
              console.warn('[Autoplay prevented by browser, fallback to SpeechSynthesis]:', err);
              setIsAudioLoading(false);
              playSpeechFallback(stepIdx, lang, effectiveGender);
            });
          }
        }
      } catch (err) {
        console.warn('[Audio load error, fallback to SpeechSynthesis]:', err);
        setIsAudioLoading(false);
        playSpeechFallback(stepIdx, lang, effectiveGender);
      }
    },
    [tourSteps, speechSpeed, isMuted, stopAllAudio, playSpeechFallback]
  );

  // Switch voice gender dynamically and restart currently playing step with the new voice
  const handleVoiceGenderChange = (gender: 'male' | 'female') => {
    setSelectedVoiceGender(gender);
    selectedVoiceGenderRef.current = gender;
    try {
      localStorage.setItem('timeloop_voice_gender', gender);
    } catch {}
    if (isTourActive || isPlayingRef.current) {
      loadAudioForStep(activeStepIndexRef.current, currentLanguageRef.current, true, gender);
    }
  };

  // Advance to step
  const advanceToStep = useCallback(
    (index: number, lang: 'hi' | 'en' = currentLanguageRef.current, gender?: 'male' | 'female') => {
      if (index >= 0 && index < tourSteps.length) {
        setActiveStepIndex(index);
        activeStepIndexRef.current = index;
        loadAudioForStep(index, lang, true, gender ?? selectedVoiceGenderRef.current);
      }
    },
    [tourSteps.length, loadAudioForStep]
  );

  // Start Tour from Step 1 or specific step with audio primed
  const startCinematicTourAtStep = (stepIdx: number = 0) => {
    setShowCompletionBanner(false);
    setIsTourActive(true);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 1.0;
    }
    advanceToStep(stepIdx, currentLanguageRef.current, selectedVoiceGenderRef.current);
  };

  const startCinematicTour = () => {
    startCinematicTourAtStep(0);
  };

  // Complete tour: "KHATM WAPAS MONUMENT KE PHOTO A JAYE"
  const handleTourComplete = () => {
    stopAllAudio();
    setShowCompletionBanner(true);
    setTimeout(() => {
      setIsTourActive(false);
      setActiveStepIndex(0);
      activeStepIndexRef.current = 0;
      setShowCompletionBanner(false);
    }, 3000);
  };

  // User manually exits: wapas monument photo
  const exitTour = () => {
    stopAllAudio();
    setIsTourActive(false);
    setActiveStepIndex(0);
    activeStepIndexRef.current = 0;
    setShowCompletionBanner(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      if (isSpeechSynthesisActiveRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
        isSpeechPausedRef.current = true;
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      setIsMuted(false);
      if (isSpeechSynthesisActiveRef.current && isSpeechPausedRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
        isSpeechPausedRef.current = false;
        setIsPlaying(true);
        isPlayingRef.current = true;
      } else if (audioRef.current && audioRef.current.src && audioRef.current.src !== '' && audioRef.current.currentTime > 0 && !audioRef.current.ended) {
        audioRef.current.volume = 1.0;
        audioRef.current.muted = false;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        }).catch((err) => {
          console.warn('Play resume failed, reloading step audio:', err);
          loadAudioForStep(activeStepIndexRef.current, currentLanguageRef.current, true);
        });
      } else {
        loadAudioForStep(activeStepIndexRef.current, currentLanguageRef.current, true);
      }
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeechSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPct = Math.max(0, Math.min(1, clickX / rect.width));
    audioRef.current.currentTime = newPct * audioRef.current.duration;
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentStep = tourSteps[activeStepIndex] || tourSteps[0];
  const overviewPhoto = monument.photos[0]?.url || `/images/monuments/${monument.id}.jpg`;
  const thenAndNow = getMonumentThenAndNow(monument);

  return (
    <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-[#060c1d] to-[#02050f] overflow-hidden shadow-2xl">
      {/* Mounted DOM HTML5 Audio Element for reliable browser streaming */}
      <audio
        ref={audioRef}
        preload="auto"
        onCanPlay={() => setIsAudioLoading(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDurationSec(Math.round(e.currentTarget.duration || 0))}
        onTimeUpdate={(e) => {
          setCurrentTimeSec(Math.round(e.currentTarget.currentTime || 0));
          if (e.currentTarget.duration) {
            const pct = Math.min(100, Math.round((e.currentTarget.currentTime / e.currentTarget.duration) * 100));
            setProgressPercent(pct);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          isPlayingRef.current = false;
          setProgressPercent(100);
          const nextIdx = activeStepIndexRef.current + 1;
          if (nextIdx < tourSteps.length) {
            timerRef.current = setTimeout(() => {
              advanceToStep(nextIdx, currentLanguageRef.current, selectedVoiceGenderRef.current);
            }, 1200);
          } else {
            handleTourComplete();
          }
        }}
      />

      {/* ========================================================
          MODE 1: OVERVIEW MODE (DEFAULT MONUMENT PHOTO + PINS)
      ======================================================== */}
      {!isTourActive && (
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-black group overflow-hidden">
          {/* Main Monument High-Resolution Photo */}
          <img
            src={overviewPhoto}
            alt={monument.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

          {/* Top Banner & Language Pill */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/40 text-xs font-mono text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{monument.name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-amber-300 font-hindi">{monument.hindiName}</span>
            </div>

            {/* Top Right Controls: Voice Gender & Language Switcher */}
            <div className="flex items-center gap-2">
              {/* Voice Gender Selector in Overview Mode */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono">
                <Mic className="h-3.5 w-3.5 text-cyan-400 ml-1" />
                <button
                  onClick={() => handleVoiceGenderChange('male')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    selectedVoiceGender === 'male' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:text-white'
                  }`}
                  title="पुरुष गाइड आवाज (Male Guide - Madhur)"
                >
                  {currentLanguage === 'hi' ? 'पुरुष गाइड' : 'Male'}
                </button>
                <button
                  onClick={() => handleVoiceGenderChange('female')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    selectedVoiceGender === 'female' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:text-white'
                  }`}
                  title="महिला गाइड आवाज (Female Guide - Swara)"
                >
                  {currentLanguage === 'hi' ? 'महिला गाइड' : 'Female'}
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs font-mono">
                <button
                  onClick={() => handleLanguageToggle('hi')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    currentLanguage === 'hi' ? 'bg-amber-500 text-black' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🇮🇳 हिंदी
                </button>
                <button
                  onClick={() => handleLanguageToggle('en')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    currentLanguage === 'en' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Structural Hotspot Pins on Screen */}
          <div className="absolute inset-0 pointer-events-auto">
            {/* Pin 1: Main Structure */}
            <button
              onClick={() => startCinematicTourAtStep(0)}
              className="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2 group/pin flex items-center gap-2 p-2 rounded-2xl bg-black/80 border border-cyan-400/60 backdrop-blur-md hover:scale-110 transition shadow-glow-cyan cursor-pointer"
              title="इतिहास और निर्माण देखें"
            >
              <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold text-cyan-300 whitespace-nowrap hidden sm:inline">
                🏛️ {currentLanguage === 'hi' ? 'इतिहास व निर्माण' : 'History & Commissioning'}
              </span>
            </button>

            {/* Pin 2: Architectural Deep Dive */}
            <button
              onClick={() => startCinematicTourAtStep(1)}
              className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 group/pin flex items-center gap-2 p-2 rounded-2xl bg-black/80 border border-amber-400/60 backdrop-blur-md hover:scale-110 transition shadow-glow-amber cursor-pointer"
              title="स्थापत्य व बनावट देखें"
            >
              <span className="h-3 w-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold text-amber-300 whitespace-nowrap hidden sm:inline">
                🔍 {currentLanguage === 'hi' ? 'स्थापत्य व बनावट' : 'Architecture & Masonry'}
              </span>
            </button>

            {/* Pin 3: Purana Zamana vs Modern Zamana */}
            <button
              onClick={() => startCinematicTourAtStep(2)}
              className="absolute top-[60%] left-[75%] -translate-x-1/2 -translate-y-1/2 group/pin flex items-center gap-2 p-2 rounded-2xl bg-black/80 border border-purple-400/60 backdrop-blur-md hover:scale-110 transition shadow-glow-purple cursor-pointer"
              title="पुराना बनाम आधुनिक दौर देखें"
            >
              <span className="h-3 w-3 rounded-full bg-purple-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold text-purple-300 whitespace-nowrap hidden sm:inline">
                ⏳ {currentLanguage === 'hi' ? 'पुराना जमाना vs नया दौर' : 'Historical Era vs Modern'}
              </span>
            </button>

            {/* Pin 4: Subterranean Foundations */}
            <button
              onClick={() => startCinematicTourAtStep(3)}
              className="absolute top-[75%] left-[45%] -translate-x-1/2 -translate-y-1/2 group/pin flex items-center gap-2 p-2 rounded-2xl bg-black/80 border border-emerald-400/60 backdrop-blur-md hover:scale-110 transition cursor-pointer"
              title="नींव का रहस्य देखें"
            >
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold text-emerald-300 whitespace-nowrap hidden sm:inline">
                🪵 {currentLanguage === 'hi' ? 'नींव का गुप्त रहस्य' : 'Foundations & Secrets'}
              </span>
            </button>
          </div>

          {/* Bottom Call to Action Hero Card */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/20">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                🎙️ {currentLanguage === 'hi' ? 'संपूर्ण ऐतिहासिक गाइड टूर (इतिहास, निर्माण और रहस्य)' : 'Complete Historical Audio Tour Guide'}
              </span>
              <p className="text-xs sm:text-sm text-gray-200">
                {currentLanguage === 'hi'
                  ? 'इतिहास, बनावट, पुराना ज़माना बनाम नया दौर और नींव के रहस्य — वास्तविक तथ्य टूर गाइड की आवाज में'
                  : 'Genuine history, architectural construction, archival era vs modern conservation, and subterranean secrets'}
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              data-testid="start-tour-btn"
              onClick={startCinematicTour}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-cyan-400 text-white font-display text-xs sm:text-sm font-black tracking-wide shadow-glow-cyan hover:scale-105 transition cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{currentLanguage === 'hi' ? '▶ शुरू करें संपूर्ण गाइड यात्रा' : '▶ START SPOKEN TOUR'}</span>
            </button>
          </div>

          {/* Tour Completed Notification Toast */}
          {showCompletionBanner && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in">
              <div className="p-6 rounded-3xl bg-black/90 border border-cyan-400 text-center space-y-3 max-w-md mx-4 shadow-glow-cyan">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="font-display text-base sm:text-lg font-black text-white">
                  {currentLanguage === 'hi' ? 'यात्रा सम्पन्न!' : 'Walkthrough Completed!'}
                </h3>
                <p className="text-xs text-gray-300">
                  {currentLanguage === 'hi'
                    ? 'आपने इस ऐतिहासिक धरोहर के इतिहास, बनावट, पुराने जमाने और नींव के रहस्यों को देख व सुन लिया है।'
                    : 'You have explored the history, construction, historical archives, and foundations of this monument.'}
                </p>
                <span className="text-[11px] font-mono text-cyan-300 block">
                  {currentLanguage === 'hi' ? 'वापस मुख्य स्मारक फोटो पर आ गए हैं...' : 'Returned to primary monument photo view.'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 2: ACTIVE CINEMATIC STRUCTURE & TIME-TRAVEL TOUR
      ======================================================== */}
      {isTourActive && (
        <div className="flex flex-col bg-black">
          {/* Top Tour Navigation & Voice Guide Controls */}
          <div className="border-b border-white/15 bg-[#030717] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Step Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {tourSteps.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const isPast = idx < activeStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => advanceToStep(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-glow-cyan ring-1 ring-cyan-400'
                        : isPast
                        ? 'bg-white/10 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span className="hidden sm:inline">
                      {currentLanguage === 'hi' 
                        ? (idx === 0 ? 'इतिहास व निर्माण' : idx === 1 ? 'बनावट व वास्तुकला' : idx === 2 ? 'पुराना vs नया दौर' : 'नींव का रहस्य')
                        : (idx === 0 ? 'History' : idx === 1 ? 'Architecture' : idx === 2 ? 'Then vs Now' : 'Secrets')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Voice Gender, Speed, Language & Exit */}
            <div className="flex items-center gap-2">
              {/* Voice Gender Selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/15 text-[11px] font-mono">
                <Mic className="h-3 w-3 text-cyan-400 ml-1" />
                <button
                  data-testid="voice-male-btn"
                  onClick={() => handleVoiceGenderChange('male')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    selectedVoiceGender === 'male' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="पुरुष गाइड आवाज (Male Guide - Madhur Neural)"
                >
                  {currentLanguage === 'hi' ? 'पुरुष गाइड' : 'Male'}
                </button>
                <button
                  data-testid="voice-female-btn"
                  onClick={() => handleVoiceGenderChange('female')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    selectedVoiceGender === 'female' ? 'bg-amber-400 text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="महिला गाइड आवाज (Female Guide - Swara Neural)"
                >
                  {currentLanguage === 'hi' ? 'महिला गाइड' : 'Female'}
                </button>
              </div>

              {/* Guide Speaking Pace (Speed) Selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/15 text-[11px] font-mono">
                <Gauge className="h-3 w-3 text-cyan-400 ml-1" />
                <button
                  onClick={() => handleSpeedChange(0.75)}
                  className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                    speechSpeed === 0.75 ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="0.75x: Aaram se (Relaxed pace)"
                >
                  0.75x
                </button>
                <button
                  onClick={() => handleSpeedChange(0.85)}
                  className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                    speechSpeed === 0.85 ? 'bg-amber-400 text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="0.85x: Guide Pace (Recommended)"
                >
                  0.85x
                </button>
                <button
                  onClick={() => handleSpeedChange(1.0)}
                  className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                    speechSpeed === 1.0 ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  title="1.0x: Standard Pace"
                >
                  1.0x
                </button>
              </div>

              {/* Language Switch */}
              <button
                onClick={() => handleLanguageToggle(currentLanguage === 'hi' ? 'en' : 'hi')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-gray-300 hover:text-white transition cursor-pointer"
              >
                <Languages className="h-3.5 w-3.5 text-amber-400" />
                <span>{currentLanguage === 'hi' ? 'English' : 'हिंदी'}</span>
              </button>

              {/* Exit to Main Monument Photo ("KHATAM / WAPAS PHOTO") */}
              <button
                data-testid="exit-tour-btn"
                onClick={exitTour}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 border border-white/20 hover:border-rose-400 text-xs font-mono text-gray-300 hover:text-white transition cursor-pointer"
                title="Wapas Monument Photo Par Jayein"
              >
                <X className="h-3.5 w-3.5 text-rose-400" />
                <span>{currentLanguage === 'hi' ? 'वापस मुख्य फोटो' : 'Exit to Photo'}</span>
              </button>
            </div>
          </div>

          {/* Active Feature Display Canvas */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-black overflow-hidden flex items-center justify-center">
            {/* Step 3: PURANA ZAMANA VS MODERN ZAMANA SPLIT VIEW */}
            {currentStep.tag === 'TIME_TRAVEL' && currentStep.modernImage ? (
              <div className="relative h-full w-full grid grid-cols-1 sm:grid-cols-2 gap-1 p-1 bg-black">
                {/* Purana Zamana (Vintage / Archival Image) */}
                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-neutral-900 border border-amber-500/30 group">
                  <img
                    src={currentStep.image}
                    alt="Purana Zamana Archival"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-amber-500/90 text-black text-[11px] font-mono font-black uppercase tracking-wider shadow-lg">
                    📜 {currentLanguage === 'hi' ? 'पुराना जमाना (ऐतिहासिक दौर)' : 'Historical Archive'}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-amber-200 bg-black/80 p-2 rounded-xl backdrop-blur-md">
                    <span className="font-bold block font-mono text-[10px] text-amber-400">
                      {thenAndNow.thenYear}
                    </span>
                    <p className="line-clamp-2 text-[11px]">{thenAndNow.thenCaption}</p>
                  </div>
                </div>

                {/* Modern Zamana (Present-Day Restored Image) */}
                <div className="relative h-full w-full rounded-2xl overflow-hidden bg-neutral-900 border border-cyan-500/30 group">
                  <img
                    src={currentStep.modernImage}
                    alt="Modern Zamana"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-cyan-400/90 text-black text-[11px] font-mono font-black uppercase tracking-wider shadow-lg">
                    ✨ {currentLanguage === 'hi' ? 'आधुनिक दौर (वर्तमान संरक्षण)' : 'Modern Conservation'}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-cyan-200 bg-black/80 p-2 rounded-xl backdrop-blur-md">
                    <span className="font-bold block font-mono text-[10px] text-cyan-400">
                      {thenAndNow.nowYear}
                    </span>
                    <p className="line-clamp-2 text-[11px]">{thenAndNow.nowCaption}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Steps 1, 2, 4: SINGLE FOCUSED STRUCTURAL SHOWCASE */
              <div className="relative h-full w-full">
                <img
                  src={currentStep.image}
                  alt={currentStep.titleEn}
                  className="h-full w-full object-cover transition-transform duration-700 animate-fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/60 pointer-events-none" />

                {/* Structural Highlight Badge on Top Left */}
                <div className="absolute top-4 left-4 z-10 space-y-1">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/90 text-black text-[10px] font-mono font-black tracking-widest uppercase shadow-glow-cyan inline-block">
                    {currentLanguage === 'hi' ? currentStep.badgeHi : currentStep.badgeEn}
                  </span>
                  <h3 className="font-display text-base sm:text-xl font-black text-white drop-shadow-md">
                    {currentLanguage === 'hi' ? currentStep.titleHi : currentStep.titleEn}
                  </h3>
                  <span className="text-xs font-mono text-amber-300 drop-shadow">
                    {currentLanguage === 'hi' ? currentStep.eraHi : currentStep.eraEn}
                  </span>
                </div>

                {/* Engineering Callout Pill on Bottom Right */}
                <div className="absolute bottom-4 right-4 z-10 max-w-sm hidden sm:block p-3 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-xs">
                  <span className="font-mono text-[10px] text-cyan-300 font-bold block uppercase tracking-wider">
                    📐 {currentLanguage === 'hi' ? 'स्थापत्य तथ्य' : 'Engineering Insight'}
                  </span>
                  <p className="text-gray-200 text-[11px] pt-0.5">
                    {currentLanguage === 'hi' ? currentStep.structuralHighlightHi : currentStep.structuralHighlightEn}
                  </p>
                </div>
              </div>
            )}

            {/* Clickable Interactive Scrubber Bar along the bottom of the canvas */}
            <div 
              onClick={handleSeek}
              className="absolute bottom-0 left-0 right-0 h-2 bg-white/15 z-20 cursor-pointer group/scrub"
              title="Click to seek audio"
            >
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Bottom Audio Story Subtitle & Detailed Guide Commentary */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-[#030614] to-[#01030a] border-t border-white/10 space-y-3">
            {/* Audio Player Interactive Strip */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  className="h-11 w-11 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-cyan hover:scale-105 active:scale-95 transition cursor-pointer"
                  title={isPlaying ? 'Pause Audio' : 'Play Audio'}
                >
                  {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      🎧 {currentLanguage === 'hi'
                        ? (selectedVoiceGender === 'female' ? 'महिला गाइड (स्वरा)' : 'पुरुष गाइड (मधुर)')
                        : (selectedVoiceGender === 'female' ? 'Female Guide (Neerja)' : 'Male Guide (Prabhat)')}
                    </span>
                    {isPlaying && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>Speaking Live</span>
                      </span>
                    )}
                    {isAudioLoading && (
                      <span className="text-amber-400 text-[10px] font-mono animate-pulse">
                        Loading Audio...
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    {formatTime(currentTimeSec)} / {formatTime(durationSec || 40)}
                  </span>
                </div>
              </div>

              {/* Scrubber Pill & Step Indicator */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400">
                  चरण {activeStepIndex + 1} / {tourSteps.length}
                </span>

                <button
                  onClick={() => loadAudioForStep(activeStepIndex, currentLanguage, true)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                  title="शुरू से सुनें (Restart Audio)"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isMuted ? 'border-rose-400 bg-rose-500/20 text-rose-300' : 'border-white/10 bg-white/5 text-gray-300 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* FULL DETAILED GUIDE NARRATION TEXT BOX */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/15 space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  <h4 data-testid="step-title" className="font-display text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {currentLanguage === 'hi' ? currentStep.titleHi : currentStep.titleEn}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {currentLanguage === 'hi' ? currentStep.eraHi : currentStep.eraEn}
                </span>
              </div>

              <p data-testid="step-spoken" className="text-xs sm:text-sm text-gray-100 font-normal leading-relaxed tracking-wide">
                {currentLanguage === 'hi' ? currentStep.spokenHi : currentStep.spokenEn}
              </p>
            </div>

            {/* Bottom Step Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Previous Step */}
              <button
                data-testid="prev-step-btn"
                disabled={activeStepIndex === 0}
                onClick={() => advanceToStep(activeStepIndex - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{currentLanguage === 'hi' ? 'पिछला' : 'Previous'}</span>
              </button>

              {/* Next Step or Finish */}
              {activeStepIndex < tourSteps.length - 1 ? (
                <button
                  data-testid="next-step-btn"
                  onClick={() => advanceToStep(activeStepIndex + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs font-mono shadow-glow-amber hover:scale-105 transition cursor-pointer"
                >
                  <span>{currentLanguage === 'hi' ? 'अगला स्ट्रक्चर' : 'Next Structure'}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  data-testid="finish-tour-btn"
                  onClick={handleTourComplete}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs font-mono shadow-glow-emerald hover:scale-105 transition cursor-pointer animate-pulse"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{currentLanguage === 'hi' ? 'खत्म: वापस मुख्य फोटो' : 'Finish & Return'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
