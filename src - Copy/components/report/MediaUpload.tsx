import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function MediaUpload({ onMediaSelect }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploading(true);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `complaints/${fileName}`;

        const { data, error } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (error) throw error;
        return data.path;
      });

      const uploadedPaths = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedPaths]);
      onMediaSelect(uploadedPaths);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onMediaSelect(newFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Camera className="h-5 w-5 mr-2 text-gray-500" />
          {uploading ? 'Uploading...' : 'Add Photos/Videos'}
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={`${supabase.storage.from('media').getPublicUrl(file).data.publicUrl}`}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}