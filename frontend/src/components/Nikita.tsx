import type { FC, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { isNikita } from "@shared/helpers";

interface NikitaProps {
  children: ReactNode;
}

const Nikita: FC<NikitaProps> = ({ children }) => {
  const { user } = useAuth();
  return user && isNikita(user.role) ? children : null;
};

export default Nikita;
