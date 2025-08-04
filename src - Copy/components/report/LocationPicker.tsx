import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export function LocationPicker({ onLocationSelect }) {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        onLocationSelect(newLocation);
        setIsLoading(false);
      },
      (error) => {
        setError('Unable to get location. Please try again.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
        {isLoading ? 'Getting location...' : 'Add Location'}
      </button>

      {location && (
        <div className="text-sm text-gray-500">
          Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}