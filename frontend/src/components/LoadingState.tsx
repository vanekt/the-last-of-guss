import type { FC } from "react";
import { LoaderCircle } from "lucide-react";
import clsx from "clsx/lite";

const LoadingState: FC = () => (
  <div
    className={clsx(
      "flex",
      "items-center",
      "justify-center",
      "fixed",
      "top-0",
      "left-0",
      "h-screen",
      "w-screen",
      "pointer-events-none"
    )}
  >
    <LoaderCircle className="animate-spin text-white w-12 h-12 opacity-50" />
  </div>
);

export default LoadingState;
