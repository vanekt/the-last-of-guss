import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roundsAPI } from "@/core/api";
import type { RoundWithStatus, TapResponse } from "@shared/types";

export const useCreateRoundMutation = (
  onSuccess?: (data: RoundWithStatus) => void,
  onError?: (error: Error) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roundsAPI.createRound,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
      onSuccess?.(data);
      return data;
    },
    onError,
  });
};

export const useTapBatchMutation = (roundId: string) => {
  return useMutation({
    mutationFn: async (tapCount: number): Promise<TapResponse> => {
      return roundsAPI.tapBatch(roundId, tapCount);
    },
  });
};
