import React, { useState } from 'react';
import { mockWorklistQueue } from '../data/mockData';
import ElaCanvasInspector from './ElaCanvasInspector';
import { 
  ShieldAlert, FileText, CheckCircle2, UserCheck, Clock, Download, 
  Share2, MessageSquare, AlertOctagon, Send, FileJson, ArrowLeft,
  Check, X, Zap, Lock, ShieldCheck, Eye, RefreshCw, Search, Filter
} from 'lucide-react';

export default function FraudReportsPage({ setActiveTab }) {
  const [selectedCase, setSelectedCase] = useState(mockWorklistQueue[0]);
  const [sectorFilter, setSectorFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState([
    { author: "Verifier Desk #1", time: "2026-08-28 18:25", text: "Confirmed Photoshop metadata footprint and subtotal math disparity ($480 discrepancy). Forgery confirmed." },
    { author: "SherDetect Risk Fusion Engine", time: "2026-08-28 18:20", text: "Automated verdict: FORGERY (Score 88.5%)." }
  ]);
  const [newNote, setNewNote] = useState('');
  const [actionDone, setActionDone] = useState(null);

  const filteredQueue = mockWorklistQueue.filter(item => {
    const matchesSearch = item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || item.sectorId === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes(prev => [
      { author: "Human Reviewer (You)", time: new Date().toISOString().slice(0, 16).replace('T', ' '), text: newNote.trim() },
      ...prev
    ]);
    setNewNote('');
  };

  const handleReviewerAction = (action) => {
    setActionDone(action);
    setTimeout(() => setActionDone(null), 3500);
  };

  const handleDownloadJSONAudit = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedCase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SherDetect_Audit_${selectedCase.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#353534] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00E5FF] mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#97d700] animate-pulse"></span>
            <span>SHERDETECT 2.0 — VERIFIER INSPECTION WORKLIST (HUMAN-IN-THE-LOOP)</span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-white flex items-center space-x-3">
            <span>Reviewer Queue & Case Audit</span>
            <span className={`px-3 py-1 border rounded-full text-xs font-mono font-extrabold ${selectedCase.verdictColor}`}>
              VERDICT: {selectedCase.verdict} ({selectedCase.riskScore}%)
            </span>
          </h1>
        </div>

        {/* Audit JSON Download */}
        <button
          onClick={handleDownloadJSONAudit}
          className="px-4 py-2 bg-[#1c1b1b] hover:bg-[#252424] text-white font-mono text-xs rounded-xl border border-white/10 transition flex items-center space-x-2"
        >
          <FileJson className="w-4 h-4 text-[#00E5FF]" />
          <span>Export JSON Audit</span>
        </button>
      </div>

      {/* 2-SECOND REVIEWER ACTION BAR */}
      <div className="bg-[#1c1b1b] p-5 rounded-2xl border-2.5 border-[#00E5FF]/40 shadow-neo flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#97d700]" />
            <h2 className="font-headline font-bold text-white text-base">
              2-Second Verifier Decision Handoff
            </h2>
          </div>
          <p className="text-xs text-gray-300 font-body">
            Active Case: <strong className="text-[#00E5FF] font-mono">{selectedCase.id} ({selectedCase.documentName})</strong>
          </p>
        </div>

        {actionDone ? (
          <div className={`px-6 py-3 rounded-xl font-mono text-xs font-bold border animate-pulse flex items-center space-x-2 ${
            actionDone === 'AUTHENTIC' ? 'bg-[#97d700]/20 text-[#97d700] border-[#97d700]' : 'bg-red-500/20 text-red-400 border-red-500'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>DECISION SAVED TO SUPABASE AUDIT TRAIL IN 0.3s!</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => handleReviewerAction('AUTHENTIC')}
              className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-[#97d700] text-black font-headline font-extrabold text-xs shadow hover:bg-[#b2f432] active:scale-95 transition flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>MARK AUTHENTIC</span>
            </button>

            <button
              onClick={() => handleReviewerAction('FORGERY')}
              className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-red-600 text-white font-headline font-extrabold text-xs shadow hover:bg-red-500 active:scale-95 transition flex items-center justify-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>CONFIRM FORGERY</span>
            </button>
          </div>
        )}
      </div>

      {/* WORKLIST QUEUE SELECTION & SECTOR FILTER STRIP */}
      <div className="bg-[#1c1b1b] p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-headline font-bold text-white flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#00E5FF]" />
            <span>Filter Worklist Queue by Sector:</span>
          </span>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs font-mono">
            {['all', 'finance', 'kyc', 'hr', 'academic', 'legal', 'medical'].map((sec) => (
              <button
                key={sec}
                onClick={() => setSectorFilter(sec)}
                className={`px-3 py-1.5 rounded-lg font-bold transition capitalize whitespace-nowrap ${
                  sectorFilter === sec ? 'bg-[#00E5FF] text-black shadow' : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* QUEUE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredQueue.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedCase(item);
                setActionDone(null);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                selectedCase.id === item.id
                  ? 'bg-[#201f1f] border-[#00E5FF] shadow-lg'
                  : 'bg-[#131313] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-white font-bold truncate">{item.id}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${item.verdictColor}`}>
                  {item.verdict}
                </span>
              </div>
              <p className="text-xs text-gray-300 font-bold truncate">{item.documentName}</p>
              <p className="text-[10px] text-gray-400 font-mono mt-1">{item.sector} | Risk: {item.riskScore}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED CASE AUDIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT 7 COLS: FORENSIC CANVAS & PLAIN ENGLISH EXPLANATION */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ELA Canvas Inspector */}
          <div className="space-y-3">
            <h2 className="text-lg font-headline font-bold text-white flex items-center space-x-2">
              <span className="material-symbols-outlined text-red-400">scanner</span>
              <span>Interactive Forensic Image & Heatmap Inspector</span>
            </h2>

            <ElaCanvasInspector imageSrc={selectedCase.preview} />
          </div>

          {/* PLAIN-ENGLISH HUMAN EXPLANATION CARD */}
          <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-sm font-headline font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#97d700]" />
              <span>Plain-English Forensic Explanation</span>
            </h3>

            <div className="p-4 bg-[#131313] rounded-xl border border-white/5 text-xs font-body text-gray-300 space-y-2">
              <p className="leading-relaxed">
                <strong className="text-white font-mono">Summary: </strong>
                {selectedCase.easyExplanation}
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-[#00E5FF]">
                Software Detected: <span className="text-red-400 font-bold">{selectedCase.software}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: FAILED LAYERS & REVIEWER NOTES */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FAILED FORENSIC LAYERS LIST */}
          <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-headline font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Failed Forensic Layers ({selectedCase.layersFailed.length})</span>
            </h3>

            {selectedCase.layersFailed.length > 0 ? (
              <div className="space-y-2 text-xs font-mono">
                {selectedCase.layersFailed.map((layer, idx) => (
                  <div key={idx} className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-red-300 flex items-center justify-between">
                    <span>{layer}</span>
                    <span className="font-bold text-red-400">FLAGGED</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#97d700]/10 border border-[#97d700]/30 rounded-xl text-xs font-mono text-[#97d700]">
                All 6 forensic layers passed cleanly with zero anomalies.
              </div>
            )}
          </div>

          {/* VERIFIER AUDIT NOTES */}
          <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-headline font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#97d700]" />
              <span>Reviewer Log Notes</span>
            </h3>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Log internal reviewer note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#97d700]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#97d700] text-black font-bold rounded-xl text-xs hover:bg-[#b2f432] transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {notes.map((note, idx) => (
                <div key={idx} className="p-3 bg-[#131313] rounded-xl border border-white/5 text-xs space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[#97d700] font-bold">{note.author}</span>
                    <span className="text-gray-500">{note.time}</span>
                  </div>
                  <p className="text-gray-300 font-body">{note.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
