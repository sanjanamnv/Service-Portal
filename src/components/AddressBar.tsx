import React, { useState, useEffect } from 'react';
import { RoutePath } from '../types';
import { authService } from '../services/authService';
import { Globe, ArrowRight, ShieldCheck, ShieldAlert, RotateCcw } from 'lucide-react';

interface AddressBarProps {
  currentRoute: RoutePath;
  onNavigate: (route: RoutePath) => void;
  guardBlockedMessage?: string | null;
}

export const AddressBar: React.FC<AddressBarProps> = ({
  currentRoute,
  onNavigate,
  guardBlockedMessage,
}) => {
  const [inputValue, setInputValue] = useState(`http://localhost:4200${currentRoute}`);
  const isLoggedIn = authService.isLoggedIn();

  useEffect(() => {
    setInputValue(`http://localhost:4200${currentRoute}`);
  }, [currentRoute]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = inputValue.trim();
      let path = url;
      if (url.includes('localhost:4200')) {
        path = url.split('localhost:4200')[1] || '/';
      }
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      onNavigate(path as RoutePath);
    } catch {
      onNavigate('/not-found');
    }
  };

  return (
    <div className="bg-slate-950 border-b border-slate-800 text-slate-300 py-1.5 px-4 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* URL input simulator */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center min-w-[280px] max-w-2xl bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <Globe className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-transparent text-slate-200 outline-none text-xs"
            placeholder="http://localhost:4200/..."
          />
          <button 
            type="submit" 
            className="ml-1 text-slate-400 hover:text-white shrink-0 p-0.5"
            title="Go to URL"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>

        {/* Auth Guard status indicator & quick test shortcuts */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-sans">AuthGuard:</span>
            {isLoggedIn ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Active (User Logged In)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-amber-950/80 text-amber-400 border border-amber-800/60">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                Enforcing (Protected Routes Blocked)
              </span>
            )}
          </div>

          {/* Quick test buttons for viva examiner */}
          <div className="hidden sm:flex items-center gap-1.5 font-sans">
            <span className="text-[11px] text-slate-400">Test Guard:</span>
            <button
              onClick={() => onNavigate('/calculator')}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Test direct navigation to /calculator"
            >
              /calculator
            </button>
            <button
              onClick={() => onNavigate('/profile')}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Test direct navigation to /profile"
            >
              /profile
            </button>
            <button
              onClick={() => onNavigate('/not-found')}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Test 404 wildcard route"
            >
              404
            </button>
          </div>
        </div>

      </div>

      {/* Guard rejection toast banner */}
      {guardBlockedMessage && (
        <div className="max-w-7xl mx-auto mt-1.5 py-1 px-3 bg-red-950/80 border border-red-800/80 text-red-200 rounded text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span><strong>authGuard:</strong> {guardBlockedMessage}</span>
          </div>
          <span className="text-[10px] text-red-300 bg-red-900/50 px-1.5 py-0.5 rounded">Redirected to /login</span>
        </div>
      )}
    </div>
  );
};
