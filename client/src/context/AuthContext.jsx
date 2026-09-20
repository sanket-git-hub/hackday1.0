import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const exchangeToken = useCallback(async (supabaseSession) => {
    if (!supabaseSession) {
      setToken(null);
      localStorage.removeItem("token");
      return;
    }

    try {
      const res = await fetch("/api/auth/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseSession.access_token}`,
        },
      });

      if (!res.ok) throw new Error("Token exchange failed");

      const data = await res.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setRole(data.user.role);
    } catch (err) {
      console.error(err);
      setToken(null);
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role ?? null);
      exchangeToken(session).finally(() => setLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role ?? null);
      exchangeToken(session);
    });

    return () => subscription.unsubscribe();
  }, [exchangeToken]);

  const getAuthHeader = useCallback(() => {
    if (token) return { Authorization: `Bearer ${token}` };
    return {};
  }, [token]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        token,
        loading,
        isCounselor: role === "counselor",
        isStudent: role === "student",
        getAuthHeader,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
