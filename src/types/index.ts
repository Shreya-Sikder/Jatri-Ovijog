export interface LatLng {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'passenger' | 'police';
  phoneNumber: string;
}

export interface Complaint {
  id: string;
  userId: string;
  busId: string;
  type: 'harassment' | 'reckless-driving' | 'fare-dispute' | 'other';
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'investigating' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  mediaUrls: string[];
  timestamp: string;
}