import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  // FetchUser function (now gets the 'name' field)
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const { data } = await api.get('/auth/me');
        setUser(data); // data now includes 'name', 'email', 'role', 'team'
      } catch (error) {
        console.error("Failed to fetch user", error);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  // Fixes the ESLint warning
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Stable login function
  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      await fetchUser();
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }, [fetchUser]);

  // Stable signup function (now sends 'name')
  const signup = useCallback(async (name, email, password, role) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password, role });
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      await fetchUser();
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  }, [fetchUser]);

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    signup,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};