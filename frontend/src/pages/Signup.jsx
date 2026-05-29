import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../services/api';
import { User, Mail, Lock, CheckSquare } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState('customer'); // customer or seller
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Use & Privacy Policy');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await registerApi(fullname, email, password, role);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Try again.');
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
            Create Account
          </h1>
          <p className="text-sm text-gray-500 mt-2">Sign up to get started with Megzo</p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-3 bg-gray-100/80 p-1.5 rounded-2xl mb-6 border border-gray-200">
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-500" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-gray-500" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="form-input"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-gray-500" />
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="form-input"
            />
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 mt-2 cursor-pointer text-xs text-gray-600">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span>
              I agree to Megzo's <a href="#" className="text-blue-600 font-bold hover:underline">Terms of Use</a> and <a href="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</a>.
            </span>
          </label>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-bold text-center p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 text-sm font-bold text-center p-3 rounded-xl border border-green-100">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-custom py-3.5 mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
