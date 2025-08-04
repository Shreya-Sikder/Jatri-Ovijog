import React, { useState } from 'react';
import { Camera, MapPin, Send } from 'lucide-react';
import { api } from '../lib/api';
import { useNavigate } from '../hooks/useNavigate';

export function ReportIssue() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
  });

  const handleLocationGet = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please try again.');
        }
      );
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('user_id', 'current_user_id'); // Replace with actual user ID
      formPayload.append('type', formData.type);
      formPayload.append('description', formData.description);
      if (location) {
        formPayload.append('location', JSON.stringify(location));
      }
      if (selectedFile) {
        formPayload.append('image', selectedFile);
      }

      await api.reports.create(formPayload);
      alert('Report submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Report an Issue</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type of Issue</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
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
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Please describe the incident in detail..."
            required
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleLocationGet}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <MapPin className="h-5 w-5 mr-2 text-gray-500" />
            Add Location
          </button>
          {location && (
            <p className="mt-2 text-sm text-gray-600">
              Location added: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
          )}
        </div>

        <div>
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <Camera className="h-5 w-5 mr-2 text-gray-500" />
            Add Photos/Videos
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}