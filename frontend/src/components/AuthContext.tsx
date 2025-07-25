import { createContext } from "react";
import type { ReactNode, FC } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserPayload } from "@shared/types";
import { authAPI } from "@/core/api";
import LoadingState from "./LoadingState";

interface AuthContextType {
  user?: UserPayload;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["user"],
    queryFn: authAPI.verify,
    select: (data) => data.user,
    retry: false,
  });

  const login = async (username: string, password: string) => {
    const response = await authAPI.login({ username, password });
    localStorage.setItem("token", response.token);
    queryClient.setQueryData(["user"], { user: response.user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
