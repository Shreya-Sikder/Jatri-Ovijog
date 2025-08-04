import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export function PoliceStats() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-500">New Cases</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">15</div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">42</div>
          <div className="text-sm text-gray-500">Resolved</div>
        </div>
      </div>
    </div>
  );
}