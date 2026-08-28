import React, { useState } from 'react';
import { mockAnalyticsStats, mockWorklistQueue } from '../data/mockData';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, FileText, Search, 
  TrendingUp, Activity, Filter, ExternalLink, ArrowRight, Zap, Eye, Database
} from 'lucide-react';

export default function DashboardPage({ setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');

  const filteredQueue = mockWorklistQueue.filter(item => {
    const matchesSearch = item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || item.sectorId === sectorFilter;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#353534] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00E5FF] mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#97d700] animate-ping"></span>
            <span>SHERDETECT 2.0 — MULTI-DOMAIN FORENSIC INTELLIGENCE DASHBOARD</span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-white">
            Enterprise Verification BI & Sector Analytics
          </h1>
        </div>

        <button
          onClick={() => setActiveTab('verification')}
          className="px-5 py-2.5 bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-headline font-extrabold text-xs tracking-wider rounded-xl shadow hover:scale-105 transition flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>START NEW 6-LAYER SCAN</span>
        </button>
      </div>

      {/* TOP METRIC CARDS (3-WAY VERDICTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>TOTAL ANALYZED</span>
            <Database className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-white">
            {mockAnalyticsStats.totalAnalyzed.toLocaleString()}
          </p>
          <p className="text-xs font-mono text-gray-400">Avg Latency: <span className="text-[#00E5FF]">{mockAnalyticsStats.avgPipelineLatency}</span></p>
        </div>

        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#97d700]/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#97d700]">
            <span>🟢 AUTHENTIC (0-15%)</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-[#97d700]">
            {mockAnalyticsStats.authenticCount.toLocaleString()}
          </p>
          <p className="text-xs font-mono text-gray-400">Auto-Verified Genuine</p>
        </div>

        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#FFAB00]/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#FFAB00]">
            <span>🟡 SUSPICIOUS (16-84%)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-[#FFAB00]">
            {mockAnalyticsStats.suspiciousCount.toLocaleString()}
          </p>
          <p className="text-xs font-mono text-gray-400">Human Verifier Queue</p>
        </div>

        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-red-400">
            <span>🔴 FORGERY (85-100%)</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <p className="text-3xl font-headline font-extrabold text-red-400">
            {mockAnalyticsStats.forgeryCount.toLocaleString()}
          </p>
          <p className="text-xs font-mono text-gray-400">Confirmed Fraud Flagged</p>
        </div>
      </div>

      {/* 6 HIGH-RISK SECTORS CARDS */}
      <div className="space-y-4">
        <h2 className="text-lg font-headline font-bold text-white flex items-center space-x-2">
          <span className="material-symbols-outlined text-[#00E5FF]">domain</span>
          <span>SherDetect Unified Sector Coverage (6 High-Risk Domains)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockAnalyticsStats.sectors.map((sec) => (
            <div 
              key={sec.id}
              onClick={() => setSectorFilter(sec.id)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                sectorFilter === sec.id 
                  ? 'bg-[#201f1f] border-[#00E5FF] text-white shadow-lg' 
                  : 'bg-[#1c1b1b] border-white/10 text-gray-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="material-symbols-outlined text-[#97d700] text-sm">{sec.icon}</span>
                <span className="font-headline font-bold text-xs truncate">{sec.name}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono truncate">{sec.docTypes}</p>
              <div className="flex justify-between font-mono text-[11px] text-gray-300 mt-2 pt-2 border-t border-white/5">
                <span>{sec.count.toLocaleString()} docs</span>
                <span className="text-red-400 font-bold">{sec.riskCount} flags</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT INGESTION STREAM TABLE */}
      <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-headline font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#97d700]" />
            <span>Real-Time Audit & Document Stream</span>
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search documents or case IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#131313] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono text-gray-400">
                <th className="pb-3 px-3">CASE ID & DOCUMENT</th>
                <th className="pb-3 px-3">SECTOR</th>
                <th className="pb-3 px-3">RISK SCORE</th>
                <th className="pb-3 px-3">VERDICT</th>
                <th className="pb-3 px-3">SOFTWARE FOOTPRINT</th>
                <th className="pb-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {filteredQueue.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition">
                  <td className="py-4 px-3">
                    <div className="font-bold text-white flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#00E5FF]" />
                      <span>{item.documentName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{item.id}</span>
                  </td>

                  <td className="py-4 px-3 font-bold text-gray-300">
                    {item.sector}
                  </td>

                  <td className="py-4 px-3 font-bold text-sm">
                    <span className={item.riskScore > 80 ? 'text-red-400' : (item.riskScore > 15 ? 'text-[#FFAB00]' : 'text-[#97d700]')}>
                      {item.riskScore}%
                    </span>
                  </td>

                  <td className="py-4 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.verdictColor}`}>
                      {item.verdict}
                    </span>
                  </td>

                  <td className="py-4 px-3 text-gray-400 text-[11px]">
                    {item.software}
                  </td>

                  <td className="py-4 px-3 text-right">
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="px-3 py-1.5 bg-[#201f1f] hover:bg-[#97d700] text-gray-300 hover:text-black font-bold rounded-lg border border-white/10 transition inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
