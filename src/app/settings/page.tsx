'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  Settings as SettingsIcon, 
  Activity, 
  Sliders, 
  Volume2, 
  Monitor, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Trash2, 
  Download, 
  ArrowLeft,
  Sparkles,
  Layers,
  Box,
  Radio
} from 'lucide-react';

interface SubsystemStatus {
  status: 'CONNECTED' | 'DISCONNECTED' | 'CONFIGURATION REQUIRED' | 'DEGRADED';
  name: string;
  details?: string;
  model?: string;
  engine?: string;
  tools?: string[];
  mode?: string;
  fallback_active?: boolean;
}

export default function SettingsPage() {
  // System Health
  const [healthData, setHealthData] = useState<{ [key: string]: SubsystemStatus } | null>(null);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  // Graphics Quality
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');
  const [detectedGpu, setDetectedGpu] = useState<string>('Detecting WebGL Hardware...');

  // Audio / Speech
  const [masterVolume, setMasterVolume] = useState<number>(100);
  const [speechRate, setSpeechRate] = useState<number>(1.25);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [isTestSpeaking, setIsTestSpeaking] = useState<boolean>(false);

  // Storage / Saved Checkpoints
  const [savedCheckpointsCount, setSavedCheckpointsCount] = useState<number>(0);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth();
    detectDeviceCapabilities();
    loadVoices();
    scanLocalStorage();

    // Listen for voices
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const fetchHealth = async () => {
    setIsRefreshingHealth(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const roundtrip = Math.round(performance.now() - start);
      setLatencyMs(roundtrip);
      if (res.ok) {
        const json = await res.json();
        setHealthData(json.systems);
      }
    } catch {
      setLatencyMs(null);
    } finally {
      setIsRefreshingHealth(false);
    }
  };

  const detectDeviceCapabilities = () => {
    if (typeof window === 'undefined') return;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          setDetectedGpu(renderer || 'WebGL Hardware Accelerated');
        } else {
          setDetectedGpu('Hardware Accelerated WebGL 2.0');
        }
      } else {
        setDetectedGpu('WebGL Not Supported (Using Lightweight Fallback)');
        setGraphicsQuality('low');
      }
    } catch {
      setDetectedGpu('Standard Display Adapter');
    }

    // Load user quality preference from localStorage
    try {
      const saved = localStorage.getItem('timeloop_graphics_quality');
      if (saved && ['low', 'medium', 'high', 'ultra'].includes(saved)) {
        setGraphicsQuality(saved as any);
      }
    } catch {}
  };

  const loadVoices = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const avail = window.speechSynthesis.getVoices();
    setVoices(avail);
    const natural = avail.findIndex(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David'))
    );
    if (natural !== -1) setSelectedVoiceIndex(natural);
  };

  const scanLocalStorage = () => {
    if (typeof window === 'undefined') return;
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('timeloop_checkpoint_')) count++;
    }
    setSavedCheckpointsCount(count);
  };

  const handleQualityChange = (q: 'low' | 'medium' | 'high' | 'ultra') => {
    setGraphicsQuality(q);
    try {
      localStorage.setItem('timeloop_graphics_quality', q);
      setSaveFeedback(`Graphics quality set to ${q.toUpperCase()}`);
      setTimeout(() => setSaveFeedback(null), 3000);
    } catch {}
  };

  const testVoiceSynthesis = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      'Chrono-voice test transmission. NVIDIA NIM and Web Speech Synthesis are running at nominal output.'
    );
    utterance.volume = masterVolume / 100;
    utterance.rate = speechRate;
    if (voices[selectedVoiceIndex]) utterance.voice = voices[selectedVoiceIndex];

    utterance.onend = () => setIsTestSpeaking(false);
    utterance.onerror = () => setIsTestSpeaking(false);

    setIsTestSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearCheckpoints = () => {
    if (typeof window === 'undefined') return;
    if (!confirm('Are you sure you want to clear all offline story checkpoints?')) return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('timeloop_checkpoint_')) keysToRemove.push(key);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setSavedCheckpointsCount(0);
    setSaveFeedback('Offline checkpoints successfully cleared.');
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const handleExportData = () => {
    if (typeof window === 'undefined') return;
    const backup: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('timeloop_')) {
        backup[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeloop-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <Badge variant="emerald">CONNECTED</Badge>;
      case 'CONFIGURATION REQUIRED':
        return <Badge variant="amber">CONFIG REQUIRED</Badge>;
      case 'DEGRADED':
        return <Badge variant="amber">DEGRADED</Badge>;
      default:
        return <Badge variant="red">DISCONNECTED</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="flex items-center gap-1">
              <SettingsIcon className="h-3 w-3 text-purple-300" />
              Application Control Matrix
            </Badge>
            <span className="text-[11px] font-mono text-cyan-400">Settings & Telemetry</span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
            System Settings & Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Configure WebGL rendering quality, Chrono-Voice acoustics, offline checkpoint recovery, and verify live subsystem telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/virtual-world"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-300 shadow-glow-cyan hover:bg-cyan-900/60 transition"
          >
            <Box className="h-3.5 w-3.5 text-cyan-400" />
            <span>3D World</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-gray-200 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {saveFeedback && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-mono text-emerald-300 flex items-center gap-2 shadow-glow-cyan">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Preferences (Graphics, Audio, Storage) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Graphics Quality */}
          <GlassCard glow="cyan" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Monitor className="h-4 w-4 text-cyan-400" />
                3D World Graphics Quality
              </h3>
              <Badge variant="cyan">{graphicsQuality.toUpperCase()}</Badge>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Detected GPU Adapter</span>
              <p className="text-xs font-mono text-gray-300 truncate">{detectedGpu}</p>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-2">Select Target Quality Tier</label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'ultra'] as const).map(q => (
                  <button
                    key={q}
                    onClick={() => handleQualityChange(q)}
                    className={`rounded-xl py-2.5 text-xs font-bold uppercase transition ${
                      graphicsQuality === q
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-glow-cyan'
                        : 'border border-white/10 bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              <strong>Quality presets:</strong> Ultra renders 2,200 particle stars and dynamic shadows; Low is optimized for lightweight laptops and integrated mobile GPUs.
            </p>
          </GlassCard>

          {/* Chrono-Voice Acoustic Settings */}
          <GlassCard glow="purple" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-purple-400" />
                Chrono-Voice Acoustic Engine
              </h3>
              <button
                onClick={testVoiceSynthesis}
                disabled={isTestSpeaking}
                className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 transition"
              >
                <Radio className={`h-3 w-3 ${isTestSpeaking ? 'animate-pulse text-cyan-400' : ''}`} />
                <span>{isTestSpeaking ? 'Testing...' : 'Test Voice'}</span>
              </button>
            </div>

            {voices.length > 0 && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">Synthesizer Voice Profile</label>
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  {voices.map((v, i) => (
                    <option key={i} value={i}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Output Volume</span>
                  <span className="font-mono text-cyan-300">{masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Pacing / Speed</span>
                  <span className="font-mono text-purple-300">{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.6"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="w-full accent-purple-400 h-1.5 bg-white/10 rounded cursor-pointer"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              Equipped with sentence chunking and anti-GC keepalive heartbeat so long dialogues and narrations never cut off midway.
            </p>
          </GlassCard>

          {/* Storage & Recovery */}
          <GlassCard className="space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              Offline Checkpoints & Save Recovery
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <span className="text-xs font-semibold text-white">Stored Local Checkpoints</span>
                <p className="text-[11px] text-gray-400">Resumes story state upon browser reload</p>
              </div>
              <Badge variant="emerald">{savedCheckpointsCount} Saved</Badge>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExportData}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-gray-200 hover:text-white transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Save File</span>
              </button>

              <button
                onClick={handleClearCheckpoints}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-4 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-900/40 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Cache</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Requirement 5 Live System Health Status Panel */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard glow="purple" className="space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-glow-cyan" />
                <h3 className="font-display text-base font-bold text-white">
                  Live System Connection Status
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {latencyMs !== null && (
                  <span className="text-xs font-mono text-cyan-300">
                    {latencyMs}ms ping
                  </span>
                )}
                <button
                  onClick={fetchHealth}
                  disabled={isRefreshingHealth}
                  className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition"
                  title="Refresh Diagnostics"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshingHealth ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Real-time hardware & API telemetry verified across all 7 core subsystems. No credentials exposed.
            </p>

            {healthData ? (
              <div className="space-y-3">
                {Object.entries(healthData).map(([key, item]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-white/5 bg-black/40 hover:border-white/10 transition gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xs font-bold text-white">
                          {item.name}
                        </span>
                        {item.model && (
                          <span className="text-[10px] font-mono text-cyan-400">
                            [{item.model}]
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 leading-normal">
                        {item.details || item.engine || item.mode || 'Active'}
                      </p>
                    </div>

                    <div className="flex-shrink-0 self-start sm:self-center">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-gray-400 font-mono flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                <span>Querying subsystem health probes...</span>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
