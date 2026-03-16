import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MobileShops = () => {
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    shopNumber: '',
    tenantName: '',
    phone: '',
    rent: ''
  });

  useEffect(() => { fetchShops(); }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get('/api/shops');
      setShops(response.data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingShop) {
        await axios.put(`/api/shops/${editingShop.id}`, formData);
      } else {
        await axios.post('/api/shops', formData);
      }
      setShowForm(false);
      setEditingShop(null);
      setFormData({ shopNumber: '', tenantName: '', phone: '', rent: '' });
      fetchShops();
      Swal.fire({ title: 'সফল!', text: 'দোকানের তথ্য সংরক্ষিত হয়েছে।', icon: 'success', timer: 1500, showConfirmButton: false, background: '#e0e5ec' });
    } catch (error) { console.error(error); }
  };

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setFormData({ shopNumber: shop.shopnumber, tenantName: shop.tenantname, phone: shop.phone, rent: shop.rent });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "দোকানটি ডিলিট করলে এর সকল রেকর্ড মুছে যাবে!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ ডিলেট',
      cancelButtonText: 'না',
      background: '#e0e5ec',
      customClass: { popup: 'rounded-3xl' }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/shops/${id}`);
        fetchShops();
        Swal.fire({ title: 'ডিলিট!', icon: 'success', timer: 1000, showConfirmButton: false, background: '#e0e5ec'});
      } catch (err) { Swal.fire('Error!', 'ডিলিট করা যায়নি।', 'error'); }
    }
  };

  return (
    <div className="p-4 pb-24 bg-[#e0e5ec] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Shops</h1>
        <button
          onClick={() => setShowForm(true)}
          className="neumorphic p-3 rounded-2xl text-indigo-600 active:neumorphic-pressed transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <div className="space-y-4">
        {shops.map(shop => (
          <div key={shop.id} className="neumorphic p-5 rounded-3xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <p className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">{shop.shopnumber}</p>
                    <p className="text-sm font-black text-gray-800">৳{shop.rent.toLocaleString()}</p>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{shop.tenantname}</h3>
                <p className="text-gray-500 text-xs mb-4">{shop.phone}</p>
                <div className="flex gap-3">
                    <button onClick={() => handleEdit(shop)} className="flex-1 py-2 rounded-xl neumorphic text-blue-600 font-bold text-xs uppercase tracking-wider active:neumorphic-pressed">Edit</button>
                    <button onClick={() => handleDelete(shop.id)} className="flex-1 py-2 rounded-xl neumorphic text-red-500 font-bold text-xs uppercase tracking-wider active:neumorphic-pressed">Delete</button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div onClick={() => {setShowForm(false); setEditingShop(null);}} className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
          <div className="relative w-full bg-[#e0e5ec] rounded-t-[40px] p-8 shadow-2xl animate-slide-up">
            <h2 className="text-xl font-black text-gray-800 mb-6">{editingShop ? 'Edit Shop' : 'Add New Shop'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <input placeholder="Shop Number" value={formData.shopNumber} onChange={(e)=>setFormData({...formData, shopNumber: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl focus:outline-none" required />
               <input placeholder="Tenant Name" value={formData.tenantName} onChange={(e)=>setFormData({...formData, tenantName: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl focus:outline-none" required />
               <input placeholder="Phone" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl focus:outline-none" required />
               <input placeholder="Monthly Rent" type="number" value={formData.rent} onChange={(e)=>setFormData({...formData, rent: e.target.value})} className="w-full p-4 neumorphic-inner rounded-2xl focus:outline-none" required />
               <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-lg">Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileShops;
