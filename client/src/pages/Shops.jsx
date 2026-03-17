import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    shopNumber: '',
    tenantName: '',
    phone: '',
    rent: '',
    rentType: 'monthly',
    dailyRate: ''
  });

  useEffect(() => {
    fetchShops();
  }, []);

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
      if (editingShop) {
        await axios.put(`/api/shops/${editingShop.id}`, formData);
      } else {
        await axios.post('/api/shops', formData);
      }
      
      setShowForm(false);
      setEditingShop(null);
      setFormData({
        shopNumber: '',
        tenantName: '',
        phone: '',
        rent: '',
        rentType: 'monthly',
        dailyRate: ''
      });
      fetchShops();
    } catch (error) {
      console.error('Error saving shop:', error);
    }
  };

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setFormData({
      shopNumber: shop.shopnumber,
      tenantName: shop.tenantname,
      phone: shop.phone,
      rent: shop.rent,
      rentType: shop.rent_type || 'monthly',
      dailyRate: shop.daily_rate || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: "দোকানটি ডিলিট করলে এর সাথে যুক্ত সকল বিল এবং পেমেন্ট রেকর্ড মুছে যেতে পারে!",
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
        await axios.delete(`/api/shops/${id}`);
        fetchShops();
        Swal.fire({
          title: 'ডিলিট হয়েছে!',
          text: 'দোকানটি সফলভাবে ডিলিট করা হয়েছে।',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#e0e5ec',
        });
      } catch (error) {
        console.error('Error deleting shop:', error);
        Swal.fire({
          title: 'Error!',
          text: 'ডিলিট করার সময় সমস্যা হয়েছে। সম্ভবত এই দোকানের সাথে বিল যুক্ত আছে।',
          icon: 'error',
          background: '#e0e5ec',
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Shops</h1>
        <button
          onClick={() => setShowForm(true)}
          className="neumorphic px-6 py-3 text-gray-700 font-medium hover:neumorphic-pressed transition-all duration-300"
        >
          Add Shop
        </button>
      </div>

      {showForm && (
        <div className="neumorphic p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingShop ? 'Edit Shop' : 'Add New Shop'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Number
                </label>
                <input
                  type="text"
                  value={formData.shopNumber}
                  onChange={(e) => setFormData({ ...formData, shopNumber: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenant Name
                </label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rent
                </label>
                <input
                  type="number"
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rent Type
                </label>
                <select
                  value={formData.rentType}
                  onChange={(e) => setFormData({ ...formData, rentType: e.target.value })}
                  className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700 bg-transparent"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
              {formData.rentType === 'daily' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Rate
                  </label>
                  <input
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    className="w-full px-3 py-2 neumorphic-inner border-none focus:outline-none text-gray-700"
                    placeholder="Enter daily rent amount"
                    required
                  />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="neumorphic px-6 py-3 text-gray-700 font-medium hover:neumorphic-pressed transition-all duration-300"
              >
                {editingShop ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingShop(null);
                  setFormData({
                    shopNumber: '',
                    tenantName: '',
                    phone: '',
                    rent: '',
                    rentType: 'monthly',
                    dailyRate: ''
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
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Shop Number</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Rent/Daily</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shops.map(shop => (
              <tr key={shop.id} className="hover:bg-gray-100">
                <td className="py-3 px-4">{shop.shopnumber}</td>
                <td className="py-3 px-4">{shop.tenantname}</td>
                <td className="py-3 px-3">{shop.phone}</td>
                <td className="py-3 px-3 text-xs uppercase font-bold text-gray-500">
                  {shop.rent_type === 'daily' ? 'Daily' : 'Monthly'}
                </td>
                <td className="py-3 px-3">
                  {shop.rent.toLocaleString()}
                  {shop.rent_type === 'daily' && (
                    <span className="text-xs text-indigo-600 block">Daily: {shop.daily_rate}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(shop)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(shop.id)}
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

export default Shops;