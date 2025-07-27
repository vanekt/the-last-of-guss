import { useCallback } from "react";
import { useTapBatching } from "@/hooks/useTapBatching";

export function useHandleTap({
  disabled,
  roundId,
  callback,
}: {
  disabled: boolean;
  roundId: string;
  callback: () => void;
}) {
  const { addTaps } = useTapBatching({ roundId });

  return useCallback(() => {
    if (disabled) {
      return;
    }

    addTaps();
    callback();
  }, [disabled, addTaps, callback]);
}
