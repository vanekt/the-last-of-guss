import type { FC } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx/lite";
import { useAuth } from "@/hooks/useAuth";

const UserMenu: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className={clsx("flex", "items-center", "space-x-4")}>
      <div className={clsx("flex", "items-center", "space-x-2", "text-white")}>
        <User className={clsx("w-5", "h-5")} />
        <span className={clsx("font-medium")}>{user.username}</span>
        <span
          className={clsx(
            "text-xs",
            "bg-purple-600",
            "px-2",
            "py-1",
            "rounded-full"
          )}
        >
          {user.role}
        </span>
      </div>
      <button
        onClick={() => navigate("/logout")}
        className={clsx(
          "p-2",
          "text-gray-400",
          "hover:text-white",
          "transition-colors",
          "cursor-pointer"
        )}
        title="Выйти"
      >
        <LogOut className={clsx("w-5", "h-5")} />
      </button>
    </div>
  );
};

export default UserMenu;
