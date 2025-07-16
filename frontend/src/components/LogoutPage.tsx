import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
