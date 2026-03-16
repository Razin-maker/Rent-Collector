import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateInvoice } from '../../utils/pdfGenerator';
import Swal from 'sweetalert2';

const MobileBills = () => {
  const [bills, setBills] = useState([]);
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({ shopId: '', month: '', prevUnit: '', currUnit: '', water: '', otherCharges: '' });

  useEffect(() => { fetchBills(); fetchShops(); }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/bills');
      setBills(response.data.sort((a,b) => b.month.localeCompare(a.month)));
    } catch (error) { console.error(error); }
  };

  const fetchShops = async () => {
    try {
      const response = await axios.get('/api/shops');
      setShops(response.data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const RATE = 17;
      const units = Math.max(0, Number(formData.currUnit) - Number(formData.prevUnit));
      const elec = units * RATE;
      const payload = { ...formData, electricity: elec };
      
      if (editingBill) {
        await axios.put(`/api/bills/${editingBill.id}`, payload);
      } else {
        await axios.post('/api/bills', payload);
      }
      setShowForm(false);
      setEditingBill(null);
      setFormData({ shopId: '', month: '', prevUnit: '', currUnit: '', water: '', otherCharges: '' });
      fetchBills();
      Swal.fire({ title: 'সফল!', icon: 'success', timer: 1000, showConfirmButton: false, background: '#e0e5ec' });
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    const r = await Swal.fire({ title: 'ডিলিট করবেন?', showCancelButton: true, background: '#e0e5ec', confirmButtonText: 'হ্যাঁ' });
    if (r.isConfirmed) {
      await axios.delete(`/api/bills/${id}`);
      fetchBills();
    }
  };

  return (
    <div className="p-4 pb-24 bg-[#e0e5ec] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800">Bills</h1>
        <button onClick={() => setShowForm(true)} className="neumorphic p-3 rounded-2xl text-indigo-600 active:neumorphic-pressed">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="space-y-4">
        {bills.map(bill => (
          <div key={bill.id} className="neumorphic p-5 rounded-3xl">
            <div className="flex justify-between items-start mb-3">
               <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{bill.month}</span>
                  <h3 className="font-bold text-gray-800 mt-1">{bill.shops?.shopnumber} - {bill.shops?.tenantname}</h3>
               </div>
               <button onClick={() => generateInvoice(bill)} className="p-2 neumorphic rounded-xl text-indigo-600 active:neumorphic-pressed">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               </button>
            </div>
            
            <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                <div className="text-[10px] text-gray-500 space-y-1">
                    <p>Rent: ৳{bill.rent.toLocaleString()}</p>
                    <p>Elec: ৳{bill.electricity.toLocaleString()}</p>
                    {bill.water > 0 && <p>Water: ৳{bill.water.toLocaleString()}</p>}
                    {bill.previous_due > 0 && <p className="text-red-500 font-bold">Prev Due: ৳{bill.previous_due.toLocaleString()}</p>}
                </div>
                <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase font-black">Net Total</p>
                    <p className="text-xl font-black text-indigo-700 underline decoration-indigo-200 decoration-2">৳{bill.total.toLocaleString()}</p>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <button onClick={() => { setEditingBill(bill); setFormData({ shopId: bill.shopid, month: bill.month, prevUnit: bill.prevunit, currUnit: bill.currunit, water: bill.water, otherCharges: bill.othercharges }); setShowForm(true); }} className="flex-1 py-2 neumorphic rounded-xl text-xs font-bold text-gray-600">Edit</button>
                <button onClick={() => handleDelete(bill.id)} className="flex-1 py-2 neumorphic rounded-xl text-xs font-bold text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative w-full bg-[#e0e5ec] rounded-t-[40px] p-8 shadow-2xl h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-black text-gray-800 mb-6">{editingBill ? 'Edit Bill' : 'New Bill'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select value={formData.shopId} onChange={(e)=>setFormData({...formData, shopId: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl appearance-none bg-[#e0e5ec]" required>
                   <option value="">Select Shop</option>
                   {shops.map(s => <option key={s.id} value={s.id}>{s.shopnumber} - {s.tenantname}</option>)}
                </select>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase ml-1">Select Month</label>
                  <input 
                    type="month" 
                    value={formData.month} 
                    onChange={(e)=>setFormData({...formData, month: e.target.value})} 
                    className="w-full p-4 neumorphic-inner rounded-2xl text-gray-800" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Prev Reading" value={formData.prevUnit} onChange={(e)=>setFormData({...formData, prevUnit: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl" required />
                    <input type="number" placeholder="Curr Reading" value={formData.currUnit} onChange={(e)=>setFormData({...formData, currUnit: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl" required />
                </div>
                <input type="number" placeholder="Water Bill (Optional)" value={formData.water} onChange={(e)=>setFormData({...formData, water: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl" />
                <input type="number" placeholder="Other Charges" value={formData.otherCharges} onChange={(e)=>setFormData({...formData, otherCharges: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl" />
                
                <button type="submit" className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black shadow-xl mt-4">Save Bill</button>
                <div className="h-10"></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileBills;
