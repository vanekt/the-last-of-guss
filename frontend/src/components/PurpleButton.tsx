import type { FC, ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx/lite";

interface PurpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: ReactNode;
}

const PurpleButton: FC<PurpleButtonProps> = ({ title, icon, ...rest }) => (
  <button
    className={clsx(
      "w-full",
      "py-3",
      "px-4",
      "bg-gradient-to-r",
      "from-purple-600",
      "to-pink-600",
      "text-white",
      "font-semibold",
      "rounded-lg",
      "hover:from-purple-700",
      "hover:to-pink-700",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-purple-500",
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
      "transition-all",
      "transform",
      "hover:scale-105",
      "hover:cursor-pointer"
    )}
    {...rest}
  >
    {icon}
    <span>{title}</span>
  </button>
);

export default PurpleButton;
