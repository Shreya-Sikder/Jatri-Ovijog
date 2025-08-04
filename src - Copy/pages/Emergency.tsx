import React, { useEffect, useState } from 'react';
import { AlertTriangle, MapPin } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
}

export function EmergencyPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (error) => {
          setError('Unable to get your location. Please try again.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Location services are not available in your browser.');
      setIsLoading(false);
    }
  }, []);

  const handleEmergencySubmit = async () => {
    if (!location) return;
    
    // TODO: Implement emergency submission to nearest police station
    console.log('Emergency reported at:', location);
    // Show success message and redirect to confirmation page
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-red-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Emergency Assistance
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your location will be sent to the nearest police station
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLoading ? (
            <div className="text-center">
              <p>Getting your location...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Location detected: {location?.latitude.toFixed(6)}, {location?.longitude.toFixed(6)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleEmergencySubmit}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Send Emergency Alert
              </button>

              <div className="text-center">
                <a
                  href="/"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Return to Home
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}