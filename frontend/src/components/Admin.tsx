import React from "react";
import { useAuth } from "../hooks/useAuth";

interface AdminProps {
  children: React.ReactNode;
}

const Admin: React.FC<AdminProps> = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default Admin;
