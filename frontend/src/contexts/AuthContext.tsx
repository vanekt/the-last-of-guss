import React, { createContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { User } from "@shared/types";
import { authAPI } from "@/services/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await authAPI.verify();
      return data.user;
    },
    retry: false,
  });

  useEffect(() => {
    if (!error) {
      return;
    }

    const e = error as AxiosError;
    if (e.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [error, navigate]);

  const login = async (username: string, password: string) => {
    const response = await authAPI.login(username, password);
    localStorage.setItem("token", response.token);
    queryClient.setQueryData(["user"], response.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user: data ?? null, login, logout, loading: isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
