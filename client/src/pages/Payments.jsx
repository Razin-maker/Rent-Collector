import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NeumorphicSelect from '../components/NeumorphicSelect';

const DatePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [viewYear, setViewYear] = useState(() => value ? new Date(value).getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? new Date(value).getMonth() : today.getMonth());
  const ref = useRef();

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const getDays = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const handleSelect = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Select Date';

  const { firstDay, daysInMonth } = getDays();
  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

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
        <div className="absolute z-10 mt-2 w-72 neumorphic p-4 bg-gray-100">
          <div className="flex justify-between items-center mb-3">
            <button type="button" onClick={prevMonth} className="neumorphic px-3 py-1 text-gray-600 hover:neumorphic-pressed">‹</button>
            <span className="font-semibold text-gray-700">{months[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="neumorphic px-3 py-1 text-gray-600 hover:neumorphic-pressed">›</button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate &&
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getDate() === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelect(day)}
                  className={`text-sm py-1 rounded transition-all duration-200 ${
                    isSelected ? 'neumorphic-pressed text-blue-600 font-bold' : 'neumorphic hover:neumorphic-pressed text-gray-700'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    billId: '',
    paidAmount: '',
    paymentDate: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchBills();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/bills');
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPayment) {
        await axios.put(`/api/payments/${editingPayment.id}`, formData);
      } else {
        await axios.post('/api/payments', formData);
      }
      
      setShowForm(false);
      setEditingPayment(null);
      setFormData({
        billId: '',
        paidAmount: '',
        paymentDate: ''
      });
      fetchPayments();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      billId: payment.billid,
      paidAmount: payment.paidamount,
      paymentDate: payment.paymentdate
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`/api/payments/${id}`);
        fetchPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Payments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="neumorphic px-6 py-3 text-gray-700 font-medium hover:neumorphic-pressed transition-all duration-300"
        >
          Add Payment
        </button>
      </div>

      {showForm && (
        <div className="neumorphic p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingPayment ? 'Edit Payment' : 'Add New Payment'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bill
                </label>
                <NeumorphicSelect
                  value={formData.billId}
                  onChange={(val) => setFormData({ ...formData, billId: val })}
                  options={bills.map(b => ({ value: b.id, label: `${b.month} - Shop ${b.shops?.shopnumber} (${b.shops?.tenantname}) - ৳${b.total?.toLocaleString()}` }))}
                  placeholder="Select a bill"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount
                </label>
                <input
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <DatePicker
                  value={formData.paymentDate}
                  onChange={(val) => setFormData({ ...formData, paymentDate: val })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="neumorphic px-6 py-3 text-gray-700 font-medium hover:neumorphic-pressed transition-all duration-300"
              >
                {editingPayment ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPayment(null);
                  setFormData({
                    billId: '',
                    paidAmount: '',
                    paymentDate: ''
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
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Shop</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Bill</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map(payment => (
              <tr key={payment.id} className="hover:bg-gray-100">
                <td className="py-3 px-4">
                  {new Date(payment.paymentdate + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-3 px-4">{payment.bills?.month}</td>
                <td className="py-3 px-4">{payment.bills?.shops?.shopnumber}</td>
                <td className="py-3 px-4">{payment.bills?.shops?.tenantname}</td>
                <td className="py-3 px-4">{payment.bills?.total?.toLocaleString()}</td>
                <td className="py-3 px-4">{payment.paidamount?.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={payment.dueamount > 0 ? 'text-red-600' : 'text-green-600'}>
                    {payment.dueamount?.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(payment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
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

export default Payments;