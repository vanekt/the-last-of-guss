import axios from "axios";
import type {
  LoginRequest,
  LoginResponse,
  RoundsResponse,
  RoundStats,
  RoundWinner,
  RoundWithStatus,
  TapResponse,
  VerifyResponse,
} from "@shared/types";
import { queryClient } from "./queryClient";

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("token");
      queryClient.setQueryData(["user"], { user: null });
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (requestBody: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", requestBody);
    return data;
  },

  verify: async (): Promise<VerifyResponse> => {
    const { data } = await api.post<VerifyResponse>("/auth/verify");
    return data;
  },
};

export const roundsAPI = {
  getRounds: async (): Promise<RoundsResponse> => {
    const { data } = await api.get<RoundsResponse>("/rounds");
    return data;
  },

  getRound: async (id: string): Promise<RoundWithStatus> => {
    const { data } = await api.get<RoundWithStatus>(`/rounds/${id}`);
    return data;
  },

  createRound: async (): Promise<RoundWithStatus> => {
    const { data } = await api.post<RoundWithStatus>("/rounds");
    return data;
  },

  getStats: async (roundId: string) => {
    const { data } = await api.get<RoundStats>(`/rounds/${roundId}/stats`);
    return data;
  },

  getWinner: async (roundId: string) => {
    const { data } = await api.get<RoundWinner>(`/rounds/${roundId}/winner`);
    return data;
  },

  tapBatch: async (roundId: string, tapCount: number): Promise<TapResponse> => {
    const { data } = await api.post(`/rounds/${roundId}/tap/batch`, {
      tapCount,
    });
    return data;
  },
};
