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

export type LoginFn = (requestBody: LoginRequest) => Promise<LoginResponse>;
export type VerifyFn = () => Promise<VerifyResponse>;
export type GetRoundsFn = () => Promise<RoundsResponse>;
export type GetRoundFn = (id: string) => Promise<RoundWithStatus>;
export type CreateRoundFn = () => Promise<RoundWithStatus>;
export type GetRoundStatsFn = (id: string) => Promise<RoundStats>;
export type GetRoundWinnerFn = (roundId: string) => Promise<RoundWinner>;
export type TapBatchFn = (
  roundId: string,
  tapCount: number
) => Promise<TapResponse>;

// TODO разделить authAPI и roundsAPI
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

  const login: LoginFn = async (
    requestBody: LoginRequest
  ): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", requestBody);
    return data;
  };

  const verify: VerifyFn = async (): Promise<VerifyResponse> => {
    const { data } = await api.post<VerifyResponse>("/auth/verify");
    return data;
  };

  const getRounds: GetRoundsFn = async () => {
    const { data } = await api.get<RoundsResponse>("/rounds");
    return data;
  };

  const getRound: GetRoundFn = async (id) => {
    const { data } = await api.get<RoundWithStatus>(`/rounds/${id}`);
    return data;
  };

  const createRound: CreateRoundFn = async () => {
    const { data } = await api.post<RoundWithStatus>("/rounds");
    return data;
  };

  const getStats: GetRoundStatsFn = async (id: string): Promise<RoundStats> => {
    const { data } = await api.get<RoundStats>(`/rounds/${id}/stats`);
    return data;
  };

  const getWinner: GetRoundWinnerFn = async (
    id: string
  ): Promise<RoundWinner> => {
    const { data } = await api.get<RoundWinner>(`/rounds/${id}/winner`);
    return data;
  };

  const tapBatch: TapBatchFn = async (
    id: string,
    tapCount: number
  ): Promise<TapResponse> => {
    const { data } = await api.post(`/rounds/${id}/tap/batch`, {
      tapCount,
    });
    return data;
  };

  return {
    authAPI: {
      login,
      verify,
    },
    roundsAPI: {
      getRounds,
      getRound,
      createRound,
      getStats,
      getWinner,
      tapBatch,
    },
  };
};
