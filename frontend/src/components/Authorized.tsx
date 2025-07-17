import React from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthorizedProps {
  children: React.ReactNode;
}

const Authorized: React.FC<AuthorizedProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
};

export default Authorized;
