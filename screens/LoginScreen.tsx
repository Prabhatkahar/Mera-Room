import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        name: isSignUp ? name : (email.split('@')[0] || 'User'),
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${isSignUp ? name : email}&background=0d9488&color=fff`
      };
      
      setIsLoading(false);
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="bg-teal-600 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Mera Room</h2>
          <p className="text-teal-100">
            {isSignUp ? "Create an account to start posting" : "Welcome back!"}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                    placeholder="John Doe"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-teal-600 font-semibold hover:underline focus:outline-none"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
          
          <div className="mt-4 text-center">
             <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
               Cancel and go back
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;