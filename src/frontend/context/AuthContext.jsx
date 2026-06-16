import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function register(name, email, password) {
    const res = await api.post("/api/auth/register", { name, email, password });
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data.user;
  }

  async function login(email, password) {
    const res = await api.post("/api/auth/login", { email, password });
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data.user;
  }

  async function logout() {
    await api.post("/api/auth/logout");
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
