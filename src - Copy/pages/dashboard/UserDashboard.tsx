import React from 'react';
import { Header } from '../../components/Header';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { RecentComplaints } from '../../components/dashboard/RecentComplaints';
import { QuickActions } from '../../components/dashboard/QuickActions';

export function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Passenger Dashboard</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <DashboardStats />
              <QuickActions />
            </div>
            <RecentComplaints />
          </div>
        </div>
      </main>
    </div>
  );
}