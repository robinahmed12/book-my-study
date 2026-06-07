"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User } from "@/types";
import { authService } from "@/services/api.service";
import { signInWithGoogle, signOutFirebase } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    photoURL?: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ── Fetch current user from API ────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  // ── Initialize auth state ──────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  // ── Login with email/password ──────────────────────────
  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}!`);
    router.push("/");
  };

  // ── Register with email/password ───────────────────────
  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    photoURL?: string;
  }) => {
    const data = await authService.register(formData);
    setUser(data.user);
    toast.success("Account created! Welcome to StudyNook!");
    router.push("/");
  };

  // ── Google OAuth ───────────────────────────────────────
  const loginWithGoogle = async () => {
    const googleUser = await signInWithGoogle();
    const data = await authService.googleAuth(googleUser);
    setUser(data.user);
    toast.success(`Welcome, ${data.user.name}!`);
    router.push("/");
  };

  // ── Logout ─────────────────────────────────────────────
  const logout = async () => {
    await authService.logout();
    await signOutFirebase().catch(() => {}); // Ignore firebase signout errors
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
