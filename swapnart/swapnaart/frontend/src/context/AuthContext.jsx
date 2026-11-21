import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default axios header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  const loadUserProfile = async (jwtToken) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      const res = await axios.get('/api/auth/profile');
      setUser(res.data);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load user profile', e);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      loadUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token: jwtToken, user: userData } = res.data;
      
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (name, email, password, phone, profile = {}) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, phone, ...profile });
      const { token: jwtToken, user: userData } = res.data;
      
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setLoading(false);
  };

  const updateLanguage = async (lang) => {
    if (!user) return;
    try {
      // Mock local language update or save to db
      setUser(prev => ({ ...prev, language: lang }));
    } catch (error) {
      console.error('Failed to update language', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
