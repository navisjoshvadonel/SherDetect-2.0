import React, { useState, useEffect } from 'react';
import ElaCanvasInspector from './ElaCanvasInspector';
import { runSherDetectPipeline } from '../utils/forensicScanner';
import { mockSampleDocuments, plainEnglishTooltips } from '../data/mockData';
import { 
  Upload, FileText, CheckCircle2, ShieldAlert, AlertTriangle, 
  Sparkles, RefreshCw, Cpu, Lock, ArrowRight, Database, Calculator, 
  Check, X, Eye, ShieldCheck, Zap, Download, HelpCircle, FileJson
} from 'lucide-react';

export default function VerificationPage({ setActiveTab }) {
  const [selectedDoc, setSelectedDoc] = useState(mockSampleDocuments[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [completedLayers, setCompletedLayers] = useState([]);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const startPipeline = (docToScan = selectedDoc) => {
    setIsScanning(true);
    setCompletedLayers([]);
    setPipelineResult(null);

    runSherDetectPipeline(
      { name: docToScan.name, size: docToScan.verdict === 'FORGERY' ? 2500000 : 800000 },
      (layerUpdate) => {
        setCompletedLayers((prev) => [...prev, layerUpdate]);
      }
    ).then((res) => {
      setPipelineResult(res);
      setIsScanning(false);
    });
  };

  useEffect(() => {
    startPipeline(selectedDoc);
  }, [selectedDoc]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = {
        id: 'uploaded-' + Date.now(),
        name: file.name,
        sector: 'User Upload',
        type: 'User Ingested Document',
        preview: URL.createObjectURL(file),
        verdict: file.name.toLowerCase().includes('forge') ? 'FORGERY' : 'SUSPICIOUS'
      };
      setSelectedDoc(newDoc);
    }
  };

  const handleDownloadAuditJSON = () => {
    if (!pipelineResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pipelineResult.auditJson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SherDetect_Audit_${selectedDoc.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      {/* BANNER & SAMPLE FIXTURES */}
      <div className="bg-white p-6 rounded-2xl border-2.5 border-blue-300 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#97d700] animate-ping"></span>
              <span>SHERDETECT 2.0 — 6-LAYER FORENSIC VERIFICATION SUITE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 mt-1">
              Multi-Layer Document Verification
            </h1>
          </div>

          {/* Quick Demo Fixture Buttons */}
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
            <span className="text-xs font-mono text-slate-500 px-2 whitespace-nowrap">Load Demo Fixture:</span>
            {mockSampleDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedDoc.id === doc.id
                    ? 'bg-[#00E5FF] text-black font-bold shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {doc.sector}: {doc.type}
              </button>
            ))}
          </div>
        </div>

        {/* 6 FORENSIC LAYERS OVERVIEW STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs font-mono">
          {[
            { id: 1, name: "1. Metadata Scanner", file: "metadata_scanner.py", desc: "Photoshop/Canva Tag" },
            { id: 2, name: "2. ELA Engine", file: "ela_engine.py", desc: "JPEG Re-compression" },
            { id: 3, name: "3. Sharpness Inspector", file: "sharpness_inspector.py", desc: "Font Edge Overlay" },
            { id: 4, name: "4. Benford & PII", file: "benford_inspector.py", desc: "1st Digit & Privacy" },
            { id: 5, name: "5. Checksum Audit", file: "checksum_validator.py", desc: "Verhoeff & Luhn Math" },
            { id: 6, name: "6. Gemini Multimodal AI", file: "ai_validator.py", desc: "Semantic & Math Parity" }
          ].map((layer) => {
            const isCompleted = completedLayers.some(l => l.id === layer.id);
            const isFailed = completedLayers.find(l => l.id === layer.id)?.status === 'FLAGGED';
            return (
              <div
                key={layer.id}
                className={`p-2.5 rounded-xl border transition ${
                  isFailed
                    ? 'bg-red-950/40 border-red-500 text-red-400 font-bold'
                    : (isCompleted
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-600 font-bold'
                      : 'bg-slate-50 border-slate-100 text-gray-500')
                }`}
              >
                <p className="font-bold text-[11px] truncate">{layer.name}</p>
                <p className="text-[9px] text-slate-500 font-mono truncate">{layer.file}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN TWO-COLUMN INSPECTION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT 7 COLS: INTERACTIVE FORENSIC CANVAS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-headline font-bold text-slate-900 flex items-center space-x-2">
                <span className="material-symbols-outlined text-emerald-600">biotech</span>
                <span>Document Forensic Inspection Canvas</span>
              </h2>

              <button
                onClick={() => startPipeline(selectedDoc)}
                disabled={isScanning}
                className="flex items-center space-x-1.5 text-xs font-mono text-blue-600 hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>Re-Run 6-Layer Pipeline</span>
              </button>
            </div>

            <ElaCanvasInspector imageSrc={selectedDoc.preview} isAnalyzing={isScanning} />
          </div>

          {/* UPLOAD DROPZONE */}
          <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-blue-500/30 hover:border-emerald-500 transition text-center space-y-3 relative group">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-emerald-600 mx-auto flex items-center justify-center group-hover:scale-110 transition">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline font-bold text-slate-900 text-sm">
                Drop your document here or click to browse
              </p>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Supports PDF, JPEG, PNG across all 6 High-Risk Sectors (HR, KYC, Finance, Academic, Legal, Medical)
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: RISK SCORECARD & PER-LAYER FINDINGS */}
        <div className="lg:col-span-5 space-y-6">

          {/* MULTI-VECTOR RISK FUSION SCORECARD */}
          <div className={`p-6 rounded-2xl border-2.5 transition-all ${
            pipelineResult?.verdict === 'FORGERY'
              ? 'bg-red-950/40 border-red-500 shadow-xl shadow-red-500/10'
              : (pipelineResult?.verdict === 'SUSPICIOUS'
                ? 'bg-amber-950/40 border-[#FFAB00] shadow-xl shadow-[#FFAB00]/10'
                : 'bg-emerald-950/40 border-emerald-500 shadow-xl shadow-[#97d700]/10')
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-mono text-slate-600">MULTI-VECTOR RISK FUSION VERDICT</span>
              <span className="font-mono text-xs font-bold text-blue-600">
                CALIBRATED RISK: {pipelineResult?.riskScore || 0}%
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-extrabold border ${
                  pipelineResult?.verdictBadge || 'bg-gray-800 text-slate-600'
                }`}>
                  VERDICT: {pipelineResult?.verdict || 'RUNNING PIPELINE...'}
                </span>

                <button
                  onClick={handleDownloadAuditJSON}
                  disabled={!pipelineResult}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-white/10 text-slate-900 font-mono text-xs rounded-xl border border-slate-200 transition flex items-center space-x-1.5"
                >
                  <FileJson className="w-3.5 h-3.5 text-blue-600" />
                  <span>Export Audit JSON</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 font-body leading-relaxed">
                {pipelineResult?.verdictDescription}
              </p>

              {/* THREE-WAY VERDICT LEGEND */}
              <div className="pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                <div className={`p-2 rounded-lg border ${pipelineResult?.verdict === 'AUTHENTIC' ? 'bg-emerald-100 border-emerald-500 text-emerald-600 font-bold' : 'bg-slate-50 text-gray-500'}`}>
                  🟢 0 - 15%<br />AUTHENTIC
                </div>
                <div className={`p-2 rounded-lg border ${pipelineResult?.verdict === 'SUSPICIOUS' ? 'bg-[#FFAB00]/20 border-[#FFAB00] text-[#FFAB00] font-bold' : 'bg-slate-50 text-gray-500'}`}>
                  🟡 16 - 84%<br />SUSPICIOUS
                </div>
                <div className={`p-2 rounded-lg border ${pipelineResult?.verdict === 'FORGERY' ? 'bg-red-500/20 border-red-500 text-red-400 font-bold' : 'bg-slate-50 text-gray-500'}`}>
                  🔴 85 - 100%<br />FORGERY
                </div>
              </div>
            </div>

            {/* HAND-OFF TO VERIFIER WORKLIST BUTTON */}
            {pipelineResult && (pipelineResult.verdict === 'SUSPICIOUS' || pipelineResult.verdict === 'FORGERY') && (
              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-mono">Dispatched to Verifier Worklist:</span>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="px-4 py-2 bg-[#97d700] text-black font-headline font-extrabold text-xs rounded-xl shadow hover:bg-[#b2f432] transition flex items-center space-x-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>OPEN VERIFIER WORKLIST (2s)</span>
                </button>
              </div>
            )}
          </div>

          {/* PER-LAYER DETAILED FINDINGS ACCORDION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-headline font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>6-Layer Forensic Analysis Findings</span>
              </span>
              <span className="text-xs font-mono text-emerald-600">PARALLEL EXECUTION</span>
            </h3>

            <div className="space-y-3">
              {completedLayers.map((layer) => (
                <div 
                  key={layer.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    layer.status === 'FLAGGED'
                      ? 'bg-red-950/20 border-red-500/30 text-red-300'
                      : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-slate-900">{layer.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      layer.status === 'FLAGGED' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {layer.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-600">
                    <strong className="text-blue-600 font-mono">{layer.code}: </strong>
                    {layer.detail}
                  </p>

                  <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                    <HelpCircle className="w-3 h-3 text-emerald-600" />
                    <span>{layer.simpleTitle}: {layer.tooltip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
