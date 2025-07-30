import { useRef, useEffect, useCallback } from "react";
import { useTapBatchMutation } from "@/mutations/rounds";

interface UseTapBatchingOptions {
  roundId: string;
  batchTimeout?: number;
  maxBatchSize?: number;
}

export const useTapBatching = ({
  roundId,
  batchTimeout = 300,
  maxBatchSize = 10,
}: UseTapBatchingOptions) => {
  const pendingTaps = useRef<number>(0);
  const { mutate } = useTapBatchMutation(roundId);

  const addTaps = useCallback(() => {
    pendingTaps.current++;
    if (pendingTaps.current >= maxBatchSize) {
      mutate(pendingTaps.current);
      pendingTaps.current = 0;
    }
  }, [pendingTaps, mutate, maxBatchSize]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingTaps.current < 1) {
        return;
      }

      mutate(pendingTaps.current);
      pendingTaps.current = 0;
    }, batchTimeout);

    return () => {
      clearInterval(interval);
    };
  }, [batchTimeout, mutate]);

  return {
    addTaps,
  };
};
