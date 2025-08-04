import React from 'react';
import { Train, Bus } from 'lucide-react';

interface FareDetailsProps {
  distance: number;
  metroFare: number;
  busFare: number;
  isStudent: boolean;
  hasRapidPass: boolean;
}

export function FareDetails({ distance, metroFare, busFare, isStudent, hasRapidPass }: FareDetailsProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-4">Fare Details</h3>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          Distance: {distance.toFixed(2)} km
        </p>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Train className="h-5 w-5 text-indigo-600" />
            <span className="font-medium">Metro Rail Fare</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600">
            ৳{metroFare}
          </p>
          {(isStudent || hasRapidPass) && (
            <div className="text-sm text-gray-500 mt-1">
              {isStudent && <p>Student discount applied</p>}
              {hasRapidPass && <p>Rapid Pass discount applied</p>}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Bus className="h-5 w-5 text-green-600" />
            <span className="font-medium">Bus Fare</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ৳{busFare}
          </p>
          {isStudent && (
            <p className="text-sm text-gray-500 mt-1">
              Student discount applied
            </p>
          )}
        </div>
      </div>
    </div>
  );
}