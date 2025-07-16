import axios from "axios";
import type { User } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AuthResponse {
  token: string;
  user: User;
}

interface VerifyResponse {
  user: User;
}

export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", {
      username,
      password,
    });
    return response.data;
  },

  verify: async (): Promise<VerifyResponse> => {
    const response = await api.post<VerifyResponse>("/auth/verify");
    return response.data;
  },
};
