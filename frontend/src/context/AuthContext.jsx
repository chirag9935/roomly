/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // was hardcoded false — now reflects a real check

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const { data } = await api.get('/auth/me');
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, []);

  // Called after a successful /auth/login or /auth/signup response.
  // The server has already set the auth cookies — we just need the user in state.
  function login(userData) {
    setUser(userData);
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
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