import React from 'react';
import { 
  Info, 
  ShieldCheck, 
  Route, 
  Lock, 
  Cpu, 
  FileText, 
  HardDrive, 
  MousePointerClick, 
  Boxes, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AboutPageProps {
  onOpenVivaGuide: () => void;
  onOpenCodeExplorer: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenVivaGuide, onOpenCodeExplorer }) => {
  const concepts = [
    {
      title: '1. Angular Authentication',
      desc: 'Demonstrates credential validation (admin / admin123), maintaining login state, clearing session on logout, and conditional rendering based on auth status.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      tag: 'Core Requirement',
    },
    {
      title: '2. Route Navigation & Router',
      desc: 'Angular Routes configuration navigating seamlessly across /login, /home, /calculator, /feedback, /profile, /about, and a wildcard (**) 404 page.',
      icon: <Route className="w-5 h-5 text-emerald-600" />,
      tag: 'RouterModule',
    },
    {
      title: '3. Route Guards (CanActivate)',
      desc: 'Protects private pages from unauthenticated access. If an unauthorized user attempts direct access to /calculator or /profile, authGuard redirects them to /login.',
      icon: <Lock className="w-5 h-5 text-purple-600" />,
      tag: 'auth.guard.ts',
    },
    {
      title: '4. Angular Services & DI',
      desc: 'AuthService and FeedbackService created with @Injectable({ providedIn: "root" }), providing singleton shared logic and state separation.',
      icon: <Cpu className="w-5 h-5 text-amber-600" />,
      tag: 'auth.service.ts',
    },
    {
      title: '5. Angular Forms & Validation',
      desc: 'Template-driven and reactive form paradigms with validation rules for required fields, email formatting, ratings, and instant user feedback.',
      icon: <FileText className="w-5 h-5 text-rose-600" />,
      tag: 'FormsModule',
    },
    {
      title: '6. LocalStorage Client Persistence',
      desc: 'Persists user session token ("isLoggedIn": "true") and user feedback submissions in browser localStorage so data survives page refresh.',
      icon: <HardDrive className="w-5 h-5 text-cyan-600" />,
      tag: 'Browser API',
    },
    {
      title: '7. Event Handling & Data Binding',
      desc: 'Two-way binding [(ngModel)], interpolation {{ }}, property binding [class.active], and (click) event listeners powering the arithmetic calculator and forms.',
      icon: <MousePointerClick className="w-5 h-5 text-indigo-600" />,
      tag: 'Data Binding',
    },
    {
      title: '8. Standalone Component Architecture',
      desc: 'Built using modern Angular standalone components (imports: [CommonModule, FormsModule, RouterModule]) for lightweight, modular execution.',
      icon: <Boxes className="w-5 h-5 text-violet-600" />,
      tag: 'Angular Standard',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3 shadow-sm">
          <Info className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About My Services Portal
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          Front-End Web Development Laboratory Experiment demonstrating Angular architecture, services, routing, and guards
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/80 p-6 sm:p-10 space-y-8">
        
        {/* Intro */}
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            College Laboratory Experiment Summary
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            This application is constructed to satisfy the practical requirements of the Front-End Development / Angular laboratory syllabus. It implements a complete Single Page Application (SPA) workflow without external backends or complex third-party tools, relying on Angular’s built-in dependency injection, router, forms, and browser LocalStorage.
          </p>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={onOpenVivaGuide}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <span>Read Practical Record & Viva Q&A</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenCodeExplorer}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-500/10 text-blue-800 border border-blue-500/30 hover:bg-blue-500/20 transition-all cursor-pointer"
            >
              <span>Inspect Angular Project Code & Download .ZIP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Concepts Grid */}
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Demonstrated Angular Concepts
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {concepts.map((c) => (
              <div
                key={c.title}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-200/60">
                      {c.icon}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {c.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {c.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 pl-1">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Student Note */}
        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs leading-relaxed">
          <p className="font-bold text-sm text-blue-900 mb-1">
            Student Practical Submission Checklist:
          </p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Ensure the application runs locally with <code>ng serve</code> at <code>http://localhost:4200</code>.</li>
            <li>Verify credentials: <code>admin</code> / <code>admin123</code>.</li>
            <li>Confirm route guard automatically blocks access when navigating to <code>/calculator</code> or <code>/feedback</code> while unauthenticated.</li>
            <li>Test arithmetic calculations with division-by-zero protection.</li>
            <li>Confirm feedback submission stores records in <code>localStorage</code> and displays in the view list.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
