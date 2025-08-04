import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { MapPicker } from './MapPicker';
import { FareDetails } from './FareDetails';
import { calculateDistance, calculateMetroFare, calculateBusFare } from '../../lib/fareCalculator';
import type { LatLng } from '../../types';

export function FareCalculator() {
  const [startPoint, setStartPoint] = useState<LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<LatLng | null>(null);
  const [isStudent, setIsStudent] = useState(false);
  const [hasRapidPass, setHasRapidPass] = useState(false);
  
  const distance = startPoint && endPoint ? calculateDistance(startPoint, endPoint) : 0;
  const metroFare = calculateMetroFare(distance, isStudent, hasRapidPass);
  const busFare = calculateBusFare(distance, isStudent);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Fare Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapPicker
          startPoint={startPoint}
          endPoint={endPoint}
          onStartPointChange={setStartPoint}
          onEndPointChange={setEndPoint}
        />

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isStudent}
                onChange={(e) => setIsStudent(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Student (50% discount)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hasRapidPass}
                onChange={(e) => setHasRapidPass(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Rapid Pass (10% discount on Metro)</span>
            </label>
          </div>

          <FareDetails
            distance={distance}
            metroFare={metroFare}
            busFare={busFare}
            isStudent={isStudent}
            hasRapidPass={hasRapidPass}
          />
        </div>
      </div>
    </div>
  );
}