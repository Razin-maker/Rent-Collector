import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const MobileDailyCollection = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [collections, setCollections] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDailyShops();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      fetchMonthCollections();
    }
  }, [selectedShop, currentMonth]);

  const fetchDailyShops = async () => {
    try {
      const res = await axios.get('/api/shops');
      const dailyShops = res.data.filter(s => s.rent_type === 'daily');
      setShops(dailyShops);
      if (dailyShops.length > 0) setSelectedShop(dailyShops[0]);
    } catch (e) { console.error(e); }
  };

  const fetchMonthCollections = async () => {
    if (!selectedShop) return;
    const { year, month } = currentMonth;
    const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    try {
      const res = await axios.get(`/api/daily/${selectedShop.id}?start=${start}&end=${end}`);
      setCollections(res.data || []);
    } catch (e) { console.error(e); }
  };

  const toggleDay = async (dateStr) => {
    if (!selectedShop) return;
    setLoading(true);
    const isPaid = collections.some(c => c.collection_date === dateStr);
    try {
      if (isPaid) {
        await axios.delete(`/api/daily/${selectedShop.id}/${dateStr}`);
        setCollections(prev => prev.filter(c => c.collection_date !== dateStr));
      } else {
        await axios.post('/api/daily', {
          shop_id: selectedShop.id,
          collection_date: dateStr,
          amount: selectedShop.daily_rate
        });
        setCollections(prev => [...prev, { collection_date: dateStr, amount: selectedShop.daily_rate }]);
      }
    } catch (e) {
      console.error('Toggle error:', e);
    }
    setLoading(false);
  };

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Empty slots before first day
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push(dateStr);
    }
    return days;
  }, [currentMonth]);

  const todayStr = new Date().toISOString().split('T')[0];

  const isPaid = (dateStr) => collections.some(c => c.collection_date === dateStr);
  const isFuture = (dateStr) => dateStr > todayStr;

  // Stats
  const stats = useMemo(() => {
    const { year, month } = currentMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    const daysPassed = isCurrentMonth ? today.getDate() : daysInMonth;
    
    const paidDays = collections.length;
    const totalCollected = collections.reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const expectedTotal = daysPassed * (selectedShop?.daily_rate || 0);
    const rate = daysPassed > 0 ? Math.round((paidDays / daysPassed) * 100) : 0;
    const missedDays = daysPassed - paidDays;

    return { paidDays, totalCollected, expectedTotal, rate, daysPassed, missedDays, daysInMonth };
  }, [collections, currentMonth, selectedShop]);

  const prevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (shops.length === 0) {
    return (
      <div className="p-4 pb-24 bg-[#e0e5ec] min-h-screen flex items-center justify-center">
        <div className="neumorphic p-8 rounded-3xl text-center">
          <p className="text-gray-500 font-bold">কোনো Daily Shop নেই</p>
          <p className="text-xs text-gray-400 mt-2">Shops থেকে একটি দোকানকে "Daily" হিসেবে সেট করুন।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-24 bg-[#e0e5ec] min-h-screen">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Daily Collection</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Tap to mark paid</p>
      </div>

      {/* Shop Selector */}
      {shops.length > 1 && (
        <div className="flex gap-3 mb-5 overflow-x-auto pb-2 scrollbar-hidden">
          {shops.map(shop => (
            <button
              key={shop.id}
              onClick={() => setSelectedShop(shop)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-300 ${
                selectedShop?.id === shop.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'neumorphic text-gray-600 active:neumorphic-pressed'
              }`}
            >
              {shop.shopnumber} - {shop.tenantname}
            </button>
          ))}
        </div>
      )}

      {/* Selected Shop Info */}
      {selectedShop && (
        <>
          {/* Grid layout: side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* Left Column: Stats + History */}
          <div className="space-y-5">
          {/* Stats Card */}
          <div className="neumorphic p-5 rounded-[28px] relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-indigo-500 opacity-5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Shop {selectedShop.shopnumber}</p>
                  <h2 className="text-xl font-black text-gray-800">{selectedShop.tenantname}</h2>
                  <p className="text-xs text-indigo-600 font-bold mt-0.5">৳{selectedShop.daily_rate}/day</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-800">৳{stats.totalCollected.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">collected</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] font-bold mb-1.5">
                  <span className="text-gray-400">{stats.paidDays} of {stats.daysPassed} days</span>
                  <span className={stats.rate >= 80 ? 'text-green-500' : stats.rate >= 50 ? 'text-yellow-500' : 'text-red-400'}>{stats.rate}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-200 overflow-hidden neumorphic-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      stats.rate >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      stats.rate >= 50 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                      'bg-gradient-to-r from-red-400 to-rose-500'
                    }`}
                    style={{ width: `${stats.rate}%` }}
                  ></div>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <p className="text-lg font-black text-green-500">{stats.paidDays}</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase">Paid</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-red-400">{stats.missedDays}</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase">Missed</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-gray-500">{stats.daysInMonth - stats.daysPassed}</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase">Left</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent History (inside left column on desktop) */}
          <div className="neumorphic p-5 rounded-[28px]">
            <h3 className="text-sm font-black text-gray-700 mb-4 tracking-tight">Recent Collections</h3>
            <div className="space-y-2.5">
              {[...collections]
                .sort((a, b) => b.collection_date.localeCompare(a.collection_date))
                .slice(0, 10)
                .map(c => {
                  const d = new Date(c.collection_date + 'T00:00:00');
                  return (
                    <div key={c.collection_date} className="flex items-center justify-between py-2.5 px-3 rounded-2xl neumorphic-inner">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">
                            {d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-[9px] text-gray-400">
                            {d.toLocaleDateString('en-US', { weekday: 'long' })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-green-600">৳{Number(c.amount).toLocaleString()}</p>
                    </div>
                  );
                })}
              {collections.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                  এই মাসে এখনো কোনো কালেকশন নেই
                </div>
              )}
            </div>
          </div>

          </div>{/* End Left Column */}

          {/* Right Column: Calendar */}
          <div className="neumorphic p-5 rounded-[28px] h-fit">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-5">
              <button onClick={prevMonth} className="neumorphic w-10 h-10 rounded-xl flex items-center justify-center active:neumorphic-pressed transition-all">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-base font-black text-gray-700 tracking-tight">
                {monthNames[currentMonth.month]} {currentMonth.year}
              </h3>
              <button onClick={nextMonth} className="neumorphic w-10 h-10 rounded-xl flex items-center justify-center active:neumorphic-pressed transition-all">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                <div key={d} className="text-center text-[9px] font-black text-gray-400 uppercase">{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((dateStr, idx) => {
                if (!dateStr) return <div key={`e-${idx}`} className="w-full aspect-square"></div>;
                
                const day = parseInt(dateStr.split('-')[2]);
                const paid = isPaid(dateStr);
                const future = isFuture(dateStr);
                const isToday = dateStr === todayStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => !future && toggleDay(dateStr)}
                    disabled={future || loading}
                    className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-black transition-all duration-200
                      ${isToday ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-[#e0e5ec]' : ''}
                      ${paid ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md shadow-green-200'
                        : future ? 'bg-gray-100 text-gray-300 cursor-default'
                        : !paid && !future && dateStr <= todayStr ? 'neumorphic-inner text-red-400 active:scale-95'
                        : 'neumorphic text-gray-600 active:neumorphic-pressed'
                      }
                    `}
                  >
                    <span className="text-[11px]">{day}</span>
                    {paid && (
                      <svg className="w-2.5 h-2.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-5 mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-green-400 to-emerald-500"></div>
                <span className="text-[9px] text-gray-400 font-bold">Paid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm neumorphic-inner"></div>
                <span className="text-[9px] text-gray-400 font-bold">Missed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200"></div>
                <span className="text-[9px] text-gray-400 font-bold">Upcoming</span>
              </div>
            </div>
          </div>

          </div>{/* End Grid */}
        </>
      )}
    </div>
  );
};

export default MobileDailyCollection;
