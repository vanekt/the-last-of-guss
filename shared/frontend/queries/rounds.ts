import type { QueryState } from "@tanstack/query-core";
import type { RoundWithStatus, RoundsResponse } from "@shared/types";
import type {
  GetRoundFn,
  GetRoundsFn,
  GetRoundStatsFn,
  GetRoundWinnerFn,
} from "@shared/frontend/core/api";

export const getRoundsQueryOptions = (getRoundsFn: GetRoundsFn) => {
  return {
    queryKey: ["rounds"],
    queryFn: getRoundsFn,
    select: (data: RoundsResponse) => data.items,
    refetchInterval: 10000,
  };
};

export const getRoundQueryOptions = (getRoundFn: GetRoundFn, id: string) => {
  return {
    queryKey: ["round", id],
    queryFn: () => getRoundFn(id),
    enabled: !!id,
    refetchInterval: ({ state }: { state: QueryState<RoundWithStatus> }) => {
      const { data, error } = state;

      if (error || data?.status.value === "finished") {
        return false;
      }

      return data?.status.timer || 1000;
    },
  };
};

export const getRoundStatsQueryOptions = (
  getStats: GetRoundStatsFn,
  id: string,
  isRoundLoaded: boolean,
  roundStatus: string
) => {
  return {
    queryKey: ["stats", id, roundStatus],
    queryFn: () => getStats(id),
    enabled:
      isRoundLoaded && ["active", "finished"].includes(String(roundStatus)),
    initialData: { taps: 0, score: 0 },
  };
};

export const getRoundWinnerQueryOptions = (
  getWinner: GetRoundWinnerFn,
  id: string,
  isRoundLoaded: boolean,
  roundStatus: string
) => {
  return {
    queryKey: ["winner", id],
    queryFn: () => getWinner(id),
    enabled: isRoundLoaded && roundStatus === "finished",
  };
};
