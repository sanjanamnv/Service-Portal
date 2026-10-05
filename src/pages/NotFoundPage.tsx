import React from 'react';
import { RoutePath } from '../types';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (route: RoutePath) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/80 border border-slate-200/80">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        
        <div className="text-6xl font-black text-blue-600 font-mono tracking-tight mb-2">
          404
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Page Not Found
        </h2>
        
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The page or route you are looking for does not exist in the Angular routing configuration table.
        </p>

        <button
          onClick={() => onNavigate('/home')}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </button>
      </div>
    </div>
  );
};
