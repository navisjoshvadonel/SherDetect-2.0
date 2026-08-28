import React, { useState } from 'react';
import { 
  ShieldCheck, LayoutDashboard, FileSearch, ShieldAlert, 
  Settings, Lock, LogOut, Zap, UserCheck, KeyRound, Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isAdmin, onOpenAdminModal, onLogoutAdmin }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-50/95 backdrop-blur-md border-b-2 border-blue-500/30 px-4 sm:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* LOGO & BRANDING */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('userPortal')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#97d700] via-[#00E5FF] to-blue-600 p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-50 rounded-[10px] flex items-center justify-center">
              <span className="font-headline font-black text-emerald-600 text-lg tracking-tighter">SD</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-headline font-extrabold text-xl text-slate-900 tracking-wider">
                Sher<span className="text-blue-600">Detect</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#97d700] text-black font-mono font-extrabold text-[10px]">
                v2.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">
              Multi-Domain Document Verification Platform
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <nav className="flex items-center space-x-1.5 bg-white p-1.5 rounded-xl border border-slate-200 overflow-x-auto w-full md:w-auto">
          {/* Public User Portal Tab (No Login Needed) */}
          {!isAdmin && (
            <button
              onClick={() => setActiveTab('userPortal')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'userPortal'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-black shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>User Ingestion & AI Reply</span>
            </button>
          )}



          {/* Secured Admin Command Center (Requires Admin Login) */}
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('adminCommand')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'adminCommand'
                    ? 'bg-red-500 text-slate-900 shadow-sm'
                    : 'text-blue-600 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Command Center (3rd Level)</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-black shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Sector Analytics</span>
              </button>
            </>
          )}
        </nav>

        {/* ADMIN AUTHENTICATION BUTTON */}
        <div className="flex items-center space-x-2">
          {isAdmin ? (
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-600 border border-emerald-300 rounded-full font-mono text-[10px] font-bold flex items-center space-x-1">
                <UserCheck className="w-3 h-3" />
                <span>ADMIN ACTIVE</span>
              </span>

              <button
                onClick={onLogoutAdmin}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-mono text-xs rounded-xl border border-red-500/40 transition flex items-center space-x-1"
                title="Logout Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminModal}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-blue-600 font-mono font-bold text-xs rounded-xl border-2 border-blue-300 shadow hover:border-blue-500 transition flex items-center space-x-1.5"
            >
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>ADMIN LOGIN 🔒</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
