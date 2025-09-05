import { toValue, type MaybeRefOrGetter } from "vue";
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
    queryFn: ({ signal }) => roundsAPI.getRound(id, { signal }),
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
  roundStatus: MaybeRefOrGetter<string | undefined>,
) => {
  return useQuery<RoundStats>({
    queryKey: ["stats", id, roundStatus],
    queryFn: ({ signal }) => roundsAPI.getStats(id, { signal }),
    enabled: () =>
      ["active", "finished"].includes(String(toValue(roundStatus))),
    initialData: { taps: 0, score: 0 },
  });
};

export const useRoundWinnerQuery = (
  id: string,
  roundStatus: MaybeRefOrGetter<string | undefined>,
) => {
  return useQuery<RoundWinner | null>({
    queryKey: ["winner", id],
    queryFn: ({ signal }) => roundsAPI.getWinner(id, { signal }),
    enabled: () => toValue(roundStatus) === "finished",
  });
};
