import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MobilePayments = () => {
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({ billId: '', paidAmount: '', paymentDate: new Date().toISOString().split('T')[0] });

  useEffect(() => { fetchPayments(); fetchBills(); }, []);

  const fetchPayments = async () => {
    try {
      const r = await axios.get('/api/payments');
      setPayments(r.data.sort((a,b) => b.paymentdate.localeCompare(a.paymentdate)));
    } catch (e) { console.error(e); }
  };

  const fetchBills = async () => {
    try {
      const r = await axios.get('/api/bills');
      setBills(r.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPayment) await axios.put(`/api/payments/${editingPayment.id}`, formData);
      else await axios.post('/api/payments', formData);
      setShowForm(false);
      setEditingPayment(null);
      setFormData({ billId: '', paidAmount: '', paymentDate: new Date().toISOString().split('T')[0] });
      fetchPayments();
      Swal.fire({ title: 'Saved!', icon: 'success', timer: 1000, showConfirmButton: false, background: '#e0e5ec' });
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    const r = await Swal.fire({ title: 'মুছে ফেলবেন?', showCancelButton: true, background: '#e0e5ec' });
    if (r.isConfirmed) {
      await axios.delete(`/api/payments/${id}`);
      fetchPayments();
    }
  };

  return (
    <div className="p-4 pb-24 bg-[#e0e5ec] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800">Payments</h1>
        <button onClick={() => setShowForm(true)} className="neumorphic p-3 rounded-2xl text-indigo-600 active:neumorphic-pressed">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="space-y-4">
        {payments.map(p => (
          <div key={p.id} className="neumorphic p-5 rounded-3xl">
            <div className="flex justify-between items-start mb-2">
                <div>
                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{p.paymentdate}</p>
                   <h3 className="font-bold text-gray-800">{p.bills?.shops?.shopnumber} - {p.bills?.shops?.tenantname}</h3>
                </div>
                <p className="text-[10px] bg-gray-100 px-2 py-1 rounded-lg font-bold">{p.bills?.month}</p>
            </div>
            
            <div className="flex justify-between items-center py-3 border-y border-gray-100 my-3">
                <div>
                   <p className="text-[9px] text-gray-400 uppercase font-black">Paid</p>
                   <p className="text-lg font-black text-green-600">৳{p.paidamount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] text-gray-400 uppercase font-black">Remaining Due</p>
                   <p className={`text-lg font-black ${p.dueamount > 0 ? 'text-red-500' : 'text-gray-400 underline underline-offset-4 decoration-green-200'}`}>৳{p.dueamount.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <button onClick={() => { setEditingPayment(p); setFormData({ billId: p.billid, paidAmount: p.paidamount, paymentDate: p.paymentdate }); setShowForm(true); }} className="flex-1 py-2 neumorphic rounded-xl text-xs font-bold text-blue-600">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="flex-1 py-2 neumorphic rounded-xl text-xs font-bold text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative w-full bg-[#e0e5ec] rounded-t-[40px] p-8 shadow-2xl animate-slide-up">
            <h2 className="text-xl font-black text-gray-800 mb-6">{editingPayment ? 'Edit Payment' : 'Collect Payment'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <select value={formData.billId} onChange={(e)=>setFormData({...formData, billId: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl bg-[#e0e5ec] appearance-none" required>
                  <option value="">Select Bill</option>
                  {bills.map(b => (
                    <option key={b.id} value={b.id}>{b.month} - {b.shops?.shopnumber} (৳{b.total})</option>
                  ))}
               </select>
               <input type="number" placeholder="Amount Paid" value={formData.paidAmount} onChange={(e)=>setFormData({...formData, paidAmount: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl" required />
               <div className="space-y-1">
                 <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Payment Date</label>
                 <input 
                   type="date" 
                   value={formData.paymentDate} 
                   onChange={(e)=>setFormData({...formData, paymentDate: e.target.value})} 
                   className="w-full p-4 neumorphic-inner rounded-2xl text-gray-800" 
                   required 
                 />
               </div>
               <button type="submit" className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black shadow-xl mt-4">Record Payment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePayments;
