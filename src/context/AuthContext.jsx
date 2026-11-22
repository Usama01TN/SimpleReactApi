import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [authReady, setAuthReady] = useState(false);

  const saveSession = useCallback((session) => {
    localStorage.setItem('token', session.token);
    localStorage.setItem('userId', session.userId);
    localStorage.setItem('user', JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      if (!token) {
        setAuthReady(true);
        return;
      }
      const id = localStorage.getItem('userId') || user?._id || user?.id;
      if (!id) {
        clearSession();
        setAuthReady(true);
        return;
      }
      try {
        const { data } = await api.get(`/users/${id}`);
        if (!active) return;
        const safeUser = { ...data, _id: data._id || id };
        localStorage.setItem('user', JSON.stringify(safeUser));
        setUser(safeUser);
      } catch {
        if (active) clearSession();
      } finally {
        if (active) setAuthReady(true);
      }
    }
    restoreSession();
    return () => { active = false; };
    // Session restoration should run once for the session present at app startup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(async (credentials) => {
    const { data } = await api.post('/users/signin', credentials);
    const safeUser = data.user || {
      _id: data.userId,
      name: data.name,
      email: data.email || credentials.email,
      role: data.role,
    };
    saveSession({ token: data.token, userId: data.userId || safeUser._id, user: safeUser });
    return safeUser;
  }, [saveSession]);

  const signUp = useCallback(async (details) => {
    const { data } = await api.post('/users/signup', details);
    return data;
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (token) await api.post('/users/logout');
    } catch (error) {
      // Clear local credentials even if the server is unavailable during logout.
      console.warn(getErrorMessage(error, 'Server logout failed.'));
    } finally {
      clearSession();
    }
  }, [clearSession, token]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    authReady,
    signIn,
    signUp,
    signOut,
  }), [user, token, authReady, signIn, signUp, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
