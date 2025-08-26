import type { FC, ReactNode } from "react";
import { useAtomValue } from "jotai";
import { isNikita } from "@shared/helpers";
import { userRoleAtom } from "@/store/authAtoms";

interface Props {
  children: ReactNode;
}

const IfNikita: FC<Props> = ({ children }) => {
  const role = useAtomValue(userRoleAtom);
  return isNikita(role) ? children : null;
};

export default IfNikita;
