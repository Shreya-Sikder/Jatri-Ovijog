import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { signIn } from '../../lib/auth';
import { getDashboardRoute } from '../../lib/routes';

interface LoginFormProps {
  userType: 'passenger' | 'police';
}

export function LoginForm({ userType }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Format email for police users
      const formattedEmail = userType === 'police' ? `${email}@police.gov` : email;
      await signIn(formattedEmail, password);
      const dashboardRoute = await getDashboardRoute();
      window.location.href = dashboardRoute;
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {userType === 'police' ? 'Police ID' : 'Email'}
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={userType === 'police' ? 'Enter your police ID' : 'Enter your email'}
          />
          {userType === 'police' && (
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              @police.gov
            </span>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          userType === 'police' 
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isLoading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}