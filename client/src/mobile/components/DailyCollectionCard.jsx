import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyCollectionCard = ({ shop }) => {
  const [collections, setCollections] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    // Generate last 7 days including today
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    console.log('DailyCollectionCard for shop:', shop);
    setDates(days);
    fetchCollections(days[0], days[6]);
  }, [shop.id]);

  const fetchCollections = async (start, end) => {
    try {
      const resp = await axios.get(`/api/daily/${shop.id}?start=${start}&end=${end}`);
      setCollections(resp.data);
    } catch (e) { console.error(e); }
  };

  const isPaid = (date) => collections.some(c => c.collection_date === date);

  const togglePayment = async (date) => {
    const alreadyPaid = isPaid(date);
    try {
      if (alreadyPaid) {
        await axios.delete(`/api/daily/${shop.id}/${date}`);
        setCollections(collections.filter(c => c.collection_date !== date));
      } else {
        const payload = {
          shop_id: shop.id,
          collection_date: date,
          amount: shop.daily_rate
        };
        await axios.post('/api/daily', payload);
        setCollections([...collections, { ...payload, collection_date: date }]);
      }
    } catch (e) {
      console.error('Failed to toggle daily collection:', e);
      // Optional: alert the user with the actual error message
      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: e.response?.data?.details || e.response?.data?.error || 'Database table might be missing. Did you run the SQL migration?',
          footer: `Status: ${e.response?.status} - ${e.message}`,
          background: '#e0e5ec',
        });
      }
    }
  };

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return "Today";
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="neumorphic p-5 rounded-[32px] mb-4 bg-[#e0e5ec]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-black text-gray-800 leading-tight">{shop.shopnumber}</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{shop.tenantname}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-indigo-600">৳{shop.daily_rate}/day</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hidden">
        {dates.map(date => {
          const paid = isPaid(date);
          return (
            <button
              key={date}
              onClick={() => togglePayment(date)}
              className={`flex-shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                paid 
                ? 'neumorphic bg-indigo-50 border border-indigo-100 shadow-inner' 
                : 'neumorphic active:neumorphic-pressed'
              }`}
            >
              <span className={`text-[8px] font-black uppercase tracking-tighter mb-1 ${paid ? 'text-indigo-400' : 'text-gray-400'}`}>
                {formatDateLabel(date).split(' ')[1] || (date === new Date().toISOString().split('T')[0] ? 'TODAY' : '')}
              </span>
              <span className={`text-sm font-black ${paid ? 'text-indigo-600' : 'text-gray-600'}`}>
                {formatDateLabel(date).split(' ')[0]}
              </span>
              {paid && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shadow-sm"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DailyCollectionCard;
