import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import api from "../utils/api.js";

const AuthContext = createContext();

const SESSION_SUPERSEDED_CODE = "SESSION_SUPERSEDED";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionVersion, setSessionVersion] = useState(0);
  const isAuthenticatedRef = useRef(false);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const bumpSession = useCallback(() => {
    setSessionVersion((v) => v + 1);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    bumpSession();
  }, [bumpSession]);

  const handleSessionInvalid = useCallback((code) => {
    if (!isAuthenticatedRef.current) return;

    clearSession();

    if (code === SESSION_SUPERSEDED_CODE) {
      toast.error("You were signed out because you signed in on another device or browser.");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?reason=session";
      }
    }
  }, [clearSession]);

  useEffect(() => {
    const onRejected = (error) => {
      const code = error.response?.data?.code;
      const status = error.response?.status;
      const url = error.config?.url ?? "";
      const isAuthRoute =
        url.includes("/api/auth/login") ||
        url.includes("/api/auth/register") ||
        url.includes("/api/auth/forgot-password") ||
        url.includes("/api/auth/reset-password");

      if (status === 401 && isAuthenticatedRef.current && !isAuthRoute) {
        if (code === SESSION_SUPERSEDED_CODE) {
          handleSessionInvalid(code);
        } else {
          clearSession();
        }
      }

      return Promise.reject(error);
    };

    const apiInterceptor = api.interceptors.response.use((res) => res, onRejected);

    return () => {
      api.interceptors.response.eject(apiInterceptor);
    };
  }, [handleSessionInvalid]);

  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
        setIsAuthenticated(true);
        bumpSession();
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, [bumpSession, clearSession]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const verifySession = async () => {
      try {
        await api.get("/api/auth/me");
      } catch (err) {
        if (err.response?.status === 401) {
          const code = err.response?.data?.code;
          if (code === SESSION_SUPERSEDED_CODE) {
            handleSessionInvalid(code);
          } else {
            clearSession();
          }
        }
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        verifySession();
      }
    };

    window.addEventListener("focus", verifySession);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("focus", verifySession);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isAuthenticated, handleSessionInvalid]);

  async function register(name, email, password) {
    const res = await api.post("/api/auth/register", {
      name,
      email: email.trim().toLowerCase(),
      password,
    });
    setUser(res.data.user);
    setIsAuthenticated(true);
    bumpSession();
    return res.data.user;
  }

  async function login(email, password) {
    const res = await api.post("/api/auth/login", { email: email.trim().toLowerCase(), password });
    setUser(res.data.user);
    setIsAuthenticated(true);
    bumpSession();
    return res.data.user;
  }

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } finally {
      clearSession();
    }
  }

  function establishSession(nextUser) {
    setUser(nextUser);
    setIsAuthenticated(true);
    bumpSession();
  }

  async function refreshSession() {
    const res = await api.get("/api/auth/me");
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data.user;
  }

  const isAdmin = user?.role === "Admin";
  const canUseCalendar = isAdmin || user?.calendarEnabled !== false;
  const canUseAnalytics = isAdmin || user?.analyticsEnabled !== false;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      canUseCalendar,
      canUseAnalytics,
      loading,
      sessionVersion,
      login,
      logout,
      register,
      establishSession,
      refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
