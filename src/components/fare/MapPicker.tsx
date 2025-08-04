import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { LatLng } from '../../types';

interface MapPickerProps {
  startPoint: LatLng | null;
  endPoint: LatLng | null;
  onStartPointChange: (point: LatLng) => void;
  onEndPointChange: (point: LatLng) => void;
}

export function MapPicker({ startPoint, endPoint, onStartPointChange, onEndPointChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [startMarker, setStartMarker] = useState<google.maps.Marker | null>(null);
  const [endMarker, setEndMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map with Dhaka center coordinates
    const dhaka = { lat: 23.8103, lng: 90.4125 };
    const newMap = new google.maps.Map(mapRef.current, {
      center: dhaka,
      zoom: 12,
    });
    setMap(newMap);

    newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
      const position = e.latLng?.toJSON();
      if (!position) return;

      if (!startPoint) {
        onStartPointChange(position);
        if (startMarker) startMarker.setMap(null);
        const newStartMarker = new google.maps.Marker({
          position,
          map: newMap,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          },
        });
        setStartMarker(newStartMarker);
      } else if (!endPoint) {
        onEndPointChange(position);
        if (endMarker) endMarker.setMap(null);
        const newEndMarker = new google.maps.Marker({
          position,
          map: newMap,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });
        setEndMarker(newEndMarker);
      }
    });
  }, [mapRef.current]);

  const resetStartPoint = () => {
    if (startMarker) {
      startMarker.setMap(null);
      setStartMarker(null);
    }
    onStartPointChange(null);
  };

  const resetEndPoint = () => {
    if (endMarker) {
      endMarker.setMap(null);
      setEndMarker(null);
    }
    onEndPointChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={resetStartPoint}
          className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <MapPin className="h-5 w-5 text-green-500 mr-2" />
          {startPoint ? 'Change Start' : 'Set Start Point'}
        </button>
        
        <button
          type="button"
          onClick={resetEndPoint}
          className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <MapPin className="h-5 w-5 text-red-500 mr-2" />
          {endPoint ? 'Change End' : 'Set End Point'}
        </button>
      </div>

      <div 
        ref={mapRef}
        className="w-full h-[400px] rounded-lg border border-gray-300"
      />
    </div>
  );
}