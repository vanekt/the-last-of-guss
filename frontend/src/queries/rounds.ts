import { useQuery, queryOptions } from "@tanstack/react-query";
import {
  getRoundsQueryOptions,
  getRoundQueryOptions,
  getRoundStatsQueryOptions,
  getRoundWinnerQueryOptions,
} from "@shared/frontend/queries/rounds";
import { roundsAPI } from "@/core/api";

export const useRoundsQuery = () => {
  return useQuery(queryOptions(getRoundsQueryOptions(roundsAPI.getRounds)));
};

export const useRoundQuery = (id: string) => {
  return useQuery(queryOptions(getRoundQueryOptions(roundsAPI.getRound, id)));
};

export const useRoundStatsQuery = (
  id: string,
  isRoundLoaded: boolean,
  roundStatus: string
) => {
  return useQuery(
    queryOptions(
      getRoundStatsQueryOptions(
        roundsAPI.getStats,
        id,
        isRoundLoaded,
        roundStatus
      )
    )
  );
};

export const useRoundWinnerQuery = (
  id: string,
  isRoundLoaded: boolean,
  roundStatus: string
) => {
  return useQuery(
    queryOptions(
      getRoundWinnerQueryOptions(
        roundsAPI.getWinner,
        id,
        isRoundLoaded,
        roundStatus
      )
    )
  );
};
