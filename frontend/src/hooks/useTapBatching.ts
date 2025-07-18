import { useRef, useEffect } from "react";
import { roundsAPI } from "@/services/api";
import type { TapResponse } from "@shared/types";

interface UseTapBatchingOptions {
  roundId: string;
  batchTimeout?: number;
  maxBatchSize?: number;
  active?: boolean;
  onSuccess?: (response: TapResponse) => void;
  onError?: (error: any) => void;
}

export const useTapBatching = ({
  roundId,
  batchTimeout = 300,
  maxBatchSize = 10,
  active = true,
  onSuccess,
  onError,
}: UseTapBatchingOptions) => {
  const pendingTaps = useRef<number>(0);

  async function processBatch() {
    const tapsToProcess = pendingTaps.current;
    pendingTaps.current = 0;

    console.log("batch", tapsToProcess);

    try {
      const response = await roundsAPI.tapBatch(roundId, tapsToProcess);
      onSuccess?.(response);
    } catch (error) {
      console.error("Error processing batch taps:", error);
      onError?.(error);
    }
  }

  function addTap() {
    pendingTaps.current++;
    console.log(pendingTaps.current); // TODO удалить

    if (pendingTaps.current >= maxBatchSize) {
      processBatch();
    }
  }

  useEffect(() => {
    if (!active) {
      return;
    }

    const interval = setInterval(() => {
      if (pendingTaps.current < 1) {
        return;
      }

      processBatch();
    }, batchTimeout);

    return () => {
      clearInterval(interval);
    };
  }, [active]);

  return {
    addTap,
  };
};
