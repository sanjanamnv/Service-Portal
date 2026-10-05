import React from 'react';
import { RoutePath } from '../types';
import { authService } from '../services/authService';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Activity, 
  Calculator, 
  MessageSquareText, 
  ArrowRight, 
  Key, 
  Calendar, 
  Database 
} from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (route: RoutePath) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const user = authService.getCurrentUser() || {
    username: 'admin',
    email: 'admin@example.com',
    role: 'User',
    status: 'Active' as const,
    lastLogin: 'Just now',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-3 shadow-sm">
          <User className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Account information managed by AuthService singleton and stored in LocalStorage
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/80 overflow-hidden">
        
        {/* Top Profile Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl font-extrabold shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black tracking-tight">{user.username}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {user.status}
              </span>
            </div>
            <p className="text-blue-100 text-sm mt-1">{user.email}</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-lg bg-black/20 text-xs font-semibold tracking-wider uppercase border border-white/10">
              Role: {user.role}
            </span>
          </div>
        </div>

        {/* Detailed Account Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Account Attributes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Username</span>
                  <span className="text-sm font-bold text-slate-800">{user.username}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Email</span>
                  <span className="text-sm font-bold text-slate-800">{user.email}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Assigned Role</span>
                  <span className="text-sm font-bold text-slate-800">{user.role} (Administrator)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400 uppercase font-semibold">Account Status</span>
                  <span className="text-sm font-bold text-emerald-600">{user.status} (Verified)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Your Services Section */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Your Services
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => onNavigate('/calculator')}
                className="group p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/70 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">Calculator</h4>
                    <p className="text-xs text-slate-500">Arithmetic calculation service</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>

              <div 
                onClick={() => onNavigate('/feedback')}
                className="group p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/70 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageSquareText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">Feedback</h4>
                    <p className="text-xs text-slate-500">Submit and inspect user responses</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>

          {/* LocalStorage Status */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>LocalStorage State Snapshot</span>
            </div>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <div><span className="text-blue-400">localStorage.getItem('isLoggedIn')</span> = <span className="text-emerald-400">"true"</span></div>
              <div><span className="text-blue-400">localStorage.getItem('currentUser')</span> = <span className="text-emerald-400">{JSON.stringify(user)}</span></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
