import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] p-4">
      <div className="neumorphic w-full max-w-md p-8">
        <div className="text-center mb-10">
          <div className="inline-block p-4 neumorphic-inner rounded-full mb-4">
            <svg
              className="w-12 h-12 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-700">Rent Manager</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your shops</p>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-100 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-semibold mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-5 py-3 neumorphic-inner focus:outline-none text-gray-700 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-600 text-sm font-semibold mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 neumorphic-inner focus:outline-none text-gray-700 placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              loading
                ? 'neumorphic-pressed text-gray-400 cursor-not-allowed'
                : 'neumorphic text-indigo-600 hover:text-indigo-700 active:neumorphic-pressed'
            }`}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Forgot password? Contact system administrator.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
