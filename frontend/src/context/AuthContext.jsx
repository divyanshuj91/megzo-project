import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateProfileApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session on load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('kelna_cart'); // Clear cart on logout
  };

  const updateProfile = async ({ name, address, contactNumber, location, profilePicture }) => {
    if (!user) throw new Error('Not logged in');
    try {
      const result = await updateProfileApi(user.id, { name, address, contactNumber, location, profilePicture });
      if (result && result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return result.user;
      }
    } catch (err) {
      console.warn('API error, saving profile update locally:', err);
      // Local fallback
      const updatedUser = {
        ...user,
        name: name !== undefined ? name : user.name,
        address: address !== undefined ? address : user.address,
        contact_number: contactNumber !== undefined ? contactNumber : user.contact_number,
        location: location !== undefined ? location : user.location,
        profile_picture: profilePicture !== undefined ? profilePicture : user.profile_picture
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error('Failed to update profile');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
