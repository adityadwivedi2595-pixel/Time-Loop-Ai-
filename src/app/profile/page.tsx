'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { 
  Cpu, 
  ShieldCheck, 
  Database, 
  Key, 
  CheckCircle, 
  RefreshCw, 
  Image, 
  Mic, 
  Box, 
  Server,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface SystemStatus {
  status: 'CONNECTED' | 'DISCONNECTED' | 'CONFIGURATION REQUIRED' | 'DEGRADED';
  name: string;
  details?: string;
  model?: string;
  message?: string;
  mode?: string;
  tools?: string[];
  fallback_active?: boolean;
}

export default function ProfilePage() {
  const [systems, setSystems] = useState<{ [key: string]: SystemStatus } | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<number | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const fetchHealth = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const elapsed = Math.round(performance.now() - start);
      setPingLatency(elapsed);
      if (res.ok) {
        const json = await res.json();
        setSystems(json.systems || null);
        setLastPingTime(Date.now());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <Badge variant="emerald" className="font-mono text-[10px]">CONNECTED</Badge>;
      case 'DEGRADED':
        return <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">DEGRADED</span>;
      case 'CONFIGURATION REQUIRED':
        return <span className="rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">CONFIG REQUIRED</span>;
      case 'DISCONNECTED':
      default:
        return <span className="rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">DISCONNECTED</span>;
    }
  };

  const getSystemIcon = (key: string) => {
    switch (key) {
      case 'backend': return <Server className="h-5 w-5 text-cyan-400" />;
      case 'nvidia_ai': return <Cpu className="h-5 w-5 text-emerald-400" />;
      case 'database': return <Database className="h-5 w-5 text-purple-400" />;
      case 'mcp_server': return <Key className="h-5 w-5 text-amber-400" />;
      case 'image_provider': return <Image className="h-5 w-5 text-pink-400" />;
      case 'voice_provider': return <Mic className="h-5 w-5 text-cyan-400" />;
      case 'renderer_3d': return <Box className="h-5 w-5 text-indigo-400" />;
      default: return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Badge variant="cyan">Mission Control Diagnostics</Badge>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
            System Status & Engine Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time verified connection states across NVIDIA AI, MCP Tools, Database Persistence, Audio and 3D WebGL.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={isPinging}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-glow-cyan hover:brightness-110 disabled:opacity-50 transition"
        >
          <RefreshCw className={`h-4 w-4 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'Pinging Subsystems...' : 'Run Live Diagnostic Probe'}</span>
        </button>
      </div>

      {/* Latency Bar */}
      {pingLatency !== null && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-gray-300">Live Health Probe:</span>
            <span className="text-cyan-300 font-bold">{pingLatency}ms round-trip</span>
          </div>
          <span className="text-gray-500 text-[11px]">
            {lastPingTime ? new Date(lastPingTime).toLocaleTimeString() : ''}
          </span>
        </div>
      )}

      {/* 7 Subsystem Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems ? (
          Object.entries(systems).map(([key, sys]) => (
            <GlassCard key={key} glow="cyan" className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  {getSystemIcon(key)}
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">{sys.name}</h3>
                    {sys.model && (
                      <p className="text-[11px] font-mono text-cyan-300">Model: {sys.model}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(sys.status)}
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                {sys.details || sys.message || 'Operational and responsive.'}
              </p>

              {sys.tools && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
                    Verified Tools ({sys.tools.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sys.tools.map((t, i) => (
                      <span key={i} className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          ))
        ) : (
          <div className="col-span-2 py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
            <p className="text-xs font-mono text-gray-400">Querying live subsystem telemetry...</p>
          </div>
        )}
      </div>

      {/* Privacy & Security Note */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-gray-400 flex items-center justify-between">
        <span>🔒 Zero Credential Leakage: Private API keys are strictly evaluated server-side and never exposed.</span>
        <span className="font-mono text-cyan-400">Security: RLS & Zod Validated</span>
      </div>
    </div>
  );
}
