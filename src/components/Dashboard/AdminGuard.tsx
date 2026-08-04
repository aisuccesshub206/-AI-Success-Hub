import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowLeft, Key, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../types';
import { AdminLoginModal } from '../Modals/AdminLoginModal';

interface AdminGuardProps {
  user: UserProfile;
  onNavigateHome: () => void;
  onSuccessAdminAuth: (adminEmail: string) => void;
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  user,
  onNavigateHome,
  onSuccessAdminAuth,
  children,
}) => {
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // If user is Admin, render the Admin Dashboard directly
  if (user.role === 'admin') {
    return <>{children}</>;
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 text-center space-y-8 animate-in fade-in duration-200">
      
      {/* Access Denied Hero Card */}
      <div className="bg-[#0b0c18]/90 border border-purple-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex p-4 bg-purple-950/80 text-purple-400 border border-purple-800 rounded-3xl shadow-xl">
          <ShieldAlert className="w-12 h-12 text-purple-400" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Restricted Access Route</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Private Admin Dashboard
          </h1>

          <p className="text-sm text-slate-300">
            You are currently logged in as a <span className="text-purple-300 font-bold">Standard User ({user.email})</span>.
            This area requires elevated <span className="text-emerald-400 font-bold">Administrator (Admin)</span> role permissions.
          </p>
        </div>

        {/* Feature Security List */}
        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl max-w-lg mx-auto text-left text-xs text-slate-300 space-y-2">
          <div className="font-bold text-slate-200 mb-1 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Protected Admin Capabilities:</span>
          </div>
          <ul className="space-y-1.5 text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Full User Directory &amp; Role Assignments (`user` &amp; `admin`)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Dynamic Subscription Price Controller &amp; Plan Creation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Somalia EVC Plus, ZAAD, Sahal &amp; Card Payment Manual Approvals</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Platform Revenue Telemetry (MRR, LTV, ARR)</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsAdminAuthModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>Authenticate as Admin</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-2xl border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User Tools</span>
          </button>
        </div>

      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccessAdminAuth={(adminEmail) => {
          onSuccessAdminAuth(adminEmail);
          setIsAdminAuthModalOpen(false);
        }}
      />

    </div>
  );
};
