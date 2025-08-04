import React from 'react';
import { Header } from '../components/Header';
import { ReportIssue } from '../components/ReportIssue';

export function ReportIssuePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ReportIssue />
        </div>
      </main>
    </div>
  );
}