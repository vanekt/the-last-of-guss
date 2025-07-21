import { useEffect } from "react";

interface TimerConfig {
  delay?: number;
  disabled: boolean;
  callback: () => void;
}

export function useTimer({ delay = 1000, disabled, callback }: TimerConfig) {
  useEffect(() => {
    if (disabled) {
      return;
    }

    const interval = setInterval(callback, delay);

    return () => {
      clearInterval(interval);
    };
  }, [delay, disabled, callback]);
}
