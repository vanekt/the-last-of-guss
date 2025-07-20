import { createContext, useEffect } from "react";
import type { ReactNode, FC } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { UserPayload } from "@shared/types";
import { authAPI } from "@/api";

interface AuthContextType {
  user?: UserPayload;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authAPI.verify,
    select: (data) => data.user,
    retry: false,
  });

  useEffect(() => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [error, navigate]);

  const login = async (username: string, password: string) => {
    const response = await authAPI.login({ username, password });
    localStorage.setItem("token", response.token);
    queryClient.setQueryData(["user"], { user: response.user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
