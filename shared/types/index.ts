export interface User {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

export type UserPayload = Pick<User, "id" | "username" | "role">;

export interface Round {
  id: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  totalTaps: number;
  totalScore: number;
  winnerId: string | null;
  winnerScore: number;
  createdAt: Date;
}

export type RoundStatusValue = "pending" | "active" | "finished";
export interface RoundStatus {
  value: RoundStatusValue;
  timer: number;
}

export interface RoundStats {
  taps: number;
  score: number;
}

export interface RoundWinner {
  username: string;
  score: number;
}
export interface RoundWithStatus extends Round {
  status: RoundStatus;
}

// -------
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  user: UserPayload;
}

export interface VerifyResponse {
  user: UserPayload;
}

export interface RoundsResponse {
  items: RoundWithStatus[];
}

export type RoundResponse = RoundWithStatus;
export type RoundStatsResponse = RoundStats;
export type RoundWinnerResponse = RoundWinner | null;

export interface TapResponse {
  success: boolean;
  taps: number;
  score: number;
}
export interface TapBatchRequest {
  tapCount: number;
}
