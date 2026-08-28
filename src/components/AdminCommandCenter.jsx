import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, Lock, Eye, LogOut, 
  FileJson, RefreshCw, Check, X, Search, Filter, MessageSquare, Zap, Database
} from 'lucide-react';

export default function AdminCommandCenter({ onLogout }) {
  const [submissions, setSubmissions] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [adminNote, setAdminNote] = useState('');
  const [actionDoneMsg, setActionDoneMsg] = useState('');

  const reloadData = async () => {
    const data = await supabaseService.getSubmissions();
    setSubmissions(data);
    if (data.length > 0 && !selectedCase) {
      setSelectedCase(data[0]);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const filteredSubmissions = submissions.filter(item => {
    const matchesSearch = item.documentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || item.sector?.toLowerCase() === sectorFilter.toLowerCase();
    return matchesSearch && matchesSector;
  });

  const handleAdminDecision = async (verdict) => {
    if (!selectedCase) return;
    const updatedRecord = await supabaseService.updateAdminVerdict(selectedCase.id, verdict, adminNote);
    setSelectedCase(updatedRecord);
    await reloadData();
    setActionDoneMsg(`3rd Level Decision '${verdict}' saved to Supabase audit trail!`);
    setTimeout(() => setActionDoneMsg(''), 3500);
  };

  const handleExportJSON = () => {
    if (!selectedCase) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedCase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Supabase_Audit_${selectedCase.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
      
      {/* HEADER & ADMIN SESSION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#353534] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#97d700] animate-pulse"></span>
            <span>SHERDETECT 2.0 — SECURED ADMIN COMMAND CENTER (3RD LEVEL CONFIRMATION)</span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-slate-900 flex items-center space-x-3">
            <span>Private User Database & Audit Vault</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-full text-xs font-mono font-bold">
              ADMIN AUTHENTICATED
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            disabled={!selectedCase}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-mono text-xs rounded-xl border border-slate-200 transition flex items-center space-x-1.5"
          >
            <FileJson className="w-4 h-4 text-blue-600" />
            <span>Export JSON Audit</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-mono text-xs rounded-xl border border-red-500/40 transition flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* 3RD LEVEL ADMIN DECISION BAR */}
      {selectedCase && (
        <div className="bg-white p-6 rounded-3xl border-2.5 border-blue-500 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="font-headline font-bold text-slate-900 text-lg">
                  3rd Level Admin Verdict Confirmation
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-mono mt-1">
                Active Case: <strong className="text-blue-600">{selectedCase.id}</strong> | Document: <strong className="text-slate-900">{selectedCase.documentName}</strong> | Submitted by: <strong className="text-emerald-600">{selectedCase.userName} ({selectedCase.userEmail})</strong>
              </p>
            </div>

            {/* Action Feedback */}
            {actionDoneMsg ? (
              <div className="px-5 py-2.5 bg-emerald-100 text-emerald-600 border border-emerald-500 rounded-xl font-mono text-xs font-bold animate-pulse flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionDoneMsg}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleAdminDecision('AUTHENTIC')}
                  className="px-5 py-2.5 bg-[#97d700] text-black font-headline font-extrabold text-xs rounded-xl shadow hover:bg-[#b2f432] active:scale-95 transition flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>3rd Level: CONFIRM AUTHENTIC</span>
                </button>

                <button
                  onClick={() => handleAdminDecision('FORGERY')}
                  className="px-5 py-2.5 bg-red-600 text-slate-900 font-headline font-extrabold text-xs rounded-xl shadow hover:bg-red-500 active:scale-95 transition flex items-center space-x-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>3rd Level: MARK FORGERY</span>
                </button>
              </div>
            )}
          </div>

          {/* Document Preview for Admin */}
          {selectedCase.preview && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center mb-4">
              <h4 className="text-xs text-blue-600 font-mono font-bold mb-3 self-start">Document Visual Evidence:</h4>
              <img 
                src={selectedCase.preview} 
                alt="Document Preview" 
                className="max-h-[500px] max-w-full object-contain rounded-lg border border-slate-100 shadow-xl"
              />
            </div>
          )}

          {/* Admin Note Input */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-500 whitespace-nowrap">Admin Audit Log Note:</span>
            <input
              type="text"
              placeholder="e.g. Verified official university registrar seal in Supabase database..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* PRIVATE SUPABASE USER UPLOADS TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-headline font-bold text-slate-900">
              Private User Ingestion Database ({filteredSubmissions.length} Submissions)
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket, name, or document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            
            <button 
              onClick={reloadData}
              className="p-2 bg-slate-50 hover:bg-white/10 rounded-xl border border-slate-200 text-blue-600"
              title="Refresh database"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-mono text-slate-500">
                <th className="pb-3 px-3">TICKET & SUBMITTER</th>
                <th className="pb-3 px-3">DOCUMENT & SECTOR</th>
                <th className="pb-3 px-3">AI RISK SCORE</th>
                <th className="pb-3 px-3">AI VERDICT</th>
                <th className="pb-3 px-3">3RD LEVEL ADMIN VERDICT</th>
                <th className="pb-3 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {filteredSubmissions.map((item) => (
                <tr 
                  key={item.id}
                  onClick={() => setSelectedCase(item)}
                  className={`cursor-pointer transition ${
                    selectedCase?.id === item.id ? 'bg-slate-100' : 'hover:bg-slate-100'
                  }`}
                >
                  <td className="py-4 px-3">
                    <div className="font-bold text-slate-900">{item.id}</div>
                    <div className="text-[10px] text-emerald-600">{item.userName} ({item.userEmail})</div>
                  </td>

                  <td className="py-4 px-3">
                    <div className="font-bold text-gray-200">{item.documentName}</div>
                    <div className="text-[10px] text-slate-500">{item.sector}</div>
                  </td>

                  <td className="py-4 px-3 font-bold text-sm">
                    <span className={item.riskScore > 80 ? 'text-red-400' : (item.riskScore > 15 ? 'text-yellow-400' : 'text-emerald-600')}>
                      {item.riskScore}%
                    </span>
                  </td>

                  <td className="py-4 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 bg-slate-50 text-slate-600">
                      {item.verdict}
                    </span>
                  </td>

                  <td className="py-4 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      item.adminConfirmed === 'AUTHENTIC'
                        ? 'bg-emerald-100 text-emerald-600 border-emerald-300'
                        : (item.adminConfirmed === 'FORGERY' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40')
                    }`}>
                      {item.adminConfirmed || 'PENDING'}
                    </span>
                  </td>

                  <td className="py-4 px-3 text-right">
                    <button
                      onClick={() => setSelectedCase(item)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-[#97d700] text-slate-600 hover:text-black font-bold rounded-lg border border-slate-200 transition inline-flex items-center space-x-1"
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

      {/* SELECTED CASE INSPECTOR */}
      {selectedCase && (
        <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200">
          <h3 className="text-lg font-headline font-bold text-slate-900 flex items-center space-x-2">
            <span className="material-symbols-outlined text-blue-600">biotech</span>
            <span>Document Inspection — {selectedCase.documentName}</span>
          </h3>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 w-full flex justify-center bg-black/40 p-4 rounded-xl border border-slate-100">
              <img 
                src={selectedCase.preview} 
                alt="Document Preview" 
                className="max-h-[500px] object-contain rounded-lg shadow-sm"
              />
            </div>
            
            <div className="w-full md:w-1/3 space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-mono text-slate-500">AI MODEL VERDICT</div>
                <div className="text-2xl font-headline font-bold text-slate-900">{selectedCase.verdict}</div>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-mono text-slate-500">AI RISK SCORE</div>
                <div className={`text-4xl font-headline font-extrabold ${selectedCase.riskScore > 80 ? 'text-red-400' : (selectedCase.riskScore > 15 ? 'text-yellow-400' : 'text-emerald-600')}`}>
                  {selectedCase.riskScore}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
