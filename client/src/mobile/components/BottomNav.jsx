import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#e0e5ec] border-t border-gray-300 px-2 py-3 z-50 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
      <ul className="flex justify-around items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'text-indigo-600 neumorphic-pressed' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] mt-1 font-bold">Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/shops"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'text-indigo-600 neumorphic-pressed' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-[10px] mt-1 font-bold">Shops</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/bills"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'text-indigo-600 neumorphic-pressed' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] mt-1 font-bold">Bills</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/electricity"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'text-indigo-600 neumorphic-pressed' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px] mt-1 font-bold">Elec</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'text-indigo-600 neumorphic-pressed' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] mt-1 font-bold">Pay</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;
