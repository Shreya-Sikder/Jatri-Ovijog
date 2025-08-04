import React from 'react';
import { UserLoginPage } from './pages/auth/UserLogin';
import { PoliceLoginPage } from './pages/auth/PoliceLogin';
import { PassengerRegisterPage } from './pages/auth/PassengerRegister';
import { PoliceRegisterPage } from './pages/auth/PoliceRegister';
import { EmergencyPage } from './pages/Emergency';
import { UserDashboard } from './pages/dashboard/UserDashboard';
import { PoliceDashboard } from './pages/dashboard/PoliceDashboard';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { FareCalculatorPage } from './pages/FareCalculatorPage';
import { FeedPage } from './pages/FeedPage';

export default function App() {
  const path = window.location.pathname;

  switch (path) {
    case '/feed':
      return <FeedPage />;
    case '/emergency':
      return <EmergencyPage />;
    case '/police-login':
      return <PoliceLoginPage />;
    case '/police-register':
      return <PoliceRegisterPage />;
    case '/register':
      return <PassengerRegisterPage />;
    case '/police-dashboard':
      return <PoliceDashboard />;
    case '/dashboard':
      return <UserDashboard />;
    case '/report':
      return <ReportIssuePage />;
    case '/fare-calculator':
      return <FareCalculatorPage />;
    default:
      return <UserLoginPage />;
  }
}