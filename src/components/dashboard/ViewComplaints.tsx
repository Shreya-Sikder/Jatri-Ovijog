import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Home, Truck } from 'lucide-react'; // Added Truck icon for vehicle number
import { Header } from '../../components/Header';

interface Complaint {
  id: string;
  type: string;
  description: string;
  status: string;
  created_at: string;
  user_name: string;
  thana: string;
  vehicle_number: string; // Added vehicle_number
}

export function ViewComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedThana, setSelectedThana] = useState<string>('All Thanas');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [thanas] = useState<string[]>([
    'All Thanas',
    'Adabor',
    'Badda',
    'Banani',
    'Bangshal',
    'Bimanbandar',
    'Cantonment',
    'Chawkbazar',
    'Dakkhinkhan',
    'Darussalam',
    'Demra',
    'Dhanmondi',
    'Gandaria',
    'Gulshan',
    'Hazaribagh',
    'Jatrabari',
    'Kadamtali',
    'Kalabagan',
    'Kamrangirchar',
    'Khilgaon',
    'Khilkhet',
    'Kotwali',
    'Lalbagh',
    'Mirpur',
    'Mohammadpur',
    'Motijheel',
    'New Market',
    'Pallabi',
    'Paltan',
    'Panthapath',
    'Ramna',
    'Rampura',
    'Sabujbagh',
    'Shah Ali',
    'Shahbagh',
    'Sher-e-Bangla Nagar',
    'Shyampur',
    'Sutrapur',
    'Tejgaon',
    'Tejgaon Industrial Area',
    'Turag',
    'Uttara East',
    'Uttara West',
    'Vatara',
    'Wari',
  ]);
  const [statuses] = useState<string[]>(['All Status', 'Pending', 'Resolved', 'Fake']);

  useEffect(() => {
    fetchComplaints();
  }, [selectedThana, selectedStatus]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost/project/api/view_complaints.php?thana=${encodeURIComponent(
          selectedThana
        )}&status=${encodeURIComponent(selectedStatus)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      if (data.message) {
        setComplaints([]);
      } else {
        setComplaints(data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'text-green-500';
      case 'pending':
        return 'text-orange-500';
      case 'fake':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url('/back.svg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Header userType="police" />
      <div
        className="max-w-4xl mx-auto mt-6 rounded-lg shadow-lg p-6"
        style={{
          backgroundColor: 'BAD8B6',
          borderRadius: '10px',
        }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{
            background: 'linear-gradient(to right, #4DA1A9, #79D7BE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          View Complaints
        </h2>

        <div className="mb-4 grid grid-cols-2 gap-4">
          {/* Filter by Thana */}
          <div className="relative">
            <label htmlFor="thana-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Thana
            </label>
            <div className="relative flex items-center">
              <select
                id="thana-filter"
                value={selectedThana}
                onChange={(e) => setSelectedThana(e.target.value)}
                className="appearance-none w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm"
              >
                {thanas.map((thana) => (
                  <option key={thana} value={thana}>
                    {thana}
                  </option>
                ))}
              </select>
              <Home className="absolute right-3 top-3 text-gray-500" />
            </div>
          </div>

          {/* Filter by Status */}
          <div className="relative">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <div className="relative flex items-center">
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white shadow-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {selectedStatus === 'Pending' ? (
                <Clock className="absolute right-3 top-3 text-orange-500" />
              ) : selectedStatus === 'Resolved' ? (
                <CheckCircle className="absolute right-3 top-3 text-green-500" />
              ) : selectedStatus === 'Fake' ? (
                <Clock className="absolute right-3 top-3 text-red-500" />
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <div
                key={complaint.id}
                className={`border rounded-lg p-4 shadow-sm ${
                  complaint.status.toLowerCase() === 'resolved'
                    ? 'bg-green-50 border-green-500'
                    : complaint.status.toLowerCase() === 'fake'
                    ? 'bg-red-50 border-red-500'
                    : 'bg-orange-50 border-orange-500'
                }`}
              >
                <div className="flex items-center mb-2">
                  {complaint.status.toLowerCase() === 'resolved' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : complaint.status.toLowerCase() === 'fake' ? (
                    <Clock className="h-5 w-5 text-red-500 mr-2" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500 mr-2" />
                  )}
                  <h3 className="font-medium text-gray-900">ID: {complaint.id}</h3>
                </div>
                <h3 className="font-medium text-gray-900 capitalize">{complaint.type}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  <strong>Description:</strong> {complaint.description}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <strong>Time:</strong> {new Date(complaint.created_at).toLocaleString()}
                </p>
                <p
                  className={`text-sm mt-1 flex items-center font-bold ${getStatusColor(
                    complaint.status
                  )}`}
                >
                  <strong>Status:</strong> {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Home className="h-4 w-4 mr-1 text-gray-500" />
                  <strong>Thana:</strong> {complaint.thana}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <Truck className="h-4 w-4 mr-1 text-gray-500" />
                  <strong>Vehicle Number:</strong> {complaint.vehicle_number}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-gray-500" />
                  <strong>User:</strong> {complaint.user_name}
                </p>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No complaints found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
