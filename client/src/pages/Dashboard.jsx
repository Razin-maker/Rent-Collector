import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShops: 0,
    totalRentCollected: 0,
    totalDue: 0,
    currentMonthStatus: []
  });

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchChartData();
  }, []);

  const fetchStats = async () => {
    try {
      const [shopsRes, paymentsRes, billsRes] = await Promise.all([
        axios.get('/api/shops'),
        axios.get('/api/payments'),
        axios.get('/api/bills')
      ]);

      const totalShops = shopsRes.data.length;
      
      const totalRentCollected = paymentsRes.data.reduce((sum, payment) => 
        sum + payment.paidamount, 0
      );

      const totalDue = paymentsRes.data.reduce((sum, payment) => 
        sum + payment.dueamount, 0
      );

      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentMonthBills = billsRes.data.filter(bill => bill.month === currentMonth);

      setStats({
        totalShops,
        totalRentCollected,
        totalDue,
        currentMonthStatus: currentMonthBills
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get('/api/payments');
      const payments = response.data;

      const monthlyData = {};
      
      payments.forEach(payment => {
        const month = payment.bills.month;
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += payment.paidamount;
      });

      const labels = Object.keys(monthlyData).sort();
      const data = labels.map(month => monthlyData[month]);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Monthly Rent Collected',
            data,
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            tension: 0.1
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="neumorphic p-6">
          <div className="flex items-center">
            <div className="p-3 neumorphic-inner rounded-full">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Shops</p>
              <p className="text-2xl font-bold text-gray-700">{stats.totalShops}</p>
            </div>
          </div>
        </div>

        <div className="neumorphic p-6">
          <div className="flex items-center">
            <div className="p-3 neumorphic-inner rounded-full">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Rent Collected</p>
              <p className="text-2xl font-bold text-gray-700">
                {stats.totalRentCollected.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="neumorphic p-6">
          <div className="flex items-center">
            <div className="p-3 neumorphic-inner rounded-full">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Due</p>
              <p className="text-2xl font-bold text-gray-700">
                {stats.totalDue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="neumorphic p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Collection Trend</h2>
        {chartData && (
          <div className="h-80">
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        )}
      </div>

      <div className="neumorphic p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Month Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 px-4">Shop</th>
                <th className="text-left py-3 px-4">Tenant</th>
                <th className="text-left py-3 px-4">Rent</th>
                <th className="text-left py-3 px-4">Electricity</th>
                <th className="text-left py-3 px-4">Water</th>
                <th className="text-left py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.currentMonthStatus.map(bill => (
                <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{bill.shops.shopnumber}</td>
                  <td className="py-3 px-4">{bill.shops.tenantname}</td>
                  <td className="py-3 px-4">{bill.rent.toLocaleString()}</td>
                  <td className="py-3 px-4">{bill.electricity.toLocaleString()}</td>
                  <td className="py-3 px-4">{bill.water.toLocaleString()}</td>
                  <td className="py-3 px-4">{bill.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;