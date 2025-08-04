import React, { useEffect, useState } from 'react';
import { AlertOctagon, MapPin, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Emergency {
  id: string;
  location: { latitude: number; longitude: number };
  status: string;
  created_at: string;
}

export function EmergencyAlerts() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencies();
    // Set up real-time subscription
    const subscription = supabase
      .channel('emergency_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'emergencies' 
      }, () => {
        fetchEmergencies();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchEmergencies = async () => {
    try {
      const { data, error } = await supabase
        .from('emergencies')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmergencies(data || []);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergencies')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;
      fetchEmergencies();
    } catch (error) {
      console.error('Error resolving emergency:', error);
    }
  };

  if (loading) {
    return <div>Loading emergencies...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Alerts</h2>
      <div className="space-y-4">
        {emergencies.map((emergency) => (
          <div key={emergency.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertOctagon className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="font-medium text-red-900">Emergency Alert</h3>
            </div>
            <div className="flex items-center text-sm text-red-700">
              <MapPin className="h-4 w-4 mr-1" />
              {emergency.location.latitude.toFixed(6)}, {emergency.location.longitude.toFixed(6)}
            </div>
            <p className="text-sm text-red-700 mt-1">
              {new Date(emergency.created_at).toLocaleString()}
            </p>
            <button
              onClick={() => handleResolve(emergency.id)}
              className="mt-3 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark as Resolved
            </button>
          </div>
        ))}
        {emergencies.length === 0 && (
          <p className="text-gray-500 text-center">No active emergencies</p>
        )}
      </div>
    </div>
  );
}