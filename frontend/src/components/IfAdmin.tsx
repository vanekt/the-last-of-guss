import type { FC, ReactNode } from "react";
import { useAtomValue } from "jotai";
import { userRoleAtom } from "@/store/authAtoms";

interface Props {
  children: ReactNode;
}

const IfAdmin: FC<Props> = ({ children }) => {
  const role = useAtomValue(userRoleAtom);
  return role === "admin" ? children : null;
};

export default IfAdmin;
