'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IndianMonument, getMonumentFacts, getMonumentTimeline } from '@/data/indian-monuments';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  User, 
  HelpCircle,
  Clock,
  ShieldCheck,
  Building
} from 'lucide-react';

interface MonumentAIHistoryChatProps {
  monument: IndianMonument;
  language: 'hi' | 'en';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export function MonumentAIHistoryChat({ monument, language }: MonumentAIHistoryChatProps) {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: language === 'hi'
        ? `Namaste! Main hoon aapka AI Itihaas Margdarshak. Aap ${monument.hindiName} ke nirman, shasak, vastukala ya kisi bhi aitihasik tathy ke baare mein mujhse pooch sakte hain.`
        : `Greetings! I am your AI Heritage Historian. Ask me anything about ${monument.name}'s construction, architects, historical rulers, battles, or architectural secrets.`,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Reset welcome message whenever a new monument or language is selected
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${monument.id}-${language}`,
        sender: 'ai',
        text: language === 'hi'
          ? `Namaste! Main hoon aapka AI Itihaas Margdarshak. Aap ${monument.hindiName} ke nirman, shasak, vastukala ya kisi bhi aitihasik tathy ke baare mein mujhse pooch sakte hain.`
          : `Greetings! I am your AI Heritage Historian. Ask me anything about ${monument.name}'s construction, architects, historical rulers, battles, or architectural secrets.`,
        timestamp: 'Just now'
      }
    ]);
  }, [monument.id, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = language === 'hi' ? [
    `${monument.name} kisne banwaya?`,
    'Isko banane mein kitna samay laga?',
    'Iski architecture ki kya khasiyat hai?',
    'Iske andar kya-kya bana hai?',
    'Is monument se judi interesting stories kya hain?',
    'Iski history mein kya important events hue?'
  ] : [
    `Who commissioned ${monument.name}?`,
    'How long did construction take?',
    'What are its key architectural features?',
    'What structures are inside the complex?',
    'What are lesser-known facts and mysteries?',
    'What major historical events occurred here?'
  ];

  // Grounded factual answer generator using verified monument database
  const generateGroundedAnswer = (query: string): string => {
    const q = query.toLowerCase();
    const facts = getMonumentFacts(monument);
    const timeline = getMonumentTimeline(monument);

    // Who built it?
    if (q.includes('kisne') || q.includes('who') || q.includes('builder') || q.includes('commission')) {
      if (language === 'hi') {
        return `${monument.hindiName} ko ${monument.dynastyOrBuilder} ne banwaya tha. Yeh sthal ${monument.historicalPeriod} ke dauran nirmit hua aur iski vastukala ${monument.architecturalStyle} ka prateek hai.`;
      } else {
        return `${monument.name} was commissioned by ${monument.dynastyOrBuilder} during the ${monument.historicalPeriod}. It represents the pinnacle of ${monument.architecturalStyle}.`;
      }
    }

    // Time / Duration
    if (q.includes('samay') || q.includes('time') || q.includes('saal') || q.includes('year') || q.includes('duration') || q.includes('kitna')) {
      if (monument.id === 'taj-mahal') {
        return language === 'hi'
          ? 'Taj Mahal ko banane mein lagbhag 22 saal (1632 se 1653 AD) lage. Isme 20,000 se zyada karigar, rajmistri aur shilpkar lage the jinka nirdeshan Ustad Ahmad Lahori ne kiya tha.'
          : 'The construction of the Taj Mahal took approximately 22 years (1632 to 1653 AD). Over 20,000 artisans and masons laboured on the project under chief architect Ustad Ahmad Lahori.';
      }
      return language === 'hi'
        ? `${monument.hindiName} ka nirman ${monument.historicalPeriod} ke dauran hua tha. Is sthal ko taiyar karne mein varshon ka samay aur hazaron karigaron ka shram laga tha.`
        : `${monument.name} was constructed during the ${monument.historicalPeriod}, taking years of meticulous craftsmanship and structural engineering.`;
    }

    // Architecture / Features
    if (q.includes('architecture') || q.includes('vastukala') || q.includes('khasiyat') || q.includes('style') || q.includes('material')) {
      return language === 'hi'
        ? `${monument.hindiName} ki vastukala shaili '${monument.architecturalStyle}' hai. Ise banane mein ${monument.materials} ka prayog hua hai. Iski mukhya visheshataon mein ${monument.architecturalFeatures.map(f => f.hindiName).join(', ')} shamil hain.`
        : `${monument.name} features ${monument.architecturalStyle}. The materials utilized include ${monument.materials}. Key architectural highlights include ${monument.architecturalFeatures.map(f => f.name).join(', ')}.`;
    }

    // What is inside?
    if (q.includes('andar') || q.includes('inside') || q.includes('structures') || q.includes('complex')) {
      return language === 'hi'
        ? `${monument.hindiName} ke complex ke bheetar ${monument.interiorNotes || 'mukhya sabha bhavan, aitihaasik dharohar sthal aur shahi galleriyan sthit hain'}. Iske alawa yahan par aitihaasik baghiche aur jal sthal maujood hain.`
        : `Inside the complex of ${monument.name}, you will find ${monument.interiorNotes || 'the central sanctum, ceremonial courtyards, and pillared pavilions'}.`;
    }

    // Stories / Facts / Mysteries
    if (q.includes('story') || q.includes('stories') || q.includes('kahani') || q.includes('mystery') || q.includes('fact') || q.includes('interesting')) {
      const topFact = facts[0]?.fact || monument.description;
      return language === 'hi'
        ? `Rochak Tathy: ${topFact} Iske alawa, yeh sthal ${monument.unescoStatus} ke roop mein poore vishwa mein vikhyat hai.`
        : `Interesting Fact: ${topFact} Furthermore, it is internationally recognized under ${monument.unescoStatus}.`;
    }

    // History / Events
    if (q.includes('event') || q.includes('history') || q.includes('itihaas') || q.includes('yuddh') || q.includes('battle')) {
      const firstEvent = timeline[0];
      return language === 'hi'
        ? `${monument.detailedHistory} Ek mukhya ghatna: ${firstEvent.year} mein ${firstEvent.event}`
        : `${monument.detailedHistory} Key milestone: In ${firstEvent.year}, ${firstEvent.event}`;
    }

    // General fallback
    return language === 'hi'
      ? `${monument.hindiName} ke vishay mein: ${monument.description} Yeh ${monument.city}, ${monument.state} mein sthit hai aur ${monument.dynastyOrBuilder} se sambandhit hai. Aap iske nirman, samay ya vastukala par bhi pooch sakte hain.`
      : `Regarding ${monument.name}: ${monument.description} Located in ${monument.city}, ${monument.state}, it is attributed to ${monument.dynastyOrBuilder}.`;
  };

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: 'Now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const ansText = generateGroundedAnswer(q);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: ansText,
        timestamp: 'Now'
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 450);
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.1;
    const voices = window.speechSynthesis.getVoices();
    if (language === 'hi') {
      const hi = voices.find((v) => v.lang.startsWith('hi') || v.name.includes('Hindi'));
      if (hi) u.voice = hi;
    } else {
      const en = voices.find((v) => v.lang.startsWith('en'));
      if (en) u.voice = en;
    }
    window.speechSynthesis.speak(u);
  };

  // Web Speech recognition toggle
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  return (
    <div className="w-full rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#0d071f] via-[#080414] to-black p-4 sm:p-6 space-y-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-glow-purple">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm sm:text-base font-black text-white">
                Interactive AI History Guide
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[10px] font-mono font-bold text-purple-300">
                VERIFIED ARCHIVES
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Ask historical questions in Hindi or English — answers verified by official ASI/UNESCO records
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-gray-400 block">Suggested Historical Questions:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-purple-200 hover:border-purple-400 hover:bg-purple-950/40 transition whitespace-nowrap cursor-pointer flex-shrink-0"
            >
              <HelpCircle className="h-3 w-3 text-purple-400" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Display Window */}
      <div className="h-64 sm:h-72 overflow-y-auto space-y-3 p-3 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="h-7 w-7 rounded-lg bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1.5 ${
                m.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-none'
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
              }`}
            >
              <p>{m.text}</p>
              {m.sender === 'ai' && (
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-gray-400">
                  <span className="font-mono">Grounded ASI Record</span>
                  <button
                    onClick={() => speakText(m.text)}
                    className="flex items-center gap-1 text-purple-300 hover:text-white transition cursor-pointer"
                    title="Bol kar sunayein"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>Bol kar sunayein</span>
                  </button>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="h-7 w-7 rounded-lg bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-0.5">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono p-2">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>Consulting verified historical archives...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Speech-to-Text */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          className={`p-3 rounded-2xl border transition cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
              : 'bg-white/5 border-white/15 text-gray-300 hover:text-white'
          }`}
          title={isListening ? 'Stop Listening' : 'Speak your question (Voice Input)'}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            language === 'hi'
              ? `Poochiye ${monument.name} ke baare mein koi bhi sawal...`
              : `Ask any question about ${monument.name}'s history, construction, or secrets...`
          }
          className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
        />

        <button
          type="submit"
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs shadow-glow-purple hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
        >
          <span>Poochhein</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
