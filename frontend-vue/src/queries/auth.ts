import { useQuery, queryOptions } from "@tanstack/vue-query";
import { getVerifyQueryOptions } from "@shared/frontend/queries/auth";
import { authAPI } from "@/core/api";

export const useVerifyQuery = (enabled: boolean) => {
  return useQuery(queryOptions(getVerifyQueryOptions(authAPI.verify, enabled)));
};
