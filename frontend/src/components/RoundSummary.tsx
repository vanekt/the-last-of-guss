import clsx from "clsx/lite";
import type { RoundWinner } from "@shared/types";

interface Props {
  totalTaps: number;
  totalScore: number;
  winner?: RoundWinner | null;
}

const RoundSummary: React.FC<Props> = ({ totalTaps, totalScore, winner }) => (
  <div className={clsx("border-t", "border-white/10", "space-y-4", "pt-4")}>
    <h3 className={clsx("text-lg", "font-semibold", "text-white")}>
      Статистика раунда
    </h3>
    <div
      className={clsx(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-3",
        "gap-4",
        "text-sm"
      )}
    >
      <div className={clsx("bg-white/5", "rounded-lg", "p-3")}>
        <div className={clsx("text-gray-400")}>Всего тапов</div>
        <div className={clsx("text-xl", "font-bold", "text-white")}>
          {totalTaps}
        </div>
      </div>
      <div className={clsx("bg-white/5", "rounded-lg", "p-3")}>
        <div className={clsx("text-gray-400")}>Всего очков</div>
        <div className={clsx("text-xl", "font-bold", "text-white")}>
          {totalScore}
        </div>
      </div>
      <div className={clsx("bg-white/5", "rounded-lg", "p-3")}>
        <div className={clsx("text-gray-400")}>Победитель</div>
        <div className={clsx("text-lg", "font-bold", "text-yellow-400")}>
          {winner ? `${winner.username} (${winner.score})` : "Нет"}
        </div>
      </div>
    </div>
  </div>
);

export default RoundSummary;
