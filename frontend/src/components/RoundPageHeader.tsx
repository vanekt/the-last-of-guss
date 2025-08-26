import clsx from "clsx";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import UserMenu from "./UserMenu";

const RoundPageHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={clsx("flex", "justify-between", "items-center")}>
      <button
        onClick={() => navigate("/rounds")}
        className={clsx(
          "flex",
          "items-center",
          "space-x-2",
          "text-gray-400",
          "hover:text-white",
          "transition-colors",
          "cursor-pointer"
        )}
      >
        <ArrowLeft className={clsx("w-5", "h-5")} />
        <span>Раунды</span>
      </button>

      <UserMenu />
    </div>
  );
};

export default RoundPageHeader;
