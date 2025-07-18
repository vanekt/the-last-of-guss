import type { FC, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AdminProps {
  children: ReactNode;
}

const Admin: FC<AdminProps> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "admin" ? children : null;
};

export default Admin;
