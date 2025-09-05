import axios, { AxiosRequestConfig } from "axios";
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

export const createAPI = (
  baseURL: string,
  getToken: () => string | null,
  resetToken: () => void
) => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        resetToken();
      }

      return Promise.reject(error);
    }
  );

  return {
    authAPI: {
      login: (data: LoginRequest): Promise<LoginResponse> =>
        api.post<LoginResponse>("/auth/login", data).then((r) => r.data),

      verify: (): Promise<VerifyResponse> =>
        api.post<VerifyResponse>("/auth/verify").then((r) => r.data),
    },
    roundsAPI: {
      getRounds: (): Promise<RoundsResponse> =>
        api.get<RoundsResponse>("/rounds").then((r) => r.data),

      getRound: (
        id: string,
        config?: AxiosRequestConfig
      ): Promise<RoundWithStatus> =>
        api.get<RoundWithStatus>(`/rounds/${id}`, config).then((r) => r.data),

      createRound: (): Promise<RoundWithStatus> =>
        api.post<RoundWithStatus>("/rounds").then((r) => r.data),

      getStats: (id: string, config?: AxiosRequestConfig) =>
        api.get<RoundStats>(`/rounds/${id}/stats`, config).then((r) => r.data),

      getWinner: (id: string, config?: AxiosRequestConfig) =>
        api
          .get<RoundWinner>(`/rounds/${id}/winner`, config)
          .then((r) => r.data),

      tapBatch: (roundId: string, tapCount: number): Promise<TapResponse> =>
        api
          .post(`/rounds/${roundId}/tap/batch`, {
            tapCount,
          })
          .then((r) => r.data),
    },
  };
};
