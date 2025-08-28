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

  const flush = useCallback(() => {
    if (pendingTaps.current < 1) {
      return;
    }

    mutate(pendingTaps.current);
    pendingTaps.current = 0;
  }, [pendingTaps, mutate]);

  const addTap = useCallback(() => {
    pendingTaps.current++;
    if (pendingTaps.current >= maxBatchSize) {
      flush();
    }
  }, [pendingTaps, maxBatchSize, flush]);

  useEffect(() => {
    const interval = setInterval(flush, batchTimeout);

    return () => {
      clearInterval(interval);
      flush();
    };
  }, [batchTimeout, flush]);

  return {
    addTap,
  };
};
