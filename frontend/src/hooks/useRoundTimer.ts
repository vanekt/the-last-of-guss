import { useEffect, useState } from "react";

export function useRoundTimer({
  initTimeLeft,
  disabled,
  onTimeout,
}: {
  initTimeLeft: number;
  disabled: boolean;
  onTimeout: () => void;
}): number {
  const [timeLeft, setTimeLeft] = useState(initTimeLeft);

  useEffect(() => {
    setTimeLeft(initTimeLeft);
  }, [initTimeLeft]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newVal = prev - 1000;

        if (newVal < 0) {
          onTimeout();
          return 0;
        }

        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disabled, onTimeout]);

  return timeLeft;
}
