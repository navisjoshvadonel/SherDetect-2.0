import React from 'react';
import { 
  ShieldCheck, Cpu, Database, Eye, Zap, ArrowRight, Lock, 
  Layers, CheckCircle2, AlertOctagon, FileCheck, Server, Sparkles,
  HelpCircle, Binary, Code, BarChart3
} from 'lucide-react';
import { plainEnglishTooltips } from '../data/mockData';

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-blue-300 rounded-full text-xs font-mono text-blue-600 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>SHERDETECT 2.0 — MULTI-DOMAIN DOCUMENT FORENSIC SUITE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-headline font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          AI-Based Document Verification & <span className="bg-gradient-to-r from-[#97d700] via-[#00E5FF] to-white bg-clip-text text-transparent">6-Layer Fraud Detection</span>
        </h1>

        <p className="text-slate-600 font-body text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Tackling the <strong className="text-slate-900">$40B+ annual document fraud crisis</strong> across six high-risk enterprise sectors with explainable, 6-layer forensic risk fusion.
        </p>


      </section>

      {/* 6 HIGH-RISK SECTORS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-headline font-bold text-slate-900">
            Unified Multi-Domain Coverage
          </h2>
          <p className="text-xs font-mono text-slate-500">
            One platform ingests and audits six distinct high-risk document sectors
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: "HR", desc: "Resumes, Employment Certs", icon: "badge" },
            { title: "KYC", desc: "Passports, National IDs", icon: "fingerprint" },
            { title: "Finance", desc: "Bills, Invoices, Statements", icon: "receipt_long" },
            { title: "Academic", desc: "Diplomas, Mark Sheets", icon: "school" },
            { title: "Legal", desc: "Contracts, Agreements", icon: "gavel" },
            { title: "Medical", desc: "Insurance Claims", icon: "health_and_safety" }
          ].map((sec, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-2 hover:border-blue-500 transition">
              <span className="material-symbols-outlined text-emerald-600 text-xl">{sec.icon}</span>
              <h3 className="font-headline font-bold text-slate-900 text-sm">{sec.title} Sector</h3>
              <p className="text-[11px] text-slate-500 font-mono leading-tight">{sec.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6-LAYER ARCHITECTURE MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-headline font-bold text-slate-900">
            The 6-Layer Forensic Architecture
          </h2>
          <p className="text-xs font-mono text-blue-600">
            NO BLACK-BOX CLASSIFIERS — 6 FUSED SIGNAL VECTORS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: "Layer 1",
              title: "EXIF & Software Scanner",
              desc: "Directly names the editing tool used (Photoshop CC, Canva, GIMP) from EXIF byte headers.",
              tooltip: plainEnglishTooltips.exifScanner
            },
            {
              num: "Layer 2",
              title: "ELA Pixel Forensics",
              desc: "Error Level Analysis measures JPEG re-compression to highlight spliced or modified regions.",
              tooltip: plainEnglishTooltips.elaForensics
            },
            {
              num: "Layer 3",
              title: "Laplacian Sharpness Anomaly",
              desc: "Detects font overlay and pasted text/signatures where edge sharpness doesn't match the background.",
              tooltip: plainEnglishTooltips.laplacianSharpness
            },
            {
              num: "Layer 4",
              title: "Benford's Law & PII Sanitizer",
              desc: "First-digit frequency distribution analysis to spot fabricated numbers + PII scrubbing.",
              tooltip: plainEnglishTooltips.benfordLaw
            },
            {
              num: "Layer 5",
              title: "Cryptographic Checksum Audit",
              desc: "Validates ID numbers using Verhoeff Base-10 and Luhn Mod-10 algorithms.",
              tooltip: plainEnglishTooltips.checksumAudit
            },
            {
              num: "Layer 6",
              title: "Gemini Multimodal AI Audit",
              desc: "Semantic & mathematical parity reasoning over content to catch date and calculation mismatches.",
              tooltip: plainEnglishTooltips.geminiAi
            }
          ].map((layer, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-slate-200 space-y-3 relative group hover:border-emerald-500 transition shadow-sm">
              <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-600 font-mono text-xs font-bold inline-block mb-1">
                {layer.num}
              </span>
              <h3 className="font-headline font-bold text-slate-900 text-base mt-2">{layer.title}</h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">{layer.desc}</p>
              
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{layer.tooltip}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW THE AI WORKS (SIMPLE EXPLANATION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl border-2 border-emerald-300 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-headline font-bold text-slate-900 flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              <span>How Our AI Works (In Simple Terms)</span>
            </h2>
            <p className="text-sm font-mono text-slate-500">
              You don't need a PhD in computer science to understand our platform!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-base">The Digital X-Ray</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Just like a doctor looks at an X-ray to see broken bones, our AI looks at the invisible pixels and file data. It spots if a picture was opened and saved in Photoshop, or if someone copy-pasted a new name over an old one.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-emerald-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-base">The Math Checker</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    When you upload an invoice or ID, the AI automatically reads the numbers. It double-checks all the math (like making sure Tax + Subtotal = Total) and checks if ID numbers follow the official rules of the country that issued them.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-base">The Smart Reader</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Using Google's advanced Gemini AI, the system actually reads the document like a human would. It notices logical errors—like if an employment contract says you started working in 2026, but the document was signed in 2020!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-slate-900 font-bold text-sm border-b border-slate-200 pb-2">The Final Decision</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                After running these checks in less than a second, the AI gives the document a score. 
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> <span>If everything is perfect, it says <strong>Authentic</strong>.</span></li>
                <li className="flex items-center space-x-2"><AlertOctagon className="w-4 h-4 text-red-400" /> <span>If it catches a lie, it flags it as a <strong>Forgery</strong>.</span></li>
                <li className="flex items-center space-x-2"><HelpCircle className="w-4 h-4 text-yellow-400" /> <span>If it's unsure, it passes it to a <strong>Human Admin</strong> to make the final call.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3-WAY VERDICT MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-3xl border-2.5 border-blue-300 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-headline font-bold text-slate-900">
              Multi-Vector Risk Fusion Verdict Matrix
            </h2>
            <p className="text-xs font-mono text-slate-500">
              risk_scorer.py combines all 6 layer outputs into a calibrated 0-100 score & 3-way verdict
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-emerald-300 space-y-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-mono font-bold">
                🟢 AUTHENTIC (0-15%)
              </span>
              <h3 className="text-lg font-headline font-bold text-slate-900 mt-2">Verified Authentic</h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                All 6 forensic layers passed with zero anomalies. Document auto-verified.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-[#FFAB00]/40 space-y-2">
              <span className="px-3 py-1 bg-[#FFAB00]/20 text-[#FFAB00] rounded-full text-xs font-mono font-bold">
                🟡 SUSPICIOUS (16-84%)
              </span>
              <h3 className="text-lg font-headline font-bold text-slate-900 mt-2">Requires Verifier Review</h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Minor anomalies detected. Dispatched to Verifier Worklist for 2-second human review.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-red-500/40 space-y-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-mono font-bold">
                🔴 FORGERY (85-100%)
              </span>
              <h3 className="text-lg font-headline font-bold text-slate-900 mt-2">Confirmed Forgery</h3>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Multiple high-confidence forensic flags (Photoshop tag, ELA anomaly, LLM math failure).
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
