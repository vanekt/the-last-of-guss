import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/mutations/auth";

const LogoutPage: FC = () => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogoutMutation(() => navigate("/"));

  useEffect(() => {
    logout();
  }, [logout]);

  return null;
};

export default LogoutPage;
