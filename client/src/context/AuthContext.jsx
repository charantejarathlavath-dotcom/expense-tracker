import { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Restore the session on page load if a token is already stored
  // (e.g. after a refresh) by fetching the current user.
  useEffect(() => {
    let cancelled = false;
    async function restore() {
      if (api.getToken()) {
        try {
          const res = await api.getMe();
          if (!cancelled) setUser(res.user);
        } catch {
          api.setToken(null);
        }
      }
      if (!cancelled) setReady(true);
    }
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const doLogin = useCallback(async (email, password) => {
    const res = await api.login({ email, password });
    api.setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const doRegister = useCallback(async (email, password, name) => {
    const res = await api.register({ email, password, name });
    api.setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login: doLogin, register: doRegister, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
