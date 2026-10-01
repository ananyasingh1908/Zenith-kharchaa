import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup, getMe, logout as apiLogout } from '../api/authApi';
import { mockStore } from '../api/mockStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => mockStore.getUser());
  const [token, setToken] = useState(() => mockStore.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        if (token) {
          const data = await getMe();
          setUser(data.user);
        }
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, [token]);

  const login = useCallback(async (credentials) => {
    const res = await apiLogin(credentials);
    setUser(res.user);
    setToken(res.token);
    return res;
  }, []);

  const signup = useCallback(async (details) => {
    const res = await apiSignup(details);
    setUser(res.user);
    setToken(res.token);
    return res;
  }, []);

  const tryDemo = useCallback(async () => {
    const demoUser = {
      id: 'demo-user',
      name: 'Ananya',
      email: 'ananya@kharcha.app',
      avatarUrl: '',
      role: 'Mindful Spender',
    };
    mockStore.setUser(demoUser);
    mockStore.setToken('demo-token-active');
    setUser(demoUser);
    setToken('demo-token-active');
    return { user: demoUser, token: 'demo-token-active' };
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login,
        signup,
        tryDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}
