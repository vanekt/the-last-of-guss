import { useRef, useEffect, useCallback } from "react";
import { roundsAPI } from "@/core/api";
import { useMutation } from "@tanstack/react-query";

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

  const tapMutation = useMutation({
    mutationFn: async () => {
      const tapsToProcess = pendingTaps.current;
      pendingTaps.current = 0;
      roundsAPI.tapBatch(roundId, tapsToProcess);
    },
  });

  const addTaps = useCallback(() => {
    pendingTaps.current++;
    if (pendingTaps.current >= maxBatchSize) {
      tapMutation.mutate();
    }
  }, [pendingTaps, tapMutation.mutate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingTaps.current < 1) {
        return;
      }

      tapMutation.mutate();
    }, batchTimeout);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    addTaps,
  };
};
