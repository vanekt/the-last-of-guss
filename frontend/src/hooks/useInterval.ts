import { useEffect } from "react";

interface IntervalConfig {
  delay?: number;
  disabled: boolean;
  callback: () => void;
}

export function useInterval({ delay, disabled, callback }: IntervalConfig) {
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
