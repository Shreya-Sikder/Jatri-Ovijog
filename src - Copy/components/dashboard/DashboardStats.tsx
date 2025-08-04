import React from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';

export function DashboardStats() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-sm text-gray-500">Total Reports</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">2</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-500">Resolved</div>
        </div>
      </div>
    </div>
  );
}