import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateElectricityReport } from '../../utils/electricityReportGenerator';

const MobileElectricity = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      const resp = await axios.get('/api/bills');
      setBills(resp.data.sort((a,b) => b.month.localeCompare(a.month)));
    } catch (e) { console.error(e); }
  };

  const filtered = bills.filter(b => {
      const matchSearch = b.shops?.shopnumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.shops?.tenantname.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMonth = selectedMonth ? b.month === selectedMonth : true;
      return matchSearch && matchMonth;
  });

  const totalUnits = filtered.reduce((acc, b) => acc + ((b.currunit || 0) - (b.prevunit || 0)), 0);

  return (
    <div className="p-4 pb-24 bg-[#e0e5ec] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Electricity</h1>
        <button onClick={() => generateElectricityReport(filtered)} className="p-3 neumorphic rounded-2xl text-indigo-600 active:neumorphic-pressed transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        </button>
      </div>

      <div className="space-y-4 mb-6">
          <input placeholder="Search shop/tenant..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full p-4 neumorphic-inner rounded-2xl focus:outline-none" />
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Filter by Month</label>
            <input 
              type="month" 
              value={selectedMonth} 
              onChange={(e)=>setSelectedMonth(e.target.value)} 
              className="w-full p-4 neumorphic-inner rounded-2xl focus:outline-none text-gray-800" 
            />
          </div>
      </div>

      <div className="neumorphic p-4 rounded-3xl mb-6 bg-indigo-50 border border-indigo-100 flex justify-between items-center">
         <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Filtered Total Units</p>
            <p className="text-2xl font-black text-indigo-600">{totalUnits.toLocaleString()} units</p>
         </div>
      </div>

      <div className="space-y-4">
        {filtered.map(bill => (
          <div key={bill.id} className="neumorphic p-5 rounded-3xl group transition-all">
            <div className="flex justify-between items-start mb-2">
                <p className="font-black text-gray-800">{bill.shops?.shopnumber}</p>
                <p className="text-[10px] font-black text-blue-600 bg-white px-2 py-0.5 rounded-md neumorphic">{bill.month}</p>
            </div>
            <p className="text-sm font-bold text-gray-600 mb-3">{bill.shops?.tenantname}</p>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex gap-2 font-mono text-xs text-gray-500">
                    <span>{bill.prevunit || 0}</span>
                    <span className="opacity-30">→</span>
                    <span className="font-bold text-gray-800">{bill.currunit || 0}</span>
                </div>
                <div className="text-right">
                    <p className={`text-md font-black ${ (bill.currunit - bill.prevunit) > 50 ? 'text-orange-500' : 'text-green-600'}`}>{(bill.currunit - bill.prevunit)} Units</p>
                    <p className="text-[10px] text-gray-400 font-bold tracking-wider underline underline-offset-4 decoration-indigo-200">৳{bill.electricity.toLocaleString()}</p>
                </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="neumorphic p-8 rounded-3xl text-center text-gray-400 italic text-sm">No records found.</div>
        )}
      </div>
    </div>
  );
};

export default MobileElectricity;
