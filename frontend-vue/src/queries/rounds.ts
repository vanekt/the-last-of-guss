import { toValue, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { RoundWithStatus, RoundStats, RoundWinner } from "@shared/types";
import { roundsAPI } from "@/core/api";

export const useRoundsQuery = () => {
  return useQuery({
    queryKey: ["rounds"],
    queryFn: roundsAPI.getRounds,
    select: (data) => data.items,
    refetchInterval: 10000,
  });
};

export const useRoundQuery = (id: string) => {
  return useQuery<RoundWithStatus>({
    queryKey: ["round", id],
    queryFn: () => roundsAPI.getRound(id),
    enabled: () => !!toValue(id),
    refetchInterval: ({ state }) => {
      const { data, error } = state;
      if (error || data?.status.value === "finished") {
        return false;
      }
      return data?.status.timer || 1000;
    },
  });
};

export const useRoundStatsQuery = (
  id: string,
  isRoundLoaded: Ref<boolean>,
  roundStatus: Ref<string>,
) => {
  return useQuery<RoundStats>({
    queryKey: ["stats", id, roundStatus],
    queryFn: () => roundsAPI.getStats(id),
    enabled: () =>
      isRoundLoaded.value &&
      ["active", "finished"].includes(toValue(roundStatus)),
    initialData: { taps: 0, score: 0 },
  });
};

export const useRoundWinnerQuery = (
  id: string,
  isRoundLoaded: Ref<boolean>,
  roundStatus: Ref<string>,
) => {
  return useQuery<RoundWinner | null>({
    queryKey: ["winner", id],
    queryFn: () => roundsAPI.getWinner(id),
    enabled: () => isRoundLoaded && toValue(roundStatus) === "finished",
  });
};
