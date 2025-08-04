import React from 'react';
import { Header } from '../components/Header';
import { FareCalculator } from '../components/fare/FareCalculator';

export function FareCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <FareCalculator />
        </div>
      </main>
    </div>
  );
}