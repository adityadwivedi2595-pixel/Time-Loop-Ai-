/**
 * TIMELOOP AI — Universal Speech Engine Helper
 * Provides seamless, uninterrupted neural audio streaming with rock-solid SpeechSynthesis fallback.
 * Fixes Chrome 14-second cutoff and garbage collection bugs permanently.
 */

let activeAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let heartbeatTimer: NodeJS.Timeout | null = null;

export function stopUniversalAudio() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {}
    activeAudio = null;
  }
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
  activeUtterance = null;
  if (typeof window !== 'undefined') {
    (window as any).__activeUtterance = null;
  }
}

export async function speakHeritageText(
  text: string,
  lang: 'hi' | 'en' = 'hi',
  gender: 'male' | 'female' = 'male',
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  stopUniversalAudio();
  if (!text || text.trim() === '') return;

  const trimmedText = text.trim();
  const voiceName = lang === 'hi'
    ? (gender === 'female' ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural')
    : (gender === 'female' ? 'en-IN-NeerjaNeural' : 'en-IN-PrabhatNeural');

  // Try Server Neural Edge-TTS First
  try {
    const response = await fetch('/api/heritage-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmedText, voice: voiceName, lang })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        activeAudio = audio;
        audio.volume = 1.0;

        audio.onplay = () => {
          if (onStart) onStart();
        };
        audio.onended = () => {
          activeAudio = null;
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          activeAudio = null;
          fallbackSpeechSynthesis(trimmedText, lang, gender, onStart, onEnd);
        };

        await audio.play();
        return;
      }
    }
    // Fallback if response not ok
    fallbackSpeechSynthesis(trimmedText, lang, gender, onStart, onEnd);
  } catch (err) {
    fallbackSpeechSynthesis(trimmedText, lang, gender, onStart, onEnd);
  }
}

function fallbackSpeechSynthesis(
  text: string,
  lang: 'hi' | 'en',
  gender: 'male' | 'female',
  onStart?: () => void,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;
  (window as any).__activeUtterance = utterance; // Prevent GC bug

  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.88;

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
    if (onStart) onStart();
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        if (heartbeatTimer) clearInterval(heartbeatTimer);
      }
    }, 5000);
  };

  utterance.onend = () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    activeUtterance = null;
    (window as any).__activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    activeUtterance = null;
    (window as any).__activeUtterance = null;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
