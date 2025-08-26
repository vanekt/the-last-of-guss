import { memo } from "react";
import { Clock } from "lucide-react";
import clsx from "clsx/lite";
import { formatTime } from "@shared/frontend/helpers/rounds";

interface Props {
  value?: number;
}

const RoundTimer: React.FC<Props> = memo(({ value }) => (
  <div
    className={clsx(
      "flex",
      "items-center",
      "justify-center",
      "space-x-2",
      "text-purple-200"
    )}
  >
    <Clock className={clsx("w-5", "h-5")} />
    <span className={clsx("text-xl", "font-mono")}>{formatTime(value)}</span>
  </div>
));

export default RoundTimer;
