import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, UserPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("Please set JWT_SECRET in your .env file.");
  process.exit(1);
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
};

export const getUserRole = (username: string): string => {
  switch (username.toLowerCase()) {
    case "admin":
      return "admin";
    case "никита":
    case "nikita":
      return "nikita";
    default:
      return "survivor";
  }
};
