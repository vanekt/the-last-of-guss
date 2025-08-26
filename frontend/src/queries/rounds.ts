import { useQuery } from "@tanstack/react-query";
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
    enabled: !!id,
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
  isRoundLoaded: boolean,
  roundStatus: string
) => {
  return useQuery<RoundStats>({
    queryKey: ["stats", id, roundStatus],
    queryFn: () => roundsAPI.getStats(id),
    enabled:
      isRoundLoaded && ["active", "finished"].includes(String(roundStatus)),
    initialData: { taps: 0, score: 0 },
  });
};

export const useRoundWinnerQuery = (
  id: string,
  isRoundLoaded: boolean,
  roundStatus: string
) => {
  return useQuery<RoundWinner | null>({
    queryKey: ["winner", id],
    queryFn: () => roundsAPI.getWinner(id),
    enabled: isRoundLoaded && roundStatus === "finished",
  });
};
