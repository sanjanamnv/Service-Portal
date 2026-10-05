import { AngularFileDefinition } from '../types';

export const ANGULAR_FILES: AngularFileDefinition[] = [
  // 1. Auth Service
  {
    path: 'src/app/services/auth.service.ts',
    name: 'auth.service.ts',
    category: 'Service',
    language: 'typescript',
    description: 'Angular Injectable Service managing authentication state with localStorage',
    content: `import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface UserProfile {
  username: string;
  email: string;
  role: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isLoggedIn';
  private readonly USER_KEY = 'currentUser';

  constructor(private router: Router) {}

  /**
   * Validates credentials and logs the user in.
   * Demo Credentials:
   * Username: admin
   * Password: admin123
   */
  login(username: string, password: string): boolean {
    const trimmedUser = username ? username.trim() : '';
    const trimmedPass = password ? password.trim() : '';

    if (trimmedUser === 'admin' && trimmedPass === 'admin123') {
      localStorage.setItem(this.AUTH_KEY, 'true');
      const profile: UserProfile = {
        username: 'admin',
        email: 'admin@example.com',
        role: 'User',
        status: 'Active'
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(profile));
      return true;
    }
    return false;
  }

  /**
   * Clears authentication state from localStorage and redirects to /login
   */
  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Returns true if user is logged in, false otherwise
   */
  isLoggedIn(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  /**
   * Returns current user profile from localStorage
   */
  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error parsing user profile', e);
      }
    }
    return null;
  }
}
`
  },

  // 2. Auth Guard
  {
    path: 'src/app/guards/auth.guard.ts',
    name: 'auth.guard.ts',
    category: 'Guard',
    language: 'typescript',
    description: 'Functional CanActivateFn route guard protecting unauthorized pages',
    content: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional Route Guard for Angular 17/18/19
 * Prevents unauthenticated users from accessing protected pages.
 * Redirects unauthorized requests to /login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login if user is not authenticated
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
`
  },

  // 3. App Routes
  {
    path: 'src/app/app.routes.ts',
    name: 'app.routes.ts',
    category: 'Config',
    language: 'typescript',
    description: 'Angular routing table with route guards on protected paths',
    content: `import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Redirect root path to /login or /home based on login status
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'calculator',
    component: CalculatorComponent,
    canActivate: [authGuard]
  },
  {
    path: 'feedback',
    component: FeedbackComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [authGuard]
  },
  // Wildcard 404 Route
  {
    path: '**',
    component: NotFoundComponent
  }
];
`
  },

  // 4. App Config
  {
    path: 'src/app/app.config.ts',
    name: 'app.config.ts',
    category: 'Config',
    language: 'typescript',
    description: 'Angular standalone application configuration with Router provider',
    content: `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding())
  ]
};
`
  },

  // 5. App Component TS
  {
    path: 'src/app/app.component.ts',
    name: 'app.component.ts',
    category: 'Component',
    language: 'typescript',
    description: 'Root standalone component rendering the navbar and router-outlet',
    content: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Authentication App with Calculator and Feedback Services';

  constructor(public authService: AuthService) {}
}
`
  },

  // 6. App Component HTML
  {
    path: 'src/app/app.component.html',
    name: 'app.component.html',
    category: 'Component',
    language: 'html',
    description: 'Root template displaying common navbar for authenticated users and router outlet',
    content: `<!-- Navigation bar is rendered when user is authenticated -->
<app-navbar *ngIf="authService.isLoggedIn()"></app-navbar>

<!-- Main Router Outlet for page routing -->
<main class="main-container">
  <router-outlet></router-outlet>
</main>
`
  },

  // 7. App Component CSS
  {
    path: 'src/app/app.component.css',
    name: 'app.component.css',
    category: 'Component',
    language: 'css',
    description: 'Root layout styling',
    content: `.main-container {
  min-height: calc(100vh - 70px);
  background-color: #f1f5f9;
  display: flex;
  flex-direction: column;
}
`
  },

  // 8. Navbar Component TS
  {
    path: 'src/app/components/navbar/navbar.component.ts',
    name: 'navbar.component.ts',
    category: 'Component',
    language: 'typescript',
    description: 'Navigation bar component with active route highlighting and logout',
    content: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onLogout(): void {
    this.closeMenu();
    this.authService.logout();
  }
}
`
  },

  // 9. Navbar Component HTML
  {
    path: 'src/app/components/navbar/navbar.component.html',
    name: 'navbar.component.html',
    category: 'Component',
    language: 'html',
    description: 'Responsive navbar template with brand logo, links, and logout action',
    content: `<header class="navbar">
  <div class="nav-container">
    <div class="brand" routerLink="/home">
      <div class="brand-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10h2v4h-2zm0 6h2v2h-2z"/>
        </svg>
      </div>
      <span class="brand-title">My Services</span>
    </div>

    <button class="mobile-toggle" (click)="toggleMenu()" aria-label="Toggle navigation">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <nav class="nav-links" [class.open]="isMenuOpen">
      <a routerLink="/home" routerLinkActive="active" (click)="closeMenu()">Home</a>
      <a routerLink="/calculator" routerLinkActive="active" (click)="closeMenu()">Calculator</a>
      <a routerLink="/feedback" routerLinkActive="active" (click)="closeMenu()">Feedback</a>
      <a routerLink="/profile" routerLinkActive="active" (click)="closeMenu()">Profile</a>
      <a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">About</a>
      
      <button class="logout-btn" (click)="onLogout()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Logout
      </button>
    </nav>
  </div>
