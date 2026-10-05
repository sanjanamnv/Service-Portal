import React from 'react';
import { RoutePath } from '../types';
import { authService } from '../services/authService';
import { 
  Calculator, 
  MessageSquareText, 
  User, 
  Info, 
  Home, 
  LogOut, 
  Layers, 
  Code2, 
  BookOpen,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentRoute: RoutePath;
  onNavigate: (route: RoutePath) => void;
  onOpenCodeExplorer: () => void;
  onOpenVivaGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenCodeExplorer,
  onOpenVivaGuide,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    setMobileOpen(false);
    authService.logout();
    onNavigate('/login');
  };

  const navLinks: { path: RoutePath; label: string; icon: React.ReactNode }[] = [
    { path: '/home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
    { path: '/feedback', label: 'Feedback', icon: <MessageSquareText className="w-4 h-4" /> },
    { path: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { path: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => onNavigate('/home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  My Services
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Angular Lab
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & User Session */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* College Lab Viva button */}
            <button
              onClick={onOpenVivaGuide}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
              title="College Lab Practical Record & Viva Q&A"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Lab Viva Q&A</span>
            </button>

            {/* Angular Code Explorer & Zip Export */}
            <button
              onClick={onOpenCodeExplorer}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="View & Download Complete Angular Project"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Angular Code & ZIP</span>
            </button>

            {/* User Avatar badge */}
            <div 
              onClick={() => onNavigate('/profile')}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-medium text-slate-200">
                {user?.username || 'admin'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/90 hover:bg-red-600 text-white shadow-sm shadow-red-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCodeExplorer}
              className="p-1.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700"
              title="Angular Code"
            >
              <Code2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((item) => {
            const isActive = currentRoute === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-left ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenVivaGuide();
                setMobileOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-sm font-semibold"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Lab Viva Questions & Answers
            </button>
            
            <button
              onClick={() => {
                onOpenCodeExplorer();
                setMobileOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-sm font-semibold"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              Download Complete Angular Project (.ZIP)
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm mt-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
