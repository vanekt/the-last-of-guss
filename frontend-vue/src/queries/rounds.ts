import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useArrayIncludes } from "@vueuse/core";
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

export const useRoundQuery = (id: Ref<string>) => {
  return useQuery<RoundWithStatus>({
    queryKey: ["round", id],
    queryFn: ({ signal }) => roundsAPI.getRound(id.value, { signal }),
    enabled: () => !!id.value,
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
  id: Ref<string>,
  roundStatus: Ref<string | undefined>,
) => {
  return useQuery<RoundStats>({
    queryKey: ["stats", id, roundStatus],
    queryFn: ({ signal }) => roundsAPI.getStats(id.value, { signal }),
    enabled: useArrayIncludes(["active", "finished"], roundStatus),
    initialData: { taps: 0, score: 0 },
  });
};

export const useRoundWinnerQuery = (
  id: Ref<string>,
  roundStatus: Ref<string | undefined>,
) => {
  return useQuery<RoundWinner | null>({
    queryKey: ["winner", id],
    queryFn: ({ signal }) => roundsAPI.getWinner(id.value, { signal }),
    enabled: () => roundStatus.value === "finished",
  });
};
