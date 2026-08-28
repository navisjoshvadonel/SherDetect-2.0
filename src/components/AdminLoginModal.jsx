import React, { useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Lock, ShieldCheck, KeyRound, AlertCircle, X, CheckCircle2 } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (supabaseService.loginAdmin(passcode)) {
      setError('');
      setPasscode('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid Admin Security Key. Use passcode: admin123');
    }
  };

  const handleQuickDemoLogin = () => {
    supabaseService.loginAdmin('admin123');
    setError('');
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white border-2.5 border-blue-500 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-50 rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-headline font-bold text-slate-900">
              Enterprise Admin Authentication
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Secured 3rd Level Verifier Access
            </p>
          </div>
        </div>

        {/* EXPLANATION */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-body space-y-1">
          <p>
            🔐 <strong>Security Note:</strong> Normal users do not require login. Admin authentication protects private user upload details and 3rd level audit confirmations.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-600 flex items-center justify-between">
              <span>ADMIN SECURITY KEY:</span>
              <span className="text-blue-600">Demo Key: admin123</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="Enter security passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs font-mono text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#97d700] text-black font-headline font-extrabold text-xs tracking-wider rounded-xl shadow hover:bg-[#b2f432] active:scale-95 transition"
            >
              AUTHENTICATE ADMIN ACCESS
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 bg-slate-50 hover:bg-white/10 text-blue-600 font-mono font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>1-CLICK QUICK DEMO ADMIN LOGIN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
