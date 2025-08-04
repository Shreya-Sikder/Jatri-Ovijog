import React from 'react';
import { LoginForm } from '../../components/auth/LoginForm';
import { Shield } from 'lucide-react';

export function PoliceLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Police Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access the police dashboard to manage reports
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm userType="police" />
          
          <div className="mt-6">
            <div className="mt-6 space-y-4">
              <a href="/" className="w-full flex justify-center py-2 px-4 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                Passenger Login
              </a>
              <a href="/emergency" className="w-full flex justify-center py-2 px-4 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50">
                Report Emergency
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}