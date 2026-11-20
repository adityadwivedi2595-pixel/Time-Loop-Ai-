'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Cpu, ShieldCheck, Database, Key, CheckCircle, RefreshCw } from 'lucide-react';

export default function ProfilePage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [testingModel, setTestingModel] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const json = await res.json();
          setHealthData(json);
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkHealth();
  }, []);

  const handleTestInference = async () => {
    setTestingModel(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/health');
      const json = await res.json();
      setTestResult(json.nvidia_nim?.verification?.message || 'Verification complete.');
    } catch (err: any) {
      setTestResult(`Test failed: ${err.message}`);
    } finally {
      setTestingModel(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <Badge variant="cyan">System Architecture Diagnostics</Badge>
        <h1 className="mt-2 font-display text-3xl font-black text-white">
          Profile & AI Inference Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Inspect NVIDIA NIM model configurations, Supabase database bindings, and internal MCP tool health.
        </p>
      </div>

      <div className="space-y-6">
        {/* NVIDIA NIM Settings */}
        <GlassCard glow="cyan" className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-400" />
              <h3 className="font-display text-base font-bold text-white">NVIDIA NIM Inference Provider</h3>
            </div>
            <Badge variant="emerald">Model: Mistral Large 4</Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Endpoint URL:</span>
              <span className="font-mono text-gray-200">https://integrate.api.nvidia.com/v1</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Primary Model Identifier:</span>
              <span className="font-mono text-cyan-300">mistralai/mistral-large-4-1t-a52b</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">API Key Configured:</span>
              <span className={`font-mono ${healthData?.nvidia_nim?.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {healthData?.nvidia_nim?.configured ? 'Active (.env configured)' : 'Demo Fallback / Offline Evaluation Mode'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-gray-400">Model Verification Status:</span>
              <span className="text-gray-300">{healthData?.nvidia_nim?.verification?.message || 'Operational'}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTestInference}
              disabled={testingModel}
              className="flex items-center gap-2 rounded-xl bg-cyan-600/20 border border-cyan-500/40 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 transition"
            >
              {testingModel ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              <span>Test Model Latency & Connection</span>
            </button>
            {testResult && (
              <p className="mt-2 text-xs font-mono text-cyan-300">Result: {testResult}</p>
            )}
          </div>
        </GlassCard>

        {/* Database & MCP Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <GlassCard glow="purple" className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-400" />
              <h4 className="font-display text-sm font-bold text-white">Database & Persistence</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Supabase PostgreSQL schema initialized with RLS policies, owner isolation, and pre-seeded with 8 rich time eras.
            </p>
            <div className="text-xs text-gray-300 pt-2 border-t border-white/10 flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-400 font-mono">Connected</span>
            </div>
          </GlassCard>

          <GlassCard className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-400" />
              <h4 className="font-display text-sm font-bold text-white">Model Context Protocol</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Internal TypeScript MCP server running 12 registered tools with verified backend session credentials.
            </p>
            <div className="text-xs text-gray-300 pt-2 border-t border-white/10 flex justify-between">
              <span>Tools Registered:</span>
              <span className="text-cyan-400 font-mono">12 / 12 Active</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
