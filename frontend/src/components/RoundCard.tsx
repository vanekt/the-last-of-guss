import { Clock } from "lucide-react";
import clsx from "clsx/lite";
import type { RoundWithStatus } from "@shared/types";
import { formatDate, formatTime } from "@shared/frontend/helpers/rounds";
import { getStatusInfo } from "@/utils/getStatusInfo";
import { useRoundTimer } from "@/hooks/useRoundTimer";

interface Props {
  round: RoundWithStatus;
  onClick: () => void;
  onTimeout: () => void;
}

const RoundCard: React.FC<Props> = ({ round, onClick, onTimeout }) => {
  const status = round.status.value;
  const timeLeft = useRoundTimer({
    initTimeLeft: round.status.timer,
    disabled: status === "finished",
    onTimeout,
  });

  const statusInfo = getStatusInfo(round.status?.value);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white/10",
        "backdrop-blur-lg",
        "rounded-xl",
        "p-6",
        "border",
        "border-white/20",
        "hover:border-purple-400/50",
        "cursor-pointer",
        "transition-all",
        "transform",
        "hover:shadow-2xl"
      )}
    >
      <div className={clsx("flex", "items-start", "justify-between")}>
        <div className={clsx("space-y-2", "max-w-full", "w-full")}>
          <div className={clsx("flex", "items-center", "space-x-3")}>
            <div
              className={clsx(
                "w-3",
                "h-3",
                "rounded-full",
                statusInfo.bgColorAlt,
                "shrink-0",
                "hidden",
                "sm:inline"
              )}
            ></div>
            <h3
              className={clsx(
                "text-white",
                "font-mono",
                "text-sm",
                "flex",
                "flex-col",
                "gap-0",
                "sm:flex-row",
                "sm:gap-2",
                "max-w-full"
              )}
            >
              <span>Round ID:</span>
              <span className={clsx("truncate")}>{round.id}</span>
            </h3>
          </div>
          <div className={clsx("space-y-1", "text-gray-300", "text-sm")}>
            <div>
              <span className={clsx("text-gray-400")}>Start:</span>{" "}
              {formatDate(round.startTime)}
            </div>
            <div>
              <span className={clsx("text-gray-400")}>End:</span>{" "}
              {formatDate(round.endTime)}
            </div>
          </div>
          <div className={clsx("border-t", "border-white/10", "my-4")}></div>
          <div className={clsx("flex", "items-center", "justify-between")}>
            <div
              className={clsx(
                "flex",
                "items-center",
                "space-x-2",
                "px-3",
                "py-1",
                "rounded-full",
                statusInfo.bgColor
              )}
            >
              <StatusIcon className={clsx("w-4", "h-4", statusInfo.color)} />
              <span
                className={clsx("text-sm", "font-medium", statusInfo.color)}
              >
                Статус: {statusInfo.title}
              </span>
            </div>

            {timeLeft && status !== "finished" ? (
              <div className={clsx("text-purple-400", "flex", "space-x-2")}>
                <Clock className={clsx("w-5", "h-5")} />
                <span className={clsx("font-mono", "text-sm")}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundCard;
