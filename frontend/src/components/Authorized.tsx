import { useAuth } from "@/hooks/useAuth";

interface AuthorizedProps {
  children: React.ReactNode;
}

const Authorized: React.FC<AuthorizedProps> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : null;
};

export default Authorized;
