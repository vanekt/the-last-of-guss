import type { FC, ReactNode } from "react";
import { useAtomValue } from "jotai";
import { userRoleAtom } from "@/store/authAtoms";

interface AdminProps {
  children: ReactNode;
}

const Admin: FC<AdminProps> = ({ children }) => {
  const role = useAtomValue(userRoleAtom);
  return role === "admin" ? children : null;
};

export default Admin;
