import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Mail, MapPin, Phone, Home, User } from 'lucide-react';

export default function ProfileDashboard() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAddress(user.address || '');
      setContactNumber(user.contact_number || '');
      setLocation(user.location || '');
      setProfilePicture(user.profile_picture || '');
    }
  }, [user]);

  if (!user) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Canvas compression
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setProfilePicture(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedContact = contactNumber.trim();
    const trimmedLocation = location.trim();

    if (!trimmedName) {
      setMessage({ text: 'Name cannot be empty', type: 'error' });
      return;
    }

    if (trimmedContact && trimmedContact.length < 10) {
      setMessage({ text: 'Contact number must be at least 10 characters', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await updateProfile({
        name: trimmedName,
        address: trimmedAddress,
        contactNumber: trimmedContact,
        location: trimmedLocation,
        profilePicture: profilePicture
      });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.message || 'Error updating profile', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-6 pt-28 pb-12 min-h-screen fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-medium mb-8">Visitor Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Avatar & Overview */}
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="glass-card w-full p-6 text-center flex flex-col items-center border border-[var(--border-color)]">
              
              {/* Picture Frame */}
              <div className="relative w-32 h-32 mb-6 group border border-[var(--border-color)]" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--bg-color)] flex items-center justify-center text-[var(--text-muted)]">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h2 className="text-lg font-serif font-semibold mb-1 text-[var(--text-primary)]">{user.name}</h2>
              <span className="text-[10px] tracking-wider uppercase font-bold text-[var(--text-secondary)] px-2 py-0.5 border border-[var(--border-color)]">
                {user.role}
              </span>

              <div className="w-full border-t border-[var(--border-color)] mt-6 pt-4 flex flex-col gap-3 text-left text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.contact_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{user.contact_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="flex-1">
            <div className="glass-card p-8 border border-[var(--border-color)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-6 border-b border-[var(--border-color)] pb-3">
                Update Profile Info
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Location
                  </label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    <Home className="w-3.5 h-3.5" />
                    Full Shipping Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your street address, postal code etc."
                    className="form-input resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    Mobile Number
                  </label>
                  <input 
                    type="tel" 
                    value={contactNumber} 
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +91 9999999999"
                    className="form-input"
                  />
                </div>

                {message.text && (
                  <div className={`text-xs font-semibold p-3 border ${
                    message.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-950/20 text-green-600 border-green-600/25' 
                      : 'bg-red-50 dark:bg-red-950/20 text-[var(--error-color)] border-[var(--error-color)]/25'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-custom py-3.5 text-xs font-bold tracking-wider uppercase"
                >
                  {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
