export type RoutePath = 
  | '/login'
  | '/home'
  | '/calculator'
  | '/feedback'
  | '/profile'
  | '/about'
  | '/not-found';

export interface User {
  username: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  rating: 'Excellent' | 'Good' | 'Average' | 'Poor';
  serviceUsed: 'Calculator' | 'Profile' | 'Other';
  feedback: string;
  timestamp: string;
}

export interface CalculationHistoryItem {
  expression: string;
  result: string;
  timestamp: string;
}

export interface AngularFileDefinition {
  path: string;
  name: string;
  category: 'Service' | 'Guard' | 'Component' | 'Config' | 'Styles' | 'Documentation';
  language: 'typescript' | 'html' | 'css' | 'json' | 'markdown';
  description: string;
  content: string;
}
