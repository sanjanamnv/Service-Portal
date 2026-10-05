import React, { useState, useEffect } from 'react';
import { RoutePath } from './types';
import { authService } from './services/authService';
import { Navbar } from './components/Navbar';
import { AddressBar } from './components/AddressBar';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AngularCodeExplorer } from './components/AngularCodeExplorer';
import { VivaGuideModal } from './components/VivaGuideModal';
import { Code2, BookOpen, Layers, Heart } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<RoutePath>('/login');
  const [guardBlockedMessage, setGuardBlockedMessage] = useState<string | null>(null);
  const [isCodeExplorerOpen, setIsCodeExplorerOpen] = useState(false);
  const [isVivaGuideOpen, setIsVivaGuideOpen] = useState(false);
  const [, setAuthTick] = useState(0);

  // Initialize route on load based on auth state
  useEffect(() => {
    if (authService.isLoggedIn()) {
      setCurrentRoute('/home');
    } else {
      setCurrentRoute('/login');
    }

    const unsubscribe = authService.subscribe(() => {
      setAuthTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  /**
   * Simulates the Angular Router and authGuard logic
   */
  const handleNavigate = (targetRoute: RoutePath | string) => {
    // Clear any previous guard alerts
    setGuardBlockedMessage(null);

    const validRoutes: RoutePath[] = [
      '/login',
      '/home',
      '/calculator',
      '/feedback',
      '/profile',
      '/about',
      '/not-found',
    ];

    let route = targetRoute as RoutePath;
    if (!validRoutes.includes(route)) {
      route = '/not-found';
    }

    const isLoggedIn = authService.isLoggedIn();

    // 1. If trying to visit protected pages without login -> trigger authGuard
    const protectedRoutes: RoutePath[] = [
      '/home',
      '/calculator',
      '/feedback',
      '/profile',
      '/about',
    ];

    if (protectedRoutes.includes(route) && !isLoggedIn) {
      setGuardBlockedMessage(`Access to ${route} blocked by authGuard. Unauthenticated request.`);
      setCurrentRoute('/login');
      return;
    }

    // 2. If logged in and visits /login -> redirect to /home
    if (route === '/login' && isLoggedIn) {
      setCurrentRoute('/home');
      return;
    }

    setCurrentRoute(route);
  };

  const isLoggedIn = authService.isLoggedIn();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Browser URL & Auth Guard Simulator Bar */}
      <AddressBar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        guardBlockedMessage={guardBlockedMessage}
      />

      {/* Navigation Bar (visible when logged in and not on login page) */}
      {isLoggedIn && currentRoute !== '/login' && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
          onOpenVivaGuide={() => setIsVivaGuideOpen(true)}
        />
      )}

      {/* Main Routed Content */}
      <main className="flex-1 flex flex-col">
        {currentRoute === '/login' && (
          <LoginPage
            onNavigate={handleNavigate}
            guardBlockedMessage={guardBlockedMessage}
          />
        )}

        {currentRoute === '/home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentRoute === '/calculator' && (
          <CalculatorPage />
        )}

        {currentRoute === '/feedback' && (
          <FeedbackPage />
        )}

        {currentRoute === '/profile' && (
          <ProfilePage onNavigate={handleNavigate} />
        )}

        {currentRoute === '/about' && (
          <AboutPage
            onOpenVivaGuide={() => setIsVivaGuideOpen(true)}
            onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
          />
        )}

        {currentRoute === '/not-found' && (
          <NotFoundPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Persistent Quick Action Bar at bottom */}
      <div className="bg-white border-t border-slate-200 py-3 px-4 shadow-sm text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">
              Front-End Lab Experiment:
            </span>
            <span>Authentication App with Calculator & Feedback Services</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVivaGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold cursor-pointer transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Viva Guide & Practical Record</span>
            </button>

            <button
              onClick={() => setIsCodeExplorerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold cursor-pointer transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Angular Code & Download .ZIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Explorer Modal */}
      <AngularCodeExplorer
        isOpen={isCodeExplorerOpen}
        onClose={() => setIsCodeExplorerOpen(false)}
      />

      {/* Viva / Practical Guide Modal */}
      <VivaGuideModal
        isOpen={isVivaGuideOpen}
        onClose={() => setIsVivaGuideOpen(false)}
      />

    </div>
  );
}
