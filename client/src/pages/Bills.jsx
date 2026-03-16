import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NeumorphicSelect from '../components/NeumorphicSelect';
import { generateInvoice } from '../utils/pdfGenerator';
import Swal from 'sweetalert2';

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
    : 'Select Month';

  return (
    <div className="relative" ref={ref}>
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

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    shopId: '',
    month: '',
    prevUnit: '',
    currUnit: '',
    water: '',
    otherCharges: ''
  });

  const RATE_PER_UNIT = 17;
  const unitDiff = formData.currUnit !== '' && formData.prevUnit !== ''
    ? Math.max(0, Number(formData.currUnit) - Number(formData.prevUnit))
    : null;
  const electricityAmount = unitDiff !== null ? unitDiff * RATE_PER_UNIT : null;

  useEffect(() => {
    fetchBills();
    fetchShops();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/bills');
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await axios.get('/api/shops');
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = { ...formData, electricity: electricityAmount ?? formData.electricity };
      if (editingBill) {
        await axios.put(`/api/bills/${editingBill.id}`, payload);
      } else {
        await axios.post('/api/bills', payload);
      }
      
      setShowForm(false);
      setEditingBill(null);
      setFormData({
        shopId: '',
        month: '',
        prevUnit: '',
        currUnit: '',
        water: '',
        otherCharges: ''
      });
      fetchBills();
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      shopId: bill.shopid,
      month: bill.month,
      prevUnit: bill.prevunit || '',
      currUnit: bill.currunit || '',
      water: bill.water,
      otherCharges: bill.othercharges
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "একবার ডিলিট করলে এটি আর ফেরত পাওয়া যাবে না!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন!',
      cancelButtonText: 'বাতিল করুন',
      background: '#e0e5ec',
      customClass: {
        popup: 'rounded-3xl border border-gray-300 shadow-xl'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/bills/${id}`);
        fetchBills();
        Swal.fire({
          title: 'ডিলিট হয়েছে!',
          text: 'বিলটি সফলভাবে ডিলিট করা হয়েছে।',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#e0e5ec',
        });
      } catch (error) {
        console.error('Error deleting bill:', error);
        Swal.fire('Error!', 'ডিলিট করার সময় সমস্যা হয়েছে।', 'error');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Bills</h1>
        <button
          onClick={() => setShowForm(true)}
          className="neumorphic px-6 py-3 text-gray-700 font-medium hover:neumorphic-pressed transition-all duration-300"
        >
          Add Bill
        </button>
      </div>

      {showForm && (
        <div className="neumorphic p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingBill ? 'Edit Bill' : 'Add New Bill'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop
                </label>
                <NeumorphicSelect
                  value={formData.shopId}
                  onChange={(val) => setFormData({ ...formData, shopId: val })}
                  options={shops.map(s => ({ value: s.id, label: `${s.shopnumber} - ${s.tenantname}` }))}
                  placeholder="Select a shop"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <MonthPicker
                  value={formData.month}
                  onChange={(val) => setFormData({ ...formData, month: val })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Previous Unit
                </label>
                <input
                  type="number"
                  value={formData.prevUnit}
                  onChange={(e) => setFormData({ ...formData, prevUnit: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Unit
                </label>
                <input
                  type="number"
                  value={formData.currUnit}
                  onChange={(e) => setFormData({ ...formData, currUnit: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                  required
                />
              </div>
              {unitDiff !== null && (
                <div className="md:col-span-2 neumorphic-inner px-4 py-3 text-sm text-gray-700 flex gap-6">
                  <span>Unit Used: <strong>{unitDiff}</strong></span>
                  <span>Electricity Bill: <strong>৳{electricityAmount.toLocaleString()}</strong> ({unitDiff} × {RATE_PER_UNIT})</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Water (Optional)
                </label>
                <input
                  type="number"
                  value={formData.water}
                  onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Charges (Optional)
                </label>
                <input
                  type="number"
                  value={formData.otherCharges}
                  onChange={(e) => setFormData({ ...formData, otherCharges: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="neumorphic px-6 py-3 text-gray-700 font-medium hover:neumorphic-pressed transition-all duration-300"
              >
                {editingBill ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBill(null);
                  setFormData({
                    shopId: '',
                    month: '',
                    prevUnit: '',
                    currUnit: '',
                    water: '',
                    otherCharges: ''
                  });
                }}
                className="neumorphic px-6 py-3 text-gray-700 font-medium hover:neumorphic-pressed transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="neumorphic overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">

            <tr>
              <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">Month</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">Shop</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs text-center border-x border-gray-300">New Bill Details (৳)</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">Prev Due</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs font-bold text-indigo-700">Net Total</th>
              <th className="text-left py-2 px-3 font-semibold text-gray-700 text-xs">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bills.map(bill => (
              <tr key={bill.id} className="hover:bg-gray-100 items-center">
                <td className="py-3 px-3 text-sm">{bill.month}</td>
                <td className="py-3 px-3 text-sm font-medium">{bill.shops?.shopnumber}</td>
                <td className="py-3 px-3 text-xs border-x border-gray-300">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 opacity-75">
                    <span>Rent: ৳{bill.rent.toLocaleString()}</span>
                    <span>Elec: ৳{bill.electricity.toLocaleString()}</span>
                    <span>Water: ৳{bill.water.toLocaleString()}</span>
                    <span>Other: ৳{(bill.othercharges || 0).toLocaleString()}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-sm text-red-500 font-medium">
                  {bill.previous_due > 0 ? `৳${bill.previous_due.toLocaleString()}` : '-'}
                </td>
                <td className="py-3 px-3 text-sm font-bold text-indigo-700">
                  ৳{bill.total.toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => generateInvoice(bill)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
                      title="Download PDF"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-bold">PDF</span>
                    </button>
                    <button
                      onClick={() => handleEdit(bill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(bill.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Bills;