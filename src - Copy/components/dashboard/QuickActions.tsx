import React from 'react';
import { Calculator, MapPin, Shield } from 'lucide-react';
import { useNavigate } from '../../hooks/useNavigate';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/fare-calculator')}
          className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Calculator className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-blue-900">Calculate Fare</span>
        </button>
        <button 
          onClick={() => navigate('/report')}
          className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-purple-900">Report Issue</span>
        </button>
        <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors col-span-2">
          <Shield className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-yellow-900">Safety Tips</span>
        </button>
      </div>
    </div>
  );
}