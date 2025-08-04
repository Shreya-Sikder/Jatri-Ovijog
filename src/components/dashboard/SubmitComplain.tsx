import React, { useState } from 'react';
import { Header } from '../../components/Header';

export default function SubmitComplaint() {
  const [complaintId, setComplaintId] = useState('');
  const [complaintData, setComplaintData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearchComplaint = async () => {
    if (!complaintId.trim()) {
      setError('Please enter a valid ID.');
      setComplaintData(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost/project/api/get_complaint_details.php?id=${complaintId}`);
      if (!response.ok) throw new Error('Failed to fetch complaint details.');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setComplaintData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the complaint.');
      setComplaintData(null);
    }
  };

  const handleUpdateComplaintStatus = async (status: 'resolved' | 'fake') => {
    if (!complaintId.trim()) {
      setError('Please enter a valid ID.');
      return;
    }

    try {
      const response = await fetch(`http://localhost/project/api/update_complaint_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: complaintId, status }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to update the complaint status to ${status}.`);
      }

      alert(`Complaint marked as ${status === 'resolved' ? 'Resolved' : 'Fake'} successfully!`);
      setComplaintData(null);
      setComplaintId('');
      setError(null);
    } catch (err: any) {
      setError(err.message || `An error occurred while updating the complaint status to ${status}.`);
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
      <div className="max-w-4xl mx-auto mt-6 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit Complaint Resolution</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Complaint ID
          </label>
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter ID"
          />
          <button
            onClick={handleSearchComplaint}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search Complaint
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {complaintData && (
          <div className="mt-4 bg-gray-50 p-4 rounded shadow">
            <h3 className="font-bold text-lg">{complaintData.title || 'No Title Provided'}</h3>
            <p className="text-sm text-gray-700">{complaintData.description || 'No description available.'}</p>
            {complaintData.image ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Attached Image:</h4>
                <img
                  src={`http://localhost/project/uploads/${complaintData.image}`}
                  alt="Complaint Attachment"
                  className="mt-2 rounded w-full max-w-md"
                  onError={(e) => {
                    e.currentTarget.src = "http://localhost/project/uploads/default-placeholder.png";
                  }}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No image attached.</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Thana: {complaintData.thana || 'Not Specified'}</p>
            <p className="text-sm text-gray-500">Status: {complaintData.status}</p>
            <p className="text-sm text-gray-500">Created At: {new Date(complaintData.created_at).toLocaleString()}</p>
          </div>
        )}

        {complaintData && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleUpdateComplaintStatus('resolved')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Mark as Resolved
            </button>
            <button
              onClick={() => handleUpdateComplaintStatus('fake')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Mark as Fake
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
