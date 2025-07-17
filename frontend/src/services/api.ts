import axios from "axios";
import type { RoundWithStatus, User } from "@shared/types";

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
    const { data } = await api.post<AuthResponse>("/auth/login", {
      username,
      password,
    });

    return data;
  },

  verify: async (): Promise<VerifyResponse> => {
    const { data } = await api.post<VerifyResponse>("/auth/verify");
    return data;
  },
};

interface RoundsResponse {
  items: RoundWithStatus[];
}

export const roundsAPI = {
  getRounds: async (): Promise<RoundsResponse> => {
    const { data } = await api.get<RoundsResponse>("/api/rounds");
    return data;
  },

  getRound: async (id: string): Promise<RoundWithStatus> => {
    const { data } = await api.get<RoundWithStatus>(`/api/rounds/${id}`);
    return data;
  },

  createRound: async (): Promise<RoundWithStatus> => {
    const { data } = await api.post<RoundWithStatus>("/api/rounds");
    return data;
  },
};
