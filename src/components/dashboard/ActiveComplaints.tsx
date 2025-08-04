import React from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

interface Complaint {
  id: string;
  type: string;
  description: string;
  location: { latitude: number; longitude: number };
  status: string;
  priority: string;
  created_at: string;
}

export function ActiveComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Complaints</h2>
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className={`border rounded-lg p-4 ${
                complaint.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 ${
                      complaint.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                    } mr-2`} />
                    <h3 className="font-medium text-gray-900">{complaint.type}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{complaint.description}</p>
                  {complaint.location && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {complaint.location.latitude.toFixed(6)}, {complaint.location.longitude.toFixed(6)}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(complaint.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {complaint.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(complaint.id, 'investigating')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <Clock className="h-4 w-4" />
                    </button>
                  )}
                  {complaint.status === 'investigating' && (
                    <button
                      onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}