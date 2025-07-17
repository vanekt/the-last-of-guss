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
export interface RoundWithStatus extends Round {
  status: RoundStatus;
}
