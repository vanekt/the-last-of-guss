import type { FC } from "react";
import clsx from "clsx/lite";

const LoadingState: FC = () => (
  <div className={clsx("flex", "items-center", "justify-center", "h-30")}>
    <div className={clsx("text-white", "text-xl")}>Загрузка...</div>
  </div>
);

export default LoadingState;
