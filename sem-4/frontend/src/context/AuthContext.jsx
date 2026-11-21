import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create an axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem('tokens');
    return savedTokens ? JSON.parse(savedTokens) : null;
  });
  const [loading, setLoading] = useState(true);

  // Set auth header helper
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Check authentication on load
  useEffect(() => {
    const initializeAuth = async () => {
      if (tokens?.access) {
        setAuthHeader(tokens.access);
        try {
          // Fetch user profile
          const response = await api.get('/auth/profile/');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load profile, attempting token refresh', error);
          if (tokens?.refresh) {
            try {
              const refreshResponse = await axios.post(`${API_URL}/auth/token/refresh/`, {
                refresh: tokens.refresh,
              });
              const newTokens = { ...tokens, access: refreshResponse.data.access };
              setTokens(newTokens);
              localStorage.setItem('tokens', JSON.stringify(newTokens));
              setAuthHeader(newTokens.access);
              
              const profileResponse = await api.get('/auth/profile/');
              setUser(profileResponse.data);
            } catch (refreshError) {
              console.error('Refresh token expired or invalid, logging out', refreshError);
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [tokens?.access]);

  // Login handler
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/token/`, { username, password });
      const tokenData = response.data;
      setTokens(tokenData);
      localStorage.setItem('tokens', JSON.stringify(tokenData));
      setAuthHeader(tokenData.access);
      
      const profileResponse = await api.get('/auth/profile/');
      setUser(profileResponse.data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.detail || 'Invalid credentials or connection error',
      };
    }
  };

  // Register handler
  const register = async (username, email, password, firstName, lastName) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register/`, {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      setLoading(false);
      // Auto login after registration
      return await login(username, password);
    } catch (error) {
      setLoading(false);
      const errors = error.response?.data || {};
      let errorMsg = 'Registration failed.';
      if (typeof errors === 'object') {
        errorMsg = Object.entries(errors)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
          .join('\n');
      }
      return {
        success: false,
        error: errorMsg || 'An error occurred during registration',
      };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('tokens');
    setAuthHeader(null);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const response = await api.patch('/auth/profile/', profileData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Failed to update profile',
      };
    }
  };

  // Axios response interceptor to handle token expiry dynamically
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && tokens?.refresh) {
          originalRequest._retry = true;
          try {
            const refreshRes = await axios.post(`${API_URL}/auth/token/refresh/`, {
              refresh: tokens.refresh,
            });
            const newTokens = { ...tokens, access: refreshRes.data.access };
            setTokens(newTokens);
            localStorage.setItem('tokens', JSON.stringify(newTokens));
            setAuthHeader(newTokens.access);
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
            return api(originalRequest);
          } catch (refreshErr) {
            logout();
            return Promise.reject(refreshErr);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [tokens]);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
