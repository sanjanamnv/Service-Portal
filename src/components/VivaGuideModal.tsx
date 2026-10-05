import React from 'react';
import { X, BookOpen, CheckCircle, HelpCircle, Shield, Cpu, Route, FileText, Database, Sparkles } from 'lucide-react';

const AUTH_GUARD_SNIPPET = `export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};`;

interface VivaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaGuideModal: React.FC<VivaGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                College Practical Record & Viva Voce Guide
              </h2>
              <p className="text-xs text-slate-300">
                Front-End Development / Angular Laboratory Examination Explanations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* Aim of Experiment */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Experiment Aim
            </h3>
            <p className="text-xs text-slate-600">
              To design, develop, and test an Angular Single-Page Application (SPA) implementing user authentication, route guard protection, shared singleton services, form validation with two-way data binding, calculator arithmetic event handling, and browser LocalStorage persistence.
            </p>
          </div>

          {/* Section 1: Authentication */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              1. Authentication (How Login & Logout Work)
            </h3>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-2">
              <p>
                <strong>Login:</strong> When the user enters credentials into the login form and clicks Submit, the component calls <code>authService.login(username, password)</code>. The service compares the input against the required credentials (<code>admin</code> / <code>admin123</code>). Upon match, it sets <code>localStorage.setItem('isLoggedIn', 'true')</code> and saves the user profile object in LocalStorage, returning <code>true</code>. The component then navigates to <code>/home</code> via <code>router.navigate(['/home'])</code>.
              </p>
              <p>
                <strong>Logout:</strong> When the user clicks the Logout button in the navbar, <code>authService.logout()</code> removes the <code>'isLoggedIn'</code> and <code>'currentUser'</code> keys from <code>localStorage</code> and redirects the browser back to <code>/login</code>.
              </p>
            </div>
          </div>

          {/* Section 2: Service */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              2. Purpose of AuthService
            </h3>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-2">
              <p>
                In Angular, services encapsulate business logic and shared state across disparate components following the <strong>Separation of Concerns</strong> principle.
              </p>
              <p>
                Using <code>{"@Injectable({ providedIn: 'root' })"}</code>, Angular registers <code>AuthService</code> as an application-wide singleton. Rather than components inspecting localStorage directly or duplicating login logic, any component (Navbar, Login, Home, Profile) or Guard simply injects <code>AuthService</code> to query <code>isLoggedIn()</code> or trigger <code>logout()</code>.
              </p>
            </div>
          </div>

          {/* Section 3: Route Guard */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Route className="w-4 h-4 text-purple-600" />
              3. Route Guard (Preventing Unauthorized Access)
            </h3>
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-slate-700 space-y-2">
              <p>
                The <code>authGuard</code> is an Angular <code>CanActivateFn</code> attached to protected routes in <code>app.routes.ts</code> (such as <code>/home</code>, <code>/calculator</code>, <code>/feedback</code>, <code>/profile</code>, <code>/about</code>):
              </p>
              <pre className="bg-slate-900 text-slate-200 p-2.5 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto">
                {AUTH_GUARD_SNIPPET}
              </pre>
              <p>
                When a user attempts to manually navigate to <code>http://localhost:4200/calculator</code> while logged out, the Angular router executes <code>authGuard</code> before rendering the component. Because <code>authService.isLoggedIn()</code> evaluates to <code>false</code>, the guard blocks the navigation and immediately redirects to <code>/login</code>.
              </p>
            </div>
          </div>

          {/* Section 4: Routing */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Route className="w-4 h-4 text-amber-600" />
              4. Angular Router & Navigation
            </h3>
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-slate-700 space-y-2">
              <p>
                Angular’s SPA architecture swaps views dynamically without reloading the browser page. The root template contains <code>&lt;router-outlet&gt;&lt;/router-outlet&gt;</code>. When clicking navbar links with <code>routerLink="/calculator"</code>, Angular matches the path in <code>app.routes.ts</code>, activates the corresponding component, and applies the <code>routerLinkActive="active"</code> CSS class to visually highlight the selected page.
              </p>
            </div>
          </div>

          {/* Section 5: Forms & Data Binding */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-600" />
              5. Forms & Validation
            </h3>
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-xs text-slate-700 space-y-2">
              <p>
                The Login and Feedback components utilize Angular’s <code>FormsModule</code> and two-way data binding with <code>[(ngModel)]="variable"</code> (the "banana in a box" syntax). As the user types, the TypeScript class property synchronizes immediately.
              </p>
              <p>
                On <code>(ngSubmit)="onSubmit()"</code>, validation checks enforce required names, valid email regular expressions, and minimum comment lengths, displaying conditional warning messages (<code>*ngIf="validationError"</code>) before saving.
              </p>
            </div>
          </div>

          {/* Section 6: LocalStorage */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-600" />
              6. LocalStorage Persistence
            </h3>
            <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100 text-xs text-slate-700 space-y-2">
              <p>
                HTML5 <code>localStorage</code> provides persistent synchronous key-value storage in the user's browser. In this project:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><code>isLoggedIn = 'true'</code>: Keeps the user logged in even after refreshing or reloading the browser tab.</li>
                <li><code>currentUser</code>: Caches username, email, and role information.</li>
                <li><code>college_app_feedback_list</code>: Stores serialized JSON arrays of all submitted feedback entries, viewable via the "View Submitted Feedback" toggle.</li>
              </ul>
            </div>
          </div>

          {/* Section 7: Calculator Event Handling */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              7. Event Handling & Calculator Safeguards
            </h3>
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700 space-y-2">
              <p>
                Buttons bind click events with <code>(click)="appendNumber('7')"</code>, <code>(click)="setOperation('+')"</code>, and <code>(click)="calculate()"</code>.
              </p>
              <p>
                <strong>Division by Zero:</strong> When performing division where the divisor is <code>0</code>, the calculation method catches the condition, resets state, and displays <code>"Cannot divide by zero"</code>, preventing application crash or NaN output.
              </p>
            </div>
          </div>

          {/* 12-Step Testing Checklist */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Official 12-Step College Lab Testing Procedure
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
              <li>Open <code>http://localhost:4200</code> &rarr; confirms initial redirection to <code>/login</code>.</li>
              <li>Attempt to directly navigate to <code>/calculator</code> while logged out &rarr; redirects to <code>/login</code>.</li>
              <li>Enter incorrect credentials &rarr; displays <em>"Invalid username or password."</em> error.</li>
              <li>Login with <code>admin</code> / <code>admin123</code> &rarr; successfully navigates to <code>/home</code>.</li>
              <li>Verify Home Dashboard welcome message (<em>"Hello, Admin!"</em>) and service cards.</li>
              <li>Click <strong>Calculator</strong> in Navbar &rarr; verify active highlight.</li>
              <li>Test operations: <code>10 + 20 = 30</code>, <code>50 - 20 = 30</code>, <code>5 × 6 = 30</code>, <code>100 ÷ 4 = 25</code>.</li>
              <li>Test division by zero: <code>10 ÷ 0</code> &rarr; displays <em>"Cannot divide by zero"</em>.</li>
              <li>Click <strong>Feedback</strong> &rarr; enter Name, Email, Rating, Comments and submit.</li>
              <li>Click <strong>View Submitted Feedback</strong> &rarr; verify entry is stored in LocalStorage.</li>
              <li>Navigate to <strong>Profile</strong> & <strong>About</strong> &rarr; verify components render correctly.</li>
              <li>Click <strong>Logout</strong> &rarr; confirm session is cleared and attempt to visit <code>/calculator</code> redirects to <code>/login</code>.</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
