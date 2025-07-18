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

export interface RoundStatus {
  status: "pending" | "active" | "finished";
  timeRemaining: number;
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

// TODO сюда поместить все типы requestParams, response и т д, которые переиспользуются и на фронте и на бэке
// а лучше в отдельный файл

export interface TapResponse {
  success: boolean;
  taps: number;
  score: number;
}
