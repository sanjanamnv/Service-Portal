import React, { useState, useEffect } from 'react';
import { FeedbackItem } from '../types';
import { feedbackService } from '../services/feedbackService';
import { 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Send, 
  ListFilter, 
  Trash2, 
  Clock, 
  User, 
  Mail, 
  Briefcase 
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<'Excellent' | 'Good' | 'Average' | 'Poor'>('Excellent');
  const [serviceUsed, setServiceUsed] = useState<'Calculator' | 'Profile' | 'Other'>('Calculator');
  const [feedback, setFeedback] = useState('');

  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    setFeedbacks(feedbackService.getFeedbacks());
    const unsubscribe = feedbackService.subscribe(() => {
      setFeedbacks(feedbackService.getFeedbacks());
    });
    return unsubscribe;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setValidationError('Name is required.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setValidationError('Please provide a valid email address.');
      return;
    }

    if (!feedback.trim() || feedback.trim().length < 8) {
      setValidationError('Feedback text must be at least 8 characters long.');
      return;
    }

    // Save to service & localStorage
    feedbackService.saveFeedback({
      name: name.trim(),
      email: email.trim(),
      rating,
      serviceUsed,
      feedback: feedback.trim(),
    });

    setSuccessMessage('Thank you for your valuable feedback!');
    
    // Reset form
    setName('');
    setEmail('');
    setRating('Excellent');
    setServiceUsed('Calculator');
    setFeedback('');

    // Clear success after 4 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all stored feedback entries from localStorage?')) {
      feedbackService.clearAll();
    }
  };

  const getRatingBadgeColor = (r: string) => {
    switch (r) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Average':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Poor':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 mb-3 shadow-sm">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Feedback Service
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Demonstrating Angular Two-Way Data Binding, Form Validation, and LocalStorage Collection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* The Feedback Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200/80">
            
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Share Your Experience
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                Form Service
              </span>
            </div>

            {/* Success Alert */}
            {successMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm shadow-sm animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* Validation Error Alert */}
            {validationError && (
              <div className="mb-6 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="font-semibold">{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Rating & Service Used in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rating */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value as any)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option value="Excellent">★★★★★ Excellent</option>
                    <option value="Good">★★★★☆ Good</option>
                    <option value="Average">★★★☆☆ Average</option>
                    <option value="Poor">★★☆☆☆ Poor</option>
                  </select>
                </div>

                {/* Service Used */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Service Used
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <select
                      value={serviceUsed}
                      onChange={(e) => setServiceUsed(e.target.value as any)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Calculator">Calculator</option>
                      <option value="Profile">Profile</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Feedback Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share details about your experience with the calculator, profile, or routing..."
                  className="block w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSubmitted(!showSubmitted)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer"
                >
                  <ListFilter className="w-4 h-4" />
                  <span>
                    {showSubmitted ? 'Hide Records' : `View Submitted Feedback (${feedbacks.length})`}
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* LocalStorage Records List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/80 border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  LocalStorage Records
                </h3>
                <p className="text-xs text-slate-500">
                  Stored persistently in browser client storage
                </p>
              </div>
              {feedbacks.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Clear feedback localStorage"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {feedbacks.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No feedback submitted yet</p>
                <p className="text-xs text-slate-400 mt-1">Submit the form on the left to see entries saved here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {feedbacks.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-900">
                        {item.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRatingBadgeColor(item.rating)}`}>
                        {item.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                      <span>{item.email}</span>
                      <span>&bull;</span>
                      <span className="font-semibold text-slate-600">Service: {item.serviceUsed}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-100">
                      "{item.feedback}"
                    </p>

                    <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
