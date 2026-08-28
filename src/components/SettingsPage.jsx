import React, { useState } from 'react';
import { Settings, Shield, Key, Sliders, Bell, Save, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [elaThreshold, setElaThreshold] = useState(45);
  const [fontSensitivity, setFontSensitivity] = useState(85);
  const [livenessThreshold, setLivenessThreshold] = useState(90);
  const [apiKey, setApiKey] = useState('vs_live_99810481029481928401924');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* HEADER */}
      <div className="border-b border-[#353534] pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-blue-600 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#97d700]"></span>
          <span>ENTERPRISE SECURITY & ALGORITHM PARAMETERS</span>
        </div>
        <h1 className="text-3xl font-headline font-bold text-slate-900">
          Platform Settings & AI Configuration
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ALGORITHM THRESHOLDS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <h2 className="text-lg font-headline font-bold text-slate-900 flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <span>Forensic Algorithm Thresholds</span>
          </h2>

          <div className="space-y-6 text-sm font-body">
            {/* ELA Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-600">ELA Quantization Delta Cutoff</span>
                <span className="text-emerald-600 font-bold">{elaThreshold} Delta</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={elaThreshold}
                onChange={(e) => setElaThreshold(e.target.value)}
                className="w-full accent-[#97d700] bg-slate-50 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-xs text-gray-500 font-mono">
                Lower values increase sensitivity to faint compression anomalies. Higher values reduce false positives.
              </p>
            </div>

            {/* Font Sensitivity */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-600">Font Glyph Vector Variance Cutoff</span>
                <span className="text-blue-600 font-bold">{fontSensitivity}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={fontSensitivity}
                onChange={(e) => setFontSensitivity(e.target.value)}
                className="w-full accent-[#00E5FF] bg-slate-50 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Liveness Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-600">Facial Liveness Spoofing Threshold</span>
                <span className="text-[#FFAB00] font-bold">{livenessThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="99"
                value={livenessThreshold}
                onChange={(e) => setLivenessThreshold(e.target.value)}
                className="w-full accent-[#FFAB00] bg-slate-50 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* API KEYS & INTEGRATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <h2 className="text-lg font-headline font-bold text-slate-900 flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span>API Credentials & Webhooks</span>
          </h2>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-slate-600 block">Production Secret API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setApiKey('vs_live_' + Math.random().toString(36).substring(2, 18))}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-[#2a2a2a] text-slate-600 rounded-xl border border-slate-200 transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-600 block">Fraud Alert Webhook URL</label>
              <input
                type="text"
                defaultValue="https://api.yourcompany.com/v1/compliance/webhooks/fraud-alerts"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center justify-between pt-4">
          {saved ? (
            <span className="text-xs font-mono text-emerald-600 flex items-center space-x-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>SETTINGS SAVED TO ENTERPRISE CLUSTER</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-black font-headline font-extrabold text-xs tracking-wider rounded-xl shadow-lg hover:scale-105 active:scale-95 transition"
          >
            SAVE CONFIGURATION
          </button>
        </div>
      </form>
    </div>
  );
}
