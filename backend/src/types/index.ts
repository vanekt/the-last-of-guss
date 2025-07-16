export interface User {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

export type UserPayload = Pick<User, "id" | "username" | "role">;
