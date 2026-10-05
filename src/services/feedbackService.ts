import { FeedbackItem } from '../types';

const STORAGE_KEY_FEEDBACK = 'college_app_feedback_list';

export class FeedbackService {
  private static instance: FeedbackService;
  private listeners: Array<() => void> = [];

  private constructor() {
    this.initDefaultData();
  }

  public static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  private initDefaultData(): void {
    try {
      const existing = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (!existing) {
        const seedData: FeedbackItem[] = [
          {
            id: 'fb-1',
            name: 'Alex Johnson',
            email: 'alex@college.edu',
            rating: 'Excellent',
            serviceUsed: 'Calculator',
            feedback: 'The arithmetic calculator handled division and decimal operations smoothly. Clean responsive interface!',
            timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString([], {
              dateStyle: 'short',
              timeStyle: 'short'
            }),
          },
          {
            id: 'fb-2',
            name: 'Sarah Connor',
            email: 'sarah.c@college.edu',
            rating: 'Good',
            serviceUsed: 'Profile',
            feedback: 'Authentication guard works properly when trying to manually navigate to protected routes. Good demo for college viva.',
            timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString([], {
              dateStyle: 'short',
              timeStyle: 'short'
            }),
          }
        ];
        localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(seedData));
      }
    } catch {
      // Fallback
    }
  }

  public getFeedbacks(): FeedbackItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading feedback from localStorage', e);
    }
    return [];
  }

  public saveFeedback(item: Omit<FeedbackItem, 'id' | 'timestamp'>): FeedbackItem {
    const list = this.getFeedbacks();
    const newItem: FeedbackItem = {
      ...item,
      id: 'fb-' + Date.now(),
      timestamp: new Date().toLocaleString([], {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
    };
    const updated = [newItem, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving feedback', e);
    }
    this.notify();
    return newItem;
  }

  public clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_FEEDBACK);
    } catch (e) {
      console.error('Error clearing feedback', e);
    }
    this.notify();
  }
}

export const feedbackService = FeedbackService.getInstance();
