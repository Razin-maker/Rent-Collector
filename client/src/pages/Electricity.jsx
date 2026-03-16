import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { generateElectricityReport } from '../utils/electricityReportGenerator';

const MonthPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.split('-')[0]) : new Date().getFullYear());
  const ref = useRef();

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (monthIndex) => {
    const mm = String(monthIndex + 1).padStart(2, '0');
    onChange(`${viewYear}-${mm}`);
    setOpen(false);
  };

  const displayValue = value
    ? `${months[parseInt(value.split('-')[1]) - 1]} ${value.split('-')[0]}`
    : 'All Months';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 neumorphic text-left text-gray-700 focus:outline-none flex justify-between items-center rounded-2xl"
      >
        <span className="font-medium">{displayValue}</span>
        <div className="flex items-center gap-2">
            {value && (
                <span 
                    onClick={(e) => { e.stopPropagation(); onChange(''); }}
                    className="text-red-400 hover:text-red-600 px-1"
                >✕</span>
            )}
            <span className="text-gray-400">▾</span>
        </div>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-64 right-0 neumorphic p-4 bg-[#e0e5ec] rounded-3xl border border-gray-300 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <button type="button" onClick={() => setViewYear(y => y - 1)} className="neumorphic px-3 py-1 text-gray-600 hover:neumorphic-pressed rounded-lg">‹</button>
            <span className="font-semibold text-gray-700">{viewYear}</span>
            <button type="button" onClick={() => setViewYear(y => y + 1)} className="neumorphic px-3 py-1 text-gray-600 hover:neumorphic-pressed rounded-lg">›</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((m, i) => {
              const mm = String(i + 1).padStart(2, '0');
              const isSelected = value === `${viewYear}-${mm}`;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className={`py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isSelected ? 'neumorphic-pressed text-blue-600' : 'neumorphic hover:neumorphic-pressed text-gray-700'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Electricity = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/bills');
      const sorted = response.data.sort((a, b) => b.month.localeCompare(a.month));
      setBills(sorted);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.shops?.shopnumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.shops?.tenantname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth ? bill.month === selectedMonth : true;
    return matchesSearch && matchesMonth;
  });

  const handleDownloadReport = () => {
    const monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    let period = '';
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      period = `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    generateElectricityReport(filteredBills, period);
  };

  return (
    <div className="p-8 pb-20 overflow-visible">
      <div className="flex justify-between items-end mb-8 overflow-visible">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Electricity Ledger</h1>
          <p className="text-gray-500 mt-1">Track meter readings and consumption per shop</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="neumorphic px-6 py-3 rounded-2xl text-indigo-600 font-bold flex items-center gap-2 hover:neumorphic-pressed transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Report (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 overflow-visible">
        <div className="md:col-span-2 neumorphic p-6 rounded-3xl">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Search Shop or Tenant</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ex: Shop 01, Rakib..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl neumorphic-inner focus:outline-none text-gray-700"
            />
          </div>
        </div>
        <div className="neumorphic p-6 rounded-3xl overflow-visible">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Filter by Month</label>
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </div>
      </div>

      <div className="neumorphic rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50 bg-opacity-50">
                <th className="py-5 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider">Month</th>
                <th className="py-5 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider">Shop Information</th>
                <th className="py-5 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider text-center">Meter Reading</th>
                <th className="py-5 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider text-center">Usage</th>
                <th className="py-5 px-6 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Amount (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white bg-opacity-30">
              {filteredBills.map(bill => {
                const units = (bill.currunit || 0) - (bill.prevunit || 0);
                return (
                  <tr key={bill.id} className="hover:bg-gray-100 transition-colors">
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase border border-indigo-100">
                        {bill.month}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                        <p className="font-bold text-gray-800">{bill.shops?.shopnumber}</p>
                        <p className="text-xs text-gray-500">{bill.shops?.tenantname}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-2 font-mono text-sm">
                            <span className="text-gray-400">{bill.prevunit || 0}</span>
                            <span className="text-gray-300">→</span>
                            <span className="text-gray-800 font-bold">{bill.currunit || 0}</span>
                        </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg font-bold text-sm ${units > 50 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        {units} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-indigo-700 text-lg">
                      ৳{bill.electricity.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-gray-400 italic">
                    No electricity records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="neumorphic p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rate / Unit</p>
                <h3 className="text-2xl font-black text-gray-800">৳17.00</h3>
            </div>
         </div>
         <div className="neumorphic p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Consumption</p>
                <h3 className="text-2xl font-black text-gray-800">
                  {filteredBills.length > 0 
                    ? Math.round(filteredBills.reduce((acc, b) => acc + (b.currunit - b.prevunit), 0) / filteredBills.length)
                    : 0} <span className="text-sm font-normal text-gray-500 underline underline-offset-4 decoration-purple-200">Units</span>
                </h3>
            </div>
         </div>
         <div className="neumorphic p-6 rounded-3xl flex items-center gap-4 border-l-8 border-indigo-500">
            <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest underline decoration-indigo-200">Total Units</p>
                <h3 className="text-2xl font-black text-indigo-600">
                  {filteredBills.reduce((acc, b) => acc + (b.currunit - b.prevunit), 0).toLocaleString()} <span className="text-sm font-normal text-indigo-400 underline decoration-indigo-200">Units</span>
                </h3>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Electricity;