</header>
`
  },

  // 10. Navbar Component CSS
  {
    path: 'src/app/components/navbar/navbar.component.css',
    name: 'navbar.component.css',
    category: 'Component',
    language: 'css',
    description: 'Clean responsive navigation bar styles',
    content: `.navbar {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  padding: 0 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  color: #ffffff;
}

.brand-icon {
  width: 38px;
  height: 38px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.5rem 0.85rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-links a:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.08);
}

.nav-links a.active {
  color: #ffffff;
  background-color: #2563eb;
  font-weight: 600;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: #b91c1c;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.mobile-toggle .bar {
  width: 24px;
  height: 2px;
  background-color: #ffffff;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    background: #0f172a;
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
    display: none;
    border-bottom: 1px solid #334155;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a {
    width: 100%;
    text-align: center;
  }

  .logout-btn {
    width: 100%;
    justify-content: center;
  }
}
`
  },

  // 11. Login Component TS
  {
    path: 'src/app/components/login/login.component.ts',
    name: 'login.component.ts',
    category: 'Component',
    language: 'typescript',
    description: 'Login form component with two-way data binding and validation',
    content: `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If already logged in, redirect straight to /home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin(): void {
    this.errorMessage = '';

    // Simple validation
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    const success = this.authService.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Invalid username or password.';
    }
  }

  fillDemo(): void {
    this.username = 'admin';
    this.password = 'admin123';
    this.errorMessage = '';
  }
}
`
  },

  // 12. Login Component HTML
  {
    path: 'src/app/components/login/login.component.html',
    name: 'login.component.html',
    category: 'Component',
    language: 'html',
    description: 'Attractive centered login card with demo credentials',
    content: `<div class="login-wrapper">
  <div class="login-card">
    <div class="header">
      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      </div>
      <h2>My Services Portal</h2>
      <p class="subtitle">Please sign in to access your dashboard</p>
    </div>

    <!-- Error message display -->
    <div class="alert error" *ngIf="errorMessage">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <form (ngSubmit)="onLogin()" class="form">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          [(ngModel)]="username"
          placeholder="Enter username (e.g. admin)"
          autocomplete="username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          [(ngModel)]="password"
          placeholder="Enter password (e.g. admin123)"
          autocomplete="current-password"
          required
        />
      </div>

      <button type="submit" class="submit-btn">
        Login to Account
      </button>
    </form>

    <!-- Demo Credentials box -->
    <div class="demo-box">
      <div class="demo-header">
        <span>Demo Credentials</span>
        <button type="button" class="autofill-btn" (click)="fillDemo()">Autofill</button>
      </div>
      <div class="demo-item">
        <strong>Username:</strong> <code>admin</code>
      </div>
      <div class="demo-item">
        <strong>Password:</strong> <code>admin123</code>
      </div>
    </div>
  </div>
