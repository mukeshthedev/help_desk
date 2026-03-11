import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token === 'admin-token-helpdesk-2024') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('admin_token', token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}