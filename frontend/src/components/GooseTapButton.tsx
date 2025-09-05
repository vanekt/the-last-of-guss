import { type FC, type MouseEvent, memo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx/lite";
import { type Floatable, FloatableText } from "@/components/FloatableText";
import styles from "./GooseTapButton.module.css";

interface Props {
  accent: boolean;
  floatableLabel: string;
  disabled: boolean;
  onTap: () => void;
}

const GooseTapButton: FC<Props> = memo(
  ({ accent, floatableLabel, disabled, onTap }) => {
    const [isScaling, setIsScaling] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [floatables, setFloatables] = useState<Floatable[]>([]);

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }

      setIsScaling(true);
      setTimeout(() => setIsScaling(false), 100);

      if (accent) {
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 500);
      }

      onTap();

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setFloatables((prev) => [
        ...prev,
        {
          key: Date.now() + Math.random(),
          x,
          y,
          label: floatableLabel,
          accent,
        },
      ]);
    };

    const handleFloatComplete = (id: number) => {
      setFloatables((prev) => prev.filter((b) => b.key !== id));
    };

    return (
      <div className="relative inline-block select-none">
        <div
          className={clsx(
            "inline-flex transition-transform duration-100",
            isScaling && "scale-125",
            isSpinning && styles.spin,
            disabled && "opacity-50",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={handleClick}
        >
          <div className={clsx("text-9xl")}>🪿</div>
        </div>

        <AnimatePresence>
          {floatables.map((floatable) => (
            <FloatableText
              key={floatable.key}
              label={floatable.label}
              accent={floatable.accent}
              x={floatable.x}
              y={floatable.y}
              onComplete={() => handleFloatComplete(floatable.key)}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

export default GooseTapButton;
