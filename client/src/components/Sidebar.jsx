import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { signOut } = useAuth();
  return (

    <div className="w-64 bg-[#e0e5ec] flex flex-col">
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-gray-700">Rent Manager</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-3">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'neumorphic-pressed text-gray-800'
                    : 'neumorphic text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/daily-collection"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'neumorphic-pressed text-gray-800'
                    : 'neumorphic text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Daily Collection
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shops"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'neumorphic-pressed text-gray-800'
                    : 'neumorphic text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <svg
                className="w-5 h-5 mr-3"
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
              Shops
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bills"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'neumorphic-pressed text-gray-800'
                    : 'neumorphic text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Bills
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'neumorphic-pressed text-gray-800'
                    : 'neumorphic text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <svg
                className="w-5 h-5 mr-3"
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
              Payments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'neumorphic-pressed text-gray-800'
                    : 'neumorphic text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/electricity"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'neumorphic-pressed text-gray-800'
                    : 'neumorphic text-gray-600 hover:text-gray-800'
                }`
              }
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Electricity
            </NavLink>
          </li>
        </ul>

      </nav>
      <div className="p-4 border-t border-gray-300">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center px-4 py-3 rounded-2xl neumorphic text-red-600 hover:text-red-700 transition-all duration-300 active:neumorphic-pressed font-semibold"
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
        <div className="text-sm text-gray-500 mt-4 text-center">
          <p>Version 1.0.0</p>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;