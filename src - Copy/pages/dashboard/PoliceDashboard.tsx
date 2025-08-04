import React from 'react';
import { Header } from '../../components/Header';
import { PoliceStats } from '../../components/dashboard/PoliceStats';
import  ActiveComplaints  from '../../components/dashboard/ActiveComplaints';
import  EmergencyAlerts  from '../../components/dashboard/EmergencyAlerts';
import { ComplaintsChart } from '../../components/dashboard/ComplaintChart';

export function PoliceDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header userType="police" />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Police Dashboard</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <PoliceStats />
                            <ComplaintsChart />
                            <EmergencyAlerts />
                        </div>
                        <ActiveComplaints />
                    </div>
                </div>
            </main>
        </div>
    );
}
