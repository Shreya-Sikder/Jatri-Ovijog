import React, { useState } from 'react';
import { Camera, MapPin } from 'lucide-react';

export function ComplaintForm() {
  const [complaintType, setComplaintType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement complaint submission
    console.log({ complaintType, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Type of Issue</label>
        <select
          value={complaintType}
          onChange={(e) => setComplaintType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select an issue type</option>
          <option value="harassment">Harassment</option>
          <option value="reckless-driving">Reckless Driving</option>
          <option value="fare-dispute">Fare Dispute</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Please describe the incident..."
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Camera className="h-5 w-5 mr-2" />
          Add Photo/Video
        </button>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <MapPin className="h-5 w-5 mr-2" />
          Add Location
        </button>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Report
      </button>
    </form>
  );
}