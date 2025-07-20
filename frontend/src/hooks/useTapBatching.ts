import { useRef, useEffect } from "react";
import { roundsAPI } from "@/api";
import type { TapResponse } from "@shared/types";
import { useMutation } from "@tanstack/react-query";

interface UseTapBatchingOptions {
  roundId: string;
  batchTimeout?: number;
  maxBatchSize?: number;
  onSuccess?: (response: TapResponse) => void;
  onError?: (error: unknown) => void;
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

  function addTaps() {
    pendingTaps.current++;
    if (pendingTaps.current >= maxBatchSize) {
      tapMutation.mutate();
    }
  }

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
