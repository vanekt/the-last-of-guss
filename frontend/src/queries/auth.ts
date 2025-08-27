import { useQuery, queryOptions } from "@tanstack/react-query";
import { authAPI } from "@/core/api";
import { getVerifyQueryOptions } from "@shared/frontend/queries/auth";

export const getVerifyQuery = (enabled: boolean) =>
  queryOptions(getVerifyQueryOptions(authAPI.verify, enabled));

export const useVerifyQuery = (enabled: boolean) => {
  return useQuery(getVerifyQuery(enabled));
};
