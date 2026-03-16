import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const { error } = await signUp({ email, password });
      if (error) throw error;
      setSuccess(true);
      // Optional: Auto login or redirect to login after a delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create account');
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-700">Create Account</h1>
          <p className="text-gray-500 mt-2">Start managing your shop rents</p>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-100 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 text-sm text-green-600 bg-green-100 rounded-lg text-center font-medium">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-semibold mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-5 py-3 neumorphic-inner focus:outline-none text-gray-700 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-6">
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

          <div className="mb-8">
            <label className="block text-gray-600 text-sm font-semibold mb-2 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 neumorphic-inner focus:outline-none text-gray-700 placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              loading || success
                ? 'neumorphic-pressed text-gray-400 cursor-not-allowed'
                : 'neumorphic text-indigo-600 hover:text-indigo-700 active:neumorphic-pressed'
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
