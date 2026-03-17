import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from '../pages/Dashboard';
import Shops from '../pages/Shops';
import Bills from '../pages/Bills';
import Payments from '../pages/Payments';
import Reports from '../pages/Reports';
import Electricity from '../pages/Electricity';
import BottomNav from '../mobile/components/BottomNav';
import MobileDashboard from '../mobile/pages/MobileDashboard';
import MobileShops from '../mobile/pages/MobileShops';
import MobileBills from '../mobile/pages/MobileBills';
import MobileElectricity from '../mobile/pages/MobileElectricity';
import MobilePayments from '../mobile/pages/MobilePayments';
import MobileReports from '../mobile/pages/MobileReports';
import MobileDailyCollection from '../mobile/pages/MobileDailyCollection';
import useIsMobile from '../hooks/useIsMobile';

const ResponsiveLayout = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-[#e0e5ec]">
        <main className="flex-1 overflow-y-auto bg-[#e0e5ec]">
          <Routes>
            <Route path="/" element={<MobileDashboard />} />
            <Route path="/shops" element={<MobileShops />} />
            <Route path="/bills" element={<MobileBills />} />
            <Route path="/payments" element={<MobilePayments />} />
            <Route path="/reports" element={<MobileReports />} />
            <Route path="/electricity" element={<MobileElectricity />} />
            <Route path="/daily-collection" element={<MobileDailyCollection />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#e0e5ec]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#e0e5ec]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/electricity" element={<Electricity />} />
            <Route path="/daily-collection" element={<MobileDailyCollection />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveLayout;
