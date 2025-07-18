import type { FC, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NikitaProps {
  children: ReactNode;
}

const Nikita: FC<NikitaProps> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "nikita" ? children : null;
};

export default Nikita;
