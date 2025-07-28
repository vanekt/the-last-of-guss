import type { FC, ReactNode } from "react";
import { useAtomValue } from "jotai";
import { isNikita } from "@shared/helpers";
import { userRoleAtom } from "@/store/authAtoms";

interface NikitaProps {
  children: ReactNode;
}

const Nikita: FC<NikitaProps> = ({ children }) => {
  const role = useAtomValue(userRoleAtom);
  return isNikita(role) ? children : null;
};

export default Nikita;
