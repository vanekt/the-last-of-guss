import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      logout();
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, []);

  return null;
};

export default LogoutPage;
