import { type FC } from "react";
import { motion } from "framer-motion";
import clsx from "clsx/lite";

export interface Floatable {
  accent: boolean;
  key: number;
  label: string;
  x: number;
  y: number;
}

export interface FloatableTextProps extends Floatable {
  onComplete: () => void;
}

const FloatableText: FC<FloatableTextProps> = ({
  x,
  y,
  label,
  accent,
  onComplete,
}) => (
  <motion.div
    initial={{ opacity: 1, y: 0, scale: accent ? 2 : 1 }}
    animate={{ opacity: 0, y: -150, scale: accent ? 3 : 1.5 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 2, ease: "easeOut" }}
    className={clsx(
      "absolute pointer-events-none font-bold text-2xl",
      accent ? "text-green-500" : "text-white"
    )}
    style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    onAnimationComplete={onComplete}
  >
    {label}
  </motion.div>
);

export { FloatableText };
