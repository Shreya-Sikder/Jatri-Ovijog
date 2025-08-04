import React from 'react';
import { AlertCircle } from 'lucide-react';

export function EmergencyButton() {
  const handleEmergency = () => {
    // TODO: Implement emergency handling
    alert('Emergency services will be contacted immediately');
  };

  return (
    <button
      onClick={handleEmergency}
      className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
    >
      <AlertCircle className="h-6 w-6" />
      <span className="font-bold">Emergency</span>
    </button>
  );
}