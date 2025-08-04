import React from 'react';
import { Filter } from 'lucide-react';

interface SpecializationFilterProps {
  specializations: Array<{
    id: string;
    name: string;
  }>;
  selectedSpecialization: string | null;
  onSelect: (id: string | null) => void;
}

export function SpecializationFilter({ 
  specializations, 
  selectedSpecialization, 
  onSelect 
}: SpecializationFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium text-gray-900">Filter by Specialization</h3>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left px-3 py-2 rounded-md ${
            !selectedSpecialization 
              ? 'bg-blue-50 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Cases
        </button>
        
        {specializations.map((spec) => (
          <button
            key={spec.id}
            onClick={() => onSelect(spec.id)}
            className={`w-full text-left px-3 py-2 rounded-md ${
              selectedSpecialization === spec.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {spec.name}
          </button>
        ))}
      </div>
    </div>
  );
}