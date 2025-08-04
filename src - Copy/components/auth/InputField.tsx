import React from 'react';

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export function InputField({
  icon,
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={type}
          required
          value={value}
          onChange={onChange}
          className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}