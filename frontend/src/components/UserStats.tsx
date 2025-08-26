import { memo } from "react";
import { Trophy, Target } from "lucide-react";
import clsx from "clsx/lite";

interface Props {
  taps: number;
  score: number;
}

const UserStats: React.FC<Props> = memo(({ taps, score }) => (
  <div className={clsx("grid", "grid-cols-1", "sm:grid-cols-2", "gap-4")}>
    <div className={clsx("bg-white/5", "rounded-lg", "p-4")}>
      <div
        className={clsx(
          "flex",
          "items-center",
          "justify-center",
          "space-x-2",
          "text-blue-400"
        )}
      >
        <Target className={clsx("w-5", "h-5")} />
        <span className={clsx("font-medium")}>Мои тапы</span>
      </div>
      <div className={clsx("text-2xl", "font-bold", "text-white")}>{taps}</div>
    </div>
    <div className={clsx("bg-white/5", "rounded-lg", "p-4")}>
      <div
        className={clsx(
          "flex",
          "items-center",
          "justify-center",
          "space-x-2",
          "text-purple-400"
        )}
      >
        <Trophy className={clsx("w-5", "h-5")} />
        <span className={clsx("font-medium")}>Мои очки</span>
      </div>
      <div className={clsx("text-2xl", "font-bold", "text-white")}>{score}</div>
    </div>
  </div>
));

export default UserStats;
