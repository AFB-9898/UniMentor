import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { mockAuthService } from "../services/authService";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: "student" | "mentor";
    university?: string;
    career?: string;
    specialty?: string[];
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mockAuthService.getCurrentUser().then((u) => {
      setUser(u);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await mockAuthService.login({ email, password });
    setUser(result.user);
  }, []);

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      role: "student" | "mentor";
      university?: string;
      career?: string;
      specialty?: string[];
    }) => {
      const result = await mockAuthService.register(data);
      setUser(result.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    await mockAuthService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
