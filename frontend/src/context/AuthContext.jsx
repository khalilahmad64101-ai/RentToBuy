import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, fetchCSRFToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rent2buy_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [driverData, setDriverData] = useState({
    applications: [],
    agreements: [],
    payments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize secure CSRF keys on app load
  useEffect(() => {
    fetchCSRFToken();
  }, []);

  // Fetch all related driver dashboard data
  const syncDriverData = useCallback(async (emailAddress) => {
    if (!emailAddress) return;
    try {
      const data = await api.auth.getDriverData(emailAddress);
      setDriverData({
        applications: data.applications || [],
        agreements: data.agreements || [],
        payments: data.payments || [],
      });
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('rent2buy_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.error('Failed to sync driver record folders:', err.message);
    }
  }, []);

  // Check state updates on startup
  useEffect(() => {
    if (user?.email) {
      syncDriverData(user.email).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.email, syncDriverData]);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await api.auth.login(credentials);
      setUser(response.user);
      localStorage.setItem('rent2buy_user', JSON.stringify(response.user));
      await syncDriverData(response.user.email);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signup = async (userData) => {
    setError(null);
    try {
      const response = await api.auth.signup(userData);
      setUser(response.user);
      localStorage.setItem('rent2buy_user', JSON.stringify(response.user));
      await syncDriverData(response.user.email);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyAndSignup = async (email, otpCode) => {
    setError(null);
    try {
      const response = await api.auth.verifySignupOTP({ email, otpCode });
      setUser(response.user);
      localStorage.setItem('rent2buy_user', JSON.stringify(response.user));
      await syncDriverData(response.user.email);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const googleLogin = async (credentialToken) => {
    setError(null);
    try {
      const response = await api.auth.googleLogin(credentialToken);
      setUser(response.user);
      localStorage.setItem('rent2buy_user', JSON.stringify(response.user));
      await syncDriverData(response.user.email);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.warn('Backend logout warning:', err.message);
    } finally {
      setUser(null);
      setDriverData({
        applications: [],
        agreements: [],
        payments: [],
      });
      localStorage.removeItem('rent2buy_user');
    }
  };

  const updateProfile = async (profileUpdate) => {
    setError(null);
    try {
      const response = await api.auth.updateProfile(profileUpdate);
      setUser(response.user);
      localStorage.setItem('rent2buy_user', JSON.stringify(response.user));
      await syncDriverData(response.user.email);
      return response.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        driverData,
        loading,
        error,
        login,
        signup,
        verifyAndSignup,
        googleLogin,
        logout,
        updateProfile,
        syncDriverData: () => syncDriverData(user?.email),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be wrapped in your <AuthProvider> tag');
  }
  return context;
}
