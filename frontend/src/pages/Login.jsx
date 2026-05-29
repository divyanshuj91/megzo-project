import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/api';
import { Mail, Lock, UserCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer'); // customer or seller
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await loginApi(email, password, role);
      login(data.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-12">
      <div className="glass-card bg-white/95 backdrop-blur-xl max-w-md w-full p-10 shadow-2xl hover:transform-none">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-2">Login to access your MEGZO account</p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-3 bg-gray-100/80 p-1.5 rounded-2xl mb-8 border border-gray-200">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition duration-300 ${
              role === 'customer'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-600 hover:bg-gray-200/50'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition duration-300 ${
              role === 'seller'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-600 hover:bg-gray-200/50'
            }`}
          >
            Seller
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-gray-500" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-gray-500" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-bold text-center p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="flex justify-end text-sm">
            <a href="#" className="text-blue-600 font-bold hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-custom py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            New to Megzo?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
