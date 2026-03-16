import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MobileReports = () => {
  const [payments, setPayments] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedShop, setSelectedShop] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [p, s] = await Promise.all([axios.get('/api/payments'), axios.get('/api/shops')]);
      setPayments(p.data);
      setShops(s.data);
    } catch (e) { console.error(e); }
  };

  const monthlyReport = selectedMonth ? payments.filter(p => p.bills?.month === selectedMonth) : [];
  const shopReport = selectedShop ? payments.filter(p => p.bills?.shopid === selectedShop) : [];
  const dueReport = payments.filter(p => p.dueamount > 0);

  const monthlyTotal = monthlyReport.reduce((s, p) => s + p.paidamount, 0);
  const monthlyDue = monthlyReport.reduce((s, p) => s + p.dueamount, 0);

  return (
    <div className="p-4 pb-24 bg-[#e0e5ec] min-h-screen">
      <h1 className="text-2xl font-black text-gray-800 mb-6">Reports</h1>

      <div className="neumorphic p-6 rounded-[32px] mb-8">
        <h2 className="text-sm font-black text-indigo-600 uppercase mb-4">Monthly Collection</h2>
        <input type="month" value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)} className="w-full p-4 neumorphic-inner rounded-2xl mb-4 focus:outline-none text-gray-800" />
        {selectedMonth && (
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 neumorphic rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Paid</p>
                  <p className="text-lg font-black text-green-600">৳{monthlyTotal.toLocaleString()}</p>
               </div>
               <div className="p-4 neumorphic rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Due</p>
                  <p className="text-lg font-black text-red-500">৳{monthlyDue.toLocaleString()}</p>
               </div>
            </div>
        )}
      </div>

      <div className="neumorphic p-6 rounded-[32px] mb-8">
        <h2 className="text-sm font-black text-indigo-600 uppercase mb-4">Shop Performance</h2>
        <select value={selectedShop} onChange={(e)=>setSelectedShop(e.target.value)} className="w-full p-4 neumorphic-inner rounded-2xl bg-[#e0e5ec] appearance-none mb-4 focus:outline-none">
           <option value="">Select Shop</option>
           {shops.map(s => <option key={s.id} value={s.id}>{s.shopnumber} - {s.tenantname}</option>)}
        </select>
        {selectedShop && (
            <div className="space-y-4">
                {shopReport.map(r => (
                  <div key={r.id} className="p-4 neumorphic rounded-2xl flex justify-between items-center text-xs">
                     <p className="font-bold">{r.bills?.month}</p>
                     <p className="font-black text-indigo-600">৳{r.paidamount.toLocaleString()}</p>
                  </div>
                ))}
            </div>
        )}
      </div>

      <div className="neumorphic p-6 rounded-[32px]">
        <h2 className="text-sm font-black text-red-500 uppercase mb-4">Urgent Dues</h2>
        <div className="space-y-4">
           {dueReport.map(d => (
             <div key={d.id} className="p-4 neumorphic rounded-2xl flex justify-between items-center">
                <div>
                   <p className="font-bold text-gray-800 text-sm">{d.bills?.shops?.shopnumber}</p>
                   <p className="text-[10px] text-gray-400">{d.bills?.month}</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-red-500">৳{d.dueamount.toLocaleString()}</p>
                   <p className="text-[9px] text-gray-400 italic">{d.bills?.shops?.phone}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default MobileReports;
