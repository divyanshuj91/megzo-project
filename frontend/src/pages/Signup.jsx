import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi } from '../services/api';
import { User, Mail, Lock } from 'lucide-react';

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
    <div className="min-h-screen flex justify-center items-center px-4 py-12 pt-28">
      <div className="glass-card max-w-md w-full p-10 border border-[var(--border-color)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-medium mb-2">
            Create Account
          </h1>
          <p className="text-xs text-[var(--text-muted)] tracking-wider uppercase">Sign up to get started with Megzo</p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-0 border border-[var(--border-color)] mb-6">
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
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
              placeholder="Create a password"
              className="form-input"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
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
          <label className="flex items-start gap-2.5 mt-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 border-[var(--border-color)] text-[var(--accent-color)] focus:ring-[var(--accent-color)] h-4 w-4 transition cursor-pointer"
              style={{ borderRadius: '0px' }}
            />
            <span className="text-[var(--text-muted)]">
              I agree to Megzo's <a href="#" className="text-[var(--text-secondary)] font-bold hover:underline">Terms of Use</a> and <a href="#" className="text-[var(--text-secondary)] font-bold hover:underline">Privacy Policy</a>.
            </span>
          </label>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 text-[var(--error-color)] text-xs font-semibold p-3 border border-[var(--error-color)]/25">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs font-semibold p-3 border border-green-600/25">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-custom py-3.5 mt-3 text-xs tracking-wider uppercase font-semibold"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center text-xs text-[var(--text-muted)] tracking-wider uppercase mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--text-secondary)] font-bold hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
