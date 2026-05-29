import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/api';
import { Mail, Lock } from 'lucide-react';

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
    <div className="min-h-screen flex justify-center items-center px-4 py-12 pt-28">
      <div className="glass-card max-w-md w-full p-10 border border-[var(--border-color)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-medium mb-2">
            Welcome Back
          </h1>
          <p className="text-xs text-[var(--text-muted)] tracking-wider uppercase">Login to your MEGZO account</p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-0 border border-[var(--border-color)] mb-8">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition duration-200 ${
              role === 'customer'
                ? 'bg-[var(--text-primary)] text-[var(--bg-color)]'
                : 'text-[var(--text-primary)] hover:bg-[var(--accent-bg-light)]'
            }`}
            style={{ borderRadius: '0px' }}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition duration-200 ${
              role === 'seller'
                ? 'bg-[var(--text-primary)] text-[var(--bg-color)]'
                : 'text-[var(--text-primary)] hover:bg-[var(--accent-bg-light)]'
            }`}
            style={{ borderRadius: '0px' }}
          >
            Seller
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
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
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
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
            <div className="bg-red-50 dark:bg-red-950/20 text-[var(--error-color)] text-xs font-semibold p-3 border border-[var(--error-color)]/25">
              {error}
            </div>
          )}

          <div className="flex justify-end text-xs">
            <a href="#" className="text-[var(--text-secondary)] font-semibold hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-custom py-3.5 mt-2 text-xs tracking-wider uppercase font-semibold"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-xs text-[var(--text-muted)] tracking-wider uppercase mt-4">
            New to Megzo?{' '}
            <Link to="/signup" className="text-[var(--text-secondary)] font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
