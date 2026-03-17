import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DailyCollectionCard from '../components/DailyCollectionCard';

const MobileDashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    totalRentCollected: 0,
    totalDue: 0,
    currentMonthStatus: [],
    dailyShops: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [shopsRes, paymentsRes, billsRes, dailyRes] = await Promise.all([
        axios.get('/api/shops'),
        axios.get('/api/payments'),
        axios.get('/api/bills'),
        axios.get('/api/daily/all')
      ]);

      const monthlyCollected = paymentsRes.data?.reduce((sum, p) => sum + (p.paidamount || 0), 0) || 0;
      const dailyCollected = dailyRes.data?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0;
      const totalRentCollected = monthlyCollected + dailyCollected;

      const totalDue = paymentsRes.data?.reduce((sum, p) => sum + (p.dueamount || 0), 0) || 0;
      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentMonthBills = (billsRes.data || []).filter(bill => bill.month === currentMonth);

      setStats({
        totalShops: (shopsRes.data || []).length,
        totalRentCollected,
        totalDue,
        currentMonthStatus: currentMonthBills,
        dailyShops: shopsRes.data.filter(s => s.rent_type === 'daily')
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 pb-24 bg-[#e0e5ec] min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard</h1>
        <div className="w-10 h-10 rounded-full neumorphic flex items-center justify-center text-indigo-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="neumorphic p-4 rounded-3xl">
          <p className="text-[10px] uppercase font-black text-gray-400">Total Shops</p>
          <p className="text-xl font-black text-gray-800 mt-1">{stats.totalShops}</p>
        </div>
        <div className="neumorphic p-4 rounded-3xl text-red-500">
          <p className="text-[10px] uppercase font-black text-gray-400">Total Due</p>
          <p className="text-xl font-black mt-1">৳{stats.totalDue.toLocaleString()}</p>
        </div>
        <div className="neumorphic p-4 rounded-3xl col-span-2 bg-indigo-600 text-white shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-black opacity-70">Total Collected</p>
            <p className="text-2xl font-black mt-1">৳{stats.totalRentCollected.toLocaleString()}</p>
          </div>
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-700 mb-4 px-1">Current Month Bills</h2>
      <div className="space-y-4">
        {stats.currentMonthStatus.map(bill => (
          <div key={bill.id} className="neumorphic p-4 rounded-3xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">{bill.shops?.shopnumber}</p>
                <p className="font-bold text-gray-800">{bill.shops?.tenantname}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400">Net Total</p>
                <p className="text-lg font-black text-gray-800">৳{bill.total.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
              <div>
                 <p className="text-[9px] text-gray-400">Rent</p>
                 <p className="text-xs font-bold">{bill.rent.toLocaleString()}</p>
              </div>
              <div>
                 <p className="text-[9px] text-gray-400">Elec</p>
                 <p className="text-xs font-bold">{bill.electricity.toLocaleString()}</p>
              </div>
              <div>
                 <p className="text-[9px] text-gray-400">Water</p>
                 <p className="text-xs font-bold">{bill.water ? bill.water.toLocaleString() : '-'}</p>
              </div>
            </div>
          </div>
        ))}
        {stats.currentMonthStatus.length === 0 && (
          <div className="neumorphic p-8 rounded-3xl text-center text-gray-400 italic text-sm">
            No bills generated for this month yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDashboard;
