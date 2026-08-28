import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PublicUserPortal from './components/PublicUserPortal';
import LandingPage from './components/LandingPage';
import DashboardPage from './components/DashboardPage';
import AdminCommandCenter from './components/AdminCommandCenter';
import AdminLoginModal from './components/AdminLoginModal';
import InteractiveBackground from './components/InteractiveBackground';
import { supabaseService } from './services/supabaseService';

export default function App() {
  const [activeTab, setActiveTab] = useState('userPortal'); // Default: Public User Portal (No login)
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    // Check initial admin session status
    setIsAdmin(supabaseService.isAdminLoggedIn());
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setActiveTab('adminCommand'); // Switch to Admin Command Center
  };

  const handleAdminLogout = () => {
    supabaseService.logoutAdmin();
    setIsAdmin(false);
    setActiveTab('userPortal');
  };

  const handleTabChange = (tab) => {
    if ((tab === 'adminCommand' || tab === 'dashboard') && !isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-body relative z-0">
      <InteractiveBackground />
      {/* Brand & Role Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Main Role Views */}
      <main className="flex-1 pt-8">
        {activeTab === 'userPortal' && (
          <PublicUserPortal 
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'landing' && (
          <LandingPage setActiveTab={handleTabChange} />
        )}

        {activeTab === 'adminCommand' && isAdmin && (
          <AdminCommandCenter onLogout={handleAdminLogout} />
        )}

        {activeTab === 'dashboard' && isAdmin && (
          <DashboardPage setActiveTab={handleTabChange} />
        )}
      </main>

      {/* Admin Security Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-8 text-xs font-mono text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>SherDetect 2.0 &copy; 2026. Done by Sherlock Family.</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <span className="hover:text-slate-800 transition cursor-pointer" onClick={() => setIsAdminModalOpen(true)}>
              Admin Portal 🔒
            </span>
            <a href="#" className="hover:text-slate-800 transition">Supabase Security</a>
            <a href="#" className="hover:text-slate-800 transition">6-Layer Specs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
