'use client';

import React, { useState } from 'react';
import { IndianMonument, getMonumentTimeline, getMonumentFacts } from '@/data/indian-monuments';
import { 
  BookOpen, 
  Calendar, 
  Building, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  FileText,
  Clock,
  Compass,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';

interface MonumentHistoryTabsProps {
  monument: IndianMonument;
}

export function MonumentHistoryTabs({ monument }: MonumentHistoryTabsProps) {
  const [activeTab, setActiveTab] = useState<'chronicles' | 'architecture' | 'timeline' | 'facts' | 'references'>('chronicles');

  const timeline = getMonumentTimeline(monument);
  const facts = getMonumentFacts(monument);

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-[#060a16] via-[#030610] to-black p-4 sm:p-6 space-y-5 shadow-2xl">
      {/* Tab Navigation Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('chronicles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex-shrink-0 cursor-pointer ${
            activeTab === 'chronicles'
              ? 'bg-amber-500 text-black shadow-glow-amber'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Historical Chronicles</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex-shrink-0 cursor-pointer ${
            activeTab === 'architecture'
              ? 'bg-cyan-500 text-black shadow-glow-cyan'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Architecture & Engineering</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex-shrink-0 cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-purple-500 text-white shadow-glow-purple'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Chronological Timeline ({timeline.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex-shrink-0 cursor-pointer ${
            activeTab === 'facts'
              ? 'bg-emerald-500 text-black shadow-glow-emerald'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Lesser-Known Facts & Secrets</span>
        </button>

        <button
          onClick={() => setActiveTab('references')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex-shrink-0 cursor-pointer ${
            activeTab === 'references'
              ? 'bg-rose-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Sources & Bibliography</span>
        </button>
      </div>

      {/* TAB 1: HISTORICAL CHRONICLES */}
      {activeTab === 'chronicles' && (
        <div className="space-y-4 text-xs leading-relaxed text-gray-300 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 font-mono text-[11px]">
            <div>
              <span className="text-gray-500 block">PATRON / BUILDER:</span>
              <span className="text-amber-300 font-bold">{monument.dynastyOrBuilder}</span>
            </div>
            <div>
              <span className="text-gray-500 block">ERA / PERIOD:</span>
              <span className="text-cyan-300 font-bold">{monument.historicalPeriod}</span>
            </div>
            <div>
              <span className="text-gray-500 block">LOCATION:</span>
              <span className="text-white font-bold">{monument.city}, {monument.state} ({monument.coordinates})</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold text-white border-b border-white/10 pb-1 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Genesis & Historical Context</span>
            </h4>
            <p className="text-sm leading-relaxed text-gray-200">
              {monument.description}
            </p>
            <p className="leading-relaxed">
              {monument.detailedHistory}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 space-y-2">
            <h5 className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>UNESCO & National Conservation Standing</span>
            </h5>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {monument.unescoStatus}. Conserved under the Ancient Monuments and Archaeological Sites and Remains Act (AMASR Act) by the Archaeological Survey of India (ASI).
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE & ENGINEERING */}
      {activeTab === 'architecture' && (
        <div className="space-y-4 text-xs leading-relaxed text-gray-300 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 font-mono text-[11px]">
            <div>
              <span className="text-gray-500 block">ARCHITECTURAL STYLE:</span>
              <span className="text-cyan-300 font-bold">{monument.architecturalStyle}</span>
            </div>
            <div>
              <span className="text-gray-500 block">CONSTRUCTION MATERIALS:</span>
              <span className="text-amber-300 font-bold">{monument.materials}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold text-white border-b border-white/10 pb-1 flex items-center gap-2">
              <Building className="h-4 w-4 text-cyan-400" />
              <span>Documented Structural Features</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {monument.architecturalFeatures.map((feat, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-white/10 bg-black/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="font-display text-xs font-bold text-white">{feat.name}</h5>
                    <span className="text-[10px] text-amber-300 font-hindi font-bold">{feat.hindiName}</span>
                  </div>
                  <p className="text-[11px] text-cyan-300 font-mono">{feat.significance}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {monument.interiorAvailability && (
            <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 space-y-1">
              <span className="text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider block">
                Interior Complex & Spatial Layout:
              </span>
              <p className="text-xs text-cyan-100/90 leading-relaxed">
                {monument.interiorNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CHRONOLOGICAL TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="relative border-l-2 border-purple-500/40 ml-4 sm:ml-6 pl-5 sm:pl-8 space-y-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Circle Bullet */}
                <div className="absolute -left-[29px] sm:-left-[41px] top-1 h-5 w-5 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-glow-purple" />

                <div className="p-3.5 rounded-2xl border border-white/10 bg-black/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 border border-purple-400/40 text-xs font-mono font-black text-purple-300">
                      {item.year}
                    </span>
                  </div>
                  <h5 className="font-display text-xs sm:text-sm font-bold text-white pt-1">
                    {item.event}
                  </h5>
                  <p className="text-xs text-gray-400 font-mono">
                    {item.significance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LESSER-KNOWN FACTS & SECRETS */}
      {activeTab === 'facts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in">
          {facts.map((fact, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-black space-y-1.5"
            >
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                <Sparkles className="h-4 w-4 flex-shrink-0" />
                <span>{fact.title}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {fact.fact}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: SOURCES & BIBLIOGRAPHY */}
      {activeTab === 'references' && (
        <div className="space-y-3.5 text-xs text-gray-300 animate-in fade-in">
          <h4 className="font-display text-sm font-bold text-white border-b border-white/10 pb-1 flex items-center gap-2">
            <FileText className="h-4 w-4 text-rose-400" />
            <span>Verified Archival Records & Citations</span>
          </h4>

          <ul className="space-y-2 font-mono text-[11px] list-disc list-inside text-gray-400">
            <li>Archaeological Survey of India (ASI) — Official Monument Dossier & Architectural Drawings, Ministry of Culture, Government of India.</li>
            <li>UNESCO World Heritage Centre — Advisory Body Evaluation Documents & Inscription Dossier (WHC.83/CONF.009/8).</li>
            <li>Indian Culture Portal — National Virtual Heritage Archives, Ministry of Culture, Govt. of India.</li>
            <li>Imperial Gazetteer of India — Provincial Series & Archaeological Reports (Alexander Cunningham Surveys, 1871–1885).</li>
            <li>National Museum New Delhi & Royal Asiatic Society of Bengal Historical Manuscripts.</li>
          </ul>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-gray-400 space-y-1">
            <span className="text-white font-bold block">Historical Integrity Policy:</span>
            <p>
              TIMELOOP AI adheres to strict academic historiography. All dates, architectural terminologies, and dynastic associations are corroborated with peer-reviewed publications and official ASI survey logs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
