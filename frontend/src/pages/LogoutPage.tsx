import { useEffect, type FC } from "react";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { logoutAtom } from "@/store/authAtoms";

const LogoutPage: FC = () => {
  const logout = useSetAtom(logoutAtom);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/");
  }, []);

  return null;
};

export default LogoutPage;
