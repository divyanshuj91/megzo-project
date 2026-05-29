import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
      setContact(user.contact_number || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedAddress = address.trim();
    const trimmedContact = contact.trim();

    if (!trimmedAddress && !trimmedContact) {
      setMessage({ text: 'Please fill at least one field', type: 'error' });
      return;
    }

    if (trimmedContact && trimmedContact.length < 10) {
      setMessage({ text: 'Contact number must be at least 10 characters', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await updateProfile(trimmedAddress, trimmedContact);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => {
        setMessage({ text: '', type: '' });
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Error updating profile', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[60] animate-fade-in">
      <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl p-8 w-full max-w-md relative shadow-2xl mx-4">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Logged in as {user.name} ({user.role})</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Email Address</label>
            <input 
              type="text" 
              value={user.email} 
              disabled 
              className="form-input bg-gray-100/50 text-gray-500 cursor-not-allowed border-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
              rows="3"
              placeholder="Enter your shipping address"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Contact Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="form-input"
              placeholder="Enter your phone number"
            />
          </div>

          {message.text && (
            <div className={`text-center font-semibold text-sm py-2 px-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-custom mt-2 w-full"
          >
            {submitting ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