</div>
`
  },

  // 13. Login Component CSS
  {
    path: 'src/app/components/login/login.component.css',
    name: 'login.component.css',
    category: 'Component',
    language: 'css',
    description: 'Centered card login styling with modern typography and animations',
    content: `.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 60px;
  height: 60px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.alert.error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  transition: border-color 0.2s ease;
  outline: none;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.submit-btn {
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.demo-box {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  font-size: 0.85rem;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #475569;
}

.autofill-btn {
  background: #e2e8f0;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}

.autofill-btn:hover {
  background: #cbd5e1;
}

.demo-item {
  color: #475569;
  margin-top: 0.25rem;
}

.demo-item code {
  background: #e2e8f0;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-family: monospace;
}
`
  },

  // 14. Home Component TS
  {
    path: 'src/app/components/home/home.component.ts',
    name: 'home.component.ts',
    category: 'Component',
    language: 'typescript',
    description: 'Dashboard welcome page with service cards and quick navigation',
    content: `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
`
  },

  // 15. Home Component HTML
  {
    path: 'src/app/components/home/home.component.html',
    name: 'home.component.html',
    category: 'Component',
    language: 'html',
    description: 'Dashboard template with hero banner and service cards',
    content: `<div class="dashboard-container">
  <!-- Hero Section -->
  <div class="hero-banner">
    <div class="welcome-text">
      <span class="badge">Front-End Angular Lab</span>
      <h1>Welcome to My Services Portal</h1>
      <p class="greeting">Hello, <strong>{{ user?.username || 'Admin' }}</strong>!</p>
      <p class="description">
        Welcome to your personalized service dashboard. Choose a service from the cards below or use the top navigation bar to continue.
      </p>
    </div>
  </div>

  <!-- Services Grid -->
  <div class="services-section">
    <h2 class="section-title">Available Services</h2>
    <div class="cards-grid">
      <!-- Calculator Service Card -->
      <div class="service-card">
        <div class="card-icon blue">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="16" y1="14" x2="16" y2="18"></line>
            <path d="M16 10h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M8 14h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M8 18h.01"></path>
          </svg>
        </div>
        <h3>Calculator</h3>
        <p>Perform basic arithmetic calculations quickly and easily.</p>
        <button class="card-btn" (click)="navigateTo('/calculator')">
          Open Calculator &rarr;
        </button>
      </div>

      <!-- Feedback Service Card -->
      <div class="service-card">
        <div class="card-icon emerald">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3>Feedback</h3>
        <p>Share your valuable feedback with us.</p>
        <button class="card-btn" (click)="navigateTo('/feedback')">
          Give Feedback &rarr;
        </button>
      </div>

      <!-- Profile Service Card -->
      <div class="service-card">
        <div class="card-icon purple">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h3>Profile</h3>
        <p>View your account information.</p>
        <button class="card-btn" (click)="navigateTo('/profile')">
          View Profile &rarr;
        </button>
      </div>
    </div>
  </div>
</div>
`
  },

  // 16. Home Component CSS
  {
    path: 'src/app/components/home/home.component.css',
    name: 'home.component.css',
    category: 'Component',
    language: 'css',
    description: 'Home dashboard layout styling and cards grid',
    content: `.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  width: 100%;
}

.hero-banner {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #ffffff;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.badge {
  display: inline-block;
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-banner h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.greeting {
  font-size: 1.25rem;
  color: #cbd5e1;
  margin: 0 0 1rem;
}

.description {
  font-size: 1rem;
  color: #94a3b8;
  max-width: 600px;
  line-height: 1.6;
  margin: 0;
}

.services-section {
  margin-top: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.5rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.75rem;
}

.service-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.card-icon.blue {
  background: #eff6ff;
  color: #2563eb;
}

.card-icon.emerald {
  background: #ecfdf5;
  color: #059669;
}

.card-icon.purple {
  background: #faf5ff;
  color: #9333ea;
}

.card-icon svg {
  width: 28px;
  height: 28px;
}

.service-card h3 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.service-card p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1.5rem;
  flex-grow: 1;
}

.card-btn {
  background: #f8fafc;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.card-btn:hover {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}
`
  },

  // 17. Calculator Component TS
  {
    path: 'src/app/components/calculator/calculator.component.ts',
    name: 'calculator.component.ts',
    category: 'Component',
    language: 'typescript',
    description: 'Calculator module implementing arithmetic operations, zero-division safeguard, and event handling',
    content: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  currentInput = '0';
  previousInput = '';
  operation: string | null = null;
  errorMessage = '';
  history: string[] = [];

  /**
   * Appends digit or decimal point
   */
  appendNumber(char: string): void {
    this.errorMessage = '';

    if (char === '.' && this.currentInput.includes('.')) {
      return;
    }

    if (this.currentInput === '0' && char !== '.') {
      this.currentInput = char;
    } else {
      this.currentInput += char;
    }
  }

  /**
   * Selects arithmetic operation (+, -, *, /)
   */
  setOperation(op: string): void {
    this.errorMessage = '';

    if (this.currentInput === 'Cannot divide by zero') {
      this.clearAll();
      return;
    }

    if (this.operation !== null) {
      this.calculate();
    }

    this.operation = op;
    this.previousInput = this.currentInput;
    this.currentInput = '0';
  }

  /**
   * Computes the result of arithmetic calculation
   */
  calculate(): void {
    if (this.operation === null || this.previousInput === '') {
      return;
    }

    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);

    if (isNaN(prev) || isNaN(current)) {
      return;
    }

    let result = 0;

    switch (this.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
      case '*':
        result = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          this.errorMessage = 'Cannot divide by zero';
          this.currentInput = 'Cannot divide by zero';
          this.previousInput = '';
          this.operation = null;
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    // Rounding to prevent floating point inaccuracies
    const formattedResult = Number(result.toFixed(6)).toString();
    const historyEntry = \`\${prev} \${this.operation} \${current} = \${formattedResult}\`;
    this.history.unshift(historyEntry);
    if (this.history.length > 5) {
      this.history.pop();
    }

    this.currentInput = formattedResult;
    this.operation = null;
    this.previousInput = '';
  }

  /**
   * Resets calculator state
   */
  clearAll(): void {
    this.currentInput = '0';
    this.previousInput = '';
    this.operation = null;
    this.errorMessage = '';
  }

  /**
   * Deletes last entered character
   */
  deleteLast(): void {
    if (this.currentInput === 'Cannot divide by zero') {
      this.clearAll();
      return;
    }
    if (this.currentInput.length <= 1) {
      this.currentInput = '0';
    } else {
      this.currentInput = this.currentInput.slice(0, -1);
    }
  }

  /**
   * Toggles positive / negative sign
   */
  toggleSign(): void {
    if (this.currentInput !== '0' && this.currentInput !== 'Cannot divide by zero') {
      if (this.currentInput.startsWith('-')) {
        this.currentInput = this.currentInput.substring(1);
      } else {
        this.currentInput = '-' + this.currentInput;
      }
    }
  }
}
`
  },

  // 18. Calculator Component HTML
  {
    path: 'src/app/components/calculator/calculator.component.html',
    name: 'calculator.component.html',
    category: 'Component',
    language: 'html',
    description: 'Calculator interface with LCD display, keypad, and calculation history',
    content: `<div class="calc-page-container">
  <div class="calc-header">
    <h2>Arithmetic Calculator Module</h2>
    <p>Perform basic operations with event handling and division-by-zero safeguards</p>
  </div>

  <div class="calc-card">
    <!-- Digital Screen -->
    <div class="screen">
      <div class="sub-screen">
        {{ previousInput }} {{ operation }}
      </div>
      <div class="main-screen" [class.error]="currentInput === 'Cannot divide by zero'">
        {{ currentInput }}
      </div>
    </div>

    <!-- Keypad Grid -->
    <div class="keypad">
      <button class="btn fn" (click)="clearAll()">C</button>
      <button class="btn fn" (click)="deleteLast()">⌫</button>
      <button class="btn fn" (click)="toggleSign()">±</button>
      <button class="btn op" (click)="setOperation('÷')">÷</button>

      <button class="btn" (click)="appendNumber('7')">7</button>
      <button class="btn" (click)="appendNumber('8')">8</button>
      <button class="btn" (click)="appendNumber('9')">9</button>
      <button class="btn op" (click)="setOperation('×')">×</button>

      <button class="btn" (click)="appendNumber('4')">4</button>
      <button class="btn" (click)="appendNumber('5')">5</button>
      <button class="btn" (click)="appendNumber('6')">6</button>
      <button class="btn op" (click)="setOperation('-')">-</button>

      <button class="btn" (click)="appendNumber('1')">1</button>
      <button class="btn" (click)="appendNumber('2')">2</button>
      <button class="btn" (click)="appendNumber('3')">3</button>
      <button class="btn op" (click)="setOperation('+')">+</button>

      <button class="btn zero" (click)="appendNumber('0')">0</button>
      <button class="btn" (click)="appendNumber('.')">.</button>
      <button class="btn equals" (click)="calculate()">=</button>
    </div>
  </div>

  <!-- Recent Calculations History -->
  <div class="history-box" *ngIf="history.length > 0">
    <h4>Recent Calculations</h4>
    <ul>
      <li *ngFor="let item of history">
        <code>{{ item }}</code>
      </li>
    </ul>
  </div>
</div>
`
  },

  // 19. Calculator Component CSS
  {
    path: 'src/app/components/calculator/calculator.component.css',
    name: 'calculator.component.css',
    category: 'Component',
    language: 'css',
    description: 'Realistic modern calculator UI with physical tactile feel',
    content: `.calc-page-container {
  max-width: 480px;
  margin: 2rem auto;
  padding: 1rem;
}

.calc-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.calc-header h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.4rem;
}

.calc-header p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.calc-card {
  background: #1e293b;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.screen {
  background: #0f172a;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  text-align: right;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #334155;
}

.sub-screen {
  color: #94a3b8;
  font-size: 1rem;
  font-family: monospace;
  min-height: 1.2rem;
}

.main-screen {
  color: #ffffff;
  font-size: 2.2rem;
  font-weight: 700;
  font-family: monospace;
  overflow-x: auto;
  white-space: nowrap;
}

.main-screen.error {
  color: #f87171;
  font-size: 1.3rem;
}

.keypad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.btn {
  background: #334155;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 1.25rem;
  font-weight: 600;
  height: 58px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  background: #475569;
}

.btn:active {
  transform: scale(0.96);
}

.btn.fn {
  background: #475569;
  color: #cbd5e1;
}

.btn.fn:hover {
  background: #64748b;
}

.btn.op {
  background: #f59e0b;
  color: #ffffff;
  font-size: 1.4rem;
}

.btn.op:hover {
  background: #d97706;
}

.btn.equals {
  background: #2563eb;
  color: #ffffff;
}

.btn.equals:hover {
  background: #1d4ed8;
}

.btn.zero {
  grid-column: span 2;
}

.history-box {
  margin-top: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.history-box h4 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #475569;
}

.history-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-box li code {
  display: block;
  background: #f1f5f9;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  color: #1e293b;
  font-size: 0.9rem;
}
`
  },

  // 20. Feedback Component TS
  {
    path: 'src/app/components/feedback/feedback.component.ts',
    name: 'feedback.component.ts',
    category: 'Component',
    language: 'typescript',
    description: 'Feedback form with two-way data binding, form validation, and localStorage persistence',
    content: `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FeedbackData {
  name: string;
  email: string;
  rating: string;
  serviceUsed: string;
  feedback: string;
  date: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  private readonly STORAGE_KEY = 'college_app_feedback_list';

  // Form Fields
  name = '';
  email = '';
  rating = 'Excellent';
  serviceUsed = 'Calculator';
  feedback = '';

  // UI state
  successMessage = '';
  validationError = '';
  showSubmittedList = false;
  savedFeedbacks: FeedbackData[] = [];

  ngOnInit(): void {
    this.loadSavedFeedbacks();
  }

  onSubmit(): void {
    this.validationError = '';
    this.successMessage = '';

    // Field Validations
    if (!this.name.trim()) {
      this.validationError = 'Name is required.';
      return;
    }

    if (!this.email.trim() || !this.isValidEmail(this.email)) {
      this.validationError = 'Please provide a valid email address.';
      return;
    }

    if (!this.feedback.trim() || this.feedback.trim().length < 10) {
      this.validationError = 'Feedback comment must be at least 10 characters long.';
      return;
    }

    const newFeedback: FeedbackData = {
      name: this.name.trim(),
      email: this.email.trim(),
      rating: this.rating,
      serviceUsed: this.serviceUsed,
      feedback: this.feedback.trim(),
      date: new Date().toLocaleString()
    };

    // Store in localStorage
    this.savedFeedbacks.unshift(newFeedback);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.savedFeedbacks));

    this.successMessage = 'Thank you for your valuable feedback!';

    // Reset Form
    this.name = '';
    this.email = '';
    this.rating = 'Excellent';
    this.serviceUsed = 'Calculator';
    this.feedback = '';
  }

  loadSavedFeedbacks(): void {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        this.savedFeedbacks = JSON.parse(raw);
      } catch (e) {
        this.savedFeedbacks = [];
      }
    }
  }

  toggleSubmittedList(): void {
    this.showSubmittedList = !this.showSubmittedList;
  }

  private isValidEmail(email: string): boolean {
    const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return re.test(email);
  }
}
`
  },

  // 21. Feedback Component HTML
  {
    path: 'src/app/components/feedback/feedback.component.html',
    name: 'feedback.component.html',
    category: 'Component',
    language: 'html',
    description: 'Feedback form template with inputs, validation alerts, and stored entries viewer',
    content: `<div class="feedback-page-container">
  <div class="feedback-card">
    <div class="card-header">
      <h2>Feedback Form</h2>
      <p>Share your valuable thoughts and experience with our services</p>
    </div>

    <!-- Success Message -->
    <div class="alert success" *ngIf="successMessage">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>{{ successMessage }}</span>
    </div>

    <!-- Validation Error -->
    <div class="alert error" *ngIf="validationError">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ validationError }}</span>
    </div>

    <form (ngSubmit)="onSubmit()" class="form">
      <div class="form-group">
        <label for="name">Your Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          [(ngModel)]="name"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          [(ngModel)]="email"
          placeholder="name@example.com"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="rating">Rating</label>
          <select id="rating" name="rating" [(ngModel)]="rating">
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div class="form-group">
          <label for="serviceUsed">Service Used</label>
          <select id="serviceUsed" name="serviceUsed" [(ngModel)]="serviceUsed">
            <option value="Calculator">Calculator</option>
            <option value="Profile">Profile</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="feedback">Your Feedback *</label>
        <textarea
          id="feedback"
          name="feedback"
          [(ngModel)]="feedback"
          rows="4"
          placeholder="Write your feedback comments here (minimum 10 characters)..."
          required
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">
          Submit Feedback
        </button>

        <button type="button" class="view-btn" (click)="toggleSubmittedList()">
          {{ showSubmittedList ? 'Hide Submitted Feedback' : 'View Submitted Feedback (' + savedFeedbacks.length + ')' }}
        </button>
      </div>
    </form>

    <!-- Stored Feedbacks List (from LocalStorage) -->
    <div class="submitted-section" *ngIf="showSubmittedList">
      <h3>Submitted Feedback Records</h3>
      <div class="empty-state" *ngIf="savedFeedbacks.length === 0">
        No feedback submitted yet.
      </div>
      <div class="feedback-items" *ngIf="savedFeedbacks.length > 0">
        <div class="item-card" *ngFor="let item of savedFeedbacks">
          <div class="item-header">
            <strong>{{ item.name }}</strong>
            <span class="rating-badge">{{ item.rating }}</span>
          </div>
          <div class="item-meta">
            <span>{{ item.email }}</span> &bull; 
            <span>Service: {{ item.serviceUsed }}</span> &bull; 
            <small>{{ item.date }}</small>
          </div>
          <p class="item-text">"{{ item.feedback }}"</p>
        </div>
      </div>
    </div>
  </div>
</div>
`
  },

  // 22. Feedback Component CSS
  {
    path: 'src/app/components/feedback/feedback.component.css',
    name: 'feedback.component.css',
    category: 'Component',
    language: 'css',
    description: 'Clean styling for feedback forms, inputs, alerts, and feedback history cards',
    content: `.feedback-page-container {
  max-width: 680px;
  margin: 2.5rem auto;
  padding: 1rem;
}

.feedback-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.card-header {
  margin-bottom: 2rem;
}

.card-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.card-header p {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert.success {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.alert.error {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.submit-btn {
  flex: 1;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.view-btn {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 0.85rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #e2e8f0;
}

.submitted-section {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.submitted-section h3 {
  font-size: 1.25rem;
  color: #0f172a;
  margin: 0 0 1rem;
}

.feedback-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem 1.25rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.rating-badge {
  background: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.item-meta {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.item-text {
  margin: 0;
  font-style: italic;
  color: #334155;
  font-size: 0.95rem;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 1.5rem;
}
`
  },

  // 23. Profile Component TS
  {
    path: 'src/app/components/profile/profile.component.ts',
    name: 'profile.component.ts',
    category: 'Component',
    language: 'typescript',
    description: 'User profile component displaying user metadata and available services',
    content: `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, UserProfile } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser() || {
      username: 'admin',
      email: 'admin@example.com',
      role: 'User',
      status: 'Active'
    };
  }
}
`
  },

  // 24. Profile Component HTML
  {
    path: 'src/app/components/profile/profile.component.html',
    name: 'profile.component.html',
    category: 'Component',
    language: 'html',
    description: 'Profile card template showing account status and assigned services',
    content: `<div class="profile-container">
  <div class="profile-card">
    <div class="avatar-section">
      <div class="avatar">
        {{ user?.username ? user.username.charAt(0).toUpperCase() : 'A' }}
      </div>
      <h2>{{ user?.username || 'admin' }}</h2>
      <span class="role-tag">{{ user?.role || 'User' }}</span>
    </div>

    <div class="details-section">
      <div class="detail-row">
        <span class="label">Username:</span>
        <span class="value">{{ user?.username || 'admin' }}</span>
      </div>
      <div class="detail-row">
        <span class="label">Email:</span>
        <span class="value">{{ user?.email || 'admin@example.com' }}</span>
      </div>
      <div class="detail-row">
        <span class="label">Role:</span>
        <span class="value">{{ user?.role || 'User' }}</span>
      </div>
      <div class="detail-row">
        <span class="label">Account Status:</span>
        <span class="status-badge active">{{ user?.status || 'Active' }}</span>
      </div>
    </div>

    <!-- Your Services Section -->
    <div class="services-box">
      <h3>Your Services</h3>
      <div class="services-list">
        <a routerLink="/calculator" class="service-pill">
          <span>Calculator Service</span>
          &rarr;
        </a>
        <a routerLink="/feedback" class="service-pill">
          <span>Feedback Service</span>
          &rarr;
        </a>
      </div>
    </div>
  </div>
</div>
`
  },

  // 25. Profile Component CSS
  {
    path: 'src/app/components/profile/profile.component.css',
    name: 'profile.component.css',
    category: 'Component',
    language: 'css',
    description: 'Clean user profile card styles',
    content: `.profile-container {
  max-width: 580px;
  margin: 3rem auto;
  padding: 1rem;
}

.profile-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.avatar {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.avatar-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.4rem;
}

.role-tag {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.details-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8fafc;
}

.detail-row .label {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
}

.detail-row .value {
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 600;
}

.status-badge.active {
  background: #ecfdf5;
  color: #059669;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.services-box {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.services-box h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
  margin: 0 0 0.75rem;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-pill {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.service-pill:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}
`
  },

  // 26. About Component TS
  {
    path: 'src/app/components/about/about.component.ts',
    name: 'about.component.ts',
    category: 'Component',
    language: 'typescript',
    description: 'About page component highlighting Angular concepts implemented in the experiment',
    content: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  concepts = [
    { title: 'Authentication', desc: 'Secure login/logout flow storing session state in LocalStorage.' },
    { title: 'Routing', desc: 'Angular RouterModule configuration navigating between pages.' },
    { title: 'Route Guards', desc: 'CanActivate functional guard preventing unauthorized route access.' },
    { title: 'Services', desc: 'Singleton AuthService with @Injectable dependency injection.' },
    { title: 'Forms', desc: 'Template-driven and reactive forms with input validation.' },
    { title: 'LocalStorage', desc: 'Persistent client-side storage for session & feedback submissions.' },
    { title: 'Event Handling', desc: 'TypeScript click and submit handlers powering calculator & forms.' },
    { title: 'Components', desc: 'Reusable Angular standalone components with clean separation of concerns.' },
    { title: 'Data Binding', desc: 'Two-way binding [(ngModel)], interpolation {{ }}, and property binding.' }
  ];
}
`
  },

  // 27. About Component HTML
  {
    path: 'src/app/components/about/about.component.html',
    name: 'about.component.html',
    category: 'Component',
    language: 'html',
    description: 'About page explaining the college practical concepts',
    content: `<div class="about-container">
  <div class="about-card">
    <div class="header">
      <span class="badge">College Practical Experiment</span>
      <h2>About My Services Portal</h2>
      <p class="intro">
        This web application is built as a comprehensive Front-End Development demonstration using Angular. It illustrates foundational and advanced single-page application principles.
      </p>
    </div>

    <div class="concepts-grid">
      <div class="concept-item" *ngFor="let item of concepts">
        <div class="concept-check">✓</div>
        <div>
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
`
  },

  // 28. About Component CSS
  {
    path: 'src/app/components/about/about.component.css',
    name: 'about.component.css',
    category: 'Component',
    language: 'css',
    description: 'About page layout and concepts grid styling',
    content: `.about-container {
  max-width: 800px;
  margin: 3rem auto;
  padding: 1rem;
}

.about-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.badge {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.header h2 {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.intro {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.concept-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.concept-check {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.concept-item h4 {
  margin: 0 0 0.25rem;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
}

.concept-item p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
}
`
  },

  // 29. Not Found Component TS
  {
    path: 'src/app/components/not-found/not-found.component.ts',
    name: 'not-found.component.ts',
    category: 'Component',
    language: 'typescript',
    description: '404 Page Not Found component with navigation button',
    content: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {}
`
  },

  // 30. Not Found Component HTML
  {
    path: 'src/app/components/not-found/not-found.component.html',
    name: 'not-found.component.html',
    category: 'Component',
    language: 'html',
    description: '404 error template',
    content: `<div class="not-found-container">
  <div class="not-found-card">
    <div class="error-code">404</div>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist or has been moved.</p>
    <a routerLink="/home" class="home-btn">Go to Home</a>
  </div>
</div>
`
  },

  // 31. Not Found Component CSS
  {
    path: 'src/app/components/not-found/not-found.component.css',
    name: 'not-found.component.css',
    category: 'Component',
    language: 'css',
    description: '404 page styling',
    content: `.not-found-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.not-found-card {
  text-align: center;
  background: #ffffff;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  max-width: 440px;
  width: 100%;
}

.error-code {
  font-size: 5rem;
  font-weight: 800;
  color: #2563eb;
  line-height: 1;
  margin-bottom: 1rem;
}

.not-found-card h2 {
  font-size: 1.5rem;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.not-found-card p {
  color: #64748b;
  margin: 0 0 1.5rem;
}

.home-btn {
  display: inline-block;
  background: #2563eb;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.home-btn:hover {
  background: #1d4ed8;
}
`
  },

  // 32. main.ts
  {
    path: 'src/main.ts',
    name: 'main.ts',
    category: 'Config',
    language: 'typescript',
    description: 'Angular application bootstrap entry file',
    content: `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
`
  },

  // 33. index.html
  {
    path: 'src/index.html',
    name: 'index.html',
    category: 'Config',
    language: 'html',
    description: 'HTML root page with title and viewport',
    content: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Authentication App with Calculator and Feedback Services</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
`
  },

  // 34. styles.css
  {
    path: 'src/styles.css',
    name: 'styles.css',
    category: 'Styles',
    language: 'css',
    description: 'Global CSS styling with modern typography and resets',
    content: `/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background-color: #f1f5f9;
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
}

code, pre {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
`
  },

  // 35. angular.json
  {
    path: 'angular.json',
    name: 'angular.json',
    category: 'Config',
    language: 'json',
    description: 'Angular CLI workspace configuration',
    content: `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "authentication-services-app": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/authentication-services-app",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": ["src/styles.css"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "authentication-services-app:build:production"
            },
            "development": {
              "buildTarget": "authentication-services-app:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
`
  },

  // 36. package.json
  {
    path: 'package.json',
    name: 'package.json',
    category: 'Config',
    language: 'json',
    description: 'Node dependencies with Angular 18/19 and TypeScript',
    content: `{
  "name": "authentication-services-app",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^18.2.0",
    "@angular/common": "^18.2.0",
    "@angular/compiler": "^18.2.0",
    "@angular/core": "^18.2.0",
    "@angular/forms": "^18.2.0",
    "@angular/platform-browser": "^18.2.0",
    "@angular/platform-browser-dynamic": "^18.2.0",
    "@angular/router": "^18.2.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.10"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^18.2.0",
    "@angular/cli": "^18.2.0",
    "@angular/compiler-cli": "^18.2.0",
    "@types/node": "^18.18.0",
    "typescript": "~5.4.2"
  }
}
`
  },

  // 37. tsconfig.json
  {
    path: 'tsconfig.json',
    name: 'tsconfig.json',
    category: 'Config',
    language: 'json',
    description: 'Root TypeScript compiler options',
    content: `{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022"
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
`
  },

  // 38. tsconfig.app.json
  {
    path: 'tsconfig.app.json',
    name: 'tsconfig.app.json',
    category: 'Config',
    language: 'json',
    description: 'Angular application TypeScript build configuration',
    content: `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}
`
  },

  // 39. README.md
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Documentation',
    language: 'markdown',
    description: 'Complete College Experiment Lab Guide, commands, and test cases',
    content: `# Authentication App with Calculator and Feedback Services
### College Front-End Development / Angular Laboratory Experiment

## 1. Project Overview
This project demonstrates key Angular concepts required for front-end web development lab exams:
- User Authentication with session persistence in \`localStorage\`
- Functional Route Guards (\`authGuard\`) to protect private modules
- Navigation Bar with active link routing
- Arithmetic Calculator module with division-by-zero protection
- Feedback Form with validation & stored records history
- Profile & About pages

---

## 2. Quick Setup & Execution
Run the following commands in your terminal:

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Run the Angular development server
ng serve
\`\`\`

The app will compile and start at:
\`http://localhost:4200\`

---

## 3. Demo Credentials
- **Username:** \`admin\`
- **Password:** \`admin123\`

---

## 4. Verification & Testing Steps
1. Navigate to \`http://localhost:4200/calculator\` without logging in.
   *Result:* Automatically redirected to \`/login\` by \`authGuard\`.
2. Login with \`admin\` / \`admin123\`.
   *Result:* Redirected to \`/home\` dashboard.
3. Click "Calculator" in the navbar.
   *Result:* Test \`10 + 20 = 30\`, \`50 - 20 = 30\`, \`5 * 6 = 30\`, \`100 / 4 = 25\`, and division by zero (\`10 / 0\`).
4. Click "Feedback" in the navbar.
   *Result:* Submit a feedback entry and click "View Submitted Feedback" to verify persistence.
5. Click "Profile" & "About" to verify component views.
6. Click "Logout" and confirm that protected routes are blocked again.
`
  }
];
