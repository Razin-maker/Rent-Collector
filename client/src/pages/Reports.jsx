import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NeumorphicSelect from '../components/NeumorphicSelect';

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

  const handleSelect = (i) => {
    const mm = String(i + 1).padStart(2, '0');
    onChange(`${viewYear}-${mm}`);
    setOpen(false);
  };

  const displayValue = value
    ? `${months[parseInt(value.split('-')[1]) - 1]} ${value.split('-')[0]}`
    : 'Select Month';

  return (
    <div className="relative w-full md:w-64" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 neumorphic-inner text-left text-gray-700 focus:outline-none flex justify-between items-center"
      >
        <span>{displayValue}</span>
        <span className="text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full neumorphic p-4 bg-gray-100">
          <div className="flex justify-between items-center mb-3">
            <button type="button" onClick={() => setViewYear(y => y - 1)} className="neumorphic px-3 py-1 text-gray-600 hover:neumorphic-pressed">‹</button>
            <span className="font-semibold text-gray-700">{viewYear}</span>
            <button type="button" onClick={() => setViewYear(y => y + 1)} className="neumorphic px-3 py-1 text-gray-600 hover:neumorphic-pressed">›</button>
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
                  className={`py-2 text-sm font-medium rounded transition-all duration-200 ${
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

const Reports = () => {
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedShop, setSelectedShop] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, billsRes, shopsRes] = await Promise.all([
        axios.get('/api/payments'),
        axios.get('/api/bills'),
        axios.get('/api/shops')
      ]);
      
      setPayments(paymentsRes.data);
      setBills(billsRes.data);
      setShops(shopsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const monthlyReport = selectedMonth ? payments.filter(payment => 
    payment.bills.month === selectedMonth
  ) : [];

  const shopReport = selectedShop ? payments.filter(payment => 
    payment.bills?.shopid === selectedShop
  ) : [];

  const dueReport = payments.filter(payment => payment.dueamount > 0);

  const monthlyTotal = monthlyReport.reduce((sum, payment) => sum + Number(payment.paidamount), 0);
  const monthlyDue = monthlyReport.reduce((sum, payment) => sum + Number(payment.dueamount), 0);

  const shopTotalPaid = shopReport.reduce((sum, payment) => sum + Number(payment.paidamount), 0);
  const shopTotalDue = shopReport.reduce((sum, payment) => sum + Number(payment.dueamount), 0);

  const totalDue = dueReport.reduce((sum, payment) => sum + Number(payment.dueamount), 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Reports</h1>

      {/* Monthly Report */}
      <div className="neumorphic p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Collection Report</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Month
          </label>
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </div>

        {selectedMonth && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="neumorphic p-4">
                <p className="text-sm text-gray-600">Total Collected</p>
                <p className="text-2xl font-bold text-gray-700">
                  {monthlyTotal.toLocaleString()}
                </p>
              </div>
              <div className="neumorphic p-4">
                <p className="text-sm text-gray-600">Total Due</p>
                <p className="text-2xl font-bold text-gray-700">
                  {monthlyDue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Shop</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Bill</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {monthlyReport.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">{payment.bills?.shops?.shopnumber}</td>
                      <td className="py-3 px-4">{payment.bills?.shops?.tenantname}</td>
                      <td className="py-3 px-4">{payment.bills?.total?.toLocaleString()}</td>
                      <td className="py-3 px-4">{payment.paidamount?.toLocaleString()}</td>
                      <td className="py-3 px-4">{payment.dueamount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Shop-wise Report */}
      <div className="neumorphic p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Shop-wise Payment History</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Shop
          </label>
          <div className="w-full md:w-64">
            <NeumorphicSelect
              value={selectedShop}
              onChange={setSelectedShop}
              options={shops.map(s => ({ value: s.id, label: `${s.shopnumber} - ${s.tenantname}` }))}
              placeholder="Select a shop"
            />
          </div>
        </div>

        {selectedShop && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="neumorphic p-4">
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-700">
                  {shopTotalPaid.toLocaleString()}
                </p>
              </div>
              <div className="neumorphic p-4">
                <p className="text-sm text-gray-600">Total Due</p>
                <p className="text-2xl font-bold text-gray-700">
                  {shopTotalDue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Bill</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Due</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shopReport.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-100">
                      <td className="py-3 px-4">{payment.bills?.month}</td>
                      <td className="py-3 px-4">{payment.bills?.total?.toLocaleString()}</td>
                      <td className="py-3 px-4">{payment.paidamount?.toLocaleString()}</td>
                      <td className="py-3 px-4">{payment.dueamount?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {new Date(payment.paymentdate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Due Report */}
      <div className="neumorphic p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Due Report</h2>
        
        <div className="neumorphic p-4 mb-4">
          <p className="text-sm text-gray-600">Total Pending Due</p>
          <p className="text-2xl font-bold text-gray-700">
            {totalDue.toLocaleString()}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Shop</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Bill</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dueReport.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4">{payment.bills?.shops?.shopnumber}</td>
                  <td className="py-3 px-4">{payment.bills?.shops?.tenantname}</td>
                  <td className="py-3 px-4">{payment.bills?.month}</td>
                  <td className="py-3 px-4">{payment.bills?.total?.toLocaleString()}</td>
                  <td className="py-3 px-4">{payment.paidamount?.toLocaleString()}</td>
                  <td className="py-3 px-4">{payment.dueamount?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;