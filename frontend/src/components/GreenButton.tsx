import type { FC, ReactNode, ButtonHTMLAttributes } from "react";

interface GreenButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: ReactNode;
}

const GreenButton: FC<GreenButtonProps> = ({ title, icon, ...rest }) => (
  <button
    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 cursor-pointer"
    {...rest}
  >
    {icon}
    <span>{title}</span>
  </button>
);

export default GreenButton;
