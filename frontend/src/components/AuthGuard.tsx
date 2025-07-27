import { useAtomValue } from "jotai";
import { isVerifyLoadingAtom, userAtom } from "@/store/authAtoms";
import LoadingState from "@/components/LoadingState";
import LoginPage from "@/pages/LoginPage";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const user = useAtomValue(userAtom);
  const isLoading = useAtomValue(isVerifyLoadingAtom);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return children;
};

export default AuthGuard;
