import React, { useState, useEffect } from 'react';
import { runSherDetectPipeline } from '../utils/forensicScanner';
import { supabaseService } from '../services/supabaseService';
import { 
  Upload, FileText, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, 
  Send, Lock, Search, Clock, Cpu, HelpCircle, ShieldCheck, Zap, ArrowRight
} from 'lucide-react';

export default function PublicUserPortal({ onOpenAdminModal, isAdmin }) {
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [sector, setSector] = useState('Finance');

  const [isScanning, setIsScanning] = useState(false);
  const [completedLayers, setCompletedLayers] = useState([]);
  const [scanResult, setScanResult] = useState(null);

  // Ticket Tracking State
  const [trackIdInput, setTrackIdInput] = useState('');
  const [trackedTicket, setTrackedTicket] = useState(null);
  const [trackError, setTrackError] = useState('');
  
  // Real-time Notification State
  const [notificationMessage, setNotificationMessage] = useState(null);

  // Polling mechanism to check for Admin updates
  useEffect(() => {
    let interval;
    const activeTicketId = scanResult?.id || trackedTicket?.id;
    
    if (activeTicketId) {
      interval = setInterval(async () => {
        const latestStatus = await supabaseService.trackSubmission(activeTicketId);
        if (latestStatus && latestStatus.status === 'ADMIN_AUDITED') {
          // Check if this is a new update
          const isNewlyAudited = 
            (scanResult && scanResult.id === latestStatus.id && scanResult.status !== 'ADMIN_AUDITED') || 
            (trackedTicket && trackedTicket.id === latestStatus.id && trackedTicket.status !== 'ADMIN_AUDITED');
            
          if (isNewlyAudited) {
            setNotificationMessage(`🚨 ADMIN VERDICT REACHED: Document '${latestStatus.documentName}' (Ticket ${latestStatus.id}) was marked as ${latestStatus.adminConfirmed} by the human verifier!`);
            
            // Update the local state to show the new status
            if (scanResult && scanResult.id === latestStatus.id) setScanResult(latestStatus);
            if (trackedTicket && trackedTicket.id === latestStatus.id) setTrackedTicket(latestStatus);
            
            // Auto dismiss after 12 seconds
            setTimeout(() => setNotificationMessage(null), 12000);
          }
        }
      }, 3000); // Poll every 3 seconds for fast hackathon demo
    }
    
    return () => clearInterval(interval);
  }, [scanResult, trackedTicket]);

  const handleFileDrop = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);
      setScanResult(null);
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleSubmitUserDocument = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsScanning(true);
    setCompletedLayers([]);
    setScanResult(null);

    // Run 6-Layer Forensic Engine
    const pipelineData = await runSherDetectPipeline(file, (layerUpdate) => {
      setCompletedLayers((prev) => [...prev, layerUpdate]);
    });

    // Convert to Base64 so Admin can view it across browsers
    let base64Preview = "";
    if (file.type.startsWith('image/')) {
      base64Preview = await toBase64(file);
    } else {
      // Fake preview for PDF
      base64Preview = "https://via.placeholder.com/400x500.png?text=PDF+Document";
    }

    // Save privately to Supabase database
    const savedRecord = await supabaseService.createSubmission({
      documentName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + ' KB',
      sector,
      userName: userName || 'Anonymous User',
      userEmail: userEmail || 'Not Provided',
      riskScore: pipelineData.riskScore,
      verdict: pipelineData.verdict,
      verdictBadge: pipelineData.verdictBadge,
      verdictDescription: pipelineData.verdictDescription,
      layers: pipelineData.layers,
      software: pipelineData.layers[0]?.detail || 'Unknown',
      preview: base64Preview
    });

    setScanResult(savedRecord);
    setIsScanning(false);
  };

  const handleSearchTrackTicket = async (e) => {
    e.preventDefault();
    if (!trackIdInput.trim()) return;

    const found = await supabaseService.trackSubmission(trackIdInput);
    if (found) {
      setTrackedTicket(found);
      setTrackError('');
    } else {
      setTrackedTicket(null);
      setTrackError(`Ticket '${trackIdInput}' not found in Supabase audit database.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-20 relative">
      
      {/* GLOBAL NOTIFICATION TOAST */}
      {notificationMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#1c1b1b] border-2 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)] p-4 rounded-2xl flex items-center space-x-4 animate-bounce-in max-w-2xl w-full">
          <div className="w-10 h-10 rounded-full bg-[#00E5FF]/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-headline font-bold text-sm">Real-Time Admin Notification</h4>
            <p className="text-xs text-[#00E5FF] font-mono mt-1">{notificationMessage}</p>
          </div>
          <button onClick={() => setNotificationMessage(null)} className="text-gray-400 hover:text-white">
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {/* HERO & TICKET TRACKER BAR */}
      <div className="bg-[#1c1b1b] p-6 sm:p-8 rounded-3xl border-2.5 border-[#00E5FF]/40 shadow-neo space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#131313] border border-[#97d700]/40 rounded-full text-xs font-mono text-[#97d700]">
              <Sparkles className="w-3.5 h-3.5 text-[#97d700]" />
              <span>PUBLIC DOCUMENT INGESTION PORTAL (NO LOGIN REQUIRED)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-headline font-extrabold text-white">
              Upload Document for AI & Admin Verification
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-body max-w-2xl">
              Upload your PDF/image for automated 6-layer AI evaluation. Your data is stored privately in Supabase and routed to an enterprise admin for 3rd level confirmation.
            </p>
          </div>

          {/* Quick Ticket Tracking Widget */}
          <div className="bg-[#131313] p-4 rounded-2xl border border-white/10 space-y-3 min-w-[280px]">
            <span className="text-xs font-mono font-bold text-gray-300 flex items-center space-x-1.5">
              <Search className="w-4 h-4 text-[#00E5FF]" />
              <span>TRACK YOUR TICKET STATUS</span>
            </span>

            <form onSubmit={handleSearchTrackTicket} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. SHER-294810"
                value={trackIdInput}
                onChange={(e) => setTrackIdInput(e.target.value)}
                className="flex-1 bg-[#201f1f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#00E5FF]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#00E5FF] text-black font-bold text-xs rounded-xl hover:bg-cyan-300 transition"
              >
                Track
              </button>
            </form>

            {trackError && <p className="text-[10px] text-red-400 font-mono">{trackError}</p>}
          </div>
        </div>

        {/* TRACKED TICKET DISPLAY CARD IF SEARCHED */}
        {trackedTicket && (
          <div className="p-4 bg-[#131313] rounded-2xl border border-[#00E5FF] space-y-2 animate-fade-in text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Ticket: {trackedTicket.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                trackedTicket.status === 'ADMIN_AUDITED' 
                  ? (trackedTicket.adminConfirmed === 'AUTHENTIC' ? 'bg-[#97d700]/20 text-[#97d700]' : 'bg-red-500/20 text-red-400')
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                STATUS: {trackedTicket.status} (Admin Verdict: {trackedTicket.adminConfirmed || 'PENDING'})
              </span>
            </div>
            <p className="text-gray-300 font-body">Document: {trackedTicket.documentName} | Submitted by: {trackedTicket.userName}</p>
            {trackedTicket.adminNotes && (
              <p className="text-xs text-[#00E5FF] pt-1 border-t border-white/5 font-mono">
                Admin Audit Note: {trackedTicket.adminNotes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* UPLOAD FORM & 6-LAYER EXECUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmitUserDocument} className="bg-[#1c1b1b] p-6 rounded-3xl border border-white/10 space-y-5">
            <h2 className="text-lg font-headline font-bold text-white flex items-center space-x-2">
              <Upload className="w-5 h-5 text-[#97d700]" />
              <span>Step 1: Document Upload</span>
            </h2>

            {/* File Drop Area */}
            <div className="border-2 border-dashed border-[#00E5FF]/40 rounded-2xl p-6 text-center hover:border-[#00E5FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 relative group bg-[#131313] hover:bg-[#1a1a1a]">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                required
              />
              <div className="w-12 h-12 rounded-xl bg-[#201f1f] group-hover:bg-[#00E5FF]/20 text-[#97d700] group-hover:text-[#00E5FF] mx-auto flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="font-headline font-bold text-white text-sm group-hover:text-[#00E5FF] transition-colors">
                {file ? file.name : "Click to select or drag document here"}
              </p>
              <p className="text-xs text-gray-400 font-mono mt-1">
                PDF, JPEG, PNG up to 50 MB
              </p>
            </div>

            {/* User Metadata Fields */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-gray-300 mb-1 block">YOUR NAME (OPTIONAL):</label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-gray-300 mb-1 block">YOUR EMAIL (OPTIONAL):</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="text-gray-300 mb-1 block">DOCUMENT SECTOR:</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="Finance">Finance & Bills</option>
                  <option value="KYC">KYC & Passports</option>
                  <option value="HR">HR & Resumes</option>
                  <option value="Academic">Academic & Diplomas</option>
                  <option value="Legal">Legal & Contracts</option>
                  <option value="Medical">Medical Claims</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || isScanning}
              className="w-full py-3.5 bg-gradient-to-r from-[#97d700] to-[#00E5FF] text-black font-headline font-extrabold text-xs tracking-wider rounded-xl shadow-neo hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>RUNNING 6-LAYER FORENSIC ENGINE...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>SUBMIT & RUN AI VERIFICATION</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* STEP 2: AI AUTOMATED EVALUATION REPLY (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* REAL-TIME PROGRESS PIPELINE */}
          {isScanning && (
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border border-[#00E5FF]/40 space-y-4 animate-pulse">
              <h3 className="text-sm font-headline font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-[#00E5FF] animate-spin" />
                <span>Executing 6-Layer Forensic Microservices...</span>
              </h3>

              <div className="space-y-2">
                {completedLayers.map((layer) => (
                  <div key={layer.id} className="p-2.5 bg-[#131313] rounded-xl border border-white/5 text-xs font-mono flex items-center justify-between text-gray-300">
                    <span>{layer.name}</span>
                    <span className="text-[#97d700] font-bold">COMPLETED</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI AUTOMATED EVALUATION RESULT */}
          {scanResult ? (
            <div className="bg-[#1c1b1b] p-6 rounded-3xl border-2.5 border-[#00E5FF] shadow-neo space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#97d700]" />
                  <h3 className="text-base font-headline font-bold text-white">
                    Step 2: AI Preliminary Evaluation Reply
                  </h3>
                </div>

                <span className="px-3 py-1 bg-[#131313] border border-[#00E5FF] text-[#00E5FF] rounded-full font-mono text-xs font-bold">
                  TICKET: {scanResult.id}
                </span>
              </div>

              {/* AI AUTOMATED REPLY CARD */}
              <div className="p-4 bg-[#131313] rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">AI DETECTED RISK SCORE:</span>
                  <span className={`text-sm font-mono font-bold ${
                    scanResult.riskScore > 80 ? 'text-red-400' : (scanResult.riskScore > 15 ? 'text-yellow-400' : 'text-[#97d700]')
                  }`}>
                    {scanResult.riskScore}%
                  </span>
                </div>

                <div className="p-3 bg-[#1c1b1b] rounded-xl text-xs font-body text-gray-200 leading-relaxed border border-white/5">
                  <strong className="text-[#97d700] font-mono block mb-1">🤖 AI Forensic Response:</strong>
                  {scanResult.verdictDescription}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>3rd Level Status:</span>
                  <span className="text-yellow-300 font-bold">
                    PENDING ADMIN CONFIRMATION
                  </span>
                </div>
              </div>

              {/* SAFE PRIVACY NOTICE */}
              <div className="p-3 bg-[#131313] rounded-xl border border-white/5 text-xs font-mono text-gray-400 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#97d700]" />
                  <span>Stored privately in Supabase database</span>
                </span>
                <span>Ticket #{scanResult.id}</span>
              </div>
            </div>
          ) : (
            !isScanning && (
              <div className="bg-[#1c1b1b] p-8 rounded-3xl border border-white/10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#131313] text-[#00E5FF] mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-headline font-bold text-white">
                  Ready for Document Verification
                </h3>
                <p className="text-xs text-gray-400 font-body max-w-md mx-auto">
                  Upload a document on the left to run our 6-layer forensic suite. No account or login required!
                </p>
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}
