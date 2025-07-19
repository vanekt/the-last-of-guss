import type { FC } from "react";
import clsx from "clsx/lite";

const ErrorState: FC = () => (
  <div className={clsx("flex", "items-center", "justify-center", "h-30")}>
    <div className={clsx("text-white", "text-xl")}>Ошибка</div>
  </div>
);

export default ErrorState;
