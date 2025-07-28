import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/mutations/auth";

const LogoutPage: FC = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation(() => navigate("/"));

  useEffect(() => {
    logoutMutation.mutate();
  }, []);

  return null;
};

export default LogoutPage;
