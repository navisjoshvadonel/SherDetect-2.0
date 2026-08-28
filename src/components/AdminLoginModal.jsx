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
      <div className="bg-[#1c1b1b] border-2.5 border-[#00E5FF] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#97d700] to-[#00E5FF] p-0.5 shadow-neo">
            <div className="w-full h-full bg-[#131313] rounded-[14px] flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#97d700]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-headline font-bold text-white">
              Enterprise Admin Authentication
            </h2>
            <p className="text-xs font-mono text-gray-400">
              Secured 3rd Level Verifier Access
            </p>
          </div>
        </div>

        {/* EXPLANATION */}
        <div className="p-3 bg-[#131313] rounded-xl border border-white/5 text-xs text-gray-300 font-body space-y-1">
          <p>
            🔐 <strong>Security Note:</strong> Normal users do not require login. Admin authentication protects private user upload details and 3rd level audit confirmations.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-gray-300 flex items-center justify-between">
              <span>ADMIN SECURITY KEY:</span>
              <span className="text-[#00E5FF]">Demo Key: admin123</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="Enter security passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#131313] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E5FF] font-mono"
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
              className="w-full py-2.5 bg-[#131313] hover:bg-white/10 text-[#00E5FF] font-mono font-bold text-xs rounded-xl border border-white/10 transition flex items-center justify-center space-x-1.5"
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
