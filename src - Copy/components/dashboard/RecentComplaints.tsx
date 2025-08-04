import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

export function RecentComplaints() {
  const complaints = [
    {
      id: 1,
      type: 'Reckless Driving',
      status: 'investigating',
      date: '2024-03-15',
      busId: 'BUS-123',
    },
    {
      id: 2,
      type: 'Fare Dispute',
      status: 'resolved',
      date: '2024-03-14',
      busId: 'BUS-456',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h2>
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{complaint.type}</h3>
                  <p className="text-sm text-gray-500">Bus ID: {complaint.busId}</p>
                  <p className="text-sm text-gray-500">{complaint.date}</p>
                </div>
                <div className="flex items-center">
                  {complaint.status === 'investigating' ? (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
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